import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to current origin
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      if (user?._id) {
        socketInstance.emit('join_user', user._id);
      }
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user?._id && connected) {
      socket.emit('join_user', user._id);
    }
  }, [socket, user, connected]);

  const joinConversation = (convId) => {
    if (socket && convId) {
      socket.emit('join_conversation', convId);
    }
  };

  const leaveConversation = (convId) => {
    if (socket && convId) {
      socket.emit('leave_conversation', convId);
    }
  };

  const sendSocketMessage = (data) => {
    if (socket) {
      socket.emit('send_message', data);
    }
  };

  const sendTyping = (convId, isTyping) => {
    if (socket && convId) {
      socket.emit('typing', {
        conversationId: convId,
        userName: user?.name || 'Someone',
        isTyping
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinConversation,
        leaveConversation,
        sendSocketMessage,
        sendTyping
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
