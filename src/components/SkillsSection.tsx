import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import {
  BrainCircuit,
  Database,
  BarChart2,
  Terminal,
  Code2,
  CheckCircle,
  Copy,
  Check,
  Play,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ml-ai');
  const [selectedSkill, setSelectedSkill] = useState(SKILL_CATEGORIES[0].skills[0]);
  const [copied, setCopied] = useState(false);
  const [sandboxExecuted, setSandboxExecuted] = useState(false);

  const currentCategoryData =
    SKILL_CATEGORIES.find((cat) => cat.id === activeCategory) || SKILL_CATEGORIES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedSkill.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSandbox = () => {
    setSandboxExecuted(true);
    setTimeout(() => setSandboxExecuted(false), 3000);
  };

  return (
    <section id="skills-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        03
      </div>

      {/* Section Header */}
      <div className="flex flex-col gap-3 mb-10 relative z-10 border-b-2 border-black pb-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
            VOLUME 01 // 02. TOOLCHAIN
          </span>
          <span className="text-xs font-mono font-bold text-[#52525B]">TECHNICAL MATRIX & BENCHMARKS</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
          Stack & Frameworks
        </h2>
        <p className="text-[#52525B] text-base max-w-2xl font-medium">
          A disciplined, production-tested toolkit spanning predictive modeling, relational data warehousing, high-impact DAX visualizers, and scalable code.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 pb-4 relative z-10">
        {SKILL_CATEGORIES.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedSkill(cat.skills[0]);
              }}
              className={`px-5 py-3 border-2 border-black font-mono text-xs font-black tracking-wider uppercase flex items-center gap-2.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-[4px_4px_0px_#000000]'
                  : 'bg-white hover:bg-[#F9F9F9] text-black shadow-[2px_2px_0px_#000000]'
              }`}
            >
              <span>[0{idx + 1}] {cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 border border-black ${isActive ? 'bg-[#00FF00] text-black font-bold' : 'bg-[#F4F4F5] text-black'}`}>
                {cat.skills.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout: Skill Grid + Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Skills in Active Category */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="p-3 bg-[#F9F9F9] border-2 border-black text-xs font-mono font-bold text-black flex items-center justify-between">
            <span>INDEX SPECIFICATION</span>
            <span className="text-[#52525B]">{currentCategoryData.description}</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {currentCategoryData.skills.map((skill, idx) => {
              const isSelected = selectedSkill.name === skill.name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-5 border-2 border-black cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#F9F9F9] shadow-[4px_4px_0px_#000000]'
                      : 'bg-white hover:bg-[#F9F9F9] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-black text-white px-1.5 py-0.5 border border-black">
                        0{idx + 1}
                      </span>
                      <h4 className="font-black text-sm text-black uppercase tracking-tight">{skill.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-black bg-white">
                      {skill.badge} ({skill.level}%)
                    </span>
                  </div>

                  <p className="text-xs text-[#52525B] leading-relaxed mb-3">
                    {skill.experience} • {skill.description}
                  </p>

                  {/* High-Contrast Brutalist Progress Bar */}
                  <div className="w-full bg-[#E5E5E5] h-2.5 border border-black overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isSelected ? 'bg-[#00FF00]' : 'bg-black'}`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Code Inspector */}
        <div className="lg:col-span-6 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] sticky top-24">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#52525B]">
                INSPECTOR CONSOLE
              </div>
              <h3 className="font-black text-lg text-black uppercase tracking-tight">
                {selectedSkill.name} // SNIPPET
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00AA00]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
              <button
                onClick={handleRunSandbox}
                className="px-3 py-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>SIMULATE</span>
              </button>
            </div>
          </div>

          <div className="bg-[#F4F4F5] border-2 border-black p-4 mb-4">
            <pre className="font-mono text-xs text-black leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {selectedSkill.snippet}
            </pre>
          </div>

          {sandboxExecuted ? (
            <div className="p-3 bg-[#00FF00]/20 border-2 border-black font-mono text-xs text-black font-bold animate-fadeIn">
              <div className="flex justify-between border-b border-black/20 pb-1 mb-1">
                <span>[EXECUTION: COMPLETED]</span>
                <span>RETURN CODE: 0</span>
              </div>
              <div>✓ Syntax verified against production runtime</div>
              <div>✓ Benchmark: High throughput (Optimized AST)</div>
            </div>
          ) : (
            <div className="p-3 bg-[#F9F9F9] border border-black/20 font-mono text-[11px] text-[#52525B]">
              <span className="font-bold text-black">TEST SUITE READY:</span> Click &quot;Simulate&quot; to test algorithm validation or copy snippet for evaluation.
            </div>
          )}

          {/* Quick Metrics Reference */}
          <div className="mt-6 pt-4 border-t-2 border-black grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#F9F9F9] border border-black">
              <span className="text-[#52525B] text-[10px] uppercase font-bold block">CATEGORY</span>
              <span className="font-black text-black">{currentCategoryData.name}</span>
            </div>
            <div className="p-2.5 bg-[#F9F9F9] border border-black">
              <span className="text-[#52525B] text-[10px] uppercase font-bold block">PROFICIENCY</span>
              <span className="font-black text-black">{selectedSkill.badge} ({selectedSkill.level}%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
