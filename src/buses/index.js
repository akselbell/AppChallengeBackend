import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
dotenv.config();

const eastTimes = [];
const westTimes =[];
//Change variables here before sending script
const eastPath = process.env.EAST_PATH.toString();
const westPath = process.env.WEST_PATH.toString();

const readBusData = () => {
    fs.createReadStream(eastPath)
    .pipe(csv())                          
    .on('data', (row) => {               
        eastTimes.push(row);               
    })
    .on('end', () => {
        //console.log(eastTimes);
    });

    fs.createReadStream(westPath)
    .pipe(csv())                          
    .on('data', (row) => {                
        westTimes.push(row);              
    })
    .on('end', () => {                   
        //console.log(westTimes);
    });
};

const calcTimeToBus = (classStartTime, currentLocation, course) => {
    const stopToClass = googleMaps(currentLocation, course.location);
    return classStartTime - stopToClass - 8;
};

export default readBusData;
