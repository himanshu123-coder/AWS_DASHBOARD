import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import CloudMetrics from './pages/CloudMetrics';
import WebsiteMonitoring from './pages/WebsiteMonitoring';
import CostOptimization from './pages/CostOptimization';
import AIRecommendations from './pages/AIRecommendation';
import Alerts from './pages/Alert';
import Settings from './pages/Settings';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [activePage, setActivePage] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'cloud-metrics':
        return <CloudMetrics />;
      case 'website-monitoring':
        return <WebsiteMonitoring />;
      case 'cost-optimization':
        return <CostOptimization />;
      case 'ai-recommendations':
        return <AIRecommendations />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            lastUpdated={lastUpdated}
            setLastUpdated={setLastUpdated}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
