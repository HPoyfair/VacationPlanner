import { Router } from 'express';
import { appRoutes } from './app-routes.js';
import { weatherRoutes } from './weather-routes.js';

const router = Router();

router.use('/users', appRoutes);
router.use('/weather', weatherRoutes);

export default router;
