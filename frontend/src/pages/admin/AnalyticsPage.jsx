// AnalyticsPage.jsx
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import AdminSidebar from '../../components/shared/AdminSidebar';
import { GlassCard } from '../../components/shared';

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1} Dec`, registrations: 80 + Math.floor(Math.random() * 200),
  assessed: 60 + Math.floor(Math.random() * 150),
  jobReady: 20 + Math.floor(Math.random() * 60),
}));

const avgScoreData = [
  { category: 'IT & Tech', overall: 72, communication: 74, confidence: 68 },
  { category: 'Healthcare', overall: 68, communication: 71, confidence: 65 },
  { category: 'Construction', overall: 58, communication: 55, confidence: 61 },
  { category: 'Agriculture', overall: 54, communication: 52, confidence: 56 },
  { category: 'Retail', overall: 65, communication: 68, confidence: 63 },
  { category: 'Manufacturing', overall: 60, communication: 58, confidence: 62 },
];

const districtData = [
  { district: 'Bangalore Urban', total: 12400, jobReady: 4120 },
  { district: 'Mysore', total: 6800, jobReady: 2050 },
  { district: 'Hubli', total: 5200, jobReady: 1430 },
  { district: 'Mangalore', total: 4900, jobReady: 1580 },
  { district: 'Bellary', total: 3800, jobReady: 880 },
  { district: 'Gulbarga', total: 3400, jobReady: 750 },
  { district: 'Tumkur', total: 2900, jobReady: 820 },
];

const radarData = [
  { subject: 'Communication', A: 68 }, { subject: 'Confidence', A: 62 },
  { subject: 'Skill Relevance', A: 71 }, { subject: 'Authenticity', A: 78 },
  { subject: 'Clarity', A: 65 }, { subject: 'Relevance', A: 69 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 text-xs space-y-1">
      <p className="text-slate-300 font-semibold mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>)}
    </div>
  );
};

export function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-800/50" style={{ background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(20px)' }}>
          <h1 className="font-display font-bold text-xl text-white">Analytics & Insights</h1>
          <p className="text-slate-400 text-xs">Workforce intelligence across all districts</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Daily Trend */}
          <GlassCard className="p-5">
            <h3 className="font-display font-bold text-white mb-5">30-Day Registration & Assessment Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={2} dot={false} name="Registrations" />
                <Line type="monotone" dataKey="assessed" stroke="#22d3ee" strokeWidth={2} dot={false} name="Assessed" />
                <Line type="monotone" dataKey="jobReady" stroke="#10b981" strokeWidth={2} dot={false} name="Job Ready" />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Avg Scores By Category */}
            <GlassCard className="p-5">
              <h3 className="font-display font-bold text-white mb-5">Avg Scores by Skill Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={avgScoreData} layout="vertical" margin={{ left: 20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="category" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="overall" fill="#6366f1" radius={4} name="Overall Score" />
                  <Bar dataKey="communication" fill="#22d3ee" radius={4} name="Communication" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Radar Chart */}
            <GlassCard className="p-5">
              <h3 className="font-display font-bold text-white mb-5">Average Competency Profile</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.15)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                  <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* District Breakdown */}
          <GlassCard className="p-5">
            <h3 className="font-display font-bold text-white mb-5">District-Wise Candidate Overview</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                <XAxis dataKey="district" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="total" fill="#6366f1" name="Total" radius={[4,4,0,0]} />
                <Bar dataKey="jobReady" fill="#10b981" name="Job Ready" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

export default AnalyticsPage;
