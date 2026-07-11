import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { api } from './api';
import { useAuth } from './auth-context';
import type { Project } from './types';

interface ProjectContextValue {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProjectId: (id: string) => void;
  loading: boolean;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refreshProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<{ data: Project[] }>('/projects?limit=100');
      setProjects(res.data || []);
      if (res.data && res.data.length > 0) {
        const stored = localStorage.getItem('selectedProjectId');
        if (stored && res.data.some((p) => p._id === stored)) {
          setSelectedProjectId(stored);
        } else {
          setSelectedProjectId(res.data[0]._id);
        }
      }
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [user]);

  const selectedProject =
    projects.find((p) => p._id === selectedProjectId) || null;

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('selectedProjectId', selectedProjectId);
    }
  }, [selectedProjectId]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProjectId,
        loading,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
