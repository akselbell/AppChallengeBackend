import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import coursesRouter from './courses/api.js';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const PORT = 80;

app.use('/api', coursesRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/getData/:netid', async (req, res) => {
    //const { netid } = req.params;
    // const url = `https://streamer.oit.duke.edu/ldap/people/netid/${netid}`;
    // try {
    //   const response = await fetch(url, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${process.env.API_KEY}`
    //     },
    //   });
    //   const data = await response.json();
    //   res.json(data);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // }
    const data = [{
        "ldapkey": "adc98b01-f5dc-44c1-b83e-998cf9870da9",
        "sn": "Bell",
        "givenName": "Aksel",
        "duid": "1234599",
        "netid": "adb117",
        "display_name": "Aksel Bell",
        "nickname": "Aksel",
        "primary_affiliation": "Student",
        "emails": [
          "aksel.bell@duke.edu"
        ],
        "url": "https://streamer.oit.duke.edu/ldap/people/adc98b01-f5dc-44c1-b83e-998cf9870da9"
      }]
    res.json(data);
  });