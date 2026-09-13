import React, { useState } from 'react';
import {
  EditableResumeData,
  DEFAULT_RESUME_DATA,
  saveResumeData,
} from '../utils/portfolioStorage';
import { X, Save, RotateCcw, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ResumeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: EditableResumeData;
  onSave: (newData: EditableResumeData) => void;
}

export const ResumeEditorModal: React.FC<ResumeEditorModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSave,
}) => {
  const [formData, setFormData] = useState<EditableResumeData>(JSON.parse(JSON.stringify(currentData)));

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof EditableResumeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (idx: number, field: 'category' | 'skills', val: string) => {
    const updated = [...formData.skillsList];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, skillsList: updated }));
  };

  const handleAddSkillCategory = () => {
    setFormData((prev) => ({
      ...prev,
      skillsList: [...prev.skillsList, { category: 'New Category', skills: 'Tools, frameworks' }],
    }));
  };

  const handleRemoveSkillCategory = (idx: number) => {
    const updated = formData.skillsList.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, skillsList: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveResumeData(formData);
    onSave(formData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all resume fields to default values?')) {
      setFormData(DEFAULT_RESUME_DATA);
      saveResumeData(DEFAULT_RESUME_DATA);
      onSave(DEFAULT_RESUME_DATA);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[12px_12px_0px_#000000] animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#F9F9F9]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#52525B]">
              LIVE DOSSIER CUSTOMIZER
            </span>
            <h3 className="text-2xl font-black text-black uppercase">Edit Resume & Candidate Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Personal & Header Information */}
          <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-4">
            <h4 className="font-mono text-xs font-black text-black uppercase border-b border-black pb-2">
              01 // HEADER & CONTACT IDENTITY
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-black mb-1">FULL NAME:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">GRADUATION BADGE / YEAR:</label>
                <input
                  type="text"
                  value={formData.badge}
                  placeholder="e.g. BCA '27"
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">CURRENT ROLE / ASPIRATION:</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">LOCATION & MOBILITY:</label>
                <input
                  type="text"
                  value={formData.location}
                  placeholder="e.g. Noida, India / Remote"
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">CONTACT EMAIL:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">PHONE NUMBER:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-4">
            <h4 className="font-mono text-xs font-black text-black uppercase border-b border-black pb-2">
              02 // ACADEMIC DETAILS & CGPA
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-black mb-1">CGPA / GRADE:</label>
                <input
                  type="text"
                  value={formData.cgpa}
                  onChange={(e) => handleFieldChange('cgpa', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">DEGREE DURATION:</label>
                <input
                  type="text"
                  value={formData.period}
                  placeholder="e.g. 2024 - 2027"
                  onChange={(e) => handleFieldChange('period', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-black mb-1">INSTITUTION / DEPARTMENT:</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => handleFieldChange('institution', e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black font-bold focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-3">
            <h4 className="font-mono text-xs font-black text-black uppercase border-b border-black pb-2">
              03 // EXECUTIVE BIO & OBJECTIVE
            </h4>
            <div>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-medium focus:outline-none leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Technical Skills Categories */}
          <div className="p-4 bg-[#F9F9F9] border-2 border-black space-y-4">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <h4 className="font-mono text-xs font-black text-black uppercase">
                04 // TECHNICAL SKILLS MATRIX
              </h4>
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="text-xs font-mono font-bold bg-black text-white px-2.5 py-1 border border-black hover:bg-[#00FF00] hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD ROW</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.skillsList.map((skill, idx) => (
                <div key={idx} className="p-3 bg-white border-2 border-black space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => handleSkillChange(idx, 'category', e.target.value)}
                      placeholder="Category Name"
                      className="font-bold text-black border-b border-black focus:outline-none px-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillCategory(idx)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={skill.skills}
                    onChange={(e) => handleSkillChange(idx, 'skills', e.target.value)}
                    placeholder="List skills..."
                    className="w-full px-2 py-1 bg-[#F9F9F9] border border-black focus:outline-none text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t-2 border-black">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DEFAULTS</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border-2 border-black font-mono text-xs font-bold uppercase cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE RESUME CHANGES</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
