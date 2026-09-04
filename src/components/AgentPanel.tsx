import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Paperclip,
  Send,
  Sparkles,
  CheckCircle2,
  Terminal,
  FileCode2,
  Loader2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AgentMessage } from '../types';

interface AgentPanelProps {
  messages: AgentMessage[];
  isGenerating: boolean;
  onSendPrompt: (prompt: string, mode: 'chat' | 'build', attachment?: string) => void;
  onQuickPrompt: (prompt: string) => void;
  mode: 'chat' | 'build';
  onModeChange: (mode: 'chat' | 'build') => void;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  messages,
  isGenerating,
  onSendPrompt,
  onQuickPrompt,
  mode,
  onModeChange,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Voice Speech-to-Text using Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your prompt.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Also handles English
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Voice API initialization error:', err);
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file.name);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() && !attachedFile) return;
    if (isGenerating) return;

    onSendPrompt(inputVal.trim(), mode, attachedFile || undefined);
    setInputVal('');
    setAttachedFile(null);
  };

  const samplePrompts = [
    { label: 'Fintech Banking Hub', prompt: 'Build a fintech banking dashboard with balance cards, transaction feed, send money modal, and real-time spending charts.' },
    { label: 'E-commerce Store', prompt: 'Build a modern responsive e-commerce web app with product catalogue, filtering by category, shopping cart drawer, and checkout summary.' },
    { label: 'SaaS Analytics CRM', prompt: 'Build a full-stack SaaS CRM workspace with lead pipeline, interactive Kanban boards, activity timeline, and client database management.' },
    { label: 'Food Delivery Bistro', prompt: 'Build a gourmet food ordering web app with menu items, cart drawer, order tracking timeline, and customer review submission.' },
  ];

  const hasContent = messages.length > 0;

  return (
    <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl relative backdrop-blur-xs">
      {/* Panel Top Header */}
      <div className="h-14 px-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-white font-bold text-sm tracking-wide">AI Agent</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>

        {/* Chat / Build Toggle Switch */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400 font-medium">Chat / Build</span>
          <button
            id="agent-mode-toggle"
            type="button"
            onClick={() => onModeChange(mode === 'chat' ? 'build' : 'chat')}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
              mode === 'build' ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                mode === 'build' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Panel Body Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {!hasContent ? (
          /* Empty State exactly matching the screenshot */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Build your website
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-8">
                Describe what you want to create.
              </p>

              {/* Helpful quick template pills */}
              <div className="space-y-2 text-left">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 text-center font-mono">
                  Quick Start Inspirations
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {samplePrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickPrompt(item.prompt)}
                      className="group p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 text-left transition flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {item.prompt}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Agent Chat & Generation Timeline */
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] bg-slate-900 border border-slate-700 text-slate-100 rounded-xl rounded-tr-xs px-4 py-3 text-sm shadow-md">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] text-slate-400 block mt-1 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="max-w-[92%] bg-slate-950/80 border border-slate-800 rounded-xl rounded-tl-xs p-4 text-sm text-slate-200 shadow-lg space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>NAVIN AUTONOMOUS AGENT</span>
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                      {msg.text}
                    </p>

                    {/* Agent Thought Steps */}
                    {msg.thoughtSteps && msg.thoughtSteps.length > 0 && (
                      <div className="mt-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AGENT EXECUTION PIPELINE</span>
                        </div>
                        {msg.thoughtSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-cyan-400/90">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quality & Files Badge */}
                    {msg.qualityScore && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          QUALITY SCORE: {msg.qualityScore}/100
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 font-mono">
                          <FileCode2 className="w-3 h-3 text-slate-400" />
                          ERROR-FREE BUILD
                        </span>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-500 block font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex flex-col items-start space-y-2">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-sm text-slate-200 shadow-lg flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-cyan-300 font-medium text-xs font-mono">
                    Autonomous agent is synthesizing web components, backend state & quality review...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area matching screenshot */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800">
        {attachedFile && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-400 flex items-center justify-between">
            <span className="truncate font-mono">📎 Attached: {attachedFile}</span>
            <button
              onClick={() => setAttachedFile(null)}
              className="text-slate-400 hover:text-white text-xs ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative bg-slate-900/90 border border-slate-700 focus-within:border-cyan-500/80 rounded-xl p-2.5 transition-all shadow-inner"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.txt,.json,.md,.html,.tsx"
          />

          <input
            id="agent-prompt-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isListening
                ? 'Listening... Speak your prompt now...'
                : 'Describe your website...'
            }
            disabled={isGenerating}
            className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-1.5">
              {/* Mic Icon */}
              <button
                type="button"
                onClick={handleToggleVoice}
                title={isListening ? 'Stop listening' : 'Speak prompt (Voice recognition)'}
                className={`p-2 rounded-lg transition ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Attachment Icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image or file reference"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Send Arrow Button */}
            <button
              id="agent-submit-btn"
              type="submit"
              disabled={isGenerating || (!inputVal.trim() && !attachedFile)}
              className="p-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 transition font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
