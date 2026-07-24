import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Bed, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Download, 
  Settings, 
  CheckCircle2, 
  Building2,
  Trash2,
  Edit,
  Sparkles
} from 'lucide-react';
import TicketRoomSelector from '../components/TicketRoomSelector';

export default function AdminDashboard({ admin, users, roomsData, rules, analytics, onAddUser, onAddRule, onAllocateBed }) {
  const [activeTab, setActiveTab] = useState('metrics');
  
  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // Forms
  const [studentForm, setStudentForm] = useState({ name: '', email: '', rollNo: '', course: '', phone: '', guardianName: '', guardianPhone: '', block: 'Block A - Blue Crest' });
  const [ruleForm, setRuleForm] = useState({ title: '', detail: '' });

  const [notification, setNotification] = useState(null);

  const studentsList = (users || []).filter(u => u.role === 'Student');
  const wardensList = (users || []).filter(u => u.role === 'Warden');

  const handleCreateStudent = (e) => {
    e.preventDefault();
    onAddUser({
      role: 'Student',
      roomNo: 'Unassigned',
      bedNo: '-',
      ...studentForm
    });
    setShowAddStudentModal(false);
    setNotification(`New resident student account created for ${studentForm.name}!`);
    setStudentForm({ name: '', email: '', rollNo: '', course: '', phone: '', guardianName: '', guardianPhone: '', block: 'Block A - Blue Crest' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    onAddRule(ruleForm);
    setShowAddRuleModal(false);
    setNotification("New Hostel Policy Rule published to digital notice board!");
    setRuleForm({ title: '', detail: '' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadFullReport = () => {
    let csv = "data:text/csv;charset=utf-8,Category,Metric,Value\n";
    csv += `Hostel,Total Registered Students,${studentsList.length}\n`;
    csv += `Hostel,Total Active Wardens,${wardensList.length}\n`;
    csv += `Rooms,Occupancy Rate,${analytics.occupancyRate || 96}%\n`;
    csv += `Finances,Total Semester Fees Collected,$${analytics.feeStats?.totalCollected || 3850}\n`;

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hostel_Master_System_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Profile Header Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src={admin.avatar} 
              alt={admin.name} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/80 shadow-xl shadow-purple-500/20" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{admin.name}</h1>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Chief Hostel Administrator
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{admin.department} • Member since {admin.joiningDate}</p>
              <p className="text-xs text-slate-400 mt-0.5">Admin Email: {admin.email} • Direct Line: {admin.phone}</p>
            </div>
          </div>

          <button
            onClick={handleDownloadFullReport}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Export Master PDF/CSV Report</span>
          </button>
        </div>

        {notification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'metrics', label: 'Analytics & System Overview', icon: TrendingUp },
          { id: 'students', label: `Manage Students (${studentsList.length})`, icon: Users },
          { id: 'wardens', label: `Manage Wardens (${wardensList.length})`, icon: ShieldCheck },
          { id: 'rooms', label: 'Ticket Room Allocator', icon: Bed },
          { id: 'rules', label: 'Hostel Policies & Rules', icon: FileText },
        ].map(t => {
          const IconC = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === t.id 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Metrics Overview */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Registered Students</span>
              <span className="text-3xl font-extrabold text-white block">{analytics.totalStudents || studentsList.length}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Active Residents</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Hostel Capacity</span>
              <span className="text-3xl font-extrabold text-cyan-300 block">{analytics.totalBeds || 12} Beds</span>
              <span className="text-[10px] text-cyan-400 font-semibold">{analytics.occupiedBeds || 6} Occupied • {analytics.availableBeds || 6} Vacant</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400">Occupancy Rate</span>
              <span className="text-3xl font-extrabold text-emerald-400 block">{analytics.occupancyRate || 85}%</span>
              <span className="text-[10px] text-slate-400">High efficiency target</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400">Semester Fees Collected</span>
              <span className="text-3xl font-extrabold text-purple-400 block">${analytics.feeStats?.totalCollected || 1950}</span>
              <span className="text-[10px] text-amber-400 font-semibold">${analytics.feeStats?.totalDue || 1500} Outstanding Due</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">Hostel Block Capacity Summary</h3>
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Block A - Blue Crest</span>
                    <span className="text-[10px] text-slate-400">Warden: Prof. Marcus Brody</span>
                  </div>
                  <span className="font-extrabold text-cyan-300">85% Occupied</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Block B - Emerald Hall</span>
                    <span className="text-[10px] text-slate-400">Warden: Sarah Jenkins</span>
                  </div>
                  <span className="font-extrabold text-emerald-400">60% Occupied</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">Quick Admin Settings</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Hostel Curfew Gate Closing Time:</span>
                  <strong className="text-amber-400">10:00 PM</strong>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Semester Mess Charge Rate:</span>
                  <strong className="text-emerald-400">$450 / semester</strong>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Visitor Hours Window:</span>
                  <strong className="text-cyan-400">09:00 AM - 06:00 PM</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Manage Students */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Student Resident Directory</h3>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Student</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Room & Bed</th>
                  <th className="py-3 px-4">Block</th>
                  <th className="py-3 px-4">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {studentsList.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-3 px-4 text-slate-300">{s.rollNo}</td>
                    <td className="py-3 px-4 text-slate-400">{s.course}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{s.roomNo} ({s.bedNo})</td>
                    <td className="py-3 px-4 text-slate-300">{s.block}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${s.feeStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {s.feeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Manage Wardens */}
      {activeTab === 'wardens' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Appointed Hostel Wardens</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wardensList.map(w => (
              <div key={w.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-4">
                  <img src={w.avatar} alt={w.name} className="w-14 h-14 rounded-2xl object-cover border border-amber-500/50" />
                  <div>
                    <h4 className="font-extrabold text-white text-base">{w.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold">{w.assignedBlock}</span>
                    <span className="text-[11px] text-slate-400 block">{w.shift}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 flex justify-between">
                  <span>Phone: {w.phone}</span>
                  <span>Email: {w.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Ticket Room Allocator */}
      {activeTab === 'rooms' && (
        <TicketRoomSelector roomsData={roomsData} onAllocateBed={onAllocateBed} activeRole="Admin" />
      )}

      {/* TAB 5: Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Hostel Rules & Governance Policies</h3>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(rules || []).map(r => (
              <div key={r.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-base text-purple-300">{r.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REGISTER STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-white">Register Student Resident Account</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="david@student.edu"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Roll No</label>
                  <input
                    type="text"
                    required
                    placeholder="CS-2024-099"
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Course & Department</label>
                <input
                  type="text"
                  required
                  placeholder="B.Tech Computer Science"
                  value={studentForm.course}
                  onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLISH RULE MODAL */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-white">Publish Governance Policy Rule</h3>
            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Rule Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Safety Protocol"
                  value={ruleForm.title}
                  onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Rule Detail & Penalty Info</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain exact policy requirements..."
                  value={ruleForm.detail}
                  onChange={(e) => setRuleForm({ ...ruleForm, detail: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Publish Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
