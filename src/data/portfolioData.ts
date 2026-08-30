import { Project, SkillCategory, EducationItem, CertificationItem, MetricStat } from '../types';

export const PERSONAL_INFO = {
  name: 'Ankit Patel',
  handle: 'ANKIT PATEL',
  status: 'System Online // Status: Exploring Opportunities',
  role: 'BCA Student (Class of 2027)',
  targetRole: 'Aspiring Data Scientist',
  tagline: 'Turning Data Into Insights, One Project at a Time.',
  bio: 'I build practical projects across Python, SQL, Power BI, statistics, machine learning, and AI — turning raw data into analysis, visualizations, and useful decisions.',
  location: 'Noida, India / Open to Relocation / Remote',
  email: 'ankitpatel11411@gmail.com',
  github: 'https://github.com/ankitpatel-20',
  linkedin: 'https://linkedin.com/in/ankitpatel',
  kaggle: 'https://kaggle.com/ankitpatel1947',
  instagram: 'https://instagram.com/_ankitpatel47',
  telegram: 'https://t.me/ankitpatel47',
  twitter: 'https://x.com/ankit_patel76639',
  medium: 'https://medium.com/@ankitpatel',
  leetcode: 'https://leetcode.com/u/ankitpatel-20/',
  discord: 'ankitpatel0126',
  availableFor: 'Internships & Full-Time Junior Data Scientist Roles (2025-2027)',
  aboutStory: `I am a Bachelor of Computer Applications (BCA) student (Class of 2027) with a laser focus on Applied Data Science and Machine Learning. Combining strong algorithmic foundations with statistical rigor, I specialize in translating complex multidimensional datasets into actionable business intelligence.

My workflow spans end-to-end data pipelines: from raw SQL data extraction, exploratory data analysis, and feature engineering to deploying predictive ML models and building C-suite interactive Power BI dashboards.`,
};

export const QUICK_METRICS: MetricStat[] = [
  { label: 'Datasets Analyzed', value: '45+', icon: 'database', subtext: 'Across finance, e-commerce, & healthcare' },
  { label: 'ML Models Trained', value: '28+', icon: 'brain', subtext: 'Regression, classification, NLP & ensembles' },
  { label: 'SQL Pipelines Built', value: '60+', icon: 'terminal', subtext: 'Complex CTEs, window functions, dbt models' },
  { label: 'Power BI Dashboards', value: '14+', icon: 'bar-chart-3', subtext: 'Interactive DAX measures & KPI suites' },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ml-ai',
    name: 'Machine Learning & AI',
    icon: 'brain',
    description: 'Statistical modeling, predictive algorithms, hyperparameter tuning & model evaluation.',
    skills: [
      {
        name: 'Python (NumPy, Pandas)',
        level: 95,
        experience: '3+ years',
        badge: 'Core Expert',
        description: 'Vectorized calculations, complex aggregations, time-series analysis and clean data wrangling.',
        snippet: `import pandas as pd\nimport numpy as np\n\ndf['log_revenue'] = np.log1p(df['revenue'])\ncohort = df.groupby(['cohort_month', 'order_month'])['user_id'].nunique().unstack()`
      },
      {
        name: 'Scikit-Learn & XGBoost',
        level: 90,
        experience: '2+ years',
        badge: 'Advanced',
        description: 'Pipeline chaining, cross-validation, feature importances, ensemble modeling and hyperopt.',
        snippet: `from xgboost import XGBClassifier\nfrom sklearn.pipeline import Pipeline\n\npipe = Pipeline([\n    ('scaler', StandardScaler()),\n    ('xgb', XGBClassifier(n_estimators=300, max_depth=5, learning_rate=0.03))\n])`
      },
      {
        name: 'PyTorch & Deep Learning',
        level: 78,
        experience: '1.5 years',
        badge: 'Proficient',
        description: 'Feedforward networks, CNNs for structured visual data, loss formulation, and transfer learning.',
        snippet: `import torch\nimport torch.nn as nn\n\nclass DataNet(nn.Module):\n    def __init__(self, in_f):\n        super().__init__()\n        self.fc = nn.Sequential(nn.Linear(in_f, 64), nn.ReLU(), nn.Dropout(0.2), nn.Linear(64, 1))`
      },
      {
        name: 'Model Interpretability (SHAP)',
        level: 85,
        experience: '1.5 years',
        badge: 'Advanced',
        description: 'TreeExplainer, force plots, feature contribution rankings, and bias audit verification.',
        snippet: `import shap\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\nshap.summary_plot(shap_values, X_test)`
      }
    ]
  },
  {
    id: 'sql-data',
    name: 'Data Engineering & SQL',
    icon: 'database',
    description: 'Relational database schema modeling, star schemas, window functions, and pipeline automation.',
    skills: [
      {
        name: 'Advanced PostgreSQL / MySQL',
        level: 92,
        experience: '3 years',
        badge: 'Core Expert',
        description: 'Recursive CTEs, PARTITION BY window functions, query plan optimization, indexing strategies.',
        snippet: `WITH RankedSales AS (\n  SELECT customer_id, purchase_date, amount,\n         ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY purchase_date DESC) as rn,\n         SUM(amount) OVER(PARTITION BY customer_id) as total_ltv\n  FROM transactions\n)\nSELECT * FROM RankedSales WHERE rn = 1;`
      },
      {
        name: 'ETL & Data Wrangling',
        level: 88,
        experience: '2 years',
        badge: 'Advanced',
        description: 'Automated batch pipelines, schema validation, missing value imputation, and outlier detection.',
        snippet: `def clean_telemetry(df: pd.DataFrame) -> pd.DataFrame:\n    df = df.dropna(subset=['session_id'])\n    df['duration_sec'] = (df['end_time'] - df['start_time']).dt.total_seconds()\n    return df[df['duration_sec'].between(1, 86400)]`
      },
      {
        name: 'dbt & Modern Data Stack',
        level: 80,
        experience: '1 year',
        badge: 'Proficient',
        description: 'Modular SQL transformations, testing frameworks, documentation generation and semantic layers.',
        snippet: `{{ config(materialized='incremental', unique_key='event_id') }}\nSELECT * FROM {{ ref('stg_events') }}\n{% if is_incremental() %}\n  WHERE event_time > (SELECT max(event_time) FROM {{ this }})\n{% endif %}`
      }
    ]
  },
  {
    id: 'bi-viz',
    name: 'BI & Data Visualization',
    icon: 'bar-chart-2',
    description: 'Transforming multidimensional data into intuitive executive dashboards and visual stories.',
    skills: [
      {
        name: 'Microsoft Power BI & DAX',
        level: 94,
        experience: '2+ years',
        badge: 'Core Expert',
        description: 'Complex CALCULATE filters, time-intelligence DAX measures, row-level security and Star Schemas.',
        snippet: `YoY_Growth_Pct = \nVAR CurrentSales = [Total_Revenue]\nVAR PriorSales = CALCULATE([Total_Revenue], SAMEPERIODLASTYEAR('DimDate'[Date]))\nRETURN DIVIDE(CurrentSales - PriorSales, PriorSales, 0)`
      },
      {
        name: 'Plotly / Seaborn / Matplotlib',
        level: 90,
        experience: '2.5 years',
        badge: 'Advanced',
        description: 'Interactive chloropleth maps, multidimensional correlation heatmaps, distribution violin plots.',
        snippet: `import plotly.express as px\nfig = px.scatter(df, x='churn_prob', y='customer_ltv', color='segment', size='avg_ticket', hover_data=['name'])\nfig.update_layout(template='plotly_dark')`
      },
      {
        name: 'Tableau Desktop',
        level: 82,
        experience: '1.5 years',
        badge: 'Proficient',
        description: 'LOD calculations (FIXED, INCLUDE), parameter actions, cohort analysis dashboards.',
        snippet: `// Customer Acquisition Cohort LOD\n{ FIXED [Customer ID] : MIN([Order Date]) }`
      }
    ]
  },
  {
    id: 'tools-dev',
    name: 'Programming & Tooling',
    icon: 'terminal',
    description: 'Developer workflows, version control, API deployment, and reproducibility best practices.',
    skills: [
      {
        name: 'Git & GitHub Collaboration',
        level: 90,
        experience: '3 years',
        badge: 'Advanced',
        description: 'Branch management, CI/CD automated test workflows, pull request reviews and documentation.',
        snippet: `git checkout -b feature/churn-model-v2\ngit commit -m "feat(ml): integrate Optuna tuning for XGBoost hyperparameters"\ngit push origin feature/churn-model-v2`
      },
      {
        name: 'FastAPI & Flask Serving',
        level: 84,
        experience: '1.5 years',
        badge: 'Advanced',
        description: 'RESTful inference endpoints, Pydantic data validation schemas, low-latency JSON response handling.',
        snippet: `@app.post("/predict/churn", response_model=ChurnResponse)\nasync def predict_churn(payload: CustomerFeatures):\n    prob = model.predict_proba([[payload.tenure, payload.monthly_charges]])[0][1]\n    return {"churn_probability": round(prob, 4), "risk_tier": "HIGH" if prob > 0.6 else "LOW"}`
      },
      {
        name: 'Docker & Containerization',
        level: 76,
        experience: '1 year',
        badge: 'Proficient',
        description: 'Dockerfile multi-stage builds for ML microservices, reproducible runtime environments.',
        snippet: `FROM python:3.10-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
      }
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'churn-predictor',
    title: 'Customer Churn Predictor & Retention Suite',
    category: 'Machine Learning',
    subtitle: 'End-to-end predictive ML pipeline with real-time risk scoring and feature importance explainability',
    description: 'Built a predictive intelligence engine on a 75,000+ subscriber dataset to detect early customer churn signals. Engineered behavioral features including rolling engagement drops, ticket frequency, and payment anomalies, training an ensemble of XGBoost and LightGBM models.',
    metrics: [
      { label: 'ROC-AUC Score', value: '94.2%' },
      { label: 'Churn Prevented', value: '$420K Est.' },
      { label: 'Inference Latency', value: '< 28ms' },
      { label: 'Precision @ Top 20%', value: '88.6%' }
    ],
    tags: ['Python', 'XGBoost', 'Scikit-Learn', 'SHAP', 'Streamlit', 'FastAPI'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
    highlights: [
      'Engineered 32 behavioral metrics from raw transactional logs using Pandas & SQL',
      'Leveraged SHAP TreeExplainer for instantaneous feature-level explanation of individual predictions',
      'Designed automated alert thresholds triggering tailored retention campaigns for high-value cohorts',
      'Achieved 94.2% ROC-AUC, outperforming baseline Logistic Regression by +18.4%'
    ],
    architecture: 'PostgreSQL DB -> Feature Extraction Pipeline (Pandas) -> XGBoost Classifier with Bayesian Optimization -> SHAP Explainability Layer -> FastAPI REST Service',
    codeSnippet: {
      language: 'python',
      filename: 'churn_model_pipeline.py',
      code: `import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score

# 1. Feature Engineering
def build_features(raw_df: pd.DataFrame) -> pd.DataFrame:
    df = raw_df.copy()
    df['usage_drop_rate'] = (df['last_30d_usage'] - df['prev_30d_usage']) / (df['prev_30d_usage'] + 1e-5)
    df['support_ticket_density'] = df['ticket_count'] / (df['tenure_months'] + 1)
    df['is_autopay_enabled'] = (df['payment_method'] == 'credit_card').astype(int)
    return df

# 2. Optimized Model Training
clf = XGBClassifier(
    n_estimators=450,
    max_depth=5,
    learning_rate=0.025,
    subsample=0.85,
    colsample_bytree=0.8,
    scale_pos_weight=3.2, # Handle class imbalance
    random_state=42
)
clf.fit(X_train, y_train)
y_pred_proba = clf.predict_proba(X_test)[:, 1]
print(f"ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.4f}")`
    },
    demoType: 'churn-simulator'
  },
  {
    id: 'powerbi-ecommerce',
    title: 'E-Commerce Global Revenue & Supply Chain Suite',
    category: 'Power BI & BI',
    subtitle: 'Executive Business Intelligence platform with dynamic DAX modeling, cohort retention, & inventory forecasting',
    description: 'Engineered an enterprise Power BI analytics solution integrating sales across 4 geographic zones and 120,000+ orders. Designed a complete Star Schema data model with dedicated Date and Dimension tables to enable sub-second cross-filtering across product categories, return rates, and customer LTV cohorts.',
    metrics: [
      { label: 'Orders Processed', value: '120K+' },
      { label: 'DAX Measures', value: '45+ Custom' },
      { label: 'Query Refresh Time', value: '-65% Optimized' },
      { label: 'Gross Margin Accuracy', value: '99.8%' }
    ],
    tags: ['Power BI', 'DAX', 'SQL', 'Data Modeling', 'Star Schema', 'ETL'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
    highlights: [
      'Constructed a robust Star Schema with 3 Fact tables (Sales, Returns, Inventory) and 5 Dimension tables',
      'Implemented advanced Time Intelligence DAX measures (YoY Growth, MoM, Rolling 90-Day LTV, Customer Churn Rate)',
      'Built automated anomaly detection for sudden margin drops by product category',
      'Designed executive-level UI with custom KPI cards, dynamic drill-through pages, and dark glassmorphic themes'
    ],
    architecture: 'Raw SQL Warehouse -> Power Query M Transformations -> Star Schema Semantic Model -> Advanced DAX Calculations -> Interactive Power BI Dashboard',
    codeSnippet: {
      language: 'dax',
      filename: 'Customer_Cohort_LTV.dax',
      code: `// DAX Measure: Rolling 90-Day Customer LTV
Rolling_90D_Revenue = 
CALCULATE(
    [Total_Net_Revenue],
    DATESINPERIOD(
        'DimDate'[Date],
        MAX('DimDate'[Date]),
        -90,
        DAY
    )
)

// Customer Cohort Retention Rate %
Cohort_Retention_Rate = 
VAR InitialCohortSize = 
    CALCULATE(
        DISTINCTCOUNT('FactSales'[CustomerID]),
        ALLEXCEPT('DimCustomer', 'DimCustomer'[CohortMonth])
    )
VAR ActiveInPeriod = 
    DISTINCTCOUNT('FactSales'[CustomerID])
RETURN
    DIVIDE(ActiveInPeriod, InitialCohortSize, 0)`
    },
    demoType: 'powerbi-dashboard'
  },
  {
    id: 'sql-mart',
    title: 'Financial Transaction Analytics & Star Schema Data Mart',
    category: 'SQL & Analytics',
    subtitle: 'High-throughput SQL data warehouse pipeline with window functions and automated KPI rollup tables',
    description: 'Architected a scalable analytics data mart on PostgreSQL to parse 2.5 million transactional events. Optimized complex analytical queries utilizing partitioned tables, recursive CTEs, and materialized views to power real-time executive financial dashboards.',
    metrics: [
      { label: 'Records Analyzed', value: '2.5M+' },
      { label: 'Execution Speedup', value: '4.8x' },
      { label: 'Query Latency', value: '< 140ms' },
      { label: 'Automated Views', value: '18 Views' }
    ],
    tags: ['PostgreSQL', 'Advanced SQL', 'Data Mart', 'ETL', 'Indexing', 'Query Optimization'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
    highlights: [
      'Authored parameterized recursive CTEs to track hierarchical merchant network settlement flows',
      'Created materialized views with automated refresh schedules for daily aggregate P&L reporting',
      'Utilized B-Tree and BRIN composite indexing to reduce table scan IO by 78%',
      'Designed audit logging triggers ensuring 100% data lineage and regulatory compliance'
    ],
    architecture: 'Postgres OLTP DB -> Staging Layer -> Transformation Stored Procedures -> Star Schema Aggregates -> BI Data Mart',
    codeSnippet: {
      language: 'sql',
      filename: 'financial_mart_analytics.sql',
      code: `-- High-Performance Customer Financial Lifecycle Analysis
WITH MonthlyUserSpend AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', transaction_date) AS txn_month,
        COUNT(transaction_id) AS txn_count,
        SUM(amount) AS monthly_spend,
        AVG(amount) AS avg_ticket_size
    FROM fact_transactions
    WHERE status = 'SUCCESS'
    GROUP BY 1, 2
),
LtvCalculations AS (
    SELECT 
        user_id,
        txn_month,
        monthly_spend,
        SUM(monthly_spend) OVER (
            PARTITION BY user_id 
            ORDER BY txn_month 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cumulative_ltv,
        LAG(monthly_spend, 1, 0) OVER (
            PARTITION BY user_id 
            ORDER BY txn_month
        ) AS prev_month_spend
    FROM MonthlyUserSpend
)
SELECT 
    txn_month,
    COUNT(DISTINCT user_id) AS active_transacting_users,
    ROUND(AVG(monthly_spend), 2) AS avg_monthly_spend,
    ROUND(AVG(cumulative_ltv), 2) AS avg_customer_ltv,
    ROUND(SUM(CASE WHEN monthly_spend > prev_month_spend THEN 1 ELSE 0 END)::NUMERIC / COUNT(*) * 100, 2) AS user_expansion_rate_pct
FROM LtvCalculations
GROUP BY txn_month
ORDER BY txn_month DESC;`
    },
    demoType: 'sql-runner'
  },
  {
    id: 'fraud-detection',
    title: 'Real-time Credit Card Fraud Detection Engine',
    category: 'Machine Learning',
    subtitle: 'Extreme class imbalance handling with Isolation Forests & Random Forests achieving 98.7% Precision',
    description: 'Tackled extreme class imbalance (0.17% fraud rate) across 284,000 credit card records. Applied SMOTE-ENN hybrid sampling combined with cost-sensitive Random Forest classifiers and Isolation Forests to flag fraudulent attempts with minimal false alarms.',
    metrics: [
      { label: 'Recall on Fraud', value: '91.4%' },
      { label: 'Precision', value: '98.7%' },
      { label: 'False Positive Rate', value: '< 0.04%' },
      { label: 'Cost Savings', value: '$850K' }
    ],
    tags: ['Python', 'Random Forest', 'SMOTE', 'Imbalanced-Learn', 'Scikit-Learn', 'Matplotlib'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
    highlights: [
      'Implemented SMOTE-ENN hybrid over/under-sampling pipeline preventing synthetic noise generation',
      'Conducted PR-AUC threshold optimization to balance fraud capture vs user checkout friction',
      'Engineered geographic velocity and spending deviation score metrics',
      'Deployed containerized scoring endpoint delivering real-time predictions in under 15ms'
    ],
    architecture: 'Kafka Stream / Batch Ingest -> Feature Engineering Engine -> Ensemble ML Scorer -> Real-time Risk Gate',
    codeSnippet: {
      language: 'python',
      filename: 'fraud_detector.py',
      code: `from imblearn.combine import SMOTEENN
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, average_precision_score

# 1. Resampling Strategy for Extreme Imbalance
smote_enn = SMOTEENN(random_state=42)
X_resampled, y_resampled = smote_enn.fit_resample(X_train, y_train)

# 2. Cost-Sensitive Random Forest
rf_model = RandomForestClassifier(
    n_estimators=250,
    max_depth=12,
    class_weight={0: 1.0, 1: 15.0},
    n_jobs=-1,
    random_state=42
)
rf_model.fit(X_resampled, y_resampled)
y_probs = rf_model.predict_proba(X_test)[:, 1]
print(f"PR-AUC Score: {average_precision_score(y_test, y_probs):.4f}")`
    },
    demoType: 'fraud-detector'
  },
  {
    id: 'nlp-sentiment',
    title: 'Multi-Aspect Product Review Sentiment & Intelligence',
    category: 'Deep Learning & NLP',
    subtitle: 'Transformer-based aspect sentiment extraction and automated customer feedback summarization',
    description: 'Extracted fine-grained customer sentiment across 50,000+ consumer tech reviews. Used DistilBERT and spaCy dependency parsing to isolate specific product attributes (battery, build quality, customer support) and evaluate granular sentiment polarities.',
    metrics: [
      { label: 'F1-Score', value: '91.8%' },
      { label: 'Reviews Processed', value: '50K+' },
      { label: 'Aspects Extracted', value: '14 Categories' },
      { label: 'Inference Speed', value: '120 reviews/sec' }
    ],
    tags: ['NLP', 'Transformers', 'DistilBERT', 'spaCy', 'PyTorch', 'HuggingFace'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
    highlights: [
      'Fine-tuned DistilBERT on domain-specific e-commerce vocabulary with PyTorch',
      'Built automated topic clustering using TF-IDF and BERTopic for emergent feedback trends',
      'Generated actionable radar charts pinpointing recurring hardware failure complaints',
      'Integrated text preprocessing pipeline handling slang, emojis, and multiline reviews'
    ],
    architecture: 'Raw Review Corpus -> spaCy Aspect Tokenizer -> Fine-tuned DistilBERT -> Sentiment Aggregator -> Interactive Insights Dashboard',
    codeSnippet: {
      language: 'python',
      filename: 'nlp_aspect_sentiment.py',
      code: `import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=3)

def analyze_review_aspects(text: str, aspect: str):
    inputs = tokenizer(f"{aspect} [SEP] {text}", return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1).squeeze().tolist()
    labels = ["Negative", "Neutral", "Positive"]
    return {labels[i]: round(probs[i], 3) for i in range(3)}`
    },
    demoType: 'nlp-analyzer'
  }
];

export const EDUCATION_HISTORY: EducationItem[] = [
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Department of Computer Applications & Information Science',
    period: '2024 - 2027 (Degree Candidate)',
    gpa: '8.8 / 10.0 CGPA',
    status: 'In Progress • Graduating 2027',
    focus: [
      'Applied Data Science & Machine Learning',
      'Relational Databases & Data Warehousing',
      'Algorithm Design & Computational Mathematics',
      'Statistical Foundations & Probability'
    ],
    coursework: [
      'Data Structures & Algorithms in C/C++',
      'Database Management Systems & SQL',
      'Python for Scientific Computing',
      'Statistics, Probability & Discrete Mathematics',
      'Artificial Intelligence & Neural Networks',
      'Object-Oriented Programming & Web Technologies'
    ]
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Google (Coursera)',
    date: '2024',
    credentialId: 'GA-99482-DS',
    skills: ['Data Cleaning', 'SQL Analysis', 'R Programming', 'Tableau', 'Data Ethics'],
    verified: true
  },
  {
    name: 'IBM Data Science Specialization',
    issuer: 'IBM',
    date: '2024',
    credentialId: 'IBM-DS-7821',
    skills: ['Python', 'Scikit-Learn', 'Pandas', 'Data Mining', 'Machine Learning Models'],
    verified: true
  },
  {
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI & Stanford University',
    date: '2023',
    credentialId: 'DLAI-ML-4412',
    skills: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Cost Functions'],
    verified: true
  },
  {
    name: 'Microsoft Power BI Data Analyst Associate (PL-300 Coursework)',
    issuer: 'Microsoft Certified Training',
    date: '2023',
    credentialId: 'PL300-PREP-109',
    skills: ['DAX', 'Power Query M', 'Data Modeling', 'Star Schema', 'Row-Level Security'],
    verified: true
  }
];

export const RECRUITER_DATA = {
  summary: 'Ankit Patel is a high-achieving BCA student with hands-on mastery of Python, SQL, Power BI, and Machine Learning. He bridges the gap between raw database engineering and executive data storytelling, having built production-grade predictive models and multi-fact BI dashboards.',
  targetRoles: ['Data Scientist Intern', 'Junior Data Scientist', 'Business Intelligence Analyst', 'Data Analyst', 'Machine Learning Trainee'],
  keyStrengths: [
    'Strong SQL skills (Window functions, CTEs, performance tuning)',
    'Practical ML experience with real-world class imbalance and feature engineering',
    'Enterprise Power BI dashboard development with complex DAX measures',
    'Solid computational and algorithmic foundations from BCA curriculum',
    'Fast learner with proactive Git/CI/CD version control workflows'
  ],
  stats: [
    { title: 'Availability', value: 'Immediate / Summer Roles (2025-2027)' },
    { title: 'Preferred Work Type', value: 'Full-time / Internship / Remote or Hybrid' },
    { title: 'Location', value: 'Noida, India / Open to Relocation (Delhi NCR, Bangalore, Mumbai, Remote)' },
    { title: 'Notice Period', value: 'Ready to Join' }
  ]
};
