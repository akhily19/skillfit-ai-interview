/**
 * AI Service
 * Handles OpenAI Whisper transcription and GPT-4 assessment
 * Includes realistic mock responses for demo/prototype mode
 */

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (e) {
  console.warn('OpenAI not initialized - using mock mode');
}

// ─── Mock Transcripts (realistic) ──────────────────────────────
const mockTranscripts = {
  en: [
    "My name is Rajesh Kumar. I have completed my 10th standard education and have been working in the construction field for about 3 years. I am skilled in masonry, plastering, and basic carpentry work.",
    "I know how to use basic computer applications like MS Word and Excel. I also have experience in data entry work. I can type around 40 words per minute and have worked with government databases.",
    "Yes, I have worked before. I worked at a textile factory for 2 years where I was responsible for quality checking of fabrics. I also did retail sales for 1 year.",
    "I believe I should be selected because I am hardworking, punctual, and a quick learner. I have relevant experience in this field and I am ready to work in any location."
  ],
  hi: [
    "मेरा नाम सुरेश यादव है। मैंने 12वीं कक्षा पास की है और पिछले 2 साल से IT sector में काम कर रहा हूं।",
    "मुझे computer programming, data entry, और basic networking की जानकारी है। मैं Python और HTML भी जानता हूं।"
  ],
  kn: [
    "ನನ್ನ ಹೆಸರು ಅನಿಲ್ ಕುಮಾರ್. ನಾನು PUC ಮುಗಿಸಿದ್ದೇನೆ ಮತ್ತು ಕಳೆದ ಒಂದು ವರ್ಷದಿಂದ ಕೃಷಿ ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇನೆ.",
    "ನನಗೆ ಸಾವಯವ ಕೃಷಿ, ಹೊಲ ನಿರ್ವಹಣೆ ಮತ್ತು ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಯ ಬಗ್ಗೆ ಉತ್ತಮ ಜ್ಞಾನ ಇದೆ."
  ]
};

/**
 * Transcribe audio using OpenAI Whisper API
 * Falls back to realistic mock if API not available
 */
const transcribeAudio = async (audioBuffer, language = 'en') => {
  const startTime = Date.now();

  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: audioBuffer,
        model: 'whisper-1',
        language: language === 'kn' ? 'kn' : language === 'hi' ? 'hi' : 'en',
        response_format: 'json'
      });
      return {
        transcript: transcription.text,
        confidence: 0.95,
        processingTime: Date.now() - startTime,
        source: 'openai_whisper'
      };
    } catch (err) {
      console.error('Whisper API error, falling back to mock:', err.message);
    }
  }

  // Mock response (realistic for demo)
  await new Promise(r => setTimeout(r, 1500)); // Simulate processing
  const transcripts = mockTranscripts[language] || mockTranscripts['en'];
  const randomIdx = Math.floor(Math.random() * transcripts.length);
  return {
    transcript: transcripts[randomIdx],
    confidence: 0.88 + Math.random() * 0.1,
    processingTime: Date.now() - startTime,
    source: 'mock_whisper'
  };
};

/**
 * Assess candidate transcript using GPT-4
 * Returns structured scores and classification
 */
const assessCandidate = async ({ name, transcripts, skillCategory, language }) => {
  const startTime = Date.now();
  const fullTranscript = transcripts.join('\n\n');

  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: `You are an expert AI recruiter for a government workforce classification system in India. Assess candidates based on their video interview transcripts. Return ONLY valid JSON.`
        }, {
          role: 'user',
          content: `Assess this candidate for the "${skillCategory}" category.

Candidate Name: ${name}
Interview Language: ${language}
Full Transcript:
${fullTranscript}

Return this exact JSON structure:
{
  "scores": {
    "communication": <0-100>,
    "confidence": <0-100>,
    "skillRelevance": <0-100>,
    "authenticity": <0-100>,
    "overall": <0-100>
  },
  "classification": "<Job Ready|Needs Training|Manual Verification|Fraud Suspected>",
  "classificationConfidence": <0.0-1.0>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2"],
  "keyHighlights": ["highlight1", "highlight2"],
  "aiSummary": {
    "en": "Brief professional summary in English (2-3 sentences)",
    "hi": "Hindi summary",
    "kn": "Kannada summary"
  }
}`
        }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return {
        ...parsed,
        fullTranscript,
        processingTime: Date.now() - startTime,
        modelVersion: 'gpt-4o',
        source: 'openai_gpt4'
      };
    } catch (err) {
      console.error('GPT-4 API error, falling back to mock:', err.message);
    }
  }

  // Mock assessment (realistic)
  return generateMockAssessment({ name, skillCategory, fullTranscript, startTime });
};

/**
 * Generate realistic mock assessment scores
 */
const generateMockAssessment = async({ name, skillCategory, fullTranscript, startTime }) => {
  await new Promise(r => setTimeout(r, 2000));

  const baseScore = 45 + Math.floor(Math.random() * 45);
  const variance = () => Math.floor(Math.random() * 20) - 10;

  const communication = Math.min(100, Math.max(20, baseScore + variance()));
  const confidence = Math.min(100, Math.max(20, baseScore + variance()));
  const skillRelevance = Math.min(100, Math.max(20, baseScore + variance()));
  const authenticity = Math.min(100, Math.max(30, baseScore + variance() + 5));
  const overall = Math.round((communication + confidence + skillRelevance + authenticity) / 4);

  let classification, classificationConfidence;
  if (overall >= 80) {
    classification = 'Job Ready';
    classificationConfidence = 0.85 + Math.random() * 0.14;
  } else if (overall >= 55) {
    classification = 'Needs Training';
    classificationConfidence = 0.75 + Math.random() * 0.2;
  } else if (overall >= 35) {
    classification = 'Manual Verification';
    classificationConfidence = 0.65 + Math.random() * 0.2;
  } else {
    classification = 'Fraud Suspected';
    classificationConfidence = 0.8 + Math.random() * 0.15;
  }

  return {
    scores: { communication, confidence, skillRelevance, authenticity, overall },
    classification,
    classificationConfidence,
    strengths: [
      'Clear articulation of work experience',
      'Demonstrated relevant domain knowledge',
      'Positive attitude towards work'
    ],
    improvements: [
      'Could elaborate more on specific technical skills',
      'Should provide more quantifiable achievements'
    ],
    keyHighlights: [
      `${Math.floor(1 + Math.random() * 5)} years of experience in ${skillCategory}`,
      'Comfortable with basic tools and processes',
      'Expresses willingness to relocate'
    ],
    aiSummary: {
      en: `${name} demonstrates moderate proficiency in the ${skillCategory} domain. The candidate shows genuine enthusiasm and relevant work experience. Communication clarity is adequate for entry-level roles.`,
      hi: `${name} ने ${skillCategory} क्षेत्र में मध्यम दक्षता दिखाई है। उम्मीदवार उत्साही है और प्रासंगिक अनुभव रखता है।`,
      kn: `${name} ಅವರು ${skillCategory} ಕ್ಷೇತ್ರದಲ್ಲಿ ಮಧ್ಯಮ ಕೌಶಲ್ಯ ತೋರಿಸಿದ್ದಾರೆ.`
    },
    fullTranscript,
    processingTime: Date.now() - startTime,
    modelVersion: 'gpt-4o-mock',
    source: 'mock_gpt4'
  };
};

/**
 * Detect fraud indicators from video metadata
 */
const detectFraud = async ({ videoMetadata, candidateId, phone }) => {
  const indicators = {
    multipleFaces: {
      detected: videoMetadata.facesDetected > 1,
      severity: videoMetadata.facesDetected > 2 ? 'high' : videoMetadata.facesDetected > 1 ? 'medium' : 'low',
      maxFacesDetected: videoMetadata.facesDetected || 1
    },
    audioQualityLow: {
      detected: (videoMetadata.avgDecibelLevel || 60) < 40,
      severity: (videoMetadata.avgDecibelLevel || 60) < 30 ? 'high' : 'low',
      avgDecibelLevel: videoMetadata.avgDecibelLevel || 65
    },
    poorLighting: {
      detected: (videoMetadata.avgBrightness || 120) < 50,
      severity: (videoMetadata.avgBrightness || 120) < 30 ? 'high' : 'low',
      avgBrightnessScore: videoMetadata.avgBrightness || 120
    },
    offScreenGaze: {
      detected: (videoMetadata.faceConsistency || 0.9) < 0.6,
      severity: (videoMetadata.faceConsistency || 0.9) < 0.4 ? 'high' : 'medium',
      percentageOffScreen: Math.round((1 - (videoMetadata.faceConsistency || 0.9)) * 100)
    },
    suspiciousActivity: {
      detected: false,
      severity: 'low',
      details: []
    }
  };

  // Calculate risk score
  let riskScore = 0;
  if (indicators.multipleFaces.detected) riskScore += indicators.multipleFaces.severity === 'high' ? 40 : 20;
  if (indicators.audioQualityLow.detected) riskScore += 10;
  if (indicators.poorLighting.detected) riskScore += 10;
  if (indicators.offScreenGaze.detected) riskScore += indicators.offScreenGaze.severity === 'high' ? 25 : 15;

  let riskLevel;
  if (riskScore === 0) riskLevel = 'clean';
  else if (riskScore <= 15) riskLevel = 'low';
  else if (riskScore <= 35) riskLevel = 'medium';
  else if (riskScore <= 55) riskLevel = 'high';
  else riskLevel = 'critical';

  return { indicators, riskLevel, riskScore };
};

module.exports = { transcribeAudio, assessCandidate, detectFraud };
