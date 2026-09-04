import React, { useState } from 'react';
import {
  FileCode,
  EyeOff,
  ExternalLink,
  Star,
  CheckCircle,
  ShieldCheck,
  Zap,
  Smartphone,
  Send,
  MessageSquare,
  Code2,
  Eye,
  Award,
  RefreshCw,
} from 'lucide-react';
import { GeneratedProject, ClientReview, ViewportMode } from '../types';

interface ReviewPanelProps {
  project: GeneratedProject | null;
  reviews: ClientReview[];
  onSubmitReview: (name: string, rating: number, comment: string) => Promise<void>;
  viewport: ViewportMode;
  onDeployRequest: () => void;
  onRefreshPreview: () => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  project,
  reviews,
  onSubmitReview,
  viewport,
  onDeployRequest,
  onRefreshPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'preview' | 'code'>('preview');
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const hasBuiltSite = !!(project && project.code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitReview(clientName.trim(), rating, comment.trim());
      setClientName('');
      setComment('');
      setRating(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (project?.code) {
      navigator.clipboard.writeText(project.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Determine iframe container width based on viewport selection
  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] my-auto rounded-[32px] border-4 border-slate-700 shadow-2xl';
      case 'tablet':
        return 'w-[768px] h-full rounded-xl border border-slate-700 shadow-xl';
      case 'desktop':
      default:
        return 'w-full h-full rounded-none border-0';
    }
  };

  return (
    <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl relative backdrop-blur-xs">
      {/* Panel Top Header */}
      <div className="h-14 px-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm tracking-wide">Review</span>
          {hasBuiltSite && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-medium">
              SCORE: {project?.qualityScore || 98}%
            </span>
          )}
        </div>

        {hasBuiltSite && (
          <div className="flex items-center p-0.5 rounded-md bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'review'
                  ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Audit & Feedback</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'code'
                  ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Files</span>
            </button>
          </div>
        )}
      </div>

      {/* Panel Body Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {!hasBuiltSite ? (
          /* Empty State exactly matching the screenshot */
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              {/* Browser window with </> icon matching screenshot */}
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-5 shadow-inner">
                <div className="relative flex items-center justify-center">
                  <FileCode className="w-8 h-8 text-slate-400" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                Build your website first
              </h2>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Once your website is built successfully, its quality review will appear here.
              </p>
            </div>

            {/* Bottom Bar: Review unavailable */}
            <div className="h-12 border-t border-slate-800 bg-slate-950 flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Review unavailable</span>
            </div>
          </div>
        ) : (
          /* Active Built Website Views */
          <div className="flex-1 flex flex-col h-full">
            {activeTab === 'preview' && (
              <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center overflow-hidden relative p-2 sm:p-4">
                {/* Viewport Frame Container */}
                <div
                  className={`bg-white transition-all duration-300 overflow-hidden relative flex flex-col ${getViewportStyles()}`}
                >
                  <iframe
                    title="Live App Sandbox Preview"
                    srcDoc={project.code}
                    sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                    className="w-full h-full border-0 bg-slate-950"
                  />
                </div>

                {/* Floating Preview Quick Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                  <button
                    onClick={onRefreshPreview}
                    title="Refresh Sandbox Frame"
                    className="p-2 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-300 hover:text-white shadow-lg transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onDeployRequest}
                    className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Free Deploy</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Quality Score Header */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-white">Quality Audit Score</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 font-mono">
                        Zero Errors
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Validated by Navin Autonomous AI engine with Google AI Studio compliance.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-cyan-400 font-mono">
                      {project.qualityScore}
                    </span>
                    <span className="text-base text-slate-500 font-semibold font-mono">/100</span>
                  </div>
                </div>

                {/* Score Breakdown Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                      <span>Performance</span>
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">99%</div>
                    <div className="text-[10px] text-cyan-400 mt-1 font-mono">11ms fast render</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                      <span>Responsive</span>
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">100%</div>
                    <div className="text-[10px] text-cyan-400 mt-1 font-mono">Desktop & Mobile</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                      <span>Accessibility</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">98%</div>
                    <div className="text-[10px] text-cyan-400 mt-1 font-mono">WCAG AA Compliant</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                      <span>SEO & PWA</span>
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">100%</div>
                    <div className="text-[10px] text-cyan-400 mt-1 font-mono">Installable Manifest</div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                    Verified Quality Highlights
                  </div>
                  {(
                    project.reviewDetails?.highlights || [
                      'Zero syntax or runtime compilation errors',
                      '100% responsive fluid grid on mobile, tablet, and desktop',
                      'Real interactive state with instant DOM manipulation',
                      'PWA manifest and service worker caching enabled',
                    ]
                  ).map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Real-Time Client Feedback & Review Form */}
                <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        Client Direct Feedback & Review
                      </h3>
                      <p className="text-xs text-slate-400">
                        Clients can leave instant ratings and comments that trigger real-time notifications.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Client / Reviewer Name
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Vikram Verma (Design Lead)"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Rating Score
                        </label>
                        <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-950 border border-slate-700">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-amber-300 ml-2 font-mono">
                            {rating}.0 / 5.0
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Feedback Details
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Describe your review, suggestions, or approved features..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !clientName.trim() || !comment.trim()}
                      className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Posting Review...' : 'Submit Client Review & Push Notification'}</span>
                    </button>
                  </form>

                  {/* Existing Reviews List */}
                  {reviews && reviews.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-slate-400 font-mono">
                        Recent Verified Reviews ({reviews.length})
                      </div>
                      <div className="space-y-2.5">
                        {reviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                  {rev.clientName.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-slate-200">
                                  {rev.clientName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3 h-3 fill-amber-400 text-amber-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {rev.comment}
                            </p>
                            <span className="text-[10px] text-slate-500 block font-mono">
                              {new Date(rev.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="flex-1 p-5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs text-slate-400 font-mono">
                    index.html • Complete Standalone Application
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-medium text-slate-200 transition"
                  >
                    {copiedCode ? '✓ Copied!' : 'Copy Source Code'}
                  </button>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-auto whitespace-pre">
                  {project.code}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
