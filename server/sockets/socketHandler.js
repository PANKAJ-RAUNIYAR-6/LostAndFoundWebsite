export const setupSockets = (io) => {
  io.on('connection', (socket) => {
    // Join personal notification channel
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      if (conversationId) {
        socket.join(`conv_${conversationId}`);
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      if (conversationId) {
        socket.leave(`conv_${conversationId}`);
      }
    });

    // Real-time message exchange
    socket.on('send_message', (data) => {
      if (data && data.conversationId) {
        // Broadcast to all participants in this conversation
        io.to(`conv_${data.conversationId}`).emit('receive_message', data);
        if (data.recipientId) {
          io.to(`user_${data.recipientId}`).emit('new_notification', {
            type: 'CHAT',
            title: `New message from ${data.senderName || 'a user'}`,
            message: data.text
          });
        }
      }
    });

    // Real-time typing indicators
    socket.on('typing', ({ conversationId, userName, isTyping }) => {
      if (conversationId) {
        socket.to(`conv_${conversationId}`).emit('user_typing', { userName, isTyping });
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });
};
