import { Settings as SettingsIcon } from 'lucide-react';
import SettingsForm from '../components/SettingsForm';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <SettingsIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure your monitoring preferences and integrations
          </p>
        </div>
      </div>

      <SettingsForm />
    </div>
  );
}
