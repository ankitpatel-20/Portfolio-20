import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import {
  FolderGit2,
  Terminal,
  ExternalLink,
  Github,
  Search,
  Sparkles,
  ArrowUpRight,
  Cpu,
  BarChart2,
  Database,
  ArrowRight,
} from 'lucide-react';

interface ProjectsSectionProps {
  initialSelectedProjectId?: string | null;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ initialSelectedProjectId }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    initialSelectedProjectId
      ? PROJECTS.find((p) => p.id === initialSelectedProjectId) || null
      : null
  );

  const categories = ['All', 'Machine Learning', 'Power BI & BI', 'SQL & Analytics', 'Deep Learning & NLP'];

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        04
      </div>

      {/* Section Header */}
      <div className="flex flex-col gap-3 mb-10 relative z-10 border-b-2 border-black pb-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
            VOLUME 01 // 03. ARCHIVES
          </span>
          <span className="text-xs font-mono font-bold text-[#52525B]">INDEX 01 — {PROJECTS.length}</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
          Applied Archives
        </h2>
        <p className="text-[#52525B] text-base max-w-2xl font-medium">
          End-to-end architectures demonstrating feature engineering, statistical classification, SQL performance optimization, and interactive executive reporting.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 relative z-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 border-2 border-black font-mono text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-[3px_3px_0px_#000000]'
                    : 'bg-white hover:bg-[#F9F9F9] text-black shadow-[2px_2px_0px_#000000]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="FILTER BY STACK, TAG..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder-[#71717A] focus:outline-none focus:bg-[#F9F9F9] shadow-[2px_2px_0px_#000000]"
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            onClick={() => setSelectedProject(project)}
            className="group bg-white border-2 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer relative"
          >
            <div>
              {/* Card Top Index Line */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                <span className="font-mono text-xs font-black text-black">
                  0{idx + 1} // {project.category}
                </span>
                <span className="text-[10px] uppercase font-bold bg-[#00FF00] text-black px-2 py-0.5 border border-black opacity-0 group-hover:opacity-100 transition-opacity">
                  VIEW CASE →
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-black text-xl text-black uppercase tracking-tight group-hover:underline decoration-2 leading-snug mb-2">
                {project.title}
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed mb-4">
                {project.subtitle}
              </p>

              {/* Highlights */}
              <div className="space-y-1.5 mb-5 bg-[#F9F9F9] p-3 border border-black/15">
                {project.highlights.slice(0, 2).map((hl, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-black font-medium">
                    <span className="text-black font-bold">▪</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Metrics & Tags */}
            <div className="pt-4 border-t-2 border-black space-y-3">
              {/* Metrics pill */}
              <div className="flex flex-wrap gap-2">
                {project.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="px-2 py-1 bg-black text-white text-[10px] font-mono font-bold uppercase border border-black"
                  >
                    {m.label}: <span className="text-[#00FF00]">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#F4F4F5] border border-black/30 text-black"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
