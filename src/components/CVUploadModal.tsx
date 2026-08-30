import React, { useState, useRef } from 'react';
import {
  CustomCVFile,
  saveCVFile,
} from '../utils/portfolioStorage';
import {
  X,
  Upload,
  FileText,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvFile: CustomCVFile | null;
  onUpdateCV: (file: CustomCVFile | null) => void;
}

export const CVUploadModal: React.FC<CVUploadModalProps> = ({
  isOpen,
  onClose,
  cvFile,
  onUpdateCV,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setUploadError(null);

    // Limit to 12MB
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('File size exceeds 12MB. Please select a smaller document.');
      return;
    }

    const validTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      setUploadError('Please upload a valid PDF, DOCX, or Image document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newCv: CustomCVFile = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        dataUrl,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      saveCVFile(newCv);
      onUpdateCV(newCv);
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDeleteCV = () => {
    if (window.confirm('Remove uploaded CV file and revert to generated dossier?')) {
      saveCVFile(null);
      onUpdateCV(null);
    }
  };

  const handleDownloadCV = () => {
    if (!cvFile) return;
    const link = document.createElement('a');
    link.href = cvFile.dataUrl;
    link.download = cvFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-2xl flex flex-col shadow-[12px_12px_0px_#000000] animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#F9F9F9]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#52525B]">
              CV & DOCUMENT REPOSITORY
            </span>
            <h3 className="text-2xl font-black text-black uppercase">Upload & Manage Your CV</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Uploaded File Status */}
          {cvFile ? (
            <div className="p-5 bg-[#F9F9F9] border-2 border-black space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#00AA00]" />
                  <span className="font-mono text-xs font-black uppercase text-black">
                    ACTIVE UPLOADED CV ATTACHED
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#00FF00] border border-black uppercase text-black">
                  READY FOR DOWNLOAD
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <div className="font-black text-black text-sm break-all">{cvFile.name}</div>
                  <div className="text-[#52525B] mt-0.5">
                    Size: {formatFileSize(cvFile.size)} • Uploaded: {cvFile.uploadedAt}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewOpen(!previewOpen)}
                    className="px-3 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{previewOpen ? 'HIDE PREVIEW' : 'PREVIEW'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCV}
                    className="px-3 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000000]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD</span>
                  </button>
                  <button
                    onClick={handleDeleteCV}
                    className="p-2 text-red-600 hover:bg-red-50 border-2 border-red-600 cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inline Preview */}
              {previewOpen && (
                <div className="mt-4 pt-4 border-t-2 border-black">
                  <div className="text-[10px] font-mono font-bold text-[#52525B] mb-2 uppercase">
                    FILE PREVIEW
                  </div>
                  {cvFile.type.startsWith('image/') ? (
                    <img
                      src={cvFile.dataUrl}
                      alt="Uploaded CV"
                      className="max-h-[360px] w-auto mx-auto border-2 border-black object-contain"
                    />
                  ) : (
                    <iframe
                      src={cvFile.dataUrl}
                      title="CV PDF Preview"
                      className="w-full h-[380px] border-2 border-black bg-white"
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white border-2 border-black text-xs font-mono">
              <span className="font-bold text-black block mb-1">CURRENT STATUS:</span>
              <span className="text-[#52525B]">
                Using generated live ATS Dossier. You can upload your personalized PDF/Word resume below to let recruiters download your official original document.
              </span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,image/png,image/jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed border-black text-center cursor-pointer transition-all ${
                dragActive ? 'bg-[#00FF00]/20 border-solid' : 'bg-[#F9F9F9] hover:bg-white'
              }`}
            >
              <Upload className="w-10 h-10 text-black mx-auto mb-3" />
              <h4 className="font-black text-sm uppercase text-black mb-1">
                {cvFile ? 'DRAG & DROP TO REPLACE CV' : 'DRAG & DROP YOUR CV HERE'}
              </h4>
              <p className="text-xs font-mono text-[#52525B] mb-3">
                Supports PDF, DOCX, PNG, JPG (Up to 12MB)
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-bold uppercase transition-colors"
              >
                BROWSE FILES
              </button>
            </div>

            {uploadError && (
              <div className="mt-3 p-3 bg-red-100 border-2 border-red-600 text-red-700 text-xs font-mono font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-black bg-[#F9F9F9] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#52525B] font-bold">
            Changes auto-saved in browser
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black font-mono text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            CLOSE WINDOW
          </button>
        </div>
      </div>
    </div>
  );
};
