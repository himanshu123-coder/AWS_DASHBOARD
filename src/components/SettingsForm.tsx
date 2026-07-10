import { useState } from 'react';
import { Save, RotateCcw, RefreshCw, Copy, Check } from 'lucide-react';

export default function SettingsForm() {
  const [awsAccountId, setAwsAccountId] = useState('');
  const [iamRoleArn, setIamRoleArn] = useState('');
  const [defaultRegion, setDefaultRegion] = useState('ap-south-1');
  const [externalId, setExternalId] = useState('');
  const [monitoringInterval, setMonitoringInterval] = useState('5');
  const [enableCostExplorer, setEnableCostExplorer] = useState(true);
  const [enableCloudWatch, setEnableCloudWatch] = useState(true);

  const [projectId, setProjectId] = useState('project_demo_123');
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [trackingInterval, setTrackingInterval] = useState('1');
  const [enableErrorTracking, setEnableErrorTracking] = useState(true);
  const [enableUptimeMonitoring, setEnableUptimeMonitoring] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    setAwsAccountId('');
    setIamRoleArn('');
    setDefaultRegion('ap-south-1');
    setExternalId('');
    setMonitoringInterval('5');
    setEnableCostExplorer(true);
    setEnableCloudWatch(true);
    setProjectId('project_demo_123');
    setWebsiteName('');
    setWebsiteUrl('');
    setTrackingInterval('1');
    setEnableErrorTracking(true);
    setEnableUptimeMonitoring(true);
  };

  const trackingScript = `<script>
  window.cloudMonitorConfig = {
    projectId: "${projectId}",
    endpoint: "https://api.example.com/track"
  };
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Check className="w-5 h-5" />
          Settings saved successfully!
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          AWS Connection Setup
        </h2>
        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-6">
          This is a demo configuration form. No AWS credentials or real API calls are used.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              AWS Account ID
            </label>
            <input
              type="text"
              value={awsAccountId}
              onChange={(e) => setAwsAccountId(e.target.value)}
              placeholder="123456789012"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              IAM Role ARN
            </label>
            <input
              type="text"
              value={iamRoleArn}
              onChange={(e) => setIamRoleArn(e.target.value)}
              placeholder="arn:aws:iam::123456789012:role/CloudWatchRole"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Default Region
            </label>
            <select
              value={defaultRegion}
              onChange={(e) => setDefaultRegion(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ap-south-1">ap-south-1</option>
              <option value="us-east-1">us-east-1</option>
              <option value="eu-west-1">eu-west-1</option>
              <option value="ap-southeast-1">ap-southeast-1</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              External ID
            </label>
            <input
              type="text"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="unique-external-id"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Monitoring Interval (minutes)
            </label>
            <select
              value={monitoringInterval}
              onChange={(e) => setMonitoringInterval(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </div>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCostExplorer}
                onChange={(e) => setEnableCostExplorer(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Enable Cost Explorer
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCloudWatch}
                onChange={(e) => setEnableCloudWatch(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Enable CloudWatch Metrics
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
          Website Tracking Setup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Project ID
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="project_demo_123"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Website Name
            </label>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="My Website"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Website URL
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tracking Interval (minutes)
            </label>
            <select
              value={trackingInterval}
              onChange={(e) => setTrackingInterval(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
            </select>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableErrorTracking}
                onChange={(e) => setEnableErrorTracking(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Enable Error Tracking
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableUptimeMonitoring}
                onChange={(e) => setEnableUptimeMonitoring(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Enable Uptime Monitoring
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tracking Script
          </label>
          <div className="relative">
            <pre className="p-4 bg-slate-800 rounded-lg overflow-x-auto text-sm text-slate-200 font-mono">
              {trackingScript}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 transition-all font-medium"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Test Connection
        </button>
      </div>
    </div>
  );
}
