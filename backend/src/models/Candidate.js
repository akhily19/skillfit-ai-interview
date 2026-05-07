const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  state: {
    type: String,
    default: 'Karnataka'
  },
  skillCategory: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: [
      'IT & Technology',
      'Construction & Civil',
      'Healthcare & Nursing',
      'Agriculture & Farming',
      'Retail & Sales',
      'Manufacturing',
      'Hospitality & Tourism',
      'Education & Teaching',
      'Logistics & Transport',
      'Textile & Apparel'
    ]
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['English', 'Hindi', 'Kannada'],
    default: 'English'
  },

  // Interview Status
  status: {
    type: String,
    enum: ['registered', 'interview_started', 'interview_completed', 'processing', 'assessed', 'reviewed'],
    default: 'registered'
  },

  // Classification Result
  classification: {
    type: String,
    enum: ['Job Ready', 'Needs Training', 'Manual Verification', 'Fraud Suspected', null],
    default: null
  },

  // Timestamps
  registeredAt: { type: Date, default: Date.now },
  interviewStartedAt: { type: Date },
  interviewCompletedAt: { type: Date },
  assessedAt: { type: Date },

  // Metadata
  deviceInfo: {
    userAgent: String,
    platform: String,
    browserName: String
  },
  ipAddress: String,

  // Recruiter Notes
  recruiterNotes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: Date,

}, { timestamps: true });

// Indexes for performance
candidateSchema.index({ phone: 1 });
candidateSchema.index({ district: 1 });
candidateSchema.index({ classification: 1 });
candidateSchema.index({ skillCategory: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ registeredAt: -1 });

// Virtual for full display
candidateSchema.virtual('displayId').get(function() {
  return `SKF-${this._id.toString().slice(-6).toUpperCase()}`;
});

candidateSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Candidate', candidateSchema);
