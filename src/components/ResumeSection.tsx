import React, { useState, useEffect } from 'react';
import {
  CERTIFICATIONS,
  PROJECTS,
} from '../data/portfolioData';
import {
  EditableResumeData,
  CustomCVFile,
  loadSavedResume,
  loadSavedCVFile,
  saveResumeData,
} from '../utils/portfolioStorage';
import { ResumeEditorModal } from './ResumeEditorModal';
import { CVUploadModal } from './CVUploadModal';
import {
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Upload,
  Edit3,
  FileCheck,
  Eye,
  ExternalLink,
} from 'lucide-react';

export const ResumeSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [jobKeyword, setJobKeyword] = useState('');
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [resumeData, setResumeData] = useState<EditableResumeData>(loadSavedResume());
  const [cvFile, setCvFile] = useState<CustomCVFile | null>(loadSavedCVFile());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    setResumeData(loadSavedResume());
    setCvFile(loadSavedCVFile());
  }, []);

  const handleCopyText = () => {
    const resumeText = `
${resumeData.name.toUpperCase()}
${resumeData.role}
Email: ${resumeData.email} | Location: ${resumeData.location} | Phone: ${resumeData.phone}

OBJECTIVE / SUMMARY:
${resumeData.summary}

EDUCATION:
${resumeData.institution}
${resumeData.period} • CGPA: ${resumeData.cgpa} • Badge: ${resumeData.badge}

TECHNICAL SKILLS:
${resumeData.skillsList.map((s) => `- ${s.category}: ${s.skills}`).join('\n')}

KEY PROJECTS:
1. Customer Churn Predictor & Retention Dashboard (XGBoost, SHAP, Python)
   - Built end-to-end ML pipeline on 75K+ subscribers achieving 94.2% ROC-AUC.
   - Identified leading behavioral factors using SHAP TreeExplainer.
   
2. E-Commerce Revenue & Supply Chain Power BI Suite (Power BI, DAX, SQL)
   - Architected Star Schema data model across 120,000+ orders with 45+ custom DAX measures.
   - Reduced query latency by 65% with optimized data modeling.

3. Financial Transaction Analytics Data Mart (PostgreSQL, Advanced SQL)
   - Analyzed 2.5M+ transactions with recursive CTEs and partitioned tables.
   - Reduced query execution latency by 4.8x.

CERTIFICATIONS:
- Google Data Analytics Professional Certificate
- IBM Data Science Specialization
- DeepLearning.AI Machine Learning Specialization
- Microsoft Power BI Data Analyst Associate (PL-300 Coursework)
`.trim();

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCV = () => {
    if (cvFile) {
      const link = document.createElement('a');
      link.href = cvFile.dataUrl;
      link.download = cvFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const checkAtsMatch = (text: string) => {
    setJobKeyword(text);
    if (!text.trim()) {
      setMatchedKeywords([]);
      return;
    }
    const allSkills = [
      'python',
      'sql',
      'power bi',
      'dax',
      'machine learning',
      'pandas',
      'numpy',
      'scikit-learn',
      'xgboost',
      'pytorch',
      'postgresql',
      'data analysis',
      'statistics',
      'etl',
      'tableau',
      'git',
      'docker',
      'shap',
      'regression',
      'classification',
      'nlp',
      'smote',
      'deep learning',
    ];
    const inputWords = text.toLowerCase().split(/[\s,]+/);
    const found = allSkills.filter((skill) =>
      inputWords.some((w) => w && (skill.includes(w) || w.includes(skill)))
    );
    setMatchedKeywords(Array.from(new Set(found)));
  };

  return (
    <section id="resume-screen" className="py-16 px-6 sm:px-12 max-w-[1024px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        05
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10 border-b-2 border-black pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
              VOLUME 01 // 04. DOSSIER
            </span>
            <span className="text-xs font-mono font-bold text-[#52525B]">CURRICULUM VITAE & REPO</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
            Candidate Resume
          </h2>
        </div>

        {/* Resume Primary Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="px-3.5 py-2.5 bg-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-black text-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{cvFile ? 'MANAGE CV FILE' : 'UPLOAD CV'}</span>
          </button>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3.5 py-2.5 bg-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-black text-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT DOSSIER DATA</span>
          </button>
          <button
            onClick={handleDownloadCV}
            className="px-4 py-2.5 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black text-xs font-mono font-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{cvFile ? 'DOWNLOAD ATTACHED CV' : 'EXPORT / PRINT PDF'}</span>
          </button>
        </div>
      </div>

      {/* Uploaded CV Status Banner */}
      {cvFile && (
        <div className="bg-white border-2 border-black p-4 mb-6 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-3 relative z-10 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00FF00] border border-black">
              <FileCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-xs font-mono font-black uppercase text-black">
                CUSTOM CV FILE ATTACHED: <span className="underline">{cvFile.name}</span>
              </div>
              <div className="text-[11px] font-mono text-[#52525B]">
                Recruiters can download your exact uploaded document or review the interactive ATS sheet below.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="px-3 py-1.5 bg-[#F9F9F9] hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-bold cursor-pointer"
            >
              CHANGE / PREVIEW
            </button>
            <button
              onClick={handleDownloadCV}
              className="px-3 py-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-black flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>GET FILE</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive ATS Keyword Matcher Widget */}
      <div className="bg-[#F9F9F9] border-2 border-black p-5 mb-8 shadow-[4px_4px_0px_#000000] relative z-10">
        <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-black">
            <Sparkles className="w-4 h-4 text-black" />
            <span>RECRUITER ATS SKILL MATCH TESTER</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#00FF00] border border-black text-black">
            LIVE PARSER
          </span>
        </div>
        <p className="text-xs text-[#52525B] mb-3 font-medium">
          Paste required skills or job keywords (e.g. &quot;Python, SQL, Power BI, XGBoost, ETL, SHAP&quot;) to verify candidate alignment:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type required role stacks..."
            value={jobKeyword}
            onChange={(e) => checkAtsMatch(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>
        {matchedKeywords.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-black font-black">MATCHED ({matchedKeywords.length}):</span>
            {matchedKeywords.map((k, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#00FF00] text-black font-bold border border-black"
              >
                ✓ {k}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Resume Document Sheet */}
      <div
        id="resume-printable-sheet"
        className="bg-white border-2 border-black p-8 sm:p-12 shadow-[8px_8px_0px_#000000] space-y-8 text-black relative z-10"
      >
        {/* Resume Header */}
        <div className="border-b-2 border-black pb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
              {resumeData.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black px-2.5 py-1 bg-[#00FF00] text-black border border-black">
                {resumeData.badge}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-black text-white border border-black">
                {resumeData.cgpa}
              </span>
            </div>
          </div>
          <p className="text-sm font-mono text-black mt-1 font-bold">
            {resumeData.role}
          </p>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-mono text-[#52525B] mt-3 font-bold">
            <span>{resumeData.email}</span>
            <span>/</span>
            <span>{resumeData.location}</span>
            {resumeData.phone && (
              <>
                <span>/</span>
                <span>{resumeData.phone}</span>
              </>
            )}
            <span>/</span>
            <span className="text-black">github.com/ankitpatel-20</span>
            <span>/</span>
            <span className="text-black">linkedin.com/in/ankitpatel</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <div className="flex items-center justify-between mb-2 border-b border-black pb-1">
            <h3 className="text-xs font-mono font-black text-black uppercase tracking-widest">
              // EXECUTIVE SUMMARY
            </h3>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="text-[10px] font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-black leading-relaxed font-medium">
            {resumeData.summary}
          </p>
        </div>

        {/* Technical Skills Matrix */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-black pb-1">
            <h3 className="text-xs font-mono font-black text-black uppercase tracking-widest">
              // TECHNICAL SKILLS MATRIX
            </h3>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="text-[10px] font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {resumeData.skillsList.map((skill, idx) => (
              <div key={idx} className="p-3 bg-[#F9F9F9] border-2 border-black">
                <span className="text-black font-black uppercase block mb-1">
                  {skill.category}:
                </span>
                <p className="text-[#52525B] font-medium leading-relaxed">
                  {skill.skills}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div>
          <h3 className="text-xs font-mono font-black text-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            // KEY APPLIED DATA SCIENCE PROJECTS
          </h3>
          <div className="space-y-4">
            {PROJECTS.slice(0, 3).map((p, idx) => (
              <div key={idx} className="border-l-4 border-black pl-4 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-black text-sm text-black uppercase">{p.title}</h4>
                  <span className="text-[11px] font-mono font-bold bg-[#00FF00] text-black px-2 py-0.2 border border-black">
                    {p.category}
                  </span>
                </div>
                <p className="text-xs text-[#52525B] font-medium">{p.subtitle}</p>
                <ul className="list-disc list-inside text-xs text-black space-y-0.5 pt-1 font-medium">
                  {p.highlights.slice(0, 2).map((hl, hIdx) => (
                    <li key={hIdx}>{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-black pb-1">
            <h3 className="text-xs font-mono font-black text-black uppercase tracking-widest">
              // EDUCATION & ACADEMIC MERIT
            </h3>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="text-[10px] font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between text-sm">
              <span className="font-black text-black uppercase">
                Bachelor of Computer Applications ({resumeData.badge})
              </span>
              <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5">
                {resumeData.cgpa}
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-[#52525B]">
              {resumeData.institution} | {resumeData.period}
            </p>
            <p className="text-xs text-black pt-1 font-medium">
              Coursework: Data Structures & Algorithms, DBMS & SQL, Discrete Mathematics, Probability & Statistics, Machine Learning, Applied Artificial Intelligence.
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-xs font-mono font-black text-black uppercase tracking-widest mb-3 border-b border-black pb-1">
            // PROFESSIONAL CERTIFICATIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {CERTIFICATIONS.map((c, idx) => (
              <div key={idx} className="p-3 bg-[#F9F9F9] border-2 border-black">
                <span className="font-black text-black block">{c.name}</span>
                <p className="text-[11px] font-mono text-[#52525B] mt-0.5 font-bold">
                  {c.issuer} ({c.date})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions on Sheet */}
        <div className="pt-6 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleCopyText}
            className="px-4 py-2 bg-white hover:bg-[#F9F9F9] border-2 border-black text-xs font-mono font-bold text-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00AA00]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED PLAIN TEXT' : 'COPY PLAIN TEXT'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 bg-[#F9F9F9] hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            >
              EDIT RESUME
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <ResumeEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentData={resumeData}
        onSave={(newData) => setResumeData(newData)}
      />

      {/* CV Uploader Modal */}
      <CVUploadModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        cvFile={cvFile}
        onUpdateCV={(file) => setCvFile(file)}
      />
    </section>
  );
};
