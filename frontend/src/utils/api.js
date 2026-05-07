import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillfit_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillfit_admin_token');
      localStorage.removeItem('skillfit_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ─── Auth APIs ──────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// ─── Candidate APIs ─────────────────────────────────────────────
export const candidateAPI = {
  register: (data) => api.post('/candidates/register', data),
  getAll: (params) => api.get('/candidates', { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  updateNotes: (id, notes) => api.patch(`/candidates/${id}/notes`, { notes }),
  updateStatus: (id, status) => api.patch(`/candidates/${id}/status`, { status }),
};

// ─── Interview APIs ─────────────────────────────────────────────
export const interviewAPI = {
  start: (candidateId) => api.post('/interviews/start', { candidateId }),
  uploadAnswer: (sessionId, formData) => api.post(`/interviews/${sessionId}/upload-answer`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  complete: (sessionId, data) => api.post(`/interviews/${sessionId}/complete`, data),
  getByCandidate: (candidateId) => api.get(`/interviews/candidate/${candidateId}`),
};

// ─── Analysis APIs ──────────────────────────────────────────────
export const analysisAPI = {
  process: (data) => api.post('/analysis/process', data),
  getAssessment: (candidateId) => api.get(`/analysis/${candidateId}`),
  getFraudReports: (params) => api.get('/analysis/fraud/reports', { params }),
};

// ─── Dashboard APIs ─────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getClassificationBreakdown: () => api.get('/dashboard/classification-breakdown'),
  getSkillDistribution: () => api.get('/dashboard/skill-distribution'),
  getLanguageUsage: () => api.get('/dashboard/language-usage'),
  getDailyRegistrations: () => api.get('/dashboard/daily-registrations'),
  getAvgScoresByCategory: () => api.get('/dashboard/avg-scores-by-category'),
  getDistrictBreakdown: () => api.get('/dashboard/district-breakdown'),
};

export default api;
