import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, LeaveRequest } from '../../types';
import { localStore } from '../../lib/supabase';
import { FileText, Plus, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const LeaveManager: React.FC = () => {
  const { currentUser, addNotification } = useAuth();
  const student = currentUser as StudentProfile;

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() =>
    localStore.getLeaves().filter((l) => l.studentId === student.id)
  );

  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    const newLeave: LeaveRequest = {
      id: 'l_' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      block: student.hostelBlock,
      roomNumber: student.roomNumber,
      startDate,
      endDate,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const allLeaves = localStore.getLeaves();
    const updated = [newLeave, ...allLeaves];
    localStore.setLeaves(updated);
    setLeaves([newLeave, ...leaves]);

    // Notify warden of new leave request
    addNotification(
      'warden',
      'New Leave Request Submitted',
      `${student.fullName} (${student.hostelBlock} - ${student.roomNumber}) requested leave from ${startDate} to ${endDate}.`,
      'leave'
    );

    setShowModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leave & Out-Pass Requests</h2>
          <p className="text-xs text-gray-500">Apply for hostel permission and track approval status</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Apply Out-Pass / Leave</span>
        </button>
      </div>

      {/* List of Leave Requests */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {leaves.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-semibold text-gray-600">No leave requests found</p>
            <p className="text-[11px] text-gray-400">Click the button above to submit your out-pass request.</p>
          </div>
        ) : (
          leaves.map((leave) => (
            <div key={leave.id} className="p-5 hover:bg-gray-50/60 transition-colors space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">
                      {leave.startDate} to {leave.endDate}
                    </h4>
                    <p className="text-[11px] text-gray-500">Submitted on {new Date(leave.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge status={leave.status} />
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 font-medium">
                <strong>Reason:</strong> {leave.reason}
              </div>

              {leave.wardenRemarks && (
                <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl">
                  <strong>Warden Remarks:</strong> {leave.wardenRemarks}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal for Creating Leave Request */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Submit Out-Pass / Leave Application
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Expected Return Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide valid reason (e.g., Home visit, Medical checkup)..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
