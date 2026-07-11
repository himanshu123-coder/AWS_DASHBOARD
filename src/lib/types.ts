export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  environment: string;
  cloudProvider: string;
  defaultRegion: string;
  status: string;
  createdAt: string;
}

export interface CloudInstance {
  _id: string;
  instanceId: string;
  name: string;
  instanceType: string;
  state: string;
  region: string;
  cpuUsage: number;
  memoryUsage: number;
  storageUsed: number;
  networkIn: number;
  networkOut: number;
  monthlyCost: number;
  uptime: number;
  tags?: Record<string, string>;
}

export interface Alert {
  _id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  resourceId?: string;
  resourceName?: string;
  metricValue?: number;
  threshold?: number;
  status: string;
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface Recommendation {
  _id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  savingEstimate: number;
  confidenceScore: number;
  reason?: string;
  resourceId?: string;
  resourceName?: string;
  status: string;
  appliedAt?: string | null;
  ignoredAt?: string | null;
  createdAt: string;
}

export interface CloudConnection {
  _id: string;
  accountId: string;
  roleArn: string;
  externalId: string;
  defaultRegion: string;
  monitoringInterval: number;
  enableCloudWatch: boolean;
  enableCostExplorer: boolean;
  lastTested?: string | null;
  connectionStatus: string;
}

export interface WebsiteConfig {
  _id: string;
  websiteName: string;
  websiteUrl: string;
  projectTrackingId: string;
  enableMonitoring: boolean;
  enableErrorTracking: boolean;
  checkInterval: number;
  alertThreshold: {
    responseTime: number;
    uptimeMin: number;
  };
}

export interface WebsiteConfigResponse {
  config: WebsiteConfig;
  trackingScript: string;
}

export interface WebsiteSummary {
  websiteName: string;
  websiteUrl: string;
  isUp: boolean;
  avgResponseTime: number;
  uptimePercentage: number;
  avgErrorRate: number;
  totalChecks: number;
  lastChecked: string;
  lastStatusCode: number;
}

export interface MetricsSummary {
  totalInstances: number;
  runningInstances: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  totalStorageUsed: number;
  totalMonthlyCost: number;
}

export interface CpuTrendPoint {
  timestamp: string;
  avg: number;
  max: number;
  min: number;
}

export interface NetworkTrendPoint {
  timestamp: string;
  value: number;
}

export interface NetworkTrend {
  networkIn: NetworkTrendPoint[];
  networkOut: NetworkTrendPoint[];
}

export interface CostTrendPoint {
  month: string;
  total: number;
}

export interface CostByServicePoint {
  service: string;
  total: number;
}

export interface CostByRegionPoint {
  region: string;
  total: number;
}

export interface CostPrediction {
  currentSpend: number;
  predictedMonthlySpend: number;
  budget: number;
  budgetUsedPercent: number;
  isOverBudget: boolean;
  projectedOverrun: number;
}

export interface ResponseTimeTrendPoint {
  timestamp: string;
  avg: number;
  max: number;
}

export interface UptimeTrendPoint {
  date: string;
  uptime: number;
  totalChecks: number;
}

export interface WebsiteMetric {
  _id: string;
  responseTime: number;
  statusCode: number;
  uptime: number;
  requestCount: number;
  errorRate: number;
  isUp: boolean;
  checkedAt: string;
}

export interface DashboardOverview {
  project: Project;
  projects: Project[];
  stats: {
    totalInstances: number;
    runningInstances: number;
    stoppedInstances: number;
    avgCpuUsage: number;
    avgMemoryUsage: number;
    currentMonthSpend: number;
    predictedMonthlySpend: number;
    budget: number;
    budgetUsedPercent: number;
    activeAlertCount: number;
    pendingRecommendationCount: number;
    websiteUp: boolean;
    avgResponseTime: number;
    websiteUptime: number;
  };
  charts: {
    cpuTrend: { time: string; value: number }[];
    costTrend: { month: string; total: number }[];
    uptimeTrend: { date: string; uptime: number }[];
  };
  recentAlerts: Alert[];
  recommendations: Recommendation[];
  lastUpdated: string;
}
