import { Router } from 'express';
import { appRoutes } from './app-routes.js';

const router = Router();

router.use('/users', appRoutes);

export default router;
