import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import coursesRouter from './courses/api.js';
import { calculateRoute, longLatToPlaceID } from './maps/index.js';
import bodyParser from 'body-parser';
import readBusData from './buses/data.js';
import calcTimeToBus from './buses/index.js';
import { getClosestBus } from './buses/data.js'
import { calculateNextClass } from './courses/api.js';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const PORT = 80;

app.use('/api', coursesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  readBusData();
  //longLatToPlaceID(-78.9386381, 36.0022893);
});

export const locations = {
  East: "ChIJ0UhDlq_mrIkR88gG4tqrCNw",
  West: "ChIJf19QUwjkrIkReKb_L7AQnl8",
  "Biological Science": "ChIJeYjKW7DmrIkRJ9nXzx3hcfQ",
  "Marketplace": "ChIJV6yr2gnkrIkR2ZdV2qdFQV4",
  "LSRC": "ChIJN8g9IwDnrIkR90U-FxHbKYw",
  "Biddle Music Building": "ChIJcQBAw_fjrIkRzuJO9NOGmrc",
};

app.get('/api/getData/:netid', async (req, res) => {
    const { netid } = req.params;
    const url = `https://streamer.oit.duke.edu/ldap/people?q=${netid}&access_token=${process.env.API_KEY}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/checktime', async (req, res) => {
  // req must have atttributes: course, currentCampus, longitude, latitude, netid  
  
  // if time now is not within 30 min of start time, just return response saying not time yet
  const nextStop = req.currentCampus == 'East' ? "West" : "East";
  console.log("You want to get to " + nextStop + " campus");
  const nextStopID = locations[`${nextStop}`];
  console.log(nextStopID);
  const currentStopID = locations[`${req.body.currentCampus}`];

  const nextClass = calculateNextClass(req.body.netid);

  const currentLocationPlaceID = await longLatToPlaceID(req.body.longitude, req.body.latitude);

  const courseLocationID = locations[`${nextClass.building}`];

  const calculatedLeaveTime = await calcTimeToBus(nextClass.startTime, courseLocationID, nextStopID);

  const timeToBeAtCurrentStop = getClosestBus(calculatedLeaveTime, req.body.currentCampus);

  const timeToCurrentStop = await calculateRoute(currentLocationPlaceID, currentStopID);
  
  const now = new Date();
  if(dateToSeconds(now) + timeToCurrentStop >= timeToBeAtCurrentStop-60) {
    res.status(200).json("NOW!");
  }
  else {
    const parsedTime = secondsToTime(timeToBeAtCurrentStop - 60 - timeToCurrentStop);
    res.status(200).json(parsedTime.hours + ":"+parsedTime.minutes + " "+ parsedTime.amPm);
  }
});

function dateToSeconds(now) {
  const currentTimeMs = now.getTime();

  // Create a new Date object for midnight (00:00:00)
  const midnight = new Date(now);
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);

  // Get the midnight time in milliseconds since Unix Epoch
  const midnightTimeMs = midnight.getTime();

  // Calculate the difference in milliseconds between current time and midnight
  const timeDifferenceMs = currentTimeMs - midnightTimeMs;

  // Convert milliseconds to seconds
  return Math.floor(timeDifferenceMs / 1000);
};

function secondsToTime(seconds) {
  //console.log(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const amPm = hours >= 12 ? 'PM' : 'AM';
  
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  
  return {
    hours: formattedHours,
    minutes: formattedMinutes,
    amPm: amPm
  };
}