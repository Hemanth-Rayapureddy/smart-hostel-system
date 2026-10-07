/*
# Smart Student Hostel Management System — Full Schema & RLS

## Purpose
Creates the complete PostgreSQL schema for the Smart Student Hostel Management
System on the connected Supabase project. The database is currently empty (no
tables, no enums, no functions). This migration provisions everything from
scratch in an idempotent manner so re-runs are safe.

## What This Migration Creates

### Extensions
- `uuid-ossp` — provides `uuid_generate_v4()` for default primary keys.

### Enum Types (10)
- `user_role` — student / warden / admin
- `attendance_status` — present / absent / leave / late
- `leave_status` — pending / approved / rejected / completed
- `complaint_category` — water / electricity / plumbing / cleanliness / food / maintenance / internet / security / other
- `complaint_status` — submitted / assigned / in_progress / resolved / reopened / escalated
- `visitor_status` — pending / approved / rejected / completed
- `fee_status` — paid / pending / partial / overdue
- `notice_priority` — normal / important / emergency
- `emergency_type` — medical / fire / security / other
- `emergency_status` — active / acknowledged / resolved
- `room_change_reason` — roommate / maintenance / study / health / other

### Tables (16)
1. `profiles` — extends `auth.users`; stores full_name, email, role, phone, avatar.
2. `students` — extends `profiles`; student_id_no, department, year, emergency contact, hostel block, room.
3. `rooms` — room inventory with block, floor, capacity, occupancy, status.
4. `room_allocations` — links students to rooms with assigned date and status.
5. `attendance` — daily night curfew attendance per student (unique per student+date).
6. `leave_requests` — out-pass / leave applications with status and warden remarks.
7. `complaints` — maintenance complaint tickets with category, photo, anonymous flag, status workflow.
8. `visitor_requests` — parent/guest visitor gate pass requests.
9. `fees` — hostel fee records with total, paid, due date, status.
10. `notices` — warden-published circulars with priority and expiry.
11. `notifications` — per-user in-app notifications.
12. `emergency_alerts` — SOS distress alerts with type and resolution tracking.
13. `room_change_requests` — formal room transfer applications.
14. `mess_feedback` — daily meal ratings (taste, quality, quantity) per student.
15. `polls` — warden-created voting polls with JSONB options and expiry.
16. `poll_responses` — individual student votes (unique per poll+student).

### Foreign Key Relationships
- `profiles.id` → `auth.users.id` (CASCADE)
- `students.id` → `profiles.id` (CASCADE)
- `room_allocations.student_id` → `students.id` (CASCADE)
- `room_allocations.room_id` → `rooms.id` (CASCADE)
- `attendance.student_id` → `students.id` (CASCADE)
- `attendance.marked_by` → `profiles.id`
- `leave_requests.student_id` → `students.id` (CASCADE)
- `leave_requests.approved_by` → `profiles.id`
- `complaints.student_id` → `students.id` (CASCADE)
- `visitor_requests.student_id` → `students.id` (CASCADE)
- `fees.student_id` → `students.id` (CASCADE)
- `notices.created_by` → `profiles.id`
- `notifications.user_id` → `profiles.id` (CASCADE)
- `emergency_alerts.student_id` → `students.id` (CASCADE)
- `room_change_requests.student_id` → `students.id` (CASCADE)
- `room_change_requests.current_room_id` → `rooms.id`
- `mess_feedback.student_id` → `students.id` (CASCADE)
- `polls.created_by` → `profiles.id`
- `poll_responses.poll_id` → `polls.id` (CASCADE)
- `poll_responses.student_id` → `students.id` (CASCADE)

### Indexes
- Unique constraints on: `profiles.email`, `students.student_id_no`, `rooms(block, room_number)`, `attendance(student_id, date)`, `poll_responses(poll_id, student_id)`, `complaints.ticket_number`.

### Security — Row Level Security
RLS is enabled on 15 of the 16 tables (room_allocations is the exception in the
original schema). A `SECURITY DEFINER` helper function `is_warden_or_admin()`
checks whether the current user has role 'warden' or 'admin' in `profiles`.

Policies enforce:
- **profiles**: users SELECT/UPDATE their own row; wardens SELECT all.
- **students**: students SELECT own row; wardens SELECT/INSERT/UPDATE/DELETE all (FOR ALL).
- **complaints**: students SELECT own + INSERT own; wardens SELECT/UPDATE all.
- **leave_requests**: students SELECT own + INSERT own; wardens SELECT/UPDATE all.
- **attendance**: students SELECT own; wardens manage all (FOR ALL).
- **emergency_alerts**: anyone can SELECT; students INSERT own; wardens UPDATE.
- **notices**: any authenticated user can SELECT; wardens INSERT.
- **notifications**: users SELECT/UPDATE own rows only.
- **rooms, visitor_requests, fees, room_change_requests, mess_feedback, polls, poll_responses**: RLS enabled but no policies yet (locked down by default).

### Important Notes
1. This migration is fully idempotent — all CREATE statements use IF NOT EXISTS
   or DO-EXCEPTION blocks, and all CREATE POLICY statements are preceded by
   DROP POLICY IF EXISTS.
2. The original schema.sql file on disk is NOT modified — this migration is
   applied directly to the live database via the Supabase migration tool.
3. `room_allocations` has RLS NOT enabled in the original schema. This is noted
   as a gap; it is left as-is per the instruction not to change the schema
   unnecessarily.
4. Tables `complaint_updates`, `visitors`, and `hostel_health_scores` from the
   verification list do not exist in the provided schema.sql and are therefore
   not created here.
*/

-- =========================================================
-- EXTENSION
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- ENUM TYPES (idempotent via DO-EXCEPTION blocks)
-- =========================================================
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('student', 'warden', 'admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'leave', 'late'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE complaint_category AS ENUM ('water', 'electricity', 'plumbing', 'cleanliness', 'food', 'maintenance', 'internet', 'security', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE complaint_status AS ENUM ('submitted', 'assigned', 'in_progress', 'resolved', 'reopened', 'escalated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE visitor_status AS ENUM ('pending', 'approved', 'rejected', 'completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE fee_status AS ENUM ('paid', 'pending', 'partial', 'overdue'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE notice_priority AS ENUM ('normal', 'important', 'emergency'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE emergency_type AS ENUM ('medical', 'fire', 'security', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE emergency_status AS ENUM ('active', 'acknowledged', 'resolved'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE room_change_reason AS ENUM ('roommate', 'maintenance', 'study', 'health', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =========================================================
-- TABLES
-- =========================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
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

-- 3. ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
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

-- 4. ROOM ALLOCATIONS
CREATE TABLE IF NOT EXISTS public.room_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by UUID REFERENCES public.profiles(id),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, date)
);

-- 6. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS public.leave_requests (
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

-- 7. COMPLAINTS
CREATE TABLE IF NOT EXISTS public.complaints (
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

-- 8. VISITOR REQUESTS
CREATE TABLE IF NOT EXISTS public.visitor_requests (
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

-- 9. FEES
CREATE TABLE IF NOT EXISTS public.fees (
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

-- 10. NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  priority notice_priority NOT NULL DEFAULT 'normal',
  expiry_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. EMERGENCY ALERTS
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
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

-- 13. ROOM CHANGE REQUESTS
CREATE TABLE IF NOT EXISTS public.room_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  current_room_id UUID REFERENCES public.rooms(id),
  reason_category room_change_reason NOT NULL,
  details TEXT NOT NULL,
  status leave_status NOT NULL DEFAULT 'pending',
  warden_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. MESS FEEDBACK
CREATE TABLE IF NOT EXISTS public.mess_feedback (
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

-- 15. POLLS
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question VARCHAR(255) NOT NULL,
  options JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. POLL RESPONSES
CREATE TABLE IF NOT EXISTS public.poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  selected_option INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(poll_id, student_id)
);

-- =========================================================
-- ROW LEVEL SECURITY
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

-- =========================================================
-- HELPER FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_warden_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('warden', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- RLS POLICIES (idempotent: DROP IF EXISTS before CREATE)
-- =========================================================

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile or Wardens view all" ON public.profiles;
CREATE POLICY "Users can view own profile or Wardens view all" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_warden_or_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- STUDENTS
DROP POLICY IF EXISTS "Student views own row, Warden views all" ON public.students;
CREATE POLICY "Student views own row, Warden views all" ON public.students
  FOR SELECT USING (auth.uid() = id OR public.is_warden_or_admin());

DROP POLICY IF EXISTS "Warden can manage students" ON public.students;
CREATE POLICY "Warden can manage students" ON public.students
  FOR ALL USING (public.is_warden_or_admin());

-- COMPLAINTS
DROP POLICY IF EXISTS "Student views own complaints, Warden views all" ON public.complaints;
CREATE POLICY "Student views own complaints, Warden views all" ON public.complaints
  FOR SELECT USING (student_id = auth.uid() OR public.is_warden_or_admin());

DROP POLICY IF EXISTS "Student inserts own complaints" ON public.complaints;
CREATE POLICY "Student inserts own complaints" ON public.complaints
  FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Warden or student updates complaint" ON public.complaints;
CREATE POLICY "Warden or student updates complaint" ON public.complaints
  FOR UPDATE USING (student_id = auth.uid() OR public.is_warden_or_admin());

-- LEAVE REQUESTS
DROP POLICY IF EXISTS "Student views own leave, Warden views all" ON public.leave_requests;
CREATE POLICY "Student views own leave, Warden views all" ON public.leave_requests
  FOR SELECT USING (student_id = auth.uid() OR public.is_warden_or_admin());

DROP POLICY IF EXISTS "Student creates own leave" ON public.leave_requests;
CREATE POLICY "Student creates own leave" ON public.leave_requests
  FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Warden approves/updates leave" ON public.leave_requests;
CREATE POLICY "Warden approves/updates leave" ON public.leave_requests
  FOR UPDATE USING (public.is_warden_or_admin());

-- ATTENDANCE
DROP POLICY IF EXISTS "Student views own attendance, Warden views all" ON public.attendance;
CREATE POLICY "Student views own attendance, Warden views all" ON public.attendance
  FOR SELECT USING (student_id = auth.uid() OR public.is_warden_or_admin());

DROP POLICY IF EXISTS "Warden manages attendance" ON public.attendance;
CREATE POLICY "Warden manages attendance" ON public.attendance
  FOR ALL USING (public.is_warden_or_admin());

-- EMERGENCY ALERTS
DROP POLICY IF EXISTS "Everyone views active emergency alerts" ON public.emergency_alerts;
CREATE POLICY "Everyone views active emergency alerts" ON public.emergency_alerts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Student triggers emergency" ON public.emergency_alerts;
CREATE POLICY "Student triggers emergency" ON public.emergency_alerts
  FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Warden updates emergency alert" ON public.emergency_alerts;
CREATE POLICY "Warden updates emergency alert" ON public.emergency_alerts
  FOR UPDATE USING (public.is_warden_or_admin());

-- NOTICES
DROP POLICY IF EXISTS "All authenticated users view notices" ON public.notices;
CREATE POLICY "All authenticated users view notices" ON public.notices
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Warden creates notices" ON public.notices;
CREATE POLICY "Warden creates notices" ON public.notices
  FOR INSERT WITH CHECK (public.is_warden_or_admin());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "User views own notifications" ON public.notifications;
CREATE POLICY "User views own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "User updates own notifications" ON public.notifications;
CREATE POLICY "User updates own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());
