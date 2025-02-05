import Auth from '../utils/auth'

// Get latitude and longitude for a given location
const getCoordinates = async (location:string) => {
    const url = '/api/weather/location?q=' + location;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            }
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }

        const results = await response.json();

        return results;
    } catch (err) {
        console.log('Error from getCoordinates: ', err);
        return Promise.reject(err);
    }
};

// Get the weather conditions for a given location and date
const getWeather = async (lat:number, lon:number, date:string) => {
    const url = `/api/weather/?lat=${lat}&lon=${lon}&date=${date}`;

    try {
        const response = await fetch(url, {            
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            }            
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }
    
        const responseData = await response.json();
    
        return responseData;
    } catch (err) {
        console.log('Error from getWeather: ', err);
        return Promise.reject(err);
    }
}

export { getCoordinates, getWeather };