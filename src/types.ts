export type NavigationTab = 'home' | 'about' | 'skills' | 'projects' | 'resume' | 'socials' | 'notes' | 'contact';

export interface NoteItem {
  id: string;
  title: string;
  category: 'Notice' | 'Thought' | 'Research' | 'Learning' | 'Milestone';
  content: string;
  date: string;
  isPinned?: boolean;
  isImportant?: boolean;
  tags: string[];
  readTime?: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Machine Learning' | 'Power BI & BI' | 'SQL & Analytics' | 'Deep Learning & NLP';
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  highlights: string[];
  architecture: string;
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
  };
  demoType: 'churn-simulator' | 'sql-runner' | 'powerbi-dashboard' | 'nlp-analyzer' | 'fraud-detector';
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0-100
    experience: string;
    badge: string;
    snippet: string;
    description: string;
  }[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  status: string;
  focus: string[];
  coursework: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  skills: string[];
  verified: boolean;
}

export interface MetricStat {
  label: string;
  value: string;
  icon: string;
  subtext: string;
}
