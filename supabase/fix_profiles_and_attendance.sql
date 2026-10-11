-- ==============================================================================
-- SMART STUDENT HOSTEL MANAGEMENT SYSTEM - PROFILES & ATTENDANCE FIX (FAST)
-- Drops all foreign keys pointing to profiles before altering column type
-- ==============================================================================

-- 1. DROP ALL FOREIGN KEYS POINTING TO PROFILES & STUDENTS
ALTER TABLE public.leave_requests DROP CONSTRAINT IF EXISTS leave_requests_approved_by_fkey;
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_marked_by_fkey;
ALTER TABLE public.notices DROP CONSTRAINT IF EXISTS notices_created_by_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS polls_created_by_fkey;
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.room_allocations DROP CONSTRAINT IF EXISTS room_allocations_student_id_fkey;
ALTER TABLE public.room_change_requests DROP CONSTRAINT IF EXISTS room_change_requests_student_id_fkey;
ALTER TABLE public.mess_feedback DROP CONSTRAINT IF EXISTS mess_feedback_student_id_fkey;
ALTER TABLE public.poll_responses DROP CONSTRAINT IF EXISTS poll_responses_student_id_fkey;

-- 2. NOW SAFELY ALTER ID COLUMNS TO TEXT
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE public.students ALTER COLUMN id TYPE TEXT USING id::text;

-- 3. ENABLE PUBLIC READ/WRITE POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access profiles" ON public.profiles;
CREATE POLICY "Public full access profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access students" ON public.students;
CREATE POLICY "Public full access students" ON public.students FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access attendance" ON public.attendance;
CREATE POLICY "Public full access attendance" ON public.attendance FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. INSERT HEMANTH & RESIDENT PROFILES
INSERT INTO public.profiles (id, full_name, email, role, phone)
VALUES 
  ('s_1791711920635', 'Hemanth', 'hemanth@gmail.com', 'student', '+91 98765 43210'),
  ('s1', 'Rahul Sharma', 'student1@hostel.com', 'student', '+91 98765 43210'),
  ('s2', 'Ananya Roy', 'student2@hostel.com', 'student', '+91 98765 11223'),
  ('s3', 'Vikram Singh', 'student3@hostel.com', 'student', '+91 98765 99887'),
  ('w1', 'Dr. K. V. Raman', 'warden@hostel.com', 'warden', '+91 94440 12345')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

-- 5. INSERT HEMANTH & RESIDENT STUDENTS
INSERT INTO public.students (id, student_id_no, department, year_of_study, emergency_contact_name, emergency_contact_phone, hostel_block, room_number)
VALUES
  ('s_1791711920635', 'ST-2026-972', 'Computer Science & Eng', 2, 'Guardian', '+91 98000 00000', 'Block A', '204'),
  ('s1', 'CS2023-042', 'Computer Science & Eng', 3, 'Ramesh Sharma (Father)', '+91 98123 45678', 'Block A', '204'),
  ('s2', 'EC2023-118', 'Electronics & Comm', 2, 'Subhash Roy (Father)', '+91 98456 78901', 'Block B', '102'),
  ('s3', 'ME2022-005', 'Mechanical Eng', 4, 'Manjit Singh (Father)', '+91 98765 00011', 'Block C', '305')
ON CONFLICT (id) DO UPDATE SET student_id_no = EXCLUDED.student_id_no, hostel_block = EXCLUDED.hostel_block, room_number = EXCLUDED.room_number;

-- 6. INSERT ATTENDANCE RECORDS FOR ALL RESIDENTS
INSERT INTO public.attendance (student_id, student_name, block, room_number, date, status)
VALUES
  ('s_1791711920635', 'Hemanth', 'Block A', '204', CURRENT_DATE, 'present'),
  ('s1', 'Rahul Sharma', 'Block A', '204', CURRENT_DATE, 'present'),
  ('s2', 'Ananya Roy', 'Block B', '102', CURRENT_DATE, 'present'),
  ('s3', 'Vikram Singh', 'Block C', '305', CURRENT_DATE, 'leave')
ON CONFLICT DO NOTHING;
