import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Database,
  Calendar,
  Mail,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  User,
  Building,
  Phone,
  MessageSquare,
  Trash2,
  Download,
  Copy,
  Check,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Terminal,
  StickyNote,
  Plus,
  Video,
  HelpCircle,
} from 'lucide-react';
import {
  fetchAllAppointments,
  fetchAllContacts,
  fetchAllNotesFromSupabase,
  saveNoteToSupabase,
  deleteNoteFromSupabase,
  AppointmentData,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SQL_SETUP_SCRIPT,
  supabase,
} from '../lib/supabase';
import { NavigationTab } from '../types';

interface AdminPanelSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenMeet?: (topic?: string) => void;
}

const ADMIN_EMAIL = 'ankitpatel11411@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = '@nKiTp@TeL22';

export const getStoredAdminPassword = (): string => {
  return localStorage.getItem('ankit_custom_admin_pwd') || DEFAULT_ADMIN_PASSWORD;
};

export const AdminPanelSection: React.FC<AdminPanelSectionProps> = ({ setActiveTab, onOpenMeet }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ankit_admin_auth') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Forgot Password / Recovery State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState(ADMIN_EMAIL);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [showRecoveredPassword, setShowRecoveredPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState<string | null>(null);
  const [copiedRecoveryPwd, setCopiedRecoveryPwd] = useState(false);

  // Data state
  const [activeTab, setActiveTabMode] = useState<'appointments' | 'contacts' | 'notes' | 'sql' | 'settings'>(
    'appointments'
  );
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Quick Daily Note Form State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('Thought');
  const [quickContent, setQuickContent] = useState('');
  const [quickTags, setQuickTags] = useState('Daily Log, Data Science');
  const [isPublishingNote, setIsPublishingNote] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const currentActivePassword = getStoredAdminPassword();

    // Credentials check: ankitpatel11411@gmail.com / @nKiTp@TeL22
    const isEmailValid = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const isPassValid = cleanPass === currentActivePassword;

    if (isEmailValid && isPassValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ankit_admin_auth', 'true');
      setAuthError(null);
    } else if (!isEmailValid && !isPassValid) {
      setAuthError('Invalid Admin Gmail and Password.');
    } else if (!isEmailValid) {
      setAuthError('Invalid Admin Gmail address.');
    } else {
      setAuthError('Invalid Password.');
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setPasswordUpdateMessage(null);

    const cleanEmail = recoveryEmail.trim().toLowerCase();
    const cleanAns = recoveryAnswer.trim().toLowerCase();

    if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      setRecoveryError('This email is not registered as the administrator.');
      return;
    }

    // Accept BCA, Bachelor of Computer Applications, Ankit, Ankit Patel, or 2024031024
    const validAnswers = [
      'bca',
      'b.c.a',
      'b.c.a.',
      'bachelor of computer applications',
      'ankit',
      'ankit patel',
      '2024031024',
      'vnsgu',
    ];

    if (!validAnswers.includes(cleanAns)) {
      setRecoveryError('Incorrect security answer. Hint: Candidate primary degree program (3-letter degree).');
      return;
    }

    setRecoverySuccess(true);
    setRecoveryError(null);
  };

  const handleApplyNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    localStorage.setItem('ankit_custom_admin_pwd', newPasswordInput.trim());
    setPassword(newPasswordInput.trim());
    setPasswordUpdateMessage('Password updated successfully! Saved to browser vault.');
    setNewPasswordInput('');
    setTimeout(() => setPasswordUpdateMessage(null), 4000);
  };

  const handleResetToDefaultPassword = () => {
    localStorage.removeItem('ankit_custom_admin_pwd');
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setPasswordUpdateMessage('Password reset to default: @nKiTp@TeL22');
    setTimeout(() => setPasswordUpdateMessage(null), 4000);
  };

  const handleAutofillAndLogin = () => {
    const activePwd = getStoredAdminPassword();
    setEmail(ADMIN_EMAIL);
    setPassword(activePwd);
    setIsForgotMode(false);
    setIsAuthenticated(true);
    sessionStorage.setItem('ankit_admin_auth', 'true');
    setAuthError(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ankit_admin_auth');
    setEmail('');
    setPassword('');
    setAuthError(null);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    setStatusMessage('Syncing with Supabase backend database...');
    try {
      const [apptRes, contactRes, notesRes] = await Promise.all([
        fetchAllAppointments(),
        fetchAllContacts(),
        fetchAllNotesFromSupabase(),
      ]);

      setAppointments(apptRes.data || []);
      setContacts(contactRes.data || []);
      setNotes(notesRes.data || []);

      setStatusMessage('Data synced directly from Supabase tables.');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Error loading database records: ' + err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAddDailyNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickContent.trim()) return;

    setIsPublishingNote(true);
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const payload = {
      title: quickTitle.trim(),
      category: quickCategory,
      content: quickContent.trim(),
      date: currentDate,
      tags: quickTags.split(',').map((t) => t.trim()).filter(Boolean),
      is_pinned: false,
      is_important: quickCategory === 'Notice',
      read_time: '1 min read',
    };

    await saveNoteToSupabase(payload);
    setIsPublishingNote(false);
    setQuickTitle('');
    setQuickContent('');
    setStatusMessage('Daily Note/Notice published directly to Supabase table "notes"!');
    loadAllData();
  };

  const handleDeleteNoteItem = async (id: string) => {
    if (window.confirm('Delete this note from Supabase?')) {
      await deleteNoteFromSupabase(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setStatusMessage('Note removed.');
    }
  };

  const handleExportCSV = (type: 'appointments' | 'contacts' | 'notes') => {
    let dataToExport: any[] = [];
    if (type === 'appointments') dataToExport = appointments;
    if (type === 'contacts') dataToExport = contacts;
    if (type === 'notes') dataToExport = notes;

    if (dataToExport.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login Gate
  if (!isAuthenticated) {
    if (isForgotMode) {
      const currentActivePassword = getStoredAdminPassword();

      return (
        <section className="py-20 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen flex items-center justify-center">
          <div className="bg-white border-2 border-black p-8 max-w-md w-full shadow-[8px_8px_0px_#000000] relative">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-black bg-black text-white p-3 -mx-8 -mt-8">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#00FF00]" />
                <h3 className="font-black text-sm uppercase tracking-tight">Admin Password Recovery</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setRecoveryError(null);
                  setRecoverySuccess(false);
                }}
                className="text-white/80 hover:text-[#00FF00] flex items-center gap-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>

            <p className="text-xs font-mono text-[#52525B] mb-5">
              Verify your administrative identity to recover or reset your access credentials for the Supabase control panel.
            </p>

            {!recoverySuccess ? (
              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                {/* Admin Email Confirmation */}
                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Registered Admin Gmail
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => {
                      setRecoveryEmail(e.target.value);
                      setRecoveryError(null);
                    }}
                    placeholder="ankitpatel11411@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold focus:bg-[#F9F9F9] focus:outline-none"
                  />
                  <p className="text-[10px] font-mono text-[#71717A] mt-1">
                    Default account: ankitpatel11411@gmail.com
                  </p>
                </div>

                {/* Security Question Challenge */}
                <div className="p-3 bg-[#F9F9F9] border-2 border-black space-y-2">
                  <div className="flex items-center gap-1.5 text-black">
                    <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                    <label className="text-[11px] font-mono font-black uppercase">
                      Security Challenge Question
                    </label>
                  </div>
                  <p className="text-xs font-mono font-bold text-black">
                    What is your Bachelor's degree program or Candidate Name?
                  </p>
                  <input
                    type="text"
                    required
                    value={recoveryAnswer}
                    onChange={(e) => {
                      setRecoveryAnswer(e.target.value);
                      setRecoveryError(null);
                    }}
                    placeholder="Enter answer (e.g. BCA or Ankit Patel)..."
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold focus:bg-white focus:outline-none placeholder-[#A1A1AA]"
                  />
                  <p className="text-[10px] font-mono text-[#52525B]">
                    Hint: 3-letter undergraduate degree program (BCA) or Student ID from profile.
                  </p>
                </div>

                {recoveryError && (
                  <div className="p-2.5 bg-red-50 border-2 border-red-600 text-[11px] font-mono text-red-700 font-bold flex items-start gap-1.5 animate-shake">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase transition-all shadow-[3px_3px_0px_#000000] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Verify Identity & Reveal Password</span>
                  </button>

                  {/* Dispatch to Gmail Direct Link */}
                  <a
                    href={`mailto:${ADMIN_EMAIL}?subject=Admin%20Password%20Recovery%20-%20Ankit%20Patel%20Portfolio&body=Hi%20Ankit,%0D%0A%0D%0AHere%20is%20your%20registered%20portfolio%20admin%20credential:%0D%0A•%20Admin%20Gmail:%20${ADMIN_EMAIL}%0D%0A•%20Admin%20Password:%20${encodeURIComponent(currentActivePassword)}%0D%0A%0D%0ARegards,%0D%0AAnkit%20Patel%20Portfolio%20System`}
                    className="w-full py-2.5 bg-white text-black hover:bg-[#F4F4F5] border-2 border-black font-mono text-xs font-bold uppercase text-center transition-colors shadow-[2px_2px_0px_#000000] flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Password to ankitpatel11411@gmail.com</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setRecoveryError(null);
                    }}
                    className="w-full py-2 text-center text-xs font-mono font-bold text-[#52525B] hover:text-black uppercase cursor-pointer"
                  >
                    ← Cancel and Back to Login
                  </button>
                </div>
              </form>
            ) : (
              /* Verified Recovery State */
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border-2 border-green-600 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <span className="font-mono text-xs font-black text-green-800 uppercase block">
                      Identity Verified: Ankit Patel
                    </span>
                    <span className="font-mono text-[10px] text-green-700">
                      Administrative security challenge passed successfully.
                    </span>
                  </div>
                </div>

                {/* Password Display Box */}
                <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-black uppercase text-black">
                      Active Admin Password
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRecoveredPassword(!showRecoveredPassword)}
                      className="text-[10px] font-mono font-bold text-[#2563EB] hover:text-black uppercase flex items-center gap-1 cursor-pointer"
                    >
                      {showRecoveredPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showRecoveredPassword ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2.5 bg-white border-2 border-black">
                    <span className="font-mono text-sm font-black text-black tracking-wider selection:bg-[#00FF00]">
                      {showRecoveredPassword ? currentActivePassword : '•••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(currentActivePassword);
                        setCopiedRecoveryPwd(true);
                        setTimeout(() => setCopiedRecoveryPwd(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black font-mono text-[10px] font-black uppercase flex items-center gap-1 border border-black cursor-pointer transition-colors"
                      title="Copy Password"
                    >
                      {copiedRecoveryPwd ? <Check className="w-3 h-3 text-[#00FF00]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRecoveryPwd ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-[#52525B] flex justify-between pt-1">
                    <span>Default Master: <code className="font-bold text-black">@nKiTp@TeL22</code></span>
                    <span>Status: <strong className="text-green-700">Active</strong></span>
                  </div>
                </div>

                {/* Quick Autofill & Sign In */}
                <button
                  type="button"
                  onClick={handleAutofillAndLogin}
                  className="w-full py-3 bg-[#00FF00] text-black hover:bg-black hover:text-white border-2 border-black font-mono text-xs font-black uppercase transition-all shadow-[3px_3px_0px_#000000] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Autofill & Sign In to Admin Panel</span>
                </button>

                {/* Option to change password */}
                <div className="pt-2 border-t-2 border-black/10">
                  <h4 className="text-[11px] font-mono font-black uppercase text-black mb-2">
                    Set a New Custom Password (Optional)
                  </h4>
                  <form onSubmit={handleApplyNewPassword} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Enter new password..."
                        className="flex-1 px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-[10px] font-black uppercase cursor-pointer"
                      >
                        SAVE
                      </button>
                    </div>
                  </form>
                  {passwordUpdateMessage && (
                    <p className="text-[10px] font-mono font-bold text-green-700 mt-1.5">
                      ✓ {passwordUpdateMessage}
                    </p>
                  )}
                  {localStorage.getItem('ankit_custom_admin_pwd') && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultPassword}
                      className="mt-2 text-[10px] font-mono font-bold text-red-600 hover:text-black underline cursor-pointer"
                    >
                      Reset back to default password (@nKiTp@TeL22)
                    </button>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setRecoverySuccess(false);
                      setRecoveryError(null);
                      setEmail(ADMIN_EMAIL);
                      setPassword(currentActivePassword);
                    }}
                    className="w-full py-2 bg-white hover:bg-[#F4F4F5] border-2 border-black font-mono text-xs font-bold uppercase transition-colors"
                  >
                    ← Back to Login Screen
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      );
    }

    // Standard Login Screen
    return (
      <section className="py-20 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-white border-2 border-black p-8 max-w-md w-full shadow-[8px_8px_0px_#000000] relative">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black bg-black text-white p-3 -mx-8 -mt-8">
            <Lock className="w-5 h-5 text-[#00FF00]" />
            <h3 className="font-black text-sm uppercase tracking-tight">Admin Console Authentication</h3>
          </div>

          <p className="text-xs font-mono text-[#52525B] mb-6">
            Secure admin access for database telemetry, recruiter queries, appointments, and daily notes in Supabase.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                Admin Gmail
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="ankitpatel11411@gmail.com"
                  className="w-full pl-3.5 pr-3.5 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold focus:bg-[#F9F9F9] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono font-bold text-black uppercase">
                  Admin Password
                </label>
                <button
                  type="button"
                  id="admin-forgot-password-link"
                  onClick={() => {
                    setIsForgotMode(true);
                    setRecoveryEmail(email || ADMIN_EMAIL);
                    setRecoveryError(null);
                    setRecoverySuccess(false);
                  }}
                  className="text-[11px] font-mono font-black text-[#2563EB] hover:text-black hover:underline uppercase cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Enter admin password..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold focus:bg-[#F9F9F9] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/60 hover:text-black p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-50 border-2 border-red-600 text-[11px] font-mono text-red-700 font-bold flex items-start gap-1.5 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase transition-all shadow-[3px_3px_0px_#000000] cursor-pointer"
              >
                Sign In to Admin Panel
              </button>

              <button
                type="button"
                id="admin-forgot-password-btn"
                onClick={() => {
                  setIsForgotMode(true);
                  setRecoveryEmail(email || ADMIN_EMAIL);
                  setRecoveryError(null);
                  setRecoverySuccess(false);
                }}
                className="w-full py-2 bg-white text-[#52525B] hover:text-black border border-black/20 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer hover:border-black flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Forgot password? Recover account credentials</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section id="admin-panel-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        ADM
      </div>

      {/* Header Bar */}
      <div className="flex flex-col gap-3 mb-8 relative z-10 border-b-2 border-black pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
              ADMINISTRATIVE HUB // 06. TELEMETRY & VAULT
            </span>
            <span className="text-xs font-mono font-bold text-[#52525B]">
              SUPABASE DB: {SUPABASE_PROJECT_ID}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMeet && (
              <button
                id="admin-google-meet-btn"
                onClick={() => onOpenMeet()}
                className="px-3.5 py-1.5 bg-white hover:bg-[#00FF00] border-2 border-black text-xs font-mono font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
                title="Open Google Meet Space Manager"
              >
                <Video className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>GOOGLE MEET</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-white hover:bg-[#F4F4F5] border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'SYNCING...' : 'REFRESH'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-black text-white hover:bg-red-600 border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
          <div>
            <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
              Admin & Query Vault
            </h2>
            <p className="text-[#52525B] text-base max-w-2xl font-medium mt-1">
              Live database control center for appointments, client inquiries, daily thoughts/notices, and SQL execution.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] text-center">
              <span className="text-[10px] font-mono font-bold text-[#52525B] block uppercase">
                Appointments
              </span>
              <span className="text-xl font-black text-black">{appointments.length}</span>
            </div>
            <div className="px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] text-center">
              <span className="text-[10px] font-mono font-bold text-[#52525B] block uppercase">
                Queries
              </span>
              <span className="text-xl font-black text-black">{contacts.length}</span>
            </div>
            <div className="px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] text-center">
              <span className="text-[10px] font-mono font-bold text-[#52525B] block uppercase">
                Daily Notes
              </span>
              <span className="text-xl font-black text-black">{notes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Notice Toast */}
      {statusMessage && (
        <div className="mb-6 p-3 bg-[#00FF00] border-2 border-black font-mono text-xs font-black text-black flex items-center justify-between shadow-[2px_2px_0px_#000000] animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap border-b-2 border-black bg-[#F4F4F5] mb-6 relative z-10">
        <button
          onClick={() => setActiveTabMode('appointments')}
          className={`px-5 py-3 font-mono text-xs font-black uppercase flex items-center gap-2 border-r-2 border-black transition-colors cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-white text-black -mb-[2px] border-b-2 border-white'
              : 'text-[#52525B] hover:text-black'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>APPOINTMENTS ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTabMode('contacts')}
          className={`px-5 py-3 font-mono text-xs font-black uppercase flex items-center gap-2 border-r-2 border-black transition-colors cursor-pointer ${
            activeTab === 'contacts'
              ? 'bg-white text-black -mb-[2px] border-b-2 border-white'
              : 'text-[#52525B] hover:text-black'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>QUERIES & MESSAGES ({contacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTabMode('notes')}
          className={`px-5 py-3 font-mono text-xs font-black uppercase flex items-center gap-2 border-r-2 border-black transition-colors cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-white text-black -mb-[2px] border-b-2 border-white'
              : 'text-[#52525B] hover:text-black'
          }`}
        >
          <StickyNote className="w-4 h-4 text-[#00AA00]" />
          <span>DAILY NOTES & NOTICES ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTabMode('sql')}
          className={`px-5 py-3 font-mono text-xs font-black uppercase flex items-center gap-2 border-r-2 border-black transition-colors cursor-pointer ${
            activeTab === 'sql'
              ? 'bg-white text-black -mb-[2px] border-b-2 border-white'
              : 'text-[#52525B] hover:text-black'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>SUPABASE SQL CODE</span>
        </button>

        <button
          onClick={() => setActiveTabMode('settings')}
          className={`px-5 py-3 font-mono text-xs font-black uppercase flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-black -mb-[2px] border-b-2 border-white'
              : 'text-[#52525B] hover:text-black'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>SETTINGS & DB</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS VAULT */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments..."
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleExportCSV('appointments')}
              className="px-3.5 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((app, idx) => (
              <div key={idx} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000000]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-black">{app.name}</span>
                      <span className="text-xs font-mono text-[#52525B]">&lt;{app.email}&gt;</span>
                      {app.company && (
                        <span className="text-[10px] font-mono font-bold bg-[#F4F4F5] px-2 py-0.5 border border-black/30 text-black">
                          {app.company}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-1 font-mono text-xs text-black">
                      <span className="bg-[#00FF00] px-2 py-0.5 font-black border border-black">
                        {app.meeting_type}
                      </span>
                      <span>
                        {app.appointment_date} @ {app.appointment_time} [{app.timezone || 'UTC'}]
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {app.meeting_link ? (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={app.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#00FF00] text-black hover:bg-black hover:text-white font-mono text-xs font-black flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
                        >
                          <Video className="w-3.5 h-3.5 text-[#EA4335]" />
                          <span>JOIN MEET</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(app.meeting_link!);
                            setStatusMessage(`Copied Meet link for ${app.name}`);
                            setTimeout(() => setStatusMessage(null), 2500);
                          }}
                          className="p-1.5 bg-white hover:bg-[#F4F4F5] border-2 border-black text-black font-mono text-xs cursor-pointer shadow-[2px_2px_0px_#000000]"
                          title="Copy Google Meet Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : onOpenMeet ? (
                      <button
                        onClick={() => onOpenMeet(`${app.meeting_type} with ${app.name}`)}
                        className="px-3 py-1.5 bg-white hover:bg-[#00FF00] text-black font-mono text-xs font-black flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors cursor-pointer"
                        title="Generate Google Meet Space for this appointment"
                      >
                        <Video className="w-3.5 h-3.5 text-[#EA4335]" />
                        <span>+ CREATE MEET</span>
                      </button>
                    ) : null}

                    <a
                      href={`mailto:${app.email}?subject=Confirmed: ${encodeURIComponent(app.meeting_type)} with Ankit Patel&body=Hi ${encodeURIComponent(app.name)},%0D%0A%0D%0AYour appointment for ${encodeURIComponent(app.meeting_type)} is confirmed for ${encodeURIComponent(app.appointment_date)} at ${encodeURIComponent(app.appointment_time)} (${encodeURIComponent(app.timezone || 'UTC')}).${app.meeting_link ? `%0D%0A%0D%0AGoogle Meet link: ${encodeURIComponent(app.meeting_link)}` : ''}%0D%0A%0D%0ABest regards,%0D%0AAnkit Patel`}
                      className="px-3 py-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black font-mono text-xs font-bold flex items-center gap-1 border border-black shadow-[2px_2px_0px_#000000]"
                    >
                      <Mail className="w-3.5 h-3.5" /> Invite
                    </a>
                  </div>
                </div>
                {app.notes && (
                  <div className="mt-3 p-3 bg-[#F9F9F9] border border-black font-mono text-xs text-black">
                    <strong>Agenda:</strong> {app.notes}
                  </div>
                )}
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="p-12 text-center bg-white border-2 border-dashed border-black/30 font-mono text-xs text-[#52525B]">
                No appointments booked yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT MESSAGES */}
      {activeTab === 'contacts' && (
        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm uppercase font-mono">User Queries & Contact Transmissions</h3>
            <button
              onClick={() => handleExportCSV('contacts')}
              className="px-3.5 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((c, idx) => (
              <div key={idx} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000000] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/20 pb-2">
                  <div>
                    <span className="font-mono text-xs font-black text-black">{c.name}</span>{' '}
                    <span className="font-mono text-xs text-[#52525B]">&lt;{c.email}&gt;</span>
                    {c.subject && (
                      <p className="font-mono text-xs font-bold text-black uppercase mt-0.5">
                        Subject: {c.subject}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : 'Recent'}
                  </span>
                </div>
                <div className="p-3 bg-[#F9F9F9] border border-black font-mono text-xs text-black leading-relaxed whitespace-pre-wrap">
                  {c.message}
                </div>
              </div>
            ))}

            {contacts.length === 0 && (
              <div className="p-12 text-center bg-white border-2 border-dashed border-black/30 font-mono text-xs text-[#52525B]">
                No queries submitted yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY NOTES & NOTICES POSTER */}
      {activeTab === 'notes' && (
        <div className="space-y-8 relative z-10">
          {/* Quick Publish Box */}
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00AA00]" />
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Publish Daily Note / Official Notice (Stores in Supabase with Timestamp)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#00FF00] px-2 py-0.5 border border-black">
                TABLE: notes
              </span>
            </div>

            <form onSubmit={handleAddDailyNote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                    Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Progress: Optimized PostgreSQL indexing for 10M rows"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                  >
                    <option value="Thought">Thought & Opinion</option>
                    <option value="Notice">Notice / Announcement</option>
                    <option value="Research">Research & Experiments</option>
                    <option value="Learning">Learning & Daily TIL</option>
                    <option value="Milestone">Milestone Achieved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily TIL, Python, XGBoost, SQL"
                  value={quickTags}
                  onChange={(e) => setQuickTags(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                  Content / Log Body *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your daily note, engineering discovery, or candidate announcement..."
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishingNote}
                className="px-6 py-3 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[3px_3px_0px_#000000] cursor-pointer"
              >
                <StickyNote className="w-4 h-4" />
                <span>{isPublishingNote ? 'SAVING TO SUPABASE...' : 'POST NOTE TO SUPABASE'}</span>
              </button>
            </form>
          </div>

          {/* Stored Notes List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-xs font-black uppercase">
                All Supabase Notes & Broadcasts ({notes.length})
              </h4>
              <button
                onClick={() => handleExportCSV('notes')}
                className="px-3 py-1.5 bg-white hover:bg-black hover:text-white border-2 border-black font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> EXPORT NOTES CSV
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {notes.map((n, idx) => (
                <div key={n.id || idx} className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000000] flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black bg-black text-white px-2 py-0.5 uppercase">
                        {n.category}
                      </span>
                      <span className="font-mono text-xs font-black text-black">{n.title}</span>
                      <span className="text-[10px] font-mono text-[#52525B]">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : n.date}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#3F3F46] whitespace-pre-wrap mt-1">
                      {n.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteNoteItem(n.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 border border-black/20"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SQL SCHEMA */}
      {activeTab === 'sql' && (
        <div className="space-y-6 relative z-10 bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">Complete Supabase SQL Schema</h3>
              <p className="text-xs font-mono text-[#52525B]">
                Creates appointments, contacts, and daily notes tables with timestamp tracking.
              </p>
            </div>
            <button
              onClick={() => handleCopy(SUPABASE_SQL_SETUP_SCRIPT, 'sql')}
              className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
            >
              {copiedText === 'sql' ? <Check className="w-3.5 h-3.5 text-[#00FF00]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'sql' ? 'COPIED SQL!' : 'COPY COMPLETE SQL SCRIPT'}</span>
            </button>
          </div>

          <pre className="p-5 bg-black text-[#00FF00] border-2 border-black font-mono text-xs leading-relaxed overflow-x-auto select-all">
            {SUPABASE_SQL_SETUP_SCRIPT}
          </pre>

          <div className="p-4 bg-[#F4F4F5] border-2 border-black font-mono text-xs space-y-2">
            <h4 className="font-black uppercase text-black">How to Execute:</h4>
            <ol className="list-decimal list-inside space-y-1 text-[#3F3F46]">
              <li>Open your project: <a href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`} target="_blank" rel="noreferrer" className="underline font-bold text-black inline-flex items-center gap-0.5">Supabase SQL Editor <ExternalLink className="w-3 h-3" /></a></li>
              <li>Click <strong>New Query</strong>, paste the script, and click <strong>Run</strong></li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 relative z-10 bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="border-b-2 border-black pb-4">
            <h3 className="font-black text-lg uppercase tracking-tight">Active Supabase Connection</h3>
            <p className="text-xs font-mono text-[#52525B]">Project Credentials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-1">
              <span className="text-[#52525B] font-bold block">PROJECT ID:</span>
              <span className="font-black text-black text-sm">{SUPABASE_PROJECT_ID}</span>
            </div>

            <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-1">
              <span className="text-[#52525B] font-bold block">SUPABASE API URL:</span>
              <span className="font-black text-[#00AA00] text-sm break-all">{SUPABASE_URL}</span>
            </div>
          </div>

          {/* Admin Security & Password Settings */}
          <div className="border-t-2 border-black pt-6 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm uppercase text-black flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#00AA00]" />
                  <span>Admin Security & Password Vault</span>
                </h4>
                <p className="text-xs text-[#52525B]">
                  Manage login credentials and password recovery settings.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-black text-white text-[10px] font-black uppercase">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-2">
                <span className="text-[#52525B] font-bold block text-[11px]">ADMIN GMAIL:</span>
                <span className="font-black text-black text-sm block">{ADMIN_EMAIL}</span>
                <span className="text-[10px] text-[#71717A] block">
                  Registered address for recovery emails and booking notices.
                </span>
              </div>

              <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] font-bold text-[11px]">ADMIN MASTER PASSWORD:</span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-[#2563EB] hover:text-black uppercase flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-white border border-black">
                  <span className="font-mono text-sm font-black text-black">
                    {showPassword ? getStoredAdminPassword() : '•••••••••••••'}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getStoredAdminPassword());
                      setStatusMessage('Admin password copied to clipboard!');
                      setTimeout(() => setStatusMessage(null), 3000);
                    }}
                    className="px-2 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black text-[10px] font-black uppercase flex items-center gap-1 border border-black cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>COPY</span>
                  </button>
                </div>
                <div className="text-[10px] text-[#52525B] flex justify-between">
                  <span>Default: <code className="font-bold text-black">@nKiTp@TeL22</code></span>
                  {localStorage.getItem('ankit_custom_admin_pwd') ? (
                    <button
                      onClick={handleResetToDefaultPassword}
                      className="text-red-600 underline font-bold cursor-pointer hover:text-black"
                    >
                      Restore Default
                    </button>
                  ) : (
                    <span className="text-green-700 font-bold">Standard</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Change Password */}
            <div className="p-4 bg-[#F9F9F9] border-2 border-black">
              <h5 className="font-black text-xs uppercase text-black mb-2">Change Admin Password</h5>
              <form onSubmit={handleApplyNewPassword} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter new admin password..."
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-black uppercase cursor-pointer transition-colors shadow-[2px_2px_0px_#000000]"
                >
                  Update Password
                </button>
              </form>
              {passwordUpdateMessage && (
                <p className="text-[11px] font-bold text-green-700 mt-2">
                  ✓ {passwordUpdateMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
