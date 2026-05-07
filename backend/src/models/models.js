const mongoose = require('mongoose');

// ─── Interview Model ────────────────────────────────────────────
const interviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  questions: [{
    questionId: String,
    questionText: String,
    questionLanguage: String,
    videoUrl: String,
    cloudinaryPublicId: String,
    duration: Number, // in seconds
    answeredAt: Date,
    transcript: String
  }],
  totalDuration: Number, // total interview duration in seconds
  videoMetadata: {
    resolution: String,
    frameRate: Number,
    avgBrightness: Number,
    noiseLevel: String,
    facesDetected: Number,
    faceConsistency: Number // 0-1 score
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  completedAt: Date
}, { timestamps: true });

// ─── Assessment Model ───────────────────────────────────────────
const assessmentSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
    unique: true
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },

  // Score Breakdown (0-100 each)
  scores: {
    communication: { type: Number, min: 0, max: 100 },
    confidence: { type: Number, min: 0, max: 100 },
    skillRelevance: { type: Number, min: 0, max: 100 },
    authenticity: { type: Number, min: 0, max: 100 },
    overall: { type: Number, min: 0, max: 100 }
  },

  // Full AI Transcript
  fullTranscript: String,

  // AI-Generated Summaries (per language)
  aiSummary: {
    en: String,
    hi: String,
    kn: String
  },

  // Detailed AI Feedback
  strengths: [String],
  improvements: [String],
  keyHighlights: [String],

  // Classification
  classification: {
    type: String,
    enum: ['Job Ready', 'Needs Training', 'Manual Verification', 'Fraud Suspected'],
    required: true
  },

  // Confidence in classification (0-1)
  classificationConfidence: { type: Number, min: 0, max: 1 },

  // GPT Model Used
  modelVersion: { type: String, default: 'gpt-4o' },

  // Processing metadata
  processingTime: Number, // ms
  processedAt: { type: Date, default: Date.now }

}, { timestamps: true });

// ─── FraudReport Model ──────────────────────────────────────────
const fraudReportSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },

  // Fraud Indicators (each is a boolean + severity + details)
  indicators: {
    multipleFaces: {
      detected: { type: Boolean, default: false },
      severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      maxFacesDetected: { type: Number, default: 1 },
      timestamps: [Number] // video timestamps where multiple faces detected
    },
    audioQualityLow: {
      detected: { type: Boolean, default: false },
      severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      avgDecibelLevel: Number,
      noisePeriods: [{ start: Number, end: Number }]
    },
    duplicateCandidate: {
      detected: { type: Boolean, default: false },
      severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      matchedCandidateId: mongoose.Schema.Types.ObjectId,
      similarityScore: Number
    },
    suspiciousActivity: {
      detected: { type: Boolean, default: false },
      severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      details: [String]
    },
    poorLighting: {
      detected: { type: Boolean, default: false },
      severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      avgBrightnessScore: Number
    },
    offScreenGaze: {
      detected: { type: Boolean, default: false },
      severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      percentageOffScreen: Number
    }
  },

  // Overall Risk Assessment
  riskLevel: {
    type: String,
    enum: ['clean', 'low', 'medium', 'high', 'critical'],
    required: true
  },
  riskScore: { type: Number, min: 0, max: 100 }, // 0 = clean, 100 = critical

  // Resolution Status
  resolved: { type: Boolean, default: false },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  resolvedAt: Date,
  resolutionNotes: String

}, { timestamps: true });

// ─── Admin Model ────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  password: { type: String, required: true, minlength: 8 },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'reviewer', 'analyst'],
    default: 'reviewer'
  },
  department: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  avatar: String
}, { timestamps: true });

// Hide password in JSON output
adminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = {
  Interview: mongoose.model('Interview', interviewSchema),
  Assessment: mongoose.model('Assessment', assessmentSchema),
  FraudReport: mongoose.model('FraudReport', fraudReportSchema),
  Admin: mongoose.model('Admin', adminSchema)
};
