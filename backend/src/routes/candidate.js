const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const { authenticate } = require('../middleware/auth');

// POST /api/candidates/register
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number required'),
  body('district').trim().notEmpty().withMessage('District required'),
  body('skillCategory').notEmpty().withMessage('Skill category required'),
  body('language').isIn(['English', 'Hindi', 'Kannada']).withMessage('Valid language required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, phone, district, skillCategory, language } = req.body;

    // Check for duplicate phone (potential fraud signal)
    const existingCandidate = await Candidate.findOne({ phone });
    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        message: 'A candidate with this phone number is already registered',
        candidateId: existingCandidate._id,
        isDuplicate: true
      });
    }

    const candidate = await Candidate.create({
      name, phone, district, skillCategory, language,
      ipAddress: req.ip,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        platform: req.body.platform || 'web'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      candidate: {
        id: candidate._id,
        name: candidate.name,
        displayId: candidate.displayId,
        skillCategory: candidate.skillCategory,
        language: candidate.language
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/candidates (Admin only - with filters and pagination)
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1, limit = 20,
      district, classification, skillCategory, language, status,
      search, sort = '-registeredAt'
    } = req.query;

    const filter = {};
    if (district) filter.district = district;
    if (classification) filter.classification = classification;
    if (skillCategory) filter.skillCategory = skillCategory;
    if (language) filter.language = language;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    const [candidates, total] = await Promise.all([
      Candidate.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .select('-__v'),
      Candidate.countDocuments(filter)
    ]);

    res.json({
      success: true,
      candidates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/candidates/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('-__v');
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
    res.json({ success: true, candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/candidates/:id/notes (Admin - add recruiter notes)
router.patch('/:id/notes', authenticate, async (req, res) => {
  try {
    const { notes } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      {
        recruiterNotes: notes,
        reviewedBy: req.admin._id,
        reviewedAt: new Date(),
        status: 'reviewed'
      },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
    res.json({ success: true, candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/candidates/:id/status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
    res.json({ success: true, candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
