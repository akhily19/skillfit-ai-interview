import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MapPin, Phone, Briefcase, Globe, Video, FileText, Shield, Award, CheckCircle, AlertTriangle, Save, Edit3 } from 'lucide-react';
import AdminSidebar from '../../components/shared/AdminSidebar';
import { GlassCard, ScoreRing, ClassificationBadge } from '../../components/shared';

const MOCK_CANDIDATE = {
  _id: 'demo_candidate',
  name: 'Rajesh Kumar Gowda',
  phone: '9876543210',
  district: 'Bangalore Urban',
  skillCategory: 'IT & Technology',
  language: 'Kannada',
  classification: 'Job Ready',
  status: 'assessed',
  registeredAt: new Date(Date.now() - 86400000).toISOString(),
  assessedAt: new Date().toISOString(),
  recruiterNotes: '',
};

const MOCK_ASSESSMENT = {
  scores: { communication: 82, confidence: 78, skillRelevance: 88, authenticity: 85, overall: 84 },
  classification: 'Job Ready',
  classificationConfidence: 0.91,
  aiSummary: {
    en: 'Rajesh demonstrates strong communication skills in Kannada and shows clear domain expertise in IT. His confidence was high throughout and gave specific examples of past work. He is well-suited for junior developer or IT support roles.'
  },
  strengths: ['Clear technical communication', '3+ years of relevant IT experience', 'Confident and articulate responses', 'Specific project examples provided'],
  improvements: ['Could improve English proficiency', 'Lacks exposure to cloud technologies'],
  keyHighlights: ['Experience with web development', 'Worked at 2 IT companies', 'Willing to relocate'],
  fullTranscript: `Q1: ನನ್ನ ಹೆಸರು ರಾಜೇಶ್ ಕುಮಾರ್ ಗೌಡ. ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ 3 ವರ್ಷ IT ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೆಲಸ ಮಾಡಿದ್ದೇನೆ.
Q2: ನನಗೆ HTML, CSS, JavaScript ಮತ್ತು Python ತಿಳಿದಿದೆ. ನಾನು 2 ಕಂಪನಿಗಳಲ್ಲಿ ವೆಬ್ ಡೆವಲಪರ್ ಆಗಿ ಕೆಲಸ ಮಾಡಿದ್ದೇನೆ.
Q3: ಹಿಂದೆ TechSoft Pvt Ltd ನಲ್ಲಿ Junior Developer ಆಗಿ 2 ವರ್ಷ ಕೆಲಸ ಮಾಡಿದ್ದೇನೆ. ಅನಂತರ Startup ನಲ್ಲಿ 1 ವರ್ಷ ಕೆಲಸ ಮಾಡಿದ್ದೇನೆ.
Q4: ನಾನು ಕಠಿಣ ಪರಿಶ್ರಮ ಮಾಡುತ್ತೇನೆ ಮತ್ತು ಬೇಗ ಕಲಿಯುತ್ತೇನೆ. ನನ್ನ ಅನುಭವ ಮತ್ತು ಕೌಶಲ್ಯ ಈ ಹುದ್ದೆಗೆ ಸೂಕ್ತ.`,
  jobRecommendations: ['Junior Web Developer', 'IT Support Specialist', 'Digital Services Officer'],
  percentileRank: 78,
};

const MOCK_FRAUD = {
  riskLevel: 'clean',
  riskScore: 4,
  indicators: {
    multipleFaces: { detected: false, maxFacesDetected: 1 },
    audioQualityLow: { detected: false },
    poorLighting: { detected: false },
    offScreenGaze: { detected: false, percentageOffScreen: 6 },
    suspiciousActivity: { detected: false },
  }
};

const SCORE_COLORS = { communication: '#6366f1', confidence: '#8b5cf6', skillRelevance: '#06b6d4', authenticity: '#10b981' };

export function CandidateReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(MOCK_CANDIDATE);
  const [assessment, setAssessment] = useState(MOCK_ASSESSMENT);
  const [fraud, setFraud] = useState(MOCK_FRAUD);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await new Promise(r => setTimeout(r, 800));
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transcript', label: 'Transcript' },
    { id: 'fraud', label: 'Fraud Report' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-800/50" style={{ background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white font-display">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white">{candidate.name}</h1>
                <div className="flex items-center gap-3 mt-0.5">
                  <ClassificationBadge classification={assessment.classification} size="sm" />
                  <span className="text-slate-400 text-xs">ID: SKF-{id?.slice(-6).toUpperCase() || 'DEMO01'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Candidate Info */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {[
              { icon: MapPin, label: 'District', value: candidate.district },
              { icon: Phone, label: 'Phone', value: `+91 ${candidate.phone}` },
              { icon: Briefcase, label: 'Skill Area', value: candidate.skillCategory?.split(' & ')[0] },
              { icon: Globe, label: 'Language', value: candidate.language },
              { icon: Award, label: 'Percentile', value: `Top ${100 - assessment.percentileRank}%` },
            ].map(({ icon: Icon, label, value }, i) => (
              <GlassCard key={i} className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} className="text-indigo-400" />
                  <span className="text-slate-500 text-xs">{label}</span>
                </div>
                <p className="text-white text-sm font-semibold truncate">{value}</p>
              </GlassCard>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 border-b border-slate-800/50">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  activeTab === t.id ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Score Rings */}
              <GlassCard className="p-5 lg:col-span-1">
                <h3 className="font-display font-bold text-white mb-4">Score Breakdown</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center">
                    <ScoreRing score={assessment.scores.overall} size={96} color="#6366f1" />
                    <p className="text-slate-400 text-xs mt-2">Overall Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries({ communication: 'Comm.', confidence: 'Confid.', skillRelevance: 'Skill', authenticity: 'Auth.' }).map(([k, label]) => (
                    <div key={k} className="flex flex-col items-center">
                      <ScoreRing score={assessment.scores[k]} size={60} color={SCORE_COLORS[k]} />
                      <span className="text-xs text-slate-400 mt-1">{label}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Right column */}
              <div className="lg:col-span-2 space-y-4">
                {/* AI Summary */}
                <GlassCard className="p-5">
                  <h3 className="font-display font-bold text-white mb-3">AI Assessment Summary</h3>
                  <p className="text-slate-300 text-sm leading-relaxed italic mb-4">"{assessment.aiSummary.en}"</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Strengths</h4>
                      <div className="space-y-1.5">
                        {assessment.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-xs">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Improvements</h4>
                      <div className="space-y-1.5">
                        {assessment.improvements.map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <AlertTriangle size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-xs">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Recommendations */}
                <GlassCard className="p-5">
                  <h3 className="font-display font-bold text-white mb-3">Recommended Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {assessment.jobRecommendations.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium">{r}</span>
                    ))}
                  </div>
                </GlassCard>

                {/* Recruiter Notes */}
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-white flex items-center gap-2"><Edit3 size={16} /> Recruiter Notes</h3>
                    {notesSaved && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Saved</span>}
                  </div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add your assessment notes, observations, or follow-up actions here..."
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <button onClick={handleSaveNotes} disabled={savingNotes}
                    className="btn-brand mt-3 flex items-center gap-2 px-4 py-2 text-sm">
                    <Save size={14} /> {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Transcript Tab */}
          {activeTab === 'transcript' && (
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-indigo-400" />
                <h3 className="font-display font-bold text-white">Full Interview Transcript</h3>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/30">
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-body">{assessment.fullTranscript}</pre>
              </div>
              <p className="text-slate-500 text-xs mt-3">Transcribed by OpenAI Whisper · {candidate.language} · {new Date().toLocaleDateString('en-IN')}</p>
            </GlassCard>
          )}

          {/* Fraud Report Tab */}
          {activeTab === 'fraud' && (
            <div className="space-y-4">
              <GlassCard className={`p-5 border ${fraud.riskLevel === 'clean' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                <div className="flex items-center gap-4">
                  <Shield size={32} className={fraud.riskLevel === 'clean' ? 'text-emerald-400' : 'text-red-400'} />
                  <div>
                    <p className={`font-display font-bold text-xl ${fraud.riskLevel === 'clean' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fraud.riskLevel === 'clean' ? 'Identity Verified — No Issues Found' : `Risk Level: ${fraud.riskLevel.toUpperCase()}`}
                    </p>
                    <p className="text-slate-400 text-sm">Risk Score: {fraud.riskScore}/100</p>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'multipleFaces', label: 'Multiple Faces', detail: `Max faces detected: ${fraud.indicators.multipleFaces.maxFacesDetected}` },
                  { key: 'audioQualityLow', label: 'Audio Quality', detail: 'Audio level analysis' },
                  { key: 'poorLighting', label: 'Lighting Check', detail: 'Ambient brightness analysis' },
                  { key: 'offScreenGaze', label: 'Eye Contact', detail: `Off-screen: ${fraud.indicators.offScreenGaze.percentageOffScreen}%` },
                  { key: 'suspiciousActivity', label: 'Activity Check', detail: 'Behavioral analysis' },
                ].map(({ key, label, detail }) => {
                  const detected = fraud.indicators[key]?.detected;
                  return (
                    <GlassCard key={key} className={`p-4 border ${detected ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {detected ? <XCircle size={16} className="text-red-400" /> : <CheckCircle size={16} className="text-emerald-400" />}
                        <span className={`text-sm font-semibold ${detected ? 'text-red-300' : 'text-emerald-300'}`}>{label}</span>
                      </div>
                      <p className="text-slate-400 text-xs">{detail}</p>
                      <p className={`text-xs font-bold mt-2 ${detected ? 'text-red-400' : 'text-emerald-400'}`}>
                        {detected ? '⚠ DETECTED' : '✓ PASSED'}
                      </p>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Need to import XCircle for FraudReport indicators
import { XCircle } from 'lucide-react';

export default CandidateReview;
