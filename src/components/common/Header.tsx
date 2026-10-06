import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Shield,
  User,
  LogOut,
  AlertTriangle,
  ChevronDown,
  CheckCircle,
  Menu,
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  onOpenEmergency: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEmergency, activeTab, setActiveTab }) => {
  const {
    currentUser,
    userRole,
    allStudents,
    notifications,
    unreadNotificationCount,
    loginAsStudent,
    loginAsWarden,
    logout,
    markNotificationAsRead,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Application Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-tight">
                SmartHostel <span className="text-blue-600 font-extrabold text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200">v2.5</span>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Digital Student Hostel Management</p>
            </div>
          </div>

          {/* Center Action (Student Emergency Button) */}
          {userRole === 'student' && (
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-md transition-all animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>EMERGENCY SOS</span>
            </button>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Student Switcher */}
            <div className="relative hidden md:block">
              <select
                value={currentUser?.id || ''}
                onChange={(e) => {
                  if (e.target.value === 'warden') {
                    loginAsWarden();
                  } else {
                    loginAsStudent(e.target.value);
                  }
                }}
                className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Switch Student Account">
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      🎓 {s.fullName} ({s.hostelBlock} - R{s.roomNumber})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Warden Account">
                  <option value="warden">🛡️ Warden Dr. K. V. Raman</option>
                </optgroup>
              </select>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
                    <span className="text-xs text-gray-500 font-medium">{notifications.length} total</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-gray-500">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs transition-colors cursor-pointer ${
                            n.isRead ? 'bg-white' : 'bg-blue-50/70 border-l-4 border-blue-500'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-900">{n.title}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {currentUser?.fullName.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-gray-800 leading-tight">
                    {currentUser?.fullName}
                  </div>
                  <Badge status={userRole || 'student'} />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800">{currentUser?.fullName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser?.email}</p>
                  </div>

                  {userRole === 'student' && (
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Profile</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
