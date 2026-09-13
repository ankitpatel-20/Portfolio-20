import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Clock,
  Settings,
  Shield,
  AlertTriangle,
  Sparkles,
  LogOut,
  RefreshCw,
  Plus,
  Radio,
  Minimize2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initMeetAuth,
  googleMeetSignIn,
  googleMeetSignOut,
  getMeetAccessToken,
  MEET_SCOPES,
} from '../lib/googleMeetAuth';
import {
  createGoogleMeetSpace,
  updateGoogleMeetSpaceConfig,
  endActiveGoogleMeetConference,
  GoogleMeetSpace,
} from '../lib/googleMeetApi';

interface GoogleMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMeetingLink?: (link: string) => void;
  initialTopic?: string;
}

export const GoogleMeetModal: React.FC<GoogleMeetModalProps> = ({
  isOpen,
  onClose,
  onSelectMeetingLink,
  initialTopic,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Meet Space state
  const [meetingTopic, setMeetingTopic] = useState(initialTopic || 'Interview & Project Review');
  const [meetingType, setMeetingType] = useState<'instant' | 'scheduled'>('instant');
  const [accessType, setAccessType] = useState<'OPEN' | 'TRUSTED' | 'RESTRICTED'>('OPEN');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');

  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createdSpaces, setCreatedSpaces] = useState<GoogleMeetSpace[]>(() => {
    try {
      const saved = sessionStorage.getItem('ankit_meet_spaces');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentActiveSpace, setCurrentActiveSpace] = useState<GoogleMeetSpace | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Confirmation modal state for settings changes or ending conference
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Listen for auth state
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initMeetAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setAccessToken(null);
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isOpen]);

  // Sync initial topic
  useEffect(() => {
    if (initialTopic) {
      setMeetingTopic(initialTopic);
    }
  }, [initialTopic]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Save created spaces to session storage
  const saveSpaces = (spaces: GoogleMeetSpace[]) => {
    setCreatedSpaces(spaces);
    try {
      sessionStorage.setItem('ankit_meet_spaces', JSON.stringify(spaces));
    } catch {}
  };

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await googleMeetSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err?.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await googleMeetSignOut();
    setCurrentUser(null);
    setAccessToken(null);
  };

  const handleCreateSpace = async () => {
    if (!accessToken) {
      setAuthError('Please sign in with Google to create a Google Meet space.');
      return;
    }

    setIsCreating(true);
    setActionError(null);

    try {
      const title =
        meetingType === 'instant'
          ? `Instant Meet: ${meetingTopic}`
          : `Scheduled Meet (${scheduledDate} ${scheduledTime}): ${meetingTopic}`;

      const newSpace = await createGoogleMeetSpace(accessToken, {
        title,
        accessType,
      });

      const updated = [newSpace, ...createdSpaces];
      saveSpaces(updated);
      setCurrentActiveSpace(newSpace);

      if (onSelectMeetingLink && newSpace.meetingUri) {
        onSelectMeetingLink(newSpace.meetingUri);
      }
    } catch (err: any) {
      console.error('Create space failed:', err);
      setActionError(err?.message || 'Failed to create Google Meet space.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmAccessChange = (space: GoogleMeetSpace, newType: 'OPEN' | 'TRUSTED' | 'RESTRICTED') => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Google Meet Space Access?',
      description: `Change meeting access for "${space.title || space.meetingCode}" to ${newType}? Anyone joining will follow this new permission level.`,
      onConfirm: async () => {
        if (!accessToken) return;
        try {
          const updated = await updateGoogleMeetSpaceConfig(accessToken, space.name, newType, true);
          const nextList = createdSpaces.map((s) => (s.name === space.name ? { ...s, ...updated } : s));
          saveSpaces(nextList);
          if (currentActiveSpace?.name === space.name) {
            setCurrentActiveSpace({ ...currentActiveSpace, ...updated });
          }
        } catch (err: any) {
          setActionError(err.message || 'Failed to update meeting settings.');
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleConfirmEndConference = (space: GoogleMeetSpace) => {
    setConfirmDialog({
      isOpen: true,
      title: 'End Active Google Meet Conference?',
      description: `Are you sure you want to end all active calls in space "${space.meetingCode}"? This will disconnect current participants.`,
      onConfirm: async () => {
        if (!accessToken) return;
        try {
          await endActiveGoogleMeetConference(accessToken, space.name, true);
          setActionError(null);
        } catch (err: any) {
          setActionError(err.message || 'Failed to end conference.');
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  return (
    <div
      id="google-meet-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn cursor-pointer"
      title="Click anywhere outside to minimise"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white border-4 border-black my-auto flex flex-col shadow-[8px_8px_0px_#000000] rounded-xl overflow-hidden cursor-default"
      >
        {/* Top Header */}
        <div className="w-full bg-[#0B1E36] p-4 flex items-center justify-between border-b-3 border-black text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00FF00] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-sm sm:text-base font-black uppercase tracking-wider text-white">
                  GOOGLE MEET SPACE MANAGER
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#00FF00] text-black font-black uppercase rounded">
                  v2 API LIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                Schedule, create, and join real Google Meet conference rooms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white text-black hover:bg-[#00FF00] border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer rounded"
              title="Minimise Google Meet"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Minimise</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-white text-black hover:bg-[#EA4335] hover:text-white border-2 border-black font-black transition-colors cursor-pointer rounded shadow-[2px_2px_0px_#000000]"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User Auth Banner */}
          {!currentUser || !accessToken ? (
            <div className="p-5 sm:p-6 bg-[#F8FAFC] border-2 border-black rounded-lg space-y-4 shadow-[4px_4px_0px_#E2E8F0]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#0B1E36]" />
                    <h3 className="font-mono text-xs sm:text-sm font-black uppercase text-black">
                      Google Workspace Authentication Required
                    </h3>
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed max-w-xl">
                    Sign in with your Google account to create, manage, and join real Google Meet conference spaces directly within this portfolio.
                  </p>
                </div>

                {/* Official Sign in with Google Button (GSI Material Button) */}
                <button
                  id="google-meet-signin-btn"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="gsi-material-button relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-white hover:bg-gray-50 border-2 border-black text-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    </div>
                    <span className="font-mono text-xs font-black uppercase text-black tracking-wide">
                      {isSigningIn ? 'Connecting...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Scopes Overview */}
              <div className="pt-3 border-t border-black/10 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#64748B]">
                <span className="font-bold text-black uppercase">PERMISSIONS:</span>
                <span className="px-2 py-0.5 bg-white border border-black/30 rounded">meetings.space.created</span>
                <span className="px-2 py-0.5 bg-white border border-black/30 rounded">meetings.space.readonly</span>
                <span className="px-2 py-0.5 bg-white border border-black/30 rounded">meetings.space.settings</span>
              </div>

              {authError && (
                <div className="p-3 bg-[#FEF2F2] border border-[#DC2626] rounded text-[#DC2626] text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#F0FDF4] border-2 border-[#16A34A] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#16A34A]">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-black"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-black">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  </div>
                  <p className="text-[11px] font-mono text-[#15803D]">
                    Authorized Google Meet Client // Ready to generate conference rooms
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3 py-1 bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626] font-mono text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}

          {/* Meeting Creation Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs sm:text-sm font-black text-black uppercase tracking-wider flex items-center gap-2">
                <span>// CREATE NEW GOOGLE MEET SPACE</span>
              </h3>
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 border border-black rounded">
                <button
                  type="button"
                  onClick={() => setMeetingType('instant')}
                  className={`px-3 py-1 font-mono text-xs font-black uppercase rounded transition-colors ${
                    meetingType === 'instant'
                      ? 'bg-[#00FF00] text-black border border-black shadow-[1px_1px_0px_#000000]'
                      : 'text-[#64748B] hover:text-black'
                  }`}
                >
                  ⚡ Instant Meet
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingType('scheduled')}
                  className={`px-3 py-1 font-mono text-xs font-black uppercase rounded transition-colors ${
                    meetingType === 'scheduled'
                      ? 'bg-[#00FF00] text-black border border-black shadow-[1px_1px_0px_#000000]'
                      : 'text-[#64748B] hover:text-black'
                  }`}
                >
                  📅 Schedule
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Meeting Topic */}
              <div>
                <label className="block font-mono text-xs font-bold text-black uppercase mb-1">
                  Meeting Purpose / Topic
                </label>
                <input
                  type="text"
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  placeholder="e.g. Technical Interview, ML Project Review"
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs text-black focus:outline-none focus:bg-[#FEF9C3] shadow-[2px_2px_0px_#000000]"
                />
              </div>

              {/* Access Level */}
              <div>
                <label className="block font-mono text-xs font-bold text-black uppercase mb-1 flex items-center justify-between">
                  <span>Space Access Level</span>
                  <span className="text-[10px] text-[#64748B]">via Google Meet Config</span>
                </label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs text-black focus:outline-none focus:bg-[#FEF9C3] shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  <option value="OPEN">OPEN (Anyone with link can join)</option>
                  <option value="TRUSTED">TRUSTED (Domain / signed-in Google accounts)</option>
                  <option value="RESTRICTED">RESTRICTED (Host must admit guests)</option>
                </select>
              </div>

              {/* Scheduled Date/Time if schedule mode */}
              {meetingType === 'scheduled' && (
                <>
                  <div>
                    <label className="block font-mono text-xs font-bold text-black uppercase mb-1">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs text-black focus:outline-none focus:bg-[#FEF9C3] shadow-[2px_2px_0px_#000000]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold text-black uppercase mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder="e.g. 11:00 AM"
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs text-black focus:outline-none focus:bg-[#FEF9C3] shadow-[2px_2px_0px_#000000]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Launch Button */}
            <button
              type="button"
              onClick={handleCreateSpace}
              disabled={isCreating || !accessToken}
              className="w-full py-3.5 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black font-mono text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00FF00]" />
                  <span>CONNECTING TO GOOGLE MEET API...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-[#00FF00]" />
                  <span>
                    {meetingType === 'instant'
                      ? 'GENERATE INSTANT GOOGLE MEET ROOM'
                      : 'SCHEDULE GOOGLE MEET CONFERENCE'}
                  </span>
                </>
              )}
            </button>

            {actionError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#DC2626] rounded text-[#DC2626] text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}
          </div>

          {/* Current Active Space Result Banner */}
          {currentActiveSpace && (
            <div className="p-5 bg-[#ECFDF5] border-3 border-[#059669] rounded-xl shadow-[4px_4px_0px_#059669] space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <span className="font-mono text-xs font-black uppercase text-[#065F46] tracking-wider">
                    NEW GOOGLE MEET SPACE CREATED
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-white border border-[#059669] rounded font-mono text-[10px] font-black text-[#065F46]">
                  CODE: {currentActiveSpace.meetingCode || currentActiveSpace.name.replace('spaces/', '')}
                </span>
              </div>

              <div className="p-3 bg-white border-2 border-black rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full overflow-hidden">
                  <span className="text-[9px] font-mono text-[#64748B] uppercase block">
                    Shareable Google Meet URL
                  </span>
                  <a
                    href={currentActiveSpace.meetingUri}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm sm:text-base font-black text-[#2563EB] hover:underline truncate block"
                  >
                    {currentActiveSpace.meetingUri}
                  </a>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleCopy(currentActiveSpace.meetingUri)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-white text-black hover:bg-[#00FF00] border-2 border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href={currentActiveSpace.meetingUri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#059669] text-white hover:bg-black border-2 border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-colors shadow-[2px_2px_0px_#000000]"
                  >
                    <span>JOIN NOW</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {onSelectMeetingLink && (
                <button
                  type="button"
                  onClick={() => onSelectMeetingLink(currentActiveSpace.meetingUri)}
                  className="w-full py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black font-mono text-xs font-bold uppercase tracking-wider rounded border border-black transition-colors"
                >
                  Attach this Meet Link to Appointment Booking Form
                </button>
              )}
            </div>
          )}

          {/* Quick Join / Lookup by Code */}
          <div className="p-4 bg-[#F8FAFC] border-2 border-black rounded-lg space-y-3">
            <h4 className="font-mono text-xs font-black text-black uppercase flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>// JOIN ANY GOOGLE MEET BY CODE</span>
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="google-meet-code-input"
                type="text"
                placeholder="Enter meeting code (e.g. abc-defg-hij)"
                className="flex-1 px-3 py-2 bg-white border-2 border-black font-mono text-xs text-black uppercase tracking-wider focus:outline-none focus:bg-[#FEF9C3]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = (e.target as HTMLInputElement).value.trim();
                    if (input) {
                      const code = input.replace('https://meet.google.com/', '').replace('/', '');
                      window.open(`https://meet.google.com/${code}`, '_blank');
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = (document.getElementById('google-meet-code-input') as HTMLInputElement)?.value.trim();
                  if (input) {
                    const code = input.replace('https://meet.google.com/', '').replace('/', '');
                    window.open(`https://meet.google.com/${code}`, '_blank');
                  }
                }}
                className="px-5 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer shrink-0"
              >
                Launch Meet
              </button>
            </div>
          </div>

          {/* Previous Created Spaces List */}
          {createdSpaces.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="font-mono text-xs font-black text-black uppercase">
                  ACTIVE GOOGLE MEET SPACES ({createdSpaces.length})
                </span>
                <button
                  type="button"
                  onClick={() => saveSpaces([])}
                  className="font-mono text-[10px] text-[#DC2626] hover:underline uppercase font-bold"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-2">
                {createdSpaces.map((space, idx) => (
                  <div
                    key={space.name || idx}
                    className="p-3 bg-white border-2 border-black rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#000000]"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-[#00FF00] text-black font-mono text-[10px] font-black uppercase rounded border border-black">
                          {space.meetingCode || space.name.replace('spaces/', '')}
                        </span>
                        <span className="font-mono text-xs font-bold text-black truncate">
                          {space.title || 'Portfolio Discussion'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#2563EB] truncate block">
                        {space.meetingUri}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => handleCopy(space.meetingUri)}
                        className="p-2 bg-white hover:bg-[#F1F5F9] border border-black rounded cursor-pointer"
                        title="Copy Meet link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Change settings with user confirmation */}
                      <button
                        onClick={() =>
                          handleConfirmAccessChange(
                            space,
                            space.config?.accessType === 'RESTRICTED' ? 'OPEN' : 'RESTRICTED'
                          )
                        }
                        className="px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-black hover:text-white border border-black font-mono text-[10px] font-bold uppercase rounded transition-colors"
                        title="Toggle Access Permission"
                      >
                        {space.config?.accessType || 'OPEN'}
                      </button>

                      <a
                        href={space.meetingUri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border border-black font-mono text-xs font-black uppercase rounded flex items-center gap-1 transition-colors"
                      >
                        <span>Join</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog for Destructive or Permission Modifying Operations */}
        {confirmDialog && confirmDialog.isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white border-4 border-black p-6 rounded-xl max-w-md w-full shadow-[6px_6px_0px_#000000] space-y-4 animate-scaleUp">
              <div className="flex items-center gap-3 text-[#DC2626]">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h4 className="font-mono text-sm font-black uppercase text-black">
                  {confirmDialog.title}
                </h4>
              </div>
              <p className="text-xs font-mono text-[#52525B] leading-relaxed">
                {confirmDialog.description}
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 bg-white text-black hover:bg-gray-100 border-2 border-black font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmDialog.onConfirm()}
                  className="px-4 py-2 bg-[#DC2626] text-white hover:bg-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
