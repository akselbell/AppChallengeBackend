import { Router } from 'express';

const mapsRouter = Router();

mapsRouter.get('/maps/calculateRoute', async (req, res) => {
    // origin/dest must be in the form of a place ID, an address, or latitude/longitude coordinates
    const origin = req.body.origin; 
    const dest = req.body.dest;
    const mode = req.body.mode;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:${dest}&origins=place_id:${origin}&mode=${mode}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
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