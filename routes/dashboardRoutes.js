import * as  Dashboard from '../controllers/dashboardController.js';
import express from 'express';

const router = express.Router();

router.get('/stats', Dashboard.getDashboardStats);

export default router;
