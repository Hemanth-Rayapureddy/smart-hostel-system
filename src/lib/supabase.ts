import { createClient } from '@supabase/supabase-js';
import {
  StudentProfile,
  UserProfile,
  Room,
  AttendanceRecord,
  LeaveRequest,
  Complaint,
  VisitorRequest,
  FeeRecord,
  Notice,
  NotificationItem,
  EmergencyAlert,
  RoomChangeRequest,
  MessFeedback,
  Poll,
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================
// DEMO MOCK DATA STORE (PERSISTED IN LOCALSTORAGE FOR PROD-LIKE TESTING)
// =========================================================

export const DEMO_STUDENTS: StudentProfile[] = [
  {
    id: 's1',
    fullName: 'Rahul Sharma',
    email: 'student1@hostel.com',
    role: 'student',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    studentIdNo: 'CS2023-042',
    department: 'Computer Science & Eng',
    yearOfStudy: 3,
    emergencyContactName: 'Ramesh Sharma (Father)',
    emergencyContactPhone: '+91 98123 45678',
    hostelBlock: 'Block A',
    roomNumber: '204',
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 's2',
    fullName: 'Ananya Roy',
    email: 'student2@hostel.com',
    role: 'student',
    phone: '+91 98765 11223',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    studentIdNo: 'EC2023-118',
    department: 'Electronics & Comm',
    yearOfStudy: 2,
    emergencyContactName: 'Subhash Roy (Father)',
    emergencyContactPhone: '+91 98456 78901',
    hostelBlock: 'Block B',
    roomNumber: '102',
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 's3',
    fullName: 'Vikram Singh',
    email: 'student3@hostel.com',
    role: 'student',
    phone: '+91 98765 99887',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    studentIdNo: 'ME2022-005',
    department: 'Mechanical Eng',
    yearOfStudy: 4,
    emergencyContactName: 'Manjit Singh (Father)',
    emergencyContactPhone: '+91 98765 00011',
    hostelBlock: 'Block C',
    roomNumber: '305',
    createdAt: '2025-08-01T00:00:00Z',
  },
];

export const DEMO_WARDEN: UserProfile = {
  id: 'w1',
  fullName: 'Dr. K. V. Raman',
  email: 'warden@hostel.com',
  role: 'warden',
  phone: '+91 94440 12345',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  createdAt: '2024-01-01T00:00:00Z',
};

// INITIAL MOCK DB DATA
const INITIAL_ROOMS: Room[] = [
  { id: 'r1', block: 'Block A', roomNumber: '204', floor: 2, capacity: 2, occupiedCount: 1, status: 'available' },
  { id: 'r2', block: 'Block B', roomNumber: '102', floor: 1, capacity: 2, occupiedCount: 1, status: 'available' },
  { id: 'r3', block: 'Block C', roomNumber: '305', floor: 3, capacity: 2, occupiedCount: 1, status: 'available' },
  { id: 'r4', block: 'Block D', roomNumber: '401', floor: 4, capacity: 3, occupiedCount: 3, status: 'full' },
  { id: 'r5', block: 'Block B', roomNumber: '201', floor: 2, capacity: 2, occupiedCount: 0, status: 'maintenance' },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att1', studentId: 's1', studentName: 'Rahul Sharma', block: 'Block A', roomNumber: '204', date: new Date().toISOString().split('T')[0], status: 'present' },
  { id: 'att2', studentId: 's2', studentName: 'Ananya Roy', block: 'Block B', roomNumber: '102', date: new Date().toISOString().split('T')[0], status: 'present' },
  { id: 'att3', studentId: 's3', studentName: 'Vikram Singh', block: 'Block C', roomNumber: '305', date: new Date().toISOString().split('T')[0], status: 'leave' },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    studentId: 's1',
    studentName: 'Rahul Sharma',
    block: 'Block A',
    roomNumber: '204',
    startDate: '2026-10-10',
    endDate: '2026-10-14',
    reason: 'Family wedding ceremony at home town',
    status: 'pending',
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'l2',
    studentId: 's2',
    studentName: 'Ananya Roy',
    block: 'Block B',
    roomNumber: '102',
    startDate: '2026-10-04',
    endDate: '2026-10-07', // Returning tomorrow / today
    reason: 'Medical checkup and dentist appointment',
    status: 'approved',
    wardenRemarks: 'Approved. Please submit doctor note upon return.',
    createdAt: '2026-10-02T14:30:00Z',
  },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    ticketNumber: 'CMP-2026-101',
    studentId: 's1',
    studentName: 'Rahul Sharma',
    category: 'water',
    title: 'Low water pressure in 2nd floor bathroom',
    description: 'The tap water flow is extremely weak since morning.',
    block: 'Block A',
    roomNumber: '204',
    isAnonymous: false,
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    status: 'in_progress',
    assignedTo: 'Plumber Suresh',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'c2',
    ticketNumber: 'CMP-2026-102',
    studentId: 's2',
    studentName: 'Ananya Roy',
    category: 'electricity',
    title: 'Tube light flickering continuously',
    description: 'Main room light flickers causing severe eye strain during study hours.',
    block: 'Block B',
    roomNumber: '102',
    isAnonymous: false,
    status: 'escalated',
    escalatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'c3',
    ticketNumber: 'CMP-2026-103',
    studentId: 's3',
    studentName: 'Anonymous Student',
    category: 'cleanliness',
    title: 'Corridor bin not emptied for 2 days',
    description: 'Overflowing dustbin near room 305 causing bad odor in hallway.',
    block: 'Block C',
    roomNumber: '305',
    isAnonymous: true,
    status: 'submitted',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

const INITIAL_VISITORS: VisitorRequest[] = [
  {
    id: 'v1',
    studentId: 's1',
    studentName: 'Rahul Sharma',
    block: 'Block A',
    roomNumber: '204',
    visitorName: 'Ramesh Sharma',
    relationship: 'Father',
    visitDate: '2026-10-15',
    expectedTime: '04:00 PM',
    purpose: 'Delivering winter clothing and books',
    status: 'approved',
    wardenRemarks: 'Approved for hostel visitor lobby only.',
    createdAt: '2026-10-06T09:00:00Z',
  },
];

const INITIAL_FEES: FeeRecord[] = [
  { id: 'f1', studentId: 's1', studentName: 'Rahul Sharma', academicTerm: 'Fall Semester 2026', totalAmount: 45000, paidAmount: 45000, dueDate: '2026-10-31', status: 'paid' },
  { id: 'f2', studentId: 's2', studentName: 'Ananya Roy', academicTerm: 'Fall Semester 2026', totalAmount: 45000, paidAmount: 25000, dueDate: '2026-10-20', status: 'partial' },
  { id: 'f3', studentId: 's3', studentName: 'Vikram Singh', academicTerm: 'Fall Semester 2026', totalAmount: 45000, paidAmount: 0, dueDate: '2026-10-15', status: 'pending' },
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Mandatory Hostel Cleanliness Drive & Room Inspection',
    description: 'All students must keep their rooms organized. Warden team will conduct room safety inspection this Saturday at 10 AM.',
    priority: 'important',
    expiryDate: '2026-10-20',
    createdBy: 'Warden Dr. K. V. Raman',
    createdAt: '2026-10-04T08:00:00Z',
  },
  {
    id: 'n2',
    title: 'Scheduled Water Tank Cleaning Notice',
    description: 'Water supply to Block A & B will be paused tomorrow from 2 PM to 5 PM for annual tank disinfection.',
    priority: 'emergency',
    expiryDate: '2026-10-08',
    createdBy: 'Warden Dr. K. V. Raman',
    createdAt: '2026-10-06T12:00:00Z',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif1',
    userId: 's1',
    title: 'Complaint Update',
    message: 'Your complaint CMP-2026-101 has been assigned to Plumber Suresh.',
    type: 'complaint',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'notif2',
    userId: 's2',
    title: 'Smart Return Reminder',
    message: 'Your approved leave ends tomorrow. Please return to hostel by 7:00 PM.',
    type: 'leave',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

const INITIAL_EMERGENCIES: EmergencyAlert[] = [
  {
    id: 'e1',
    studentId: 's3',
    studentName: 'Vikram Singh',
    type: 'medical',
    block: 'Block C',
    roomNumber: '305',
    status: 'active',
    notes: 'Severe asthma breathing discomfort, medical assistant requested.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

const INITIAL_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'What Sunday Special Lunch option do you prefer for Mess?',
    options: ['Paneer Butter Masala & Naan', 'Special Chicken Biryani', 'South Indian Feast'],
    votes: { 0: 14, 1: 28, 2: 9 },
    userVotedOption: 1,
    isActive: true,
    expiresAt: '2026-10-15T23:59:59Z',
    createdBy: 'Warden Dr. K. V. Raman',
    createdAt: '2026-10-01T10:00:00Z',
  },
];

// Helper to get or init localStorage JSON
function getStored<T>(key: string, initial: T): T {
  const item = localStorage.getItem(`hostel_app_${key}`);
  if (!item) {
    localStorage.setItem(`hostel_app_${key}`, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(item);
  } catch {
    return initial;
  }
}

function setStored<T>(key: string, value: T): void {
  localStorage.setItem(`hostel_app_${key}`, JSON.stringify(value));
}

// Data store accessors for mock mode
export const localStore = {
  getRooms: (): Room[] => getStored('rooms', INITIAL_ROOMS),
  setRooms: (data: Room[]) => setStored('rooms', data),

  getAttendance: (): AttendanceRecord[] => getStored('attendance', INITIAL_ATTENDANCE),
  setAttendance: (data: AttendanceRecord[]) => setStored('attendance', data),

  getLeaves: (): LeaveRequest[] => getStored('leaves', INITIAL_LEAVES),
  setLeaves: (data: LeaveRequest[]) => setStored('leaves', data),

  getComplaints: (): Complaint[] => getStored('complaints', INITIAL_COMPLAINTS),
  setComplaints: (data: Complaint[]) => setStored('complaints', data),

  getVisitors: (): VisitorRequest[] => getStored('visitors', INITIAL_VISITORS),
  setVisitors: (data: VisitorRequest[]) => setStored('visitors', data),

  getFees: (): FeeRecord[] => getStored('fees', INITIAL_FEES),
  setFees: (data: FeeRecord[]) => setStored('fees', data),

  getNotices: (): Notice[] => getStored('notices', INITIAL_NOTICES),
  setNotices: (data: Notice[]) => setStored('notices', data),

  getNotifications: (): NotificationItem[] => getStored('notifications', INITIAL_NOTIFICATIONS),
  setNotifications: (data: NotificationItem[]) => setStored('notifications', data),

  getEmergencies: (): EmergencyAlert[] => getStored('emergencies', INITIAL_EMERGENCIES),
  setEmergencies: (data: EmergencyAlert[]) => setStored('emergencies', data),

  getPolls: (): Poll[] => getStored('polls', INITIAL_POLLS),
  setPolls: (data: Poll[]) => setStored('polls', data),

  getRoomChangeRequests: (): RoomChangeRequest[] => getStored('room_changes', []),
  setRoomChangeRequests: (data: RoomChangeRequest[]) => setStored('room_changes', data),

  getMessFeedback: (): MessFeedback[] => getStored('mess_feedback', []),
  setMessFeedback: (data: MessFeedback[]) => setStored('mess_feedback', data),
};
