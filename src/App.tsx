import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { LoginForm } from './components/auth/LoginForm';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { MyRoom } from './components/student/MyRoom';
import { AttendanceView } from './components/student/AttendanceView';
import { LeaveManager } from './components/student/LeaveManager';
import { ComplaintManager } from './components/student/ComplaintManager';
import { VisitorManager } from './components/student/VisitorManager';
import { FeeTracker } from './components/student/FeeTracker';
import { RoomChangeRequest } from './components/student/RoomChangeRequest';
import { MessFeedbackView } from './components/student/MessFeedbackView';
import { PollsView } from './components/student/PollsView';
import { NoticesView } from './components/student/NoticesView';
import { EmergencyModal } from './components/student/EmergencyModal';

// Warden Views
import { WardenDashboard } from './components/warden/WardenDashboard';
import { HealthScoreView } from './components/warden/HealthScoreView';
import { HeatmapView } from './components/warden/HeatmapView';
import { WardenComplaints } from './components/warden/WardenComplaints';
import { WardenLeaves } from './components/warden/WardenLeaves';
import { WardenEmergency } from './components/warden/WardenEmergency';
import { RoomManager } from './components/warden/RoomManager';
import { StudentManager } from './components/warden/StudentManager';
import { AttendanceManager } from './components/warden/AttendanceManager';
import { VisitorApprovals } from './components/warden/VisitorApprovals';
import { FeeManager } from './components/warden/FeeManager';
import { NoticeCreator } from './components/warden/NoticeCreator';
import { PollCreator } from './components/warden/PollCreator';

import { X, User, DollarSign, Utensils, Vote, Bell, RotateCcw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, userRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

  if (!currentUser) {
    return <LoginForm />;
  }

  // Strict Security Check: Enforce Role-Based Access Control
  const wardenOnlyTabs = ['health_score', 'heatmap', 'emergencies', 'rooms', 'students'];
  if (userRole === 'student' && wardenOnlyTabs.includes(activeTab)) {
    // Redirect unauthorized student back to student dashboard
    setActiveTab('dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-6">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {/* STUDENT VIEWS */}
          {userRole === 'student' && (
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboard
                  setActiveTab={setActiveTab}
                  onOpenEmergency={() => setIsEmergencyOpen(true)}
                />
              )}
              {activeTab === 'profile' && <StudentProfile />}
              {activeTab === 'room' && <MyRoom setActiveTab={setActiveTab} />}
              {activeTab === 'attendance' && <AttendanceView />}
              {activeTab === 'leaves' && <LeaveManager />}
              {activeTab === 'complaints' && <ComplaintManager />}
              {activeTab === 'visitors' && <VisitorManager />}
              {activeTab === 'fees' && <FeeTracker />}
              {activeTab === 'room_change' && <RoomChangeRequest />}
              {activeTab === 'mess' && <MessFeedbackView />}
              {activeTab === 'polls' && <PollsView />}
              {activeTab === 'notices' && <NoticesView />}
            </>
          )}

          {/* WARDEN / ADMIN VIEWS */}
          {userRole === 'warden' && (
            <>
              {activeTab === 'dashboard' && <WardenDashboard setActiveTab={setActiveTab} />}
              {activeTab === 'health_score' && <HealthScoreView />}
              {activeTab === 'heatmap' && <HeatmapView />}
              {activeTab === 'complaints' && <WardenComplaints />}
              {activeTab === 'leaves' && <WardenLeaves />}
              {activeTab === 'emergencies' && <WardenEmergency />}
              {activeTab === 'rooms' && <RoomManager />}
              {activeTab === 'students' && <StudentManager />}
              {activeTab === 'attendance' && <AttendanceManager />}
              {activeTab === 'visitors' && <VisitorApprovals />}
              {activeTab === 'fees' && <FeeManager />}
              {activeTab === 'notices' && <NoticeCreator />}
              {activeTab === 'polls' && <PollCreator />}
            </>
          )}
        </main>
      </div>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMore={() => setShowMobileMore(true)}
      />

      {/* Student Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Mobile More Services Drawer */}
      {showMobileMore && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 space-y-4 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Hostel Services Menu</h3>
              <button onClick={() => setShowMobileMore(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {userRole === 'student' ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('fees');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Hostel Fees</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('room_change');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Room Change Request</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('mess');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <Utensils className="w-4 h-4 text-amber-600" />
                    <span>Mess Feedback</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('polls');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <Vote className="w-4 h-4 text-purple-600" />
                    <span>Student Polls</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('notices');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span>Notice Board</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('rooms');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <span>Room Allocations</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('students');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <span>Student Directory</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('attendance');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <span>Daily Attendance</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('notices');
                      setShowMobileMore(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl font-semibold text-gray-800"
                  >
                    <span>Post Notices</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  logout();
                  setShowMobileMore(false);
                }}
                className="w-full text-center p-3 bg-rose-50 text-rose-700 font-bold rounded-xl mt-4"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
