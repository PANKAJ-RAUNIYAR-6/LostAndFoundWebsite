import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;
