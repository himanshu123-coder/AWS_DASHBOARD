import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import AlertList from '../components/AlertList';
import { api } from '../lib/api';
import type { ApiResponse } from '../lib/api';
import type { Alert as AlertType } from '../lib/types';

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projectId = localStorage.getItem('selectedProjectId');

  // =========================
  // FETCH ALERTS
  // =========================
  const fetchAlerts = async () => {
    if (!projectId) {
      setError('No project selected.');
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const result = await api.get<ApiResponse<AlertType[]>>(
        `/projects/${projectId}/alerts`
      );

      setAlerts(result.data || []);
    } catch (err) {
      console.error('Fetch alerts error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch alerts'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchAlerts();
  }, [projectId]);

  // =========================
  // RESOLVE ALERT
  // =========================
  const handleResolve = async (id: string) => {
    if (!projectId) {
      setError('No project selected.');
      return;
    }

    try {
      setActionLoading(id);

      const result = await api.put<ApiResponse<AlertType>>(
        `/projects/${projectId}/alerts/${id}/resolve`
      );

      const updatedAlert = result.data;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === id ? updatedAlert : alert
        )
      );
    } catch (err) {
      console.error('Resolve alert error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to resolve alert'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
  };

  // =========================
  // FILTER
  // =========================
  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status === 'active' ||
      alert.status === 'acknowledged'
  );

  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === 'resolved'
  );

  const displayedAlerts =
    activeTab === 'active'
      ? activeAlerts
      : resolvedAlerts;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Alerts
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor and manage system alerts in real-time
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || !projectId}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
          bg-indigo-500 text-white
          hover:bg-indigo-600
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />

          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-red-100 dark:bg-red-900/30
        text-red-700 dark:text-red-400
        px-4 py-4 rounded-xl
        flex items-center gap-3">

          <AlertTriangle className="w-6 h-6" />

          <div>
            <p className="text-sm">Active Alerts</p>
            <p className="text-2xl font-bold">
              {activeAlerts.length}
            </p>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900/30
        text-green-700 dark:text-green-400
        px-4 py-4 rounded-xl
        flex items-center gap-3">

          <CheckCircle className="w-6 h-6" />

          <div>
            <p className="text-sm">Resolved Alerts</p>
            <p className="text-2xl font-bold">
              {resolvedAlerts.length}
            </p>
          </div>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20
        border border-red-200 dark:border-red-800
        text-red-700 dark:text-red-400
        rounded-xl p-4">

          <p className="font-medium">
            {error}
          </p>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2">

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Active Alerts ({activeAlerts.length})
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'resolved'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Resolved Alerts ({resolvedAlerts.length})
        </button>

      </div>

      {/* ALERT LIST */}
      <div className="bg-white dark:bg-slate-900
      rounded-2xl p-6
      border border-slate-200 dark:border-slate-800
      shadow-sm">

        {loading ? (
          <div className="py-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />

            <p className="text-slate-500 dark:text-slate-400">
              Loading alerts...
            </p>
          </div>
        ) : (
          <AlertList
            alerts={displayedAlerts}
            onResolve={handleResolve}
          />
        )}

      </div>

      {/* ACTION LOADING */}
      {actionLoading && (
        <div className="fixed bottom-4 right-4
        bg-slate-900 text-white
        px-4 py-3 rounded-lg shadow-lg">

          Resolving alert...
        </div>
      )}

    </div>
  );
}