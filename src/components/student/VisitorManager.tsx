import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, VisitorRequest } from '../../types';
import { localStore } from '../../lib/supabase';
import { Users, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const VisitorManager: React.FC = () => {
  const { currentUser, addNotification } = useAuth();
  const student = currentUser as StudentProfile;

  const [visitors, setVisitors] = useState<VisitorRequest[]>(() =>
    localStore.getVisitors().filter((v) => v.studentId === student.id)
  );

  const [showModal, setShowModal] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [purpose, setPurpose] = useState('');

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !relationship || !visitDate || !expectedTime || !purpose) return;

    const newReq: VisitorRequest = {
      id: 'v_' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      block: student.hostelBlock,
      roomNumber: student.roomNumber,
      visitorName,
      relationship,
      visitDate,
      expectedTime,
      purpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const all = localStore.getVisitors();
    localStore.setVisitors([newReq, ...all]);
    setVisitors([newReq, ...visitors]);

    addNotification(
      'warden',
      'New Visitor Pass Request',
      `${student.fullName} requested visitor out-pass for ${visitorName} (${relationship}) on ${visitDate}.`,
      'visitor'
    );

    setShowModal(false);
    setVisitorName('');
    setRelationship('');
    setVisitDate('');
    setExpectedTime('');
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Visitor Gate Passes</h2>
          <p className="text-xs text-gray-500">Register parents/guests visiting your hostel block</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Visitor Pass Request</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {visitors.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-semibold text-gray-600">No visitor requests</p>
            <p className="text-[11px] text-gray-400">Click the button above to request visitor entry permission.</p>
          </div>
        ) : (
          visitors.map((v) => (
            <div key={v.id} className="p-5 hover:bg-gray-50/60 transition-colors space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{v.visitorName}</h4>
                  <p className="text-xs text-gray-500">
                    Relationship: {v.relationship} • Visit Date: {v.visitDate} ({v.expectedTime})
                  </p>
                </div>
                <Badge status={v.status} />
              </div>

              <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <strong>Purpose:</strong> {v.purpose}
              </p>

              {v.wardenRemarks && (
                <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-900 p-2 rounded-xl">
                  <strong>Warden Remarks:</strong> {v.wardenRemarks}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Visitor Pass Request
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Father, Mother, Guardian, Sibling"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Expected Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:00 PM"
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Purpose of Visit</label>
                <textarea
                  required
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md"
                >
                  Submit Pass Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
