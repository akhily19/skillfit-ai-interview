import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Candidate Flow
import LandingPage from './pages/LandingPage';
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const LanguagePage    = lazy(() => import('./pages/LanguagePage'));
const InterviewPage   = lazy(() => import('./pages/InterviewPage'));
const RecordingPage   = lazy(() => import('./pages/RecordingPage'));
const ProcessingPage  = lazy(() => import('./pages/ProcessingPage'));
const ResultPage      = lazy(() => import('./pages/ResultPage'));

// Admin Flow
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'));
const AnalyticsPage   = lazy(() => import('./pages/admin/AnalyticsPage'));
const FraudPage       = lazy(() => import('./pages/admin/FraudPage'));
const CandidateReview = lazy(() => import('./pages/admin/CandidateReview'));

// Guards
import { AdminRoute } from './components/shared/AdminRoute';

// Loader
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-t-indigo-500 border-transparent animate-spin" />
        <div className="absolute inset-4 rounded-full bg-indigo-600/20 animate-pulse" />
      </div>
      <p className="text-slate-400 text-sm font-medium tracking-wider">LOADING</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public - Candidate Flow */}
          <Route path="/"             element={<LandingPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path="/language"     element={<LanguagePage />} />
          <Route path="/interview"    element={<InterviewPage />} />
          <Route path="/record"       element={<RecordingPage />} />
          <Route path="/processing"   element={<ProcessingPage />} />
          <Route path="/result"       element={<ResultPage />} />

          {/* Admin Flow */}
          <Route path="/admin"        element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login"  element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
          <Route path="/admin/fraud"     element={<AdminRoute><FraudPage /></AdminRoute>} />
          <Route path="/admin/candidate/:id" element={<AdminRoute><CandidateReview /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
