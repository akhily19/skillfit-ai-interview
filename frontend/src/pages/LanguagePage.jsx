import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/shared';
import { candidateAPI } from '../utils/api';

const LANGUAGES = [
  {
    code: 'Kannada',
    name: 'ಕನ್ನಡ',
    english: 'Kannada',
    flag: '🇮🇳',
    description: 'ಕನ್ನಡದಲ್ಲಿ ಸಂದರ್ಶನ ನೀಡಿ',
    subdesc: 'Interview in Kannada',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    selectedBg: 'from-amber-600/30 to-orange-600/20',
  },
  {
    code: 'Hindi',
    name: 'हिंदी',
    english: 'Hindi',
    flag: '🇮🇳',
    description: 'हिंदी में साक्षात्कार दें',
    subdesc: 'Interview in Hindi',
    gradient: 'from-indigo-500/20 to-blue-500/10',
    border: 'border-indigo-500/30',
    accent: 'text-indigo-400',
    selectedBg: 'from-indigo-600/30 to-blue-600/20',
  },
  {
    code: 'English',
    name: 'English',
    english: 'English',
    flag: '🇬🇧',
    description: 'Give your interview in English',
    subdesc: 'Interview in English',
    gradient: 'from-cyan-500/20 to-teal-500/10',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-400',
    selectedBg: 'from-cyan-600/30 to-teal-600/20',
  },
];

export default function LanguagePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const candidate = JSON.parse(localStorage.getItem('skillfit_candidate') || '{}');

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      // Update candidate language preference
      const updated = { ...candidate, language: selected };
      localStorage.setItem('skillfit_candidate', JSON.stringify(updated));
      navigate('/interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/5 w-56 h-56 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <button onClick={() => navigate('/register')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 mb-4">
            <Globe size={14} className="text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">Step 2 of 4 · Language Selection</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            Welcome, <span className="gradient-text">{candidate.name || 'Candidate'}</span>
          </h1>
          <p className="text-slate-400">Choose your preferred interview language</p>
        </div>

        {/* Language Cards */}
        <div className="space-y-4 mb-8">
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(lang.code)}
              className={`relative glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                selected === lang.code
                  ? `border-2 ${lang.border} bg-gradient-to-r ${lang.selectedBg}`
                  : 'border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Language symbol */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${lang.gradient} border ${lang.border} flex items-center justify-center flex-shrink-0`}>
                  <span className={`font-display font-bold text-2xl ${lang.accent}`}>{lang.name.charAt(0)}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-xl text-white">{lang.name}</h3>
                    <span className={`text-sm ${lang.accent} font-medium`}>({lang.english})</span>
                  </div>
                  <p className={`text-base ${lang.accent} font-medium`}>{lang.description}</p>
                  <p className="text-slate-500 text-sm">{lang.subdesc}</p>
                </div>

                {/* Selection indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selected === lang.code ? `${lang.border} bg-gradient-to-br ${lang.gradient}` : 'border-slate-600'
                }`}>
                  {selected === lang.code && <CheckCircle size={14} className={lang.accent} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!selected || loading}
          className={`btn-brand w-full flex items-center justify-center gap-2 py-4 text-base transition-all ${
            !selected ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
          }`}
        >
          {loading ? 'Starting Interview...' : (
            <>Start AI Interview <ArrowRight size={18} /></>
          )}
        </motion.button>

        <p className="text-center text-slate-500 text-xs mt-4">
          Your interview will be conducted entirely in your chosen language
        </p>
      </motion.div>
    </div>
  );
}
