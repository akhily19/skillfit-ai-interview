import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart3, Shield,
  LogOut, Brain, ChevronLeft, ChevronRight,
  Bell, Settings, Activity
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/admin/dashboard' },
  { icon: Users,           label: 'Candidates',    path: '/admin/dashboard?tab=candidates' },
  { icon: BarChart3,       label: 'Analytics',     path: '/admin/analytics' },
  { icon: Shield,          label: 'Fraud Monitor', path: '/admin/fraud' },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('skillfit_admin') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('skillfit_admin_token');
    localStorage.removeItem('skillfit_admin');
    navigate('/admin/login');
  };

  return (
    <aside
      className="relative flex flex-col transition-all duration-300 h-screen"
      style={{
        width: collapsed ? 72 : 240,
        background: 'rgba(10, 15, 30, 0.95)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/50">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm font-display leading-tight">SkillFit AI</p>
            <p className="text-indigo-400 text-xs">Admin Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">System Status</span>
          </div>
          <div className="space-y-1">
            {['AI Engine', 'Database', 'Storage'].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{item}</span>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="border-t border-slate-800/50 p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
            {admin.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{admin.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{admin.role || 'admin'}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
