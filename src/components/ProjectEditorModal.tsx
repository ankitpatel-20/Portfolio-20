import React, { useState } from 'react';
import { Project } from '../types';
import {
  X,
  Plus,
  Trash2,
  Save,
  Check,
  FolderGit2,
  Code2,
  Cpu,
  BarChart3,
  Terminal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_PROJECTS } from '../utils/portfolioStorage';

interface ProjectEditorModalProps {
  projectToEdit?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  projectToEdit,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!projectToEdit;

  // Form states
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [category, setCategory] = useState<
    'Machine Learning' | 'Power BI & BI' | 'SQL & Analytics' | 'Deep Learning & NLP'
  >(projectToEdit?.category || 'Machine Learning');
  const [subtitle, setSubtitle] = useState(projectToEdit?.subtitle || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [githubUrl, setGithubUrl] = useState(projectToEdit?.githubUrl || 'https://github.com/ankitpatel-20');
  const [demoUrl, setDemoUrl] = useState(projectToEdit?.demoUrl || '#');
  const [architecture, setArchitecture] = useState(
    projectToEdit?.architecture ||
      'PostgreSQL DB -> Feature Extraction Pipeline (Pandas) -> Machine Learning Model -> REST API Service'
  );
  const [demoType, setDemoType] = useState<
    'churn-simulator' | 'sql-runner' | 'powerbi-dashboard' | 'nlp-analyzer' | 'fraud-detector'
  >(projectToEdit?.demoType || 'churn-simulator');

  // Metrics state (array of {label, value})
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>(
    projectToEdit?.metrics || [
      { label: 'Accuracy / Score', value: '94.5%' },
      { label: 'Latency / Speed', value: '< 30ms' },
      { label: 'Data Points', value: '50K+' },
    ]
  );

  // Highlights (newline or array)
  const [highlightsText, setHighlightsText] = useState(
    projectToEdit?.highlights?.join('\n') ||
      'Engineered domain-specific feature representations using Pandas & SQL\nValidated performance across cross-validation folds\nPackaged modular REST service for live inferences'
  );

  // Tags
  const [tagsText, setTagsText] = useState(
    projectToEdit?.tags?.join(', ') || 'Python, Scikit-Learn, SQL, Pandas'
  );

  // Code Snippet
  const [codeFilename, setCodeFilename] = useState(
    projectToEdit?.codeSnippet?.filename || 'model_pipeline.py'
  );
  const [codeLanguage, setCodeLanguage] = useState(
    projectToEdit?.codeSnippet?.language || 'python'
  );
  const [codeContent, setCodeContent] = useState(
    projectToEdit?.codeSnippet?.code ||
      `import numpy as np\nimport pandas as pd\nfrom sklearn.pipeline import Pipeline\n\n# Pipeline initialization\ndef run_pipeline(df):\n    return df.describe()`
  );

  const [activeFormTab, setActiveFormTab] = useState<'general' | 'metrics' | 'code'>('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { label: 'Metric Name', value: 'Value' }]);
  };

  const handleRemoveMetric = (idx: number) => {
    setMetrics(metrics.filter((_, i) => i !== idx));
  };

  const handleUpdateMetric = (idx: number, field: 'label' | 'value', val: string) => {
    const next = [...metrics];
    next[idx][field] = val;
    setMetrics(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a title and description');
      return;
    }

    const cleanedHighlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const cleanedTags = tagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newProject: Project = {
      id: projectToEdit ? projectToEdit.id : `project-${Date.now()}`,
      title: title.trim(),
      category,
      subtitle: subtitle.trim() || 'Practical architecture and production data pipeline',
      description: description.trim(),
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
      tags: cleanedTags.length > 0 ? cleanedTags : ['Python', 'SQL', 'Data Science'],
      githubUrl: githubUrl.trim() || 'https://github.com/ankitpatel-20',
      demoUrl: demoUrl.trim() || '#',
      highlights:
        cleanedHighlights.length > 0
          ? cleanedHighlights
          : ['Engineered scalable data pipelines', 'Validated model benchmarks'],
      architecture: architecture.trim(),
      demoType,
      codeSnippet: {
        language: codeLanguage.trim() || 'python',
        filename: codeFilename.trim() || 'script.py',
        code: codeContent.trim(),
      },
    };

    onSave(newProject);
    showToast(isEditing ? 'Project updated successfully!' : 'New project added to Archives!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-black w-full max-w-4xl shadow-[8px_8px_0px_#000000] my-8 relative flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-black text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-[#00FF00]" />
            <div>
              <h3 className="font-black text-base sm:text-lg uppercase tracking-tight">
                {isEditing ? `Edit Archive Project: ${projectToEdit.title}` : 'Add New Project to Archives'}
              </h3>
              <p className="text-[11px] font-mono text-[#A1A1AA]">
                Maintain end-to-end ML architectures, SQL pipelines, and BI dashboards
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

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-[#00FF00] border-b-2 border-black px-4 py-2 text-xs font-mono font-black text-black flex items-center gap-2 shrink-0 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-black bg-[#F4F4F5] shrink-0">
          <button
            type="button"
            onClick={() => setActiveFormTab('general')}
            className={`px-4 py-2.5 font-mono text-xs font-black uppercase transition-colors cursor-pointer ${
              activeFormTab === 'general'
                ? 'bg-white text-black border-r-2 border-black'
                : 'text-[#52525B] hover:text-black'
            }`}
          >
            [1] Overview & Info
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('metrics')}
            className={`px-4 py-2.5 font-mono text-xs font-black uppercase transition-colors cursor-pointer ${
              activeFormTab === 'metrics'
                ? 'bg-white text-black border-r-2 border-l-2 border-black'
                : 'text-[#52525B] hover:text-black'
            }`}
          >
            [2] Metrics & Highlights
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('code')}
            className={`px-4 py-2.5 font-mono text-xs font-black uppercase transition-colors cursor-pointer ${
              activeFormTab === 'code'
                ? 'bg-white text-black border-l-2 border-black'
                : 'text-[#52525B] hover:text-black'
            }`}
          >
            [3] Code & Simulator
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: General & Overview */}
          {activeFormTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Real-Time Fraud Detection Engine"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#F9F9F9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as
                          | 'Machine Learning'
                          | 'Power BI & BI'
                          | 'SQL & Analytics'
                          | 'Deep Learning & NLP'
                      )
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Power BI & BI">Power BI & BI</option>
                    <option value="SQL & Analytics">SQL & Analytics</option>
                    <option value="Deep Learning & NLP">Deep Learning & NLP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Demo Simulator Hook
                  </label>
                  <select
                    value={demoType}
                    onChange={(e) =>
                      setDemoType(
                        e.target.value as
                          | 'churn-simulator'
                          | 'sql-runner'
                          | 'powerbi-dashboard'
                          | 'nlp-analyzer'
                          | 'fraud-detector'
                      )
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
                  >
                    <option value="churn-simulator">Churn Risk Simulator</option>
                    <option value="fraud-detector">Fraud Detection Simulator</option>
                    <option value="sql-runner">Interactive SQL Data Runner</option>
                    <option value="powerbi-dashboard">Power BI DAX Explorer</option>
                    <option value="nlp-analyzer">Aspect-Based NLP Classifier</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Subtitle / Executive Hook
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. End-to-end predictive ML pipeline with real-time risk scoring"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#F9F9F9]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Full Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the business context, dataset volume, feature engineering, and statistical conclusions..."
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-medium text-black focus:outline-none focus:bg-[#F9F9F9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/ankitpatel-20/repo"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Live Demo / Dashboard URL
                  </label>
                  <input
                    type="text"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://app.powerbi.com/... or #"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Architecture Flowchart String
                  </label>
                  <input
                    type="text"
                    value={architecture}
                    onChange={(e) => setArchitecture(e.target.value)}
                    placeholder="PostgreSQL -> Feature Extraction -> XGBoost -> FastAPI"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Metrics, Highlights & Tags */}
          {activeFormTab === 'metrics' && (
            <div className="space-y-6">
              {/* Metrics Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-mono font-bold text-black uppercase">
                    Performance Metrics & KPIs
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMetric}
                    className="px-2.5 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black text-[10px] font-mono font-bold border border-black flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> ADD METRIC
                  </button>
                </div>

                <div className="space-y-2">
                  {metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                        placeholder="Label (e.g. ROC-AUC)"
                        className="w-1/2 px-3 py-1.5 bg-white border-2 border-black text-xs font-mono font-bold"
                      />
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 94.2%)"
                        className="w-1/2 px-3 py-1.5 bg-white border-2 border-black text-xs font-mono font-bold text-[#00AA00]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                  Key Architectural Highlights (One per line)
                </label>
                <textarea
                  rows={4}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder="Engineered 32 behavioral metrics from raw logs&#10;Applied SHAP TreeExplainer for feature importance&#10;Reduced query latency by 65%"
                  className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono text-black leading-relaxed focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                  Tech Stack Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Python, XGBoost, Scikit-Learn, SHAP, FastAPI, SQL"
                  className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Code Snippet & Simulator */}
          {activeFormTab === 'code' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Snippet Filename
                  </label>
                  <input
                    type="text"
                    value={codeFilename}
                    onChange={(e) => setCodeFilename(e.target.value)}
                    placeholder="e.g. churn_pipeline.py or dax_measures.dax"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    placeholder="python / sql / dax"
                    className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold text-black uppercase mb-1">
                    Code Snippet Source
                  </label>
                  <textarea
                    rows={8}
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    placeholder="Paste reproducible production script or SQL statement..."
                    className="w-full px-3 py-2 bg-[#F4F4F5] border-2 border-black text-xs font-mono text-black leading-relaxed focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              isDeleteConfirming ? (
                <div className="flex items-center gap-2 bg-red-50 border-2 border-red-600 p-1.5 animate-fadeIn">
                  <span className="text-[10px] font-mono font-black text-red-700 uppercase">
                    Delete this project?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(projectToEdit.id);
                      setIsDeleteConfirming(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-black text-white font-mono text-[10px] font-black uppercase transition-colors cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirming(false)}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-black font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirming(true)}
                  className="px-4 py-2 border-2 border-red-600 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Project</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-[#E4E4E7] text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-1.5 transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
