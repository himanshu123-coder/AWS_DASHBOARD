import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface RecommendationCardProps {
  id: number;
  title: string;
  description: string;
  severity: string;
  estimatedSaving: string;
  affectedService: string;
  confidence: number;
  generatedTime: string;
  status: string;
  onIgnore: (id: number) => void;
  onSchedule: (id: number) => void;
}

export default function RecommendationCard({
  id,
  title,
  description,
  severity,
  estimatedSaving,
  affectedService,
  confidence,
  generatedTime,
  status,
  onIgnore,
  onSchedule,
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityBadge = () => {
    const badges: { [key: string]: string } = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return badges[severity] || badges.low;
  };

  const getStatusBadge = () => {
    const badges: { [key: string]: string } = {
      active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      scheduled: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
      ignored: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {title}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityBadge()}`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </span>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge()}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-500">Est. Saving</p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            {estimatedSaving}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-500">Service</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            {affectedService}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-500">Confidence</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            {confidence}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-500">Generated</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            {generatedTime}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 mt-4 hover:underline"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Reason
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            View Reason
          </>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      )}

      {status === 'active' && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onIgnore(id)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Ignore
          </button>
          <button
            onClick={() => onSchedule(id)}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 transition-all text-sm font-medium"
          >
            Apply Later
          </button>
        </div>
      )}
    </div>
  );
}
