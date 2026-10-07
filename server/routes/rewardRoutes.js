import express from 'express';
import { getUserRewards, getAllRewardsAdmin, awardPoints } from '../controllers/rewardController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, getUserRewards);
router.get('/admin', protect, adminOnly, getAllRewardsAdmin);
router.post('/admin/award', protect, adminOnly, awardPoints);

export default router;
