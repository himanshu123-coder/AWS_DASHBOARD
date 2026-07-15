import { useCallback, useEffect, useMemo, useState } from 'react';

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

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { costOptimizationItems } from '../data/dashboardData';
import { api, type ApiResponse } from '../lib/api';
import ChartCard from '../components/ChartCard';

interface CostPrediction {
  currentSpend: number;
  predictedMonthlySpend: number;
  budget: number;
  budgetUsedPercent: number;
  isOverBudget: boolean;
  projectedOverrun: number;
}

interface CostTrendPoint {
  month: string;
  total: number;
}

interface ServiceCostPoint {
  service: string;
  total: number;
}

interface RegionCostPoint {
  region: string;
  total: number;
}

const PIE_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
];

export default function CostOptimization() {
  const [prediction, setPrediction] = useState<CostPrediction | null>(null);
  const [costTrend, setCostTrend] = useState<CostTrendPoint[]>([]);
  const [serviceCosts, setServiceCosts] = useState<ServiceCostPoint[]>([]);
  const [regionCosts, setRegionCosts] = useState<RegionCostPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const iconMap: Record<string, React.ElementType> = {
    Power,
    Minimize2,
    Archive,
    HardDrive,
    Maximize2,
    Ticket,
  };

  const loadCostData = useCallback(async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const [
        predictionResponse,
        trendResponse,
        serviceResponse,
        regionResponse,
      ] = await Promise.all([
        api.get<ApiResponse<CostPrediction>>('/costs/prediction'),

        api.get<ApiResponse<CostTrendPoint[]>>(
          '/costs/trend?months=6'
        ),

        api.get<ApiResponse<ServiceCostPoint[]>>(
          '/costs/by-service'
        ),

        api.get<ApiResponse<RegionCostPoint[]>>(
          '/costs/by-region'
        ),
      ]);

      setPrediction(predictionResponse.data);
      setCostTrend(trendResponse.data || []);
      setServiceCosts(serviceResponse.data || []);
      setRegionCosts(regionResponse.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Cost data load nahi ho saka.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCostData();
  }, [loadCostData]);

  const potentialSavings = useMemo(() => {
    if (!prediction) return 0;

    return Math.max(
      prediction.predictedMonthlySpend - prediction.currentSpend,
      0
    );
  }, [prediction]);

  const servicePieData = useMemo(
    () =>
      serviceCosts.map((item, index) => ({
        name: item.service,
        value: item.total,
        color: PIE_COLORS[index % PIE_COLORS.length],
      })),
    [serviceCosts]
  );

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      high:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    return badges[priority] || badges.medium;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Cost data load ho raha hai...
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
            Cost Optimization
          </h1>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            AI-powered recommendations to reduce your cloud spending
          </p>
        </div>

        <button
          type="button"
          disabled={refreshing}
          onClick={() => loadCostData(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Cost Data'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Current Cost"
          value={`₹${Number(
            prediction?.currentSpend || 0
          ).toLocaleString('en-IN')}`}
          subtitle="current month"
          icon={DollarSign}
          iconWrapper="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />

        <SummaryCard
          title="Predicted Cost"
          value={`₹${Number(
            prediction?.predictedMonthlySpend || 0
          ).toLocaleString('en-IN')}`}
          subtitle={
            prediction?.projectedOverrun
              ? `₹${prediction.projectedOverrun.toLocaleString(
                  'en-IN'
                )} over budget`
              : 'within current budget'
          }
          icon={TrendingUp}
          iconWrapper="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />

        <SummaryCard
          title="Potential Savings"
          value={`₹${potentialSavings.toLocaleString('en-IN')}`}
          subtitle="based on current projection"
          icon={PiggyBank}
          iconWrapper="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          valueClass="text-green-600 dark:text-green-400"
        />

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
              <Target className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Budget Usage
              </p>

              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {Number(
                  prediction?.budgetUsedPercent || 0
                ).toFixed(1)}
                %
              </p>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full ${
                    Number(prediction?.budgetUsedPercent || 0) >= 100
                      ? 'bg-red-500'
                      : Number(
                            prediction?.budgetUsedPercent || 0
                          ) >= 80
                        ? 'bg-amber-500'
                        : 'bg-linear-to-r from-indigo-500 to-blue-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      Number(prediction?.budgetUsedPercent || 0),
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Budget ₹
                {Number(
                  prediction?.budget || 0
                ).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Cost Trend">
          {costTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString('en-IN')}`,
                    'Total Cost',
                  ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />

                <Bar
                  dataKey="total"
                  name="Monthly Cost"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Cost trend data available nahi hai." />
          )}
        </ChartCard>

        <ChartCard title="Service-Wise Cost">
          {servicePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {servicePieData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString('en-IN')}`
                  }
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Service-wise cost data available nahi hai." />
          )}
        </ChartCard>
      </div>

      <ChartCard title="Region-Wise Cost">
        {regionCosts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionCosts}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis dataKey="region" stroke="#64748b" />
              <YAxis stroke="#64748b" />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  'Cost',
                ]}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />

              <Bar
                dataKey="total"
                name="Regional Cost"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="Region-wise cost data available nahi hai." />
        )}
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {costOptimizationItems.map((item) => {
          const Icon = iconMap[item.icon] || DollarSign;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority.charAt(0).toUpperCase() +
                    item.priority.slice(1)}
                </span>
              </div>

              <h3 className="mb-2 font-semibold text-slate-800 dark:text-white">
                {item.title}
              </h3>

              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {item.description}
              </p>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">
                    Est. Saving
                  </p>

                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {item.estimatedSaving}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Details
                  </button>

                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                  >
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

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconWrapper: string;
  iconColor: string;
  valueClass?: string;
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconWrapper,
  iconColor,
  valueClass = 'text-slate-800 dark:text-white',
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${iconWrapper}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className={`text-2xl font-bold ${valueClass}`}>
            {value}
          </p>

          <p className="text-xs text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-75 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}