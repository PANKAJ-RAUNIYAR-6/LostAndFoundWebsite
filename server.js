
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);


import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { connectDB, getDbStatus } from './server/config/db.js';
import { createApp } from './server/app.js';
import { setupSockets } from './server/sockets/socketHandler.js';
import { seedDefaultUsers } from './server/config/seedUsers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  // Connect to database
  await connectDB();

  // Seed default users when MongoDB is connected
  if (getDbStatus().connected) {
    await seedDefaultUsers();
  }

  // Create Express application
  const app = createApp();
  const httpServer = http.createServer(app);

  // Setup Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  setupSockets(io);

  // Development: Vite middleware
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve dist
    const distPath = path.resolve(__dirname, 'dist');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Start server
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`FindIt Lost & Found Platform is running on port ${PORT}`);
    console.log(`Mode: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer().catch(err => {
  console.error('Fatal server boot failure:', err);
  process.exit(1);
});