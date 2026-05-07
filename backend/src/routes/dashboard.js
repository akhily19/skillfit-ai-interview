const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const { Interview, Assessment, FraudReport } = require('../models/models');
const { authenticate } = require('../middleware/auth');

// GET /api/dashboard/stats - Main dashboard KPIs
router.get('/stats', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [
      totalCandidates, assessedToday, jobReady, needsTraining,
      manualVerification, fraudSuspected, activeInterviews,
      fraudReports, assessedThisWeek
    ] = await Promise.all([
      Candidate.countDocuments(),
      Candidate.countDocuments({ assessedAt: { $gte: today } }),
      Candidate.countDocuments({ classification: 'Job Ready' }),
      Candidate.countDocuments({ classification: 'Needs Training' }),
      Candidate.countDocuments({ classification: 'Manual Verification' }),
      Candidate.countDocuments({ classification: 'Fraud Suspected' }),
      Interview.countDocuments({ status: 'in_progress' }),
      FraudReport.countDocuments({ riskLevel: { $in: ['high', 'critical'] }, resolved: false }),
      Candidate.countDocuments({ assessedAt: { $gte: lastWeek } })
    ]);

    res.json({
      success: true,
      stats: {
        totalCandidates,
        assessedToday,
        jobReady,
        needsTraining,
        manualVerification,
        fraudSuspected,
        activeInterviews,
        pendingFraudAlerts: fraudReports,
        assessedThisWeek,
        successRate: totalCandidates > 0 ? Math.round((jobReady / totalCandidates) * 100) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/classification-breakdown
router.get('/classification-breakdown', authenticate, async (req, res) => {
  try {
    const breakdown = await Candidate.aggregate([
      { $match: { classification: { $ne: null } } },
      { $group: { _id: '$classification', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);
    res.json({ success: true, data: breakdown });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/skill-distribution
router.get('/skill-distribution', authenticate, async (req, res) => {
  try {
    const distribution = await Candidate.aggregate([
      { $group: { _id: '$skillCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: distribution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/language-usage
router.get('/language-usage', authenticate, async (req, res) => {
  try {
    const usage = await Candidate.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $project: { language: '$_id', count: 1, _id: 0 } }
    ]);
    res.json({ success: true, data: usage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/district-breakdown
router.get('/district-breakdown', authenticate, async (req, res) => {
  try {
    const breakdown = await Candidate.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 }, jobReady: { $sum: { $cond: [{ $eq: ['$classification', 'Job Ready'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
      { $project: { district: '$_id', total: '$count', jobReady: 1, _id: 0 } }
    ]);
    res.json({ success: true, data: breakdown });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/daily-registrations (last 30 days)
router.get('/daily-registrations', authenticate, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await Candidate.aggregate([
      { $match: { registeredAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' } },
          registrations: { $sum: 1 },
          assessed: { $sum: { $cond: [{ $eq: ['$status', 'assessed'] }, 1, 0] } }
        }
      },
      { $sort: { '_id': 1 } },
      { $project: { date: '$_id', registrations: 1, assessed: 1, _id: 0 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/avg-scores-by-category
router.get('/avg-scores-by-category', authenticate, async (req, res) => {
  try {
    const data = await Assessment.aggregate([
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidate',
          foreignField: '_id',
          as: 'candidateData'
        }
      },
      { $unwind: '$candidateData' },
      {
        $group: {
          _id: '$candidateData.skillCategory',
          avgOverall: { $avg: '$scores.overall' },
          avgCommunication: { $avg: '$scores.communication' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgOverall: -1 } },
      {
        $project: {
          category: '$_id',
          avgOverall: { $round: ['$avgOverall', 1] },
          avgCommunication: { $round: ['$avgCommunication', 1] },
          count: 1,
          _id: 0
        }
      }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
