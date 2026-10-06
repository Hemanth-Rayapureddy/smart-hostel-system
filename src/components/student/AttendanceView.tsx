import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types';
import { localStore } from '../../lib/supabase';
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AttendanceView: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser as StudentProfile;

  if (!student) return null;

  const attendanceRecords = localStore
    .getAttendance()
    .filter((a) => a.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalDays = attendanceRecords.length || 1;
  const presentDays = attendanceRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
  const percentage = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Attendance Tracker</h2>
          <p className="text-xs text-gray-500">View official hostel night check-in attendance records</p>
        </div>

        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-700">Attendance Score</div>
            <div className="text-lg font-extrabold text-emerald-800">{percentage}%</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700">
          Attendance History
        </div>

        <div className="divide-y divide-gray-100">
          {attendanceRecords.length === 0 ? (
            <p className="p-6 text-center text-xs text-gray-500">No attendance history logged yet.</p>
          ) : (
            attendanceRecords.map((rec) => (
              <div key={rec.id} className="p-4 flex items-center justify-between text-xs hover:bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  {rec.status === 'present' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {rec.status === 'leave' && <Clock className="w-5 h-5 text-blue-600" />}
                  {rec.status === 'absent' && <XCircle className="w-5 h-5 text-rose-600" />}
                  {rec.status === 'late' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                  <div>
                    <span className="font-bold text-gray-900">{rec.date}</span>
                    <p className="text-[11px] text-gray-500">{rec.remarks || `Marked at 09:30 PM curfew check`}</p>
                  </div>
                </div>
                <Badge status={rec.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
