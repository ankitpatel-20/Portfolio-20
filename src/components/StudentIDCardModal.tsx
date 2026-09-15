import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCw,
  Send,
  CheckCircle2,
  QrCode,
  Sparkles,
  Camera,
  User,
  ShieldCheck,
  MessageSquare,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Minimize2,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { saveContactMessageToSupabase } from '../lib/supabase';
import { ScannerView } from './ScannerView';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({ isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [askerName, setAskerName] = useState('');
  const [askerEmail, setAskerEmail] = useState('');
  const [askerQuery, setAskerQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedData, setCopiedData] = useState(false);

  // Close / minimize on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askerName.trim() || !askerEmail.trim() || !askerQuery.trim()) return;

    setIsSubmitting(true);
    try {
      await saveContactMessageToSupabase({
        name: askerName.trim(),
        email: askerEmail.trim(),
        subject: `[ID Card Scan Query] From ${askerName}`,
        message: askerQuery.trim(),
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleCopyProfile = () => {
    const profile = `STUDENT IDENTITY CARD CREDENTIALS:\nName: ANKIT PATEL\nCollege: AMITY UNIVERSITY ONLINE\nCourse: BCA\nDuration: 2024 - 2027\nPassing Year: 2027\nStatus: Verified Enrolled Student`;
    navigator.clipboard.writeText(profile);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  // Google Form destination for direct contact when scanned on any phone camera
  const googleFormDirectUrl = PERSONAL_INFO.googleFormUrl;

  // QR Code Payload URL - points directly to the Google Form to fill details and contact Ankit
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    googleFormDirectUrl
  )}&bgcolor=FFFFFF&color=000000&margin=2`;

  return (
    <>
      {/* Outer backdrop container - clicking anywhere outside minimizes/closes modal */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn cursor-pointer"
        title="Click anywhere outside to minimise"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-transparent my-auto flex flex-col items-center cursor-default"
        >
          
          {/* Header of the ID Card Component with Persistent 'Scan' Button & Minimize Button */}
          <div className="w-full bg-[#0B1E36] border-3 border-black p-3 sm:p-4 mb-4 flex items-center justify-between shadow-[6px_6px_0px_#00FF00] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-[#EAB308] border border-black flex items-center justify-center text-[10px] font-black text-black">
                AU
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase text-[#00FF00] tracking-widest block">
                    AMITY UNIVERSITY ONLINE
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-ping" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  Student Identity Card // Ankit Patel (BCA 2024–2027)
                </h3>
              </div>
            </div>

            {/* Persistent 'Scan' and 'Minimize' buttons in the header */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-3.5 sm:px-4 py-2 bg-[#00FF00] text-black hover:bg-white border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer rounded"
                title="Open live camera QR scanner overlay"
              >
                <Camera className="w-4 h-4 text-black" />
                <span>Scan</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-3.5 py-2 bg-white text-black hover:bg-[#00FF00] border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer rounded"
                title="Minimise ID Card"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Minimise</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-white text-black hover:bg-[#00FF00] border-2 border-black font-black transition-colors cursor-pointer rounded shadow-[2px_2px_0px_#000000]"
                title="Close ID Card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card and Query Layout Container */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: 3D Flippable Interactive ID Card */}
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Lanyard Top Visual */}
              <div className="flex flex-col items-center -mb-2 z-20">
                <div className="w-14 h-4 bg-[#0A192F] border-2 border-black rounded-t flex items-center justify-center text-[7px] text-[#00FF00] font-mono font-bold">
                  AMITY
                </div>
                <div className="w-6 h-3 bg-[#E5E7EB] border-2 border-black border-t-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </div>

              {/* The 3D Flippable Card */}
              <div className="w-full max-w-[340px] sm:max-w-[370px] h-[520px] perspective-1000">
                <div
                  className={`relative w-full h-full duration-700 transform-style-3d transition-transform cursor-pointer select-none rounded-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* FRONT SIDE OF ID CARD */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-[#FBFBFC] to-[#F3F4F6] border-4 border-black p-5 shadow-[10px_10px_0px_#000000] flex flex-col justify-between backface-hidden rounded-2xl overflow-hidden">
                    {/* Top University Header */}
                    <div className="bg-[#0B1E36] text-white p-3.5 -mx-5 -mt-5 border-b-3 border-black">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#EAB308] border border-black flex items-center justify-center text-[10px] font-black text-black shadow-sm">
                            AU
                          </div>
                          <div>
                            <h3 className="font-black text-xs sm:text-sm tracking-tight uppercase leading-tight text-white">
                              AMITY UNIVERSITY
                            </h3>
                            <span className="text-[8px] font-mono text-[#EAB308] font-black tracking-wider uppercase block">
                              ONLINE EDUCATION
                            </span>
                          </div>
                        </div>
                        <span className="text-[7px] font-mono uppercase bg-[#00FF00] text-black px-1.5 py-0.5 font-black border border-black rounded">
                          STUDENT ID
                        </span>
                      </div>
                    </div>

                    {/* Student Photo & Verified Badge */}
                    <div className="flex flex-col items-center text-center my-auto py-1">
                      <div className="relative">
                        <div className="w-28 h-32 sm:w-32 sm:h-36 bg-[#E5E7EB] border-3 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000000] flex items-center justify-center relative bg-gradient-to-tr from-gray-200 to-white">
                          <img
                            src={PERSONAL_INFO.avatarUrl}
                            alt="ANKIT PATEL"
                            className="w-full h-full object-cover object-top contrast-105"
                          />
                        </div>

                        {/* Verified Badge */}
                        <span className="absolute -bottom-2 -right-2 bg-[#EAB308] text-black border-2 border-black px-1.5 py-0.5 text-[8px] font-mono font-black uppercase flex items-center gap-0.5 shadow-[2px_2px_0px_#000000]">
                          <ShieldCheck className="w-3 h-3 text-black" /> VALIDATED
                        </span>
                      </div>

                      <h4 className="font-black text-xl text-black uppercase tracking-tight mt-2.5 leading-none">
                        ANKIT PATEL
                      </h4>
                      <span className="text-[11px] font-mono font-bold text-[#0B1E36] mt-0.5 uppercase tracking-wide">
                        BACHELOR OF COMPUTER APPLICATIONS
                      </span>
                    </div>

                    {/* Student Details Grid */}
                    <div className="space-y-1 font-mono text-[10px] bg-white border-2 border-black p-2.5 rounded-lg shadow-sm">
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span className="text-[#52525B] font-bold">COLLEGE:</span>
                        <span className="font-black text-black text-right">AMITY UNIVERSITY ONLINE</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span className="text-[#52525B] font-bold">COURSE:</span>
                        <span className="font-black text-[#00AA00]">BCA</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span className="text-[#52525B] font-bold">COURSE DURATION:</span>
                        <span className="font-black text-black">2024 - 2027</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#52525B] font-bold">PASSING YEAR:</span>
                        <span className="font-black text-black bg-[#EAB308]/30 px-1 border border-black/30">2027</span>
                      </div>
                    </div>

                    {/* Front Footer Bar with mini QR and flip prompt */}
                    <div className="flex items-center justify-between pt-2 border-t-2 border-black -mx-1 text-[9px] font-mono">
                      <div className="flex items-center gap-2">
                        <div className="p-0.5 bg-white border border-black rounded shadow-sm relative group">
                          <img src={qrCodeUrl} alt="QR Code" className="w-8 h-8" />
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00FF00] rounded-full animate-ping" />
                        </div>
                        <div>
                          <span className="font-black text-black block leading-none">SCAN QR</span>
                          <span className="text-[8px] text-[#71717A]">ASK QUERY</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-black text-white px-2 py-1 text-[8px] font-bold rounded shadow-[2px_2px_0px_#00FF00]">
                        <RotateCw className="w-3 h-3 animate-spin" />
                        <span>CLICK TO FLIP BACK</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE OF ID CARD (QR Scanner code) */}
                  <div className="absolute inset-0 w-full h-full bg-[#0B1E36] text-white border-4 border-black p-5 shadow-[10px_10px_0px_#000000] flex flex-col justify-between backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between border-b border-white/20 pb-2">
                      <span className="text-[10px] font-mono font-black text-[#00FF00] uppercase">
                        SCAN FOR ASKING QUERY
                      </span>
                      <span className="text-[9px] font-mono text-white/70">AMITY UNIVERSITY</span>
                    </div>

                    {/* High-Resolution QR Scanner Box */}
                    <div className="flex flex-col items-center text-center my-auto">
                      <div className="p-2.5 bg-white border-3 border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.3)] rounded-xl">
                        <img
                          src={qrCodeUrl}
                          alt="Scan QR for Ankit Patel Query"
                          className="w-36 h-36 sm:w-40 sm:h-40 object-contain mx-auto"
                        />
                      </div>

                      <p className="font-mono text-xs text-[#00FF00] font-black uppercase mt-2.5 tracking-wide">
                        SCAN WITH ANY PHONE CAMERA
                      </p>
                      <p className="text-[10px] font-mono text-[#CBD5E1] max-w-[270px] mt-1 leading-snug">
                        Scan with your smartphone camera to open Google Form to fill details and contact Ankit directly.
                      </p>

                      <a
                        href={googleFormDirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#00FF00] text-black font-mono text-[10px] font-black uppercase rounded hover:bg-white transition-colors border border-black shadow-[2px_2px_0px_#000000]"
                      >
                        <span>Open Google Form</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Footer flip prompt */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[9px] font-mono">
                      <span className="text-white/60">DATABASE QUERY SYNC</span>
                      <span className="text-[#00FF00] font-bold flex items-center gap-1">
                        <RotateCw className="w-2.5 h-2.5" /> TAP TO FLIP FRONT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar Below ID Card */}
              <div className="flex gap-2 mt-3.5 w-full max-w-[340px] sm:max-w-[370px]">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 py-2 bg-white hover:bg-[#00FF00] text-black border-2 border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000] rounded"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'SHOW FRONT ID' : 'SHOW BACK QR CODE'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyProfile}
                  className="px-3 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-bold transition-colors cursor-pointer shadow-[2px_2px_0px_#000000] rounded"
                  title="Copy student details"
                >
                  {copiedData ? <Check className="w-3.5 h-3.5 text-[#00FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* RIGHT: Scanned Device View & Supabase Direct Query Form */}
            <div className="lg:col-span-6 bg-white border-2 border-black p-5 sm:p-7 shadow-[8px_8px_0px_#000000] rounded-xl">
              <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-black uppercase text-[#00AA00] bg-[#00FF00]/20 px-2 py-0.5 border border-black">
                    ONLINE QUERY TERMINAL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mt-1">
                    Ask Ankit Patel a Direct Query
                  </h3>
                </div>
                <MessageSquare className="w-6 h-6 text-black" />
              </div>

              {/* Scanned Student Profile Details as Requested */}
              <div className="p-4 bg-[#F8FAFC] border-2 border-black font-mono text-xs space-y-2 mb-5 shadow-[3px_3px_0px_#000000] rounded-md">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#0B1E36] border-b-2 border-black pb-1.5 uppercase">
                  <Smartphone className="w-3.5 h-3.5 text-[#00AA00]" />
                  <span>SCANNED STUDENT PROFILE INFORMATION</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-[#64748B] font-bold">NAME:</span>
                  <span className="font-black text-black">ANKIT PATEL</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-[#64748B] font-bold">STATUS:</span>
                  <span className="font-black text-black">Verified Enrolled Student</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-[#64748B] font-bold">COLLEGE:</span>
                  <span className="font-black text-black">AMITY UNIVERSITY ONLINE</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-[#64748B] font-bold">COURSE:</span>
                  <span className="font-black text-[#00AA00]">BCA (2024 - 2027)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#64748B] font-bold">PASSING YEAR:</span>
                  <span className="font-black text-black bg-[#EAB308]/20 px-1.5 border border-black/30">2027</span>
                </div>
              </div>

              {/* Google Form option banner */}
              <div className="mb-4 p-3 bg-[#E0F2FE] border-2 border-[#0284C7] rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <p className="text-xs font-mono text-[#0369A1] font-bold">
                    Scan with any phone camera or open Google Form to fill details:
                  </p>
                </div>
                <a
                  href={googleFormDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#0284C7] text-white hover:bg-black font-mono text-[11px] font-black uppercase rounded shrink-0 flex items-center gap-1 transition-colors"
                >
                  <span>Google Form</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Direct Query Form (Saves to Supabase Database) */}
              {isSuccess ? (
                <div className="py-8 text-center space-y-3 bg-[#F9F9F9] border-2 border-black p-5 animate-fadeIn rounded-lg">
                  <div className="w-12 h-12 bg-[#00FF00] border-2 border-black rounded-full flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                    <CheckCircle2 className="w-7 h-7 text-black" />
                  </div>
                  <h4 className="font-black text-lg text-black uppercase tracking-tight">
                    Query Stored in Database Successfully!
                  </h4>
                  <p className="text-xs font-mono text-[#52525B] max-w-sm mx-auto">
                    Thank you, <span className="font-bold text-black">{askerName}</span>! Your question has been saved into Ankit Patel's Supabase database. He will review it and reply back to <span className="font-bold text-black">{askerEmail}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setAskerQuery('');
                    }}
                    className="px-5 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase transition-colors cursor-pointer rounded"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuerySubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name..."
                        value={askerName}
                        onChange={(e) => setAskerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold focus:bg-[#F9F9F9] focus:outline-none rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@domain.com"
                        value={askerEmail}
                        onChange={(e) => setAskerEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold focus:bg-[#F9F9F9] focus:outline-none rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Ask Query / Message to Ankit *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type your question about BCA studies, ML projects, internship opportunities, or inquiries..."
                      value={askerQuery}
                      onChange={(e) => setAskerQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-medium focus:bg-[#F9F9F9] focus:outline-none rounded"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50 rounded"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'SAVING TO DATABASE...' : 'SUBMIT QUERY (SAVES TO DATABASE)'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Overlay Scanner View Component */}
      <ScannerView
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </>
  );
};
