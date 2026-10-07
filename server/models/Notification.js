import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['CLAIM', 'STATUS_CHANGE', 'CHAT', 'REWARD', 'ADMIN'],
    default: 'ADMIN'
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
