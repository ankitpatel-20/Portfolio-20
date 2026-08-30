import React, { useState, useEffect } from 'react';
import { NavigationTab } from './types';
import { DataUniverseCanvas } from './components/DataUniverseCanvas';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ResumeSection } from './components/ResumeSection';
import { SocialsSection } from './components/SocialsSection';
import { NotesSection } from './components/NotesSection';
import { ContactSection } from './components/ContactSection';
import { RecruiterDrawer } from './components/RecruiterDrawer';
import { Footer } from './components/Footer';
import { Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projects');
  };

  const handleToggleTerminal = () => {
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-black font-sans relative flex flex-col selection:bg-[#00FF00] selection:text-black">
      {/* Minimal Architectural Node Grid Background */}
      <DataUniverseCanvas />

      {/* Top Fixed Brutalist Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRecruiter={() => setRecruiterOpen(true)}
        onToggleTerminal={handleToggleTerminal}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pt-20 relative z-10">
        {activeTab === 'home' && (
          <HomeSection
            setActiveTab={setActiveTab}
            onSelectProject={handleSelectProject}
          />
        )}
        {activeTab === 'about' && <AboutSection setActiveTab={setActiveTab} />}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'projects' && (
          <ProjectsSection initialSelectedProjectId={selectedProjectId} />
        )}
        {activeTab === 'resume' && <ResumeSection />}
        {activeTab === 'socials' && <SocialsSection setActiveTab={setActiveTab} />}
        {activeTab === 'notes' && <NotesSection setActiveTab={setActiveTab} />}
        {activeTab === 'contact' && <ContactSection setActiveTab={setActiveTab} />}
      </main>

      {/* Solid Black Structured Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenRecruiter={() => setRecruiterOpen(true)}
      />

      {/* Floating Recruiter Mode Button matching Bold Typography aesthetic */}
      <button
        id="floating-recruiter-mode-btn"
        onClick={() => setRecruiterOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-black text-white hover:bg-[#00FF00] hover:text-black px-5 py-3 border-2 border-black font-mono text-xs font-black tracking-widest uppercase shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group"
      >
        <Sparkles className="w-4 h-4 text-[#00FF00] group-hover:text-black transition-colors" />
        <span>RECRUITER SCAN</span>
      </button>

      {/* Recruiter Scan Drawer */}
      <RecruiterDrawer
        isOpen={recruiterOpen}
        onClose={() => setRecruiterOpen(false)}
        onNavigateToTab={setActiveTab}
        onSelectProject={handleSelectProject}
      />
    </div>
  );
}
