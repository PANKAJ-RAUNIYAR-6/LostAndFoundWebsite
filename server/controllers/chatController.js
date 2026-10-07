import dbService from '../services/dbService.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await dbService.findConversationsForUser(req.user._id);
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations.' });
  }
};

export const startConversation = async (req, res) => {
  try {
    const { recipientId, itemId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'Recipient user ID is required.' });
    }

    if (String(recipientId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot chat with yourself.' });
    }

    const conversation = await dbService.createOrGetConversation(req.user._id, recipientId, itemId);
    const populated = await dbService.findConversationById(conversation._id);

    res.json({ success: true, conversation: populated || conversation });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate conversation.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversation = await dbService.findConversationById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const isParticipant = conversation.participants.some(p => {
      const pid = p._id || p;
      return String(pid) === String(req.user._id);
    });

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this conversation.' });
    }

    const messages = await dbService.getMessages(req.params.conversationId);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve chat messages.' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    if (!conversationId || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Conversation ID and message text are required.' });
    }

    const conversation = await dbService.findConversationById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const isParticipant = conversation.participants.some(p => {
      const pid = p._id || p;
      return String(pid) === String(req.user._id);
    });

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const message = await dbService.createMessage({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim()
    });

    // Notify other participant via in-app notification if needed
    const otherParticipant = conversation.participants.find(p => {
      const pid = p._id || p;
      return String(pid) !== String(req.user._id);
    });

    if (otherParticipant) {
      const recipientId = otherParticipant._id || otherParticipant;
      await dbService.createNotification({
        user: recipientId,
        title: `Message from ${req.user.name}`,
        message: text.slice(0, 80),
        type: 'CHAT',
        link: '/chat'
      });
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
