import {
  X,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Server,
  MapPin,
  Sparkles,
} from 'lucide-react';

import type { CloudInstance } from '../lib/types';

interface InstanceDetailsModalProps {
  instance: CloudInstance;
  onClose: () => void;
}

function formatUptime(hours: number) {
  const safeHours = Number(hours || 0);

  const days = Math.floor(safeHours / 24);
  const remainingHours = safeHours % 24;

  if (days === 0) {
    return `${remainingHours} hour${remainingHours === 1 ? '' : 's'}`;
  }

  if (remainingHours === 0) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }

  return `${days} day${days === 1 ? '' : 's'} ${remainingHours} hour${
    remainingHours === 1 ? '' : 's'
  }`;
}

function clampPercentage(value: number) {
  return Math.min(Math.max(Number(value || 0), 0), 100);
}

export default function InstanceDetailsModal({
  instance,
  onClose,
}: InstanceDetailsModalProps) {
  const cpu = Number(instance.cpuUsage || 0);
  const memory = Number(instance.memoryUsage || 0);
  const storage = Number(instance.storageUsed || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {instance.name}
            </h2>

            <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
              {instance.instanceId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close instance details"
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Server className="h-4 w-4" />
                <span className="text-xs font-medium">Instance Type</span>
              </div>

              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {instance.instanceType}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-medium">Region</span>
              </div>

              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {instance.region}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Uptime</span>
              </div>

              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {formatUptime(instance.uptime)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">
              Resource Usage
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Cpu className="h-4 w-4" />
                  <span className="text-xs font-medium">CPU Usage</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full ${
                        cpu > 80
                          ? 'bg-red-500'
                          : cpu > 50
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                      }`}
                      style={{
                        width: `${clampPercentage(cpu)}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    {cpu.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-xs font-medium">Memory</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${clampPercentage(memory)}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    {memory.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-xs font-medium">Storage</span>
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {storage.toFixed(1)} GB
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">
              Network Traffic
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                  <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Network In
                  </p>

                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {Number(instance.networkIn || 0).toFixed(2)} MB/s
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Network Out
                  </p>

                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {Number(instance.networkOut || 0).toFixed(2)} MB/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">
              Monthly Cost
            </h3>

            <div className="rounded-xl bg-linear-to-r from-indigo-500 to-blue-500 p-4 text-white">
              <p className="text-3xl font-bold">
                ₹
                {Number(instance.monthlyCost || 0).toLocaleString(
                  'en-IN',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

              <p className="mt-1 text-sm text-white/80">
                Based on current usage
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  AI Recommendation
                </p>

                {cpu < 10 &&
                (instance.state === 'idle' ||
                  instance.state === 'running') ? (
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    This instance has very low CPU usage. Consider resizing
                    it or stopping it during non-working hours to reduce
                    costs.
                  </p>
                ) : cpu > 80 ? (
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    High CPU usage detected. Consider upgrading to a larger
                    instance type or implementing auto-scaling.
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    Instance performance is currently within the normal
                    range. Continue monitoring usage patterns.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}