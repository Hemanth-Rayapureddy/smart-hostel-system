import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VisitorRequest, VisitorStatus } from '../../types';
import { localStore } from '../../lib/supabase';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const VisitorApprovals: React.FC = () => {
  const { addNotification } = useAuth();
  const [visitors, setVisitors] = useState<VisitorRequest[]>(() => localStore.getVisitors());

  const handleAction = (id: string, status: VisitorStatus) => {
    const all = localStore.getVisitors();
    const updated = all.map((v) => (v.id === id ? { ...v, status } : v));
    localStore.setVisitors(updated);
    setVisitors(updated);

    const target = all.find((v) => v.id === id);
    if (target) {
      addNotification(
        target.studentId,
        `Visitor Pass Request ${status.toUpperCase()}`,
        `Your visitor pass for ${target.visitorName} on ${target.visitDate} has been ${status}.`,
        'visitor'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Visitor Pass Approvals</h2>
        <p className="text-xs text-gray-500">Review parent and guest visitor requests</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {visitors.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-500">No visitor requests filed.</p>
        ) : (
          visitors.map((v) => (
            <div key={v.id} className="p-5 space-y-2 hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{v.visitorName}</h4>
                  <p className="text-xs text-gray-500">
                    Visiting Student: <strong>{v.studentName}</strong> ({v.block} - R{v.roomNumber})
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    Relationship: {v.relationship} • Date: {v.visitDate} ({v.expectedTime})
                  </p>
                </div>
                <Badge status={v.status} />
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs text-gray-700">
                <strong>Purpose:</strong> {v.purpose}
              </div>

              {v.status === 'pending' && (
                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleAction(v.id, 'rejected')}
                    className="px-3 py-1.5 bg-rose-100 text-rose-800 font-bold rounded-xl text-xs"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(v.id, 'approved')}
                    className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    Approve Gate Pass
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
