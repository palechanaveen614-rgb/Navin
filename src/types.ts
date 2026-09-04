export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type AIEngine = 'ensemble' | 'google' | 'lovable' | 'replit';

export type NavTab = 'dashboard' | 'projects' | 'build' | 'review' | 'templates' | 'deploy' | 'history' | 'settings';

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  thoughtSteps?: string[];
  filesCreated?: string[];
  qualityScore?: number;
  previewReady?: boolean;
}

export interface ReviewMetric {
  performance: number;
  accessibility: number;
  seo: number;
  codeQuality: number;
  security?: number;
}

export interface ClientReview {
  id: string;
  projectName: string;
  clientName: string;
  rating: number;
  avatar?: string;
  comment: string;
  createdAt: string;
  status?: string;
  scoreMetrics?: ReviewMetric;
}

export interface Deployment {
  id: string;
  projectName: string;
  subdomain: string;
  fullUrl: string;
  liveUrl?: string;
  status: 'live' | 'building' | 'offline';
  deployedAt: string;
  region: string;
  ssl: string;
  visitors: number;
  latency: string;
  previewHtml?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'agent' | 'review' | 'deploy' | 'system';
  timestamp: string;
  read: boolean;
  url?: string;
}

export interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  code: string;
  files: Record<string, string>;
  qualityScore: number;
  reviewDetails?: {
    overallScore: number;
    metrics: ReviewMetric;
    highlights: string[];
    fixesApplied: string[];
  };
  agentThought?: string[];
  deployedUrl?: string | null;
}
