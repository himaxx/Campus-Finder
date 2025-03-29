import mongoose from 'mongoose';

// Define schema for image model
const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  }
});

// Define schema for report model
const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found'],
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  landmark: String,
  latitude: Number,
  longitude: Number,
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  contactMethod: {
    type: String,
    required: true,
    enum: ['email', 'phone', 'inapp'],
  },
  contactInfo: String,
  userId: String,
  images: [ImageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the 'updatedAt' field on save
ReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Prevent mongoose OverwriteModelError when hot reloading in development
const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

export default Report; 