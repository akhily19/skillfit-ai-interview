const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Candidate = require('../models/Candidate');
const { Interview } = require('../models/models');
const { uploadVideo } = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

// POST /api/interviews/start
router.post('/start', async (req, res) => {
  try {
    const { candidateId } = req.body;
    if (!candidateId) return res.status(400).json({ success: false, message: 'Candidate ID required' });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

    const sessionId = uuidv4();
    const interview = await Interview.create({
      candidate: candidateId,
      sessionId,
      questions: [],
      status: 'in_progress'
    });

    await Candidate.findByIdAndUpdate(candidateId, {
      status: 'interview_started',
      interviewStartedAt: new Date()
    });

    res.status(201).json({
      success: true,
      sessionId,
      interviewId: interview._id,
      message: 'Interview session started'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/interviews/:sessionId/upload-answer
router.post('/:sessionId/upload-answer', uploadVideo.single('video'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, questionText, questionLanguage, duration } = req.body;

    const interview = await Interview.findOne({ sessionId });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview session not found' });

    const answerData = {
      questionId,
      questionText,
      questionLanguage: questionLanguage || 'English',
      duration: parseInt(duration) || 0,
      answeredAt: new Date(),
      transcript: ''
    };

    // If video file uploaded via Cloudinary
    if (req.file) {
      answerData.videoUrl = req.file.path;
      answerData.cloudinaryPublicId = req.file.filename;
    } else if (req.body.videoUrl) {
      answerData.videoUrl = req.body.videoUrl;
    }

    interview.questions.push(answerData);
    await interview.save();

    res.json({ success: true, message: 'Answer uploaded successfully', questionId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/interviews/:sessionId/complete
router.post('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { totalDuration, videoMetadata } = req.body;

    const interview = await Interview.findOneAndUpdate(
      { sessionId },
      {
        status: 'completed',
        totalDuration,
        videoMetadata: videoMetadata || {},
        completedAt: new Date()
      },
      { new: true }
    );

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    await Candidate.findByIdAndUpdate(interview.candidate, {
      status: 'interview_completed',
      interviewCompletedAt: new Date()
    });

    res.json({ success: true, interviewId: interview._id, message: 'Interview completed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/interviews (Admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const { candidateId, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (candidateId) filter.candidate = candidateId;
    if (status) filter.status = status;

    const [interviews, total] = await Promise.all([
      Interview.find(filter)
        .populate('candidate', 'name phone district skillCategory')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Interview.countDocuments(filter)
    ]);

    res.json({ success: true, interviews, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/interviews/candidate/:candidateId
router.get('/candidate/:candidateId', authenticate, async (req, res) => {
  try {
    const interview = await Interview.findOne({ candidate: req.params.candidateId, status: 'completed' })
      .populate('candidate', 'name phone district skillCategory language');
    if (!interview) return res.status(404).json({ success: false, message: 'No completed interview found' });
    res.json({ success: true, interview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
