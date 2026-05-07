// RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Briefcase, ArrowRight, Brain, ArrowLeft } from 'lucide-react';
import { candidateAPI } from '../utils/api';
import { GlassCard, Spinner } from '../components/shared';

const DISTRICTS = ['Bangalore Urban','Bangalore Rural','Mysore','Hubli-Dharwad','Belgaum','Mangalore','Gulbarga','Davangere','Bellary','Bijapur','Shimoga','Tumkur','Raichur','Bidar','Hassan','Udupi','Chickmagalur','Kolar','Mandya','Chitradurga'];
const SKILL_CATEGORIES = ['IT & Technology','Construction & Civil','Healthcare & Nursing','Agriculture & Farming','Retail & Sales','Manufacturing','Hospitality & Tourism','Education & Teaching','Logistics & Transport','Textile & Apparel'];
const InputField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  placeholder,
  form,
  setForm,
  errors
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-300 mb-2">
      {label}
    </label>

    <div className="relative">
      <Icon
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />

      <input
        type={type}
        value={form[name]}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            [name]: e.target.value,
          }))
        }
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          errors[name]
            ? 'border-red-500/50'
            : 'border-slate-700/50 focus:border-indigo-500/50'
        }`}
      />
    </div>

    {errors[name] && (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        ⚠ {errors[name]}
      </p>
    )}
  </div>
);
export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', district: '', skillCategory: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Full name required (min 2 characters)';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit Indian mobile number required';
    if (!form.district) e.district = 'Please select your district';
    if (!form.skillCategory) e.skillCategory = 'Please select a skill category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      // const res = await candidateAPI.register({ ...form, language: 'English' });
      const res = {
  candidate: {
    id: 'demo-user',
    name: form.name,
  }
};
      localStorage.setItem('skillfit_candidate', JSON.stringify({ ...res.candidate, phone: form.phone }));
      navigate('/language');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-600/8 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Brain size={24} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white mb-1">Candidate Registration</h1>
            <p className="text-slate-400 text-sm">Step 1 of 4 · Basic Information</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

  <InputField
    icon={User}
    label="Full Name"
    name="name"
    placeholder="e.g. Rajesh Kumar"
    form={form}
    setForm={setForm}
    errors={errors}
  />

  <InputField
    icon={Phone}
    label="Mobile Number"
    name="phone"
    type="tel"
    placeholder="10-digit mobile number"
    form={form}
    setForm={setForm}
    errors={errors}
  />
            

            {/* District Select */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">District</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                <select
                  value={form.district}
                  onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${errors.district ? 'border-red-500/50' : 'border-slate-700/50'}`}
                >
                  <option value="" className="bg-slate-800">Select your district</option>
                  {DISTRICTS.map(d => <option key={d} value={d} className="bg-slate-800">{d}</option>)}
                </select>
              </div>
              {errors.district && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.district}</p>}
            </div>

            {/* Skill Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Skill Category</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                <select
                  value={form.skillCategory}
                  onChange={e => setForm(p => ({ ...p, skillCategory: e.target.value }))}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${errors.skillCategory ? 'border-red-500/50' : 'border-slate-700/50'}`}
                >
                  <option value="" className="bg-slate-800">Select your skill area</option>
                  {SKILL_CATEGORIES.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                </select>
              </div>
              {errors.skillCategory && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.skillCategory}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 py-4 text-base mt-2"
            >
              {loading ? <><Spinner size={20} /> Registering...</> : <>Continue <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-4">
            Your data is secured under Government of Karnataka data protection guidelines
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
