import { User, Project, Task, Document, ActivityLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-0',
    name: 'Super Admin DOKU',
    email: 'superadmin@doku.com',
    password: 'superadmin123',
    role: 'admin',
    department: 'Executive Management',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    title: 'Super Administrator'
  },
  {
    id: 'usr-5',
    name: 'Andi Wijaya',
    email: 'admin@doku.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    title: 'VP of Technology (Admin)'
  },
  {
    id: 'usr-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@doku.com',
    password: 'budi123',
    role: 'project_manager',
    department: 'Product & Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Lead Project Manager'
  },
  {
    id: 'usr-2',
    name: 'Siti Rahma',
    email: 'siti.rahma@doku.com',
    password: 'siti123',
    role: 'designer',
    department: 'UI/UX Design',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    title: 'Senior Product Designer'
  },
  {
    id: 'usr-3',
    name: 'Rian Hidayat',
    email: 'rian.hidayat@doku.com',
    password: 'rian123',
    role: 'developer',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Fullstack Engineer'
  },
  {
    id: 'usr-4',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@doku.com',
    password: 'dewi123',
    role: 'qa',
    department: 'Quality Assurance',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    title: 'QA Automation Lead'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    name: 'E-Commerce Platform Redesign',
    code: 'REC',
    icon: '🛒',
    color: 'bg-blue-500',
    description: 'UI/UX overhaul and checkout flow optimization for the online store platform integrated with the new Payment Gateway.',
    status: 'active',
    leadId: 'usr-1',
    leadName: 'Budi Santoso',
    memberIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4'],
    category: 'Product Development',
    startDate: '2026-07-01',
    targetEndDate: '2026-08-30',
    budget: 120000000,
    progress: 68,
    milestones: [
      { id: 'm1', title: 'Wireframe & Prototype Phase', dueDate: '2026-07-15', completed: true },
      { id: 'm2', title: 'React Frontend Development', dueDate: '2026-08-05', completed: true },
      { id: 'm3', title: 'QA Testing & Staging', dueDate: '2026-08-20', completed: false },
      { id: 'm4', title: 'Production Launch', dueDate: '2026-08-30', completed: false }
    ],
    createdAt: '2026-06-25'
  },
  {
    id: 'prj-2',
    name: 'AI Recommendation Engine Integration',
    code: 'AIR',
    icon: '🤖',
    color: 'bg-purple-500',
    description: 'Machine learning-based product recommendation system to increase conversion rate and Average Order Value (AOV).',
    status: 'active',
    leadId: 'usr-3',
    leadName: 'Rian Hidayat',
    memberIds: ['usr-1', 'usr-3'],
    category: 'AI & Data Tech',
    startDate: '2026-07-10',
    targetEndDate: '2026-09-15',
    budget: 85000000,
    progress: 45,
    milestones: [
      { id: 'm21', title: 'Data Cleaning & Preprocessing', dueDate: '2026-07-25', completed: true },
      { id: 'm22', title: 'Model Training & Validation', dueDate: '2026-08-15', completed: false },
      { id: 'm23', title: 'API Endpoint Deployment', dueDate: '2026-09-01', completed: false }
    ],
    createdAt: '2026-07-01'
  },
  {
    id: 'prj-3',
    name: 'Mobile App iOS & Android v2.0',
    code: 'MAP',
    icon: '📱',
    color: 'bg-emerald-500',
    description: 'Rebuilding native mobile applications using React Native with biometrics & push notifications.',
    status: 'planning',
    leadId: 'usr-1',
    leadName: 'Budi Santoso',
    memberIds: ['usr-2', 'usr-3', 'usr-4'],
    category: 'Mobile Application',
    startDate: '2026-08-10',
    targetEndDate: '2026-11-01',
    budget: 150000000,
    progress: 15,
    milestones: [
      { id: 'm31', title: 'Mobile Architecture & DB Sync', dueDate: '2026-08-25', completed: false },
      { id: 'm32', title: 'Authentication & Security Features', dueDate: '2026-09-15', completed: false }
    ],
    createdAt: '2026-07-20'
  },
  {
    id: 'prj-4',
    name: 'AWS Cloud Infrastructure Migration',
    code: 'AWS',
    icon: '☁️',
    color: 'bg-amber-500',
    description: 'Migrating legacy monolith backend server to Kubernetes & microservices architecture on AWS Cloud.',
    status: 'completed',
    leadId: 'usr-5',
    leadName: 'Andi Wijaya',
    memberIds: ['usr-3', 'usr-5'],
    category: 'Infrastructure',
    startDate: '2026-05-01',
    targetEndDate: '2026-07-20',
    budget: 95000000,
    progress: 100,
    milestones: [
      { id: 'm41', title: 'Legacy Infrastructure Audit', dueDate: '2026-05-15', completed: true },
      { id: 'm42', title: 'EKS Cluster Setup', dueDate: '2026-06-10', completed: true },
      { id: 'm43', title: 'Data Migration & Switchover', dueDate: '2026-07-15', completed: true }
    ],
    createdAt: '2026-04-28'
  },
  {
    id: 'prj-5',
    name: 'Security Audit & Penetration Testing',
    code: 'SEC',
    icon: '🛡️',
    color: 'bg-rose-500',
    description: 'Comprehensive security testing covering OWASP Top 10, API vulnerability scan, and ISO27001 compliance.',
    status: 'on_hold',
    leadId: 'usr-4',
    leadName: 'Dewi Lestari',
    memberIds: ['usr-4', 'usr-5'],
    category: 'Cyber Security',
    startDate: '2026-07-15',
    targetEndDate: '2026-08-25',
    budget: 45000000,
    progress: 30,
    milestones: [
      { id: 'm51', title: 'Static & Dynamic Code Analysis', dueDate: '2026-07-30', completed: true },
      { id: 'm52', title: 'Remediation Fixes', dueDate: '2026-08-15', completed: false }
    ],
    createdAt: '2026-07-10'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-101',
    title: 'Design New Checkout Page Wireframe',
    description: 'Create a concise 3-step checkout flow to reduce cart abandonment. Ensure support for QRIS and Virtual Account payments.',
    projectId: 'prj-1',
    projectName: 'E-Commerce Platform Redesign',
    status: 'done',
    priority: 'high',
    assigneeId: 'usr-2',
    assigneeName: 'Siti Rahma',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-07-15',
    startDate: '2026-07-02',
    tags: ['UI/UX', 'Figma', 'Design System'],
    estimatedHours: 24,
    actualHours: 22,
    subtasks: [
      { id: 'sub-1', title: 'Benchmark checkout flows on leading e-commerce apps', completed: true },
      { id: 'sub-2', title: 'Create low-fidelity Figma mockups', completed: true },
      { id: 'sub-3', title: 'Review with Product Manager', completed: true }
    ],
    comments: [
      {
        id: 'c1',
        authorId: 'usr-1',
        authorName: 'Budi Santoso',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        content: 'The layout looks very clean! QRIS option should be prioritized at the top.',
        createdAt: '2026-07-14T10:30:00Z'
      }
    ],
    createdAt: '2026-07-01',
    updatedAt: '2026-07-15'
  },
  {
    id: 'tsk-102',
    title: 'Integrate DOKU Payment Gateway API',
    description: 'Implement payment gateway callback webhook, HMAC-SHA256 signature verification, and refund status handling.',
    projectId: 'prj-1',
    projectName: 'E-Commerce Platform Redesign',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'usr-3',
    assigneeName: 'Rian Hidayat',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-05',
    startDate: '2026-08-01',
    tags: ['Backend', 'API', 'Security'],
    estimatedHours: 40,
    actualHours: 28,
    subtasks: [
      { id: 'sub-10', title: 'Setup Payment Sandbox Environment', completed: true },
      { id: 'sub-11', title: 'Create /api/payment/notification endpoint', completed: true },
      { id: 'sub-12', title: 'Test timeout handling and retry policy', completed: false }
    ],
    comments: [],
    createdAt: '2026-07-25',
    updatedAt: '2026-08-04'
  },
  {
    id: 'tsk-103',
    title: 'Automated Test Flow for Checkout & Cart',
    description: 'Run Cypress / Playwright scripts to ensure promo codes and checkout flow execute without regression bugs.',
    projectId: 'prj-1',
    projectName: 'E-Commerce Platform Redesign',
    status: 'in_review',
    priority: 'medium',
    assigneeId: 'usr-4',
    assigneeName: 'Dewi Lestari',
    assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-04',
    startDate: '2026-08-02',
    tags: ['QA', 'Automation', 'Cypress'],
    estimatedHours: 18,
    actualHours: 15,
    subtasks: [
      { id: 'sub-20', title: 'E2E login & add items to cart script', completed: true },
      { id: 'sub-21', title: 'Simulate failed payment scenarios', completed: true }
    ],
    comments: [],
    createdAt: '2026-08-01',
    updatedAt: '2026-08-04'
  },
  {
    id: 'tsk-104',
    title: 'Web Loading Speed & Image Compression Optimization',
    description: 'Convert banner images to WebP format, enable lazy loading, and configure Nginx Caching Headers.',
    projectId: 'prj-1',
    projectName: 'E-Commerce Platform Redesign',
    status: 'todo',
    priority: 'low',
    assigneeId: 'usr-3',
    assigneeName: 'Rian Hidayat',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-18',
    tags: ['Frontend', 'Performance'],
    estimatedHours: 12,
    subtasks: [
      { id: 'sub-30', title: 'Audit current Lighthouse performance score', completed: false }
    ],
    comments: [],
    createdAt: '2026-08-02',
    updatedAt: '2026-08-02'
  },
  {
    id: 'tsk-201',
    title: 'Train Collaborative Filtering Recommendation Model',
    description: 'Train PyTorch model using transaction history dataset from the past 6 months.',
    projectId: 'prj-2',
    projectName: 'AI Recommendation Engine Integration',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'usr-3',
    assigneeName: 'Rian Hidayat',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-15',
    startDate: '2026-07-20',
    tags: ['AI/ML', 'Python', 'PyTorch'],
    estimatedHours: 50,
    actualHours: 35,
    subtasks: [
      { id: 'sub-40', title: 'Feature engineering for category correlation', completed: true },
      { id: 'sub-41', title: 'Hyperparameter tuning & evaluation', completed: false }
    ],
    comments: [],
    createdAt: '2026-07-15',
    updatedAt: '2026-08-03'
  },
  {
    id: 'tsk-202',
    title: 'Design Homepage Recommendation Card Component',
    description: 'Create a responsive "Special Recommendations For You" slider component for desktop & mobile.',
    projectId: 'prj-2',
    projectName: 'AI Recommendation Engine Integration',
    status: 'done',
    priority: 'medium',
    assigneeId: 'usr-2',
    assigneeName: 'Siti Rahma',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-01',
    tags: ['UI/UX', 'React'],
    estimatedHours: 16,
    actualHours: 14,
    subtasks: [
      { id: 'sub-50', title: 'Promo badge & discount price card variants', completed: true }
    ],
    comments: [],
    createdAt: '2026-07-18',
    updatedAt: '2026-08-01'
  },
  {
    id: 'tsk-301',
    title: 'UI System & Color Tokens for Mobile App v2',
    description: 'Structure Figma color tokens, typography scale, and button component states for iOS & Android.',
    projectId: 'prj-3',
    projectName: 'Mobile App iOS & Android v2.0',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'usr-2',
    assigneeName: 'Siti Rahma',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-20',
    tags: ['Design System', 'Figma'],
    estimatedHours: 30,
    subtasks: [
      { id: 'sub-60', title: 'Dark mode palette definition', completed: true },
      { id: 'sub-61', title: 'Export JSON tokens for React Native', completed: false }
    ],
    comments: [],
    createdAt: '2026-07-22',
    updatedAt: '2026-08-02'
  },
  {
    id: 'tsk-302',
    title: 'Setup React Native Expo & CI/CD Environment',
    description: 'Configure Fastlane and GitHub Actions for auto-building .apk and iOS TestFlight.',
    projectId: 'prj-3',
    projectName: 'Mobile App iOS & Android v2.0',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'usr-3',
    assigneeName: 'Rian Hidayat',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-08-28',
    tags: ['DevOps', 'React Native'],
    estimatedHours: 20,
    subtasks: [],
    comments: [],
    createdAt: '2026-07-25',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-401',
    title: 'Decommission Legacy On-Premise Servers',
    description: 'Verify no incoming traffic on old IP addresses and revoke legacy VM licenses.',
    projectId: 'prj-4',
    projectName: 'AWS Cloud Infrastructure Migration',
    status: 'done',
    priority: 'high',
    assigneeId: 'usr-5',
    assigneeName: 'Andi Wijaya',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-07-20',
    tags: ['AWS', 'DevOps'],
    estimatedHours: 8,
    actualHours: 8,
    subtasks: [
      { id: 'sub-70', title: 'Final database dump backup', completed: true }
    ],
    comments: [],
    createdAt: '2026-07-10',
    updatedAt: '2026-07-20'
  },
  {
    id: 'tsk-501',
    title: 'Penetration Testing on API Authentication Endpoints',
    description: 'Perform fuzzing on JWT tokens, refresh token rotation, and per-IP rate limiting.',
    projectId: 'prj-5',
    projectName: 'Security Audit & Penetration Testing',
    status: 'done',
    priority: 'urgent',
    assigneeId: 'usr-4',
    assigneeName: 'Dewi Lestari',
    assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    dueDate: '2026-07-30',
    tags: ['Security', 'Audit'],
    estimatedHours: 24,
    actualHours: 20,
    subtasks: [
      { id: 'sub-80', title: 'SQL Injection & XSS vulnerability testing', completed: true },
      { id: 'sub-81', title: 'High-severity findings report', completed: true }
    ],
    comments: [],
    createdAt: '2026-07-15',
    updatedAt: '2026-07-30'
  }
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Product Requirement Document (PRD) - Checkout Redesign',
    icon: '📄',
    content: `# PRD: E-Commerce Checkout Redesign

## 1. Project Goal
Increase conversion rate by **18%** in Q3 by simplifying the checkout flow from 5 steps down to 3 steps.

## 2. Target Audience
Mobile and web online store users who frequently complete transactions via e-wallet and QRIS.

## 3. Key Features
- **One-Click Payment Selection**: Saved user's last preferred payment method.
- **Auto-Fill Address**: Postal API integration for automatic sub-district & zip code lookup.
- **Automatic Coupon Application**: Display the best available promo code automatically without manual input.

## 4. Success Metrics
- Average checkout duration reduced from 120 seconds down to **45 seconds**.
- Cart Abandonment rate decreased by **15%**.`,
    projectId: 'prj-1',
    authorId: 'usr-1',
    authorName: 'Budi Santoso',
    tags: ['PRD', 'Checkout', 'Requirement'],
    updatedAt: '2026-07-10'
  },
  {
    id: 'doc-2',
    title: 'Standard Operating Procedure (SOP) QA Testing Guide',
    icon: '📋',
    content: `# SOP Quality Assurance & Release Gatekeeper

## 1. Testing Phases
Every new feature must pass at least 3 testing layers prior to merging into \`main\`:
1. **Unit Test**: Code coverage at minimum 80%.
2. **Integration Test**: API mock server verification.
3. **End-to-End Test (E2E)**: Cypress suite execution on staging.

## 2. Bug Severity Guidelines
- **Blocker (P0)**: System crash or payment failure. Immediate release rollback.
- **Critical (P1)**: Broken layout on mobile screens. Max 24h resolution window.
- **Minor (P2)**: Text typo or minor alignment flaw.`,
    projectId: 'prj-1',
    authorId: 'usr-4',
    authorName: 'Dewi Lestari',
    tags: ['SOP', 'QA', 'Guidelines'],
    updatedAt: '2026-07-28'
  },
  {
    id: 'doc-3',
    title: 'AI Recommendation Engine Pipeline Architecture',
    icon: '💡',
    content: `# AI Recommendation Architecture

## Data Ingestion
Click, add-to-cart, and purchase events are streamed in real time via Apache Kafka to the ClickHouse Data Warehouse.

## Model Training Schedule
- **Batch Training**: Triggered every night at 01:00 AM on AWS GPU g4dn instances.
- **Real-time Inference**: Serving API powered by FastAPI + Redis Cache for < 30ms response times.`,
    projectId: 'prj-2',
    authorId: 'usr-3',
    authorName: 'Rian Hidayat',
    tags: ['Architecture', 'AI', 'Specs'],
    updatedAt: '2026-07-16'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    user: 'Rian Hidayat',
    action: 'updated task status',
    target: 'DOKU Payment Gateway API Integration → In Progress',
    timestamp: '10 mins ago'
  },
  {
    id: 'act-2',
    user: 'Siti Rahma',
    action: 'completed task',
    target: 'Design New Checkout Page Wireframe',
    timestamp: '2 hours ago'
  },
  {
    id: 'act-3',
    user: 'Budi Santoso',
    action: 'added a comment on',
    target: 'Design New Checkout Page Wireframe',
    timestamp: 'Yesterday, 16:45'
  },
  {
    id: 'act-4',
    user: 'Dewi Lestari',
    action: 'created a new task',
    target: 'Automated Test Flow for Checkout & Cart',
    timestamp: 'Yesterday, 11:20'
  },
  {
    id: 'act-5',
    user: 'Andi Wijaya',
    action: 'completed project',
    target: 'AWS Cloud Infrastructure Migration',
    timestamp: '3 days ago'
  }
];
