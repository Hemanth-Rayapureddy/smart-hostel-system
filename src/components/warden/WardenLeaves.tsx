import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LeaveRequest, LeaveStatus } from '../../types';
import { localStore } from '../../lib/supabase';
import { FileText, CheckCircle2, XCircle, Calendar, User } from 'lucide-react';
import { Badge } from '../common/Badge';

export const WardenLeaves: React.FC = () => {
  const { addNotification } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => localStore.getLeaves());
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

  const handleAction = (id: string, newStatus: LeaveStatus) => {
    const wardenRemarks = remarksMap[id] || (newStatus === 'approved' ? 'Approved by Warden office.' : 'Rejected.');

    const all = localStore.getLeaves();
    const updated = all.map((l) => {
      if (l.id === id) {
        return { ...l, status: newStatus, wardenRemarks };
      }
      return l;
    });

    localStore.setLeaves(updated);
    setLeaves(updated);

    const target = all.find((l) => l.id === id);
    if (target) {
      addNotification(
        target.studentId,
        `Leave Request ${newStatus.toUpperCase()}`,
        `Your out-pass request (${target.startDate} to ${target.endDate}) has been ${newStatus}. Remarks: ${wardenRemarks}`,
        'leave'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Leave & Out-Pass Approvals</h2>
        <p className="text-xs text-gray-500">Review student leave applications and grant out-pass permission</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {leaves.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-500">No leave requests in system.</p>
        ) : (
          leaves.map((l) => (
            <div key={l.id} className="p-5 space-y-3 hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-gray-900">{l.studentName}</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {l.block} - Room {l.roomNumber}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Leave Duration: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong>
                  </p>
                </div>
                <Badge status={l.status} />
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700">
                <strong>Reason:</strong> {l.reason}
              </div>

              {l.status === 'pending' ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                  <input
                    type="text"
                    placeholder="Warden approval remarks..."
                    value={remarksMap[l.id] || ''}
                    onChange={(e) => setRemarksMap({ ...remarksMap, [l.id]: e.target.value })}
                    className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900 flex-1 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction(l.id, 'rejected')}
                      className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleAction(l.id, 'approved')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Out-Pass</span>
                    </button>
                  </div>
                </div>
              ) : (
                l.wardenRemarks && (
                  <p className="text-xs text-gray-600 font-medium pt-1">
                    <strong>Warden Remarks:</strong> {l.wardenRemarks}
                  </p>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
