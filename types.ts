
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  DAILY_REPORTS = 'DAILY_REPORTS',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
  ISO_9001 = 'ISO_9001',
  AI_ASSISTANT = 'AI_ASSISTANT',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  VIDEO_LAB = 'VIDEO_LAB'
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
}

export interface DailyReport {
  id: string;
  projectId: string;
  date: string;
  activities: string;
  safetyObservations: string;
  images: string[];
}
