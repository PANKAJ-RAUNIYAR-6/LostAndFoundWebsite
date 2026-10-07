import express from 'express';
import { createFeedback, getFeedbacks } from '../controllers/feedbackController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getFeedbacks);
router.post('/', protect, createFeedback);

export default router;
