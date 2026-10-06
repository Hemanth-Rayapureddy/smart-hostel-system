import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Calendar,
  FileText,
  AlertCircle,
  Users,
  DollarSign,
  Bell,
  Activity,
  Utensils,
  Vote,
  RotateCcw,
  ShieldAlert,
  ClipboardList,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { userRole } = useAuth();

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'room', label: 'My Room', icon: Home },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'leaves', label: 'Leave / Out-pass', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'visitors', label: 'Visitors', icon: Users },
    { id: 'fees', label: 'Hostel Fees', icon: DollarSign },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'room_change', label: 'Room Change', icon: RotateCcw },
    { id: 'mess', label: 'Mess Feedback', icon: Utensils },
    { id: 'polls', label: 'Student Polls', icon: Vote },
  ];

  const wardenNav = [
    { id: 'dashboard', label: 'Warden Dashboard', icon: LayoutDashboard },
    { id: 'health_score', label: 'Hostel Health Score', icon: Activity },
    { id: 'heatmap', label: 'Problem Heatmap', icon: ShieldAlert },
    { id: 'complaints', label: 'Complaints Hub', icon: AlertCircle },
    { id: 'leaves', label: 'Leave Approvals', icon: FileText },
    { id: 'emergencies', label: 'Emergency Control', icon: ShieldAlert },
    { id: 'rooms', label: 'Room Allocations', icon: Home },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'attendance', label: 'Daily Attendance', icon: UserCheck },
    { id: 'visitors', label: 'Visitor Logs', icon: Users },
    { id: 'fees', label: 'Fee Records', icon: DollarSign },
    { id: 'notices', label: 'Post Notices', icon: Bell },
    { id: 'polls', label: 'Hostel Polls', icon: Vote },
  ];

  const navItems = userRole === 'warden' ? wardenNav : studentNav;

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-4 px-3 py-2 bg-blue-50/60 rounded-xl border border-blue-100">
        <span className="text-[11px] font-bold text-blue-700 tracking-wider uppercase">
          {userRole === 'warden' ? '🛡️ Management Panel' : '🎓 Student Portal'}
        </span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
