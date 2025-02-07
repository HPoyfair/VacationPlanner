import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

// /weather/location -- Get latitude and longitude for a given location
router.get('/location', async (req: Request, res: Response) => {
    const { q } = req.query;
    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${apiKey}`;

    try {
        // Call the geo request API to get the latitude and longitude of the location
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }

        const results = await response.json();

        if (results && results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//  /weather -- Get weather details for a search location and date
router.get('/', async (req: Request, res: Response) => {
    const { lat, lon, date } = req.query;
    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

    try {
        // Call the weather request API to get the weather details for the location and date
        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=${date}&units=imperial&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            throw new Error(`${errorData.message}`);
        }

        res.status(200).json(await weatherResponse.json());
    } catch (err) {
        res.status(500).json(err);
    }
});

export { router as weatherRoutes };