import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  CheckSquare,
  Rocket,
  Bell,
  Download,
} from 'lucide-react';
import { ViewportMode } from '../types';

interface TopBarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onRefresh: () => void;
  onReviewClick: () => void;
  onDeployClick: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
  isGenerating?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  onProjectNameChange,
  viewport,
  onViewportChange,
  onRefresh,
  onReviewClick,
  onDeployClick,
  onOpenNotifications,
  unreadCount = 0,
  canInstallPwa = false,
  onInstallPwa,
  isGenerating = false,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (tempName.trim()) {
      onProjectNameChange(tempName.trim());
    } else {
      setTempName(projectName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  return (
    <header className="h-14 px-6 bg-slate-950/60 border-b border-slate-800 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 text-slate-200 select-none">
      {/* Left: Project Name + Saved Status */}
      <div className="flex items-center gap-3 min-w-[200px]">
        {isEditingName ? (
          <input
            id="project-name-input"
            type="text"
            value={tempName}
            autoFocus
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            className="bg-slate-900 border border-cyan-500 rounded-md px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setTempName(projectName);
              setIsEditingName(true);
            }}
            title="Click to rename project"
            className="text-xs sm:text-sm font-bold tracking-tight text-white hover:text-cyan-400 transition flex items-center gap-1.5 font-mono uppercase"
          >
            <span>PROJECT: {projectName || 'NEW_PROJECT'}</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-[11px]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-slate-300 font-mono text-[10px]">SAVED</span>
        </div>
      </div>

      {/* Center: Responsive Viewport Switcher */}
      <div className="flex items-center p-0.5 rounded-md bg-slate-900/80 border border-slate-800">
        <button
          id="viewport-desktop-btn"
          onClick={() => onViewportChange('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            viewport === 'desktop'
              ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>

        <button
          id="viewport-tablet-btn"
          onClick={() => onViewportChange('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            viewport === 'tablet'
              ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>

        <button
          id="viewport-mobile-btn"
          onClick={() => onViewportChange('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            viewport === 'mobile'
              ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* PWA Install Button */}
        {canInstallPwa && (
          <button
            id="pwa-install-header-btn"
            onClick={onInstallPwa}
            title="Install Navin Build AI PWA on this device"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-900/30 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install PWA</span>
          </button>
        )}

        {/* Notifications Icon */}
        <button
          id="notifications-toggle-btn"
          onClick={onOpenNotifications}
          title="Notifications"
          className="relative p-1.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600 transition"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Refresh Button */}
        <button
          id="header-refresh-btn"
          onClick={onRefresh}
          disabled={isGenerating}
          title="Refresh sandbox & preview"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-medium transition disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        {/* Review Button */}
        <button
          id="header-review-btn"
          onClick={onReviewClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold transition"
        >
          <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Review</span>
        </button>

        {/* Deploy Button */}
        <button
          id="header-deploy-btn"
          onClick={onDeployClick}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-md text-xs transition-all shadow-md shadow-cyan-950/40"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Deploy</span>
        </button>
      </div>
    </header>
  );
};
