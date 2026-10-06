import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StudentProfile, UserRole, NotificationItem } from '../types';
import { DEMO_STUDENTS, DEMO_WARDEN, localStore } from '../lib/supabase';
import { checkLeaveReturnReminders } from '../lib/notification';

interface AuthContextType {
  currentUser: UserProfile | StudentProfile | null;
  userRole: UserRole | null;
  allStudents: StudentProfile[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  loginAsStudent: (studentId: string) => void;
  loginAsWarden: () => void;
  loginWithCredentials: (email: string, role: UserRole) => boolean;
  logout: () => void;
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (userId: string, title: string, message: string, type: NotificationItem['type']) => void;
  updateStudentProfile: (updatedFields: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged in as student 1 (Rahul Sharma) for instant rich preview
  const [currentUser, setCurrentUser] = useState<UserProfile | StudentProfile | null>(() => {
    const saved = localStorage.getItem('hostel_current_user_id');
    if (saved === 'warden') return DEMO_WARDEN;
    const foundStudent = DEMO_STUDENTS.find((s) => s.id === saved);
    return foundStudent || DEMO_STUDENTS[0];
  });

  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return currentUser?.role || 'student';
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load and refresh notifications
  useEffect(() => {
    if (!currentUser) return;
    const allNotifs = localStore.getNotifications();
    const userNotifs = allNotifs.filter(
      (n) => n.userId === currentUser.id || n.userId === 'all' || currentUser.role === 'warden'
    );
    setNotifications(userNotifs);

    // Run Smart Return Reminder check for student
    if (currentUser.role === 'student') {
      const leaves = localStore.getLeaves().filter((l) => l.studentId === currentUser.id);
      const reminderMsgs = checkLeaveReturnReminders(leaves);
      reminderMsgs.forEach((msg) => {
        // Add if not already present
        if (!userNotifs.some((n) => n.message.includes(msg))) {
          const newNotif: NotificationItem = {
            id: 'notif_' + Date.now() + Math.random(),
            userId: currentUser.id,
            title: 'Smart Return Reminder',
            message: msg,
            type: 'leave',
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          const updatedNotifs = [newNotif, ...allNotifs];
          localStore.setNotifications(updatedNotifs);
          setNotifications([newNotif, ...userNotifs]);
        }
      });
    }
  }, [currentUser]);

  const loginAsStudent = (studentId: string) => {
    const student = DEMO_STUDENTS.find((s) => s.id === studentId);
    if (student) {
      setCurrentUser(student);
      setUserRole('student');
      localStorage.setItem('hostel_current_user_id', student.id);
    }
  };

  const loginAsWarden = () => {
    setCurrentUser(DEMO_WARDEN);
    setUserRole('warden');
    localStorage.setItem('hostel_current_user_id', 'warden');
  };

  const loginWithCredentials = (email: string, requestedRole: UserRole): boolean => {
    if (requestedRole === 'warden') {
      if (email.toLowerCase().includes('warden')) {
        loginAsWarden();
        return true;
      }
    } else {
      const match = DEMO_STUDENTS.find(
        (s) => s.email.toLowerCase() === email.toLowerCase() || s.studentIdNo.toLowerCase() === email.toLowerCase()
      );
      if (match) {
        loginAsStudent(match.id);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('hostel_current_user_id');
  };

  const markNotificationAsRead = (id: string) => {
    const all = localStore.getNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStore.setNotifications(updated);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const addNotification = (
    userId: string,
    title: string,
    message: string,
    type: NotificationItem['type']
  ) => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now() + Math.random().toString(36).substr(2, 4),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const all = localStore.getNotifications();
    localStore.setNotifications([newNotif, ...all]);

    if (currentUser && (userId === currentUser.id || userId === 'all' || currentUser.role === 'warden')) {
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const updateStudentProfile = (updatedFields: Partial<StudentProfile>) => {
    if (currentUser && currentUser.role === 'student') {
      const updated = { ...currentUser, ...updatedFields } as StudentProfile;
      setCurrentUser(updated);
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        allStudents: DEMO_STUDENTS,
        notifications,
        unreadNotificationCount,
        loginAsStudent,
        loginAsWarden,
        loginWithCredentials,
        logout,
        markNotificationAsRead,
        addNotification,
        updateStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
