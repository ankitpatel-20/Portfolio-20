import React, { useState, useEffect } from 'react';
import { CertificationItem } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Award,
  RotateCcw,
  Save,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { DEFAULT_CERTIFICATIONS, saveCertifications } from '../utils/portfolioStorage';

interface CertificationEditorModalProps {
  certifications: CertificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (certs: CertificationItem[]) => void;
}

export const CertificationEditorModal: React.FC<CertificationEditorModalProps> = ({
  certifications: initialCerts,
  isOpen,
  onClose,
  onSave,
}) => {
  const [certsList, setCertsList] = useState<CertificationItem[]>(initialCerts);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize with parent state when modal opens or initialCerts update
  useEffect(() => {
    setCertsList(initialCerts);
    setDeletingIdx(null);
    setIsResetConfirming(false);
  }, [initialCerts, isOpen]);

  // Form State
  const [formName, setFormName] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCredentialId, setFormCredentialId] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formVerified, setFormVerified] = useState(true);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startAddNew = () => {
    setEditingIdx(null);
    setDeletingIdx(null);
    setIsAddingNew(true);
    setFormName('');
    setFormIssuer('');
    setFormDate(new Date().getFullYear().toString());
    setFormCredentialId('');
    setFormSkills('');
    setFormVerified(true);
  };

  const startEdit = (idx: number) => {
    const cert = certsList[idx];
    setEditingIdx(idx);
    setDeletingIdx(null);
    setIsAddingNew(false);
    setFormName(cert.name);
    setFormIssuer(cert.issuer);
    setFormDate(cert.date);
    setFormCredentialId(cert.credentialId);
    setFormSkills(cert.skills.join(', '));
    setFormVerified(cert.verified);
  };

  const handleCancelForm = () => {
    setEditingIdx(null);
    setIsAddingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formIssuer.trim()) {
      showToast('Please enter both certification name and issuer');
      return;
    }

    const skillsArray = formSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedCert: CertificationItem = {
      name: formName.trim(),
      issuer: formIssuer.trim(),
      date: formDate.trim() || new Date().getFullYear().toString(),
      credentialId: formCredentialId.trim() || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      skills: skillsArray.length > 0 ? skillsArray : ['Data Science', 'Machine Learning'],
      verified: formVerified,
    };

    let nextCerts = [...certsList];
    if (isAddingNew) {
      nextCerts = [...nextCerts, updatedCert];
      showToast('New certification added successfully!');
    } else if (editingIdx !== null) {
      nextCerts[editingIdx] = updatedCert;
      showToast('Certification updated!');
    }

    setCertsList(nextCerts);
    onSave(nextCerts);
    saveCertifications(nextCerts);
    setIsAddingNew(false);
    setEditingIdx(null);
  };

  const executeDelete = (idx: number) => {
    const certToDelete = certsList[idx];
    const certName = certToDelete?.name || 'Certification';
    const nextCerts = certsList.filter((_, i) => i !== idx);

    setCertsList(nextCerts);
    onSave(nextCerts);
    saveCertifications(nextCerts);
    setDeletingIdx(null);

    if (editingIdx === idx) {
      handleCancelForm();
    }
    showToast(`Removed "${certName}"`);
  };

  const executeResetDefaults = () => {
    setCertsList(DEFAULT_CERTIFICATIONS);
    onSave(DEFAULT_CERTIFICATIONS);
    saveCertifications(DEFAULT_CERTIFICATIONS);
    setIsResetConfirming(false);
    handleCancelForm();
    showToast('Reset to default certifications');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-3xl shadow-[8px_8px_0px_#000000] my-8 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-black text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#00FF00]" />
            <div>
              <h3 className="font-black text-base sm:text-lg uppercase tracking-tight">
                Manage Verified Certifications (Admin)
              </h3>
              <p className="text-[11px] font-mono text-[#A1A1AA]">
                Add, edit, or remove professional industry credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white text-black hover:bg-[#00FF00] border border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="bg-[#00FF00] border-b-2 border-black px-4 py-2 text-xs font-mono font-black text-black flex items-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/20">
            <div className="text-xs font-mono font-bold text-[#52525B]">
              ACTIVE CREDENTIALS: <span className="text-black font-black">{certsList.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {isResetConfirming ? (
                <div className="flex items-center gap-1.5 bg-red-50 border-2 border-red-600 p-1 animate-fadeIn">
                  <span className="text-[10px] font-mono font-black text-red-700 uppercase px-1">
                    Reset to defaults?
                  </span>
                  <button
                    type="button"
                    onClick={executeResetDefaults}
                    className="px-2 py-1 bg-red-600 hover:bg-black text-white font-mono text-[10px] font-black uppercase transition-colors cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResetConfirming(false)}
                    className="px-2 py-1 bg-white hover:bg-gray-200 border border-black font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsResetConfirming(true)}
                  className="px-3 py-1.5 bg-[#F4F4F5] hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to default certifications"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET DEFAULTS</span>
                </button>
              )}

              {!isAddingNew && editingIdx === null && (
                <button
                  type="button"
                  onClick={startAddNew}
                  className="px-3.5 py-1.5 bg-[#00FF00] hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD CERTIFICATION</span>
                </button>
              )}
            </div>
          </div>

          {/* Form when adding or editing */}
          {(isAddingNew || editingIdx !== null) && (
            <form
              onSubmit={handleSaveForm}
              className="bg-[#F9F9F9] border-2 border-black p-5 space-y-4 shadow-[4px_4px_0px_#000000] animate-fadeIn"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="font-mono text-xs font-black uppercase text-black">
                  {isAddingNew ? '+ Add New Certification' : `✏ Edit: ${formName || 'Credential'}`}
                </span>
                <span className="text-[10px] font-mono text-[#52525B]">
                  * Required fields
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1 text-black">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Google Data Analytics Professional Certificate"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1 text-black">
                    Issuing Organization / Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={formIssuer}
                    onChange={(e) => setFormIssuer(e.target.value)}
                    placeholder="e.g. Google / Coursera / IBM / Microsoft"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1 text-black">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. 2025 or Aug 2025"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1 text-black">
                    Credential ID / License
                  </label>
                  <input
                    type="text"
                    value={formCredentialId}
                    onChange={(e) => setFormCredentialId(e.target.value)}
                    placeholder="e.g. GOOG-DA-98234 or verify URL"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#FFFFFF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold uppercase mb-1 text-black">
                    Skills Covered (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    placeholder="e.g. SQL, Tableau, R Programming, Data Cleaning, Python"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#FFFFFF]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="verified-checkbox"
                    checked={formVerified}
                    onChange={(e) => setFormVerified(e.target.checked)}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                  <label
                    htmlFor="verified-checkbox"
                    className="text-xs font-mono font-bold text-black cursor-pointer"
                  >
                    Mark as Verified Credential (displays green verified badge)
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-black/20">
                {editingIdx !== null && (
                  <button
                    type="button"
                    onClick={() => setDeletingIdx(editingIdx)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-600 hover:text-white border-2 border-red-600 text-red-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete this Credential</span>
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-4 py-2 border-2 border-black text-xs font-mono font-bold hover:bg-[#E4E4E7] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-black flex items-center gap-1.5 transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isAddingNew ? 'Add Credential' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Current Certifications List */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#52525B] block">
              Active Credentials ({certsList.length})
            </span>

            {certsList.map((cert, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black text-black bg-[#F4F4F5] px-1.5 py-0.5 border border-black/40">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#52525B] uppercase">
                      {cert.issuer} • {cert.date}
                    </span>
                    {cert.verified && (
                      <span className="text-[9px] font-mono font-bold bg-[#00FF00] text-black px-1.5 py-0.2 border border-black flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-black" />
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-sm text-black uppercase tracking-tight">
                    {cert.name}
                  </h4>
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[9px] font-mono font-medium px-1.5 py-0.5 bg-[#F4F4F5] border border-black/20 text-[#52525B]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inline Confirmation or Edit/Delete Buttons */}
                {deletingIdx === idx ? (
                  <div className="flex items-center gap-2 bg-red-50 border-2 border-red-600 p-2 shrink-0 self-end sm:self-center animate-fadeIn shadow-[2px_2px_0px_#DC2626]">
                    <div className="flex items-center gap-1 text-red-700 font-mono text-[10px] font-black uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Delete?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => executeDelete(idx)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-black text-white font-mono text-[10px] font-black uppercase transition-colors cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingIdx(null)}
                      className="px-2 py-1 bg-white hover:bg-gray-200 border border-black text-black font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEdit(idx)}
                      className="p-2 bg-white hover:bg-black hover:text-white border-2 border-black text-black transition-colors cursor-pointer shadow-[1px_1px_0px_#000000]"
                      title="Edit certification"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingIdx(idx)}
                      className="p-2 bg-white hover:bg-red-600 hover:text-white border-2 border-black text-red-600 transition-colors cursor-pointer shadow-[1px_1px_0px_#000000]"
                      title="Delete certification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {certsList.length === 0 && (
              <div className="p-8 text-center bg-[#F9F9F9] border-2 border-dashed border-black/30 font-mono text-xs text-[#52525B]">
                No certifications in list. Click &quot;ADD CERTIFICATION&quot; to add your credentials.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
