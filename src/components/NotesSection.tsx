import React, { useState, useEffect } from 'react';
import { NoteItem, NavigationTab } from '../types';
import {
  loadSavedNotes,
  saveNotes,
  DEFAULT_NOTES,
} from '../utils/portfolioStorage';
import {
  StickyNote,
  Pin,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  X,
  Save,
  MessageSquare,
  Bookmark,
  Share2,
} from 'lucide-react';

interface NotesSectionProps {
  setActiveTab?: (tab: NavigationTab) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ setActiveTab }) => {
  const [notes, setNotes] = useState<NoteItem[]>(loadSavedNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<NoteItem['category']>('Thought');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formIsImportant, setFormIsImportant] = useState(false);

  useEffect(() => {
    setNotes(loadSavedNotes());
  }, []);

  const handleOpenNewModal = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormCategory('Thought');
    setFormContent('');
    setFormTags('Data Science, Python');
    setFormIsPinned(false);
    setFormIsImportant(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormContent(note.content);
    setFormTags(note.tags.join(', '));
    setFormIsPinned(!!note.isPinned);
    setFormIsImportant(!!note.isImportant);
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Calculate approximate read time
    const words = formContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    const readTime = `${minutes} min read`;

    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    if (editingNote) {
      const updated = notes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: formTitle.trim(),
              category: formCategory,
              content: formContent.trim(),
              tags: parsedTags.length > 0 ? parsedTags : ['General'],
              isPinned: formIsPinned,
              isImportant: formIsImportant,
              readTime,
            }
          : n
      );
      setNotes(updated);
      saveNotes(updated);
    } else {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        date: currentDate,
        tags: parsedTags.length > 0 ? parsedTags : ['General'],
        isPinned: formIsPinned,
        isImportant: formIsImportant,
        readTime,
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      saveNotes(updated);
    }

    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Delete this note permanently?')) {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      saveNotes(updated);
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    );
    setNotes(updated);
    saveNotes(updated);
  };

  const handleCopyNote = (note: NoteItem) => {
    const text = `${note.title}\n[${note.category.toUpperCase()}] • ${note.date}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all notes and notices to default records?')) {
      setNotes(DEFAULT_NOTES);
      saveNotes(DEFAULT_NOTES);
    }
  };

  const handleExportMarkdown = () => {
    const mdContent = notes
      .map(
        (n) =>
          `# ${n.title}\n**Category:** ${n.category} | **Date:** ${n.date} | **Tags:** ${n.tags.join(', ')}\n${n.isImportant ? '**[IMPORTANT NOTICE]**\n' : ''}\n${n.content}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ankit_Patel_Thoughts_Notices_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'PINNED') return !!note.isPinned;
    if (selectedCategory === 'NOTICES') return note.category === 'Notice' || !!note.isImportant;
    if (selectedCategory === 'THOUGHTS') return note.category === 'Thought';
    if (selectedCategory === 'RESEARCH') return note.category === 'Research';
    if (selectedCategory === 'LEARNING') return note.category === 'Learning';

    return true;
  });

  // Sort: Pinned first, then by date / creation
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const noticesCount = notes.filter((n) => n.category === 'Notice' || n.isImportant).length;

  return (
    <section id="notes-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Architectural Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        06
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10 border-b-2 border-black pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
              VOLUME 01 // 06. THOUGHT LOG & BULLETINS
            </span>
            <span className="text-xs font-mono font-bold text-[#52525B]">
              LIVE NOTES & OFFICIAL NOTICES
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
            Notes & Notices
          </h2>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black text-xs font-mono font-black uppercase flex items-center gap-2 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>WRITE NEW NOTE</span>
          </button>
          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-2.5 bg-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-black text-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
            title="Export all notes to Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT MD</span>
          </button>
        </div>
      </div>

      {/* Official Notice Announcement Banner */}
      <div className="bg-[#00FF00]/10 border-2 border-black p-5 sm:p-6 mb-8 shadow-[6px_6px_0px_#000000] relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00AA00] rounded-full animate-pulse" />
            <span className="font-mono text-xs font-black uppercase text-black tracking-wider">
              PRIMARY CANDIDATE STATUS & NOTICE BOARD ({noticesCount} ACTIVE NOTICES)
            </span>
          </div>
          <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-black text-white uppercase border border-black self-start sm:self-auto">
            LIVE DISPATCH // BCA &apos;27
          </span>
        </div>
        <div className="mt-3 text-xs sm:text-sm font-mono text-black font-medium leading-relaxed">
          <strong>LATEST BROADCAST:</strong> Open for Data Science, Machine Learning, and BI roles across Noida, Delhi NCR, Bangalore, Mumbai, or Remote. All project repositories, benchmarks, and interactive demo simulators are maintained live below.
        </div>
      </div>

      {/* Control Bar: Search & Category Filters */}
      <div className="bg-white border-2 border-black p-4 mb-8 shadow-[4px_4px_0px_#000000] relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'ALL LOGS' },
            { id: 'PINNED', label: 'PINNED' },
            { id: 'NOTICES', label: 'NOTICES' },
            { id: 'THOUGHTS', label: 'THOUGHTS' },
            { id: 'RESEARCH', label: 'RESEARCH' },
            { id: 'LEARNING', label: 'LEARNING' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000000]'
                  : 'bg-[#F9F9F9] text-[#52525B] border-black/30 hover:border-black hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
            <input
              type="text"
              placeholder="Search thoughts & tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F9F9F9] border-2 border-black text-xs font-mono font-bold text-black focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#52525B] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleResetDefaults}
            className="p-2 bg-white hover:bg-red-50 text-[#52525B] hover:text-red-600 border-2 border-black cursor-pointer"
            title="Reset to default notes"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="bg-[#F9F9F9] border-2 border-dashed border-black p-12 text-center relative z-10">
          <StickyNote className="w-12 h-12 text-black/40 mx-auto mb-3" />
          <h3 className="font-black text-lg text-black uppercase mb-1">No notes match your criteria</h3>
          <p className="text-xs font-mono text-[#52525B] mb-4">
            Try adjusting your search query or create a new thought/notice.
          </p>
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-black uppercase inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>WRITE NOTE</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {sortedNotes.map((note) => {
            const isNotice = note.category === 'Notice' || note.isImportant;

            return (
              <article
                key={note.id}
                className={`bg-white border-2 border-black flex flex-col justify-between transition-all shadow-[6px_6px_0px_#000000] hover:shadow-[9px_9px_0px_#000000] hover:-translate-y-0.5 ${
                  note.isPinned ? 'ring-2 ring-black' : ''
                }`}
              >
                {/* Top Card Ribbon */}
                <div>
                  <div
                    className={`p-4 border-b-2 border-black flex items-center justify-between ${
                      isNotice ? 'bg-[#00FF00]/20' : 'bg-[#F9F9F9]'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-black ${
                          isNotice
                            ? 'bg-[#00FF00] text-black'
                            : 'bg-black text-white'
                        }`}
                      >
                        {note.category.toUpperCase()}
                      </span>

                      {note.isPinned && (
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 bg-black text-white border border-black flex items-center gap-1">
                          <Pin className="w-3 h-3 text-[#00FF00]" />
                          <span>PINNED</span>
                        </span>
                      )}

                      {note.isImportant && (
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 bg-red-600 text-white border border-black flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>IMPORTANT</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#52525B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{note.date}</span>
                      </span>
                      {note.readTime && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{note.readTime}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Note Body */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight leading-snug mb-3">
                      {note.title}
                    </h3>
                    <div className="text-xs sm:text-sm text-black font-medium font-mono leading-relaxed whitespace-pre-line">
                      {note.content}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Tags & Action Bar */}
                <div className="p-4 border-t-2 border-black bg-[#F9F9F9] flex flex-wrap items-center justify-between gap-3">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {note.tags.map((tag, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setSearchQuery(tag)}
                        className="text-[10px] font-mono font-bold bg-white text-[#52525B] hover:text-black hover:border-black px-2 py-0.5 border border-black/30 cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1.5 border border-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer ${
                        note.isPinned ? 'bg-[#00FF00]' : 'bg-white'
                      }`}
                      title={note.isPinned ? 'Unpin note' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopyNote(note)}
                      className="p-1.5 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                      title="Copy note content"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-[#00AA00]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="p-1.5 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 bg-white border border-black text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Bottom Dispatch / Contact Bridge */}
      <div className="mt-12 bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_#00FF00] flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <span className="text-[10px] font-mono font-black text-[#00FF00] uppercase tracking-widest block mb-1">
            // COLLABORATIVE INQUIRY & DISCUSSIONS
          </span>
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Have thoughts or a project discussion?
          </h3>
          <p className="text-xs font-mono text-[#A1A1AA] mt-1 max-w-xl">
            Directly connect with Ankit to discuss machine learning architectures, tabular data pipelines, or internship opportunities.
          </p>
        </div>

        <button
          onClick={() => {
            if (setActiveTab) {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="px-6 py-3 bg-[#00FF00] text-black hover:bg-white font-mono text-xs font-black uppercase flex items-center gap-2 shrink-0 transition-all border-2 border-black cursor-pointer shadow-[3px_3px_0px_#FFFFFF]"
        >
          <span>SEND DISPATCH</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Note Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border-4 border-black w-full max-w-2xl flex flex-col shadow-[12px_12px_0px_#000000] animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#F9F9F9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#52525B]">
                  BULLETIN & THOUGHT LOG WRITER
                </span>
                <h3 className="text-2xl font-black text-black uppercase">
                  {editingNote ? 'Edit Note / Notice' : 'Write New Thought or Notice'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNote} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="block text-xs font-mono font-bold text-black mb-1">
                  TITLE / HEADLINE:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Why XGBoost beats Neural Nets on Tabular Features..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-black mb-1">
                    CATEGORY:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as NoteItem['category'])}
                    className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none"
                  >
                    <option value="Notice">Notice / Announcement</option>
                    <option value="Thought">Thought & Opinion</option>
                    <option value="Research">Research & Experiments</option>
                    <option value="Learning">Learning & TIL</option>
                    <option value="Milestone">Milestone & Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-black mb-1">
                    TAGS (COMMA SEPARATED):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ML, Python, PostgreSQL, DAX"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="p-3 bg-[#F9F9F9] border-2 border-black flex flex-wrap items-center gap-6 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="w-4 h-4 border-2 border-black accent-black cursor-pointer"
                  />
                  <span className="font-bold text-black">PIN TO TOP</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsImportant}
                    onChange={(e) => setFormIsImportant(e.target.checked)}
                    className="w-4 h-4 border-2 border-black accent-red-600 cursor-pointer"
                  />
                  <span className="font-bold text-red-600">MARK AS IMPORTANT NOTICE</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-black mb-1">
                  CONTENT / BODY (SUPPORTS LINE BREAKS):
                </label>
                <textarea
                  rows={8}
                  placeholder="Write your insightful thought, experiment findings, or critical hiring update..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-medium text-black focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border-2 border-black font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingNote ? 'UPDATE NOTE' : 'PUBLISH NOTE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
