import React, { useState } from 'react';
import { Project } from '../types';
import {
  X,
  Github,
  ExternalLink,
  Cpu,
  Layers,
  BarChart3,
  Terminal,
  Play,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  Code2,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'code' | 'architecture'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  // Churn Simulator State
  const [tenure, setTenure] = useState<number>(6);
  const [monthlyCharge, setMonthlyCharge] = useState<number>(85);
  const [tickets, setTickets] = useState<number>(4);
  const [hasAutopay, setHasAutopay] = useState<boolean>(false);

  // Fraud Simulator State
  const [txnAmount, setTxnAmount] = useState<number>(1450);
  const [txnHour, setTxnHour] = useState<number>(3);
  const [isForeignLocation, setIsForeignLocation] = useState<boolean>(true);
  const [velocityScore, setVelocityScore] = useState<number>(4);

  // NLP Simulator State
  const [selectedReviewIdx, setSelectedReviewIdx] = useState<number>(0);
  const sampleReviews = [
    {
      text: 'The battery life is exceptional and lasts two whole days, but the charging port feels fragile.',
      aspects: [
        { aspect: 'Battery', sentiment: 'Positive (96.4%)', color: 'bg-[#00FF00]' },
        { aspect: 'Build Quality', sentiment: 'Negative (84.1%)', color: 'bg-red-400 text-white' },
      ],
    },
    {
      text: 'Super fast processor handling heavy rendering without heating up. Display colors are stunning.',
      aspects: [
        { aspect: 'Performance', sentiment: 'Positive (98.2%)', color: 'bg-[#00FF00]' },
        { aspect: 'Display', sentiment: 'Positive (95.0%)', color: 'bg-[#00FF00]' },
      ],
    },
    {
      text: 'Customer support was unresponsive for 3 days and delivery was delayed by a week.',
      aspects: [
        { aspect: 'Customer Service', sentiment: 'Negative (97.8%)', color: 'bg-red-400 text-white' },
        { aspect: 'Shipping', sentiment: 'Negative (92.5%)', color: 'bg-red-400 text-white' },
      ],
    },
  ];

  // Calculate live churn score
  const calculateChurnScore = () => {
    let score = 0.35;
    score += tickets * 0.12;
    score += monthlyCharge > 75 ? 0.2 : -0.1;
    score -= tenure * 0.025;
    if (!hasAutopay) score += 0.15;
    return Math.min(0.98, Math.max(0.04, score));
  };

  const churnScore = calculateChurnScore();
  const churnPercentage = (churnScore * 100).toFixed(1);

  // Calculate Fraud Score
  const calculateFraudScore = () => {
    let score = 0.1;
    if (txnAmount > 1000) score += 0.35;
    if (txnHour >= 1 && txnHour <= 5) score += 0.25;
    if (isForeignLocation) score += 0.3;
    score += velocityScore * 0.08;
    return Math.min(0.99, Math.max(0.02, score));
  };
  const fraudScore = calculateFraudScore();
  const fraudPercentage = (fraudScore * 100).toFixed(1);

  // SQL Runner state
  const [selectedSqlSample, setSelectedSqlSample] = useState<number>(0);
  const sqlSamples = [
    {
      title: 'Customer Rolling LTV & Expansion',
      query: `SELECT txn_month, COUNT(DISTINCT user_id) as users, AVG(monthly_spend) as avg_spend FROM fact_transactions GROUP BY 1 ORDER BY 1 DESC;`,
      results: [
        { month: '2024-08', users: '14,290', avg_spend: '$184.50', ltv_growth: '+12.4%' },
        { month: '2024-07', users: '13,100', avg_spend: '$178.20', ltv_growth: '+9.8%' },
        { month: '2024-06', users: '11,840', avg_spend: '$165.10', ltv_growth: '+14.1%' },
      ],
    },
    {
      title: 'High-Velocity Settlement Hierarchy',
      query: `SELECT merchant_tier, SUM(settled_amt) as total_volume, AVG(latency_ms) as avg_speed FROM settlements GROUP BY 1;`,
      results: [
        { merchant_tier: 'Enterprise Tier 1', total_volume: '$4,280,000', avg_speed: '12ms' },
        { merchant_tier: 'Growth Tier 2', total_volume: '$1,650,000', avg_speed: '18ms' },
        { merchant_tier: 'Standard Tier 3', total_volume: '$890,000', avg_speed: '22ms' },
      ],
    },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.codeSnippet.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isChurn = project.demoType === 'churn-simulator' || project.id === 'churn-predictor' || project.id === 'customer-churn-ml';
  const isSql = project.demoType === 'sql-runner' || project.id === 'sql-mart' || project.id === 'postgres-financial-data-mart';
  const isFraud = project.demoType === 'fraud-detector' || project.id === 'fraud-detection';
  const isNlp = project.demoType === 'nlp-analyzer' || project.id === 'nlp-sentiment';

  return (
    <div
      id="project-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="project-detail-modal-content"
        className="w-full max-w-4xl bg-white border-4 border-black p-6 sm:p-8 shadow-[12px_12px_0px_#000000] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-black mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-black uppercase bg-[#00FF00] text-black px-2 py-0.5 border border-black">
                {project.category}
              </span>
              <span className="text-xs font-mono font-bold text-[#52525B]">CASE STUDY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-black pb-4">
          {[
            { id: 'overview', label: 'OVERVIEW & HIGHLIGHTS' },
            { id: 'simulator', label: 'LIVE SIMULATOR / DATA MART' },
            { id: 'code', label: 'CODE IMPLEMENTATION' },
            { id: 'architecture', label: 'SYSTEM ARCHITECTURE' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 border-2 border-black text-xs font-mono font-black tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-[2px_2px_0px_#000000]'
                  : 'bg-[#F9F9F9] hover:bg-white text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F9F9F9] border-2 border-black">
              <h4 className="text-xs font-mono font-black text-[#52525B] uppercase mb-1">EXECUTIVE SUMMARY</h4>
              <p className="text-sm text-black leading-relaxed font-medium">{project.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-black text-black uppercase mb-3">KEY HIGHLIGHTS & OUTCOMES</h4>
              <div className="space-y-2">
                {project.highlights.map((hl, idx) => (
                  <div key={idx} className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex items-start gap-2.5">
                    <span className="font-mono text-xs font-black bg-black text-white px-1.5 py-0.2">0{idx + 1}</span>
                    <span className="text-xs text-black font-medium">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-[#F9F9F9] border-2 border-black text-center">
                  <div className="text-[10px] font-mono font-bold text-[#52525B] uppercase">{m.label}</div>
                  <div className="text-xl font-black font-mono text-black mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Live Simulator / Sandboxes */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {isChurn ? (
              <div className="p-6 bg-[#F9F9F9] border-2 border-black space-y-5">
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <h4 className="font-black text-sm text-black uppercase">LIVE XGBOOST CHURN SIMULATOR</h4>
                  <span className="text-xs font-mono font-bold bg-[#00FF00] px-2 py-0.5 border border-black text-black">
                    DYNAMIC INFERENCE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="block font-bold text-black mb-1">SUBSCRIBER TENURE: {tenure} MONTHS</label>
                    <input
                      type="range"
                      min={1}
                      max={48}
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-black mb-1">MONTHLY CHARGES: ${monthlyCharge}</label>
                    <input
                      type="range"
                      min={20}
                      max={150}
                      value={monthlyCharge}
                      onChange={(e) => setMonthlyCharge(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-black mb-1">SUPPORT TICKETS LOGGED: {tickets}</label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={tickets}
                      onChange={(e) => setTickets(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="autopay"
                      checked={hasAutopay}
                      onChange={(e) => setHasAutopay(e.target.checked)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <label htmlFor="autopay" className="font-bold text-black cursor-pointer">
                      ENROLLED IN AUTOPAY (-15% CHURN)
                    </label>
                  </div>
                </div>

                {/* Churn Output */}
                <div className="p-4 bg-white border-2 border-black flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-black text-[#52525B]">PREDICTED CHURN RISK</div>
                    <div className="text-3xl font-black font-mono text-black">{churnPercentage}%</div>
                  </div>
                  <div
                    className={`px-4 py-2 border-2 border-black font-mono font-black text-xs uppercase ${
                      churnScore > 0.6
                        ? 'bg-red-500 text-white'
                        : churnScore > 0.3
                        ? 'bg-yellow-400 text-black'
                        : 'bg-[#00FF00] text-black'
                    }`}
                  >
                    {churnScore > 0.6
                      ? 'HIGH RISK ATTRITION'
                      : churnScore > 0.3
                      ? 'MODERATE RETENTION RISK'
                      : 'HEALTHY SUBSCRIBER'}
                  </div>
                </div>
              </div>
            ) : isSql ? (
              <div className="p-6 bg-[#F9F9F9] border-2 border-black space-y-4">
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <h4 className="font-black text-sm text-black uppercase">LIVE POSTGRESQL DATA MART ENGINE</h4>
                  <span className="text-xs font-mono font-bold bg-[#00FF00] px-2 py-0.5 border border-black text-black">
                    2.5M ROWS
                  </span>
                </div>

                <div className="flex gap-2">
                  {sqlSamples.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSqlSample(idx)}
                      className={`px-3 py-1.5 border-2 border-black text-xs font-mono font-bold uppercase ${
                        selectedSqlSample === idx ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>

                <div className="bg-[#F4F4F5] p-3 border-2 border-black font-mono text-xs text-black">
                  {sqlSamples[selectedSqlSample].query}
                </div>

                <div className="border-2 border-black bg-white overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="bg-black text-white">
                      <tr>
                        {Object.keys(sqlSamples[selectedSqlSample].results[0]).map((key) => (
                          <th key={key} className="p-2 uppercase border-r border-white/20 last:border-none">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlSamples[selectedSqlSample].results.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-black/10 last:border-none">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="p-2 border-r border-black/10 last:border-none font-bold">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : isFraud ? (
              <div className="p-6 bg-[#F9F9F9] border-2 border-black space-y-5">
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <h4 className="font-black text-sm text-black uppercase">LIVE FRAUD DETECTION RISK SCORER</h4>
                  <span className="text-xs font-mono font-bold bg-[#00FF00] px-2 py-0.5 border border-black text-black">
                    RANDOM FOREST + SMOTE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="block font-bold text-black mb-1">TRANSACTION AMOUNT: ${txnAmount}</label>
                    <input
                      type="range"
                      min={10}
                      max={5000}
                      step={50}
                      value={txnAmount}
                      onChange={(e) => setTxnAmount(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-black mb-1">TRANSACTION TIME: {txnHour}:00 HRS</label>
                    <input
                      type="range"
                      min={0}
                      max={23}
                      value={txnHour}
                      onChange={(e) => setTxnHour(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-black mb-1">VELOCITY (TXNS / 10 MIN): {velocityScore}</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={velocityScore}
                      onChange={(e) => setVelocityScore(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="foreignLoc"
                      checked={isForeignLocation}
                      onChange={(e) => setIsForeignLocation(e.target.checked)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <label htmlFor="foreignLoc" className="font-bold text-black cursor-pointer">
                      FOREIGN / UNRECOGNIZED IP (+30% ANOMALY)
                    </label>
                  </div>
                </div>

                {/* Fraud Result */}
                <div className="p-4 bg-white border-2 border-black flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-black text-[#52525B]">ANOMALY PROBABILITY</div>
                    <div className="text-3xl font-black font-mono text-black">{fraudPercentage}%</div>
                  </div>
                  <div
                    className={`px-4 py-2 border-2 border-black font-mono font-black text-xs uppercase ${
                      fraudScore > 0.6
                        ? 'bg-red-500 text-white'
                        : fraudScore > 0.3
                        ? 'bg-yellow-400 text-black'
                        : 'bg-[#00FF00] text-black'
                    }`}
                  >
                    {fraudScore > 0.6 ? 'DECLINE / FRAUD ALERT' : fraudScore > 0.3 ? 'STEP-UP 2FA AUTH' : 'TRANSACTION APPROVED'}
                  </div>
                </div>
              </div>
            ) : isNlp ? (
              <div className="p-6 bg-[#F9F9F9] border-2 border-black space-y-4">
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <h4 className="font-black text-sm text-black uppercase">ASPECT-BASED TRANSFORMER SENTIMENT</h4>
                  <span className="text-xs font-mono font-bold bg-[#00FF00] px-2 py-0.5 border border-black text-black">
                    DISTILBERT
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-black uppercase">SELECT TEST REVIEW CORPUS:</label>
                  <div className="flex flex-col gap-2">
                    {sampleReviews.map((rev, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => setSelectedReviewIdx(rIdx)}
                        className={`p-3 text-left border-2 border-black text-xs font-mono transition-all cursor-pointer ${
                          selectedReviewIdx === rIdx ? 'bg-black text-white shadow-[2px_2px_0px_#000000]' : 'bg-white text-black'
                        }`}
                      >
                        &ldquo;{rev.text}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white border-2 border-black space-y-2">
                  <span className="text-[10px] font-mono font-black uppercase text-[#52525B] block">EXTRACTED ASPECTS & POLARITY</span>
                  <div className="flex flex-wrap gap-2">
                    {sampleReviews[selectedReviewIdx].aspects.map((asp, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2 border border-black px-3 py-1 bg-[#F4F4F5] text-xs font-mono font-bold">
                        <span>{asp.aspect}:</span>
                        <span className={`px-2 py-0.5 border border-black text-[10px] ${asp.color}`}>{asp.sentiment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#F9F9F9] border-2 border-black space-y-4 text-center">
                <BarChart3 className="w-10 h-10 text-black mx-auto" />
                <h4 className="font-black text-base text-black uppercase">INTERACTIVE POWER BI ANALYTICS SUITE</h4>
                <p className="text-xs text-[#52525B] max-w-md mx-auto">
                  Star Schema architecture with 45+ DAX measures, dynamic currency conversion, and drill-through supply chain matrix.
                </p>
                <div className="p-3 bg-white border-2 border-black font-mono text-xs font-bold text-black max-w-sm mx-auto">
                  DAX: Total Profit = SUMX(Sales, Sales[Price] - RELATED(Cost[UnitCost]))
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Code Implementation */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-black uppercase">
                  {project.codeSnippet.filename}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#00FF00] border border-black uppercase text-black">
                  {project.codeSnippet.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 bg-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#00AA00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GITHUB REPO</span>
                </a>
              </div>
            </div>

            <div className="bg-[#F4F4F5] border-2 border-black p-4">
              <pre className="font-mono text-xs text-black leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {project.codeSnippet.code}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#F9F9F9] border-2 border-black">
              <h4 className="font-black text-sm text-black uppercase mb-4">ARCHITECTURE & DATA FLOW</h4>
              <div className="p-4 bg-white border-2 border-black font-mono text-xs text-black leading-relaxed mb-4">
                {project.architecture}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
                <div className="p-3 bg-white border-2 border-black">
                  <span className="text-[10px] font-black text-[#52525B] block">STAGE 01</span>
                  <span className="font-black text-black mt-1 block">INGESTION & CLEANING</span>
                  <span className="text-[11px] text-[#52525B]">Python / Pandas / dbt</span>
                </div>
                <div className="p-3 bg-white border-2 border-black">
                  <span className="text-[10px] font-black text-[#52525B] block">STAGE 02</span>
                  <span className="font-black text-black mt-1 block">MODELING & TRANSFORM</span>
                  <span className="text-[11px] text-[#52525B]">PostgreSQL / Star Schema</span>
                </div>
                <div className="p-3 bg-white border-2 border-black">
                  <span className="text-[10px] font-black text-[#52525B] block">STAGE 03</span>
                  <span className="font-black text-black mt-1 block">SERVING & BI REPORTING</span>
                  <span className="text-[11px] text-[#52525B]">Power BI / FastAPI</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#F4F4F5] border border-black text-black">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black text-xs font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000]"
            >
              SOURCE CODE
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-black hover:bg-[#F4F4F5] border-2 border-black text-xs font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000]"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

