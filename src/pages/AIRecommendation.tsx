import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import { recommendations as initialRecommendations } from '../data/dashboardData';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  severity: string;
  estimatedSaving: string;
  affectedService: string;
  confidence: number;
  generatedTime: string;
  status: string;
}

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    initialRecommendations
  );
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleIgnore = (id: number) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'ignored' } : rec))
    );
    showToastNotification('Recommendation ignored');
  };

  const handleSchedule = (id: number) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'scheduled' } : rec))
    );
    showToastNotification('Recommendation scheduled');
  };

  const showToastNotification = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const activeRecommendations = recommendations.filter(
    (r) => r.status === 'active'
  );
  const scheduledRecommendations = recommendations.filter(
    (r) => r.status === 'scheduled'
  );
  const ignoredRecommendations = recommendations.filter(
    (r) => r.status === 'ignored'
  );

  return (
    <div className="space-y-6">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Check className="w-5 h-5" />
          {showToast}
        </div>
      )}

      <div className="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-2xl font-bold">AI Recommendations</h1>
        </div>
        <p className="text-white/80">
          AI-powered insights to optimize your cloud infrastructure and reduce costs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activeRecommendations.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled</p>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {scheduledRecommendations.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Check className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ignored</p>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {ignoredRecommendations.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            {...rec}
            onIgnore={handleIgnore}
            onSchedule={handleSchedule}
          />
        ))}
      </div>
    </div>
  );
}
