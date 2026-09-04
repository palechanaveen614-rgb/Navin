import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  Plus,
  Server,
  Activity,
  ShieldCheck,
  Search,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface BackendDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDashboardModal: React.FC<BackendDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTable, setActiveTable] = useState<'users' | 'products' | 'orders' | 'logs'>('users');
  const [tablesData, setTablesData] = useState<any>({
    users: [],
    products: [],
    orders: [],
    logs: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordDetail, setNewRecordDetail] = useState('');

  const fetchDbData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/backend/db');
      const data = await res.json();
      if (data.success && data.data) {
        setTablesData(data.data);
      }
    } catch (err) {
      console.error('Error fetching database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordName.trim()) return;

    try {
      const payload: any = {};
      if (activeTable === 'users') {
        payload.name = newRecordName.trim();
        payload.email = newRecordDetail.trim() || `${newRecordName.toLowerCase().replace(/\s+/g, '')}@example.com`;
        payload.role = 'Member';
        payload.status = 'Active';
      } else if (activeTable === 'products') {
        payload.title = newRecordName.trim();
        payload.price = newRecordDetail.trim() || '$19.00';
        payload.category = 'Service';
        payload.activeUsers = 1;
        payload.status = 'Published';
      } else if (activeTable === 'orders') {
        payload.customer = newRecordName.trim();
        payload.item = newRecordDetail.trim() || 'Custom Plan';
        payload.amount = '$49.00';
        payload.status = 'Completed';
      }

      const res = await fetch(`/api/backend/db/${activeTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setNewRecordName('');
        setNewRecordDetail('');
        setShowAddForm(false);
        fetchDbData();
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const currentRecords = (tablesData[activeTable] || []).filter((item: any) => {
    if (!searchTerm) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
                Backend Database & Performance Management
              </h2>
              <p className="text-xs text-slate-400">
                High-performance real-time data store with sub-millisecond memory execution.
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

        {/* Real-Time Performance Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 border-b border-slate-800">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 font-mono">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Memory Latency</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">0.8 ms</div>
            <div className="text-[10px] text-cyan-400">Instant IOPS Cache</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 font-mono">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Server Uptime</span>
              <Server className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">99.99%</div>
            <div className="text-[10px] text-cyan-400">Asia-Southeast Edge</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 font-mono">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>SSL Encryption</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">TLS 1.3</div>
            <div className="text-[10px] text-cyan-400">Automated Certificates</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 font-mono">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Integrations</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">AI Studio + Lovable</div>
            <div className="text-[10px] text-cyan-400">Real-time Automation</div>
          </div>
        </div>

        {/* Database Collections Tabs & Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 w-full sm:w-auto">
            {(['users', 'products', 'orders', 'logs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTable(tab);
                  setShowAddForm(false);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                  activeTable === tab
                    ? 'bg-slate-800 text-cyan-400 shadow-xs border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {tab} ({tablesData[tab]?.length || 0})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search records..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>

            {activeTable !== 'logs' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            )}

            <button
              onClick={fetchDbData}
              title="Refresh database records"
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Add Record Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddRecord}
            className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center gap-3"
          >
            <input
              type="text"
              required
              placeholder={activeTable === 'users' ? 'Full Name' : activeTable === 'products' ? 'Product Title' : 'Customer Name'}
              value={newRecordName}
              onChange={(e) => setNewRecordName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 flex-1 min-w-[160px]"
            />
            <input
              type="text"
              placeholder={activeTable === 'users' ? 'Email Address' : activeTable === 'products' ? 'Price (e.g. $29)' : 'Plan / Item'}
              value={newRecordDetail}
              onChange={(e) => setNewRecordDetail(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 flex-1 min-w-[160px]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Save to DB
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Records Table View */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950">
          {activeTable === 'logs' ? (
            <div className="space-y-1.5 font-mono text-xs">
              {currentRecords.map((log: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        log.level === 'SUCCESS'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span>{log.event}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-2.5 px-4">ID</th>
                    {activeTable === 'users' && (
                      <>
                        <th className="py-2.5 px-4">Name</th>
                        <th className="py-2.5 px-4">Email</th>
                        <th className="py-2.5 px-4">Role</th>
                        <th className="py-2.5 px-4">Status</th>
                      </>
                    )}
                    {activeTable === 'products' && (
                      <>
                        <th className="py-2.5 px-4">Title</th>
                        <th className="py-2.5 px-4">Price</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Status</th>
                      </>
                    )}
                    {activeTable === 'orders' && (
                      <>
                        <th className="py-2.5 px-4">Customer</th>
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4">Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                  {currentRecords.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-900/50 transition">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                        {row.id}
                      </td>
                      {activeTable === 'users' && (
                        <>
                          <td className="py-2.5 px-4 font-medium text-white">{row.name}</td>
                          <td className="py-2.5 px-4 text-slate-400">{row.email}</td>
                          <td className="py-2.5 px-4">{row.role}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold font-mono">
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTable === 'products' && (
                        <>
                          <td className="py-2.5 px-4 font-medium text-white">{row.title}</td>
                          <td className="py-2.5 px-4 font-bold text-cyan-400 font-mono">{row.price}</td>
                          <td className="py-2.5 px-4 text-slate-400">{row.category}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold font-mono">
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTable === 'orders' && (
                        <>
                          <td className="py-2.5 px-4 font-medium text-white">{row.customer}</td>
                          <td className="py-2.5 px-4 text-slate-400">{row.item}</td>
                          <td className="py-2.5 px-4 font-bold text-cyan-400 font-mono">{row.amount}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold font-mono">
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
