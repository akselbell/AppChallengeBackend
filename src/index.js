import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import coursesRouter from './courses/api.js';
import mapsRouter from './maps/api.js';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const PORT = 80;

app.use('/api', coursesRouter);
app.use('api', mapsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/getData/:netid', async (req, res) => {
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