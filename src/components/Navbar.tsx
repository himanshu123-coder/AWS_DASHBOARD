import { useState } from 'react';
import {
  Menu,
  RefreshCw,
  Moon,
  Sun,
  ChevronDown,
  User,
} from 'lucide-react';
import { projects, regions, dateRanges } from '../data/dashboardData';

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
  const [selectedProject, setSelectedProject] = useState(projects[0].name);
  const [selectedRegion, setSelectedRegion] = useState(regions[0].name);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRanges[1].name);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

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
          <div className="relative">
            <button
              onClick={() => {
                setIsProjectOpen(!isProjectOpen);
                setIsRegionOpen(false);
                setIsDateOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedProject}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {isProjectOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project.name);
                      setIsProjectOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedProject === project.name
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

          <div className="relative">
            <button
              onClick={() => {
                setIsRegionOpen(!isRegionOpen);
                setIsProjectOpen(false);
                setIsDateOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedRegion}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {isRegionOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setSelectedRegion(region.name);
                      setIsRegionOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedRegion === region.name
                        ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsProjectOpen(false);
                setIsRegionOpen(false);
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
                {dateRanges.map((range) => (
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

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
          <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
