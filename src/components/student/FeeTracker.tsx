import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types';
import { localStore } from '../../lib/supabase';
import { DollarSign, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Badge } from '../common/Badge';

export const FeeTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser as StudentProfile;

  if (!student) return null;

  const feeRecords = localStore.getFees().filter((f) => f.studentId === student.id);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Fee Statements</h2>
          <p className="text-xs text-gray-500">View personal hostel accommodation and mess fee records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {feeRecords.map((fee) => {
          const pendingAmount = fee.totalAmount - fee.paidAmount;
          return (
            <div key={fee.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">{fee.academicTerm}</span>
                <Badge status={fee.status} />
              </div>

              <div>
                <div className="text-2xl font-extrabold text-gray-900">
                  ₹{fee.totalAmount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Due Date: {fee.dueDate}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Paid Amount:</span>
                  <span>₹{fee.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>Balance Due:</span>
                  <span>₹{pendingAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl text-xs text-blue-900">
        💡 <strong>Note:</strong> Fee payments can be made at the accounts desk or college online payment portal. Status updates are verified by the Hostel Chief Warden.
      </div>
    </div>
  );
};
