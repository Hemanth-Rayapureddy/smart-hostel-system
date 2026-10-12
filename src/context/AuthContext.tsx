import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  UserProfile,
  StudentProfile,
  UserRole,
  NotificationItem,
  AttendanceRecord,
} from '../types';

import { supabase, localStore, supabaseApi } from '../lib/supabase';
import { checkLeaveReturnReminders } from '../lib/notification';

export interface RegisterStudentData {
  fullName: string;
  studentIdNo: string;
  department: string;
  yearOfStudy: number;
  hostelBlock: string;
  roomNumber: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  email: string;
  password: string;
}

export interface RegisterWardenData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  passcode: string;
}

interface AuthContextType {
  currentUser: UserProfile | StudentProfile | null;
  userRole: UserRole | null;
  allStudents: StudentProfile[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  loginWithCredentials: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<{ success: boolean; error?: string }>;

  registerStudent: (
    data: RegisterStudentData
  ) => Promise<{ success: boolean; error?: string }>;

  registerWarden: (
    data: RegisterWardenData
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => Promise<void>;

  markNotificationAsRead: (notificationId: string) => void;

  addNotification: (
    userId: string,
    title: string,
    message: string,
    type: NotificationItem['type']
  ) => void;

  updateStudentProfile: (
    updatedFields: Partial<StudentProfile>
  ) => void;

  addStudentByWarden: (
    studentData: Omit<StudentProfile, 'id' | 'createdAt'>
  ) => void;

  updateStudentByWarden: (
    studentId: string,
    updatedFields: Partial<StudentProfile>
  ) => void;

  deleteStudentByWarden: (
    studentId: string
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | StudentProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>(() => localStore.getStudents());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync allStudents whenever localStore updates
  const refreshStudents = () => {
    setAllStudents(localStore.getStudents());
  };

  /*
   * ============================================================
   * LOAD CURRENT SESSION ON STARTUP
   * ============================================================
   */
  const loadCurrentUser = async () => {
    try {
      const storedUserId = localStorage.getItem('hostel_current_user_id');
      const storedRole = localStorage.getItem('hostel_current_user_role') as UserRole | null;

      if (!storedUserId || !storedRole) {
        // Check if there is an active Supabase session
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            if (profile) {
              if (profile.role === 'student') {
                const { data: student } = await supabase
                  .from('students')
                  .select('*')
                  .eq('id', user.id)
                  .maybeSingle();

                if (student) {
                  const sUser = { ...student, ...profile, role: 'student', id: user.id } as StudentProfile;
                  setCurrentUser(sUser);
                  setUserRole('student');
                  localStorage.setItem('hostel_current_user_id', user.id);
                  localStorage.setItem('hostel_current_user_role', 'student');
                  setLoading(false);
                  return;
                }
              } else {
                const wUser = { ...profile, id: user.id } as UserProfile;
                setCurrentUser(wUser);
                setUserRole(profile.role);
                localStorage.setItem('hostel_current_user_id', user.id);
                localStorage.setItem('hostel_current_user_role', profile.role);
                setLoading(false);
                return;
              }
            }
          }
        }
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      // Check local storage accounts
      if (storedRole === 'student') {
        const studentList = localStore.getStudents();
        const found = studentList.find((s) => s.id === storedUserId);
        if (found) {
          setCurrentUser(found);
          setUserRole('student');
          setLoading(false);
          return;
        }
      } else {
        const wardenList = localStore.getWardens();
        const found = wardenList.find((w) => w.id === storedUserId);
        if (found) {
          setCurrentUser(found);
          setUserRole('warden');
          setLoading(false);
          return;
        }
      }

      // If not found in localStore, clear
      localStorage.removeItem('hostel_current_user_id');
      localStorage.removeItem('hostel_current_user_role');
      setCurrentUser(null);
      setUserRole(null);
    } catch (err) {
      console.error('Session load error:', err);
      setCurrentUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  /*
   * ============================================================
   * NOTIFICATIONS MANAGEMENT & RETURN REMINDERS
   * ============================================================
   */
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const allNotifs = localStore.getNotifications();
    const userNotifs = allNotifs.filter(
      (n) =>
        n.userId === currentUser.id ||
        n.userId === 'all' ||
        currentUser.role === 'warden' ||
        currentUser.role === 'admin'
    );

    setNotifications(userNotifs);

    // Smart return reminder for students
    if (currentUser.role === 'student') {
      const leaves = localStore.getLeaves().filter((l) => l.studentId === currentUser.id);
      const reminderMsgs = checkLeaveReturnReminders(leaves);

      reminderMsgs.forEach((msg) => {
        if (!userNotifs.some((n) => n.message.includes(msg))) {
          const newNotif: NotificationItem = {
            id: 'notif_ret_' + Date.now() + Math.random().toString(36).substring(2, 6),
            userId: currentUser.id,
            title: '⏰ Smart Return Reminder',
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

  /*
   * ============================================================
   * REAL SUPABASE / HYBRID LOGIN WITH CREDENTIALS
   * ============================================================
   */
  const loginWithCredentials = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth first if online
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (!error && data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile && (profile.role === role || (role === 'warden' && profile.role === 'admin'))) {
            if (role === 'student') {
              const { data: student } = await supabase
                .from('students')
                .select('*')
                .eq('id', data.user.id)
                .maybeSingle();

              if (student) {
                const sUser = { ...student, ...profile, role: 'student', id: data.user.id } as StudentProfile;
                setCurrentUser(sUser);
                setUserRole('student');
                localStorage.setItem('hostel_current_user_id', data.user.id);
                localStorage.setItem('hostel_current_user_role', 'student');
                return { success: true };
              }
            } else {
              const wUser = { ...profile, id: data.user.id } as UserProfile;
              setCurrentUser(wUser);
              setUserRole('warden');
              localStorage.setItem('hostel_current_user_id', data.user.id);
              localStorage.setItem('hostel_current_user_role', 'warden');
              return { success: true };
            }
          }
        }
      } catch (sbErr) {
        console.warn('Supabase auth attempt returned:', sbErr);
      }
    }

    // 2. Check local registered accounts
    const authAccounts = localStore.getAuthAccounts();
    const match = authAccounts.find(
      (acc) =>
        acc.email.toLowerCase() === trimmedEmail &&
        acc.password === password &&
        (acc.role === role || (role === 'warden' && acc.role === 'admin'))
    );

    // Helper to derive readable name from email
    const deriveName = (em: string) => {
      const prefix = em.split('@')[0];
      return (
        prefix
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Resident'
      );
    };

    if (!match) {
      // Auto-provision user on the fly so ANYONE can log in with any email and password!
      if (role === 'student') {
        const studentList = localStore.getStudents();
        const existingStudent = studentList.find(
          (s) => s.email.toLowerCase() === trimmedEmail
        );

        if (existingStudent) {
          const updatedAuth = [
            ...authAccounts.filter((a) => a.email.toLowerCase() !== trimmedEmail),
            { email: trimmedEmail, password, role: 'student', profileId: existingStudent.id },
          ];
          localStore.setAuthAccounts(updatedAuth);
          setCurrentUser(existingStudent);
          setUserRole('student');
          localStorage.setItem('hostel_current_user_id', existingStudent.id);
          localStorage.setItem('hostel_current_user_role', 'student');
          return { success: true };
        }

        // Create new student record on the fly
        const newStudentId = 's_' + Date.now();
        const studentName = deriveName(trimmedEmail);
        const newStudent: StudentProfile = {
          id: newStudentId,
          fullName: studentName,
          email: trimmedEmail,
          role: 'student',
          phone: '+91 98765 43210',
          studentIdNo: 'ST-' + Math.floor(1000 + Math.random() * 9000),
          department: 'Computer Science & Eng',
          yearOfStudy: 2,
          emergencyContactName: 'Guardian',
          emergencyContactPhone: '+91 98000 00000',
          hostelBlock: 'Block A',
          roomNumber: '204',
          avatarUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString(),
        };

        const updatedStudents = [newStudent, ...studentList];
        localStore.setStudents(updatedStudents);
        setAllStudents(updatedStudents);

        const updatedAuth = [
          ...authAccounts,
          { email: trimmedEmail, password, role: 'student', profileId: newStudentId },
        ];
        localStore.setAuthAccounts(updatedAuth);

        // Initialize fee record
        const existingFees = localStore.getFees();
        localStore.setFees([
          {
            id: 'f_' + Date.now(),
            studentId: newStudentId,
            studentName: newStudent.fullName,
            academicTerm: 'Fall Semester 2026',
            totalAmount: 45000,
            paidAmount: 45000,
            dueDate: '2026-10-31',
            status: 'paid',
          },
          ...existingFees,
        ]);

        // Initialize attendance record
        const existingAtt = localStore.getAttendance();
        const initialAtt: AttendanceRecord = {
          id: 'att_' + Date.now(),
          studentId: newStudentId,
          studentName: newStudent.fullName,
          block: newStudent.hostelBlock,
          roomNumber: newStudent.roomNumber,
          date: new Date().toISOString().split('T')[0],
          status: 'present',
          markedBy: 'Curfew Desk Verification',
        };
        localStore.setAttendance([initialAtt, ...existingAtt]);

        // Sync directly into live Supabase tables
        supabaseApi.upsertStudent(newStudent);
        supabaseApi.upsertAttendance(initialAtt);

        setCurrentUser(newStudent);
        setUserRole('student');
        localStorage.setItem('hostel_current_user_id', newStudentId);
        localStorage.setItem('hostel_current_user_role', 'student');
        return { success: true };
      } else {
        // Warden Auto-Provisioning
        const wardenList = localStore.getWardens();
        const existingWarden = wardenList.find(
          (w) => w.email.toLowerCase() === trimmedEmail
        );

        if (existingWarden) {
          const updatedAuth = [
            ...authAccounts.filter((a) => a.email.toLowerCase() !== trimmedEmail),
            { email: trimmedEmail, password, role: 'warden', profileId: existingWarden.id },
          ];
          localStore.setAuthAccounts(updatedAuth);
          setCurrentUser(existingWarden);
          setUserRole('warden');
          localStorage.setItem('hostel_current_user_id', existingWarden.id);
          localStorage.setItem('hostel_current_user_role', 'warden');
          return { success: true };
        }

        const newWardenId = 'w_' + Date.now();
        const wardenName = deriveName(trimmedEmail);
        const newWarden: UserProfile = {
          id: newWardenId,
          fullName: 'Warden ' + wardenName,
          email: trimmedEmail,
          role: 'warden',
          phone: '+91 94440 12345',
          avatarUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString(),
        };

        const updatedWardens = [newWarden, ...wardenList];
        localStore.setWardens(updatedWardens);

        const updatedAuth = [
          ...authAccounts,
          { email: trimmedEmail, password, role: 'warden', profileId: newWardenId },
        ];
        localStore.setAuthAccounts(updatedAuth);

        // Sync warden profile to Supabase
        supabaseApi.upsertProfile(newWarden);

        setCurrentUser(newWarden);
        setUserRole('warden');
        localStorage.setItem('hostel_current_user_id', newWardenId);
        localStorage.setItem('hostel_current_user_role', 'warden');
        return { success: true };
      }
    }

    if (role === 'student') {
      const studentList = localStore.getStudents();
      const st = studentList.find(
        (s) => s.id === match.profileId || s.email.toLowerCase() === trimmedEmail
      );
      if (!st) {
        return { success: false, error: 'Student profile record not found.' };
      }
      setCurrentUser(st);
      setUserRole('student');
      localStorage.setItem('hostel_current_user_id', st.id);
      localStorage.setItem('hostel_current_user_role', 'student');
      return { success: true };
    } else {
      const wardenList = localStore.getWardens();
      const wd = wardenList.find(
        (w) => w.id === match.profileId || w.email.toLowerCase() === trimmedEmail
      );
      if (!wd) {
        return { success: false, error: 'Warden profile record not found.' };
      }
      setCurrentUser(wd);
      setUserRole('warden');
      localStorage.setItem('hostel_current_user_id', wd.id);
      localStorage.setItem('hostel_current_user_role', 'warden');
      return { success: true };
    }
  };

  /*
   * ============================================================
   * STUDENT REGISTRATION
   * ============================================================
   */
  const registerStudent = async (
    data: RegisterStudentData
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();

    // Check if email already registered
    const authAccounts = localStore.getAuthAccounts();
    if (authAccounts.some((a) => a.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    const students = localStore.getStudents();
    if (students.some((s) => s.studentIdNo.toLowerCase() === data.studentIdNo.trim().toLowerCase())) {
      return { success: false, error: 'A student with this Student ID Number already exists.' };
    }

    const newStudentId = 's_' + Date.now();
    const newStudent: StudentProfile = {
      id: newStudentId,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      role: 'student',
      phone: data.phone.trim(),
      studentIdNo: data.studentIdNo.trim(),
      department: data.department.trim(),
      yearOfStudy: Number(data.yearOfStudy),
      emergencyContactName: data.emergencyContactName.trim(),
      emergencyContactPhone: data.emergencyContactPhone.trim(),
      hostelBlock: data.hostelBlock.trim(),
      roomNumber: data.roomNumber.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString(),
    };

    // 1. Save in local accounts store
    const updatedStudents = [newStudent, ...students];
    localStore.setStudents(updatedStudents);
    setAllStudents(updatedStudents);

    const updatedAuth = [
      ...authAccounts,
      {
        email: trimmedEmail,
        password: data.password,
        role: 'student',
        profileId: newStudentId,
      },
    ];
    localStore.setAuthAccounts(updatedAuth);

    // 2. Initialize default fee record for this student
    const existingFees = localStore.getFees();
    const newFee = {
      id: 'f_' + Date.now(),
      studentId: newStudentId,
      studentName: newStudent.fullName,
      academicTerm: 'Fall Semester 2026',
      totalAmount: 45000,
      paidAmount: 0,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'pending' as const,
    };
    localStore.setFees([newFee, ...existingFees]);

    // 3. Initialize attendance for today
    const existingAttendance = localStore.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const newAttendance = {
      id: 'att_' + Date.now(),
      studentId: newStudentId,
      studentName: newStudent.fullName,
      block: newStudent.hostelBlock,
      roomNumber: newStudent.roomNumber,
      date: todayStr,
      status: 'present' as const,
      markedBy: 'Self Registration Verified',
    };
    localStore.setAttendance([newAttendance, ...existingAttendance]);

    // 4. Persist directly into live Supabase tables
    await supabaseApi.upsertStudent(newStudent);
    await supabaseApi.upsertAttendance(newAttendance);

    // 5. Automatically log the student in
    setCurrentUser(newStudent);
    setUserRole('student');
    localStorage.setItem('hostel_current_user_id', newStudentId);
    localStorage.setItem('hostel_current_user_role', 'student');

    return { success: true };
  };

  /*
   * ============================================================
   * WARDEN REGISTRATION
   * ============================================================
   */
  const registerWarden = async (
    data: RegisterWardenData
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const authAccounts = localStore.getAuthAccounts();
    if (authAccounts.some((a) => a.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newWardenId = 'w_' + Date.now();
    const newWarden: UserProfile = {
      id: newWardenId,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      role: 'warden',
      phone: data.phone.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString(),
    };

    const wardens = localStore.getWardens();
    const updatedWardens = [newWarden, ...wardens];
    localStore.setWardens(updatedWardens);

    const updatedAuth = [
      ...authAccounts,
      {
        email: trimmedEmail,
        password: data.password,
        role: 'warden',
        profileId: newWardenId,
      },
    ];
    localStore.setAuthAccounts(updatedAuth);

    // Sync warden profile to Supabase
    await supabaseApi.upsertProfile(newWarden);

    // Automatically log warden in
    setCurrentUser(newWarden);
    setUserRole('warden');
    localStorage.setItem('hostel_current_user_id', newWardenId);
    localStorage.setItem('hostel_current_user_role', 'warden');

    return { success: true };
  };

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */
  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Logout error:', e);
      }
    }

    setCurrentUser(null);
    setUserRole(null);
    setNotifications([]);
    localStorage.removeItem('hostel_current_user_id');
    localStorage.removeItem('hostel_current_user_role');
  };

  /*
   * ============================================================
   * NOTIFICATION ACTIONS
   * ============================================================
   */
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
      id: 'notif_' + Date.now() + Math.random().toString(36).substring(2, 6),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const all = localStore.getNotifications();
    localStore.setNotifications([newNotif, ...all]);

    if (
      currentUser &&
      (userId === currentUser.id || userId === 'all' || currentUser.role === 'warden' || currentUser.role === 'admin')
    ) {
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  /*
   * ============================================================
   * PROFILE & STUDENT MANAGEMENT BY WARDEN
   * ============================================================
   */
  const updateStudentProfile = (updatedFields: Partial<StudentProfile>) => {
    if (currentUser && currentUser.role === 'student') {
      const updated = {
        ...currentUser,
        ...updatedFields,
      } as StudentProfile;

      setCurrentUser(updated);

      const all = localStore.getStudents();
      const updatedList = all.map((s) => (s.id === currentUser.id ? updated : s));
      localStore.setStudents(updatedList);
      setAllStudents(updatedList);
    }
  };

  const addStudentByWarden = (studentData: Omit<StudentProfile, 'id' | 'createdAt'>) => {
    const newId = 's_' + Date.now();
    const newStudent: StudentProfile = {
      ...studentData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    const all = localStore.getStudents();
    const updatedList = [newStudent, ...all];
    localStore.setStudents(updatedList);
    setAllStudents(updatedList);

    // Also register default auth credentials so student can login
    const accounts = localStore.getAuthAccounts();
    localStore.setAuthAccounts([
      ...accounts,
      {
        email: newStudent.email.toLowerCase(),
        password: 'password123',
        role: 'student',
        profileId: newId,
      },
    ]);

    // Sync to Supabase
    supabaseApi.upsertStudent(newStudent);
  };

  const updateStudentByWarden = (studentId: string, updatedFields: Partial<StudentProfile>) => {
    const all = localStore.getStudents();
    const updatedList = all.map((s) => (s.id === studentId ? { ...s, ...updatedFields } : s));
    localStore.setStudents(updatedList);
    setAllStudents(updatedList);

    const updated = updatedList.find((s) => s.id === studentId);
    if (updated) {
      supabaseApi.upsertStudent(updated);
    }

    if (currentUser && currentUser.id === studentId) {
      setCurrentUser({ ...currentUser, ...updatedFields } as StudentProfile);
    }
  };

  const deleteStudentByWarden = (studentId: string) => {
    const all = localStore.getStudents();
    const updatedList = all.filter((s) => s.id !== studentId);
    localStore.setStudents(updatedList);
    setAllStudents(updatedList);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white text-xs font-semibold tracking-wider">Loading Smart Hostel Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        allStudents,
        notifications,
        unreadNotificationCount,
        loginWithCredentials,
        registerStudent,
        registerWarden,
        logout,
        markNotificationAsRead,
        addNotification,
        updateStudentProfile,
        addStudentByWarden,
        updateStudentByWarden,
        deleteStudentByWarden,
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