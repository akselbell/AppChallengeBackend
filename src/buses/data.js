import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
dotenv.config();

const eastTimes = [];
const westTimes = [];
let eastTimesSeconds = [];
let westTimesSeconds = [];
const eastPath = process.env.EAST_PATH.toString();
const westPath = process.env.WEST_PATH.toString();

const timeToSeconds = (hours, minutes) => {
    return (hours * 3600) + (minutes * 60);
}

const readBusData = () => {
    fs.createReadStream(eastPath)
        .pipe(csv())
        .on('data', (row) => {
            eastTimes.push(row);
        })
        .on('end', () => {
            fs.createReadStream(westPath)
                .pipe(csv())
                .on('data', (row) => {
                    westTimes.push(row);
                })
                .on('end', () => {
                    eastTimesSeconds = converter(eastTimes);
                    westTimesSeconds = converter(westTimes);
                });
        });
};

function converter(times) {
    const timesInSeconds = times.map(entry => {
        const time = entry['STOP'];
        const [hoursMinutes, period] = time.split(' ');
        let [hours, minutes] = hoursMinutes.split(':').map(Number);
        if (period === 'PM' && hours !== 12) {
            hours += 12; // Convert to 24-hour format
        }
        return timeToSeconds(hours, minutes);
    });
    return timesInSeconds;
}

export function getClosestBus(time, departingCampus) {
    let closestTime = null;
    let minDifference = Infinity;
    const timesArray = departingCampus == 'East' ? eastTimesSeconds : westTimesSeconds;
    console.log("You are currently on: " + departingCampus);

    timesArray.forEach(busTime => {
        const difference = time - busTime;
        if (difference < minDifference && difference >= 0) {
            minDifference = difference;
            closestTime = busTime;
        }
    });
    return closestTime;
}

export default readBusData;