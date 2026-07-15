import { useMemo, useState } from 'react';
import { Search, Filter, X, Eye } from 'lucide-react';

import InstanceDetailsModal from './InstanceDetailModal';
import type { CloudInstance } from '../lib/types';

interface InstanceTableProps {
  instances: CloudInstance[];
  onInstancesChange: React.Dispatch<
    React.SetStateAction<CloudInstance[]>
  >;
  onRefresh: () => Promise<void>;
}

export default function InstanceTable({
  instances,
}: InstanceTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const [selectedInstance, setSelectedInstance] =
    useState<CloudInstance | null>(null);

  const filteredInstances = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase().trim();

    return instances.filter((instance) => {
      const matchesSearch =
        !normalizedSearch ||
        instance.name.toLowerCase().includes(normalizedSearch) ||
        instance.instanceId
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesRegion =
        !regionFilter || instance.region === regionFilter;

      const matchesState =
        !stateFilter || instance.state === stateFilter;

      return matchesSearch && matchesRegion && matchesState;
    });
  }, [
    instances,
    searchQuery,
    regionFilter,
    stateFilter,
  ]);

  const uniqueRegions = useMemo(
    () => [...new Set(instances.map((item) => item.region))],
    [instances]
  );

  const uniqueStates = useMemo(
    () => [...new Set(instances.map((item) => item.state))],
    [instances]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setRegionFilter('');
    setStateFilter('');
  };

  const getStateBadge = (state: string) => {
    const badges: Record<string, string> = {
      running:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

      stopped:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',

      idle:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',

      warning:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',

      pending:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',

      terminated:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
      badges[state] ||
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    );
  };

  const getCpuBarColor = (cpuUsage: number) => {
    if (cpuUsage > 80) return 'bg-red-500';
    if (cpuUsage > 50) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Search and filters */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search by name or instance ID..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={regionFilter}
              onChange={(event) =>
                setRegionFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
              onChange={(event) =>
                setStateFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">All States</option>

              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() +
                    state.slice(1)}
                </option>
              ))}
            </select>

            {(searchQuery ||
              regionFilter ||
              stateFilter) && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center justify-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-275">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {[
                'Instance Name',
                'Instance ID',
                'Type',
                'State',
                'Region',
                'CPU',
                'Network In',
                'Network Out',
                'Monthly Cost',
                'Actions',
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
            {filteredInstances.map((instance) => (
              <tr
                key={instance._id}
                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                  {instance.name}
                </td>

                <td className="px-4 py-3 font-mono text-sm text-slate-500 dark:text-slate-400">
                  {instance.instanceId}
                </td>

                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {instance.instanceType}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStateBadge(
                      instance.state
                    )}`}
                  >
                    {instance.state.charAt(0).toUpperCase() +
                      instance.state.slice(1)}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {instance.region}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full ${getCpuBarColor(
                          instance.cpuUsage
                        )}`}
                        style={{
                          width: `${Math.min(
                            Number(instance.cpuUsage || 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {Number(instance.cpuUsage || 0).toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {Number(instance.networkIn || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {Number(instance.networkOut || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                  ₹
                  {Number(
                    instance.monthlyCost || 0
                  ).toLocaleString('en-IN')}
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedInstance(instance)
                    }
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                  >
                    <Eye className="h-4 w-4" />
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
          <Filter className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />

          <p className="text-slate-500 dark:text-slate-400">
            No instances found
          </p>
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