import express from 'express';

const router = express.Router();

// /places -- Get places details for a search location
router.get('/', async (req, res) => {
    const { lat, lon, type, radius } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;

    try {
        const response = await fetch(url);

        if (response.ok) {
            const results = await response.json();
            res.status(200).json(results);
            return;
        }

        res.status(500).json({ message: 'Failed to get places' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// /places/photo - Returns a photo URL for a given photo reference
router.get('/photo', async (req, res) => {
    const { photoReference, maxWidth } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

    try {
        const response = await fetch(url);

        if (response.ok) {
            res.status(200).json({ url: response.url });
            return;
        }

        res.status(500).json({ message: 'Failed to get photo' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export { router as placesRoutes };