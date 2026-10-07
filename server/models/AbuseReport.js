import mongoose from 'mongoose';

const abuseReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  details: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

export const AbuseReport = mongoose.models.AbuseReport || mongoose.model('AbuseReport', abuseReportSchema);
export default AbuseReport;
