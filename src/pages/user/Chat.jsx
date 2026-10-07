import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, Package, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSocket } from '../../contexts/SocketContext.jsx';
import api from '../../services/api.js';

export const Chat = () => {
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation, sendSocketMessage, sendTyping } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch all conversations for user
  const loadConversations = async () => {
    try {
      const res = await api.getConversations();
      if (res.success && res.conversations) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !activeConv) {
          setActiveConv(res.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // When active conversation changes, join room and fetch messages
  useEffect(() => {
    if (!activeConv) return;

    joinConversation(activeConv._id);

    const loadMessages = async () => {
      try {
        const res = await api.getMessages(activeConv._id);
        if (res.success && res.messages) {
          setMessages(res.messages);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();

    return () => {
      leaveConversation(activeConv._id);
    };
  }, [activeConv?._id]);

  // Listen to socket events for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msgData) => {
      if (activeConv && String(msgData.conversationId) === String(activeConv._id)) {
        setMessages((prev) => [...prev, {
          _id: msgData._id || `msg_${Date.now()}`,
          conversation: msgData.conversationId,
          sender: { _id: msgData.senderId, name: msgData.senderName, profileImage: msgData.senderAvatar },
          text: msgData.text,
          createdAt: msgData.createdAt || new Date().toISOString()
        }]);
      }
      loadConversations();
    };

    const handleUserTyping = ({ userName, isTyping }) => {
      if (isTyping) {
        setTypingUser(userName);
      } else {
        setTypingUser(null);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, activeConv?._id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (activeConv) {
      sendTyping(activeConv._id, true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(activeConv._id, false);
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const text = inputText.trim();
    setInputText('');
    sendTyping(activeConv._id, false);

    try {
      const res = await api.sendMessage(activeConv._id, text);
      if (res.success && res.message) {
        const partner = activeConv.participants.find(p => String(p._id) !== String(user._id));
        const partnerId = partner ? partner._id : null;

        // Broadcast to socket
        sendSocketMessage({
          conversationId: activeConv._id,
          senderId: user._id,
          senderName: user.name,
          senderAvatar: user.profileImage,
          recipientId: partnerId,
          text,
          createdAt: res.message.createdAt
        });

        setMessages((prev) => [...prev, res.message]);
        loadConversations();
      }
    } catch (err) {
      alert(err.message || 'Failed to send message.');
    }
  };

  const getPartner = (conv) => {
    return conv.participants?.find(p => String(p._id) !== String(user?._id)) || {};
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={24} color="#2563eb" /> Real-Time Chat &amp; Recovery Coordination
        </h2>
        <p className="lead" style={{ fontSize: '0.875rem', margin: 0 }}>
          Communicate directly with item owners and finders via live Socket.IO connection.
        </p>
      </div>

      <div className="chat-container">
        {/* Sidebar: Conversation List */}
        <div className="chat-sidebar">
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
            Conversations ({conversations.length})
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No active conversations yet. Click "Contact Reporter" on an item listing to start chatting!
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = getPartner(conv);
                const isActive = activeConv?._id === conv._id;

                return (
                  <div
                    key={conv._id}
                    className={`chat-conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveConv(conv)}
                  >
                    <img
                      src={partner.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={partner.name || 'User'}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {partner.name || 'Community Member'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {conv.lastMessage || (conv.item ? `Discussing: ${conv.item.title}` : 'Started a conversation')}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main: Message History & Input */}
        <div className="chat-main">
          {activeConv ? (
            <>
              {/* Header */}
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={getPartner(activeConv).profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt="Partner"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      {getPartner(activeConv).name || 'User'}
                    </div>
                    {activeConv.item && (
                      <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>
                        Ref: {activeConv.item.title} ({activeConv.item.type})
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto', fontSize: '0.875rem' }}>
                    Send a message to introduce yourself and coordinate recovery.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isSent = String(m.sender?._id || m.sender) === String(user?._id);
                    return (
                      <div key={m._id} className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
                        <div>{m.text}</div>
                        <span className="message-time">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}

                {typingUser && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', padding: '0 0.5rem' }}>
                    {typingUser} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={handleInputChange}
                  style={{ borderRadius: '9999px' }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: '9999px', padding: '0.625rem 1rem' }}
                  disabled={!inputText.trim()}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <div style={{ fontWeight: 600 }}>Select a conversation to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
