import React, { useState } from 'react';
import { NavigationTab } from '../types';
import {
  ArrowRight,
  Terminal,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  BarChart2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSelectProject?: (projectId: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  setActiveTab,
  onSelectProject,
}) => {
  // Interactive state for SQL Query Card
  const [sqlExecuted, setSqlExecuted] = useState(false);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Interactive state for Python Model Card
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(100);
  const [activeChipInfo, setActiveChipInfo] = useState<string | null>(null);

  const handleRunSql = () => {
    setIsExecutingSql(true);
    setTimeout(() => {
      setIsExecutingSql(false);
      setSqlExecuted(true);
    }, 500);
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingProgress(20);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div
      id="home-screen"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between border-b-2 border-black"
    >
      {/* Top Banner Row */}
      <div className="border-b-2 border-black bg-[#F9F9F9] px-6 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest font-bold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00FF00] border border-black" />
            <span className="text-black">SYSTEM STATUS // NOMINAL</span>
          </span>
          <span className="hidden sm:inline text-black/40">|</span>
          <span className="hidden sm:inline text-[#52525B]">INDEX 01 / 06 — APPLIED DATA SCIENCE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-black bg-[#00FF00] px-2 py-0.5 border border-black font-bold">
            AVAILABLE FOR HIRE
          </span>
          <span className="text-[#52525B]">BCA '27 • 8.8 CGPA</span>
        </div>
      </div>

      {/* Main Exhibition Layout */}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Left Vertical Architectural Rail */}
        <section className="hidden xl:flex w-[80px] border-r-2 border-black flex-col items-center justify-between py-12 bg-[#F9F9F9]">
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[0.5em] font-black opacity-40 select-none">
            CURRENT SELECTION 2024 // 2027
          </span>
          <div className="mt-auto flex flex-col gap-3 mb-4">
            <div className="w-2.5 h-2.5 bg-black" />
            <div className="w-2.5 h-2.5 bg-[#00FF00] border border-black" />
            <div className="w-2.5 h-2.5 bg-gray-300" />
          </div>
        </section>

        {/* Center Main Hero Block */}
        <section className="flex-grow relative flex flex-col justify-center px-6 sm:px-12 py-12 lg:py-16 bg-white overflow-hidden">
          {/* Giant Brutalist Watermark Number */}
          <div className="absolute -top-6 -left-4 text-[160px] sm:text-[220px] lg:text-[260px] font-black opacity-[0.04] leading-none select-none pointer-events-none text-black">
            01
          </div>

          <div className="relative z-10 max-w-3xl">
            {/* Bold Eyebrow & Status Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] uppercase font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
                Active Candidate
              </span>
              <span className="text-[10px] uppercase font-bold border border-black px-2.5 py-1 bg-white">
                BCA Final Year
              </span>
              <span className="text-[10px] uppercase font-mono font-bold text-[#52525B] px-2 py-1">
                // ANKIT PATEL
              </span>
            </div>

            {/* Giant Bold Headline */}
            <h1
              id="hero-name-heading"
              className="text-[52px] sm:text-[76px] md:text-[96px] lg:text-[108px] font-black leading-[0.85] tracking-tighter uppercase text-black"
            >
              DATA<br />SCIENTIST
            </h1>

            {/* Paragraph & Sub-headline */}
            <div className="flex flex-col sm:flex-row mt-8 items-start gap-8 sm:gap-12">
              <div className="max-w-[380px] space-y-3">
                <p className="text-[16px] leading-relaxed font-bold text-black">
                  Turning raw statistical distributions and relational datasets into production-grade predictive intelligence and executive DAX insights.
                </p>
                <p className="text-[13px] leading-relaxed text-[#52525B] font-medium border-l-2 border-black pl-3">
                  Disciplined BCA student with proven execution across XGBoost modeling (94.2% ROC-AUC), 4.8x SQL warehouse optimization, and 14+ Power BI dashboards.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button
                  id="explore-work-btn"
                  onClick={() => setActiveTab('projects')}
                  className="px-8 py-3.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>EXPLORE ARCHIVES</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="view-manifesto-btn"
                  onClick={() => setActiveTab('about')}
                  className="px-8 py-3.5 bg-white text-black hover:bg-[#F9F9F9] border-2 border-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>VIEW MANIFESTO</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 pt-8 border-t-2 border-black">
              <div className="p-3 bg-[#F9F9F9] border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] font-bold">Accuracy</div>
                <div className="text-2xl font-black font-mono text-black mt-0.5">94.2%</div>
                <div className="text-[10px] font-bold text-[#00AA00]">ROC-AUC ML</div>
              </div>
              <div className="p-3 bg-[#F9F9F9] border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] font-bold">Records</div>
                <div className="text-2xl font-black font-mono text-black mt-0.5">2.5M+</div>
                <div className="text-[10px] font-bold text-[#52525B]">SQL Queries</div>
              </div>
              <div className="p-3 bg-[#F9F9F9] border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] font-bold">Dashboards</div>
                <div className="text-2xl font-black font-mono text-black mt-0.5">14+</div>
                <div className="text-[10px] font-bold text-[#52525B]">Power BI Suites</div>
              </div>
              <div className="p-3 bg-[#F9F9F9] border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] font-bold">BCA Merit</div>
                <div className="text-2xl font-black font-mono text-black mt-0.5">8.8/10</div>
                <div className="text-[10px] font-bold text-[#00AA00]">Cumulative CGPA</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side Index & Interactive Live Code Column */}
        <section className="w-full lg:w-[420px] xl:w-[460px] border-t-2 lg:border-t-0 lg:border-l-2 border-black p-6 sm:p-8 flex flex-col justify-between bg-[#F9F9F9]">
          <div className="space-y-6">
            {/* Column Header */}
            <div className="flex justify-between items-center pb-4 border-b-2 border-black">
              <h3 className="text-[11px] uppercase tracking-widest font-black text-black">
                INDEX / CORE PIPELINES
              </h3>
              <span className="text-[11px] font-mono font-bold text-black">01 — 04</span>
            </div>

            {/* Interactive Card 1: SQL Terminal */}
            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000000] relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/20">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-black" />
                  <span className="font-mono text-xs font-black uppercase text-black">
                    QUERY.SQL // POSTGRES
                  </span>
                </div>
                <button
                  onClick={handleRunSql}
                  disabled={isExecutingSql}
                  className="px-2.5 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black border border-black text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5" />
                  {isExecutingSql ? 'RUNNING...' : sqlExecuted ? 'RERUN' : 'EXECUTE'}
                </button>
              </div>

              <pre className="font-mono text-[11px] leading-relaxed text-black bg-[#F4F4F5] p-2.5 border border-black/10 overflow-x-auto">
                <span className="font-black text-black">SELECT</span> model, accuracy, latency<br />
                <span className="font-black text-black">FROM</span> applied_intelligence<br />
                <span className="font-black text-black">WHERE</span> candidate = <span className="text-[#008800] font-bold">&apos;Ankit Patel&apos;</span><br />
                <span className="font-black text-black">ORDER BY</span> impact <span className="font-black text-black">DESC</span>;
              </pre>

              {sqlExecuted && (
                <div className="mt-2 p-2 bg-[#00FF00]/20 border border-black text-[10px] font-mono text-black font-bold animate-fadeIn">
                  <div className="flex justify-between border-b border-black/20 pb-1 mb-1">
                    <span>STATUS: 200 OK</span>
                    <span>QUERY TIME: 8.4ms</span>
                  </div>
                  <div>✓ Churn Predictor: 94.2% ROC-AUC</div>
                  <div>✓ Star Schema Warehouse: 4.8x Speedup</div>
                </div>
              )}
            </div>

            {/* Interactive Card 2: Python Model */}
            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000000] relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/20">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-black" />
                  <span className="font-mono text-xs font-black uppercase text-black">
                    MODEL.PY // XGBOOST
                  </span>
                </div>
                <button
                  onClick={handleTrainModel}
                  disabled={isTraining}
                  className="px-2.5 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black border border-black text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {isTraining ? 'TRAINING...' : 'FIT MODEL'}
                </button>
              </div>

              <pre className="font-mono text-[11px] leading-relaxed text-black bg-[#F4F4F5] p-2.5 border border-black/10 overflow-x-auto">
                <span className="font-bold">clf</span> = XGBClassifier(n_estimators=300)<br />
                clf.fit(X_train, y_train)<br />
                <span className="text-[#52525B] italic"># Evaluated on 75,000 subscribers</span>
              </pre>

              {isTraining && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-black mb-1">
                    <span>OPTIMIZING HYPERPARAMETERS...</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-[#E5E5E5] h-2 border border-black">
                    <div
                      className="bg-[#00FF00] h-full transition-all duration-200"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Skills Chip Matrix */}
            <div className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_#000000]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#52525B] mb-2">
                RAPID STACK INSPECTION
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold">
                <button
                  onClick={() =>
                    setActiveChipInfo('Python: Core data analysis with Pandas, NumPy, Scikit-Learn, XGBoost')
                  }
                  className="p-2 border border-black bg-[#F9F9F9] hover:bg-[#00FF00] hover:text-black text-left transition-colors cursor-pointer"
                >
                  [01] PYTHON / ML
                </button>
                <button
                  onClick={() =>
                    setActiveChipInfo('SQL: PostgreSQL, MySQL, CTEs, Window Functions, Index Optimization')
                  }
                  className="p-2 border border-black bg-[#F9F9F9] hover:bg-[#00FF00] hover:text-black text-left transition-colors cursor-pointer"
                >
                  [02] SQL / DWH
                </button>
                <button
                  onClick={() =>
                    setActiveChipInfo('Power BI: Star Schema, DAX Calculated Measures, Executive KPIs')
                  }
                  className="p-2 border border-black bg-[#F9F9F9] hover:bg-[#00FF00] hover:text-black text-left transition-colors cursor-pointer"
                >
                  [03] POWER BI / DAX
                </button>
                <button
                  onClick={() =>
                    setActiveChipInfo('AI & NLP: Transformers, SHAP Model Explainability, PyTorch Basics')
                  }
                  className="p-2 border border-black bg-[#F9F9F9] hover:bg-[#00FF00] hover:text-black text-left transition-colors cursor-pointer"
                >
                  [04] STATS / AI
                </button>
              </div>

              {activeChipInfo && (
                <div className="mt-2 p-2 bg-black text-white text-[10px] font-mono flex items-center justify-between border border-black">
                  <span>{activeChipInfo}</span>
                  <button
                    onClick={() => setActiveChipInfo(null)}
                    className="text-[#00FF00] font-bold hover:underline ml-2"
                  >
                    [X]
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column Bottom Stamp matching Reference HTML */}
          <div className="pt-6 border-t-2 border-black mt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center text-white text-[10px] font-mono font-black rotate-6 border border-black">
                2027
              </div>
              <div className="text-[11px] leading-tight font-bold text-black">
                CANDIDATE DOSSIER:<br />
                <span className="font-normal text-[#52525B] font-mono text-[10px]">
                  ANKIT PATEL • READY FOR DEPLOYMENT
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
