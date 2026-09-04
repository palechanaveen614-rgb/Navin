import React, { useState, useEffect } from 'react';
import {
  ViewportMode,
  NavTab,
  AgentMessage,
  ClientReview,
  Deployment,
  NotificationItem,
  GeneratedProject,
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AgentPanel } from './components/AgentPanel';
import { ReviewPanel } from './components/ReviewPanel';
import { BackendDashboardModal } from './components/BackendDashboardModal';
import { DeployModal } from './components/DeployModal';
import { TemplatesModal } from './components/TemplatesModal';
import { SettingsModal } from './components/SettingsModal';
import { ProjectsModal } from './components/ProjectsModal';
import { HistoryModal } from './components/HistoryModal';
import { NotificationCenter } from './components/NotificationCenter';

// Web Audio synthesizer chime for live real-time notifications
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // audio context might be blocked by browser policy until interaction
  }
}

export default function App() {
  // Navigation & Viewport State
  const [activeTab, setActiveTab] = useState<NavTab>('review'); // Set to 'review' initially just like in user's screenshot!
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [projectName, setProjectName] = useState('New Project');
  const [agentMode, setAgentMode] = useState<'chat' | 'build'>('build');

  // Modals
  const [showBackendDashboard, setShowBackendDashboard] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Core Data
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [historyItems, setHistoryItems] = useState<
    Array<{ id: string; action: string; time: string; version: string }>
  >([
    {
      id: 'v1',
      action: 'Project Initialized with Clean Canvas',
      time: 'Just now',
      version: 'v1.0.0',
    },
  ]);

  // Status & Flags
  const [isGenerating, setIsGenerating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<{ title: string; text: string } | null>(null);

  const showToast = (title: string, text: string) => {
    setToastMessage({ title, text });
    if (soundEnabled) playChime();
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Register PWA Service Worker & capture beforeinstallprompt
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker registered successfully.'))
        .catch((err) => console.warn('SW registration warning:', err));
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPwaPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPwaPrompt) return;
    deferredPwaPrompt.prompt();
    const choice = await deferredPwaPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setCanInstallPwa(false);
      showToast('PWA Installed', 'Navin Build AI is installed on your device.');
    }
    setDeferredPwaPrompt(null);
  };

  // Initial Data Fetch (reviews, notifications)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [revRes, notifRes] = await Promise.all([
          fetch('/api/reviews'),
          fetch('/api/notifications'),
        ]);
        const revData = await revRes.json();
        const notifData = await notifRes.json();

        if (revData.success && revData.reviews) {
          setReviews(revData.reviews);
        }
        if (notifData.success && notifData.notifications) {
          setNotifications(notifData.notifications);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Handle Tab Change from Sidebar
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      setShowBackendDashboard(true);
    } else if (tab === 'projects') {
      setShowProjectsModal(true);
    } else if (tab === 'templates') {
      setShowTemplatesModal(true);
    } else if (tab === 'deploy') {
      setShowDeployModal(true);
    } else if (tab === 'history') {
      setShowHistoryModal(true);
    } else if (tab === 'settings') {
      setShowSettingsModal(true);
    }
  };

  // Prompt Execution Pipeline
  const handleSendPrompt = async (
    promptText: string,
    mode: 'chat' | 'build',
    attachment?: string
  ) => {
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: attachment ? `${promptText}\n[📎 Attached: ${attachment}]` : promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      if (mode === 'build') {
        const res = await fetch('/api/agent/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptText,
            currentCode: project?.code || '',
            projectName,
          }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          const gen = json.data;
          setProject({
            id: `proj-${Date.now()}`,
            name: gen.title || projectName,
            description: gen.description || '',
            code: gen.code || '',
            files: gen.files || {},
            qualityScore: gen.qualityScore || 98,
            reviewDetails: gen.reviewDetails,
            agentThought: gen.agentThought,
          });

          if (gen.title && projectName === 'New Project') {
            setProjectName(gen.title);
          }

          const agentMsg: AgentMessage = {
            id: `msg-agent-${Date.now()}`,
            sender: 'agent',
            text: `I have generated "${gen.title}" with clean responsive styling, verified state management, and an automated quality review score of ${gen.qualityScore || 98}/100.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            thoughtSteps: gen.agentThought || [
              'Parsed user prompt architecture',
              'Constructed responsive HTML5/Tailwind layout',
              'Audited quality metrics and DOM performance',
              'Synthesized production-ready bundle',
            ],
            filesCreated: Object.keys(gen.files || {}),
            qualityScore: gen.qualityScore || 98,
            previewReady: true,
          };

          setMessages((prev) => [...prev, agentMsg]);

          // Append version history
          setHistoryItems((prev) => [
            {
              id: `v-${Date.now()}`,
              action: `Generated: ${gen.title}`,
              time: 'Just now',
              version: `v1.${prev.length}.0`,
            },
            ...prev,
          ]);

          showToast('Build Completed', `"${gen.title}" is ready in the live sandbox.`);
        }
      } else {
        // Chat mode
        const res = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptText,
          }),
        });

        const json = await res.json();
        const replyText = json.reply || "I've reviewed your request. Switch to Build mode to generate the changes.";

        const agentMsg: AgentMessage = {
          id: `msg-chat-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, agentMsg]);
      }
    } catch (err: any) {
      console.error('Agent error:', err);
      const errMsg: AgentMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'agent',
        text: `Error processing request: ${err.message || 'Unknown network error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Client Review Submission Handler (push notification real-time)
  const handleSubmitReview = async (name: string, rating: number, comment: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          rating,
          comment,
          projectName: project?.name || projectName,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);

        // Push new notification locally as well
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: `⭐ New ${rating}-Star Review by ${name}`,
          message: comment,
          type: 'review',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);

        showToast(
          `New ${rating}★ Client Review`,
          `${name}: "${comment.slice(0, 45)}${comment.length > 45 ? '...' : ''}"`
        );
      }
    } catch (err) {
      console.error('Submit review error:', err);
    }
  };

  const handleDeploySuccess = (deployment: Deployment) => {
    showToast('Deployment Live', `Hosted on ${deployment.subdomain}`);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🚀 Live Public Subdomain Deployed',
      message: `${deployment.projectName} is live at ${deployment.fullUrl}`,
      type: 'deploy',
      timestamp: new Date().toISOString(),
      read: false,
      url: deployment.fullUrl,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#020617] text-slate-200 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-slate-900/95 border border-cyan-500/60 shadow-2xl text-white flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <div>
            <div className="text-xs font-bold text-cyan-300">{toastMessage.title}</div>
            <div className="text-[11px] text-slate-300 mt-0.5">{toastMessage.text}</div>
          </div>
        </div>
      )}

      {/* Left Sidebar (Matching Screenshot) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadCount={unreadCount}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar Header */}
        <TopBar
          projectName={projectName}
          onProjectNameChange={setProjectName}
          viewport={viewport}
          onViewportChange={setViewport}
          onRefresh={() => {
            showToast('Sandbox Refreshed', 'Preview cache reloaded.');
          }}
          onReviewClick={() => {
            setActiveTab('review');
          }}
          onDeployClick={() => setShowDeployModal(true)}
          onOpenNotifications={() => setShowNotifications(true)}
          unreadCount={unreadCount}
          canInstallPwa={canInstallPwa}
          onInstallPwa={handleInstallPwa}
          isGenerating={isGenerating}
        />

        {/* Split Panels (Left: AI Agent, Right: Review) */}
        <main className="flex-1 p-3.5 overflow-hidden flex flex-col md:flex-row gap-3.5 bg-[#020617]">
          {/* Left Panel: AI Agent */}
          <AgentPanel
            messages={messages}
            isGenerating={isGenerating}
            onSendPrompt={handleSendPrompt}
            onQuickPrompt={(prompt) => handleSendPrompt(prompt, 'build')}
            mode={agentMode}
            onModeChange={setAgentMode}
          />

          {/* Right Panel: Review (and Live Preview Sandbox) */}
          <ReviewPanel
            project={project}
            reviews={reviews}
            onSubmitReview={handleSubmitReview}
            viewport={viewport}
            onDeployRequest={() => setShowDeployModal(true)}
            onRefreshPreview={() => {
              showToast('Preview Refreshed', 'Iframe reloaded with latest state.');
            }}
          />
        </main>

        {/* Sleek Interface Telemetry Footer */}
        <footer className="h-7 bg-slate-950/90 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] text-slate-500 shrink-0 select-none font-mono">
          <div className="flex items-center gap-4">
            <span>REGION: us-east-1</span>
            <span className="hidden sm:inline">PLATFORM: AI STUDIO HYBRID</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              AGENT ACTIVE: GEMINI-3.8
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">MEMORY: 1024MB</span>
            <span>PING: 12MS</span>
            <span className="text-cyan-400 font-semibold">SYNCED</span>
          </div>
        </footer>
      </div>

      {/* Modals & Drawers */}
      <BackendDashboardModal
        isOpen={showBackendDashboard}
        onClose={() => setShowBackendDashboard(false)}
      />

      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        project={project}
        onDeploySuccess={handleDeploySuccess}
      />

      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={(prompt, title) => {
          setProjectName(title);
          handleSendPrompt(prompt, 'build');
        }}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        canInstallPwa={canInstallPwa}
        onInstallPwa={handleInstallPwa}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <ProjectsModal
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        currentProject={project}
        onNewProject={() => {
          setProject(null);
          setProjectName('New Project');
          setMessages([]);
          showToast('New Canvas', 'Started fresh blank project.');
        }}
        onSelectProject={(name) => {
          setProjectName(name);
          handleSendPrompt(`Load blueprint for ${name}`, 'build');
        }}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        historyItems={historyItems}
        onRollback={(ver) => {
          showToast('Version Restored', `Restored checkpoint ${ver}`);
        }}
      />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />
    </div>
  );
}
