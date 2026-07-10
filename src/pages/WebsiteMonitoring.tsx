import { Activity, Clock, Globe, AlertTriangle } from 'lucide-react';
import { slowEndpoints, incidents } from '../data/dashboardData';

export default function WebsiteMonitoring() {
  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      normal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      slow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return badges[status] || badges.normal;
  };

  const getSeverityBadge = (severity: string) => {
    const badges: { [key: string]: string } = {
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return badges[severity] || badges.medium;
  };

  const getMethodBadge = (method: string) => {
    const badges: { [key: string]: string } = {
      GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return badges[method] || badges.GET;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Website Monitoring
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track website performance, uptime, and errors
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Uptime</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">99.92%</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Response</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">284 ms</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Globe className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Requests</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">1,24,580</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Error Rate</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">0.84%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Slow Endpoints
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Endpoint
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Avg Response
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Requests
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Error Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {slowEndpoints.map((endpoint, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white font-mono">
                    {endpoint.endpoint}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getMethodBadge(
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
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        endpoint.status
                      )}`}
                    >
                      {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Recent Incidents
        </h2>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-800 dark:text-white">
                    {incident.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityBadge(
                      incident.severity
                    )}`}
                  >
                    {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      incident.status === 'resolved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {incident.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {incident.time}
                </p>
              </div>
              {incident.status === 'active' && (
                <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
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
