import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Video, Mic, Shield, BarChart3, Users, ChevronRight,
  Play, Globe, Zap, Award, ArrowRight, CheckCircle, Star,
  TrendingUp, Lock, Cpu, Eye, FileText, Activity
} from 'lucide-react';
import { AnimatedNumber } from '../components/shared';

const STATS = [
  { value: 48000, label: 'Candidates Assessed', suffix: '+' },
  { value: 94,    label: 'Assessment Accuracy', suffix: '%' },
  { value: 12,    label: 'Districts Covered', suffix: '' },
  { value: 3,     label: 'Languages Supported', suffix: '' },
];

const FEATURES = [
  { icon: Video, title: 'Video Interview AI', desc: 'Fully automated video interview with AI-driven question flow and real-time facial analysis', color: 'indigo' },
  { icon: Mic, title: 'Multilingual Support', desc: 'Supports Kannada, Hindi, and English with Whisper-powered transcription', color: 'purple' },
  { icon: Brain, title: 'GPT-4 Assessment', desc: 'Deep language model analysis scores communication, confidence, and skill relevance', color: 'cyan' },
  { icon: Shield, title: 'Fraud Detection', desc: 'Real-time multi-face detection, audio analysis, and duplicate candidate flagging', color: 'emerald' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'District-wise, category-wise, and language-wise workforce intelligence insights', color: 'amber' },
  { icon: Zap, title: 'Instant Classification', desc: 'Job Ready, Needs Training, Manual Review, or Fraud — classified in minutes', color: 'rose' },
];

const WORKFLOW_STEPS = [
  { n: '01', title: 'Register', desc: 'Candidate enters basic details, district, and skill category on mobile', icon: Users },
  { n: '02', title: 'Select Language', desc: 'Choose from Kannada, Hindi, or English for personalized assessment', icon: Globe },
  { n: '03', title: 'AI Interview', desc: 'AI avatar conducts structured video interview with 4 key questions', icon: Video },
  { n: '04', title: 'Processing', desc: 'Whisper transcribes audio; GPT-4 evaluates competency across 4 dimensions', icon: Brain },
  { n: '05', title: 'Classification', desc: 'Candidate classified and report generated for recruiter review', icon: Award },
];

const CLASSIFICATIONS = [
  { label: 'Job Ready', desc: 'Score ≥ 80', color: 'emerald', pct: '31%' },
  { label: 'Needs Training', desc: 'Score 50–79', color: 'amber', pct: '44%' },
  { label: 'Manual Review', desc: 'Score 30–49', color: 'blue', pct: '18%' },
  { label: 'Fraud Suspected', desc: 'Anomaly detected', color: 'red', pct: '7%' },
];

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  cyan:   'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  emerald:'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  amber:  'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
  rose:   'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl float-element" />
        <div className="absolute top-60 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl float-element" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-cyan-600/8 rounded-full blur-3xl float-element" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg">SkillFit</span>
              <span className="font-display font-bold text-indigo-400 text-lg"> AI</span>
            </div>
            <span className="hidden sm:block ml-2 ai-badge text-[10px]">GOV TECH</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/login')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-medium border border-slate-700 hover:border-slate-600 transition-all"
            >
              <Lock size={14} />
              Admin Portal
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-brand flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Play size={14} />
              Start Interview
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 grid-bg">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-indigo-600/10 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-indigo-300 text-sm font-medium">Karnataka Skill Development Mission · Powered by AI</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-tight mb-6"
          >
            <span className="text-white">AI-Powered</span><br />
            <span className="gradient-text">Workforce Assessment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Video-based candidate screening in Kannada, Hindi & English. AI evaluates communication,
            confidence, and skill relevance — classifying thousands of applicants in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/register')}
              className="btn-brand flex items-center gap-2 px-8 py-4 text-base w-full sm:w-auto justify-center"
            >
              <Play size={18} />
              Begin Assessment
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-2 px-8 py-4 text-base w-full sm:w-auto justify-center rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all"
            >
              <BarChart3 size={18} />
              View Dashboard
            </button>
          </motion.div>
        </div>

        {/* Mock Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-4xl mx-auto mt-16 relative"
        >
          <div className="glass-card rounded-2xl p-1 glow-indigo">
            <div className="bg-slate-900 rounded-xl p-4">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 bg-slate-800 rounded-md h-6 flex items-center px-3">
                  <span className="text-slate-400 text-xs">skillfit.gov.in/admin/dashboard</span>
                </div>
              </div>
              {/* Mock stats grid */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Total Candidates', value: '48,291', color: 'indigo' },
                  { label: 'Job Ready', value: '14,820', color: 'emerald' },
                  { label: 'Today\'s Interviews', value: '342', color: 'purple' },
                  { label: 'Fraud Flagged', value: '89', color: 'red' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                    <p className={`text-lg font-bold font-display text-${s.color}-400`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Mock chart bars */}
              <div className="bg-slate-800/30 rounded-xl p-4 flex items-end gap-2 h-24">
                {[40, 65, 55, 80, 70, 90, 60, 75, 85, 50, 95, 72].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/60 to-indigo-400/20 rounded-sm transition-all hover:from-indigo-500/80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
          {/* Glow effect below image */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-indigo-600/20 blur-2xl rounded-full" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display font-extrabold text-4xl text-white mb-1">
                <AnimatedNumber value={stat.value} duration={2000} />{stat.suffix}
              </div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="ai-badge mb-4 inline-block">Platform Features</span>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Built for Scale & Accuracy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Every component designed for high-volume government deployment with enterprise-grade reliability</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${colorMap[color].split(' ').slice(0,2).join(' ')}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color].split(' ').slice(0,2).join(' ')} border ${colorMap[color].split(' ')[2]} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={colorMap[color].split(' ')[3]} />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow Timeline */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="ai-badge mb-4 inline-block">AI Workflow</span>
            <h2 className="font-display font-bold text-4xl text-white mb-4">From Registration to Classification</h2>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-600 via-purple-600 to-cyan-600 hidden sm:block" />
            <div className="space-y-6">
              {WORKFLOW_STEPS.map(({ n, title, desc, icon: Icon }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-5 pl-0 sm:pl-4"
                >
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/20 border border-indigo-500/30 flex flex-col items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-indigo-400" />
                    <span className="text-[9px] text-indigo-500 font-mono font-bold">{n}</span>
                  </div>
                  <div className="glass-card rounded-xl p-4 flex-1">
                    <h4 className="font-display font-bold text-white mb-1">{title}</h4>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Classification Cards */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-white mb-4">4-Way Candidate Classification</h2>
            <p className="text-slate-400">AI-driven classification with configurable thresholds</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CLASSIFICATIONS.map(({ label, desc, color, pct }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl font-bold font-display bg-${color}-500/10 text-${color}-400`}>
                  {pct}
                </div>
                <h4 className="font-display font-bold text-white text-sm mb-1">{label}</h4>
                <p className="text-slate-500 text-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 glow-indigo">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <Brain size={28} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Ready to Begin Your Assessment?</h2>
            <p className="text-slate-400 mb-8 text-lg">The entire process takes under 15 minutes. Your results are instant.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="btn-brand flex items-center gap-2 px-8 py-4 text-base justify-center">
                <Play size={18} /> Start Interview Now
              </button>
              <button onClick={() => navigate('/admin/login')} className="flex items-center gap-2 px-8 py-4 text-base justify-center rounded-xl border border-slate-600 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-all">
                <Lock size={18} /> Admin Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">SkillFit AI</span>
            <span className="text-slate-500 text-sm">· Karnataka Skill Dev Mission</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>© 2024 Government of Karnataka</span>
            <span>|</span>
            <span>Privacy Policy</span>
            <span>|</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
