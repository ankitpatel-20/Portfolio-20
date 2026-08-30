import React from 'react';
import {
  PERSONAL_INFO,
  EDUCATION_HISTORY,
  CERTIFICATIONS,
  QUICK_METRICS,
} from '../data/portfolioData';
import {
  GraduationCap,
  Award,
  BookOpen,
  BrainCircuit,
  Database,
  LineChart,
  Code2,
  CheckCircle2,
  ExternalLink,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface AboutSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ setActiveTab }) => {
  const pillars = [
    {
      num: '01',
      title: 'STATISTICAL RIGOR & MODELING',
      icon: BrainCircuit,
      desc: 'Grounding machine learning algorithms in sound hypothesis testing, probability distributions, feature selection, and class imbalance mitigation strategies.',
    },
    {
      num: '02',
      title: 'HIGH-PERFORMANCE SQL & ETL',
      icon: Database,
      desc: 'Designing normalized 3NF schemas and Star Schema data marts with optimized index tuning, recursive CTEs, and automated transformation pipelines.',
    },
    {
      num: '03',
      title: 'ACTIONABLE BUSINESS INTELLIGENCE',
      icon: LineChart,
      desc: 'Translating complex multidimensional datasets into intuitive Power BI executive dashboards with tailored DAX measures driving executive decisions.',
    },
    {
      num: '04',
      title: 'ENGINEERING & PRODUCTION CODE',
      icon: Code2,
      desc: 'Writing clean, modular Python and SQL with version control (Git/GitHub), containerized REST endpoints (FastAPI/Docker), and unit test coverage.',
    },
  ];

  return (
    <section id="about-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        02
      </div>

      {/* Section Header */}
      <div className="flex flex-col gap-3 mb-12 relative z-10 border-b-2 border-black pb-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
            VOLUME 01 // 01. MANIFESTO
          </span>
          <span className="text-xs font-mono font-bold text-[#52525B]">CANDIDATE BIOGRAPHY</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
          Engineering Intelligence
        </h2>
        <p className="text-[#52525B] text-base max-w-2xl font-medium">
          A final-year Bachelor of Computer Applications (BCA) student bridging software engineering principles with applied data science and statistical computing.
        </p>
      </div>

      {/* Main Grid: Story + Academic Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 relative z-10">
        {/* Left Story Panel */}
        <div className="lg:col-span-7 bg-white border-2 border-black p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#000000]">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
              <span className="font-mono text-xs font-black text-black tracking-widest uppercase">
                BIOGRAPHICAL DOSSIER
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-[#00FF00] text-black border border-black">
                CLASS OF 2027
              </span>
            </div>

            <div className="space-y-4 text-black leading-relaxed text-[15px]">
              <p className="font-bold text-base">
                My dedication to data science stems from a deep conviction that mathematical patterns and data pipelines unlock high-impact real-world solutions.
              </p>
              <p className="text-[#52525B]">
                Through rigorous coursework in the BCA program, I established a solid bedrock in Data Structures & Algorithms, Relational Database Management Systems, Discrete Mathematics, and Applied Statistics.
              </p>
              <p className="text-[#52525B]">
                I translate theoretical machine learning algorithms into production-ready pipelines: from clean Python data wrangling and Star Schema dimensional modeling in SQL to executive KPI dashboards in Microsoft Power BI.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-black">
              <span className="w-2.5 h-2.5 bg-[#00FF00] border border-black" />
              <span>CURRENT STATUS: ACTIVE INTERNSHIP CANDIDATE</span>
            </div>
            <button
              onClick={() => setActiveTab('resume')}
              className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              VIEW FULL CV →
            </button>
          </div>
        </div>

        {/* Right Academic & Merit Box */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#F9F9F9] border-2 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-black mb-4 border-b-2 border-black pb-2">
              <GraduationCap className="w-4 h-4 text-black" />
              <span>ACADEMIC FOUNDATION</span>
            </div>
            {EDUCATION_HISTORY.map((edu, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-lg text-black uppercase">{edu.degree}</h4>
                    <p className="text-xs font-mono font-bold text-[#52525B]">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-mono font-black px-2 py-1 bg-black text-white border border-black">
                    {edu.gpa}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#52525B] font-bold pt-1">
                  PERIOD: {edu.period}
                </div>
                <p className="text-xs text-[#52525B] leading-relaxed pt-2 border-t border-black/15">
                  Core curriculum: Advanced DBMS, Python Programming, Object-Oriented Analysis, Machine Learning, Statistical Inference.
                </p>
              </div>
            ))}
          </div>

          <div className="bg-black text-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
              <span className="text-xs font-mono font-black tracking-wider uppercase text-[#00FF00]">
                CORE TARGET OBJECTIVE
              </span>
              <Target className="w-4 h-4 text-[#00FF00]" />
            </div>
            <p className="text-xs text-[#D4D4D8] leading-relaxed font-mono">
              Seeking Data Scientist Intern / Junior Data Scientist roles to leverage algorithmic modeling, high-throughput SQL transformations, and DAX analytical storytelling.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Competency Pillars */}
      <div className="relative z-10 mb-16">
        <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-black">
          <h3 className="text-2xl font-black text-black uppercase tracking-tight">
            Four Engineering Pillars
          </h3>
          <span className="text-xs font-mono font-bold text-[#52525B]">CORE CAPABILITIES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_#000000] hover:bg-[#F9F9F9] transition-all relative group"
              >
                <div className="flex items-center justify-between mb-4 border-b border-black/15 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black bg-black text-white px-2 py-0.5 border border-black group-hover:bg-[#00FF00] group-hover:text-black transition-colors">
                      {pillar.num}
                    </span>
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#52525B] uppercase">
                    PILLAR SPEC
                  </span>
                </div>
                <h4 className="font-black text-base text-black uppercase mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Certifications Bar */}
      <div className="relative z-10 bg-[#F9F9F9] border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-black" />
            <h3 className="font-black text-lg text-black uppercase tracking-tight">
              Verified Professional Certifications
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-[#00FF00] text-black border border-black">
            INDUSTRY CREDENTIALS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-mono font-black text-[#52525B] uppercase mb-1">
                  {cert.issuer} • {cert.date}
                </div>
                <h5 className="font-bold text-xs text-black leading-snug">{cert.name}</h5>
              </div>
              <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-mono text-black font-bold">
                <span>VERIFIED</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00AA00]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
