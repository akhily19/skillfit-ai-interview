import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, Share2, RotateCcw, CheckCircle, TrendingUp, Briefcase, User, Shield } from 'lucide-react';
import { GlassCard, ScoreRing, ClassificationBadge } from '../components/shared';

const SCORE_COLORS = {
  communication: '#6366f1',
  confidence: '#8b5cf6',
  skillRelevance: '#06b6d4',
  authenticity: '#10b981',
};

const SCORE_LABELS = {
  communication: 'Communication',
  confidence: 'Confidence',
  skillRelevance: 'Skill Relevance',
  authenticity: 'Authenticity',
};

const CLASSIFICATION_INFO = {
  'Job Ready': {
    color: 'emerald',
    emoji: '🚀',
    message: 'Congratulations! You are classified as Job Ready.',
    detail: 'You demonstrated strong communication, relevant skills, and genuine confidence. You will be shortlisted for immediate placement opportunities.',
    bg: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/30',
  },
  'Needs Training': {
    color: 'amber',
    emoji: '📈',
    message: 'You show great potential! Some upskilling recommended.',
    detail: 'You demonstrated positive attitude and relevant experience. Targeted skill training will help you qualify for better opportunities.',
    bg: 'from-amber-600/20 to-amber-600/5 border-amber-500/30',
  },
  'Manual Verification': {
    color: 'blue',
    emoji: '🔍',
    message: 'Your profile has been flagged for manual review.',
    detail: 'Our team will manually review your application. You may be contacted for an additional round.',
    bg: 'from-blue-600/20 to-blue-600/5 border-blue-500/30',
  },
  'Fraud Suspected': {
    color: 'red',
    emoji: '⚠️',
    message: 'Your application requires additional verification.',
    detail: 'Our system detected potential anomalies. Please contact the nearest Skill Mission centre with your ID proof.',
    bg: 'from-red-600/20 to-red-600/5 border-red-500/30',
  },
};

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [candidate, setCandidate] = useState({});
  const [animateScores, setAnimateScores] = useState(false);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('skillfit_result') || 'null');
    const c = JSON.parse(localStorage.getItem('skillfit_candidate') || '{}');
    if (!r) { navigate('/register'); return; }
    setResult(r);
    setCandidate(c);
    setTimeout(() => setAnimateScores(true), 500);
  }, []);

  if (!result) return null;

  const info = CLASSIFICATION_INFO[result.classification] || CLASSIFICATION_INFO['Manual Verification'];
  const fraudClean = result.fraudAnalysis?.riskLevel === 'clean' || result.fraudAnalysis?.riskScore < 20;

  return (
    <div className="min-h-screen bg-slate-950 grid-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 mb-4">
            <Award size={14} className="text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">Assessment Complete</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Your SkillFit Report</h1>
          <p className="text-slate-400 text-sm">Powered by GPT-4o · Generated {new Date().toLocaleDateString('en-IN')}</p>
        </motion.div>

        {/* Candidate info card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-5 mb-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold font-display text-lg flex-shrink-0">
              {(candidate.name || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-white text-lg">{candidate.name || 'Candidate'}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-xs text-slate-400 flex items-center gap-1"><User size={10} /> {candidate.district || 'Karnataka'}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Briefcase size={10} /> {candidate.skillCategory || 'General'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Application ID</p>
              <p className="font-mono text-xs text-indigo-400 font-bold">SKF-{Math.random().toString(36).slice(2,8).toUpperCase()}</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Classification Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <GlassCard className={`p-6 mb-4 bg-gradient-to-br ${info.bg} border`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{info.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <ClassificationBadge classification={result.classification} size="lg" />
                  <span className="text-xs text-slate-400 font-medium">
                    {Math.round(result.classificationConfidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-white font-semibold mb-1">{info.message}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{info.detail}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Overall Score + Score Rings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 mb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-white text-lg">Score Breakdown</h2>
              <div className="text-right">
                <p className="text-3xl font-display font-black text-white">{result.scores.overall}</p>
                <p className="text-xs text-slate-400">Overall Score</p>
              </div>
            </div>

            {/* Score Rings Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {Object.entries(SCORE_LABELS).map(([key, label]) => (
                <div key={key} className="flex flex-col items-center">
                  <ScoreRing
                    score={animateScores ? result.scores[key] : 0}
                    color={SCORE_COLORS[key]}
                    size={72}
                  />
                  <span className="text-xs text-slate-400 text-center mt-2 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Detailed score bars */}
            <div className="space-y-3">
              {Object.entries(SCORE_LABELS).map(([key, label]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400 font-medium">{label}</span>
                    <span className="text-xs font-bold font-display" style={{ color: SCORE_COLORS[key] }}>{result.scores[key]}/100</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.scores[key]}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-6 mb-4">
            <h2 className="font-display font-bold text-white text-lg mb-3">AI Assessment Summary</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
              "{result.aiSummary?.en || 'Assessment summary unavailable.'}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div>
                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Strengths</h3>
                <div className="space-y-1.5">
                  {(result.strengths || []).map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-xs">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Areas to improve */}
              <div>
                <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Areas to Improve</h3>
                <div className="space-y-1.5">
                  {(result.improvements || []).map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <TrendingUp size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-xs">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Job Recommendations */}
        {result.jobRecommendations?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard className="p-6 mb-4">
              <h2 className="font-display font-bold text-white text-lg mb-3">Recommended Roles</h2>
              <div className="flex flex-wrap gap-2">
                {result.jobRecommendations.map((role, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
                    {role}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">Percentile Rank:</span>
                <span className="text-xs font-bold text-cyan-400">Top {100 - (result.percentileRank || 60)}%</span>
                <span className="text-xs text-slate-500">in {candidate.skillCategory || 'your category'}</span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Fraud Indicators Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard className={`p-5 mb-6 border ${fraudClean ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
            <div className="flex items-center gap-3">
              <Shield size={20} className={fraudClean ? 'text-emerald-400' : 'text-red-400'} />
              <div>
                <p className={`font-semibold text-sm ${fraudClean ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fraudClean ? 'Identity Verification: Passed' : 'Identity Verification: Flagged'}
                </p>
                <p className="text-slate-400 text-xs">
                  Risk Score: {result.fraudAnalysis?.riskScore || 0}/100 · Level: {result.fraudAnalysis?.riskLevel || 'clean'}
                </p>
              </div>
              {fraudClean && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
            </div>
          </GlassCard>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-3">
          <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm">
            <Download size={16} /> Download Report
          </button>
          <button onClick={() => { localStorage.clear(); navigate('/'); }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm">
            <RotateCcw size={16} /> New Interview
          </button>
        </motion.div>

        <p className="text-center text-slate-600 text-xs mt-6 pb-4">
          This report is auto-generated by SkillFit AI · Karnataka Skill Development Mission · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
