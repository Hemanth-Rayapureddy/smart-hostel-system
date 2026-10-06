import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types';
import { localStore } from '../../lib/supabase';
import {
  Home,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Bell,
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock,
  DollarSign,
  Users,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab, onOpenEmergency }) => {
  const { currentUser } = useAuth();
  const student = currentUser as StudentProfile;

  if (!student) return null;

  // Retrieve current student data
  const attendance = localStore.getAttendance().find(
    (a) => a.studentId === student.id && a.date === new Date().toISOString().split('T')[0]
  );

  const leaves = localStore.getLeaves().filter((l) => l.studentId === student.id);
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');

  const complaints = localStore.getComplaints().filter((c) => c.studentId === student.id);
  const activeComplaints = complaints.filter((c) => c.status !== 'resolved');

  const notices = localStore.getNotices().filter((n) => new Date(n.expiryDate) >= new Date());
  const importantNotices = notices.filter((n) => n.priority === 'important' || n.priority === 'emergency');

  const activeEmergencies = localStore.getEmergencies().filter(
    (e) => e.studentId === student.id && e.status !== 'resolved'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white mb-2">
                🎓 Active Student Session
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">Welcome back, {student.fullName}!</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                {student.department} • Year {student.yearOfStudy} • ID: {student.studentIdNo}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-white/10 text-xs font-semibold">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center space-x-2">
              <Home className="w-4 h-4 text-blue-200" />
              <span>Room: {student.hostelBlock} - Room {student.roomNumber}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Today's Status: {attendance?.status.toUpperCase() || 'PRESENT'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Emergency Banner if any */}
      {activeEmergencies.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-sm">Emergency Alert Submitted</h4>
              <p className="text-xs text-rose-700">Warden team has been notified for Room {student.roomNumber}.</p>
            </div>
          </div>
          <Badge status="EMERGENCY ACTIVE" />
        </div>
      )}

      {/* Key Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Room Card */}
        <div
          onClick={() => setActiveTab('room')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">My Room</p>
          <h3 className="text-lg font-bold text-gray-900 mt-1">{student.hostelBlock}</h3>
          <p className="text-xs text-gray-600 mt-0.5">Room {student.roomNumber}</p>
        </div>

        {/* Attendance Card */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <Badge status={attendance?.status || 'present'} />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Today's Attendance</p>
          <h3 className="text-lg font-bold text-emerald-700 mt-1">Present</h3>
          <p className="text-xs text-gray-500 mt-0.5">Overall: 94.5% Attendance</p>
        </div>

        {/* Leave Status Card */}
        <div
          onClick={() => setActiveTab('leaves')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <Badge status={pendingLeaves.length > 0 ? 'Pending' : 'Clear'} />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Leave Requests</p>
          <h3 className="text-lg font-bold text-gray-900 mt-1">{pendingLeaves.length} Pending</h3>
          <p className="text-xs text-gray-500 mt-0.5">{leaves.length} Total Requests filed</p>
        </div>

        {/* Complaint Status Card */}
        <div
          onClick={() => setActiveTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-5 h-5" />
            </div>
            <Badge status={activeComplaints.length > 0 ? activeComplaints[0].status : 'Clean'} />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Complaints</p>
          <h3 className="text-lg font-bold text-gray-900 mt-1">{activeComplaints.length} Active</h3>
          <p className="text-xs text-gray-500 mt-0.5">{complaints.length} Total Complaints</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-sm text-gray-900 mb-4">Quick Student Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('leaves')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl text-xs font-semibold text-gray-800 hover:text-blue-600 transition-all space-y-2"
          >
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Apply Out-Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-xl text-xs font-semibold text-gray-800 hover:text-amber-600 transition-all space-y-2"
          >
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <span>File Complaint</span>
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl text-xs font-semibold text-gray-800 hover:text-indigo-600 transition-all space-y-2"
          >
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Visitor Pass</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="flex flex-col items-center justify-center p-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 transition-all space-y-2"
          >
            <AlertTriangle className="w-6 h-6 text-rose-600 animate-bounce" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Important Notices Widget */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">Active Notice Board</h3>
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View All ({notices.length})
          </button>
        </div>

        <div className="space-y-3">
          {notices.slice(0, 2).map((notice) => (
            <div
              key={notice.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-xs text-gray-900">{notice.title}</h4>
                <Badge status={notice.priority} />
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">{notice.description}</p>
              <div className="mt-2 text-[10px] text-gray-400 font-medium">
                Expires: {notice.expiryDate} • Posted by {notice.createdBy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
