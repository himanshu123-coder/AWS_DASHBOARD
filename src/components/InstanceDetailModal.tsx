import { X, Cpu, HardDrive, Wifi, Clock, Server, MapPin, Sparkles } from 'lucide-react';
import type { CloudInstance } from '../lib/types';

interface InstanceDetailsModalProps {
  instance: CloudInstance;
  onClose: () => void;
}

export default function InstanceDetailsModal({ instance, onClose }: InstanceDetailsModalProps) {
  const cpu = instance.cpuUsage;
  const memory = instance.memoryUsage;
  const storage = instance.storageUsed;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {instance.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
              {instance.instanceId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <Server className="w-4 h-4" />
                <span className="text-xs font-medium">Instance Type</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {instance.instanceType}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Region</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {instance.region}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Uptime</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {instance.uptime}%
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
              Resource Usage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-medium">CPU Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cpu > 80
                          ? 'bg-red-500'
                          : cpu > 50
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${cpu}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    {cpu}%
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <HardDrive className="w-4 h-4" />
                  <span className="text-xs font-medium">Memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${memory}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    {memory}%
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <HardDrive className="w-4 h-4" />
                  <span className="text-xs font-medium">Storage</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {storage} GB
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
              Network Traffic
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Network In</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {instance.networkIn} MB/s
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Network Out</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {instance.networkOut} MB/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
              Monthly Cost
            </h3>
            <div className="bg-linear-to-r from-indigo-500 to-blue-500 rounded-xl p-4 text-white">
              <p className="text-3xl font-bold">
                ${instance.monthlyCost.toFixed(2)}
              </p>
              <p className="text-sm text-white/80 mt-1">Based on current usage</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  AI Recommendation
                </p>
                {cpu < 10 && instance.state === 'idle' ? (
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    This instance has low CPU usage. Consider stopping it during non-working hours to reduce costs.
                  </p>
                ) : cpu > 80 ? (
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    High CPU usage detected. Consider upgrading to a larger instance type or implementing auto-scaling.
                  </p>
                ) : (
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Instance performance is optimal. Continue monitoring for any changes in usage patterns.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
