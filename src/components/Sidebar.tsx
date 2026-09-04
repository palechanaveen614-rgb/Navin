import React from 'react';
import {
  LayoutDashboard,
  Folder,
  Wrench,
  CheckSquare,
  FileText,
  Rocket,
  History,
  Settings,
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount?: number;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
  onOpenSettings,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'build', label: 'Build', icon: Wrench },
    { id: 'review', label: 'Review', icon: CheckSquare },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'deploy', label: 'Deploy', icon: Rocket },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-950/40 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none h-screen text-slate-300">
      {/* Top Branding */}
      <div>
        <div className="px-5 py-5 flex items-center gap-3.5 border-b border-slate-800/60 bg-slate-950/50">
          {/* Stylized N Logo with Sleek Interface gradient */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
              <path d="M5 19V5h3l8 9.5V5h3v14h-3L8 9.5V19H5z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold tracking-tight text-sm leading-tight font-sans">
              NAVIN BUILD AI
            </div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono font-medium">
              Autonomous Agent
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-5 pb-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 px-3">
            Navigation & Tools
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-cyan-400/80">Active</span>
                  )}
                  {item.id === 'review' && unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Info & Settings Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        {/* User Card */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200">Naveen P.</div>
              <div className="text-[10px] text-slate-500">Autonomous Admin</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-slate-700 font-mono">
            PRO
          </span>
        </div>

        {/* Settings Button */}
        <button
          id="sidebar-settings-btn"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Platform Settings</span>
        </button>
      </div>
    </aside>
  );
};
