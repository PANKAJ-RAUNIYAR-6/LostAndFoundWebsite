import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['LOST', 'FOUND'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  date: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['OPEN', 'CLAIM_PENDING', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  contactPhone: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  tags: [{ type: String }]
}, {
  timestamps: true
});

itemSchema.index({ title: 'text', description: 'text', location: 'text', category: 1, type: 1 });

export const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
export default Item;
