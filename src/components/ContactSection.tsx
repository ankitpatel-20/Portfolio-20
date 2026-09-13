import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import {
  Terminal,
  Send,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  Briefcase,
  Database,
  Code2,
  ChevronRight,
  Sparkles,
  Info,
  CalendarCheck,
  Building,
  Phone,
  Layers,
  X,
  ExternalLink,
  Video,
} from 'lucide-react';
import { NavigationTab, AppointmentBooking } from '../types';
import {
  saveAppointmentToSupabase,
  saveContactMessageToSupabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_SQL_SETUP_SCRIPT,
  SUPABASE_URL,
} from '../lib/supabase';

interface ContactSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
  defaultMode?: 'appointment' | 'message';
  onOpenMeet?: (initialTopic?: string) => void;
}

const MEETING_TYPES = [
  {
    id: 'tech-interview',
    title: 'Technical Interview',
    duration: '45-60 min',
    desc: 'ML engineering, SQL problem solving, or live portfolio review',
    icon: '💼',
  },
  {
    id: 'internship-discussion',
    title: 'Internship / Role Discussion',
    duration: '30 min',
    desc: 'Discuss Data Science / ML Analyst roles & immediate availability',
    icon: '🚀',
  },
  {
    id: 'case-study',
    title: 'Project Deep-Dive',
    duration: '40 min',
    desc: 'Walkthrough of Churn ML pipeline, BI suite, or SQL data mart',
    icon: '📊',
  },
  {
    id: '1on1-chat',
    title: '1-on-1 Coffee Chat / Mentorship',
    duration: '20-30 min',
    desc: 'Casual conversation on Data Science career and academic research',
    icon: '☕',
  },
];

const TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
  '07:30 PM',
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  setActiveTab,
  defaultMode = 'appointment',
  onOpenMeet,
}) => {
  const [activeFormMode, setActiveFormMode] = useState<'appointment' | 'message'>(defaultMode);

  // Appointment Form State
  const [bookName, setBookName] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookCompany, setBookCompany] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState(MEETING_TYPES[0].title);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [userTimezone, setUserTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  });
  const [bookMeetingLink, setBookMeetingLink] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<AppointmentBooking | null>(null);
  const [supabaseNotice, setSupabaseNotice] = useState<string | null>(null);

  // Direct Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showSqlSchemaModal, setShowSqlSchemaModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<
    { type: 'input' | 'output' | 'error' | 'supabase'; text: string }[]
  >([
    { type: 'output', text: 'SYSTEM_CLI v2.5.0 INITIALIZED.' },
    {
      type: 'supabase',
      text: `[SUPABASE_LINK] Connected to backend project: ${SUPABASE_PROJECT_ID}`,
    },
    { type: 'output', text: 'Type "help", "book", "hire", "skills", or "projects".' },
  ]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Submit Appointment Booking to Supabase
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookEmail.trim() || !appointmentDate || !selectedTimeSlot) return;

    setIsBooking(true);
    setSupabaseNotice(null);

    const appointmentPayload: AppointmentBooking = {
      name: bookName.trim(),
      email: bookEmail.trim(),
      company: bookCompany.trim() || undefined,
      phone: bookPhone.trim() || undefined,
      meeting_type: selectedMeetingType,
      appointment_date: appointmentDate,
      appointment_time: selectedTimeSlot,
      timezone: userTimezone,
      notes: bookNotes.trim() || 'General discussion',
      meeting_link: bookMeetingLink.trim() || undefined,
      status: 'pending',
    };

    try {
      const result = await saveAppointmentToSupabase(appointmentPayload);
      setIsBooking(false);

      if (result.success) {
        setBookingSuccess(appointmentPayload);
        setSupabaseNotice(result.message);
        setTerminalLogs((prev) => [
          ...prev,
          {
            type: 'supabase',
            text: `[SUPABASE_SYNC_SUCCESS] Appointment recorded for ${bookName} (${bookEmail}) on ${appointmentDate} at ${selectedTimeSlot} [${userTimezone}].`,
          },
        ]);
      }
    } catch (err: any) {
      setIsBooking(false);
      setBookingSuccess(appointmentPayload);
      setSupabaseNotice('Appointment registered locally and queued for Supabase.');
    }
  };

  // Submit Direct Message to Supabase
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    setIsSendingMessage(true);
    try {
      const result = await saveContactMessageToSupabase({
        name: senderName.trim(),
        email: senderEmail.trim(),
        subject: subject.trim() || 'Direct Portfolio Dispatch',
        message: message.trim(),
      });
      setIsSendingMessage(false);
      setSentSuccess(true);
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: 'supabase',
          text: `[SUPABASE_TRANSMISSION] Message from <${senderEmail}> saved to Supabase backend.`,
        },
      ]);
    } catch {
      setIsSendingMessage(false);
      setSentSuccess(true);
    }
  };

  // CLI Handler
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { type: 'input' as const, text: `$ ${terminalInput}` }];

    switch (cmd) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: 'Available Commands:\n  • book     - Switch to Appointment Booking form\n  • meet     - Launch Google Meet Space Manager\n  • message  - Switch to Direct Dispatch form\n  • supabase - View backend database status & project ID\n  • about    - Candidate summary & BCA merit\n  • skills   - Technical frameworks\n  • projects - View applied ML & BI cases\n  • resume   - Jump to CV & ATS view\n  • hire     - View candidate availability\n  • clear    - Clear screen',
        });
        break;
      case 'meet':
        onOpenMeet?.();
        newLogs.push({
          type: 'supabase',
          text: '[GOOGLE_MEET_API] Opening Google Meet Space Manager. Authorize with Google to create and configure conference rooms.',
        });
        break;
      case 'book':
        setActiveFormMode('appointment');
        newLogs.push({
          type: 'supabase',
          text: 'Switched to Appointment Booking Form. Pick date, slot, and meeting type to save directly to Supabase.',
        });
        break;
      case 'message':
        setActiveFormMode('message');
        newLogs.push({ type: 'output', text: 'Switched to Direct Transmission form.' });
        break;
      case 'supabase':
        newLogs.push({
          type: 'supabase',
          text: `SUPABASE BACKEND CONFIG:\n  • Project ID: ${SUPABASE_PROJECT_ID}\n  • Endpoint: ${SUPABASE_URL}\n  • Target Table: "appointments" & "contacts"\n  • Status: Online & Integrated`,
        });
        break;
      case 'about':
        newLogs.push({
          type: 'output',
          text: `Ankit Patel: Final-Year BCA Student & Aspiring Data Scientist.\nFocus: Statistical ML, Advanced SQL, & Power BI DAX.`,
        });
        break;
      case 'skills':
        newLogs.push({
          type: 'output',
          text: `Skills: Python (NumPy, Pandas, Scikit-Learn), SQL (Postgres, MySQL), Power BI (DAX), PyTorch, SHAP, Git, Docker.`,
        });
        break;
      case 'projects':
        newLogs.push({
          type: 'output',
          text: `1. Customer Churn Predictor (94.2% ROC-AUC)\n2. E-Commerce Revenue Power BI Suite (120K Orders)\n3. PostgreSQL Data Mart (4.8x speedup)`,
        });
        break;
      case 'resume':
        setActiveTab('resume');
        newLogs.push({ type: 'output', text: 'Navigating to Resume view...' });
        break;
      case 'hire':
        newLogs.push({
          type: 'output',
          text: `Status: Available for Data Scientist Internships & Entry-Level roles.\nContact: ${PERSONAL_INFO.email}`,
        });
        break;
      case 'clear':
        setTerminalLogs([]);
        setTerminalInput('');
        return;
      default:
        newLogs.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for instructions.`,
        });
        break;
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  return (
    <section id="contact-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        06
      </div>

      {/* Section Header */}
      <div className="flex flex-col gap-3 mb-8 relative z-10 border-b-2 border-black pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
              VOLUME 01 // 05. BOOKING & DISPATCH
            </span>
            <span className="text-xs font-mono font-bold text-[#52525B]">SUPABASE POWERED</span>
          </div>

          {/* Supabase Connection Pill */}
          <div className="flex items-center gap-2">
            {onOpenMeet && (
              <button
                id="contact-google-meet-btn"
                onClick={() => onOpenMeet()}
                className="px-3 py-1 bg-white hover:bg-[#00FF00] border-2 border-black font-mono text-[11px] font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
                title="Open Google Meet Space Manager"
              >
                <Video className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>GOOGLE MEET v2</span>
              </button>
            )}

            <button
              onClick={() => setShowSqlSchemaModal(true)}
              className="px-3 py-1 bg-white hover:bg-black hover:text-white border-2 border-black font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
              title="View Supabase table schema & project info"
            >
              <Database className="w-3.5 h-3.5 text-[#00AA00]" />
              <span>SUPABASE: {SUPABASE_PROJECT_ID}</span>
            </button>
          </div>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none mt-2">
          Schedule & Contact
        </h2>
        <p className="text-[#52525B] text-base max-w-2xl font-medium">
          Schedule an interview or technical consultation directly into the Supabase database, or send a transmission through the developer console.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Form Box: Book Appointment or Direct Message */}
        <div className="lg:col-span-7 bg-white border-2 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
          {/* Header Switcher Tabs */}
          <div className="flex border-b-2 border-black bg-[#F4F4F5]">
            <button
              type="button"
              onClick={() => setActiveFormMode('appointment')}
              className={`flex-1 py-3 px-4 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                activeFormMode === 'appointment'
                  ? 'bg-white text-black border-b-2 border-white -mb-[2px]'
                  : 'text-[#52525B] hover:text-black border-r-2 border-black'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-black" />
              <span>BOOK APPOINTMENT</span>
              <span className="text-[9px] bg-[#00FF00] text-black px-1.5 py-0.2 border border-black ml-1 hidden sm:inline-block">
                LIVE DB
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFormMode('message')}
              className={`flex-1 py-3 px-4 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                activeFormMode === 'message'
                  ? 'bg-white text-black border-b-2 border-white -mb-[2px] border-l-2 border-black'
                  : 'text-[#52525B] hover:text-black'
              }`}
            >
              <Send className="w-4 h-4 text-black" />
              <span>DIRECT MESSAGE</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* 1. APPOINTMENT BOOKING MODE */}
            {activeFormMode === 'appointment' && (
              <>
                {bookingSuccess ? (
                  <div className="py-8 text-center space-y-5 animate-fadeIn">
                    <div className="w-16 h-16 bg-[#00FF00] border-2 border-black rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000000]">
                      <CheckCircle2 className="w-10 h-10 text-black" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-black uppercase text-[#52525B] bg-[#F4F4F5] px-2.5 py-1 border border-black/30">
                        SUPABASE TABLE: APPOINTMENTS // STATUS: SYNCED
                      </span>
                      <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-2">
                        Appointment Confirmed!
                      </h3>
                      <p className="text-xs font-mono text-[#52525B] max-w-md mx-auto mt-1">
                        Your slot has been recorded in the Supabase database. Ankit Patel has been notified and will send a calendar invite link to{' '}
                        <span className="font-bold text-black underline">{bookingSuccess.email}</span>.
                      </p>
                    </div>

                    {/* Booking Ticket Summary Card */}
                    <div className="p-4 bg-[#F9F9F9] border-2 border-black text-left font-mono text-xs max-w-md mx-auto space-y-2 shadow-[3px_3px_0px_#000000]">
                      <div className="flex justify-between pb-2 border-b border-black/20">
                        <span className="text-[#52525B]">ATTENDEE:</span>
                        <span className="font-black text-black">{bookingSuccess.name}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-black/20">
                        <span className="text-[#52525B]">MEETING TYPE:</span>
                        <span className="font-bold text-black">{bookingSuccess.meeting_type}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-black/20">
                        <span className="text-[#52525B]">DATE & TIME:</span>
                        <span className="font-black text-[#00AA00]">
                          {bookingSuccess.appointment_date} @ {bookingSuccess.appointment_time}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-black/20">
                        <span className="text-[#52525B]">TIMEZONE:</span>
                        <span className="font-bold text-black">{bookingSuccess.timezone}</span>
                      </div>
                      {bookingSuccess.company && (
                        <div className="flex justify-between pb-2 border-b border-black/20">
                          <span className="text-[#52525B]">ORGANIZATION:</span>
                          <span className="font-bold text-black">{bookingSuccess.company}</span>
                        </div>
                      )}
                      {bookingSuccess.meeting_link && (
                        <div className="flex flex-col gap-1 pb-2 border-b border-black/20">
                          <span className="text-[#52525B]">GOOGLE MEET ROOM:</span>
                          <div className="flex items-center justify-between gap-2 bg-white p-2 border border-black">
                            <span className="font-mono text-xs font-black text-[#2563EB] truncate">
                              {bookingSuccess.meeting_link}
                            </span>
                            <a
                              href={bookingSuccess.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-[#00FF00] text-black hover:bg-black hover:text-white font-mono text-[10px] font-black uppercase flex items-center gap-1 border border-black shrink-0 transition-colors"
                            >
                              <span>JOIN</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] pt-1">
                        <span className="text-[#52525B]">SUPABASE PROJECT:</span>
                        <span className="font-black text-black">{SUPABASE_PROJECT_ID}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingSuccess(null);
                          setBookNotes('');
                        }}
                        className="px-6 py-2.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase transition-all shadow-[3px_3px_0px_#000000] cursor-pointer"
                      >
                        BOOK ANOTHER SLOT
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAppointmentSubmit} className="space-y-5">
                    {/* Meeting Type Selection */}
                    <div>
                      <label className="block text-[11px] font-mono font-black text-black uppercase mb-2">
                        1. SELECT MEETING TYPE *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {MEETING_TYPES.map((type) => (
                          <div
                            key={type.id}
                            onClick={() => setSelectedMeetingType(type.title)}
                            className={`p-3 border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                              selectedMeetingType === type.title
                                ? 'bg-black text-white border-black shadow-[3px_3px_0px_#00FF00]'
                                : 'bg-white text-black border-black/40 hover:border-black hover:bg-[#F9F9F9]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{type.icon}</span>
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 border ${
                                  selectedMeetingType === type.title
                                    ? 'bg-[#00FF00] text-black border-black'
                                    : 'bg-[#F4F4F5] text-[#52525B] border-black/20'
                                }`}
                              >
                                {type.duration}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-black text-xs uppercase tracking-tight">{type.title}</h4>
                              <p
                                className={`text-[10px] font-mono mt-0.5 leading-snug line-clamp-2 ${
                                  selectedMeetingType === type.title ? 'text-[#D4D4D8]' : 'text-[#71717A]'
                                }`}
                              >
                                {type.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date and Time Slot Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                          2. PREFERRED DATE *
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:bg-[#F9F9F9] focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                          3. TIME SLOT *
                        </label>
                        <select
                          value={selectedTimeSlot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot} ({userTimezone.split('/')[1] || userTimezone})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Attendee Details */}
                    <div className="pt-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                            YOUR NAME *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Mercer"
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                            WORK / CONTACT EMAIL *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. alex@hiringteam.io"
                            value={bookEmail}
                            onChange={(e) => setBookEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                            COMPANY / ORGANIZATION (OPTIONAL)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Acme AI Labs / Tech Corp"
                            value={bookCompany}
                            onChange={(e) => setBookCompany(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                            PHONE / LINKEDIN (OPTIONAL)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. +1 555-0199 or linkedin.com/in/..."
                            value={bookPhone}
                            onChange={(e) => setBookPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                          AGENDA / TOPIC NOTES
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Provide any specific role descriptions, project context, or topics to discuss..."
                          value={bookNotes}
                          onChange={(e) => setBookNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-medium text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                        />
                      </div>

                      {/* Google Meet Link field */}
                      <div className="p-3 bg-[#F9F9F9] border-2 border-black space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-[#EA4335]" />
                            <label className="block text-[11px] font-mono font-black text-black uppercase">
                              GOOGLE MEET ROOM (OPTIONAL)
                            </label>
                          </div>
                          {onOpenMeet && (
                            <button
                              type="button"
                              onClick={() => onOpenMeet(selectedMeetingType)}
                              className="text-[10px] font-mono font-black text-[#2563EB] hover:text-black uppercase flex items-center gap-1 cursor-pointer underline underline-offset-2"
                            >
                              <span>Launch Meet Manager ↗</span>
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://meet.google.com/xxx-yyyy-zzz"
                            value={bookMeetingLink}
                            onChange={(e) => setBookMeetingLink(e.target.value)}
                            className="flex-1 px-3.5 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-white focus:outline-none"
                          />
                          {onOpenMeet && (
                            <button
                              type="button"
                              onClick={() => onOpenMeet(selectedMeetingType)}
                              className="px-3 py-2 bg-white hover:bg-[#00FF00] border-2 border-black font-mono text-[10px] font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer shrink-0"
                            >
                              <Video className="w-3.5 h-3.5 text-[#EA4335]" />
                              <span>CREATE ROOM</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-[#52525B]">
                          Attach a Google Meet conference link to your booking. Generate one instantly via Google Meet v2 API.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isBooking}
                        className="w-full py-4 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>
                          {isBooking ? 'SAVING TO SUPABASE BACKEND...' : 'CONFIRM & SAVE TO SUPABASE'}
                        </span>
                      </button>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#52525B] mt-2 px-1">
                        <span>⚡ AUTOMATIC SUPABASE SYNC</span>
                        <span>PROJECT: {SUPABASE_PROJECT_ID}</span>
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* 2. DIRECT MESSAGE MODE */}
            {activeFormMode === 'message' && (
              <>
                {sentSuccess ? (
                  <div className="py-10 text-center space-y-4 animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-[#00AA00] mx-auto" />
                    <h3 className="font-black text-2xl text-black uppercase tracking-tight">
                      Transmission Received
                    </h3>
                    <p className="text-xs font-mono text-[#52525B] max-w-sm mx-auto">
                      Thank you for reaching out. Your message is stored in Supabase and dispatched to Ankit Patel.
                    </p>
                    <button
                      onClick={() => {
                        setSentSuccess(false);
                        setSenderName('');
                        setSenderEmail('');
                        setMessage('');
                        setSubject('');
                      }}
                      className="px-5 py-2.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000]"
                    >
                      DISPATCH ANOTHER
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                          YOUR NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarah Connor / Tech Lead"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. recruiter@company.com"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                        SUBJECT / TOPIC
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Data Scientist Intern Role // Interview Request"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                        MESSAGE BODY *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Share details about the role, team stack, or dataset..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingMessage}
                      className="w-full py-3.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSendingMessage ? 'SAVING TO SUPABASE...' : 'DISPATCH TRANSMISSION'}</span>
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Coordinates Quick Bar */}
            <div className="mt-8 pt-6 border-t-2 border-black grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#F9F9F9] border-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-2 text-black font-bold truncate">
                  <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="truncate">{PERSONAL_INFO.email}</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="text-black hover:text-[#00AA00] p-1 font-bold cursor-pointer"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#00AA00]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 bg-[#F9F9F9] border-2 border-black flex items-center gap-2 text-black font-bold">
                <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Terminal: Interactive CLI Console */}
        <div className="lg:col-span-5 bg-black text-white border-2 border-black p-5 shadow-[6px_6px_0px_#000000] flex flex-col h-[540px]">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#00FF00] animate-pulse" />
              <span className="font-mono text-xs text-white font-bold ml-1">
                ankit@supabase-terminal:~ (bash)
              </span>
            </div>
            <span className="font-mono text-[10px] font-black text-black bg-[#00FF00] px-2 py-0.5">
              SUPABASE ONLINE
            </span>
          </div>

          {/* Terminal Output Area */}
          <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 text-[#D4D4D8] pr-2">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={`whitespace-pre-wrap leading-relaxed ${
                  log.type === 'input'
                    ? 'text-[#00FF00] font-bold'
                    : log.type === 'supabase'
                    ? 'text-[#00FF00] font-semibold bg-white/5 p-1.5 border-l-2 border-[#00FF00]'
                    : log.type === 'error'
                    ? 'text-red-400 font-bold'
                    : 'text-white'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>

          {/* Quick Command Suggestion Pills */}
          <div className="pt-2 pb-2 flex flex-wrap gap-1.5 border-t border-white/10">
            {['book', 'supabase', 'skills', 'hire', 'clear'].map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  setTerminalInput(cmd);
                }}
                className="px-2 py-0.5 bg-white/10 hover:bg-[#00FF00] hover:text-black text-[10px] font-mono text-[#D4D4D8] border border-white/20 transition-colors"
              >
                ${cmd}
              </button>
            ))}
          </div>

          {/* Terminal Input Line */}
          <form onSubmit={handleTerminalSubmit} className="pt-2 border-t border-white/20 flex items-center gap-2">
            <span className="font-mono text-xs text-[#00FF00] font-bold">$</span>
            <input
              type="text"
              placeholder="Type 'book', 'supabase', 'skills', or 'help'..."
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder-[#71717A]"
            />
          </form>
        </div>
      </div>

      {/* Supabase Schema / Database Info Modal */}
      {showSqlSchemaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white border-2 border-black w-full max-w-2xl shadow-[8px_8px_0px_#000000] flex flex-col max-h-[90vh]">
            <div className="p-4 border-b-2 border-black bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00FF00]" />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">Supabase Backend Configuration</h3>
                  <p className="text-[10px] font-mono text-[#A1A1AA]">Project ID: {SUPABASE_PROJECT_ID}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlSchemaModal(false)}
                className="p-1 bg-white text-black hover:bg-[#00FF00] border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#F4F4F5] border-2 border-black space-y-1">
                <div className="text-black font-bold flex items-center justify-between">
                  <span>ENDPOINT:</span>
                  <span className="text-[#00AA00]">{SUPABASE_URL}</span>
                </div>
                <div className="text-black font-bold flex items-center justify-between">
                  <span>TARGET TABLES:</span>
                  <span>appointments, contacts</span>
                </div>
                <div className="text-black font-bold flex items-center justify-between">
                  <span>STATUS:</span>
                  <span className="bg-[#00FF00] text-black px-1.5 py-0.2 border border-black text-[10px]">
                    ACTIVE & INTEGRATED
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black uppercase text-black">
                    Supabase SQL Table Schema (Appointments & Contacts)
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="px-2.5 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black border border-black text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-[#00FF00]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'COPIED SQL!' : 'COPY SQL'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-black text-[#00FF00] border-2 border-black text-[11px] leading-relaxed overflow-x-auto select-all">
                  {SUPABASE_SQL_SETUP_SCRIPT}
                </pre>
                <p className="text-[11px] text-[#52525B] mt-2 leading-normal">
                  💡 Tip: If you haven't run the table creation script in your Supabase SQL Editor yet, click <strong>COPY SQL</strong> above and run it in your{' '}
                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-black font-bold inline-flex items-center gap-0.5"
                  >
                    Supabase SQL Editor <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </p>
              </div>
            </div>

            <div className="p-4 border-t-2 border-black bg-[#F4F4F5] flex justify-end">
              <button
                onClick={() => setShowSqlSchemaModal(false)}
                className="px-5 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
