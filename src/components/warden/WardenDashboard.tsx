import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { localStore } from '../../lib/supabase';
import { calculateHostelHealth } from '../../lib/healthScore';
import {
  Users,
  Home,
  FileText,
  AlertCircle,
  Activity,
  ShieldAlert,
  ArrowRight,
  Plus,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface WardenDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({ setActiveTab }) => {
  const { allStudents } = useAuth();

  const rooms = localStore.getRooms();
  const leaves = localStore.getLeaves();
  const complaints = localStore.getComplaints();
  const emergencies = localStore.getEmergencies();

  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupiedCount, 0);
  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const availableBeds = totalCapacity - totalOccupied;

  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const openComplaints = complaints.filter((c) => c.status !== 'resolved');
  const escalatedComplaints = complaints.filter((c) => c.status === 'escalated');
  const activeEmergencies = emergencies.filter((e) => e.status === 'active');

  const healthData = calculateHostelHealth(complaints, emergencies);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-500/30 mb-2">
            🛡️ Chief Warden & Admin Control Room
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Hostel Operations Dashboard</h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">
            Real-time occupancy, safety alerts, maintenance complaints, and hostel health analytics
          </p>
        </div>

        {/* Health Score Quick Card */}
        <div
          onClick={() => setActiveTab('health_score')}
          className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl cursor-pointer transition-all flex items-center space-x-4"
        >
          <div className="p-3 bg-indigo-500 text-white rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-300 uppercase">Hostel Health Score</div>
            <div className="text-2xl font-extrabold text-white">
              {healthData.overallScore}/100
            </div>
            <div className="text-[11px] text-indigo-200 font-semibold">{healthData.overallStatus}</div>
          </div>
        </div>
      </div>

      {/* ACTIVE EMERGENCY ALERTS BANNER */}
      {activeEmergencies.length > 0 && (
        <div className="bg-rose-600 text-white rounded-2xl p-5 shadow-lg border-2 border-rose-400 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white text-rose-600 rounded-2xl">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-lg">
                🚨 {activeEmergencies.length} ACTIVE EMERGENCY ALERT(S)!
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Immediate warden response required in Block {activeEmergencies[0].block} - Room {activeEmergencies[0].roomNumber} ({activeEmergencies[0].studentName})
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('emergencies')}
            className="bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            Open Emergency Control
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Students</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{allStudents.length} Active</h3>
          <p className="text-xs text-gray-500 mt-0.5">Registered residents</p>
        </div>

        {/* Occupied Rooms */}
        <div
          onClick={() => setActiveTab('rooms')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <Badge status={`${availableBeds} beds free`} />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Occupancy</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{totalOccupied} / {totalCapacity} Beds</h3>
          <p className="text-xs text-gray-500 mt-0.5">{rooms.length} Total Rooms</p>
        </div>

        {/* Pending Leaves */}
        <div
          onClick={() => setActiveTab('leaves')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <Badge status={pendingLeaves.length > 0 ? 'Action Needed' : 'Clear'} />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Pending Out-Pass</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{pendingLeaves.length} Requests</h3>
          <p className="text-xs text-gray-500 mt-0.5">Awaiting approval</p>
        </div>

        {/* Escalated & Open Complaints */}
        <div
          onClick={() => setActiveTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-5 h-5" />
            </div>
            <Badge status={escalatedComplaints.length > 0 ? 'Escalated' : 'Normal'} />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Open Complaints</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{openComplaints.length} Unresolved</h3>
          <p className="text-xs text-rose-600 font-semibold mt-0.5">{escalatedComplaints.length} Escalated tickets</p>
        </div>
      </div>

      {/* Quick Operations Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900">Warden Operations & Quick Dispatch</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('heatmap')}
            className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 hover:text-indigo-600 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>Problem Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('emergencies')}
            className="flex items-center space-x-2 p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Emergency Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 hover:text-emerald-600 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 hover:text-blue-600 transition-all"
          >
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Post Circular Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
