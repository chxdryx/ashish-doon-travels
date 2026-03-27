import { config } from '@maptiler/sdk';

// APNI MAPTILER KEY YAHAN DALO
const MAPTILER_KEY = 'CVP0ZS2XmirwdZIU9VUA'; // <---; 
config.apiKey = MAPTILER_KEY;

export const getRouteData = async (startLng, startLat, endLng, endLat) => {
    const url = `https://api.maptiler.com/navigation/routing/v2/driving/${startLng},${startLat};${endLng},${endLat}?key=${MAPTILER_KEY}&alternatives=false&geometries=geojson`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            return {
                distance: Math.round(data.routes[0].distance / 1000), // Meters to KM
                geometry: data.routes[0].geometry,
                duration: Math.round(data.routes[0].duration / 60) // Seconds to Minutes
            };
        }
        return null;
    } catch (error) {
        console.error("MapTiler Route Error:", error);
        return null;
    }
};