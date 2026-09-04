import React from 'react';
import { FileText, X, ArrowRight, Sparkles } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string, title: string) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'fintech',
      title: 'Fintech Banking & Wealth Hub',
      category: 'Finance',
      description: 'Interactive banking dashboard with account cards, transaction history, money transfer modal, and spending analytics charts.',
      prompt: 'Build a fintech banking dashboard with account balances, debit cards, transaction feed, transfer modal, and spending analytics charts.',
      color: 'cyan',
    },
    {
      id: 'ecommerce',
      title: 'LuxeMart Modern E-Commerce',
      category: 'Commerce',
      description: 'Online store with hero banner, category filters, interactive shopping cart drawer, product details, and checkout flow.',
      prompt: 'Build a modern e-commerce web app with product filters, shopping cart drawer, total calculator, and checkout modal.',
      color: 'blue',
    },
    {
      id: 'saas-crm',
      title: 'FlowWork SaaS & Lead CRM',
      category: 'Productivity',
      description: 'CRM workspace with kanban stage columns, contact database, activity timeline, and task checklist.',
      prompt: 'Build a SaaS CRM workspace with drag-and-drop styled lead pipeline, contact list, task manager, and activity logs.',
      color: 'purple',
    },
    {
      id: 'portfolio',
      title: 'Minimalist Designer Portfolio',
      category: 'Creative',
      description: 'Clean portfolio with project showcase gallery, interactive modal preview, resume experience, and contact form.',
      prompt: 'Build a high-contrast minimalist portfolio website with project showcase, skills breakdown, resume timeline, and working contact form.',
      color: 'cyan',
    },
    {
      id: 'restaurant',
      title: 'Gourmet Bistro & Food Delivery',
      category: 'Hospitality',
      description: 'Interactive restaurant menu, food customization drawer, order checkout, and customer reviews.',
      prompt: 'Build a restaurant food delivery web app with delicious dish menu, cart drawer, estimated delivery timer, and reviews.',
      color: 'amber',
    },
    {
      id: 'crypto',
      title: 'Apex Web3 Crypto Portfolio',
      category: 'Web3',
      description: 'Crypto token tracker with live price charts, swap simulation modal, and wallet assets overview.',
      prompt: 'Build a crypto token tracker dashboard with token prices, interactive swap exchange interface, and asset breakdown.',
      color: 'cyan',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Pre-Engineered Application Templates
              </h2>
              <p className="text-xs text-slate-400">
                Pick a certified blueprint to generate complete error-free applications in seconds.
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

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
                    {tpl.category}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500/40 group-hover:text-cyan-400 transition" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition tracking-tight">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectTemplate(tpl.prompt, tpl.title);
                  onClose();
                }}
                className="mt-4 py-2 px-3 rounded-lg bg-slate-800 group-hover:bg-cyan-500 text-slate-300 group-hover:text-slate-950 font-bold text-xs flex items-center justify-between transition font-mono"
              >
                <span>GENERATE TEMPLATE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
