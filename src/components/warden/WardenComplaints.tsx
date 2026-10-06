import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../types';
import { localStore } from '../../lib/supabase';
import { AlertCircle, Filter, CheckCircle2, UserCheck, EyeOff, Image, ArrowUpRight, Flame } from 'lucide-react';
import { Badge } from '../common/Badge';

export const WardenComplaints: React.FC = () => {
  const { addNotification } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>(() => localStore.getComplaints());

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Filtered list
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (blockFilter !== 'all' && c.block !== blockFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  const handleUpdateStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    workerName?: string
  ) => {
    const all = localStore.getComplaints();
    const updated = all.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: newStatus,
          assignedTo: workerName || c.assignedTo,
          resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : c.resolvedAt,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    localStore.setComplaints(updated);
    setComplaints(updated);

    const target = all.find((c) => c.id === complaintId);
    if (target && !target.isAnonymous) {
      addNotification(
        target.studentId,
        `Complaint Ticket Updated: ${target.ticketNumber}`,
        `Your complaint status has been updated to ${newStatus.toUpperCase()}${
          workerName ? ` (Assigned to: ${workerName})` : ''
        }.`,
        'complaint'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Complaints Hub</h2>
          <p className="text-xs text-gray-500">Manage student maintenance requests, worker assignments & escalation</p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-gray-500 font-semibold mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-medium capitalize"
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
          <label className="block text-gray-500 font-semibold mb-1">Filter by Hostel Block</label>
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-medium"
          >
            <option value="all">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
            <option value="Block D">Block D</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 font-semibold mb-1">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-medium capitalize"
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
                      <span className="text-xs font-semibold text-gray-700">Student: {cmp.studentName}</span>
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
                    className="flex items-center space-x-1.5 text-xs text-blue-600 font-semibold hover:underline"
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

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full bg-white p-4 rounded-2xl">
            <img src={selectedPhoto} alt="Proof" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-3 w-full py-2 bg-gray-800 text-white font-bold text-xs rounded-xl"
            >
              Close Image Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
