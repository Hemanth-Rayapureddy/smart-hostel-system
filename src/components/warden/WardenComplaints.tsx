import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../types';
import { localStore, supabaseApi } from '../../lib/supabase';
import {
  AlertCircle,
  Filter,
  CheckCircle2,
  UserCheck,
  EyeOff,
  Image,
  ArrowUpRight,
  Flame,
  Clock,
  Settings,
  RefreshCw,
  X,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const WardenComplaints: React.FC = () => {
  const { addNotification } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>(() => localStore.getComplaints());
  const [escalationHours, setEscalationHours] = useState<number>(() => localStore.getEscalationHours());

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempHours, setTempHours] = useState(escalationHours);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Sync with live Supabase complaints table
  useEffect(() => {
    async function syncRemote() {
      const remote = await supabaseApi.fetchComplaints();
      if (remote && remote.length > 0) {
        setComplaints((prev) => {
          const map = new Map(prev.map((c) => [c.ticketNumber, c]));
          remote.forEach((r) => map.set(r.ticketNumber, r));
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    }
    syncRemote();
  }, []);

  // Filtered list
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (blockFilter !== 'all' && c.block !== blockFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  const escalatedComplaints = complaints.filter((c) => c.status === 'escalated');

  // Trigger Automatic Escalation Scan
  const handleScanAndEscalate = () => {
    const now = Date.now();
    const thresholdMs = escalationHours * 3600 * 1000;
    let escalatedCount = 0;

    const all = localStore.getComplaints();
    const updated = all.map((c) => {
      if (c.status !== 'resolved' && c.status !== 'escalated') {
        const createdMs = new Date(c.createdAt).getTime();
        if (now - createdMs > thresholdMs) {
          escalatedCount++;
          // Update in Supabase
          supabaseApi.updateComplaint(c.ticketNumber, {
            status: 'escalated',
            escalatedAt: new Date().toISOString(),
          });
          return {
            ...c,
            status: 'escalated' as ComplaintStatus,
            escalatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return c;
    });

    if (escalatedCount > 0) {
      localStore.setComplaints(updated);
      setComplaints(updated);
      setScanMessage(`⚠️ ${escalatedCount} complaint(s) exceeded ${escalationHours}h threshold and were automatically escalated!`);
      addNotification(
        'warden',
        'Automatic Complaint Escalation Triggered',
        `${escalatedCount} unresolved complaint(s) exceeded the ${escalationHours}-hour threshold and have been escalated to High Priority.`,
        'complaint'
      );
    } else {
      setScanMessage(`✓ All complaints are within the configured ${escalationHours}-hour resolution timeframe.`);
    }

    setTimeout(() => setScanMessage(null), 5000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStore.setEscalationHours(tempHours);
    setEscalationHours(tempHours);
    setShowConfigModal(false);
  };

  const handleUpdateStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    workerName?: string
  ) => {
    const all = localStore.getComplaints();
    const target = all.find((c) => c.id === complaintId);

    const updated = all.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: newStatus,
          assignedTo: workerName !== undefined ? workerName : c.assignedTo,
          resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : c.resolvedAt,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    localStore.setComplaints(updated);
    setComplaints(updated);

    if (target) {
      // Sync update to Supabase
      supabaseApi.updateComplaint(target.ticketNumber, {
        status: newStatus,
        assignedTo: workerName,
      });

      if (!target.isAnonymous) {
        addNotification(
          target.studentId,
          `Complaint Ticket Updated: ${target.ticketNumber}`,
          `Your complaint status has been updated to ${newStatus.toUpperCase()}${
            workerName ? ` (Assigned to: ${workerName})` : ''
          }.`,
          'complaint'
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Complaints & Maintenance Hub</h2>
          <p className="text-xs text-gray-500">
            Manage resident repair tickets, auto-escalation timer ({escalationHours}h threshold), and worker assignment
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleScanAndEscalate}
            className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-rose-200 transition-all"
            title="Scan tickets older than threshold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Escalations</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
            <span>Escalation Config ({escalationHours}h)</span>
          </button>
        </div>
      </div>

      {/* Auto Scan Feedback Banner */}
      {scanMessage && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 animate-in fade-in duration-150">
          {scanMessage}
        </div>
      )}

      {/* PROMINENT ESCALATED COMPLAINTS SECTION */}
      {escalatedComplaints.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-rose-900 font-black text-sm">
            <Flame className="w-5 h-5 text-rose-600 animate-bounce" />
            <span>🔥 {escalatedComplaints.length} COMPLAINT(S) HAVE BEEN ESCALATED DUE TO INACTION!</span>
          </div>
          <p className="text-xs text-rose-800 font-medium">
            The following complaints have remained unresolved beyond the {escalationHours}-hour service level threshold and require immediate warden attention:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {escalatedComplaints.map((esc) => (
              <div key={esc.id} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs text-rose-700">{esc.ticketNumber}</span>
                  <Badge status="ESCALATED" />
                </div>
                <h4 className="font-bold text-xs text-gray-900">{esc.title}</h4>
                <p className="text-[11px] text-gray-600">{esc.block} - Room {esc.roomNumber}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-gray-500 font-bold mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-medium capitalize outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated (Urgent)</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 font-bold mb-1">Filter by Hostel Block</label>
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-medium outline-none"
          >
            <option value="all">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
            <option value="Block D">Block D</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 font-bold mb-1">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-medium capitalize outline-none"
          >
            <option value="all">All Categories</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="plumbing">Plumbing</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="food">Food</option>
            <option value="maintenance">Maintenance</option>
            <option value="internet">Internet</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Complaints Table / List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-500">No complaints matching selected filters.</p>
        ) : (
          filtered.map((cmp) => (
            <div
              key={cmp.id}
              className={`p-5 space-y-3 transition-colors ${
                cmp.status === 'escalated' ? 'bg-rose-50/50 border-l-4 border-rose-500' : 'hover:bg-gray-50/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {cmp.ticketNumber}
                    </span>
                    <Badge status={cmp.category} />

                    {cmp.isAnonymous ? (
                      <span className="flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        <EyeOff className="w-3 h-3" />
                        <span>Anonymous Student</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-700">Resident: {cmp.studentName}</span>
                    )}

                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      {cmp.block} - Room {cmp.roomNumber}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">{cmp.title}</h4>
                </div>

                <Badge status={cmp.status} />
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium">
                {cmp.description}
              </p>

              {cmp.photoUrl && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedPhoto(cmp.photoUrl || null)}
                    className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold hover:underline"
                  >
                    <Image className="w-4 h-4" />
                    <span>View Attached Proof Image</span>
                  </button>
                </div>
              )}

              {/* Action Controls for Warden */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 font-medium">Assigned Worker:</span>
                  <input
                    type="text"
                    defaultValue={cmp.assignedTo || ''}
                    placeholder="Enter technician name..."
                    onBlur={(e) => handleUpdateStatus(cmp.id, cmp.status, e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(cmp.id, 'escalated')}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg text-[11px] flex items-center space-x-1"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Escalate Ticket</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(cmp.id, 'in_progress')}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px]"
                  >
                    Set In Progress
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(cmp.id, 'resolved')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CONFIGURATION MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Configure Escalation Time</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Escalation Threshold (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={tempHours}
                  onChange={(e) => setTempHours(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Complaints unresolved for more than this number of hours will automatically transition to Escalated.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Threshold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="max-w-2xl w-full bg-white p-4 rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Proof" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-3 w-full py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl"
            >
              Close Image Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
