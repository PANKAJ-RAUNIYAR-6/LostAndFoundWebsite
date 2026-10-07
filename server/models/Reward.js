import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  reason: { type: String, required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
}, {
  timestamps: true
});

export const Reward = mongoose.models.Reward || mongoose.model('Reward', rewardSchema);
export default Reward;
