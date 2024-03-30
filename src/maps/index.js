export const calculateRoute = async (origin, dest) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:${dest}&origins=place_id:${origin}&mode=walking&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      return data.rows[0].elements[0].duration.value; //returns number of seconds to walk to dest
    } catch (error) {
      console.error('Error fetching data:', error);
      return { error: 'Internal Server Error' };
    }
} 