import InstanceTable from '../components/InstanceTable';
import { Activity, Server, Cpu, DollarSign } from 'lucide-react';

export default function CloudMetrics() {
  const quickStats = [
    {
      title: 'Total Instances',
      value: '8',
      icon: Server,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Running',
      value: '5',
      icon: Activity,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      title: 'Avg CPU Usage',
      value: '42%',
      icon: Cpu,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Total Monthly Cost',
      value: '₹21,450',
      icon: DollarSign,
      color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Cloud Metrics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor your EC2 instances and cloud resources
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-5 h-5" />
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

      <InstanceTable />
    </div>
  );
}
