import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';

import { api, type ApiResponse } from '../lib/api';

import {
  stats as dummyStats,
  networkData,
  serviceCostData,
  websiteResponseData,
} from '../data/dashboardData';

interface DashboardStats {
  totalCloudCost: number;
  currentMonthSpend: number;
  predictedMonthlySpend: number;
  monthlyBudget: number;
  budgetUsedPercent: number;

  totalInstances: number;
  runningInstances: number;
  stoppedInstances: number;
  idleInstances: number;
  warningInstances: number;

  averageCpuUsage: number;
  avgCpuUsage: number;
  averageMemoryUsage: number;
  avgMemoryUsage: number;

  websiteUp: boolean;
  websiteUptime: number;

  averageResponseTime: number;
  avgResponseTime: number;
  errorRate: number;

  activeAlertCount: number;
  pendingRecommendationCount: number;
  estimatedMonthlySaving: number;
}

interface CpuTrendPoint {
  time: string;
  value: number;
}

interface CostTrendPoint {
  month: string;
  total: number;
}

interface UptimeTrendPoint {
  date: string;
  uptime: number;
}

interface DashboardOverviewData {
  workspace: {
    id: string;
    name: string;
    environment: string;
    cloudProvider: string;
    defaultRegion: string;
    status: string;
  };

  stats: DashboardStats;

  charts: {
    cpuTrend: CpuTrendPoint[];
    costTrend: CostTrendPoint[];
    uptimeTrend: UptimeTrendPoint[];
  };

  recentAlerts: unknown[];
  recommendations: unknown[];
  lastUpdated: string;
}

export default function Overview() {
  const [dashboard, setDashboard] =
    useState<DashboardOverviewData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await api.get<
        ApiResponse<DashboardOverviewData>
      >('/dashboard/overview');

      setDashboard(response.data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Dashboard data load nahi ho saka.';

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const overviewStats = useMemo(() => {
    if (!dashboard) {
      return dummyStats;
    }

    const values: Record<string, string> = {
  'Total Cloud Cost': `₹${dashboard.stats.totalCloudCost.toLocaleString('en-IN')}`,

  'Running Instances': dashboard.stats.runningInstances.toString(),

  'Average CPU Usage': `${dashboard.stats.averageCpuUsage}%`,

  'Website Uptime': `${dashboard.stats.websiteUptime}%`,

  'Error Rate': `${dashboard.stats.errorRate}%`,

  'Estimated Monthly Saving': `₹${dashboard.stats.estimatedMonthlySaving.toLocaleString(
    'en-IN'
  )}`,

  'Est. Monthly Saving': `₹${dashboard.stats.estimatedMonthlySaving.toLocaleString(
    'en-IN'
  )}`,
};

    const descriptions: Record<string, string> = {
  'Total Cloud Cost': `Predicted ₹${dashboard.stats.predictedMonthlySpend.toLocaleString(
    'en-IN'
  )}`,

  'Running Instances': `${dashboard.stats.idleInstances} idle instance(s)`,

  'Average CPU Usage': `${dashboard.stats.averageMemoryUsage}% average memory`,

  'Website Uptime': dashboard.stats.websiteUp
    ? 'Website is currently online'
    : 'Website is currently offline',

  'Error Rate': `${dashboard.stats.activeAlertCount} active alert(s)`,

  'Estimated Monthly Saving':
    `${dashboard.stats.pendingRecommendationCount} recommendation(s)`,

  'Est. Monthly Saving':
    `${dashboard.stats.pendingRecommendationCount} recommendation(s)`,
};

    return dummyStats.map((stat) => ({
      ...stat,
      value: values[stat.title] ?? stat.value,
      trend: descriptions[stat.title] ?? stat.trend,
    }));
  }, [dashboard]);

  const cpuChartData = useMemo(() => {
    if (!dashboard?.charts.cpuTrend.length) {
      return [];
    }

    return dashboard.charts.cpuTrend.map((point) => ({
      time: new Date(point.time).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      cpu: point.value,
    }));
  }, [dashboard]);

  const costChartData = useMemo(() => {
    if (!dashboard?.charts.costTrend.length) {
      return [];
    }

    return dashboard.charts.costTrend.map((point) => ({
      month: point.month,
      total: point.total,
    }));
  }, [dashboard]);

  const uptimeChartData = useMemo(() => {
    if (!dashboard?.charts.uptimeTrend.length) {
      return [];
    }

    return dashboard.charts.uptimeTrend;
  }, [dashboard]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Dashboard data load ho raha hai...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Dashboard load nahi hua
        </h2>

        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadDashboard()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-linear-to-r from-indigo-500 via-blue-500 to-violet-500 p-8 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              AI-Powered Cloud & Website Monitoring Dashboard
            </h1>

            <p className="mt-3 max-w-3xl text-white/80">
              Monitor cloud infrastructure, website performance,
              costs, alerts, and AI optimization recommendations in
              one place.
            </p>

            {dashboard?.workspace && (
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-white/15 px-3 py-1">
                  {dashboard.workspace.name}
                </span>

                <span className="rounded-full bg-white/15 px-3 py-1">
                  {dashboard.workspace.defaultRegion}
                </span>

                <span className="rounded-full bg-white/15 px-3 py-1">
                  {dashboard.workspace.environment}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <button
              type="button"
              disabled={refreshing}
              onClick={() => loadDashboard(true)}
              className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

            {dashboard?.lastUpdated && (
              <p className="text-xs text-white/70">
                Last updated:{' '}
                {new Date(
                  dashboard.lastUpdated
                ).toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {overviewStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="CPU Usage Trend">
          {cpuChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cpuChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="cpu"
                  name="CPU Usage"
                  unit="%"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{
                    fill: '#6366f1',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="CPU metric data available nahi hai." />
          )}
        </ChartCard>

        <ChartCard title="Network Usage">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={networkData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />

              <Area
                type="monotone"
                dataKey="networkIn"
                stackId="1"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
              />

              <Area
                type="monotone"
                dataKey="networkOut"
                stackId="2"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />

              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Cloud Cost Trend">
          {costChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString('en-IN')}`,
                    'Total Cost',
                  ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />

                <Legend />

                <Bar
                  dataKey="total"
                  fill="#6366f1"
                  name="Total Cloud Cost"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Cost record available nahi hai." />
          )}
        </ChartCard>

        <ChartCard title="Service-Wise Cost">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceCostData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceCostData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Website Uptime Trend">
          {uptimeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uptimeChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="uptime"
                  name="Uptime"
                  unit="%"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    fill: '#10b981',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Website uptime data available nahi hai." />
          )}
        </ChartCard>

        <ChartCard title="Website Response Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={websiteResponseData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />

              <Line
                type="monotone"
                dataKey="responseTime"
                name="Response Time"
                unit=" ms"
                stroke="#10b981"
                strokeWidth={3}
                dot={{
                  fill: '#10b981',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-75 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}