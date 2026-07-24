import React, { useState } from 'react';
import { UserCheck, UserX, Clock, Calendar, Search, Save, Download, CheckCircle2, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export default function AttendanceMarker({ studentsList, onSaveAttendance, wardenName }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Local state for daily status map { studentId: "Present" | "Absent" | "On Leave" }
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const initial = {};
    (studentsList || []).forEach(s => {
      initial[s.id] = s.attendancePercentage < 90 ? "Absent" : "Present";
    });
    return initial;
  });

  const [toastMessage, setToastMessage] = useState(null);

  const filteredStudents = (studentsList || []).filter(s => {
    const matchesBlock = selectedBlock === "All Blocks" || s.block === selectedBlock;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rollNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.roomNo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBlock && matchesSearch;
  });

  const handleStatusToggle = (studentId, newStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = { ...attendanceMap };
    filteredStudents.forEach(s => {
      updated[s.id] = "Present";
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const records = Object.keys(attendanceMap).map(sId => {
      const student = studentsList.find(s => s.id === sId);
      return {
        studentId: sId,
        studentName: student?.name || "Student",
        roomNo: student?.roomNo || "Unassigned",
        status: attendanceMap[sId],
        date: selectedDate
      };
    });

    onSaveAttendance(records, wardenName || "Prof. Marcus Brody", selectedDate);
    setToastMessage(`Attendance saved for ${records.length} students on ${selectedDate}! Log logged under ${wardenName || "Prof. Marcus Brody"}.`);
    
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Student Name,Roll No,Room No,Status,Marked By\n";
    filteredStudents.forEach(s => {
      const status = attendanceMap[s.id] || "Present";
      csvContent += `${selectedDate},"${s.name}",${s.rollNo || 'N/A'},${s.roomNo || 'N/A'},${status},"${wardenName || 'Warden Brody'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hostel_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculate
  const presentCount = Object.values(attendanceMap).filter(v => v === "Present").length;
  const absentCount = Object.values(attendanceMap).filter(v => v === "Absent").length;
  const leaveCount = Object.values(attendanceMap).filter(v => v === "On Leave").length;

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <UserCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">Warden Daily Digital Attendance System</h3>
              <p className="text-xs text-slate-400">Charge of Warden Supervision • Verifies resident present, absent & leave status</p>
            </div>
          </div>
        </div>

        {/* Date & Quick Batch Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-blue-400" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none font-bold"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            Mark All Present
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Quick Attendance Stats Bar */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <span className="text-xs font-bold block text-emerald-400">Total Present</span>
          <span className="text-2xl font-extrabold">{presentCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <span className="text-xs font-bold block text-rose-400">Total Absent</span>
          <span className="text-2xl font-extrabold">{absentCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <span className="text-xs font-bold block text-amber-400">On Leave / Authorized</span>
          <span className="text-2xl font-extrabold">{leaveCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All Blocks">All Hostel Blocks</option>
            <option value="Block A - Blue Crest">Block A - Blue Crest</option>
            <option value="Block B - Emerald Hall">Block B - Emerald Hall</option>
          </select>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Roster Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Roll No & Course</th>
              <th className="py-3.5 px-4">Room & Bed</th>
              <th className="py-3.5 px-4">Hostel Block</th>
              <th className="py-3.5 px-4 text-center">Daily Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {filteredStudents.map(student => {
              const currentStatus = attendanceMap[student.id] || "Present";

              return (
                <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                  
                  {/* Student Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                      />
                      <div>
                        <span className="font-bold text-white block">{student.name}</span>
                        <span className="text-[10px] text-slate-400">{student.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Roll & Course */}
                  <td className="py-3 px-4">
                    <span className="font-semibold block text-slate-200">{student.rollNo}</span>
                    <span className="text-[10px] text-slate-400">{student.course}</span>
                  </td>

                  {/* Room & Bed */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-cyan-300 block">{student.roomNo}</span>
                    <span className="text-[10px] text-slate-400">{student.bedNo}</span>
                  </td>

                  {/* Block */}
                  <td className="py-3 px-4 text-slate-300">{student.block}</td>

                  {/* Status Toggle Buttons */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 max-w-xs mx-auto">
                      {[
                        { label: 'Present', color: 'bg-emerald-600 text-white shadow-emerald-500/20' },
                        { label: 'Absent', color: 'bg-rose-600 text-white shadow-rose-500/20' },
                        { label: 'On Leave', color: 'bg-amber-600 text-white shadow-amber-500/20' }
                      ].map(st => (
                        <button
                          key={st.label}
                          onClick={() => handleStatusToggle(student.id, st.label)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            currentStatus === st.label 
                              ? `${st.color} shadow-md` 
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
