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
    console.log(data);

    //console.log(data.rows[0].elements[0].duration.value);
    const roundedSeconds = Math.ceil(data.rows[0].elements[0].duration.value / 60) * 60;
    console.log(roundedSeconds);
    return roundedSeconds; //returns number of seconds to walk to dest
  } catch (error) {
    console.error('Error fetching data:', error);
    console.log(error);
    return { error: 'Internal Server Error' };
  }
} 

export const longLatToPlaceID = (longitude, latitude) => {
  const fetchData = async () => {
    const apiUrl = 'https://places.googleapis.com/v1/places:searchNearby';

    const requestData = {
        maxResultCount: 1,
        locationRestriction: {
            circle: {
                center: {
                    latitude: latitude,
                    longitude: longitude
                },
                radius: 100.0
            }
        }, 
        languageCode: "en"
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.id'
        },
        body: JSON.stringify(requestData)
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();

        // Extract Place ID from the response
        if (data && data.places && data.places.length > 0) {
            const placeId = data.places[0].id;
            //console.log(`Place ID: ${placeId}`);
            return placeId;
        } else {
            console.log('No results found');
            //console.log(data);
            return 0;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
  };

  return fetchData();

}