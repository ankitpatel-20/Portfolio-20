import React, { useState } from 'react';
import {
  PERSONAL_INFO,
  EDUCATION_HISTORY,
  QUICK_METRICS,
  PROJECTS,
  SKILL_CATEGORIES,
} from '../data/portfolioData';
import {
  X,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Mail,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface RecruiterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: NavigationTab) => void;
  onSelectProject: (projectId: string) => void;
}

export const RecruiterDrawer: React.FC<RecruiterDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onSelectProject,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      id="recruiter-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="recruiter-drawer-panel"
        className="w-full max-w-xl bg-white border-l-4 border-black h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-[8px_0px_0px_#000000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#00FF00] border border-black" />
              <h2 className="font-mono text-xs font-black text-black uppercase tracking-widest">
                30-SEC RECRUITER DOSSIER
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Candidate Profile Summary Header */}
          <div className="p-4 bg-[#F9F9F9] border-2 border-black">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#52525B]">CANDIDATE DOSSIER</span>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">ANKIT PATEL</h3>
                <p className="text-xs font-mono text-black font-bold">
                  BCA Final Year • Aspiring Data Scientist
                </p>
              </div>
              <span className="text-xs font-mono font-black px-2.5 py-1 bg-[#00FF00] text-black border border-black">
                AVAIL: IMMEDIATE
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-black/15 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 bg-white border border-black font-bold">📍 {PERSONAL_INFO.location}</span>
              <span className="px-2 py-0.5 bg-white border border-black font-bold">🎓 CGPA: 8.8/10.0</span>
              <span className="px-2 py-0.5 bg-white border border-black font-bold">💼 Target: Data Scientist Intern</span>
            </div>
          </div>

          {/* Core Strengths Checklist */}
          <div>
            <h4 className="text-xs font-mono font-black text-black uppercase tracking-wider mb-2">
              // WHY HIRE THIS CANDIDATE
            </h4>
            <div className="space-y-2">
              {[
                'Proven ML: Built 94.2% ROC-AUC churn model with SHAP feature interpretability on 75K records.',
                'Production SQL: Authored star schemas and optimized financial queries by 4.8x speedup.',
                'BI Storytelling: 14+ Power BI suites with 45+ DAX calculations and executive KPI dashboards.',
                'Rigorous CS Grounding: BCA final-year with 8.8 CGPA across Data Structures, DBMS, and Statistics.',
              ].map((point, idx) => (
                <div key={idx} className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex items-start gap-2.5">
                  <span className="font-mono text-xs font-black bg-black text-white px-1.5 py-0.2">0{idx + 1}</span>
                  <span className="text-xs text-black font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div>
            <h4 className="text-xs font-mono font-black text-black uppercase tracking-wider mb-2">
              // KEY TECHNICAL METRICS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-[#F9F9F9] border-2 border-black">
                <span className="text-[10px] text-[#52525B] font-bold uppercase block">ML ROC-AUC</span>
                <span className="text-xl font-black text-black">94.2%</span>
              </div>
              <div className="p-3 bg-[#F9F9F9] border-2 border-black">
                <span className="text-[10px] text-[#52525B] font-bold uppercase block">SQL QUERY ACCEL</span>
                <span className="text-xl font-black text-black">4.8x Speedup</span>
              </div>
              <div className="p-3 bg-[#F9F9F9] border-2 border-black">
                <span className="text-[10px] text-[#52525B] font-bold uppercase block">POWER BI SUITES</span>
                <span className="text-xl font-black text-black">14+ Dashboards</span>
              </div>
              <div className="p-3 bg-[#F9F9F9] border-2 border-black">
                <span className="text-[10px] text-[#52525B] font-bold uppercase block">BCA DEGREE GPA</span>
                <span className="text-xl font-black text-black">8.8 / 10.0</span>
              </div>
            </div>
          </div>

          {/* Featured Case Studies Links */}
          <div>
            <h4 className="text-xs font-mono font-black text-black uppercase tracking-wider mb-2">
              // FEATURED ARCHIVES
            </h4>
            <div className="space-y-2">
              {PROJECTS.slice(0, 2).map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onClose();
                    onSelectProject(proj.id);
                  }}
                  className="w-full p-3 bg-white border-2 border-black hover:bg-[#F9F9F9] flex items-center justify-between text-left transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
                >
                  <div>
                    <span className="font-bold text-xs text-black block">{proj.title}</span>
                    <span className="text-[10px] font-mono text-[#52525B]">{proj.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="mt-8 pt-6 border-t-2 border-black space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('contact');
              }}
              className="flex-1 py-3 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[4px_4px_0px_#000000]"
            >
              SEND INTERVIEW INVITATION
            </button>
            <button
              onClick={handleCopyEmail}
              className="px-4 py-3 bg-white hover:bg-[#F9F9F9] border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-[#00AA00]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateToTab('notes');
            }}
            className="w-full py-2 bg-[#F9F9F9] hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-bold text-black uppercase transition-colors"
          >
            VIEW LATEST THOUGHTS & NOTICES →
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToTab('resume');
            }}
            className="w-full py-2 bg-[#F9F9F9] hover:bg-white border-2 border-black font-mono text-xs font-bold text-black uppercase"
          >
            VIEW FULL CURRICULUM VITAE & ATS CHECKER →
          </button>
        </div>
      </div>
    </div>
  );
};
