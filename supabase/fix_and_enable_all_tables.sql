-- ==============================================================================
-- SMART STUDENT HOSTEL MANAGEMENT SYSTEM - SUPABASE SCHEMA & PERMISSIONS FIX
-- Run this script in your Supabase SQL Editor to allow all tables to store data!
-- ==============================================================================

-- 1. FIX COMPLAINTS TABLE
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_student_id_fkey;
ALTER TABLE public.complaints ALTER COLUMN student_id DROP NOT NULL;
ALTER TABLE public.complaints ALTER COLUMN student_id TYPE TEXT USING student_id::text;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS student_name TEXT;

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student inserts own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Student views own complaints, Warden views all" ON public.complaints;
DROP POLICY IF EXISTS "Warden or student updates complaint" ON public.complaints;
DROP POLICY IF EXISTS "Public full access complaints" ON public.complaints;

CREATE POLICY "Public full access complaints" ON public.complaints
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 2. FIX LEAVE REQUESTS TABLE
ALTER TABLE public.leave_requests DROP CONSTRAINT IF EXISTS leave_requests_student_id_fkey;
ALTER TABLE public.leave_requests ALTER COLUMN student_id DROP NOT NULL;
ALTER TABLE public.leave_requests ALTER COLUMN student_id TYPE TEXT USING student_id::text;
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS block TEXT;
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS room_number TEXT;

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student views own leave, Warden views all" ON public.leave_requests;
DROP POLICY IF EXISTS "Student creates own leave" ON public.leave_requests;
DROP POLICY IF EXISTS "Warden approves/updates leave" ON public.leave_requests;
DROP POLICY IF EXISTS "Public full access leave_requests" ON public.leave_requests;

CREATE POLICY "Public full access leave_requests" ON public.leave_requests
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. FIX VISITOR REQUESTS TABLE
ALTER TABLE public.visitor_requests DROP CONSTRAINT IF EXISTS visitor_requests_student_id_fkey;
ALTER TABLE public.visitor_requests ALTER COLUMN student_id DROP NOT NULL;
ALTER TABLE public.visitor_requests ALTER COLUMN student_id TYPE TEXT USING student_id::text;
ALTER TABLE public.visitor_requests ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.visitor_requests ADD COLUMN IF NOT EXISTS block TEXT;
ALTER TABLE public.visitor_requests ADD COLUMN IF NOT EXISTS room_number TEXT;

ALTER TABLE public.visitor_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access visitor_requests" ON public.visitor_requests;

CREATE POLICY "Public full access visitor_requests" ON public.visitor_requests
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. FIX EMERGENCY ALERTS TABLE
ALTER TABLE public.emergency_alerts DROP CONSTRAINT IF EXISTS emergency_alerts_student_id_fkey;
ALTER TABLE public.emergency_alerts ALTER COLUMN student_id DROP NOT NULL;
ALTER TABLE public.emergency_alerts ALTER COLUMN student_id TYPE TEXT USING student_id::text;
ALTER TABLE public.emergency_alerts ADD COLUMN IF NOT EXISTS student_name TEXT;

ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone views active emergency alerts" ON public.emergency_alerts;
DROP POLICY IF EXISTS "Student triggers emergency" ON public.emergency_alerts;
DROP POLICY IF EXISTS "Warden updates emergency alert" ON public.emergency_alerts;
DROP POLICY IF EXISTS "Public full access emergency_alerts" ON public.emergency_alerts;

CREATE POLICY "Public full access emergency_alerts" ON public.emergency_alerts
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. FIX ATTENDANCE TABLE
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_student_id_fkey;
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_student_id_date_key;
ALTER TABLE public.attendance ALTER COLUMN student_id DROP NOT NULL;
ALTER TABLE public.attendance ALTER COLUMN student_id TYPE TEXT USING student_id::text;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS block TEXT;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS room_number TEXT;

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student views own attendance, Warden views all" ON public.attendance;
DROP POLICY IF EXISTS "Warden manages attendance" ON public.attendance;
DROP POLICY IF EXISTS "Public full access attendance" ON public.attendance;

CREATE POLICY "Public full access attendance" ON public.attendance
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. FIX FEES TABLE
ALTER TABLE public.fees DROP CONSTRAINT IF EXISTS fees_student_id_fkey;
ALTER TABLE public.fees ALTER COLUMN student_id DROP NOT NULL;
ALTER TABLE public.fees ALTER COLUMN student_id TYPE TEXT USING student_id::text;
ALTER TABLE public.fees ADD COLUMN IF NOT EXISTS student_name TEXT;

ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access fees" ON public.fees;

CREATE POLICY "Public full access fees" ON public.fees
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 7. FIX NOTICES TABLE
ALTER TABLE public.notices DROP CONSTRAINT IF EXISTS notices_created_by_fkey;
ALTER TABLE public.notices ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE public.notices ALTER COLUMN created_by TYPE TEXT USING created_by::text;
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS created_by_name TEXT;

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All authenticated users view notices" ON public.notices;
DROP POLICY IF EXISTS "Warden creates notices" ON public.notices;
DROP POLICY IF EXISTS "Public full access notices" ON public.notices;

CREATE POLICY "Public full access notices" ON public.notices
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 8. FIX ROOMS, STUDENTS, PROFILES & NOTIFICATIONS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access rooms" ON public.rooms;
CREATE POLICY "Public full access rooms" ON public.rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile or Wardens view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public full access profiles" ON public.profiles;
CREATE POLICY "Public full access profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_id_fkey;
ALTER TABLE public.students ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student views own row, Warden views all" ON public.students;
DROP POLICY IF EXISTS "Warden can manage students" ON public.students;
DROP POLICY IF EXISTS "Public full access students" ON public.students;
CREATE POLICY "Public full access students" ON public.students FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications ALTER COLUMN user_id TYPE TEXT USING user_id::text;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User views own notifications" ON public.notifications;
DROP POLICY IF EXISTS "User updates own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public full access notifications" ON public.notifications;
CREATE POLICY "Public full access notifications" ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 9. INSERT YOUR SUBMITTED COMPLAINT DIRECTLY INTO SUPABASE
INSERT INTO public.complaints (
  ticket_number,
  student_id,
  student_name,
  category,
  title,
  description,
  block,
  room_number,
  is_anonymous,
  status
) VALUES 
(
  'CMP-2026-972',
  's1',
  'Resident Student',
  'maintenance',
  'water leakage',
  'too much of water waste',
  'Block A',
  '204',
  false,
  'submitted'
),
(
  'CMP-2026-101',
  's1',
  'Rahul Sharma',
  'water',
  'Low water pressure in 2nd floor bathroom',
  'The tap water flow is extremely weak since morning.',
  'Block A',
  '204',
  false,
  'in_progress'
),
(
  'CMP-2026-102',
  's2',
  'Ananya Roy',
  'electricity',
  'Tube light flickering continuously',
  'Main room light flickers causing severe eye strain during study hours.',
  'Block B',
  '102',
  false,
  'escalated'
)
ON CONFLICT (ticket_number) DO NOTHING;
