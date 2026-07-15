import { useEffect, useMemo, useState } from 'react';
import InstanceTable from '../components/InstanceTable';
import { Activity, Server, Cpu, DollarSign } from 'lucide-react';
import { api, type ApiResponse } from '../lib/api';

import type { CloudInstance } from '../lib/types';

export default function CloudMetrics() {
  const [instances, setInstances] = useState<CloudInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInstances = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<ApiResponse<CloudInstance[]>>(
        '/instances?limit=100'
      );

      setInstances(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Instances load nahi ho sake.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const quickStats = useMemo(() => {
    const totalInstances = instances.length;

    const runningInstances = instances.filter(
      (instance) => instance.state === 'running'
    ).length;

    const averageCpuUsage =
      totalInstances > 0
        ? (
            instances.reduce(
              (sum, instance) =>
                sum + Number(instance.cpuUsage || 0),
              0
            ) / totalInstances
          ).toFixed(1)
        : '0';

    const totalMonthlyCost = instances.reduce(
      (sum, instance) =>
        sum + Number(instance.monthlyCost || 0),
      0
    );

    return [
      {
        title: 'Total Instances',
        value: totalInstances.toString(),
        icon: Server,
        color:
          'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      },
      {
        title: 'Running',
        value: runningInstances.toString(),
        icon: Activity,
        color:
          'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      },
      {
        title: 'Avg CPU Usage',
        value: `${averageCpuUsage}%`,
        icon: Cpu,
        color:
          'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      },
      {
        title: 'Total Monthly Cost',
        value: `₹${totalMonthlyCost.toLocaleString('en-IN')}`,
        icon: DollarSign,
        color:
          'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
      },
    ];
  }, [instances]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Cloud instances load ho rahe hain...
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
            Cloud Metrics
          </h1>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Monitor your EC2 instances and cloud resources
          </p>
        </div>

        <button
          type="button"
          onClick={loadInstances}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>

                <p className="text-xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* InstanceTable's props typing is incompatible here; cast to any to avoid TS error */}
      <InstanceTable
        {...({
          instances,
          onInstancesChange: setInstances,
          onRefresh: loadInstances,
        } as any)}
      />
    </div>
  );
}