import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Clock,
  Globe,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { slowEndpoints, incidents } from '../data/dashboardData';
import { api, type ApiResponse } from '../lib/api';
import ChartCard from '../components/ChartCard';

interface WebsiteSummary {
  websiteName: string;
  websiteUrl: string;
  isUp: boolean;
  uptimePercentage: number;
  averageResponseTime: number;
  avgResponseTime: number;
  averageErrorRate: number;
  avgErrorRate: number;
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  lastChecked: string | null;
  lastStatusCode: number | null;
}

interface ResponseTimePoint {
  timestamp: string;
  average: number;
  avg: number;
  maximum: number;
  max: number;
}

interface UptimePoint {
  date: string;
  uptime: number;
  totalChecks: number;
  successfulChecks: number;
}

export default function WebsiteMonitoring() {
  const [summary, setSummary] = useState<WebsiteSummary | null>(null);
  const [responseTrend, setResponseTrend] = useState<ResponseTimePoint[]>([]);
  const [uptimeTrend, setUptimeTrend] = useState<UptimePoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const loadWebsiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [summaryResponse, responseTimeResponse, uptimeResponse] =
        await Promise.all([
          api.get<ApiResponse<WebsiteSummary>>(
            '/website-metrics/summary'
          ),

          api.get<ApiResponse<ResponseTimePoint[]>>(
            '/website-metrics/response-time-trend?hours=24'
          ),

          api.get<ApiResponse<UptimePoint[]>>(
            '/website-metrics/uptime-trend?days=7'
          ),
        ]);

      setSummary(summaryResponse.data);
      setResponseTrend(responseTimeResponse.data || []);
      setUptimeTrend(uptimeResponse.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Website monitoring data load nahi ho saka.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWebsiteData();
  }, [loadWebsiteData]);

  const runManualCheck = async () => {
    try {
      setChecking(true);
      setError('');

      await api.post('/website-metrics/check');

      await loadWebsiteData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Website health check failed.'
      );
    } finally {
      setChecking(false);
    }
  };

  const formattedResponseTrend = responseTrend.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    average: point.average ?? point.avg ?? 0,
    maximum: point.maximum ?? point.max ?? 0,
  }));

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      normal:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      slow:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      critical:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return badges[status] || badges.normal;
  };

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, string> = {
      critical:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high:
        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medium:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };

    return badges[severity] || badges.medium;
  };

  const getMethodBadge = (method: string) => {
    const badges: Record<string, string> = {
      GET:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      POST:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PUT:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      DELETE:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return badges[method] || badges.GET;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Website monitoring data load ho raha hai...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Website Monitoring
          </h1>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track website performance, uptime, and errors
          </p>

          {summary && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`rounded-full px-3 py-1 font-medium ${
                  summary.isUp
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {summary.isUp ? 'Online' : 'Offline'}
              </span>

              <span className="text-slate-500 dark:text-slate-400">
                {summary.websiteName}
              </span>

              <a
                href={summary.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {summary.websiteUrl}
              </a>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={checking}
          onClick={runManualCheck}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`}
          />

          {checking ? 'Checking...' : 'Run Health Check'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Uptime"
          value={`${summary?.uptimePercentage ?? 0}%`}
          icon={Activity}
          iconClass="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />

        <MetricCard
          title="Avg Response"
          value={`${summary?.averageResponseTime ?? 0} ms`}
          icon={Clock}
          iconClass="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />

        <MetricCard
          title="Total Checks"
          value={(summary?.totalChecks ?? 0).toLocaleString('en-IN')}
          icon={Globe}
          iconClass="bg-violet-100 dark:bg-violet-900/30"
          iconColor="text-violet-600 dark:text-violet-400"
        />

        <MetricCard
          title="Error Rate"
          value={`${summary?.averageErrorRate ?? 0}%`}
          icon={AlertTriangle}
          iconClass="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Response Time Trend">
          {formattedResponseTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedResponseTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="average"
                  name="Average"
                  unit=" ms"
                  stroke="#6366f1"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="maximum"
                  name="Maximum"
                  unit=" ms"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Response-time data available nahi hai." />
          )}
        </ChartCard>

        <ChartCard title="Uptime Trend">
          {uptimeTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uptimeTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />

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
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Uptime trend data available nahi hai." />
          )}
        </ChartCard>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Slow Endpoints
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                {[
                  'Endpoint',
                  'Method',
                  'Avg Response',
                  'Requests',
                  'Error Rate',
                  'Status',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {slowEndpoints.map((endpoint, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 font-mono text-sm font-medium text-slate-800 dark:text-white">
                    {endpoint.endpoint}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getMethodBadge(
                        endpoint.method
                      )}`}
                    >
                      {endpoint.method}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                    {endpoint.responseTime}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                    {endpoint.requests}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                    {endpoint.errorRate}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                        endpoint.status
                      )}`}
                    >
                      {endpoint.status.charAt(0).toUpperCase() +
                        endpoint.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
          Recent Incidents
        </h2>

        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-start justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-800 dark:text-white">
                    {incident.title}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityBadge(
                      incident.severity
                    )}`}
                  >
                    {incident.severity.charAt(0).toUpperCase() +
                      incident.severity.slice(1)}
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      incident.status === 'resolved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {incident.status.charAt(0).toUpperCase() +
                      incident.status.slice(1)}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {incident.description}
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {incident.time}
                </p>
              </div>

              {incident.status === 'active' && (
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                >
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  iconColor: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconClass,
  iconColor,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}