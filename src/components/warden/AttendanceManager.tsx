import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { localStore } from '../../lib/supabase';
import { Calendar, CheckCircle2, UserCheck, Save } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AttendanceManager: React.FC = () => {
  const { allStudents } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [records, setRecords] = useState<AttendanceRecord[]>(() => localStore.getAttendance());
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [isSaved, setIsSaved] = useState(false);

  const blockStudents = allStudents.filter((s) => s.hostelBlock === selectedBlock);

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const rec = records.find((r) => r.studentId === studentId && r.date === todayStr);
    return rec?.status || 'present';
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    const student = allStudents.find((s) => s.id === studentId);
    if (!student) return;

    const existingIndex = records.findIndex((r) => r.studentId === studentId && r.date === todayStr);

    let updated: AttendanceRecord[];

    if (existingIndex >= 0) {
      updated = records.map((r, i) => (i === existingIndex ? { ...r, status } : r));
    } else {
      const newRec: AttendanceRecord = {
        id: 'att_' + Date.now() + Math.random(),
        studentId,
        studentName: student.fullName,
        block: student.hostelBlock,
        roomNumber: student.roomNumber,
        date: todayStr,
        status,
        markedBy: 'Warden Dr. K. V. Raman',
      };
      updated = [newRec, ...records];
    }

    setRecords(updated);
    localStore.setAttendance(updated);
  };

  const handleSaveAll = () => {
    localStore.setAttendance(records);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Daily Night Attendance</h2>
          <p className="text-xs text-gray-500">Mark student roll-call attendance for night curfew check</p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
          >
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
            <option value="Block D">Block D</option>
          </select>

          <button
            onClick={handleSaveAll}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 text-center">
          ✓ Today's attendance records updated for {selectedBlock}!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50 font-bold text-xs text-gray-700 flex justify-between">
          <span>Resident Name & Room</span>
          <span>Mark Attendance ({todayStr})</span>
        </div>

        {blockStudents.map((st) => {
          const currentStatus = getStudentStatus(st.id);

          return (
            <div key={st.id} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center space-x-3">
                <img src={st.avatarUrl} alt={st.fullName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{st.fullName}</h4>
                  <p className="text-[11px] text-gray-500">
                    Room {st.roomNumber} • ID: {st.studentIdNo}
                  </p>
                </div>
              </div>

              {/* Status Radio Buttons */}
              <div className="flex items-center space-x-2 text-xs font-semibold">
                {(['present', 'absent', 'leave', 'late'] as AttendanceStatus[]).map((stt) => (
                  <button
                    key={stt}
                    onClick={() => setStudentStatus(st.id, stt)}
                    className={`px-3 py-1.5 rounded-lg border capitalize transition-all ${
                      currentStatus === stt
                        ? stt === 'present'
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                          : stt === 'absent'
                          ? 'bg-rose-600 text-white font-bold border-rose-600'
                          : stt === 'leave'
                          ? 'bg-blue-600 text-white font-bold border-blue-600'
                          : 'bg-amber-500 text-white font-bold border-amber-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {stt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
