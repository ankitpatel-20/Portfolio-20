import React, { useState, useEffect } from 'react';
import { NoteItem, NavigationTab } from '../types';
import {
  loadSavedNotes,
  saveNotes,
  DEFAULT_NOTES,
} from '../utils/portfolioStorage';
import {
  saveNoteToSupabase,
  fetchAllNotesFromSupabase,
  deleteNoteFromSupabase,
} from '../lib/supabase';
import {
  StickyNote,
  Pin,
  AlertCircle,
  Plus,
  Search,
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
  Database,
  RefreshCw,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAdminAuth } from '../utils/adminAuth';
import { AdminAuthModal } from './AdminAuthModal';

interface NotesSectionProps {
  setActiveTab?: (tab: NavigationTab) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ setActiveTab }) => {
  const { isAdmin, logout } = useAdminAuth();
  const [notes, setNotes] = useState<NoteItem[]>(loadSavedNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Auth Gate Modal State
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [authModalTitle, setAuthModalTitle] = useState('Admin Authentication Required');
  const [authModalDescription, setAuthModalDescription] = useState(
    'Only portfolio administrator (Ankit Patel) can publish, modify, or delete notes.'
  );

  // Deletion & Reset Inline Confirmation State
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [isModalDeleteConfirming, setIsModalDeleteConfirming] = useState(false);

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<NoteItem['category']>('Thought');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formIsImportant, setFormIsImportant] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to ensure admin authorization before executing any write/delete
  const executeWithAdminAuth = (action: () => void, title?: string, desc?: string) => {
    if (isAdmin) {
      action();
    } else {
      if (title) setAuthModalTitle(title);
      if (desc) setAuthModalDescription(desc);
      setPendingAction(() => action);
      setIsAdminAuthModalOpen(true);
    }
  };

  // Load notes from Supabase or local backup on mount
  const syncNotesFromCloud = async () => {
    setIsSyncing(true);
    try {
      const res = await fetchAllNotesFromSupabase();
      if (res.fromSupabase && res.data.length > 0) {
        const formatted: NoteItem[] = res.data.map((item) => ({
          id: item.id || `db-${Date.now()}`,
          title: item.title,
          category: item.category,
          content: item.content,
          date: item.date || new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          tags: Array.isArray(item.tags) ? item.tags : ['General'],
          isPinned: item.is_pinned,
          isImportant: item.is_important,
          readTime: item.read_time,
        }));
        setNotes(formatted);
        saveNotes(formatted);
        setSyncStatus('Synced from Supabase database');
      } else {
        setNotes(loadSavedNotes());
      }
    } catch {
      setNotes(loadSavedNotes());
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  useEffect(() => {
    syncNotesFromCloud();
  }, []);

  const handleOpenNewModal = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormCategory('Thought');
    setFormContent('');
    setFormTags('Data Science, Python, SQL');
    setFormIsPinned(false);
    setFormIsImportant(false);
    setIsModalDeleteConfirming(false);
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
    setIsModalDeleteConfirming(false);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const words = formContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    const readTime = `${minutes} min read`;

    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const notePayload = {
      title: formTitle.trim(),
      category: formCategory,
      content: formContent.trim(),
      date: currentDate,
      tags: parsedTags.length > 0 ? parsedTags : ['General'],
      is_pinned: formIsPinned,
      is_important: formIsImportant,
      read_time: readTime,
    };

    // Save to Supabase (in background)
    saveNoteToSupabase(notePayload).catch((err) =>
      console.warn('Supabase save note notice:', err)
    );

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
      showToast('Note updated successfully!');
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
      showToast('New note published successfully!');
    }

    setIsModalOpen(false);
  };

  // Reliable, in-UI deletion handler (replaces broken window.confirm)
  const executeDeleteNote = async (id: string) => {
    const noteToDelete = notes.find((n) => n.id === id);
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    setDeletingNoteId(null);
    setIsModalDeleteConfirming(false);
    if (editingNote && editingNote.id === id) {
      setIsModalOpen(false);
    }
    showToast(`Note "${noteToDelete?.title ? noteToDelete.title.slice(0, 25) + '...' : 'Item'}" deleted.`);

    // Delete in Supabase
    try {
      await deleteNoteFromSupabase(id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  };

  const handleTogglePin = (id: string) => {
    executeWithAdminAuth(
      () => {
        const updated = notes.map((n) =>
          n.id === id ? { ...n, isPinned: !n.isPinned } : n
        );
        setNotes(updated);
        saveNotes(updated);
        showToast('Note pin status updated');
      },
      'Admin Access Required',
      'Only the portfolio administrator can pin or unpin notes.'
    );
  };

  const handleCopyNote = (note: NoteItem) => {
    const text = `${note.title}\n[${note.category.toUpperCase()}] • ${note.date}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeResetDefaults = () => {
    setNotes(DEFAULT_NOTES);
    saveNotes(DEFAULT_NOTES);
    setIsResetConfirming(false);
    showToast('Reset notes and notices to default records.');
  };

  const handleExportMarkdown = () => {
    const mdContent = notes
      .map(
        (n) =>
          `# ${n.title}\n**Category:** ${n.category} | **Date:** ${n.date} | **Tags:** ${n.tags.join(', ')}\n${n.isImportant ? '**[IMPORTANT NOTICE]**\n' : ''}\n${n.content}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ankit_patel_notes_export_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported notes as Markdown.');
  };

  // Filter & Search Logic
  const filteredNotes = notes.filter((n) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'NOTICES' && (n.category === 'Notice' || n.isImportant)) ||
      n.category.toUpperCase() === selectedCategory;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query) ||
      n.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Pinned items first, then important notices, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return 0;
  });

  return (
    <section className="py-20 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00FF00] border-2 border-black text-black px-4 py-2.5 font-mono text-xs font-black uppercase shadow-[4px_4px_0px_#000000] flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Privilege Status Banner */}
      <div className="mb-6 relative z-10 border-2 border-black p-3 bg-white shadow-[4px_4px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00FF00] border border-black animate-pulse shrink-0" />
              <div className="font-mono text-xs">
                <span className="font-black text-black uppercase">ADMIN ACTIVE (ANKIT PATEL)</span>
                <span className="text-[#52525B] hidden md:inline ml-2">
                  • Full authoring, editing & deletion privileges enabled
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
              <div className="font-mono text-xs">
                <span className="font-black text-black uppercase">PUBLIC GUEST VIEW</span>
                <span className="text-[#52525B] hidden md:inline ml-2">
                  • Verified bulletins & notes. Portfolio modification restricted to Administrator
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isAdmin ? (
            <button
              onClick={logout}
              className="px-2.5 py-1 bg-[#F4F4F5] hover:bg-black hover:text-white border border-black font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer"
              title="Lock Admin Mode"
            >
              [ LOCK / LOGOUT ]
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalTitle('Administrator Unlock');
                setAuthModalDescription(
                  'Enter administrator credentials to unlock publishing and portfolio modification.'
                );
                setPendingAction(null);
                setIsAdminAuthModalOpen(true);
              }}
              className="px-3 py-1 bg-black hover:bg-[#00FF00] text-white hover:text-black border border-black font-mono text-[11px] font-black uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000000]"
            >
              <Lock className="w-3 h-3" />
              <span>UNLOCK ADMIN MODE</span>
            </button>
          )}

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-2.5 py-1 bg-white hover:bg-[#F4F4F5] border border-black font-mono text-[11px] font-bold text-[#52525B] hover:text-black uppercase cursor-pointer"
            >
              Admin Panel →
            </button>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b-2 border-black gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-black text-white text-[11px] font-mono font-black uppercase tracking-wider">
              SECTION // 06
            </span>
            <span className="px-2.5 py-1 bg-[#00FF00] text-black text-[11px] font-mono font-bold uppercase tracking-wider border border-black flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {notes.length} VERIFIED ENTRIES
            </span>
            {isSyncing && (
              <span className="text-[10px] font-mono text-[#52525B] flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> SYNCING...
              </span>
            )}
            {syncStatus && (
              <span className="text-[10px] font-mono text-[#008800] font-bold">
                ✓ {syncStatus}
              </span>
            )}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
            NOTES &amp; NOTICES
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[#52525B] mt-2 max-w-2xl">
            A real-time bulletin board of engineering discoveries, daily logs, project breakthroughs,
            and recruitment notices maintained directly by Ankit Patel.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={syncNotesFromCloud}
            disabled={isSyncing}
            className="px-3.5 py-2.5 bg-white hover:bg-[#F4F4F5] border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh notes from Supabase database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">REFRESH</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-2.5 bg-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export all notes to Markdown format"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXPORT MD</span>
          </button>

          <button
            onClick={() =>
              executeWithAdminAuth(
                handleOpenNewModal,
                'Admin Authentication Required',
                'Only portfolio administrator (Ankit Patel) can publish new notes or official bulletins.'
              )
            }
            className={`px-4 py-2.5 border-2 border-black text-xs font-mono font-black uppercase flex items-center gap-2 transition-all shadow-[3px_3px_0px_#000000] cursor-pointer ${
              isAdmin
                ? 'bg-[#00FF00] hover:bg-black hover:text-white text-black'
                : 'bg-black hover:bg-[#00FF00] text-white hover:text-black'
            }`}
          >
            {isAdmin ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isAdmin ? 'WRITE NEW NOTE' : 'ADMIN: WRITE NOTE'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 relative z-10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'ALL ENTRIES' },
            { id: 'NOTICES', label: '📢 NOTICES' },
            { id: 'THOUGHT', label: 'THOUGHTS' },
            { id: 'RESEARCH', label: 'RESEARCH' },
            { id: 'LEARNING', label: 'LEARNING & TIL' },
            { id: 'MILESTONE', label: 'MILESTONES' },
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

        {/* Search Field & Reset Button */}
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

          {/* Reset Defaults with inline confirmation */}
          {isResetConfirming ? (
            <div className="flex items-center gap-1.5 bg-red-50 border-2 border-red-600 p-1 animate-fadeIn">
              <span className="text-[10px] font-mono font-black text-red-700 uppercase px-1">
                Reset notes?
              </span>
              <button
                type="button"
                onClick={executeResetDefaults}
                className="px-2 py-1 bg-red-600 text-white hover:bg-black font-mono text-[10px] font-black uppercase cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setIsResetConfirming(false)}
                className="px-2 py-1 bg-white border border-black font-mono text-[10px] font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                executeWithAdminAuth(
                  () => setIsResetConfirming(true),
                  'Admin Authentication Required',
                  'Only portfolio administrator (Ankit Patel) can reset notes to default values.'
                )
              }
              className="p-2 bg-white hover:bg-red-50 text-[#52525B] hover:text-red-600 border-2 border-black cursor-pointer"
              title="Reset to default notes (Admin only)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
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
            onClick={() =>
              executeWithAdminAuth(
                handleOpenNewModal,
                'Admin Authentication Required',
                'Only portfolio administrator (Ankit Patel) can publish new notes.'
              )
            }
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
                          isNotice ? 'bg-black text-[#00FF00]' : 'bg-white text-black'
                        }`}
                      >
                        {note.category}
                      </span>

                      {note.isImportant && (
                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-red-600 text-white border border-black flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          OFFICIAL NOTICE
                        </span>
                      )}

                      {note.isPinned && (
                        <span className="text-[10px] font-mono font-bold text-black flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-black text-black" />
                          PINNED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#52525B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {note.date}
                      </span>
                      {note.readTime && (
                        <span className="hidden sm:flex items-center gap-1">
                          • <Clock className="w-3 h-3" />
                          {note.readTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="font-black text-lg text-black uppercase tracking-tight mb-3 leading-snug">
                      {note.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#27272A] leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Tags & Actions */}
                <div className="p-4 border-t-2 border-black bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
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

                  {/* Actions Bar */}
                  {deletingNoteId === note.id ? (
                    /* Inline Deletion Confirmation */
                    <div className="flex items-center gap-1.5 bg-red-50 border-2 border-red-600 p-1.5 animate-fadeIn shadow-[2px_2px_0px_#DC2626]">
                      <div className="flex items-center gap-1 text-red-700 font-mono text-[10px] font-black uppercase px-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Delete?</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => executeDeleteNote(note.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-black text-white font-mono text-[10px] font-black uppercase transition-colors cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingNoteId(null)}
                        className="px-2 py-1 bg-white hover:bg-gray-200 border border-black text-black font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {/* Copy note content (available to everyone) */}
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1.5 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                        title="Copy note text"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-[#00AA00]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Pin Button */}
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        className={`p-1.5 border border-black transition-colors cursor-pointer ${
                          note.isPinned
                            ? 'bg-[#00FF00] text-black hover:bg-black hover:text-white'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                        title={
                          isAdmin
                            ? note.isPinned ? 'Unpin note' : 'Pin note'
                            : 'Admin required to pin notes'
                        }
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() =>
                          executeWithAdminAuth(
                            () => handleOpenEditModal(note),
                            'Admin Authentication Required',
                            'Only the portfolio administrator (Ankit Patel) can edit this note.'
                          )
                        }
                        className="p-1.5 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                        title={isAdmin ? 'Edit note' : 'Admin required to edit note'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          executeWithAdminAuth(
                            () => setDeletingNoteId(note.id),
                            'Admin Authentication Required',
                            'Only the portfolio administrator (Ankit Patel) can delete notes.'
                          )
                        }
                        className="p-1.5 bg-white border border-black text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        title={isAdmin ? 'Delete note' : 'Admin required to delete note'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
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
            VERIFIED DIRECT PIPELINE
          </span>
          <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight">
            Have a note query, technical challenge, or opportunity?
          </h3>
          <p className="text-xs font-mono text-[#A1A1AA] mt-1">
            Directly connect with Ankit Patel for enterprise data science, machine learning models, or analytics consulting.
          </p>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('contact')}
            className="px-6 py-3 bg-[#00FF00] hover:bg-white text-black font-mono text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[4px_4px_0px_#FFFFFF] cursor-pointer shrink-0"
          >
            <span>TRANSMIT MESSAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Note Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-black w-full max-w-2xl shadow-[8px_8px_0px_#000000] my-8 relative">
            <div className="p-5 border-b-2 border-black flex items-center justify-between bg-black text-white">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-[#00FF00]" />
                <h3 className="font-black text-base uppercase tracking-tight">
                  {editingNote ? 'EDIT NOTE / BROADCAST (ADMIN)' : 'WRITE NOTE / BROADCAST (ADMIN)'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 bg-white text-black hover:bg-[#00FF00] border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-black mb-1">
                  TITLE / HEADLINE:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily TIL: Vector embeddings with pgvector on PostgreSQL"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none"
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
              <div className="pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
                {editingNote && (
                  <div>
                    {isModalDeleteConfirming ? (
                      <div className="flex items-center gap-1.5 bg-red-50 border-2 border-red-600 p-1">
                        <span className="text-[10px] font-mono font-black text-red-700 uppercase">
                          Delete note?
                        </span>
                        <button
                          type="button"
                          onClick={() => executeDeleteNote(editingNote.id)}
                          className="px-2 py-1 bg-red-600 text-white font-mono text-[10px] font-black uppercase cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalDeleteConfirming(false)}
                          className="px-2 py-1 bg-white border border-black font-mono text-[10px] font-bold uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsModalDeleteConfirming(true)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-600 hover:text-white border-2 border-red-600 text-red-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Note</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Authentication Gate Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => {
          setIsAdminAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setIsAdminAuthModalOpen(false);
          if (pendingAction) {
            const action = pendingAction;
            setPendingAction(null);
            action();
          }
        }}
        title={authModalTitle}
        actionDescription={authModalDescription}
        onNavigateToAdmin={setActiveTab ? () => setActiveTab('admin') : undefined}
      />
    </section>
  );
};
