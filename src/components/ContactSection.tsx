import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import {
  Terminal,
  Send,
  Mail,
  MapPin,
  Github,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Command,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface ContactSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ setActiveTab }) => {
  // Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<
    { type: 'input' | 'output' | 'error'; text: string }[]
  >([
    { type: 'output', text: 'SYSTEM_CLI v2.4.0 INITIALIZED.' },
    { type: 'output', text: 'Type "help" to see available commands or "hire" for recruitment details.' },
  ]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: 'output',
          text: `[TRANSMISSION_CONFIRMED] Message from <${senderEmail}> dispatched to Ankit Patel.`,
        },
      ]);
    }, 800);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { type: 'input' as const, text: `$ ${terminalInput}` }];

    switch (cmd) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: 'Available Commands:\n  • about    - Candidate summary & BCA merit\n  • skills   - Technical frameworks\n  • projects - View applied ML & BI cases\n  • resume   - Jump to CV & ATS view\n  • hire     - View candidate availability\n  • clear    - Clear screen',
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
      <div className="flex flex-col gap-3 mb-10 relative z-10 border-b-2 border-black pb-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
            VOLUME 01 // 05. DISPATCH
          </span>
          <span className="text-xs font-mono font-bold text-[#52525B]">COMMUNICATION CHANNEL</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
          Initialize Contact
        </h2>
        <p className="text-[#52525B] text-base max-w-2xl font-medium">
          Whether you have an internship opening, data challenge, collaboration proposal, or technical query, feel free to dispatch a message or interact with the CLI console.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Form: Direct Dispatch */}
        <div className="lg:col-span-6 bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
            <span className="font-mono text-xs font-black text-black tracking-wider uppercase">
              TRANSMISSION FORM // PORT 8080
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#00FF00] border border-black text-black">
              STATUS: READY
            </span>
          </div>

          {sentSuccess ? (
            <div className="py-10 text-center space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-[#00AA00] mx-auto" />
              <h3 className="font-black text-2xl text-black uppercase tracking-tight">
                Transmission Received
              </h3>
              <p className="text-xs font-mono text-[#52525B] max-w-sm mx-auto">
                Thank you for reaching out. Ankit Patel will review your message and reply via email within 24 hours.
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
                  <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">YOUR NAME *</label>
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
                  <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">EMAIL ADDRESS *</label>
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
                <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">SUBJECT / TOPIC</label>
                <input
                  type="text"
                  placeholder="e.g. Data Scientist Intern Role // Interview Request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#A1A1AA] focus:bg-[#F9F9F9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">MESSAGE BODY *</label>
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
                disabled={isSending}
                className="w-full py-3.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'DISPATCHING...' : 'DISPATCH TRANSMISSION'}</span>
              </button>
            </form>
          )}

          {/* Coordinates Quick Card */}
          <div className="mt-8 pt-6 border-t-2 border-black grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#F9F9F9] border-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2 text-black font-bold truncate">
                <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                <span className="truncate">{PERSONAL_INFO.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="text-black hover:text-[#00AA00] p-1 font-bold"
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

        {/* Right Terminal: Interactive CLI Console */}
        <div className="lg:col-span-6 bg-black text-white border-2 border-black p-5 shadow-[6px_6px_0px_#000000] flex flex-col h-[520px]">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#00FF00]" />
              <span className="font-mono text-xs text-white font-bold ml-1">
                ankit@datascience-terminal:~ (bash)
              </span>
            </div>
            <span className="font-mono text-[10px] font-black text-black bg-[#00FF00] px-2 py-0.5">
              ONLINE
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
                    : log.type === 'error'
                    ? 'text-red-400 font-bold'
                    : 'text-white'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>

          {/* Terminal Input Line */}
          <form onSubmit={handleTerminalSubmit} className="pt-3 border-t border-white/20 flex items-center gap-2">
            <span className="font-mono text-xs text-[#00FF00] font-bold">$</span>
            <input
              type="text"
              placeholder="Type 'help', 'skills', 'hire', or 'projects'..."
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder-[#71717A]"
            />
          </form>
        </div>
      </div>
    </section>
  );
};
