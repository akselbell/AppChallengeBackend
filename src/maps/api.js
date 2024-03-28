import { Router } from 'express';

const mapsRouter = Router();

mapsRouter.get('/maps/calculateRoute', async (req, res) => {
    //pluck out the important info from request and put them in the URL
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&origins=40.6655101%2C-73.89188969999998&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    try {
        const response = await fetch(url, {
          method: 'POST',
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
})

export default mapsRouter;