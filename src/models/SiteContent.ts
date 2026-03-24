import mongoose from 'mongoose';

const SiteContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true, // e.g., 'hero', 'about', 'skills', 'footer'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);
