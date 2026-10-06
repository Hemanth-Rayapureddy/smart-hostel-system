import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FeeRecord } from '../../types';
import { localStore } from '../../lib/supabase';
import { DollarSign, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const FeeManager: React.FC = () => {
  const { addNotification } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>(() => localStore.getFees());

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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Hostel Fee Records Management</h2>
        <p className="text-xs text-gray-500">Track and record resident fee payment status</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50 font-bold text-xs text-gray-700 grid grid-cols-5 gap-2">
          <span>Student Name</span>
          <span>Academic Term</span>
          <span>Total Fee</span>
          <span>Paid Amount</span>
          <span>Status Action</span>
        </div>

        {fees.map((f) => (
          <div key={f.id} className="p-4 grid grid-cols-5 gap-2 items-center text-xs">
            <span className="font-bold text-gray-900">{f.studentName}</span>
            <span className="text-gray-600">{f.academicTerm}</span>
            <span className="font-bold text-gray-900">₹{f.totalAmount.toLocaleString('en-IN')}</span>
            <span className="font-semibold text-emerald-700">₹{f.paidAmount.toLocaleString('en-IN')}</span>
            <div className="flex items-center space-x-2">
              <Badge status={f.status} />
              {f.status !== 'paid' && (
                <button
                  onClick={() => handleRecordPayment(f.id, f.totalAmount)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px]"
                >
                  Mark Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
