import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Github, Linkedin, Mail, Sparkles, Terminal, ArrowUp } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenRecruiter: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenRecruiter }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-black text-white border-t-2 border-black mt-auto">
      {/* Upper Footer Bar */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/20">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#00FF00]">
            VOLUME 01 // DATA SCIENCE PORTFOLIO
          </span>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            ANKIT PATEL
          </h3>
          <p className="text-xs font-mono text-[#A1A1AA] mt-0.5">
            BCA '27 • Applied Machine Learning, SQL Engineering, & Power BI DAX
          </p>
        </div>

        {/* Quick Footer Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold">
          <button
            onClick={() => {
              setActiveTab('projects');
              scrollToTop();
            }}
            className="hover:text-[#00FF00] transition-colors cursor-pointer"
          >
            [ARCHIVES]
          </button>
          <button
            onClick={() => {
              setActiveTab('skills');
              scrollToTop();
            }}
            className="hover:text-[#00FF00] transition-colors cursor-pointer"
          >
            [TOOLCHAIN]
          </button>
          <button
            onClick={() => {
              setActiveTab('resume');
              scrollToTop();
            }}
            className="hover:text-[#00FF00] transition-colors cursor-pointer"
          >
            [DOSSIER]
          </button>
          <button
            onClick={() => {
              setActiveTab('socials');
              scrollToTop();
            }}
            className="hover:text-[#00FF00] transition-colors cursor-pointer"
          >
            [NETWORK]
          </button>
          <button
            onClick={() => {
              setActiveTab('notes');
              scrollToTop();
            }}
            className="hover:text-[#00FF00] transition-colors cursor-pointer"
          >
            [NOTES]
          </button>
          <button
            onClick={() => {
              setActiveTab('contact');
              scrollToTop();
            }}
            className="hover:text-[#00FF00] transition-colors cursor-pointer"
          >
            [DISPATCH]
          </button>
          <button
            onClick={onOpenRecruiter}
            className="px-3 py-1 bg-[#00FF00] text-black hover:bg-white transition-colors border border-black font-black cursor-pointer"
          >
            RECRUITER SCAN
          </button>
        </div>
      </div>

      {/* Lower Footer Status Rail matching reference HTML layout */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-[60px] flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">V-2027.DSX</span>
          <span>//</span>
          <span className="text-[#00FF00] flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-pulse" />
            System Nominal [ACTIVE]
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#00FF00] transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#00FF00] transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-1.5 bg-white text-black hover:bg-[#00FF00] transition-colors"
            title="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
