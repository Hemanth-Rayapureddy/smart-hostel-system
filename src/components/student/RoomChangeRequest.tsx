import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, RoomChangeRequest as RoomChangeType } from '../../types';
import { localStore } from '../../lib/supabase';
import { RotateCcw, Plus, Home, Send } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RoomChangeRequest: React.FC = () => {
  const { currentUser, addNotification } = useAuth();
  const student = currentUser as StudentProfile;

  const [requests, setRequests] = useState<RoomChangeType[]>(() =>
    localStore.getRoomChangeRequests().filter((r) => r.studentId === student.id)
  );

  const [reasonCategory, setReasonCategory] = useState<RoomChangeType['reasonCategory']>('roommate');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    const newReq: RoomChangeType = {
      id: 'rc_' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      currentRoomId: 'r1',
      currentRoomNumber: student.roomNumber,
      block: student.hostelBlock,
      reasonCategory,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const all = localStore.getRoomChangeRequests();
    localStore.setRoomChangeRequests([newReq, ...all]);
    setRequests([newReq, ...requests]);

    addNotification(
      'warden',
      'New Room Transfer Application',
      `${student.fullName} (${student.hostelBlock} - ${student.roomNumber}) requested room transfer.`,
      'leave'
    );

    setDetails('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Room Transfer Application</h2>
        <p className="text-xs text-gray-500">Apply for formal room reassignment to the warden office</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Primary Reason Category</label>
          <select
            value={reasonCategory}
            onChange={(e) => setReasonCategory(e.target.value as any)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium text-gray-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="roommate">Roommate Conflict / Compatibility</option>
            <option value="maintenance">Room Maintenance / Noise Issue</option>
            <option value="study">Quiet Study Environment Requirement</option>
            <option value="health">Medical / Physical Accessibility Reason</option>
            <option value="other">Other Personal Reason</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Detailed Justification</label>
          <textarea
            required
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Explain why you are requesting room transfer..."
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-between items-center pt-2">
          {isSubmitted && (
            <span className="text-emerald-600 font-bold">Application submitted to Warden!</span>
          )}
          <button
            type="submit"
            className="ml-auto flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Application</span>
          </button>
        </div>
      </form>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50 font-bold text-xs text-gray-700">Application History</div>
        {requests.length === 0 ? (
          <p className="p-4 text-center text-xs text-gray-500">No active room transfer applications.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="p-4 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 capitalize">Reason: {r.reasonCategory}</span>
                <Badge status={r.status} />
              </div>
              <p className="text-gray-600">{r.details}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
