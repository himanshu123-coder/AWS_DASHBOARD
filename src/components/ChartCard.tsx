import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
