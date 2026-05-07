const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const { Interview, Assessment, FraudReport } = require('../models/models');
const { transcribeAudio, assessCandidate, detectFraud } = require('../services/aiService');
const { normalizeScores, classifyCandidate, getPercentileRank, getJobRecommendations } = require('../services/scoringEngine');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/analysis/process
 * Main AI pipeline: Transcription → Assessment → Fraud Detection → Classification
 */
router.post('/process', async (req, res) => {
  const startTime = Date.now();

  try {
    const { candidateId, interviewId, videoMetadata } = req.body;
    if (!candidateId) return res.status(400).json({ success: false, message: 'Candidate ID required' });

    // Update candidate status
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

    await Candidate.findByIdAndUpdate(candidateId, { status: 'processing' });

    // Get interview data
    const interview = await Interview.findOne({
      $or: [
        { _id: interviewId },
        { candidate: candidateId, status: 'completed' }
      ]
    });

    // Step 1: Simulate transcription of all answers
    const transcripts = [];
    if (interview && interview.questions.length > 0) {
      for (const q of interview.questions) {
        if (!q.transcript) {
          const result = await transcribeAudio(null, candidate.language);
          q.transcript = result.transcript;
          transcripts.push(result.transcript);
        } else {
          transcripts.push(q.transcript);
        }
      }
      await interview.save();
    } else {
      // Mock transcripts for demo
      transcripts.push(
        `My name is ${candidate.name}. I have experience in ${candidate.skillCategory}.`,
        `I have relevant skills and am passionate about this field.`,
        `Yes, I have worked in this sector for the past few years.`,
        `I am hardworking and dedicated, which makes me a strong candidate.`
      );
    }

    // Step 2: AI Assessment via GPT
    const assessment = await assessCandidate({
      name: candidate.name,
      transcripts,
      skillCategory: candidate.skillCategory,
      language: candidate.language
    });

    // Step 3: Normalize scores
    const normalizedScores = normalizeScores(assessment.scores);

    // Step 4: Fraud Detection
    const meta = videoMetadata || {
      facesDetected: Math.random() > 0.85 ? 2 : 1,
      avgBrightness: 80 + Math.random() * 60,
      avgDecibelLevel: 55 + Math.random() * 30,
      faceConsistency: 0.7 + Math.random() * 0.3
    };
    const fraudAnalysis = await detectFraud({
      videoMetadata: meta,
      candidateId,
      phone: candidate.phone
    });

    // Step 5: Classification
    const { classification, confidence, reason } = classifyCandidate(normalizedScores, fraudAnalysis.riskLevel);

    // Step 6: Additional enrichment
    const percentileRank = getPercentileRank(normalizedScores.overall, candidate.skillCategory);
    const jobRecommendations = getJobRecommendations(candidate.skillCategory, normalizedScores.overall);

    // Save Assessment to DB
    const savedAssessment = await Assessment.findOneAndUpdate(
      { candidate: candidateId },
      {
        candidate: candidateId,
        interview: interview?._id,
        scores: normalizedScores,
        fullTranscript: assessment.fullTranscript || transcripts.join('\n\n'),
        aiSummary: assessment.aiSummary,
        strengths: assessment.strengths,
        improvements: assessment.improvements,
        keyHighlights: assessment.keyHighlights,
        classification,
        classificationConfidence: confidence,
        modelVersion: assessment.modelVersion,
        processingTime: Date.now() - startTime,
        processedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Save Fraud Report
    await FraudReport.findOneAndUpdate(
      { candidate: candidateId },
      {
        candidate: candidateId,
        interview: interview?._id,
        indicators: fraudAnalysis.indicators,
        riskLevel: fraudAnalysis.riskLevel,
        riskScore: fraudAnalysis.riskScore
      },
      { upsert: true, new: true }
    );

    // Update candidate final status
    await Candidate.findByIdAndUpdate(candidateId, {
      status: 'assessed',
      classification,
      assessedAt: new Date()
    });

    res.json({
      success: true,
      processingTime: Date.now() - startTime,
      result: {
        scores: normalizedScores,
        classification,
        classificationConfidence: confidence,
        classificationReason: reason,
        aiSummary: assessment.aiSummary,
        strengths: assessment.strengths,
        improvements: assessment.improvements,
        keyHighlights: assessment.keyHighlights,
        fullTranscript: transcripts.join('\n\n'),
        percentileRank,
        jobRecommendations,
        fraudAnalysis: {
          riskLevel: fraudAnalysis.riskLevel,
          riskScore: fraudAnalysis.riskScore,
          indicators: fraudAnalysis.indicators
        }
      }
    });
  } catch (err) {
    console.error('Analysis pipeline error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analysis/:candidateId - Get assessment results
router.get('/:candidateId', authenticate, async (req, res) => {
  try {
    const [assessment, fraud] = await Promise.all([
      Assessment.findOne({ candidate: req.params.candidateId }),
      FraudReport.findOne({ candidate: req.params.candidateId })
    ]);

    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    res.json({ success: true, assessment, fraudReport: fraud });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analysis/fraud/reports (Admin)
router.get('/fraud/reports', authenticate, async (req, res) => {
  try {
    const { riskLevel, resolved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (riskLevel) filter.riskLevel = riskLevel;
    if (resolved !== undefined) filter.resolved = resolved === 'true';

    const [reports, total] = await Promise.all([
      FraudReport.find(filter)
        .populate('candidate', 'name phone district skillCategory language')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      FraudReport.countDocuments(filter)
    ]);

    res.json({ success: true, reports, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
