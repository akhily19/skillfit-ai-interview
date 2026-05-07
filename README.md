# 🧠 SkillFit AI — Scalable Video-Based Candidate Assessment & Workforce Classification System

> **Government-Grade AI Platform** for multilingual video interview assessment and workforce intelligence.
> Built for Karnataka Skill Development Mission.

---

## 🚀 Live Demo

| Flow | URL |
|------|-----|
| Candidate Interview | `/` → `/register` → `/language` → `/interview` → `/processing` → `/result` |
| Admin Dashboard | `/admin/login` → `/admin/dashboard` → `/admin/analytics` → `/admin/fraud` |

**Demo Admin Credentials:**
- Email: `admin@skillfit.gov.in`
- Password: `Admin@123456`

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

---

## ✨ Features

### Candidate Flow
- 📱 Mobile-first video interview interface
- 🌐 Multilingual support (Kannada, Hindi, English)
- 🎙️ AI-powered audio transcription (OpenAI Whisper)
- 🤖 GPT-4o assessment across 4 dimensions
- 🎯 Instant candidate classification
- 📊 Detailed score breakdown report

### AI Assessment Engine
- **Communication Score** — clarity, fluency, articulation
- **Confidence Score** — tone, pacing, directness
- **Skill Relevance Score** — domain knowledge match
- **Authenticity Score** — genuine responses vs scripted

### Classification System
| Classification | Criteria |
|---------------|----------|
| 🚀 **Job Ready** | Overall Score ≥ 80 |
| 📈 **Needs Training** | Score 50–79 |
| 🔍 **Manual Verification** | Score 30–49 |
| ⚠️ **Fraud Suspected** | Score < 30 or fraud indicators |

### Fraud Detection
- Multiple faces detected via face-api.js
- Audio quality analysis
- Off-screen gaze detection
- Suspicious activity patterns
- Duplicate candidate identification

### Admin Portal
- 📊 Real-time command dashboard with KPIs
- 📈 Analytics: classification, skill, language, district charts
- 🛡️ Fraud monitoring center
- 👤 Candidate review with video + transcript + AI summary
- 📝 Recruiter notes and review workflow

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | SPA Framework |
| Tailwind CSS | Utility-first Styling |
| Framer Motion | Animations & Transitions |
| Recharts | Data Visualisation |
| Lucide Icons | Icon Library |
| React Webcam | Video Recording |
| face-api.js | Client-side Face Detection |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API Server |
| MongoDB Atlas | Primary Database |
| Mongoose | ODM |
| OpenAI Whisper | Audio Transcription |
| OpenAI GPT-4o | Candidate Assessment |
| Cloudinary | Video Storage |
| Multer | File Upload |
| JWT | Authentication |
| bcryptjs | Password Hashing |

---

## 📁 Project Structure

```
skillfit-ai/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Hero + features + CTA
│   │   │   ├── RegisterPage.jsx     # Candidate registration form
│   │   │   ├── LanguagePage.jsx     # Language selection (EN/HI/KN)
│   │   │   ├── InterviewPage.jsx    # AI avatar + Q&A interface
│   │   │   ├── RecordingPage.jsx    # Webcam video recording
│   │   │   ├── ProcessingPage.jsx   # AI pipeline animation
│   │   │   ├── ResultPage.jsx       # Score report + classification
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx       # Secure admin login
│   │   │       ├── AdminDashboard.jsx   # KPIs + charts + table
│   │   │       ├── AnalyticsPage.jsx    # Deep analytics
│   │   │       ├── FraudPage.jsx        # Fraud monitoring
│   │   │       └── CandidateReview.jsx  # Full candidate detail
│   │   ├── components/shared/
│   │   │   ├── index.jsx            # GlassCard, ScoreRing, etc.
│   │   │   ├── AdminSidebar.jsx     # Admin navigation
│   │   │   └── AdminRoute.jsx       # Protected route guard
│   │   ├── utils/api.js             # Axios API client
│   │   ├── App.jsx                  # Router setup
│   │   └── index.css                # Global styles + animations
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── Candidate.js         # Candidate schema
│   │   │   └── models.js            # Interview, Assessment, Fraud, Admin
│   │   ├── routes/
│   │   │   ├── auth.js              # /api/auth/*
│   │   │   ├── candidate.js         # /api/candidates/*
│   │   │   ├── interview.js         # /api/interviews/*
│   │   │   ├── analysis.js          # /api/analysis/*
│   │   │   └── dashboard.js         # /api/dashboard/*
│   │   ├── services/
│   │   │   ├── aiService.js         # Whisper + GPT-4 integration
│   │   │   ├── scoringEngine.js     # Classification logic
│   │   │   └── cloudinaryService.js # Video upload helpers
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT middleware
│   │   │   └── upload.js            # Multer + Cloudinary
│   │   └── server.js                # Express app entry
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- OpenAI API key

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/skillfit-ai.git
cd skillfit-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 4. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates a default admin account with credentials from `.env`.

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@skillfit.gov.in
ADMIN_PASSWORD=Admin@123456
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |
| POST | `/api/auth/logout` | Logout |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates/register` | Register candidate |
| GET | `/api/candidates` | List all (admin) |
| GET | `/api/candidates/:id` | Get candidate detail |
| PATCH | `/api/candidates/:id/notes` | Add recruiter notes |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews/start` | Start interview session |
| POST | `/api/interviews/:sessionId/upload-answer` | Upload video answer |
| POST | `/api/interviews/:sessionId/complete` | Complete interview |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/process` | Run full AI pipeline |
| GET | `/api/analysis/:candidateId` | Get assessment |
| GET | `/api/analysis/fraud/reports` | Get fraud reports |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | KPI statistics |
| GET | `/api/dashboard/classification-breakdown` | Pie chart data |
| GET | `/api/dashboard/skill-distribution` | Bar chart data |
| GET | `/api/dashboard/daily-registrations` | Line chart data |

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
# Or: vercel --prod
```

**Vercel Settings:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render

1. Create new **Web Service** on Render
2. Connect your GitHub repo
3. Set:
   - Root directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add all environment variables from `.env`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Indigo (#6366f1) |
| Secondary | Purple (#8b5cf6) |
| Accent | Cyan (#22d3ee) |
| Background | Slate-950 (#0a0f1e) |
| Card | Glassmorphism (rgba + backdrop-blur) |
| Font Display | Syne |
| Font Body | DM Sans |

---

## 📱 Responsive Breakpoints

- Mobile: 375px+ (primary candidate interface)
- Tablet: 768px+
- Desktop: 1280px+ (admin dashboard)

---

## 🔒 Security Features

- JWT-based authentication with expiry
- Rate limiting (200 req/15 min)
- Password hashing (bcryptjs, 12 rounds)
- CORS configured per environment
- File type validation for uploads
- Input sanitization via express-validator

---

## 👨‍💻 Development Notes

- **Mock Mode**: All AI calls fall back to realistic mocks when API keys are not set
- **Demo Mode**: Frontend works fully without backend (uses localStorage + mock data)
- **Face Detection**: Uses face-api.js on client-side — loads models from CDN
- **Video Recording**: Uses react-webcam + MediaRecorder API

---

## 📄 License

Government of Karnataka · Karnataka Skill Development Mission
Built for internal use. Not for redistribution.

---

*Built with ❤️ for the SkillFit AI Hackathon — 2024*
