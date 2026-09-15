import React, { useState } from 'react';
import { Lock, Key, X, AlertTriangle, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../utils/adminAuth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  actionDescription?: string;
  onNavigateToAdmin?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Admin Authentication Required',
  actionDescription = 'Only the verified portfolio administrator can modify records, post notices, or update portfolio content.',
  onNavigateToAdmin,
}) => {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(password);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPassword('');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 500);
    } else {
      setError(res.error || 'Incorrect password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white border-4 border-black w-full max-w-md shadow-[10px_10px_0px_#000000] animate-fadeIn relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-black bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#00FF00]" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">{title}</h3>
              <p className="text-[10px] font-mono text-[#A1A1AA]">RESTRICTED ACCESS CONTROL</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 bg-white text-black hover:bg-[#00FF00] border border-black cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="p-3 bg-[#F9F9F9] border-2 border-black mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#00AA00] rounded-full" />
              <span className="text-[10px] font-mono font-black uppercase text-black">
                PROTECTED OPERATION
              </span>
            </div>
            <p className="text-xs font-mono text-[#52525B] leading-relaxed">
              {actionDescription}
            </p>
          </div>

          {isSuccess ? (
            <div className="p-4 bg-green-50 border-2 border-green-600 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div className="font-mono text-xs font-black text-green-800 uppercase">
                Admin Verified! Unlocking privileges...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-black text-black uppercase mb-1">
                  Enter Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter admin password..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/60 hover:text-black p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border-2 border-red-600 text-[11px] font-mono text-red-700 font-bold flex items-start gap-1.5 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase transition-all shadow-[3px_3px_0px_#000000] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Unlock Admin Access</span>
                </button>

                {onNavigateToAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToAdmin();
                    }}
                    className="w-full py-2 bg-[#F4F4F5] hover:bg-black hover:text-white border-2 border-black text-black font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Go to Admin & Telemetry Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
