import React, { useState } from 'react';
import {
  Settings,
  X,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  canInstallPwa = false,
  onInstallPwa,
  soundEnabled,
  onToggleSound,
}) => {
  const [googleAiStudioConnected, setGoogleAiStudioConnected] = useState(true);
  const [lovableConnected, setLovableConnected] = useState(true);
  const [replitConnected, setReplitConnected] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Platform Settings & Integrations</h2>
              <p className="text-xs text-slate-400">
                Configure AI Engines, Google AI Studio, Lovable, and notifications.
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Integrations Section */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Active AI Ecosystem Integrations
            </div>

            {/* Google AI Studio */}
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs font-mono">
                  G
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Google AI Studio & Gemini 3.8</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Server-side model integration with automated error recovery.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setGoogleAiStudioConnected(!googleAiStudioConnected)}
                className={`px-3 py-1 rounded-md text-xs font-semibold font-mono transition ${
                  googleAiStudioConnected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {googleAiStudioConnected ? 'Connected' : 'Disabled'}
              </button>
            </div>

            {/* Lovable AI */}
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-xs font-mono">
                  L
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Lovable AI Automation</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Free subdomain deployment and live UI sandbox sync.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setLovableConnected(!lovableConnected)}
                className={`px-3 py-1 rounded-md text-xs font-semibold font-mono transition ${
                  lovableConnected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {lovableConnected ? 'Connected' : 'Disabled'}
              </button>
            </div>

            {/* Replit / Bolt */}
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
                  R
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Replit & Bolt.new Runtime Engine</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    High-speed execution sandbox with instant hot reload.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReplitConnected(!replitConnected)}
                className={`px-3 py-1 rounded-md text-xs font-semibold font-mono transition ${
                  replitConnected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {replitConnected ? 'Connected' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Audio & PWA
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">Audio Notification Chimes</div>
                  <div className="text-[11px] text-slate-400">
                    Play pleasant audio alert when client submits review or build completes.
                  </div>
                </div>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1 rounded-md text-xs font-semibold font-mono transition ${
                  soundEnabled
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {canInstallPwa && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">PWA App Installation</div>
                    <div className="text-[11px] text-slate-400">
                      Install Navin Build AI on PC / Mobile desktop for offline quick launch.
                    </div>
                  </div>
                </div>
                <button
                  onClick={onInstallPwa}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition font-mono"
                >
                  INSTALL NOW
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition font-mono"
          >
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
