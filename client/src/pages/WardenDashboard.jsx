import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  X, 
  Ticket, 
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AttendanceMarker from '../components/AttendanceMarker';
import TicketRoomSelector from '../components/TicketRoomSelector';

export default function WardenDashboard({ warden, students, leaves, complaints, visitors, roomsData, onSaveAttendance, onUpdateLeaveStatus, onUpdateComplaintStatus, onUpdateVisitorStatus, onAllocateBed }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [feedback, setFeedback] = useState(null);

  const pendingLeaves = (leaves || []).filter(l => l.status === 'Pending');
  const pendingComplaints = (complaints || []).filter(c => c.status === 'Pending' || c.status === 'In Progress');
  const pendingVisitors = (visitors || []).filter(v => v.status === 'Pending');

  const handleLeaveAction = (id, status) => {
    onUpdateLeaveStatus(id, status, warden.name);
    setFeedback(`Leave request ${status.toLowerCase()} by ${warden.name}!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleComplaintAction = (id, status) => {
    onUpdateComplaintStatus(id, status, "Technician dispatched & maintenance completed.");
    setFeedback(`Complaint status updated to ${status}!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleVisitorAction = (id, status) => {
    onUpdateVisitorStatus(id, status, warden.name);
    setFeedback(`Visitor pass ${status.toLowerCase()}!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Warden Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img 
              src={warden.avatar} 
              alt={warden.name} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/80 shadow-xl shadow-amber-500/20" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{warden.name}</h1>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Hostel Warden Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Assigned Domain: <strong className="text-white">{warden.assignedBlock}</strong> • Shift: {warden.shift}</p>
              <p className="text-xs text-slate-400 mt-0.5">Phone Contact: {warden.phone} • Email: {warden.email}</p>
            </div>
          </div>

          {/* Quick Warden Alert Counter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xl font-extrabold text-amber-400">{pendingLeaves.length}</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Leaves Pending</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xl font-extrabold text-rose-400">{pendingComplaints.length}</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Active Complaints</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xl font-extrabold text-purple-400">{pendingVisitors.length}</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Visitor Approvals</span>
            </div>
          </div>

        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'attendance', label: 'Warden Attendance Marker', icon: UserCheck },
          { id: 'leaves', label: `Leave Approvals (${pendingLeaves.length})`, icon: Calendar },
          { id: 'complaints', label: `Complaint Resolution (${pendingComplaints.length})`, icon: MessageSquare },
          { id: 'visitors', label: `Visitor Approvals (${pendingVisitors.length})`, icon: ShieldCheck },
          { id: 'rooms', label: 'Ticket Room Allocator', icon: Ticket }
        ].map(t => {
          const IconC = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === t.id 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Attendance Marker */}
      {activeTab === 'attendance' && (
        <AttendanceMarker 
          studentsList={students} 
          onSaveAttendance={onSaveAttendance} 
          wardenName={warden.name} 
        />
      )}

      {/* TAB 2: Leave Approvals Queue */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Student Leave Request Queue</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leaves.map(l => (
              <div key={l.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-extrabold text-white text-base">{l.studentName}</h4>
                    <span className="text-xs text-slate-400">Room: <strong className="text-cyan-300">{l.roomNo}</strong></span>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    l.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : l.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p>Reason: <strong className="text-white">{l.reason}</strong></p>
                  <p>Destination: <strong className="text-white">{l.destination}</strong></p>
                  <p className="text-slate-400">Duration: {l.startDate} to {l.endDate}</p>
                </div>

                {l.status === 'Pending' && (
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleLeaveAction(l.id, 'Approved')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Leave</span>
                    </button>
                    <button
                      onClick={() => handleLeaveAction(l.id, 'Rejected')}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Complaint Resolution Desk */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Hostel Maintenance & Complaint Tickets</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.map(c => (
              <div key={c.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-extrabold text-white text-base">{c.title}</h4>
                    <span className="text-xs text-slate-400">{c.studentName} • Room {c.roomNo}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {c.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{c.description}</p>
                <div className="text-[11px] text-amber-400 font-semibold">Priority Level: {c.priority}</div>

                {c.resolution && (
                  <div className="p-3 rounded-xl bg-slate-900 text-xs text-emerald-300 border border-emerald-500/30">
                    Warden Note: {c.resolution}
                  </div>
                )}

                {c.status !== 'Resolved' && (
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleComplaintAction(c.id, 'In Progress')}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    >
                      Assign Technician
                    </button>
                    <button
                      onClick={() => handleComplaintAction(c.id, 'Resolved')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Visitor Pass Approvals */}
      {activeTab === 'visitors' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Guest & Visitor Entry Clearances</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visitors.map(v => (
              <div key={v.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-extrabold text-white text-base">{v.visitorName} ({v.relation})</h4>
                    <span className="text-xs text-slate-400">Visiting Student: <strong className="text-white">{v.studentName}</strong></span>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    v.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p>Purpose: {v.purpose}</p>
                  <p>Contact Phone: {v.contact}</p>
                  <p className="text-cyan-300 font-semibold">Visit Time: {v.visitDate} ({v.timeSlot})</p>
                </div>

                {v.status === 'Pending' && (
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleVisitorAction(v.id, 'Approved')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Approve Pass
                    </button>
                    <button
                      onClick={() => handleVisitorAction(v.id, 'Denied')}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Deny Entry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Ticket Room Allocator */}
      {activeTab === 'rooms' && (
        <TicketRoomSelector roomsData={roomsData} onAllocateBed={onAllocateBed} activeRole="Warden" />
      )}

    </div>
  );
}
