export type UserRole = 'student' | 'warden' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile extends UserProfile {
  studentIdNo: string;
  department: string;
  yearOfStudy: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  hostelBlock: string;
  roomNumber: string;
}

export interface Room {
  id: string;
  block: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupiedCount: number;
  status: 'available' | 'full' | 'maintenance';
  occupants?: StudentProfile[];
}

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  block?: string;
  roomNumber?: string;
  date: string;
  status: AttendanceStatus;
  markedBy?: string;
  remarks?: string;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName?: string;
  block?: string;
  roomNumber?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  wardenRemarks?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'water'
  | 'electricity'
  | 'plumbing'
  | 'cleanliness'
  | 'food'
  | 'maintenance'
  | 'internet'
  | 'security'
  | 'other';

export type ComplaintStatus =
  | 'submitted'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'reopened'
  | 'escalated';

export interface Complaint {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  block: string;
  roomNumber: string;
  isAnonymous: boolean;
  photoUrl?: string;
  status: ComplaintStatus;
  assignedTo?: string;
  escalatedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type VisitorStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface VisitorRequest {
  id: string;
  studentId: string;
  studentName?: string;
  block?: string;
  roomNumber?: string;
  visitorName: string;
  relationship: string;
  visitDate: string;
  expectedTime: string;
  purpose: string;
  status: VisitorStatus;
  wardenRemarks?: string;
  createdAt: string;
}

export type FeeStatus = 'paid' | 'pending' | 'partial' | 'overdue';

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName?: string;
  academicTerm: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: FeeStatus;
}

export type NoticePriority = 'normal' | 'important' | 'emergency';

export interface Notice {
  id: string;
  title: string;
  description: string;
  priority: NoticePriority;
  expiryDate: string;
  createdBy: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'leave' | 'complaint' | 'notice' | 'visitor' | 'fee' | 'emergency';
  isRead: boolean;
  createdAt: string;
}

export type EmergencyType = 'medical' | 'fire' | 'security' | 'other';
export type EmergencyStatus = 'active' | 'acknowledged' | 'resolved';

export interface EmergencyAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: EmergencyType;
  block: string;
  roomNumber: string;
  status: EmergencyStatus;
  notes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface RoomChangeRequest {
  id: string;
  studentId: string;
  studentName?: string;
  currentRoomId: string;
  currentRoomNumber: string;
  block: string;
  reasonCategory: 'roommate' | 'maintenance' | 'study' | 'health' | 'other';
  details: string;
  status: LeaveStatus;
  wardenRemarks?: string;
  createdAt: string;
}

export interface MessFeedback {
  id: string;
  studentId: string;
  studentName?: string;
  mealDate: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  tasteRating: number;
  qualityRating: number;
  quantityRating: number;
  comments?: string;
  createdAt: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Record<number, number>; // option index -> vote count
  userVotedOption?: number;
  isActive: boolean;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
}

export interface HostelBlockHealth {
  block: string;
  score: number;
  statusText: 'Good' | 'Needs Attention' | 'Critical';
  totalComplaints: number;
  unresolvedComplaints: number;
  escalatedComplaints: number;
  categoryBreakdown: Record<string, number>;
  floors: {
    floor: number;
    openComplaints: number;
    statusColor: 'green' | 'orange' | 'red';
  }[];
}

export interface HostelHealthOverview {
  overallScore: number;
  overallStatus: 'Good' | 'Needs Attention' | 'Critical';
  blockScores: HostelBlockHealth[];
}
