import { Router } from 'express';

const mapsRouter = Router();

mapsRouter.get('maps/calculateRoute', async (req, res) => {
    //pluck out the important info from request and put them in the URL
    const url = `https://maps.googleapis.com/maps/api/distancematrix`;
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
})

export default mapsRouter;