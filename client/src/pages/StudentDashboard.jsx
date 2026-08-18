import React, { useState } from 'react';
import { 
  User, 
  Bed, 
  UserCheck, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Ticket, 
  Sparkles,
  Utensils,
  Trophy,
  CreditCard
} from 'lucide-react';
import TicketRoomSelector from '../components/TicketRoomSelector';
import MessMenuViewer from '../components/MessMenuViewer';
import HostelTimingsCard from '../components/HostelTimingsCard';
import ActivitiesHub from '../components/ActivitiesHub';

export default function StudentDashboard({ 
  student, 
  leaves, 
  complaints, 
  visitors, 
  fees, 
  notices, 
  roomsData, 
  timingsData, 
  messMenuData, 
  activitiesData, 
  onApplyLeave, 
  onSubmitComplaint, 
  onRequestVisitor, 
  onPayFee, 
  onAllocateBed,
  onRegisterActivity
}) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  // Form states
  const [leaveForm, setLeaveForm] = useState({ reason: '', startDate: '', endDate: '', destination: '' });
  const [complaintForm, setComplaintForm] = useState({ title: '', category: 'Maintenance', description: '', priority: 'Medium' });
  const [visitorForm, setVisitorForm] = useState({ visitorName: '', relation: 'Parent', contact: '', purpose: '', visitDate: '', timeSlot: '10:00 AM - 01:00 PM' });

  // Notifications / Feedback
  const [actionSuccess, setActionSuccess] = useState(null);

  const studentLeaves = (leaves || []).filter(l => l.studentId === student.id);
  const studentComplaints = (complaints || []).filter(c => c.studentId === student.id);
  const studentVisitors = (visitors || []).filter(v => v.studentId === student.id);
  const studentFee = (fees || []).find(f => f.studentId === student.id) || fees[0];

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    onApplyLeave({
      studentId: student.id,
      studentName: student.name,
      roomNo: student.roomNo,
      ...leaveForm
    });
    setShowLeaveModal(false);
    setActionSuccess("Leave request submitted successfully! Pending Warden review.");
    setLeaveForm({ reason: '', startDate: '', endDate: '', destination: '' });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    onSubmitComplaint({
      studentId: student.id,
      studentName: student.name,
      roomNo: student.roomNo,
      ...complaintForm
    });
    setShowComplaintModal(false);
    setActionSuccess("Complaint ticket raised! Technician will inspect shortly.");
    setComplaintForm({ title: '', category: 'Maintenance', description: '', priority: 'Medium' });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    onRequestVisitor({
      studentId: student.id,
      studentName: student.name,
      ...visitorForm
    });
    setShowVisitorModal(false);
    setActionSuccess("Visitor request logged! Pending Warden entry clearance.");
    setVisitorForm({ visitorName: '', relation: 'Parent', contact: '', purpose: '', visitDate: '', timeSlot: '10:00 AM - 01:00 PM' });
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Student Profile Banner Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/80 shadow-xl shadow-blue-500/20" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{student.name}</h1>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Student Resident
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Roll No: <strong className="text-white">{student.rollNo}</strong> • {student.course}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span>Room: <strong className="text-cyan-300">{student.roomNo} ({student.bedNo})</strong></span>
                <span>Block: <strong className="text-white">{student.block}</strong></span>
                <span>Guardian: <strong className="text-slate-300">{student.guardianName}</strong></span>
              </div>
            </div>
          </div>

          {/* Attendance Radial Gauge Card */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center bg-slate-950/80 w-full md:w-auto flex items-center justify-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-800 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 stroke-current"
                  strokeDasharray={`${student.attendancePercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-extrabold text-sm text-emerald-400">{student.attendancePercentage}%</span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Attendance Score</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Eligible for Exams</span>
            </div>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: User },
          { id: 'room-ticket', label: 'Ticket Room Allocator', icon: Ticket },
          { id: 'mess-menu', label: 'Food Menu & Timings', icon: Utensils },
          { id: 'activities', label: 'Hostel Activities', icon: Trophy },
          { id: 'leave', label: 'Leave Requests', icon: Calendar },
          { id: 'complaints', label: 'Complaints', icon: MessageSquare },
          { id: 'visitors', label: 'Visitor Pass', icon: ShieldCheck },
          { id: 'fee', label: 'Hostel Fees', icon: DollarSign },
        ].map(t => {
          const IconC = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === t.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Quick Action Trigger Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setShowLeaveModal(true)}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <Plus className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="font-bold text-white text-base mt-4">Apply for Leave</h4>
              <p className="text-xs text-slate-400 mt-1">Submit travel reason & dates for Warden approval</p>
            </div>

            <div 
              onClick={() => setShowComplaintModal(true)}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <Plus className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
              </div>
              <h4 className="font-bold text-white text-base mt-4">Raise Maintenance Ticket</h4>
              <p className="text-xs text-slate-400 mt-1">Report room repairs, plumbing or internet issues</p>
            </div>

            <div 
              onClick={() => setShowVisitorModal(true)}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <Plus className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h4 className="font-bold text-white text-base mt-4">Log Visitor Request</h4>
              <p className="text-xs text-slate-400 mt-1">Request guest entry pass for family members</p>
            </div>
          </div>

          {/* Timings & Room Info Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Room Allocation Status Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bed className="w-5 h-5 text-cyan-400" />
                  <span>My Allocated Bed Details</span>
                </h3>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Confirmed Allocation
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Assigned Room:</span>
                  <span className="font-extrabold text-white text-sm">{student.roomNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Bed Slot Position:</span>
                  <span className="font-bold text-cyan-300">{student.bedNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Hostel Block:</span>
                  <span className="font-semibold text-white">{student.block}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Fee Payment Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${studentFee.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {studentFee.status} ({studentFee.status === 'Paid' ? `$${studentFee.totalAmount}` : `$${studentFee.totalAmount} Due`})
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Notices Feed */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Hostel Announcements & Circulars</span>
              </h3>

              <div className="space-y-3">
                {(notices || []).slice(0, 3).map(notice => (
                  <div key={notice.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{notice.title}</span>
                      <span className="text-[10px] text-blue-400 font-semibold">{notice.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{notice.content}</p>
                    <span className="text-[10px] text-slate-500 block">{notice.date} • {notice.author}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Ticket Room Allocator */}
      {activeTab === 'room-ticket' && (
        <TicketRoomSelector roomsData={roomsData} onAllocateBed={onAllocateBed} activeRole="Student" />
      )}

      {/* TAB CONTENT 3: Mess Menu & Timings */}
      {activeTab === 'mess-menu' && (
        <div className="space-y-8">
          <HostelTimingsCard timingsData={timingsData} />
          <MessMenuViewer messMenuData={messMenuData} activeRole="Student" />
        </div>
      )}

      {/* TAB CONTENT 4: Activities */}
      {activeTab === 'activities' && (
        <ActivitiesHub 
          activitiesData={activitiesData} 
          onRegisterActivity={onRegisterActivity} 
          studentName={student.name} 
        />
      )}

      {/* TAB CONTENT 5: Leave Requests */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Leave Request History</h3>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New Leave</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentLeaves.map(l => (
              <div key={l.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{l.reason}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    l.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">Destination: <strong className="text-white">{l.destination}</strong></p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Dates: {l.startDate} to {l.endDate}</span>
                  <span>Approved By: {l.approvedBy || 'Pending Warden'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: Complaints */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Submitted Maintenance Tickets</h3>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Raise New Complaint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentComplaints.map(c => (
              <div key={c.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{c.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {c.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{c.description}</p>
                {c.resolution && (
                  <div className="p-2 rounded-lg bg-slate-900 text-[11px] text-emerald-300 border border-emerald-500/30">
                    Resolution Note: {c.resolution}
                  </div>
                )}
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Priority: <strong className="text-amber-400">{c.priority}</strong></span>
                  <span className={`font-bold ${c.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: Visitors */}
      {activeTab === 'visitors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Visitor Entry Clearances</h3>
            <button
              onClick={() => setShowVisitorModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Visitor Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentVisitors.map(v => (
              <div key={v.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{v.visitorName} ({v.relation})</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    v.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">Purpose: {v.purpose}</p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Visit: {v.visitDate} ({v.timeSlot})</span>
                  <span>Cleared By: {v.approvedBy || 'Pending Warden'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: Fee Management */}
      {activeTab === 'fee' && studentFee && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white">Hostel Semester Fee Details</h3>
              <p className="text-xs text-slate-400">Academic Year: {studentFee.academicYear}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              studentFee.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {studentFee.status}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span>Room Rent ({student.roomNo}):</span>
              <span className="font-bold text-white">${studentFee.roomRent}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span>Mess & Catering Charges:</span>
              <span className="font-bold text-white">${studentFee.messCharges}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span>Utility & Maintenance Deposit:</span>
              <span className="font-bold text-white">${studentFee.utilityDeposit}</span>
            </div>
            <div className="flex justify-between py-3 text-base font-extrabold text-white border-t border-slate-700">
              <span>Total Semester Payable:</span>
              <span className="text-emerald-400">${studentFee.totalAmount}</span>
            </div>
          </div>

          {studentFee.status !== 'Paid' ? (
            <button
              onClick={() => onPayFee(studentFee.id)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Simulate Pay Fee Online (${studentFee.totalAmount})</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center space-y-1">
              <p>Receipt Download Ready! Transaction ID: {studentFee.transactionId}</p>
              <span className="text-[10px] text-slate-400 block">Payment Received on {studentFee.paymentDate}</span>
            </div>
          )}
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-white">Apply for Hostel Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Reason for Leave</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attending family function / hackathon"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Travel Destination / Address</label>
                <input
                  type="text"
                  required
                  placeholder="City or home address"
                  value={leaveForm.destination}
                  onChange={(e) => setLeaveForm({ ...leaveForm, destination: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAISE COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-white">Raise Maintenance Complaint</h3>
            <form onSubmit={handleComplaintSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Issue Category</label>
                <select
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Maintenance">Maintenance & AC</option>
                  <option value="Plumbing">Plumbing & Bathroom</option>
                  <option value="Internet & IT">Internet & WiFi</option>
                  <option value="Electrical">Electrical & Fans</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Short summary of issue"
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Detailed Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain exact problem location inside room..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Raise Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VISITOR REQUEST MODAL */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-white">Log Visitor Entry Pass</h3>
            <form onSubmit={handleVisitorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Guest name"
                  value={visitorForm.visitorName}
                  onChange={(e) => setVisitorForm({ ...visitorForm, visitorName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Relation</label>
                  <input
                    type="text"
                    required
                    placeholder="Parent / Sibling / Friend"
                    value={visitorForm.relation}
                    onChange={(e) => setVisitorForm({ ...visitorForm, relation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555)..."
                    value={visitorForm.contact}
                    onChange={(e) => setVisitorForm({ ...visitorForm, contact: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Visit Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="Delivering supplies / weekend visit"
                  value={visitorForm.purpose}
                  onChange={(e) => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Visit Date</label>
                <input
                  type="date"
                  required
                  value={visitorForm.visitDate}
                  onChange={(e) => setVisitorForm({ ...visitorForm, visitDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVisitorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
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
}
