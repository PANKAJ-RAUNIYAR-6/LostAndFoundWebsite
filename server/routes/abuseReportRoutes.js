import express from 'express';
import { createReport, getReportsAdmin, updateReportStatus } from '../controllers/abuseReportController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/admin', protect, adminOnly, getReportsAdmin);
router.put('/admin/:id/status', protect, adminOnly, updateReportStatus);

export default router;
