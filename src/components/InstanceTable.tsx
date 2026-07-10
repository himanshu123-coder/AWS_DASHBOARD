import { useState } from 'react';
import { Search, Filter, X, Eye } from 'lucide-react';
import { instances } from '../data/dashboardData';
import InstanceDetailsModal from './InstanceDetailModal';

interface Instance {
  id: string;
  name: string;
  type: string;
  state: string;
  region: string;
  cpu: number;
  networkIn: string;
  networkOut: string;
  monthlyCost: string;
  memory: string;
  storage: string;
  uptime: string;
}

export default function InstanceTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);

  const filteredInstances = instances.filter((instance) => {
    const matchesSearch =
      instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !regionFilter || instance.region === regionFilter;
    const matchesState = !stateFilter || instance.state === stateFilter;
    return matchesSearch && matchesRegion && matchesState;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setRegionFilter('');
    setStateFilter('');
  };

  const getStateBadge = (state: string) => {
    const badges: { [key: string]: string } = {
      running: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      stopped: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
      idle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      warning: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return badges[state] || 'bg-slate-100 text-slate-700';
  };

  const uniqueRegions = [...new Set(instances.map((i) => i.region))];
  const uniqueStates = [...new Set(instances.map((i) => i.state))];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or instance ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Regions</option>
              {uniqueRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All States</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
            {(searchQuery || regionFilter || stateFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Instance Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Instance ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Region
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                CPU
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Network In
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Network Out
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Monthly Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredInstances.map((instance) => (
              <tr
                key={instance.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                  {instance.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {instance.id}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {instance.type}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStateBadge(
                      instance.state
                    )}`}
                  >
                    {instance.state.charAt(0).toUpperCase() + instance.state.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {instance.region}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          instance.cpu > 80
                            ? 'bg-red-500'
                            : instance.cpu > 50
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${instance.cpu}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {instance.cpu}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {instance.networkIn}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {instance.networkOut}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                  {instance.monthlyCost}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedInstance(instance)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInstances.length === 0 && (
        <div className="p-8 text-center">
          <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No instances found</p>
        </div>
      )}

      {selectedInstance && (
        <InstanceDetailsModal
          instance={selectedInstance}
          onClose={() => setSelectedInstance(null)}
        />
      )}
    </div>
  );
}
