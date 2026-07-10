import {
  DollarSign,
  TrendingUp,
  Target,
  PiggyBank,
  Power,
  Minimize2,
  Archive,
  HardDrive,
  Maximize2,
  Ticket,
} from 'lucide-react';
import { costOptimizationItems } from '../data/dashboardData';

export default function CostOptimization() {
  const iconMap: { [key: string]: React.ElementType } = {
    Power,
    Minimize2,
    Archive,
    HardDrive,
    Maximize2,
    Ticket,
  };

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: string } = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return badges[priority] || badges.medium;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Cost Optimization
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          AI-powered recommendations to reduce your cloud spending
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current Cost</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">₹18,450</p>
              <p className="text-xs text-slate-400">per month</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Predicted Cost</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">₹22,130</p>
              <p className="text-xs text-amber-600">+19% projected</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <PiggyBank className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹6,780</p>
              <p className="text-xs text-slate-400">per month</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Target className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Budget Usage</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">82%</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-indigo-500 to-blue-500"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {costOptimizationItems.map((item) => {
          const Icon = iconMap[item.icon] || DollarSign;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {item.description}
              </p>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                <div>
                  <p className="text-xs text-slate-400">Est. Saving</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {item.estimatedSaving}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    Details
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
