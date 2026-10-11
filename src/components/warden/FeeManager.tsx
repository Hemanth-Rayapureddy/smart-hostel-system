import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FeeRecord } from '../../types';
import { localStore } from '../../lib/supabase';
import { DollarSign, CheckCircle2, Plus, Edit2, X } from 'lucide-react';
import { Badge } from '../common/Badge';

export const FeeManager: React.FC = () => {
  const { allStudents, addNotification } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>(() => localStore.getFees());
  const [showAddModal, setShowAddModal] = useState(false);

  // New Fee Form
  const [studentId, setStudentId] = useState('');
  const [academicTerm, setAcademicTerm] = useState('Fall Semester 2026');
  const [totalAmount, setTotalAmount] = useState(45000);
  const [dueDate, setDueDate] = useState('');

  const handleRecordPayment = (id: string, newPaid: number) => {
    const all = localStore.getFees();
    const updated = all.map((f) => {
      if (f.id === id) {
        const isFull = newPaid >= f.totalAmount;
        const status = isFull ? ('paid' as const) : newPaid > 0 ? ('partial' as const) : ('pending' as const);
        return { ...f, paidAmount: newPaid, status };
      }
      return f;
    });

    localStore.setFees(updated);
    setFees(updated);

    const target = all.find((f) => f.id === id);
    if (target) {
      addNotification(
        target.studentId,
        'Fee Payment Receipt Recorded',
        `Payment of ₹${newPaid.toLocaleString('en-IN')} updated for ${target.academicTerm}.`,
        'fee'
      );
    }
  };

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const st = allStudents.find((s) => s.id === studentId);
    if (!st || !dueDate) return;

    const newFee: FeeRecord = {
      id: 'f_' + Date.now(),
      studentId: st.id,
      studentName: st.fullName,
      academicTerm,
      totalAmount,
      paidAmount: 0,
      dueDate,
      status: 'pending',
    };

    const updated = [newFee, ...fees];
    localStore.setFees(updated);
    setFees(updated);

    addNotification(
      st.id,
      'New Hostel Fee Demand Issued',
      `Fee demand of ₹${totalAmount.toLocaleString('en-IN')} issued for ${academicTerm}. Due on ${dueDate}.`,
      'fee'
    );

    setShowAddModal(false);
    setDueDate('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Fee Records Management</h2>
          <p className="text-xs text-gray-500">Track and record resident fee payment status across academic terms</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Fee Demand</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50 font-bold text-xs text-gray-700 grid grid-cols-5 gap-2">
          <span>Resident Name</span>
          <span>Academic Term</span>
          <span>Total Fee</span>
          <span>Paid Amount</span>
          <span>Status & Action</span>
        </div>

        {fees.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-400">No fee records found.</p>
        ) : (
          fees.map((f) => (
            <div key={f.id} className="p-4 grid grid-cols-5 gap-2 items-center text-xs hover:bg-gray-50/60 transition-colors">
              <span className="font-bold text-gray-900">{f.studentName}</span>
              <span className="text-gray-600">{f.academicTerm}</span>
              <span className="font-bold text-gray-900">₹{f.totalAmount.toLocaleString('en-IN')}</span>
              <span className="font-semibold text-emerald-700">₹{f.paidAmount.toLocaleString('en-IN')}</span>
              <div className="flex items-center space-x-2">
                <Badge status={f.status} />
                {f.status !== 'paid' && (
                  <button
                    onClick={() => handleRecordPayment(f.id, f.totalAmount)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Fee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Issue Fee Demand to Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Student *</label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-medium"
                >
                  <option value="">-- Choose Resident --</option>
                  {allStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.hostelBlock} - R{st.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Academic Term *</label>
                <input
                  type="text"
                  required
                  value={academicTerm}
                  onChange={(e) => setAcademicTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Amount (₹) *</label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!studentId || !dueDate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-md"
                >
                  Issue Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
