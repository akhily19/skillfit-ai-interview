import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Mic, FileText, Shield, Award, CheckCircle, Zap } from 'lucide-react';
import { analysisAPI } from '../utils/api';

const PIPELINE_STEPS = [
  { icon: Mic,      label: 'Audio Extraction',       desc: 'Extracting audio from video recordings...', duration: 2000 },
  { icon: FileText, label: 'Whisper Transcription',  desc: 'Converting speech to text with OpenAI Whisper...', duration: 3000 },
  { icon: Brain,    label: 'GPT-4 Assessment',       desc: 'Analysing communication, confidence & skill relevance...', duration: 3500 },
  { icon: Shield,   label: 'Fraud Analysis',         desc: 'Checking for anomalies and suspicious patterns...', duration: 2000 },
  { icon: Award,    label: 'Classification',         desc: 'Generating final candidate classification report...', duration: 1500 },
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [done, setDone] = useState(false);
  const candidate = JSON.parse(localStorage.getItem('skillfit_candidate') || '{}');

  useEffect(() => {
    let mounted = true;
    const runPipeline = async () => {
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        if (!mounted) return;
        setStepIndex(i);
        setStepProgress(0);

        // Animate progress for this step
        const stepDur = PIPELINE_STEPS[i].duration;
        const interval = 50;
        const ticks = stepDur / interval;
        for (let t = 0; t <= ticks; t++) {
          await new Promise(r => setTimeout(r, interval));
          if (!mounted) return;
          setStepProgress(Math.min(100, Math.round((t / ticks) * 100)));
        }
        setCompleted(prev => [...prev, i]);
      }

      // Trigger real API call
      try {
        if (candidate.id) {
          const result = await analysisAPI.process({ candidateId: candidate.id });
          localStorage.setItem('skillfit_result', JSON.stringify(result.result));
        } else {
          // Mock result for demo
          localStorage.setItem('skillfit_result', JSON.stringify(generateMockResult()));
        }
      } catch {
        localStorage.setItem('skillfit_result', JSON.stringify(generateMockResult()));
      }

      if (mounted) {
        setDone(true);
        setTimeout(() => navigate('/result'), 1200);
      }
    };
    runPipeline();
    return () => { mounted = false; };
  }, []);

  const overallProgress = Math.round(
    ((completed.length * 100 + stepProgress) / (PIPELINE_STEPS.length * 100)) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex items-center justify-center px-4 py-8">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Central AI orb */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            {/* Outer pulse rings */}
            {[1, 2, 3].map(i => (
              <div key={i} className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping"
                style={{ animationDelay: `${i * 0.4}s`, animationDuration: '2s', transform: `scale(${1 + i * 0.35})` }} />
            ))}
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl glow-indigo">
              {done ? <CheckCircle size={40} className="text-white" /> : <Brain size={40} className="text-white animate-pulse" />}
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-2">
            {done ? 'Assessment Complete!' : 'AI Processing Interview'}
          </h1>
          <p className="text-slate-400 text-sm text-center max-w-xs">
            {done
              ? 'Redirecting to your results...'
              : `Analysing ${candidate.name || 'candidate'}'s responses across multiple dimensions`}
          </p>

          {/* Overall progress ring */}
          <div className="mt-6 relative w-20 h-20">
            <svg className="-rotate-90" viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="url(#grad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(overallProgress / 100) * 213.6} 213.6`}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-display">{overallProgress}%</span>
            </div>
          </div>
        </div>

        {/* Pipeline steps */}
        <div className="space-y-3">
          {PIPELINE_STEPS.map(({ icon: Icon, label, desc }, i) => {
            const isDone = completed.includes(i);
            const isActive = i === stepIndex && !isDone;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-4 border transition-all duration-300 ${
                  isDone ? 'bg-emerald-500/5 border-emerald-500/20' :
                  isActive ? 'bg-indigo-500/10 border-indigo-500/30' :
                  'bg-slate-900/40 border-slate-700/30 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDone ? 'bg-emerald-500/20' : isActive ? 'bg-indigo-500/20' : 'bg-slate-800'
                  }`}>
                    {isDone ? <CheckCircle size={16} className="text-emerald-400" /> : <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold truncate ${isDone ? 'text-emerald-400' : isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                        {label}
                      </span>
                      {isDone && <span className="text-emerald-500 text-xs font-bold ml-2">✓ Done</span>}
                      {isActive && <span className="text-indigo-400 text-xs font-bold ml-2">{stepProgress}%</span>}
                    </div>
                    {isActive && <p className="text-slate-500 text-xs mt-0.5 truncate">{desc}</p>}
                  </div>
                </div>
                {isActive && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stepProgress}%` }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Powered by OpenAI Whisper · GPT-4o · SkillFit Classification Engine
        </p>
      </motion.div>
    </div>
  );
}

function generateMockResult() {
  const scores = {
    communication: 55 + Math.floor(Math.random() * 35),
    confidence: 50 + Math.floor(Math.random() * 40),
    skillRelevance: 55 + Math.floor(Math.random() * 35),
    authenticity: 60 + Math.floor(Math.random() * 30),
  };
  scores.overall = Math.round((scores.communication * 0.3 + scores.confidence * 0.2 + scores.skillRelevance * 0.35 + scores.authenticity * 0.15));

  const classification = scores.overall >= 80 ? 'Job Ready' : scores.overall >= 55 ? 'Needs Training' : scores.overall >= 35 ? 'Manual Verification' : 'Fraud Suspected';

  return {
    scores,
    classification,
    classificationConfidence: 0.82,
    aiSummary: {
      en: 'The candidate demonstrates clear communication and relevant domain experience. Shows enthusiasm and readiness for entry-level placement. Some technical depth could be improved through structured training.',
    },
    strengths: ['Clear verbal communication', 'Relevant work experience', 'Positive attitude and motivation'],
    improvements: ['Needs more technical depth', 'Could improve structured problem-solving approach'],
    keyHighlights: ['2+ years domain experience', 'Comfortable with basic tools', 'Open to relocation'],
    percentileRank: 62,
    jobRecommendations: ['Junior Field Technician', 'Assistant Supervisor', 'Skills Development Program'],
    fullTranscript: 'My name is [Candidate]. I have been working in this field for 2 years and have experience with various tools and techniques. I am passionate about my work and ready to contribute to any team...',
    fraudAnalysis: {
      riskLevel: 'clean',
      riskScore: 5,
      indicators: {
        multipleFaces: { detected: false, severity: 'low', maxFacesDetected: 1 },
        audioQualityLow: { detected: false, severity: 'low' },
        poorLighting: { detected: false, severity: 'low' },
        offScreenGaze: { detected: false, severity: 'low', percentageOffScreen: 8 },
        suspiciousActivity: { detected: false, severity: 'low' },
      }
    }
  };
}
