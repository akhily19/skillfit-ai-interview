import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ChevronRight, Brain, Volume2, Clock, Video } from 'lucide-react';
import { GlassCard, StepProgress } from '../components/shared';
import { interviewAPI } from '../utils/api';

const QUESTIONS = {
  English: [
    { id: 'q1', text: 'Please introduce yourself. Tell us your name, education, and background.' },
    { id: 'q2', text: 'What are your main skills and areas of expertise? How long have you been working in this field?' },
    { id: 'q3', text: 'Describe your previous work experience. What roles have you held before?' },
    { id: 'q4', text: 'Why should we select you for this opportunity? What makes you the right candidate?' },
  ],
  Hindi: [
    { id: 'q1', text: 'कृपया अपना परिचय दें। अपना नाम, शिक्षा और पृष्ठभूमि बताएं।' },
    { id: 'q2', text: 'आपके मुख्य कौशल क्या हैं? आप इस क्षेत्र में कितने समय से काम कर रहे हैं?' },
    { id: 'q3', text: 'अपने पिछले कार्य अनुभव का वर्णन करें। आपने पहले कौन से पद संभाले हैं?' },
    { id: 'q4', text: 'हमें आपको इस अवसर के लिए क्यों चुनना चाहिए?' },
  ],
  Kannada: [
    { id: 'q1', text: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳಿ. ನಿಮ್ಮ ಹೆಸರು, ಶಿಕ್ಷಣ ಮತ್ತು ಹಿನ್ನೆಲೆ ಹೇಳಿ.' },
    { id: 'q2', text: 'ನಿಮ್ಮ ಮುಖ್ಯ ಕೌಶಲ್ಯಗಳೇನು? ನೀವು ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ಎಷ್ಟು ವರ್ಷ ಕೆಲಸ ಮಾಡಿದ್ದೀರಿ?' },
    { id: 'q3', text: 'ನಿಮ್ಮ ಹಿಂದಿನ ಕೆಲಸದ ಅನುಭವ ವಿವರಿಸಿ. ನೀವು ಮೊದಲು ಯಾವ ಹುದ್ದೆ ಹೊಂದಿದ್ದಿರಿ?' },
    { id: 'q4', text: 'ನಾವು ನಿಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು? ನೀವು ಸರಿಯಾದ ಅಭ್ಯರ್ಥಿ ಏಕೆ?' },
  ],
};

const WAVE_COUNT = 24;

export default function InterviewPage() {
  const navigate = useNavigate();
  const candidate = JSON.parse(localStorage.getItem('skillfit_candidate') || '{}');
  const language = candidate.language || 'English';
  const questions = QUESTIONS[language] || QUESTIONS.English;

  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState('ai_speaking'); // ai_speaking | candidate_ready | recording | done
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sessionId, setSessionId] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [waveBars, setWaveBars] = useState(Array(WAVE_COUNT).fill(4));
  const videoRef = useRef(null);
const mediaRecorderRef = useRef(null);
const mediaStreamRef = useRef(null);
const recordedChunksRef = useRef([]);
  const speakQuestion = (text) => {
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
  setPhase('recording');
};

  speechSynthesis.speak(utterance);
};
const startRecording = () => {
  if (!mediaStreamRef.current) return;

  recordedChunksRef.current = [];

  const mediaRecorder = new MediaRecorder(mediaStreamRef.current);

  mediaRecorderRef.current = mediaRecorder;

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunksRef.current, {
      type: 'video/webm',
    });

    console.log('Recorded video:', blob);
  };

  mediaRecorder.start();
};
  useEffect(() => {
    // Start interview session
    const startSession = async () => {
      try {
        if (candidate.id) {
          const res = await interviewAPI.start(candidate.id);
          setSessionId(res.sessionId);
          localStorage.setItem('skillfit_session', res.sessionId);
        }
      } catch {}
    };
    startSession();
  }, []);
  useEffect(() => {
  const startCamera = async () => {
    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  startCamera();

  return () => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
  };
}, []);

  // AI "speaking" animation
useEffect(() => {
  if (phase === 'ai_speaking') {

    startRecording();

    speakQuestion(questions[currentQ].text);

  }
}, [phase, currentQ]);

  // Countdown before recording


  // Recording timer
  useEffect(() => {
    if (phase !== 'recording') return;
    const t = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(t); handleNextQuestion(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Waveform animation when mic active
  useEffect(() => {
    if (phase !== 'recording') return;
    setMicActive(true);
    const interval = setInterval(() => {
      setWaveBars(Array(WAVE_COUNT).fill(0).map(() => 4 + Math.random() * 32));
    }, 100);
    return () => { clearInterval(interval); setMicActive(false); };
  }, [phase]);

  const handleNextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setPhase('ai_speaking');
      setCountdown(3);
    } else {
      navigate('/record', { state: { sessionId } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Brain size={16} />
          </div>
          <span className="font-display font-bold text-white">SkillFit AI Interview</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm font-medium">{candidate.name}</span>
          <span className="ai-badge">{language}</span>
          {phase === 'recording' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 recording-dot" />
              <span className="text-red-400 text-xs font-semibold">REC</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-slate-800/30 flex items-center justify-between">
        <div className="flex gap-1.5 flex-1">
          {questions.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              i < currentQ ? 'bg-indigo-600' : i === currentQ ? 'bg-indigo-500/60' : 'bg-slate-700'
            }`} />
          ))}
        </div>
        <span className="ml-4 text-slate-400 text-xs font-medium whitespace-nowrap">
          Q {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0">
        {/* Left - AI Avatar */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            {/* AI Avatar */}
            <div className="relative mx-auto mb-6">
              <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mx-auto shadow-2xl transition-all duration-500 ${
                phase === 'ai_speaking' ? 'scale-110 glow-indigo pulse-ring' : ''
              }`}>
                <Brain size={52} className="text-white" />
              </div>

              {/* Status ring */}
              <div className={`absolute -inset-2 rounded-3xl border-2 transition-all duration-500 ${
                phase === 'ai_speaking' ? 'border-indigo-500/60 animate-ping' : 'border-transparent'
              }`} />

              {/* Voice indicator */}
              {phase === 'ai_speaking' && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-500/30">
                  <Volume2 size={10} className="text-indigo-400" />
                  <span className="text-indigo-300 text-xs font-medium">AI Speaking...</span>
                </div>
              )}
            </div>

            {/* AI Status */}
            <div className="mb-4">
              {phase === 'ai_speaking' && (
                <div className="flex justify-center gap-0.5 mb-2">
                  {Array(12).fill(0).map((_, i) => (
                    <div key={i} className="w-0.5 bg-indigo-400 rounded-full" style={{
                      height: `${8 + Math.sin(i * 0.7) * 12}px`,
                      animation: `wave ${0.8 + i * 0.05}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.06}s`
                    }} />
                  ))}
                </div>
              )}
              <p className="text-slate-300 text-sm font-medium">
                {phase === 'ai_speaking' ? 'SkillFit AI is reading your question...' :
                 phase === 'candidate_ready' ? `Get ready in ${countdown}...` :
                 phase === 'recording' ? 'Please answer the question clearly' : 'Great job!'}
              </p>
            </div>

            {/* Language indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300 text-xs">{language} Interview Mode</span>
            </div>
          </div>
        </div>

        {/* Right - Question + Recording */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <GlassCard className="p-3">
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    className="w-full rounded-2xl bg-black aspect-video object-cover"
  />
</GlassCard>
            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                      Q{currentQ + 1}
                    </span>
                    <span className="text-slate-500 text-xs">{language}</span>
                  </div>
                  <p className="text-white text-lg leading-relaxed font-medium">
                    {questions[currentQ].text}
                  </p>
                  <button
  onClick={() => speakQuestion(questions[currentQ].text)}
  className="mt-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
>
  <Volume2 size={16} />
  Replay Question
</button>
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            {/* Countdown / Recording Interface */}
            {phase === 'candidate_ready' && (
              <GlassCard className="p-6 text-center border border-amber-500/20 bg-amber-500/5">
                <div className="text-6xl font-display font-black text-amber-400 mb-2">{countdown}</div>
                <p className="text-amber-300 text-sm font-medium">Prepare your answer...</p>
              </GlassCard>
            )}

            {phase === 'recording' && (
              <GlassCard className="p-6">
                {/* Timer */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 recording-dot" />
                    <span className="text-red-400 text-sm font-semibold">Recording</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock size={14} />
                    <span className="font-mono font-bold text-lg">{String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}</span>
                  </div>
                </div>

                {/* Timer Progress */}
                <div className="progress-bar mb-4">
                  <div className="progress-fill" style={{ width: `${(timeLeft / 60) * 100}%` }} />
                </div>

                {/* Waveform */}
                <div className="flex items-center justify-center gap-0.5 h-10 mb-4">
                  {waveBars.map((h, i) => (
                    <div key={i} className="w-1 rounded-full bg-indigo-400 transition-all duration-100" style={{ height: h }} />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleNextQuestion}
                    className="btn-brand flex-1 flex items-center justify-center gap-2 py-3"
                  >
                    {currentQ < questions.length - 1 ? (
                      <>Next Question <ChevronRight size={16} /></>
                    ) : (
                      <>Complete Interview <Video size={16} /></>
                    )}
                  </button>
                </div>
              </GlassCard>
            )}

            {/* Skip (for demo) */}
            {phase === 'ai_speaking' && (
              <button onClick={() => setPhase('candidate_ready')} className="w-full py-2 text-slate-500 hover:text-slate-400 text-xs transition-colors">
                Skip waiting (Demo Mode)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
