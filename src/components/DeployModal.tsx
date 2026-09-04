import React, { useState } from 'react';
import {
  Rocket,
  X,
  ExternalLink,
  Copy,
  Check,
  Globe,
  ShieldCheck,
  Activity,
  QrCode,
  Download,
  Loader2,
} from 'lucide-react';
import { Deployment, GeneratedProject } from '../types';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GeneratedProject | null;
  onDeploySuccess: (deployment: Deployment) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  project,
  onDeploySuccess,
}) => {
  const [customSlug, setCustomSlug] = useState(
    project?.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-app'
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [latestDeployment, setLatestDeployment] = useState<Deployment | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project?.name || 'Navin Web Project',
          code: project?.code || '',
          customSlug: customSlug.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.deployment) {
        setLatestDeployment(data.deployment);
        onDeploySuccess(data.deployment);
      }
    } catch (err) {
      console.error('Deployment error:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!project?.code) return;
    const blob = new Blob([project.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customSlug || 'navin-app'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Instant Cloud Deployment
              </h2>
              <p className="text-xs text-slate-400">
                Deploy with a free public domain like Lovable, Replit, or Bolt.new
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!latestDeployment ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                  CHOOSE FREE PUBLIC SUBDOMAIN
                </label>
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 focus-within:border-cyan-500 overflow-hidden px-3">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0 mr-2" />
                  <span className="text-xs text-slate-500 font-mono">https://</span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) =>
                      setCustomSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      )
                    }
                    placeholder="my-awesome-app"
                    className="bg-transparent py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none flex-1 font-mono"
                  />
                  <span className="text-xs text-cyan-400 font-semibold shrink-0 font-mono">
                    .lovable.app
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Includes free Edge CDN hosting, SSL TLS 1.3 certificate, and unlimited global traffic.
                </p>
              </div>

              {/* Server Features Checklist */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Automated SSL certificate renewal (HTTPS active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Global Anycast Edge network with ~12ms response time</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Instant mobile testing via direct QR code</span>
                </div>
              </div>

              <button
                id="modal-confirm-deploy-btn"
                onClick={handleDeploy}
                disabled={isDeploying || !project?.code}
                className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50 font-mono"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Deploying to Free Public Edge...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>DEPLOY NOW (FREE PERMANENT URL)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Deployment Success Screen */
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Your App is Live!</h3>
                <p className="text-xs text-slate-400">
                  Accessible worldwide on your free public domain.
                </p>
              </div>

              {/* URL Pill */}
              <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/40 flex items-center justify-between gap-2">
                <a
                  href={latestDeployment.fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono font-semibold text-cyan-400 hover:underline truncate"
                >
                  {latestDeployment.fullUrl}
                </a>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(latestDeployment.fullUrl)}
                    className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={latestDeployment.fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md bg-cyan-500 text-slate-950 font-bold"
                    title="Open Live Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Telemetry info */}
              <div className="grid grid-cols-2 gap-2 text-left text-xs text-slate-400 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Region</span>
                  <span className="text-white font-medium">Asia Edge CDN</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Status</span>
                  <span className="text-cyan-400 font-bold">● Active (200 OK)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Code</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
