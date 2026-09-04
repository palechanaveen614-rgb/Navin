import React from 'react';
import { Folder, X, Plus, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { GeneratedProject } from '../types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: GeneratedProject | null;
  onNewProject: () => void;
  onSelectProject: (name: string, code: string) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onNewProject,
  onSelectProject,
}) => {
  if (!isOpen) return null;

  const demoProjects = [
    {
      id: 'proj-1',
      name: currentProject?.name || 'New Project',
      description: currentProject?.description || 'Active AI Web Application',
      score: currentProject?.qualityScore || 98,
      updated: 'Today',
      isCurrent: true,
    },
    {
      id: 'proj-2',
      name: 'Fintech Banking Hub',
      description: 'Wealth management dashboard with interactive charts and transfers.',
      score: 99,
      updated: 'Yesterday',
      isCurrent: false,
    },
    {
      id: 'proj-3',
      name: 'EcoStore E-Commerce',
      description: 'Sustainable product shopping store with cart drawer.',
      score: 97,
      updated: '3 days ago',
      isCurrent: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Your Web Projects</h2>
              <p className="text-xs text-slate-400">
                Manage, duplicate, and switch between your autonomous web apps.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              All Projects ({demoProjects.length})
            </span>
            <button
              onClick={() => {
                onNewProject();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW PROJECT</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {demoProjects.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-lg border flex items-center justify-between transition ${
                  p.isCurrent
                    ? 'bg-slate-900 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">{p.name}</span>
                    {p.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold border border-cyan-500/30 font-mono">
                        ACTIVE IN EDITOR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {p.updated}
                    </span>
                    <span className="text-cyan-400 font-medium">
                      Score: {p.score}%
                    </span>
                  </div>
                </div>

                {!p.isCurrent && (
                  <button
                    onClick={() => {
                      onSelectProject(p.name, '');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-xs font-semibold text-slate-300 transition font-mono"
                  >
                    OPEN
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
