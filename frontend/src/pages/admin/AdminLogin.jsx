import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { GlassCard, Spinner } from '../../components/shared';
import { authAPI } from '../../utils/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@skillfit.gov.in', password: 'Admin@123456' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form.email, form.password);
      localStorage.setItem('skillfit_admin_token', res.token);
      localStorage.setItem('skillfit_admin', JSON.stringify(res.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      // Demo mode: accept any credentials
      if (form.email && form.password) {
        const mockAdmin = { name: 'Admin Officer', email: form.email, role: 'super_admin' };
        localStorage.setItem('skillfit_admin_token', 'demo_token_' + Date.now());
        localStorage.setItem('skillfit_admin', JSON.stringify(mockAdmin));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mx-auto mb-4 glow-indigo">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">SkillFit AI</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Portal · Secure Access</p>
        </div>

        <GlassCard className="p-8">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Shield size={14} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-xs">Government Restricted Area. Authorised Personnel Only.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="admin@skillfit.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 py-4 text-base mt-2">
              {loading ? <><Spinner size={20} /> Authenticating...</> : <><Lock size={18} /> Secure Login</>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials</p>
            <div className="bg-slate-800/50 rounded-xl p-3 font-mono text-xs space-y-1">
              <p className="text-slate-400">Email: <span className="text-indigo-400">admin@skillfit.gov.in</span></p>
              <p className="text-slate-400">Pass: <span className="text-indigo-400">Admin@123456</span></p>
            </div>
          </div>
        </GlassCard>

        <p className="text-center text-slate-600 text-xs mt-4">
          © 2024 Karnataka Skill Development Mission · All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
