import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  lastSeen: {
    type: Date,
    default: Date.now,
    index: { expires: '1m' } // Automatically delete if not seen for 1 minute
  },
  ip: String,
  userAgent: String
}, { timestamps: true });

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
