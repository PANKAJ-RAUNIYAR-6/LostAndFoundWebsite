import express from 'express';
import {
  createClaim,
  getMyClaims,
  updateClaimStatus,
  getAllClaimsAdmin
} from '../controllers/claimController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/my', protect, getMyClaims);
router.put('/:id/status', protect, updateClaimStatus);
router.get('/admin', protect, adminOnly, getAllClaimsAdmin);

export default router;
