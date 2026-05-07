import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Award, AlertTriangle, Activity, TrendingUp,
  Search, Filter, Eye, Brain, Bell, ChevronRight, Download
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import AdminSidebar from '../../components/shared/AdminSidebar';
import { GlassCard, StatCard, ClassificationBadge, AnimatedNumber } from '../../components/shared';
import { dashboardAPI, candidateAPI } from '../../utils/api';

// Mock data for demo
const mockStats = { totalCandidates: 48291, assessedToday: 342, jobReady: 14960, needsTraining: 21248, manualVerification: 8692, fraudSuspected: 3391, pendingFraudAlerts: 23, activeInterviews: 7, assessedThisWeek: 2419, successRate: 31 };

const mockClassification = [
  { name: 'Job Ready', value: 14960, fill: '#10b981' },
  { name: 'Needs Training', value: 21248, fill: '#f59e0b' },
  { name: 'Manual Review', value: 8692, fill: '#6366f1' },
  { name: 'Fraud Suspected', value: 3391, fill: '#ef4444' },
];

const mockSkillData = [
  { category: 'IT & Tech', count: 9820 },
  { category: 'Construction', count: 7430 },
  { category: 'Healthcare', count: 6210 },
  { category: 'Agriculture', count: 5880 },
  { category: 'Retail', count: 5210 },
  { category: 'Manufacturing', count: 4920 },
  { category: 'Hospitality', count: 3830 },
  { category: 'Logistics', count: 2990 },
];

const mockLanguage = [
  { name: 'Kannada', value: 22480, fill: '#f59e0b' },
  { name: 'Hindi', value: 14560, fill: '#6366f1' },
  { name: 'English', value: 11251, fill: '#06b6d4' },
];

const mockCandidates = Array.from({ length: 20 }, (_, i) => ({
  _id: `cand_${i + 1}`,
  name: ['Rajesh Kumar', 'Priya Nair', 'Suresh Yadav', 'Anil Gowda', 'Meera Devi', 'Karthik Rao', 'Sunita Patil', 'Vijay Singh', 'Anitha Reddy', 'Mohan Sharma'][i % 10],
  district: ['Bangalore Urban', 'Mysore', 'Hubli', 'Mangalore', 'Bellary', 'Gulbarga', 'Tumkur', 'Shimoga', 'Udupi', 'Raichur'][i % 10],
  language: ['English', 'Kannada', 'Hindi'][i % 3],
  skillCategory: ['IT & Technology', 'Construction & Civil', 'Healthcare & Nursing', 'Agriculture & Farming', 'Retail & Sales'][i % 5],
  classification: ['Job Ready', 'Needs Training', 'Manual Verification', 'Fraud Suspected'][i % 4],
  scores: { overall: 40 + Math.floor(Math.random() * 55) },
  registeredAt: new Date(Date.now() - i * 3600000 * 24).toISOString(),
}));

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs">
      <p className="text-white font-semibold">{payload[0].name || payload[0].dataKey}</p>
      <p className="text-indigo-300">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockStats);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [search, setSearch] = useState('');
  const [filterClassification, setFilterClassification] = useState('');
  const [loading, setLoading] = useState(false);
  const admin = JSON.parse(localStorage.getItem('skillfit_admin') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, candidatesRes] = await Promise.all([
          dashboardAPI.getStats(),
          candidateAPI.getAll({ limit: 20 }),
        ]);
        if (statsRes.stats) setStats(statsRes.stats);
        if (candidatesRes.candidates?.length) setCandidates(candidatesRes.candidates);
      } catch {} // Use mock data on error
    };
    fetchData();
  }, []);

  const filtered = candidates.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.district.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterClassification || c.classification === filterClassification;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-800/50 flex items-center justify-between"
          style={{ background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(20px)' }}>
          <div>
            <h1 className="font-display font-bold text-xl text-white">Command Dashboard</h1>
            <p className="text-slate-400 text-xs">Welcome back, {admin.name || 'Admin'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell size={18} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
              {stats.pendingFraudAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">{stats.pendingFraudAlerts}</span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {(admin.name || 'A').charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Candidates" value={stats.totalCandidates} color="indigo" change={8} />
            <StatCard icon={Award} label="Job Ready" value={stats.jobReady} color="emerald" change={12} />
            <StatCard icon={Activity} label="Assessed Today" value={stats.assessedToday} color="purple" change={5} />
            <StatCard icon={AlertTriangle} label="Fraud Alerts" value={stats.pendingFraudAlerts} color="red" change={-3} />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Needs Training', value: stats.needsTraining, color: 'amber' },
              { label: 'Manual Review', value: stats.manualVerification, color: 'blue' },
              { label: 'Active Interviews', value: stats.activeInterviews, color: 'cyan' },
              { label: 'This Week', value: stats.assessedThisWeek, color: 'purple' },
            ].map(({ label, value, color }, i) => (
              <GlassCard key={i} className="p-4">
                <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
                <p className={`text-xl font-display font-bold text-${color}-400`}>
                  <AnimatedNumber value={value} />
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Classification Pie */}
            <GlassCard className="p-5">
              <h3 className="font-display font-bold text-white mb-4">Classification Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={mockClassification} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    dataKey="value" nameKey="name" paddingAngle={3}>
                    {mockClassification.map((e, i) => <Cell key={i} fill={e.fill} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Language Usage Pie */}
            <GlassCard className="p-5">
              <h3 className="font-display font-bold text-white mb-4">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={mockLanguage} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    dataKey="value" nameKey="name" paddingAngle={3}>
                    {mockLanguage.map((e, i) => <Cell key={i} fill={e.fill} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard className="p-5">
              <h3 className="font-display font-bold text-white mb-4">Platform Overview</h3>
              <div className="space-y-3">
                {[
                  { label: 'Success Rate', value: `${stats.successRate}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Fraud Rate', value: `${Math.round((stats.fraudSuspected / stats.totalCandidates) * 100)}%`, color: 'text-red-400', bg: 'bg-red-500/10' },
                  { label: 'Avg Score', value: '68.4', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  { label: 'Avg Duration', value: '12 min', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Districts', value: '12', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                ].map(({ label, value, color, bg }, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl ${bg}`}>
                    <span className="text-slate-400 text-xs">{label}</span>
                    <span className={`font-display font-bold text-sm ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Skill Distribution Bar Chart */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-white">Skill Category Distribution</h3>
              <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600">
                <Download size={12} /> Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockSkillData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Candidates" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Candidates Table */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h3 className="font-display font-bold text-white">Recent Candidates</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search candidates..."
                    className="pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-52"
                  />
                </div>
                <select
                  value={filterClassification} onChange={e => setFilterClassification(e.target.value)}
                  className="px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="Job Ready">Job Ready</option>
                  <option value="Needs Training">Needs Training</option>
                  <option value="Manual Verification">Manual Review</option>
                  <option value="Fraud Suspected">Fraud Suspected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    {['Candidate', 'District', 'Language', 'Skill Area', 'Score', 'Classification', 'Action'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-4 first:pl-0 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <motion.tr
                      key={c._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600/60 to-purple-600/60 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <span className="text-white font-medium text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 text-xs whitespace-nowrap">{c.district}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-xs">{c.language}</span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 text-xs max-w-[120px] truncate">{c.skillCategory?.split(' & ')[0]}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-white text-sm">{c.scores?.overall || '--'}</span>
                          <div className="w-12 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${c.scores?.overall || 0}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <ClassificationBadge classification={c.classification} size="sm" />
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => navigate(`/admin/candidate/${c._id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={12} /> Review
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
              <p className="text-xs text-slate-500">Showing {filtered.length} of {candidates.length} candidates</p>
              <button
                onClick={() => navigate('/admin/analytics')}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all analytics <ChevronRight size={12} />
              </button>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
