// RecordingPage.jsx
import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, RefreshCw, CheckCircle, AlertTriangle, Video, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/shared';

export function RecordingPage() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [faceOk, setFaceOk] = useState(true);
  const [lightOk, setLightOk] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch {}
  };

  const handleRecord = () => {
    if (!recording) {
      startCamera();
      setRecording(true);
      setTimeout(() => { setRecording(false); setRecorded(true); }, 5000);
    }
  };

  const handleSubmit = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    navigate('/processing');
  };

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex flex-col items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Video Submission</h1>
          <p className="text-slate-400 text-sm">Record or upload your complete interview response</p>
        </div>

        <GlassCard className="p-6">
          {/* Webcam preview */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video mb-6 border border-slate-700/50">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!recording && !recorded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Video size={48} className="text-slate-600" />
                <p className="text-slate-500 text-sm">Camera preview will appear here</p>
              </div>
            )}
            {recording && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 recording-dot" />
                <span className="text-red-400 text-xs font-bold">RECORDING</span>
              </div>
            )}
            {recorded && (
              <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle size={48} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-semibold">Recording Complete</p>
                </div>
              </div>
            )}
          </div>

          {/* Face detection indicators */}
          <div className="flex gap-3 mb-5">
            {[
              { ok: faceOk, label: 'Face Detected', ok_msg: 'Face visible', fail_msg: 'No face' },
              { ok: lightOk, label: 'Good Lighting', ok_msg: 'Well lit', fail_msg: 'Poor lighting' },
              { ok: true, label: 'Audio Active', ok_msg: 'Mic working', fail_msg: 'No audio' },
            ].map((c, i) => (
              <div key={i} className={`flex-1 p-2 rounded-xl border text-center ${c.ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                {c.ok ? <CheckCircle size={14} className="text-emerald-400 mx-auto mb-0.5" /> : <AlertTriangle size={14} className="text-red-400 mx-auto mb-0.5" />}
                <p className={`text-xs font-medium ${c.ok ? 'text-emerald-400' : 'text-red-400'}`}>{c.ok ? c.ok_msg : c.fail_msg}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!recorded ? (
              <button onClick={handleRecord} disabled={recording}
                className={`btn-brand flex-1 flex items-center justify-center gap-2 py-3.5 ${recording ? 'opacity-70' : ''}`}>
                {recording ? <><span className="w-2 h-2 rounded-full bg-white recording-dot" />Recording...</> : <><Camera size={18} />Start Recording</>}
              </button>
            ) : (
              <>
                <button onClick={() => setRecorded(false)}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-600 transition-all text-sm">
                  <RefreshCw size={16} /> Re-record
                </button>
                <button onClick={handleSubmit} className="btn-brand flex-1 flex items-center justify-center gap-2 py-3.5">
                  Submit & Process <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <button onClick={handleSubmit} className="w-full mt-4 py-3 flex items-center justify-center gap-2 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-sm">
            <Upload size={16} /> Skip & Submit (Demo Mode)
          </button>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default RecordingPage;
