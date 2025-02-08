import { Router } from 'express';
import { appRoutes } from './app-routes.js';
import { weatherRoutes } from './weather-routes.js';
import { placesRoutes } from './places-routes.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use('/users', authenticateToken, appRoutes);
router.use('/weather', weatherRoutes);
router.use('/places', placesRoutes);

export default router;
