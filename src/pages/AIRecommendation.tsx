import { useEffect, useState } from 'react';
import { Sparkles, Check, RefreshCw } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import { api } from '../lib/api';
import type { ApiResponse } from '../lib/api';

interface Recommendation {
  _id: string;
  title: string;
  description: string;
  severity: string;
  estimatedSaving: number;
  affectedService: string;
  confidence: number;
  createdAt: string;
  status: string;
  reason?: string;
  type?: string;
}

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projectId = localStorage.getItem('selectedProjectId');

  // --------------------------------
  // Toast
  // --------------------------------
  const showToastNotification = (message: string) => {
    setShowToast(message);

    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  // --------------------------------
  // Fetch Recommendations
  // --------------------------------
  const fetchRecommendations = async () => {
    if (!projectId) {
      setError('No project selected.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await api.get<ApiResponse<Recommendation[]>>(
        `/projects/${projectId}/recommendations`
      );

      setRecommendations(result.data || []);
    } catch (err) {
      console.error('Fetch recommendations error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch recommendations'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Initial Load
  // --------------------------------
  useEffect(() => {
    fetchRecommendations();
  }, [projectId]);

  // --------------------------------
  // Generate Recommendations
  // --------------------------------
  const handleGenerate = async () => {
    if (!projectId) {
      showToastNotification('No project selected');
      return;
    }

    try {
      setGenerating(true);

      const result = await api.post<ApiResponse<{ generated: number }>>(
        `/projects/${projectId}/recommendations/generate`
      );

      showToastNotification(
        `Generated ${result.data?.generated ?? 0} recommendation(s)`
      );

      await fetchRecommendations();
    } catch (err) {
      console.error('Generate recommendations error:', err);

      showToastNotification(
        err instanceof Error
          ? err.message
          : 'Failed to generate recommendations'
      );
    } finally {
      setGenerating(false);
    }
  };

  // --------------------------------
  // Ignore Recommendation
  // --------------------------------
  const handleIgnore = async (id: string) => {
    if (!projectId) {
      showToastNotification('No project selected');
      return;
    }

    try {
      setActionLoading(id);

      await api.put<ApiResponse<Recommendation>>(
        `/projects/${projectId}/recommendations/${id}/ignore`
      );

      setRecommendations((prev) =>
        prev.map((rec) =>
          rec._id === id
            ? { ...rec, status: 'ignored' }
            : rec
        )
      );

      showToastNotification('Recommendation ignored');
    } catch (err) {
      console.error('Ignore recommendation error:', err);

      showToastNotification(
        err instanceof Error
          ? err.message
          : 'Failed to ignore recommendation'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------
  // Apply Later
  // --------------------------------
  const handleSchedule = async (id: string) => {
    if (!projectId) {
      showToastNotification('No project selected');
      return;
    }

    try {
      setActionLoading(id);

      await api.put<ApiResponse<Recommendation>>(
        `/projects/${projectId}/recommendations/${id}/apply-later`
      );

      setRecommendations((prev) =>
        prev.map((rec) =>
          rec._id === id
            ? { ...rec, status: 'apply_later' }
            : rec
        )
      );

      showToastNotification('Recommendation marked as Apply Later');
    } catch (err) {
      console.error('Apply later recommendation error:', err);

      showToastNotification(
        err instanceof Error
          ? err.message
          : 'Failed to update recommendation'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------
  // Format Time
  // --------------------------------
  const formatGeneratedTime = (date: string) => {
    if (!date) return 'Unknown';

    const generatedDate = new Date(date);

    if (Number.isNaN(generatedDate.getTime())) {
      return 'Unknown';
    }

    return generatedDate.toLocaleString();
  };

  // --------------------------------
  // Format Saving
  // --------------------------------
  const formatSaving = (saving: number | string) => {
    const value = Number(saving);

    if (Number.isNaN(value)) {
      return '$0';
    }

    return `$${value.toFixed(2)}`;
  };

  // --------------------------------
  // Recommendation Stats
  // --------------------------------

  const activeRecommendations = recommendations.filter(
    (r) => r.status === 'pending'
  );

  const scheduledRecommendations = recommendations.filter(
    (r) => r.status === 'apply_later'
  );

  const ignoredRecommendations = recommendations.filter(
    (r) => r.status === 'ignored'
  );

  return (
    <div className="space-y-6">

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          {showToast}
        </div>
      )}

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-2xl p-6 text-white">

        <div className="flex items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8" />

              <h1 className="text-2xl font-bold">
                AI Recommendations
              </h1>
            </div>

            <p className="text-white/80">
              AI-powered insights to optimize your cloud infrastructure and
              reduce costs
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !projectId}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                generating ? 'animate-spin' : ''
              }`}
            />

            {generating
              ? 'Generating...'
              : 'Generate Recommendations'}
          </button>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Active */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Active
            </p>

            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activeRecommendations.length}
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

        </div>

        {/* Scheduled */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Scheduled
            </p>

            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {scheduledRecommendations.length}
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Check className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>

        </div>

        {/* Ignored */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ignored
            </p>

            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {ignoredRecommendations.length}
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-400" />
          </div>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 flex items-center justify-between">

          <p>{error}</p>

          <button
            onClick={fetchRecommendations}
            className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 text-sm"
          >
            Retry
          </button>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">

          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />

          <span className="ml-3 text-slate-500">
            Loading recommendations...
          </span>

        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        recommendations.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              No recommendations yet
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-5">
              Generate AI recommendations to find ways to optimize your cloud
              infrastructure.
            </p>

            <button
              onClick={handleGenerate}
              disabled={generating || !projectId}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />

              {generating
                ? 'Generating...'
                : 'Generate Recommendations'}
            </button>

          </div>
        )}

      {/* Recommendation Cards */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-6">

          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec._id}
              id={rec._id}
              title={rec.title}
              description={rec.description}
              severity={rec.severity}
              estimatedSaving={formatSaving(rec.estimatedSaving)}
              affectedService={rec.affectedService}
              confidence={rec.confidence}
              generatedTime={formatGeneratedTime(rec.createdAt)}
              status={rec.status}
              reason={rec.reason}
              onIgnore={handleIgnore}
              onSchedule={handleSchedule}
            />
          ))}

        </div>
      )}

      {/* Action Loading */}
      {actionLoading && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">

          <RefreshCw className="w-4 h-4 animate-spin" />

          Updating recommendation...

        </div>
      )}

    </div>
  );
}