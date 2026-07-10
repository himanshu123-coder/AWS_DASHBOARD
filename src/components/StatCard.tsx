import { TrendingUp, TrendingDown, DollarSign, Server, Cpu, Activity, AlertTriangle, Sparkles } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  DollarSign,
  Server,
  Cpu,
  Activity,
  AlertTriangle,
  Sparkles,
};

const iconBgMap: { [key: string]: string } = {
  DollarSign: 'bg-green-100 dark:bg-green-900/30',
  Server: 'bg-blue-100 dark:bg-blue-900/30',
  Cpu: 'bg-orange-100 dark:bg-orange-900/30',
  Activity: 'bg-violet-100 dark:bg-violet-900/30',
  AlertTriangle: 'bg-amber-100 dark:bg-amber-900/30',
  Sparkles: 'bg-indigo-100 dark:bg-indigo-900/30',
};

const iconColorMap: { [key: string]: string } = {
  DollarSign: 'text-green-600 dark:text-green-400',
  Server: 'text-blue-600 dark:text-blue-400',
  Cpu: 'text-orange-600 dark:text-orange-400',
  Activity: 'text-violet-600 dark:text-violet-400',
  AlertTriangle: 'text-amber-600 dark:text-amber-400',
  Sparkles: 'text-indigo-600 dark:text-indigo-400',
};

export default function StatCard({ title, value, trend, trendUp, icon }: StatCardProps) {
  const Icon = iconMap[icon] || DollarSign;
  const bgClass = iconBgMap[icon] || 'bg-slate-100 dark:bg-slate-800';
  const colorClass = iconColorMap[icon] || 'text-slate-600 dark:text-slate-400';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${bgClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        {trendUp ? (
          <TrendingUp className="w-5 h-5 text-green-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
        <p className={`text-xs mt-2 ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}
