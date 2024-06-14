import express from 'express';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';
import { getDashboardData } from '../Controllers/DashboardController.js';

const router = express.Router();

router.get('/data', authMiddleware, getDashboardData);

export default router;
