import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS for all routes

const PORT = 80;

app.get('/api/getData/:netid', async (req, res) => {
  const { netid } = req.params;
  const url = `https://streamer.oit.duke.edu/ldap/people/netid/${netid}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '829413a95f6d14b8aab1a7d026d8011d'
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
