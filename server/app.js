import express from 'express';
import cors from 'cors';
import { getDbStatus } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import abuseReportRoutes from './routes/abuseReportRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

export const createApp = () => {
  const app = express();

  // Basic CORS & Parser Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health and System Status Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      time: new Date().toISOString(),
      database: getDbStatus()
    });
  });

  // REST API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/claims', claimRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/rewards', rewardRoutes);
  app.use('/api/abuse-reports', abuseReportRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/upload', uploadRoutes);

  // Centralized Error Handling Middleware
  app.use((err, req, res, next) => {
    console.error('[API Error]:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  });

  return app;
};

export default createApp;
