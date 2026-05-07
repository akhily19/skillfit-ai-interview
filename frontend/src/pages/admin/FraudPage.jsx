// FraudPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Users, Eye, CheckCircle, XCircle, Activity, Camera, Mic, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/shared/AdminSidebar';
import { GlassCard, ClassificationBadge } from '../../components/shared';

const FRAUD_CASES = Array.from({ length: 12 }, (_, i) => ({
  id: `fraud_${i}`,
  candidateName: ['Rahul Sharma', 'Priya Singh', 'Ankit Patel', 'Neha Gupta', 'Rohit Kumar'][i % 5],
  district: ['Bangalore', 'Mysore', 'Hubli', 'Bellary', 'Gulbarga'][i % 5],
  riskScore: [85, 72, 91, 55, 68, 44, 78, 62, 88, 71, 95, 58][i],
  riskLevel: ['critical', 'high', 'critical', 'medium', 'high', 'medium', 'high', 'medium', 'critical', 'high', 'critical', 'medium'][i],
  indicators: {
    multipleFaces: [true, false, true, false, true, false, false, false, true, true, true, false][i],
    audioQualityLow: [false, true, false, false, false, true, false, false, false, false, true, true][i],
    poorLighting: [false, false, true, false, false, false, true, false, false, false, false, false][i],
    offScreenGaze: [true, true, false, true, false, false, false, true, true, false, true, false][i],
    suspiciousActivity: [false, false, true, false, true, false, false, false, true, false, true, false][i],
  },
  detected: new Date(Date.now() - i * 7200000).toISOString(),
  resolved: i > 8,
}));

const RISK_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', badge: 'CRITICAL' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30', badge: 'HIGH' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', badge: 'MEDIUM' },
  low: { color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30', badge: 'LOW' },
};

const INDICATOR_CONFIG = [
  { key: 'multipleFaces', icon: Camera, label: 'Multiple Faces', desc: 'More than 1 face detected' },
  { key: 'audioQualityLow', icon: Volume2, label: 'Low Audio Quality', desc: 'Audio below threshold' },
  { key: 'poorLighting', icon: Eye, label: 'Poor Lighting', desc: 'Video too dark/bright' },
  { key: 'offScreenGaze', icon: Activity, label: 'Off-Screen Gaze', desc: 'Eyes not on camera' },
  { key: 'suspiciousActivity', icon: AlertTriangle, label: 'Suspicious Activity', desc: 'Anomalous behaviour detected' },
];

export function FraudPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [resolving, setResolving] = useState({});

  const displayed = FRAUD_CASES.filter(c => filter === 'all' || c.riskLevel === filter || (filter === 'unresolved' && !c.resolved));
  const criticalCount = FRAUD_CASES.filter(c => c.riskLevel === 'critical').length;
  const unresolvedCount = FRAUD_CASES.filter(c => !c.resolved).length;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-800/50" style={{ background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Shield size={20} className="text-red-400" /> Fraud Detection Monitor
              </h1>
              <p className="text-slate-400 text-xs">Real-time anomaly detection & alert management</p>
            </div>
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-400 text-xs font-bold">{criticalCount} CRITICAL</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Flagged', value: FRAUD_CASES.length, color: 'text-red-400', icon: AlertTriangle },
              { label: 'Critical Risk', value: criticalCount, color: 'text-orange-400', icon: XCircle },
              { label: 'Unresolved', value: unresolvedCount, color: 'text-amber-400', icon: Shield },
              { label: 'Resolved', value: FRAUD_CASES.length - unresolvedCount, color: 'text-emerald-400', icon: CheckCircle },
            ].map(({ label, value, color, icon: Icon }, i) => (
              <GlassCard key={i} className="p-4 flex items-center gap-3">
                <Icon size={20} className={color} />
                <div>
                  <p className={`text-xl font-display font-bold ${color}`}>{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Indicator Summary */}
          <GlassCard className="p-5">
            <h3 className="font-display font-bold text-white mb-4">Detection Indicators Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {INDICATOR_CONFIG.map(({ key, icon: Icon, label, desc }) => {
                const count = FRAUD_CASES.filter(c => c.indicators[key]).length;
                const pct = Math.round((count / FRAUD_CASES.length) * 100);
                return (
                  <div key={key} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
                    <Icon size={20} className={count > 3 ? 'text-red-400 mx-auto mb-2' : 'text-slate-400 mx-auto mb-2'} />
                    <p className="text-white font-display font-bold text-lg">{count}</p>
                    <p className="text-slate-400 text-xs font-medium leading-tight">{label}</p>
                    <div className="mt-2 progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: count > 3 ? 'linear-gradient(90deg, #ef4444, #f97316)' : 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{pct}% of cases</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'critical', 'high', 'medium', 'unresolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
                }`}>
                {f === 'all' ? 'All Cases' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayed.map((c, i) => {
              const risk = RISK_CONFIG[c.riskLevel] || RISK_CONFIG.medium;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <GlassCard className={`p-4 border ${risk.bg} ${c.resolved ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full border ${risk.bg} ${risk.color}`}>{risk.badge}</span>
                          {c.resolved && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">RESOLVED</span>}
                        </div>
                        <p className="text-white font-semibold text-sm">{c.candidateName}</p>
                        <p className="text-slate-500 text-xs">{c.district} · {new Date(c.detected).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-display font-black ${risk.color}`}>{c.riskScore}</p>
                        <p className="text-xs text-slate-500">Risk Score</p>
                      </div>
                    </div>

                    {/* Risk score bar */}
                    <div className="progress-bar mb-3">
                      <div className="h-full rounded-full transition-all duration-1000" style={{
                        width: `${c.riskScore}%`,
                        background: c.riskScore > 75 ? 'linear-gradient(90deg, #ef4444, #f97316)' : c.riskScore > 50 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #4f46e5, #7c3aed)'
                      }} />
                    </div>

                    {/* Indicators */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {INDICATOR_CONFIG.filter(ind => c.indicators[ind.key]).map(ind => (
                        <span key={ind.key} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-medium">
                          <ind.icon size={9} /> {ind.label}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/candidate/${c.id}`)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all">
                        <Eye size={12} /> View Profile
                      </button>
                      {!c.resolved && (
                        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/20 transition-all">
                          <CheckCircle size={12} /> Mark Resolved
                        </button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default FraudPage;
