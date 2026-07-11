import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { Alert as AlertType } from '../lib/types';

interface AlertListProps {
  alerts: AlertType[];
  onResolve: (id: string) => void;
}

export default function AlertList({ alerts, onResolve }: AlertListProps) {
  const getSeverityIcon = (severity: string) => {
    if (severity === 'critical')
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (severity === 'high')
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    if (severity === 'medium')
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <AlertTriangle className="w-5 h-5 text-blue-500" />;
  };

  const getSeverityBadge = (severity: string) => {
    const badges: { [key: string]: string } = {
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return badges[severity] || badges.low;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                {getSeverityIcon(alert.severity)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {alert.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {alert.message}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(alert.createdAt)}
                  </span>
                  {alert.resourceName && <span>{alert.resourceName}</span>}
                  {alert.metricValue != null && (
                    <span>
                      Value: {alert.metricValue}
                      {alert.threshold != null && ` / Threshold: ${alert.threshold}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {(alert.status === 'active' || alert.status === 'acknowledged') && (
              <button
                onClick={() => onResolve(alert._id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors whitespace-nowrap"
              >
                <CheckCircle className="w-4 h-4" />
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No alerts to display</p>
        </div>
      )}
    </div>
  );
}
