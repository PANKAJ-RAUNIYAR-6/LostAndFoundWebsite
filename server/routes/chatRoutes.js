import express from 'express';
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, startConversation);
router.get('/messages/:conversationId', protect, getMessages);
router.post('/messages', protect, sendMessage);

export default router;
