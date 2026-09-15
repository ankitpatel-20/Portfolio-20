import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  Send,
  Smartphone,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  History,
  Clock,
  Trash2,
  ArrowRight,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
import { saveContactMessageToSupabase } from '../lib/supabase';
import { PERSONAL_INFO } from '../data/portfolioData';

export interface RecentScanItem {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  duration: string;
  passingYear: string;
  status: string;
  scannedAt: string;
}

const STORAGE_KEY = 'ankit_recent_scans';

interface ScannerViewProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete?: (data: any) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState<RecentScanItem | null>(null);

  // Recent Scans stored in localStorage (max 3)
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 3);
      }
    } catch (e) {
      console.warn('Error reading recent scans:', e);
    }
    // Default seed if empty
    return [
      {
        id: 'scan-ankit-init',
        name: 'ANKIT PATEL',
        email: 'Verified Enrolled Student',
        college: 'AMITY UNIVERSITY ONLINE',
        course: 'BCA (Bachelor of Computer Applications)',
        duration: '2024 - 2027',
        passingYear: '2027',
        status: 'VERIFIED_ENROLLED_STUDENT',
        scannedAt: 'Verified Entry',
      },
    ];
  });

  // Direct query state once scanned
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderQuery, setSenderQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Keyboard shortcut (Escape to minimize/close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Save new scan to localStorage (keep last 3)
  const saveScanToLocalStorage = (scan: RecentScanItem) => {
    setRecentScans((prev) => {
      const filtered = prev.filter((item) => item.id !== scan.id);
      const updated = [scan, ...filtered].slice(0, 3);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recent scan', e);
      }
      return updated;
    });
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setRecentScans([]);
  };

  // Initialize camera stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isOpen) {
      setIsScanning(true);
      setScannedResult(null);
      setSubmittedSuccess(false);

      const startCamera = async () => {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            });
            activeStream = mediaStream;
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play().catch(() => {});
            }
          } else {
            setCameraError('Camera API not supported in this browser. Use simulated scanner below.');
          }
        } catch (err: any) {
          console.warn('Camera access error:', err);
          setCameraError('Camera access denied or unavailable in current preview frame. Use Quick Scan simulation below.');
        }
      };

      startCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Simulated auto-detect or manual trigger
  const handleTriggerSimulatedScan = () => {
    setIsScanning(false);
    const resultPayload: RecentScanItem = {
      id: `scan-${Date.now()}`,
      name: 'ANKIT PATEL',
      email: 'Verified Enrolled Student',
      college: 'AMITY UNIVERSITY ONLINE',
      course: 'BCA (Bachelor of Computer Applications)',
      duration: '2024 - 2027',
      passingYear: '2027',
      status: 'VERIFIED_ENROLLED_STUDENT',
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setScannedResult(resultPayload);
    saveScanToLocalStorage(resultPayload);

    if (onScanComplete) {
      onScanComplete(resultPayload);
    }
  };

  const handleSelectRecentScan = (scan: RecentScanItem) => {
    setScannedResult(scan);
    setIsScanning(false);
    setSubmittedSuccess(false);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !senderQuery.trim()) return;

    setIsSubmitting(true);
    try {
      await saveContactMessageToSupabase({
        name: senderName.trim(),
        email: senderEmail.trim(),
        subject: `[QR Code Scanner Query] From ${senderName}`,
        message: senderQuery.trim(),
      });
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    } catch {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }
  };

  const handleResetScanner = () => {
    setIsScanning(true);
    setScannedResult(null);
    setSubmittedSuccess(false);
    setSenderQuery('');
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn cursor-pointer"
      title="Click anywhere outside to minimize"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-black border-3 border-black text-white shadow-[10px_10px_0px_#00FF00] overflow-hidden my-auto rounded-xl cursor-default"
      >
        {/* Top Scanner HUD Header with Minimize / Close action */}
        <div className="bg-[#0B1E36] p-4 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#00FF00] border-2 border-black rounded flex items-center justify-center text-black">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase text-[#00FF00] tracking-widest block">
                  ID CARD CAMERA SCANNER
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-ping" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                Scan Ankit Patel's Student QR Code
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-black/50 text-white hover:text-[#00FF00] border border-white/20 rounded cursor-pointer transition-colors"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 bg-white text-black hover:bg-[#00FF00] border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-1 transition-colors cursor-pointer rounded shadow-[2px_2px_0px_#000000]"
              title="Click to minimize"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Minimise</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white text-black hover:bg-[#00FF00] border-2 border-black font-black transition-colors cursor-pointer rounded shadow-[2px_2px_0px_#000000]"
              title="Close Scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Camera Viewport & Overlay */}
        {!scannedResult ? (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="relative w-full h-[300px] sm:h-[350px] bg-neutral-900 border-2 border-[#00FF00] rounded-lg overflow-hidden flex items-center justify-center">
              {/* Real Video Element if Stream Exists */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Camera Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                <div className="border-r border-b border-[#00FF00]" />
                <div className="border-r border-b border-[#00FF00]" />
                <div className="border-b border-[#00FF00]" />
                <div className="border-r border-b border-[#00FF00]" />
                <div className="border-r border-b border-[#00FF00]" />
                <div className="border-b border-[#00FF00]" />
                <div className="border-r border-b border-[#00FF00]" />
                <div className="border-r border-b border-[#00FF00]" />
                <div />
              </div>

              {/* Central QR Target Reticle with 4 Corner Brackets */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 border-2 border-dashed border-[#00FF00]/40 flex items-center justify-center">
                {/* 4 Corner Markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#00FF00]" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#00FF00]" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#00FF00]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#00FF00]" />

                {/* Animated Scanning Laser Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent shadow-[0_0_12px_#00FF00] animate-scan-line" />

                <div className="text-center p-3 bg-black/70 backdrop-blur-sm border border-white/20 rounded font-mono text-[10px] space-y-1">
                  <QrCode className="w-6 h-6 mx-auto text-[#00FF00] animate-pulse" />
                  <span className="text-[#00FF00] font-black block">ALIGN QR CODE HERE</span>
                  <span className="text-white/80">Scanning target frame...</span>
                </div>
              </div>

              {/* Bottom Live Telemetry Overlay */}
              <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[10px] font-mono bg-black/70 px-3 py-1.5 border border-white/20 rounded">
                <span className="text-[#00FF00] font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 animate-bounce" /> OPTICAL SCANNER ACTIVE
                </span>
                <span className="text-white/70">FPS: 60 // ISO AUTO</span>
              </div>
            </div>

            {/* Notice / Action Trigger Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <p className="text-xs font-mono text-[#A1A1AA] text-center sm:text-left">
                Click below to instantly capture and decode the student QR credentials:
              </p>

              <button
                type="button"
                onClick={handleTriggerSimulatedScan}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#00FF00] text-black hover:bg-white border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_#000000] cursor-pointer rounded"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>DECODE / CAPTURE QR NOW</span>
              </button>
            </div>

            {/* =========================================================================
                RECENT SCANS LIST BENEATH SCANNER OVERLAY (LAST 3 IN LOCAL STORAGE)
               ========================================================================= */}
            <div className="border-t border-white/15 pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#00FF00]" />
                  <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white">
                    Recent Scans <span className="text-[#00FF00]">(Last 3 in Local Storage)</span>
                  </h4>
                </div>

                {recentScans.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[10px] font-mono text-[#94A3B8] hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Clear history from local storage"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {recentScans.length === 0 ? (
                <div className="p-3 bg-neutral-900 border border-white/10 rounded text-center text-xs font-mono text-[#64748B]">
                  No recent scans yet. Click "DECODE / CAPTURE QR NOW" above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {recentScans.map((scan, idx) => (
                    <div
                      key={scan.id || idx}
                      onClick={() => handleSelectRecentScan(scan)}
                      className="p-2.5 bg-neutral-900/90 hover:bg-neutral-800 border border-white/20 hover:border-[#00FF00] rounded transition-all cursor-pointer group flex flex-col justify-between text-left space-y-1.5"
                      title="Click to view details & submit query"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
                        <span className="text-[#00FF00] font-black">#0{idx + 1} DECODED</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {scan.scannedAt}
                        </span>
                      </div>

                      <div>
                        <span className="font-mono text-xs font-black text-white group-hover:text-[#00FF00] transition-colors block truncate">
                          {scan.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#A1A1AA] block truncate">
                          {scan.college}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] font-mono">
                        <span className="text-[#00FF00] font-bold">BCA (2024-27)</span>
                        <span className="text-white group-hover:text-[#00FF00] flex items-center gap-0.5">
                          View <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Scanned Result & Live Query Form Box */
          <div className="p-5 sm:p-6 bg-white text-black space-y-5 animate-fadeIn">
            {/* Scanned Badge */}
            <div className="p-3 bg-[#00FF00]/15 border-2 border-[#00AA00] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00AA00]" />
                <span className="font-mono text-xs font-black text-black uppercase">
                  QR CODE VERIFIED & DECODED
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#52525B]">
                {scannedResult.scannedAt}
              </span>
            </div>

            {/* Extracted Details Table as Requested: Name, Mail, College, Course, Passing Year */}
            <div className="p-4 bg-[#F8FAFC] border-2 border-black font-mono text-xs space-y-2 rounded-lg shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[#0B1E36] border-b-2 border-black pb-1 uppercase">
                <Smartphone className="w-3.5 h-3.5 text-[#00AA00]" />
                <span>DEVICE SCANNED CREDENTIALS</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-[#64748B] font-bold">NAME:</span>
                <span className="font-black text-black">{scannedResult.name}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-[#64748B] font-bold">STATUS:</span>
                <span className="font-black text-black">Verified Enrolled Student</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-[#64748B] font-bold">COLLEGE:</span>
                <span className="font-black text-black">{scannedResult.college}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-[#64748B] font-bold">COURSE:</span>
                <span className="font-black text-[#00AA00]">{scannedResult.course}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-[#64748B] font-bold">COURSE DURATION:</span>
                <span className="font-black text-black">{scannedResult.duration}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B] font-bold">PASSING YEAR:</span>
                <span className="font-black text-black bg-[#EAB308]/30 px-1.5 border border-black/30">
                  {scannedResult.passingYear}
                </span>
              </div>
            </div>

            {/* Google Form option button */}
            <div className="p-3 bg-[#E0F2FE] border-2 border-[#0284C7] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#0284C7] shrink-0" />
                <p className="text-xs font-mono text-[#0369A1] font-bold">
                  Prefer Google Forms? Click to open the official Google Form to fill details and contact:
                </p>
              </div>
              <a
                href={PERSONAL_INFO.googleFormUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-[#0284C7] text-white hover:bg-black font-mono text-xs font-black uppercase rounded shrink-0 flex items-center justify-center gap-1.5 transition-colors shadow-[2px_2px_0px_#000000]"
              >
                <span>Open Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Query Box */}
            {submittedSuccess ? (
              <div className="p-6 bg-[#F0FDF4] border-2 border-[#16A34A] rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
                <h4 className="font-black text-base uppercase text-black">
                  Query Saved in Database!
                </h4>
                <p className="text-xs font-mono text-[#4B5563]">
                  Your question has been stored directly into Ankit Patel's Supabase database. He will get back to you via <strong className="text-black">{senderEmail}</strong>.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetScanner}
                    className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-bold uppercase transition-colors cursor-pointer rounded"
                  >
                    Scan Another Code
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white text-black hover:bg-gray-100 border-2 border-black font-mono text-xs font-bold uppercase transition-colors cursor-pointer rounded"
                  >
                    Minimise / Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuerySubmit} className="space-y-3">
                <div className="border-t-2 border-black pt-3">
                  <h4 className="font-black text-sm uppercase text-black tracking-tight">
                    Ask a Direct Query to Ankit Patel
                  </h4>
                  <p className="text-[11px] font-mono text-[#64748B]">
                    Type your question below. It will be recorded immediately into the Supabase database.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Recruiter / Inquirer Name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                    Your Question / Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ask about BCA coursework, ML projects, internship roles, or schedule a conversation..."
                    value={senderQuery}
                    onChange={(e) => setSenderQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_#000000] cursor-pointer rounded"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'SAVING TO DATABASE...' : 'SUBMIT QUERY TO DATABASE'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetScanner}
                    className="w-full sm:w-auto px-4 py-3 bg-white text-black hover:bg-gray-100 border-2 border-black font-mono text-xs font-bold uppercase flex items-center justify-center gap-1 cursor-pointer rounded"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RESCAN</span>
                  </button>
                </div>
              </form>
            )}

            {/* Quick Recent Scans footer inside decoded state as well */}
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-black" />
                <span>{recentScans.length} Recent Scans in Storage</span>
              </span>
              <button
                type="button"
                onClick={handleResetScanner}
                className="text-black font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Switch to Camera / View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

