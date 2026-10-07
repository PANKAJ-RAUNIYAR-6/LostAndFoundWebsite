import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proofDescription: { type: String, required: true },
  proofImages: [{ type: String }],
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  adminNotes: { type: String, default: '' }
}, {
  timestamps: true
});

export const Claim = mongoose.models.Claim || mongoose.model('Claim', claimSchema);
export default Claim;
