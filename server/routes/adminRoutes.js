// import express from 'express';
// import {
//   getStats,
//   getUsers,
//   updateUserStatus,
//   deleteUser,
//   getActivityLogs
// } from '../controllers/adminController.js';
// import { protect, adminOnly } from '../middleware/auth.js';

// const router = express.Router();

// router.use(protect, adminOnly);

// router.get('/stats', getStats);
// router.get('/users', getUsers);
// router.put('/users/:id/status', updateUserStatus);
// router.delete('/users/:id', deleteUser);
// router.get('/activity-logs', getActivityLogs);

// export default router;


import express from 'express';

import {
  getStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getActivityLogs
} from '../controllers/adminController.js';

import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public stats route for Home page
router.get('/stats', getStats);

// All other admin routes remain protected
router.use(protect, adminOnly);

router.get('/users', getUsers);

router.put('/users/:id/status', updateUserStatus);

router.delete('/users/:id', deleteUser);

router.get('/activity-logs', getActivityLogs);

export default router;