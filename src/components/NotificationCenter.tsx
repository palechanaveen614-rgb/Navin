import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Star,
  Rocket,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'review':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'deploy':
        return <Rocket className="w-4 h-4 text-cyan-400" />;
      case 'agent':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-slate-950 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-semibold">
              {notifications.filter((n) => !n.read).length} NEW
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllRead}
              title="Mark all as read"
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-md transition"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Bell className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border transition ${
                  notif.read
                    ? 'bg-slate-950 border-slate-800/60 opacity-60'
                    : 'bg-slate-900 border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white leading-tight">
                      {notif.title}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal break-words">
                      {notif.message}
                    </p>
                    {notif.url && (
                      <a
                        href={notif.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-semibold hover:underline mt-1.5 font-mono"
                      >
                        <span>Visit live URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className="text-[9px] text-slate-500 block mt-1.5 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
