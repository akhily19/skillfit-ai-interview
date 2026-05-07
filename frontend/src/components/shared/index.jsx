// src/components/shared/index.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// ─── Admin Route Guard ──────────────────────────────────────────
export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('skillfit_admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

// ─── GlassCard ──────────────────────────────────────────────────
export const GlassCard = ({ children, className = '', hover = false, glow = false, style }) => (
  <div
    style={style}
    className={`glass-card rounded-2xl ${hover ? 'hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 cursor-pointer' : ''} ${glow ? 'glow-indigo' : ''} ${className}`}
  >
    {children}
  </div>
);

// ─── Score Badge ─────────────────────────────────────────────────
export const ClassificationBadge = ({ classification, size = 'md' }) => {
  const config = {
    'Job Ready': { cls: 'badge-job-ready', icon: '✓', label: 'Job Ready' },
    'Needs Training': { cls: 'badge-needs-training', icon: '⚡', label: 'Needs Training' },
    'Manual Verification': { cls: 'badge-manual', icon: '⏳', label: 'Manual Verification' },
    'Fraud Suspected': { cls: 'badge-fraud', icon: '⚠', label: 'Fraud Suspected' },
  };
  const c = config[classification] || { cls: 'badge-manual', icon: '?', label: classification || 'Unknown' };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizes[size]} ${c.cls}`}>
      <span>{c.icon}</span>
      {c.label}
    </span>
  );
};

// ─── Score Ring (SVG circular progress) ─────────────────────────
export const ScoreRing = ({ score, label, color = '#6366f1', size = 80 }) => {
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="6" />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold font-display" style={{ fontSize: size * 0.22 }}>{score}</span>
        </div>
      </div>
      {label && <span className="text-xs text-slate-400 font-medium text-center leading-tight">{label}</span>}
    </div>
  );
};

// ─── Animated Number ─────────────────────────────────────────────
export const AnimatedNumber = ({ value, duration = 1500, prefix = '', suffix = '' }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const end = parseFloat(value);
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * end));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{prefix}{current.toLocaleString()}{suffix}</span>;
};

// ─── Waveform Visualizer ─────────────────────────────────────────
export const Waveform = ({ active = false, bars = 8, color = '#818cf8' }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: bars }, (_, i) => (
      <div
        key={i}
        className="w-1 rounded-full transition-all duration-200"
        style={{
          height: active ? `${8 + Math.random() * 24}px` : '4px',
          backgroundColor: color,
          animation: active ? `wave ${0.8 + i * 0.1}s ease-in-out infinite alternate` : 'none',
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// ─── Progress Step ────────────────────────────────────────────────
export const StepProgress = ({ steps, currentStep }) => (
  <div className="flex items-center gap-0">
    {steps.map((step, i) => (
      <div key={i} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < currentStep ? 'bg-indigo-600 text-white' :
            i === currentStep ? 'bg-indigo-600/30 border-2 border-indigo-500 text-indigo-300' :
            'bg-slate-800 text-slate-500 border border-slate-700'
          }`}>
            {i < currentStep ? '✓' : i + 1}
          </div>
          <span className={`text-xs mt-1 whitespace-nowrap font-medium ${i <= currentStep ? 'text-indigo-300' : 'text-slate-500'}`}>
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`h-0.5 w-8 sm:w-12 mx-1 transition-all duration-500 ${i < currentStep ? 'bg-indigo-600' : 'bg-slate-700'}`} />
        )}
      </div>
    ))}
  </div>
);

// ─── Loading Spinner ─────────────────────────────────────────────
export const Spinner = ({ size = 24 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <div
      className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-500/30 border-b-indigo-500/10 border-l-indigo-500/30 animate-spin"
      style={{ width: size, height: size }}
    />
  </div>
);

// ─── Stat Card ───────────────────────────────────────────────────
export const StatCard = ({ icon: Icon, label, value, change, color = 'indigo', className = '' }) => {
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    red: 'text-red-400 bg-red-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };

  return (
    <GlassCard className={`p-5 ${className}`} hover>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          <Icon size={20} className={colors[color].split(' ')[0]} />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${change >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold font-display text-white">
          <AnimatedNumber value={value} />
        </p>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
      </div>
    </GlassCard>
  );
};
