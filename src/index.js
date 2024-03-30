import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import coursesRouter from './courses/api.js';
import { calculateRoute } from './maps/index.js';
import bodyParser from 'body-parser';
import readBusData from './buses/data.js';
import calcTimeToBus from './buses/index.js';
import getClosestBus from './buses/data.js'
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
});

export const locations = {
  westBusStop: "ChIJ0UhDlq_mrIkR88gG4tqrCNw",
  eastBusStop: "ChIJf19QUwjkrIkReKb_L7AQnl8",
  "Biological Science": "ChIJeYjKW7DmrIkRJ9nXzx3hcfQ",
  "Marketplace": "ChIJV6yr2gnkrIkR2ZdV2qdFQV4"
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

app.get('/api/checktime', async (req, res) => {
  // req must have atttributes: classStartTime, courseLocation, currentCampus, currentLocation   
  const nextClass = calculateNextClass();
  const calculatedLeaveTime = calcTimeToBus(nextClass.startTime, req.courseLocation);
  const timeToBeAtCurrentStop = getClosestBus(calculatedLeaveTime, currentCampus);

  const nextStop = req.campus == 'East' ? "West" : "East";
  console.log("You are trying to get to " + nextStop + "bus stop");

  const timeToCurrentStop = calculateRoute(req.currentLocation, nextStop);
  const now = new Date(); // need to compute this in seconds since midnight

  if(now + timeToCurrentStop >= timeToBeAtCurrentStop) {
    res.status(200).json("Leave for class immediately!");
  }
});