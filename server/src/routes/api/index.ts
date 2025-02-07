import { Router } from 'express';
import { appRoutes } from './app-routes.js';
import { weatherRoutes } from './weather-routes.js';
import { placesRoutes } from './places-routes.js';

const router = Router();

router.use('/users', appRoutes);
router.use('/weather', weatherRoutes);
router.use('/places', placesRoutes);

export default router;
