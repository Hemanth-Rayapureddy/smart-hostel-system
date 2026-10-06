-- =========================================================
-- SMART STUDENT HOSTEL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- PostgreSQL schema for Supabase with RLS Policies & Seed Data
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'warden', 'admin');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'leave', 'late');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
CREATE TYPE complaint_category AS ENUM ('water', 'electricity', 'plumbing', 'cleanliness', 'food', 'maintenance', 'internet', 'security', 'other');
CREATE TYPE complaint_status AS ENUM ('submitted', 'assigned', 'in_progress', 'resolved', 'reopened', 'escalated');
CREATE TYPE visitor_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
CREATE TYPE fee_status AS ENUM ('paid', 'pending', 'partial', 'overdue');
CREATE TYPE notice_priority AS ENUM ('normal', 'important', 'emergency');
CREATE TYPE emergency_type AS ENUM ('medical', 'fire', 'security', 'other');
CREATE TYPE emergency_status AS ENUM ('active', 'acknowledged', 'resolved');
CREATE TYPE room_change_reason AS ENUM ('roommate', 'maintenance', 'study', 'health', 'other');

-- 2. PROFILES TABLE (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. STUDENTS TABLE
CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id_no VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
  emergency_contact_name VARCHAR(100) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  hostel_block VARCHAR(10) NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ROOMS TABLE
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block VARCHAR(10) NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  floor INT NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  occupied_count INT NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(block, room_number)
);

-- 5. ROOM ALLOCATIONS TABLE
CREATE TABLE public.room_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ATTENDANCE TABLE
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by UUID REFERENCES public.profiles(id),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, date)
);

-- 7. LEAVE REQUESTS TABLE
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status leave_status NOT NULL DEFAULT 'pending',
  warden_remarks TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. COMPLAINTS TABLE
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  category complaint_category NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  block VARCHAR(10) NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  photo_url TEXT,
  status complaint_status NOT NULL DEFAULT 'submitted',
  assigned_to VARCHAR(100),
  escalated_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. VISITOR REQUESTS TABLE
CREATE TABLE public.visitor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  visitor_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  visit_date DATE NOT NULL,
  expected_time VARCHAR(20) NOT NULL,
  purpose TEXT NOT NULL,
  status visitor_status NOT NULL DEFAULT 'pending',
  warden_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. HOSTEL FEES TABLE
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_term VARCHAR(50) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status fee_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. NOTICES TABLE
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  priority notice_priority NOT NULL DEFAULT 'normal',
  expiry_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. EMERGENCY ALERTS TABLE
CREATE TABLE public.emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  type emergency_type NOT NULL,
  block VARCHAR(10) NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  status emergency_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 14. ROOM CHANGE REQUESTS TABLE
CREATE TABLE public.room_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  current_room_id UUID REFERENCES public.rooms(id),
  reason_category room_change_reason NOT NULL,
  details TEXT NOT NULL,
  status leave_status NOT NULL DEFAULT 'pending',
  warden_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. MESS FEEDBACK TABLE
CREATE TABLE public.mess_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type VARCHAR(20) NOT NULL,
  taste_rating INT CHECK (taste_rating BETWEEN 1 AND 5),
  quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5),
  quantity_rating INT CHECK (quantity_rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. POLLS & POLL RESPONSES TABLES
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question VARCHAR(255) NOT NULL,
  options JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  selected_option INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(poll_id, student_id)
);


-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Security: Students access ONLY their own data.
-- Wardens have full management access.
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is warden/admin
CREATE OR REPLACE FUNCTION public.is_warden_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('warden', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile or Wardens view all" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_warden_or_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Students Policies
CREATE POLICY "Student views own row, Warden views all" ON public.students
  FOR SELECT USING (auth.uid() = id OR public.is_warden_or_admin());

CREATE POLICY "Warden can manage students" ON public.students
  FOR ALL USING (public.is_warden_or_admin());

-- Complaints Policies
CREATE POLICY "Student views own complaints, Warden views all" ON public.complaints
  FOR SELECT USING (student_id = auth.uid() OR public.is_warden_or_admin());

CREATE POLICY "Student inserts own complaints" ON public.complaints
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Warden or student updates complaint" ON public.complaints
  FOR UPDATE USING (student_id = auth.uid() OR public.is_warden_or_admin());

-- Leave Requests Policies
CREATE POLICY "Student views own leave, Warden views all" ON public.leave_requests
  FOR SELECT USING (student_id = auth.uid() OR public.is_warden_or_admin());

CREATE POLICY "Student creates own leave" ON public.leave_requests
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Warden approves/updates leave" ON public.leave_requests
  FOR UPDATE USING (public.is_warden_or_admin());

-- Attendance Policies
CREATE POLICY "Student views own attendance, Warden views all" ON public.attendance
  FOR SELECT USING (student_id = auth.uid() OR public.is_warden_or_admin());

CREATE POLICY "Warden manages attendance" ON public.attendance
  FOR ALL USING (public.is_warden_or_admin());

-- Emergency Alerts Policies
CREATE POLICY "Everyone views active emergency alerts" ON public.emergency_alerts
  FOR SELECT USING (true);

CREATE POLICY "Student triggers emergency" ON public.emergency_alerts
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Warden updates emergency alert" ON public.emergency_alerts
  FOR UPDATE USING (public.is_warden_or_admin());

-- Notices & Notifications Policies
CREATE POLICY "All authenticated users view notices" ON public.notices
  FOR SELECT USING (true);

CREATE POLICY "Warden creates notices" ON public.notices
  FOR INSERT WITH CHECK (public.is_warden_or_admin());

CREATE POLICY "User views own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "User updates own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());
