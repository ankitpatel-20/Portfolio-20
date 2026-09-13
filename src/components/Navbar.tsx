import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Terminal, Code, Menu, X, Sparkles, User, Briefcase, Video } from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab) => void;
  onOpenRecruiter: () => void;
  onToggleTerminal?: () => void;
  onOpenMeet?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRecruiter,
  onToggleTerminal,
  onOpenMeet,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'EXHIBITION' },
    { id: 'about', label: 'MANIFESTO' },
    { id: 'skills', label: 'TOOLCHAIN' },
    { id: 'projects', label: 'ARCHIVES' },
    { id: 'resume', label: 'DOSSIER' },
    { id: 'socials', label: 'NETWORK' },
    { id: 'notes', label: 'NOTES' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 w-full z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b-2 border-black transition-colors"
    >
      <div className="h-20 sm:h-22 max-w-[1280px] mx-auto px-6 sm:px-8 flex items-end justify-between pb-3.5 sm:pb-4">
        {/* Brand with Volume marker */}
        <button
          id="nav-brand-btn"
          onClick={() => handleTabClick('home')}
          className="flex flex-col text-left group cursor-pointer shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-black text-[#52525B]">
              VOLUME 01 // DATA SCIENCE
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-black/40">•</span>
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase text-[#52525B] tracking-widest">
              PORTFOLIO ARCHIVE
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-wide sm:tracking-[0.16em] lg:tracking-[0.22em] leading-none text-black group-hover:opacity-75 transition-opacity whitespace-nowrap">
              ANKIT PATEL
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            if (tab.id === 'contact') {
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2 border-2 border-black text-[11px] uppercase tracking-widest font-black transition-all ${
                    isActive
                      ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-black text-white hover:bg-[#00FF00] hover:text-black hover:shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            }
            return (
              <button
                key={tab.id}
                id={`nav-link-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-black underline underline-offset-8 decoration-2 decoration-black font-black'
                    : 'text-[#52525B] hover:text-black hover:underline underline-offset-8 decoration-1 decoration-black'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Recruiter Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 pb-0.5">
          {/* Google Meet Trigger */}
          {onOpenMeet && (
            <button
              id="nav-google-meet-btn"
              onClick={onOpenMeet}
              title="Open Google Meet Space Manager"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border-2 border-black bg-white hover:bg-[#00FF00] text-black text-[10px] font-mono font-black tracking-wider transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-[#EA4335]" />
              <span className="hidden sm:inline">GOOGLE MEET</span>
              <span className="sm:hidden">MEET</span>
            </button>
          )}

          {/* Quick Recruiter Badge */}
          <button
            id="nav-recruiter-btn"
            onClick={onOpenRecruiter}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#F9F9F9] hover:bg-[#00FF00] text-black text-[10px] font-mono font-bold tracking-wider transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RECRUITER SCAN</span>
          </button>

          {/* Terminal Console Trigger */}
          {onToggleTerminal && (
            <button
              id="nav-terminal-btn"
              onClick={onToggleTerminal}
              title="Open Interactive Terminal"
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000000]"
            >
              <Code className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-black bg-white px-6 py-6 flex flex-col gap-3 animate-fadeIn">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-2.5 text-left text-xs uppercase tracking-widest font-black border-b border-black/20 flex items-center justify-between ${
                  isActive ? 'text-black bg-[#00FF00]/30 px-3 border border-black' : 'text-[#52525B] px-3'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && <span className="text-[10px] font-mono font-bold">[ACTIVE]</span>}
              </button>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            {onOpenMeet && (
              <button
                id="mobile-nav-meet-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMeet();
                }}
                className="w-full py-2.5 bg-white text-black text-xs font-mono font-black tracking-widest uppercase border-2 border-black hover:bg-[#00FF00] text-center shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4 text-[#EA4335]" />
                <span>GOOGLE MEET MANAGER</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRecruiter();
              }}
              className="w-full py-2.5 bg-black text-white text-xs font-mono font-bold tracking-widest uppercase border-2 border-black hover:bg-[#00FF00] hover:text-black text-center shadow-[3px_3px_0px_#000000]"
            >
              ⚡ 30-SEC RECRUITER DOSSIER
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
