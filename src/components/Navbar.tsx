import { useState } from 'react';
import {
  Menu,
  RefreshCw,
  Moon,
  Sun,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useProject } from '../lib/project-context';

const DATE_RANGES = [
  { id: 1, name: 'Last 24 Hours' },
  { id: 2, name: 'Last 7 Days' },
  { id: 3, name: 'Last 30 Days' },
  { id: 4, name: 'Last 90 Days' },
];

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  lastUpdated: string;
  setLastUpdated: (time: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  lastUpdated,
  setLastUpdated,
  setIsSidebarOpen,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const { projects, selectedProject, setSelectedProjectId } = useProject();
  const [selectedDateRange, setSelectedDateRange] = useState(DATE_RANGES[1].name);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleRefresh = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastUpdated(`Today, ${time}`);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          {selectedProject && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsProjectOpen(!isProjectOpen);
                  setIsDateOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {selectedProject.name}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              {isProjectOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                  {projects.map((project) => (
                    <button
                      key={project._id}
                      onClick={() => {
                        setSelectedProjectId(project._id);
                        setIsProjectOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                        selectedProject._id === project._id
                          ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsProjectOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedDateRange}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {isDateOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                {DATE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => {
                      setSelectedDateRange(range.name);
                      setIsDateOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedDateRange === range.name
                        ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400">
            Refresh
          </span>
        </button>

        <span className="hidden md:inline text-xs text-slate-500 dark:text-slate-500">
          Last updated: {lastUpdated}
        </span>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsProjectOpen(false);
              setIsDateOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
