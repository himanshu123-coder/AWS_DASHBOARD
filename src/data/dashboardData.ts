export const stats = [
  {
    id: 1,
    title: 'Total Cloud Cost',
    value: '₹18,450',
    trend: '+8.2% from last month',
    trendUp: true,
    icon: 'DollarSign',
  },
  {
    id: 2,
    title: 'Running Instances',
    value: '8',
    trend: '2 idle instances detected',
    trendUp: false,
    icon: 'Server',
  },
  {
    id: 3,
    title: 'Average CPU Usage',
    value: '42%',
    trend: 'Normal performance',
    trendUp: true,
    icon: 'Cpu',
  },
  {
    id: 4,
    title: 'Website Uptime',
    value: '99.92%',
    trend: 'Last 30 days',
    trendUp: true,
    icon: 'Activity',
  },
  {
    id: 5,
    title: 'Error Rate',
    value: '0.84%',
    trend: 'Improved by 0.2%',
    trendUp: true,
    icon: 'AlertTriangle',
  },
  {
    id: 6,
    title: 'Est. Monthly Saving',
    value: '₹6,780',
    trend: 'AI optimization available',
    trendUp: true,
    icon: 'Sparkles',
  },
];

export const instances = [
  {
    id: 'i-0a12bc34d56ef7890',
    name: 'ecommerce-backend',
    type: 't3.medium',
    state: 'running',
    region: 'ap-south-1',
    cpu: 4,
    networkIn: '2.3 GB',
    networkOut: '5.8 GB',
    monthlyCost: '₹2,450',
    memory: '38%',
    storage: '42 GB',
    uptime: '14 days',
  },
  {
    id: 'i-1b23cd45e67f8901',
    name: 'api-gateway',
    type: 't3.large',
    state: 'running',
    region: 'ap-south-1',
    cpu: 67,
    networkIn: '12.4 GB',
    networkOut: '18.9 GB',
    monthlyCost: '₹4,850',
    memory: '72%',
    storage: '85 GB',
    uptime: '45 days',
  },
  {
    id: 'i-2c34de56f78g9012',
    name: 'database-primary',
    type: 'r5.xlarge',
    state: 'running',
    region: 'us-east-1',
    cpu: 45,
    networkIn: '8.7 GB',
    networkOut: '3.2 GB',
    monthlyCost: '₹8,200',
    memory: '58%',
    storage: '320 GB',
    uptime: '120 days',
  },
  {
    id: 'i-3d45ef67g89h0123',
    name: 'cache-server',
    type: 't3.small',
    state: 'idle',
    region: 'ap-south-1',
    cpu: 2,
    networkIn: '0.4 GB',
    networkOut: '0.2 GB',
    monthlyCost: '₹850',
    memory: '15%',
    storage: '12 GB',
    uptime: '30 days',
  },
  {
    id: 'i-4e56fg78h90i1234',
    name: 'dev-testing',
    type: 't3.micro',
    state: 'stopped',
    region: 'eu-west-1',
    cpu: 0,
    networkIn: '0 GB',
    networkOut: '0 GB',
    monthlyCost: '₹0',
    memory: '0%',
    storage: '8 GB',
    uptime: '0 days',
  },
  {
    id: 'i-5f67gh89i01j2345',
    name: 'batch-processor',
    type: 'c5.large',
    state: 'warning',
    region: 'ap-south-1',
    cpu: 92,
    networkIn: '45.6 GB',
    networkOut: '12.3 GB',
    monthlyCost: '₹3,650',
    memory: '89%',
    storage: '156 GB',
    uptime: '7 days',
  },
  {
    id: 'i-6g78hi90j12k3456',
    name: 'static-assets',
    type: 't3.nano',
    state: 'running',
    region: 'ap-southeast-1',
    cpu: 8,
    networkIn: '1.2 GB',
    networkOut: '8.9 GB',
    monthlyCost: '₹320',
    memory: '22%',
    storage: '5 GB',
    uptime: '180 days',
  },
  {
    id: 'i-7h89ij01k23l4567',
    name: 'monitoring-server',
    type: 't3.small',
    state: 'running',
    region: 'ap-south-1',
    cpu: 15,
    networkIn: '0.8 GB',
    networkOut: '0.5 GB',
    monthlyCost: '₹680',
    memory: '34%',
    storage: '20 GB',
    uptime: '90 days',
  },
];

export const cpuData = [
  { day: 'Mon', cpu: 38 },
  { day: 'Tue', cpu: 42 },
  { day: 'Wed', cpu: 35 },
  { day: 'Thu', cpu: 48 },
  { day: 'Fri', cpu: 52 },
  { day: 'Sat', cpu: 28 },
  { day: 'Sun', cpu: 35 },
];

export const networkData = [
  { day: 'Mon', networkIn: 12.4, networkOut: 8.2 },
  { day: 'Tue', networkIn: 15.8, networkOut: 10.5 },
  { day: 'Wed', networkIn: 11.2, networkOut: 7.8 },
  { day: 'Thu', networkIn: 18.5, networkOut: 12.4 },
  { day: 'Fri', networkIn: 22.1, networkOut: 15.6 },
  { day: 'Sat', networkIn: 8.4, networkOut: 5.2 },
  { day: 'Sun', networkIn: 9.8, networkOut: 6.1 },
];

export const costTrendData = [
  { day: 'Mon', ec2: 2450, rds: 1200, s3: 320 },
  { day: 'Tue', ec2: 2580, rds: 1200, s3: 340 },
  { day: 'Wed', ec2: 2420, rds: 1200, s3: 310 },
  { day: 'Thu', ec2: 2780, rds: 1250, s3: 380 },
  { day: 'Fri', ec2: 2890, rds: 1280, s3: 420 },
  { day: 'Sat', ec2: 2100, rds: 1200, s3: 290 },
  { day: 'Sun', ec2: 2250, rds: 1200, s3: 300 },
];

export const serviceCostData = [
  { name: 'EC2', value: 12450, color: '#6366f1' },
  { name: 'RDS', value: 4850, color: '#8b5cf6' },
  { name: 'S3', value: 1560, color: '#a78bfa' },
  { name: 'CloudFront', value: 890, color: '#c4b5fd' },
  { name: 'Lambda', value: 520, color: '#ddd6fe' },
];

export const websiteResponseData = [
  { day: 'Mon', responseTime: 245 },
  { day: 'Tue', responseTime: 312 },
  { day: 'Wed', responseTime: 268 },
  { day: 'Thu', responseTime: 398 },
  { day: 'Fri', responseTime: 284 },
  { day: 'Sat', responseTime: 198 },
  { day: 'Sun', responseTime: 224 },
];

export const slowEndpoints = [
  {
    endpoint: '/api/products',
    method: 'GET',
    responseTime: '840 ms',
    requests: '24,580',
    errorRate: '1.2%',
    status: 'slow',
  },
  {
    endpoint: '/api/orders',
    method: 'POST',
    responseTime: '620 ms',
    requests: '12,840',
    errorRate: '0.8%',
    status: 'normal',
  },
  {
    endpoint: '/api/search',
    method: 'GET',
    responseTime: '1240 ms',
    requests: '8,420',
    errorRate: '2.4%',
    status: 'critical',
  },
  {
    endpoint: '/api/users/profile',
    method: 'GET',
    responseTime: '380 ms',
    requests: '45,620',
    errorRate: '0.3%',
    status: 'normal',
  },
  {
    endpoint: '/api/checkout',
    method: 'POST',
    responseTime: '920 ms',
    requests: '6,840',
    errorRate: '1.8%',
    status: 'slow',
  },
];

export const incidents = [
  {
    id: 1,
    title: 'API latency spike detected',
    severity: 'high',
    time: '2 hours ago',
    status: 'active',
    description: 'API response time exceeded 2000ms threshold for multiple endpoints',
  },
  {
    id: 2,
    title: 'Website was unavailable for 2 minutes',
    severity: 'critical',
    time: '5 hours ago',
    status: 'resolved',
    description: 'DNS resolution failure caused temporary outage',
  },
  {
    id: 3,
    title: 'Database connection timeout',
    severity: 'medium',
    time: '1 day ago',
    status: 'resolved',
    description: 'RDS instance experienced connection pool exhaustion',
  },
  {
    id: 4,
    title: 'Error rate exceeded threshold',
    severity: 'high',
    time: '2 days ago',
    status: 'active',
    description: 'Error rate reached 5% for /api/search endpoint',
  },
];

export const recommendations = [
  {
    id: 1,
    title: 'Underutilized EC2 Instance Detected',
    description:
      'Instance ecommerce-backend has only 4% average CPU usage during the last 7 days. Consider resizing the instance from t3.medium to t3.small or schedule automatic stop time during non-working hours.',
    severity: 'low',
    estimatedSaving: '₹1,250/month',
    affectedService: 'EC2',
    confidence: 94,
    generatedTime: '2 hours ago',
    status: 'active',
  },
  {
    id: 2,
    title: 'High CPU Usage Warning',
    description:
      'Instance batch-processor is consistently using over 90% CPU. Consider upgrading to a larger instance type or implementing auto-scaling to handle the workload efficiently.',
    severity: 'high',
    estimatedSaving: '₹2,800/month',
    affectedService: 'EC2',
    confidence: 98,
    generatedTime: '4 hours ago',
    status: 'active',
  },
  {
    id: 3,
    title: 'Idle Instance Identified',
    description:
      'Instance cache-server has been idle for the past 72 hours with minimal network activity. Consider stopping this instance when not in use to reduce costs.',
    severity: 'medium',
    estimatedSaving: '₹850/month',
    affectedService: 'EC2',
    confidence: 96,
    generatedTime: '1 day ago',
    status: 'scheduled',
  },
  {
    id: 4,
    title: 'RDS Storage Optimization',
    description:
      'Database-primary has 40% unused storage allocated. Consider reducing storage allocation or enabling storage autoscaling to optimize costs.',
    severity: 'low',
    estimatedSaving: '₹1,420/month',
    affectedService: 'RDS',
    confidence: 88,
    generatedTime: '2 days ago',
    status: 'ignored',
  },
  {
    id: 5,
    title: 'Reserved Instance Recommendation',
    description:
      'Your api-gateway instance has been running for 45 days continuously. Purchasing a reserved instance could save up to 40% on monthly costs.',
    severity: 'medium',
    estimatedSaving: '₹1,940/month',
    affectedService: 'EC2',
    confidence: 92,
    generatedTime: '3 days ago',
    status: 'active',
  },
  {
    id: 6,
    title: 'Lambda Cold Start Optimization',
    description:
      'Your Lambda functions have high cold start times. Consider enabling provisioned concurrency for frequently invoked functions.',
    severity: 'low',
    estimatedSaving: '₹320/month',
    affectedService: 'Lambda',
    confidence: 85,
    generatedTime: '4 days ago',
    status: 'active',
  },
];

export const alerts = [
  {
    id: 1,
    title: 'CPU usage exceeded 80%',
    severity: 'warning',
    service: 'EC2',
    triggerTime: '15 minutes ago',
    description:
      'Instance batch-processor CPU usage reached 92% and continues to rise. Immediate attention may be required.',
    status: 'active',
  },
  {
    id: 2,
    title: 'Website down detected',
    severity: 'critical',
    service: 'CloudFront',
    triggerTime: '32 minutes ago',
    description:
      'Health check failed for primary website endpoint. Website may be unreachable for users.',
    status: 'active',
  },
  {
    id: 3,
    title: 'Cost budget exceeded 90%',
    severity: 'warning',
    service: 'Billing',
    triggerTime: '2 hours ago',
    description:
      'Monthly cloud spending has reached 90% of the allocated budget. Consider reviewing resource usage.',
    status: 'active',
  },
  {
    id: 4,
    title: 'High error rate detected',
    severity: 'warning',
    service: 'API Gateway',
    triggerTime: '4 hours ago',
    description:
      'Error rate for /api/search endpoint exceeded 2% threshold. Investigate potential issues.',
    status: 'resolved',
  },
  {
    id: 5,
    title: 'Database storage nearly full',
    severity: 'critical',
    service: 'RDS',
    triggerTime: '6 hours ago',
    description:
      'Database-primary storage utilization at 89%. Consider increasing storage or cleaning up old data.',
    status: 'resolved',
  },
  {
    id: 6,
    title: 'Slow API endpoint detected',
    severity: 'low',
    service: 'API Gateway',
    triggerTime: '1 day ago',
    description:
      '/api/search endpoint average response time is 1240ms. Consider optimizing database queries.',
    status: 'resolved',
  },
];

export const costOptimizationItems = [
  {
    id: 1,
    title: 'Stop unused EC2 instances',
    description:
      '2 instances have been stopped for more than 7 days. Consider terminating them if no longer needed.',
    estimatedSaving: '₹1,700/month',
    priority: 'high',
    icon: 'Power',
  },
  {
    id: 2,
    title: 'Resize underutilized instances',
    description:
      '3 instances are using less than 20% CPU on average. Downgrading could save significant costs.',
    estimatedSaving: '₹2,100/month',
    priority: 'medium',
    icon: 'Minimize2',
  },
  {
    id: 3,
    title: 'Move old logs to S3 Glacier',
    description:
      'Log files older than 30 days can be moved to Glacier for 80% cost reduction.',
    estimatedSaving: '₹890/month',
    priority: 'low',
    icon: 'Archive',
  },
  {
    id: 4,
    title: 'Delete unused EBS volumes',
    description:
      '4 unattached EBS volumes detected. Deleting them could reduce storage costs.',
    estimatedSaving: '₹580/month',
    priority: 'medium',
    icon: 'HardDrive',
  },
  {
    id: 5,
    title: 'Enable auto scaling',
    description:
      'Implement auto scaling for batch-processor to handle variable workloads efficiently.',
    estimatedSaving: '₹1,200/month',
    priority: 'high',
    icon: 'Maximize2',
  },
  {
    id: 6,
    title: 'Use reserved instances',
    description:
      'Purchase reserved instances for stable workloads to get up to 40% discount.',
    estimatedSaving: '₹3,200/month',
    priority: 'high',
    icon: 'Ticket',
  },
];

export const projects = [
  { id: 1, name: 'Ecommerce Production' },
  { id: 2, name: 'Portfolio Website' },
  { id: 3, name: 'SaaS Application' },
  { id: 4, name: 'Testing Environment' },
];

export const regions = [
  { id: 1, name: 'ap-south-1' },
  { id: 2, name: 'us-east-1' },
  { id: 3, name: 'eu-west-1' },
  { id: 4, name: 'ap-southeast-1' },
];

export const dateRanges = [
  { id: 1, name: 'Last 24 Hours' },
  { id: 2, name: 'Last 7 Days' },
  { id: 3, name: 'Last 30 Days' },
  { id: 4, name: 'Last 90 Days' },
];
