/**
 * SkillFit AI - Database Seed Script
 * Run: npm run seed
 * Creates default admin + sample candidates for demo
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const Candidate = require('../models/Candidate');
const { Interview, Assessment, FraudReport, Admin } = require('../models/models');

const DISTRICTS = ['Bangalore Urban','Bangalore Rural','Mysore','Hubli-Dharwad','Mangalore','Gulbarga','Bellary','Shimoga','Tumkur','Raichur','Bidar','Hassan'];
const SKILLS = ['IT & Technology','Construction & Civil','Healthcare & Nursing','Agriculture & Farming','Retail & Sales','Manufacturing','Hospitality & Tourism','Logistics & Transport'];
const LANGUAGES = ['English','Hindi','Kannada'];
const CLASSIFICATIONS = ['Job Ready','Needs Training','Manual Verification','Fraud Suspected'];
const NAMES = ['Rajesh Kumar','Priya Nair','Suresh Yadav','Anil Gowda','Meera Devi','Karthik Rao','Sunita Patil','Vijay Singh','Anitha Reddy','Mohan Sharma','Deepa Menon','Ravi Shastri','Kavitha Krishnamurthy','Sanjay Patel','Lakshmi Devi','Arjun Reddy','Pooja Singh','Rahul Verma','Nandini Gowda','Sameer Khan'];

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rndInt = (min, max) => min + Math.floor(Math.random() * (max - min));

async function seed() {
  try {
    console.log('\n🌱 Starting SkillFit AI Database Seed...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // ─── Clear existing data ───────────────────────────
    await Promise.all([
      Candidate.deleteMany({}),
      Interview.deleteMany({}),
      Assessment.deleteMany({}),
      FraudReport.deleteMany({}),
      Admin.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing collections');

    // ─── Create Admin ──────────────────────────────────
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
    const admin = await Admin.create({
      name: 'Admin Officer',
      email: process.env.ADMIN_EMAIL || 'admin@skillfit.gov.in',
      password: adminPassword,
      role: 'super_admin',
      department: 'Karnataka Skill Development Mission',
      isActive: true,
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // ─── Create sample reviewer ────────────────────────
    const reviewerPass = await bcrypt.hash('Reviewer@123', 12);
    await Admin.create({
      name: 'District Reviewer',
      email: 'reviewer@skillfit.gov.in',
      password: reviewerPass,
      role: 'reviewer',
      department: 'Bangalore Urban District Office',
      isActive: true,
    });
    console.log('✅ Reviewer account created');

    // ─── Create 50 Sample Candidates ──────────────────
    const candidateDocs = [];
    for (let i = 0; i < 50; i++) {
      const classification = rnd(CLASSIFICATIONS);
      const daysAgo = rndInt(0, 30);
      candidateDocs.push({
        name: NAMES[i % NAMES.length] + (i > 19 ? ` ${String.fromCharCode(65 + (i % 26))}` : ''),
        phone: `9${rndInt(100000000, 999999999)}`,
        district: rnd(DISTRICTS),
        state: 'Karnataka',
        skillCategory: rnd(SKILLS),
        language: rnd(LANGUAGES),
        status: 'assessed',
        classification,
        registeredAt: new Date(Date.now() - daysAgo * 86400000 - rndInt(0, 86400000)),
        interviewStartedAt: new Date(Date.now() - daysAgo * 86400000),
        interviewCompletedAt: new Date(Date.now() - daysAgo * 86400000 + 900000),
        assessedAt: new Date(Date.now() - daysAgo * 86400000 + 960000),
        ipAddress: `192.168.${rndInt(1,255)}.${rndInt(1,255)}`,
      });
    }
    const candidates = await Candidate.insertMany(candidateDocs);
    console.log(`✅ Created ${candidates.length} sample candidates`);

    // ─── Create Interviews + Assessments ──────────────
    let assessmentCount = 0;
    let fraudCount = 0;

    for (const candidate of candidates) {
      const sessionId = uuidv4();

      // Interview
      await Interview.create({
        candidate: candidate._id,
        sessionId,
        questions: [
          { questionId: 'q1', questionText: 'Please introduce yourself.', questionLanguage: candidate.language, duration: rndInt(30, 90), answeredAt: candidate.interviewStartedAt, transcript: `My name is ${candidate.name}. I have experience in ${candidate.skillCategory}.` },
          { questionId: 'q2', questionText: 'What are your main skills?', questionLanguage: candidate.language, duration: rndInt(30, 90), answeredAt: new Date(candidate.interviewStartedAt.getTime() + 120000), transcript: `I have worked in ${candidate.skillCategory} for several years.` },
          { questionId: 'q3', questionText: 'Describe your work experience.', questionLanguage: candidate.language, duration: rndInt(30, 90), answeredAt: new Date(candidate.interviewStartedAt.getTime() + 300000), transcript: `Previously I worked at a company in the same sector.` },
          { questionId: 'q4', questionText: 'Why should we select you?', questionLanguage: candidate.language, duration: rndInt(30, 90), answeredAt: new Date(candidate.interviewStartedAt.getTime() + 480000), transcript: `I am hardworking and dedicated to my work.` },
        ],
        totalDuration: rndInt(600, 1200),
        videoMetadata: {
          resolution: '720p',
          frameRate: 30,
          avgBrightness: rndInt(80, 160),
          avgDecibelLevel: rndInt(45, 75),
          facesDetected: Math.random() > 0.9 ? 2 : 1,
          faceConsistency: 0.7 + Math.random() * 0.28,
        },
        status: 'completed',
        completedAt: candidate.interviewCompletedAt,
      });

      // Generate scores based on classification
      let baseScore;
      if (candidate.classification === 'Job Ready') baseScore = rndInt(80, 97);
      else if (candidate.classification === 'Needs Training') baseScore = rndInt(52, 79);
      else if (candidate.classification === 'Manual Verification') baseScore = rndInt(32, 51);
      else baseScore = rndInt(10, 34);

      const variance = () => rndInt(-8, 8);
      const clamp = (v) => Math.min(100, Math.max(5, v));
      const scores = {
        communication: clamp(baseScore + variance()),
        confidence: clamp(baseScore + variance()),
        skillRelevance: clamp(baseScore + variance()),
        authenticity: clamp(baseScore + variance()),
        overall: baseScore,
      };

      await Assessment.create({
        candidate: candidate._id,
        scores,
        fullTranscript: `Q1: My name is ${candidate.name}...\nQ2: I have relevant skills in ${candidate.skillCategory}...\nQ3: I have worked in this field for several years...\nQ4: I am hardworking and dedicated.`,
        aiSummary: {
          en: `${candidate.name} demonstrates ${baseScore > 70 ? 'strong' : 'moderate'} proficiency in ${candidate.skillCategory}. Communication is ${scores.communication > 70 ? 'clear and articulate' : 'adequate'}. Overall performance suggests ${candidate.classification} classification.`,
        },
        strengths: ['Relevant domain experience', 'Positive attitude', 'Clear communication'],
        improvements: ['Technical depth', 'Structured answers'],
        keyHighlights: [`${rndInt(1,5)} years in ${candidate.skillCategory}`, 'Willing to work anywhere'],
        classification: candidate.classification,
        classificationConfidence: 0.75 + Math.random() * 0.2,
        modelVersion: 'gpt-4o-mock',
        processingTime: rndInt(8000, 15000),
        processedAt: candidate.assessedAt,
      });
      assessmentCount++;

      // Create fraud reports for fraud cases + some clean ones
      const isFraud = candidate.classification === 'Fraud Suspected';
      const hasAnyIndicator = isFraud || Math.random() < 0.15;

      if (hasAnyIndicator) {
        const riskScore = isFraud ? rndInt(55, 95) : rndInt(10, 40);
        let riskLevel;
        if (riskScore >= 70) riskLevel = 'critical';
        else if (riskScore >= 50) riskLevel = 'high';
        else if (riskScore >= 25) riskLevel = 'medium';
        else riskLevel = 'low';

        await FraudReport.create({
          candidate: candidate._id,
          indicators: {
            multipleFaces: { detected: isFraud && Math.random() > 0.5, severity: 'high', maxFacesDetected: isFraud ? 2 : 1 },
            audioQualityLow: { detected: Math.random() > 0.7, severity: 'medium' },
            poorLighting: { detected: Math.random() > 0.8, severity: 'low' },
            offScreenGaze: { detected: isFraud || Math.random() > 0.6, severity: isFraud ? 'high' : 'medium', percentageOffScreen: isFraud ? rndInt(30, 60) : rndInt(5, 25) },
            suspiciousActivity: { detected: isFraud && Math.random() > 0.4, severity: 'high', details: isFraud ? ['Inconsistent responses detected'] : [] },
          },
          riskLevel,
          riskScore,
          resolved: Math.random() > 0.7,
        });
        fraudCount++;
      }
    }

    console.log(`✅ Created ${assessmentCount} assessments`);
    console.log(`✅ Created ${fraudCount} fraud reports`);

    // ─── Summary ───────────────────────────────────────
    console.log('\n═══════════════════════════════════════════');
    console.log('  🎉 Database seeded successfully!');
    console.log('═══════════════════════════════════════════');
    console.log(`  📊 Total Candidates : ${candidates.length}`);
    console.log(`  🔐 Admin Email      : ${admin.email}`);
    console.log(`  🔑 Admin Password   : ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
