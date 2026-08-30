import { PERSONAL_INFO, EDUCATION_HISTORY } from '../data/portfolioData';

export interface SocialLinkItem {
  id: string;
  platform: string;
  handle: string;
  url: string;
  category: 'Professional' | 'Code & Models' | 'Writing & Content' | 'Direct';
  icon: string;
  badge?: string;
  description: string;
}

export interface CustomCVFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface EditableResumeData {
  name: string;
  badge: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  cgpa: string;
  institution: string;
  period: string;
  summary: string;
  skillsList: { category: string; skills: string }[];
}

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    handle: 'Ankit Patel',
    url: 'https://linkedin.com/in/ankitpatel',
    category: 'Professional',
    icon: 'linkedin',
    badge: 'Primary Network',
    description: 'Professional experience, recommendations, project case studies & data discussions.',
  },
  {
    id: 'github',
    platform: 'GitHub',
    handle: 'ankitpatel-20',
    url: 'https://github.com/ankitpatel-20',
    category: 'Code & Models',
    icon: 'github',
    badge: 'Code Repos',
    description: 'Open-source ML models, SQL data mart schemas, ETL scripts, and reproducible Jupyter notebooks.',
  },
  {
    id: 'kaggle',
    platform: 'Kaggle',
    handle: 'ankitpatel1947',
    url: 'https://kaggle.com/ankitpatel1947',
    category: 'Code & Models',
    icon: 'award',
    badge: 'Competitions & Kernels',
    description: 'Ranked datasets, EDA notebooks, predictive baseline pipelines, and community kernels.',
  },
  {
    id: 'leetcode',
    platform: 'LeetCode',
    handle: 'ankitpatel-20',
    url: 'https://leetcode.com/u/ankitpatel-20/',
    category: 'Code & Models',
    icon: 'terminal',
    badge: 'SQL & DSA',
    description: 'Ranked solutions for SQL queries, Data Structures, and Algorithmic problems.',
  },
  {
    id: 'twitter',
    platform: 'Twitter / X',
    handle: '@ankit_patel76639',
    url: 'https://x.com/ankit_patel76639',
    category: 'Writing & Content',
    icon: 'twitter',
    badge: 'Tech Threads',
    description: 'Bite-sized breakdowns on XGBoost tuning, SQL optimizations, DAX tricks, and AI workflows.',
  },
  {
    id: 'medium',
    platform: 'Medium',
    handle: 'Ankit Patel',
    url: 'https://medium.com/@ankitpatel',
    category: 'Writing & Content',
    icon: 'book-open',
    badge: 'Technical Articles',
    description: 'In-depth engineering write-ups on building data marts, class-imbalance mitigation, and ML architectures.',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '_ankitpatel47',
    url: 'https://instagram.com/_ankitpatel47',
    category: 'Writing & Content',
    icon: 'instagram',
    badge: 'Visual & Updates',
    description: 'Tech updates, milestone highlights, and developer journey snapshots.',
  },
  {
    id: 'telegram',
    platform: 'Telegram',
    handle: '@ankitpatel47',
    url: 'https://t.me/ankitpatel47',
    category: 'Direct',
    icon: 'send',
    badge: 'Instant Message',
    description: 'Direct messaging channel for project inquiries, collaborations, and discussions.',
  },
  {
    id: 'discord',
    platform: 'Discord',
    handle: 'ankitpatel0126',
    url: 'https://discord.com',
    category: 'Direct',
    icon: 'message-square',
    badge: 'Direct Chat',
    description: 'Real-time discussions on data science collaborations, open-source projects, and hackathons.',
  },
  {
    id: 'email',
    platform: 'Direct Email',
    handle: 'ankitpatel11411@gmail.com',
    url: 'mailto:ankitpatel11411@gmail.com',
    category: 'Direct',
    icon: 'mail',
    badge: 'Fast Response',
    description: 'Official channel for internship inquiries, project opportunities, and recruiter reach-out.',
  },
];

export const DEFAULT_RESUME_DATA: EditableResumeData = {
  name: 'Ankit Patel',
  badge: "BCA '27",
  role: 'BCA Student • Aspiring Data Scientist',
  location: 'Noida, India / Open to Relocation / Remote',
  email: 'ankitpatel11411@gmail.com',
  phone: '+91 98765 43210',
  cgpa: '8.8 / 10.0 CGPA',
  institution: 'Department of Computer Applications & Information Science',
  period: '2024 - 2027 (BCA Degree Program)',
  summary:
    'Analytical and results-oriented Bachelor of Computer Applications (BCA) student (Class of 2027) with hands-on proficiency in Python, Advanced SQL, Microsoft Power BI, and Machine Learning algorithms. Proven track record of architecting end-to-end predictive pipelines, optimizing relational data warehouses (4.8x query speedups), and crafting executive DAX dashboards for cross-functional decision makers.',
  skillsList: [
    {
      category: 'Machine Learning & AI',
      skills: 'Scikit-Learn, XGBoost, LightGBM, Random Forest, PyTorch, SHAP Explainability, NLP (Transformers), SMOTE-ENN',
    },
    {
      category: 'SQL & Data Warehousing',
      skills: 'PostgreSQL, MySQL, Recursive CTEs, Window Functions, Index Tuning, Star Schema, dbt ETL, Query Optimization',
    },
    {
      category: 'BI & Visual Analytics',
      skills: 'Microsoft Power BI (DAX, Power Query M), Tableau Desktop, Plotly, Seaborn, Matplotlib, C-Suite KPI Suites',
    },
    {
      category: 'Programming & Deployment',
      skills: 'Python (Pandas, NumPy), FastAPI, Flask REST APIs, Git/GitHub, Docker Containers, Linux Shell, Jupyter',
    },
  ],
};

import { NoteItem } from '../types';

export const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'OFFICIAL NOTICE // Candidate Availability & Internship Horizon (2025–2027)',
    category: 'Notice',
    content:
      'Currently pursuing BCA (Class of 2027) with an 8.8 CGPA. Actively interviewing for Data Science, Machine Learning Engineering, and Business Intelligence Internships. Available for immediate onboarding across Noida, Delhi NCR, Bengaluru, Mumbai, or Remote setups.',
    date: 'Aug 2025',
    isPinned: true,
    isImportant: true,
    tags: ['Notice', 'Internship', 'Hiring', 'BCA 27'],
    readTime: '1 min read',
  },
  {
    id: 'note-2',
    title: 'Why XGBoost & Tree Ensembles Still Outperform Deep Learning on Tabular Data',
    category: 'Thought',
    content:
      'While Transformers conquer NLP and Vision, tabular business datasets (churn, transaction records, pricing) are almost always best solved with Gradient Boosted Decision Trees (XGBoost, LightGBM, CatBoost).\n\nKey takeaways from my churn modeling experiments:\n1. Decision trees handle unnormalized distributions, mixed feature types (categorical + continuous), and missing values natively.\n2. When paired with SHAP (TreeExplainer), feature attribution is exact and computationally tractable in seconds, giving stakeholders clear explanations.\n3. Deep learning on tabular features often overfits on noise without massive regularization, and training iteration times are 5x slower without performance gains.',
    date: 'Aug 2025',
    isPinned: true,
    isImportant: false,
    tags: ['Machine Learning', 'XGBoost', 'Tabular Data', 'SHAP'],
    readTime: '3 min read',
  },
  {
    id: 'note-3',
    title: 'The DAX VertiPaq Compression Truth: Star Schema vs Snowflake Modeling',
    category: 'Research',
    content:
      'When engineering the 120,000+ order Power BI analytics model, I tested normalized Snowflake vs denormalized Star Schema.\n\nVertiPaq stores data column-by-column with dictionary and run-length encoding. By flattening secondary dimensions into a pure Star Schema (Fact_Orders connected to Dim_Customer, Dim_Product, Dim_Date), cardinality per column dropped significantly, cutting query evaluation times from 420ms down to 145ms for complex CALCULATE(FILTER()) DAX measures.',
    date: 'Jul 2025',
    isPinned: false,
    isImportant: false,
    tags: ['Power BI', 'DAX', 'Data Modeling', 'VertiPaq'],
    readTime: '2 min read',
  },
  {
    id: 'note-4',
    title: 'Beware the 99% Accuracy Trap in Imbalanced Classification',
    category: 'Learning',
    content:
      'If 2% of bank transactions are fraudulent, a model predicting "Never Fraud" is instantly 98% accurate while being completely useless.\n\nIn my fraud detection data mart project, baseline accuracy was discarded in favor of Precision-Recall AUC (PR-AUC), F1-Score with tuned decision thresholds, and SMOTE-ENN hybrid sampling. Always align your loss metric with the cost matrix of false negatives in business contexts.',
    date: 'Jun 2025',
    isPinned: false,
    isImportant: false,
    tags: ['Machine Learning', 'Evaluation Metrics', 'Imbalanced Data'],
    readTime: '2 min read',
  },
  {
    id: 'note-5',
    title: 'PostgreSQL Indexing: Why B-Tree + BRIN Indexes Changed 2.5M Transaction Query Speeds',
    category: 'Research',
    content:
      'For append-only time-series financial ledgers, standard B-Trees on timestamp columns occupy substantial disk space and buffer cache. Switching to Block Range Indexing (BRIN) on sequentially sorted created_at columns shrank index size by 92% while maintaining near-instant partition pruning during window function rollups.',
    date: 'May 2025',
    isPinned: false,
    isImportant: false,
    tags: ['SQL', 'PostgreSQL', 'Database Optimization'],
    readTime: '2 min read',
  },
];

const STORAGE_KEYS = {
  SOCIALS: 'ankit_portfolio_socials_v2',
  RESUME: 'ankit_portfolio_resume_v2',
  CV_FILE: 'ankit_portfolio_cv_file_v2',
  NOTES: 'ankit_portfolio_notes_v2',
};

// Socials helpers
export const loadSavedSocials = (): SocialLinkItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SOCIALS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load saved socials:', e);
  }
  return DEFAULT_SOCIAL_LINKS;
};

export const saveSocials = (socials: SocialLinkItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOCIALS, JSON.stringify(socials));
  } catch (e) {
    console.error('Failed to save socials:', e);
  }
};

// Resume data helpers
export const loadSavedResume = (): EditableResumeData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RESUME);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load saved resume data:', e);
  }
  return DEFAULT_RESUME_DATA;
};

export const saveResumeData = (resumeData: EditableResumeData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resumeData));
  } catch (e) {
    console.error('Failed to save resume data:', e);
  }
};

// Uploaded CV File helpers
export const loadSavedCVFile = (): CustomCVFile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CV_FILE);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load saved CV file:', e);
  }
  return null;
};

export const saveCVFile = (file: CustomCVFile | null) => {
  try {
    if (file) {
      localStorage.setItem(STORAGE_KEYS.CV_FILE, JSON.stringify(file));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CV_FILE);
    }
  } catch (e) {
    console.error('Failed to save CV file:', e);
  }
};

// Notes & Thought Log helpers
export const loadSavedNotes = (): NoteItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load saved notes:', e);
  }
  return DEFAULT_NOTES;
};

export const saveNotes = (notes: NoteItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
};

