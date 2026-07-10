import { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import AlertList from '../components/AlertList';
import { alerts as initialAlerts } from '../data/dashboardData';

interface Alert {
  id: number;
  title: string;
  severity: string;
  service: string;
  triggerTime: string;
  description: string;
  status: string;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const handleResolve = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor and manage system alerts in real-time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{activeAlerts.length} Active</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{resolvedAlerts.length} Resolved</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Active Alerts
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'resolved'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Resolved Alerts
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        {activeTab === 'active' ? (
          <AlertList alerts={activeAlerts} onResolve={handleResolve} />
        ) : (
          <AlertList alerts={resolvedAlerts} onResolve={handleResolve} />
        )}
      </div>
    </div>
  );
}
