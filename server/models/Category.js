import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: 'HelpCircle' },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
