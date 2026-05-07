/**
 * Utility functions for SkillFit AI
 */

// ─── Classification Helpers ──────────────────────────
export const CLASSIFICATION_CONFIG = {
  'Job Ready': {
    color: 'emerald',
    hex: '#10b981',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: '🚀',
    minScore: 80,
  },
  'Needs Training': {
    color: 'amber',
    hex: '#f59e0b',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: '📈',
    minScore: 50,
  },
  'Manual Verification': {
    color: 'blue',
    hex: '#6366f1',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    icon: '🔍',
    minScore: 30,
  },
  'Fraud Suspected': {
    color: 'red',
    hex: '#ef4444',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    icon: '⚠️',
    minScore: 0,
  },
};

export const getClassificationConfig = (classification) =>
  CLASSIFICATION_CONFIG[classification] || CLASSIFICATION_CONFIG['Manual Verification'];

// ─── Score Color Helpers ─────────────────────────────
export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#6366f1';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 35) return 'Below Average';
  return 'Poor';
};

// ─── Date Formatters ─────────────────────────────────
export const formatDate = (date, options = {}) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

export const formatDateTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const timeAgo = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
};

// ─── Number Formatters ───────────────────────────────
export const formatNumber = (n) => {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n?.toLocaleString('en-IN') || '0';
};

export const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// ─── Validation ──────────────────────────────────────
export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Constants ───────────────────────────────────────
export const DISTRICTS = [
  'Bangalore Urban', 'Bangalore Rural', 'Mysore', 'Hubli-Dharwad',
  'Mangalore', 'Gulbarga', 'Davangere', 'Bellary', 'Bijapur',
  'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hassan', 'Udupi',
  'Chickmagalur', 'Kolar', 'Mandya', 'Chitradurga',
];

export const SKILL_CATEGORIES = [
  'IT & Technology', 'Construction & Civil', 'Healthcare & Nursing',
  'Agriculture & Farming', 'Retail & Sales', 'Manufacturing',
  'Hospitality & Tourism', 'Education & Teaching',
  'Logistics & Transport', 'Textile & Apparel',
];

export const LANGUAGES = ['English', 'Hindi', 'Kannada'];

export const SCORE_DIMENSIONS = [
  { key: 'communication', label: 'Communication', color: '#6366f1', weight: 0.30 },
  { key: 'confidence',    label: 'Confidence',    color: '#8b5cf6', weight: 0.20 },
  { key: 'skillRelevance',label: 'Skill Relevance',color: '#22d3ee', weight: 0.35 },
  { key: 'authenticity',  label: 'Authenticity',  color: '#10b981', weight: 0.15 },
];

// ─── Risk Level Config ───────────────────────────────
export const RISK_CONFIG = {
  clean:    { color: '#10b981', label: 'Clean',    bg: 'bg-emerald-500/10' },
  low:      { color: '#84cc16', label: 'Low Risk', bg: 'bg-lime-500/10' },
  medium:   { color: '#f59e0b', label: 'Medium',   bg: 'bg-amber-500/10' },
  high:     { color: '#f97316', label: 'High Risk', bg: 'bg-orange-500/10' },
  critical: { color: '#ef4444', label: 'Critical',  bg: 'bg-red-500/10' },
};

export const getRiskConfig = (level) => RISK_CONFIG[level] || RISK_CONFIG.low;
