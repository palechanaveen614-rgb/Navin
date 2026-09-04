import React from 'react';
import { History, X, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: Array<{ id: string; action: string; time: string; version: string }>;
  onRollback: (version: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyItems,
  onRollback,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Project Version History</h2>
              <p className="text-xs text-slate-400">
                Roll back to any previous state or inspect agent milestones.
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

        <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
          {historyItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.action}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {item.version} • {item.time}
                  </div>
                </div>
              </div>

              {idx !== 0 && (
                <button
                  onClick={() => {
                    onRollback(item.version);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-xs text-slate-300 font-medium font-mono transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESTORE</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
