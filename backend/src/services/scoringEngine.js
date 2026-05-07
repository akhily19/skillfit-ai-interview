/**
 * Scoring Engine Service
 * Implements classification logic and score normalization
 */

/**
 * Classify candidate based on overall score
 * Business Logic:
 *   score >= 80        → Job Ready
 *   score 50-79        → Needs Training
 *   score 30-49        → Manual Verification
 *   score < 30 OR fraud → Fraud Suspected
 */
const classifyCandidate = (scores, fraudRiskLevel) => {
  const { overall, authenticity } = scores;

  // Fraud override
  if (fraudRiskLevel === 'critical' || fraudRiskLevel === 'high') {
    return {
      classification: 'Fraud Suspected',
      confidence: 0.92,
      reason: 'High fraud risk indicators detected'
    };
  }

  // Low authenticity override
  if (authenticity < 30) {
    return {
      classification: 'Fraud Suspected',
      confidence: 0.78,
      reason: 'Authenticity score critically low'
    };
  }

  if (overall >= 80) {
    return {
      classification: 'Job Ready',
      confidence: 0.85 + (overall - 80) * 0.0075,
      reason: 'Candidate meets all competency benchmarks'
    };
  }

  if (overall >= 50) {
    return {
      classification: 'Needs Training',
      confidence: 0.75 + Math.random() * 0.15,
      reason: 'Candidate shows potential but requires upskilling'
    };
  }

  if (overall >= 30) {
    return {
      classification: 'Manual Verification',
      confidence: 0.65 + Math.random() * 0.2,
      reason: 'Insufficient data for automated classification'
    };
  }

  return {
    classification: 'Fraud Suspected',
    confidence: 0.80,
    reason: 'Score below minimum threshold'
  };
};

/**
 * Normalize raw scores from different assessment passes
 */
const normalizeScores = (rawScores) => {
  const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(val)));

  const normalized = {
    communication: clamp(rawScores.communication),
    confidence: clamp(rawScores.confidence),
    skillRelevance: clamp(rawScores.skillRelevance),
    authenticity: clamp(rawScores.authenticity)
  };

  // Weighted overall score
  normalized.overall = clamp(
    normalized.communication * 0.3 +
    normalized.confidence * 0.2 +
    normalized.skillRelevance * 0.35 +
    normalized.authenticity * 0.15
  );

  return normalized;
};

/**
 * Generate percentile rank for a score
 */
const getPercentileRank = (score, category) => {
  // Mock distribution based on historical data
  const distributions = {
    'IT & Technology': { mean: 62, std: 15 },
    'Construction & Civil': { mean: 55, std: 18 },
    'Healthcare & Nursing': { mean: 60, std: 14 },
    'Agriculture & Farming': { mean: 50, std: 20 },
    'Retail & Sales': { mean: 58, std: 16 },
    default: { mean: 57, std: 17 }
  };

  const dist = distributions[category] || distributions.default;
  const z = (score - dist.mean) / dist.std;
  const percentile = Math.round(normalCDF(z) * 100);
  return Math.min(99, Math.max(1, percentile));
};

// Normal CDF approximation
const normalCDF = (z) => {
  const a = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly = a * (0.319381530 + a * (-0.356563782 + a * (1.781477937 + a * (-1.821255978 + a * 1.330274429))));
  const result = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
  return z >= 0 ? result : 1 - result;
};

/**
 * Recommended job roles based on skill category and score
 */
const getJobRecommendations = (skillCategory, overall) => {
  const jobMap = {
    'IT & Technology': {
      high: ['Junior Software Developer', 'IT Support Technician', 'Data Entry Operator'],
      medium: ['Computer Operator', 'Digital Marketing Assistant', 'BPO Executive'],
      low: ['IT Literacy Training Program', 'Digital Skills Workshop']
    },
    'Construction & Civil': {
      high: ['Site Supervisor', 'Quality Inspector', 'Junior Civil Engineer Trainee'],
      medium: ['Mason Helper', 'Carpenter', 'Plumber'],
      low: ['Basic Construction Skills Training', 'Safety Induction Program']
    },
    'Healthcare & Nursing': {
      high: ['Nursing Assistant', 'Hospital Attendant', 'Paramedic Support'],
      medium: ['Home Care Worker', 'Health Worker', 'Pharmacy Assistant'],
      low: ['Healthcare Support Training', 'First Aid Certification']
    },
    default: {
      high: ['Entry Level Professional', 'Skilled Worker'],
      medium: ['Semi-Skilled Worker', 'Apprentice'],
      low: ['Skill Development Program']
    }
  };

  const category = jobMap[skillCategory] || jobMap.default;
  if (overall >= 75) return category.high;
  if (overall >= 50) return category.medium;
  return category.low;
};

module.exports = {
  classifyCandidate,
  normalizeScores,
  getPercentileRank,
  getJobRecommendations
};
