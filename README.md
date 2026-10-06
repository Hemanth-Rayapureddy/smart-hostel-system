# Smart Student Hostel Management System 🏫

A modern, responsive, full-stack **Smart Student Hostel Management System** built with **React 18, TypeScript, Tailwind CSS, and Supabase (PostgreSQL with Row-Level Security)**.

Designed for seamless operation across mobile phones, tablets, laptops, and desktop computers.

---

## ✨ Features Overview

### 🎓 Student Portal
- **Dashboard**: Quick view of room allocation, daily attendance status, pending leave requests, active complaints, notices, and instant Emergency SOS.
- **My Profile & Room**: Personal details, editable contact info, hostel block & room capacity, and roommate information.
- **Attendance Tracker**: Night curfew attendance history and percentage calculation.
- **Leave / Out-Pass Requests**: Apply for out-pass permissions with dates and reason; track status (Pending, Approved, Rejected, Completed).
- **Smart Return Reminder**: Automated alerts when an approved leave return date is approaching.
- **Complaint Management**: Register complaints across categories (Water, Electricity, Plumbing, Cleanliness, Food, Maintenance, Internet, Security, Other) with optional photo upload link and **Submit Anonymously** privacy protection.
- **Visitor Gate Pass**: Submit guest/parent visitor requests with date and purpose.
- **Hostel Fees**: View fee statements, paid amounts, due balance, and deadlines.
- **Room Change Application**: Submit formal room reassignment applications to the warden.
- **Mess & Food Feedback**: Rating system (1-5 stars) for food taste, quality, and quantity.
- **Student Polls**: Participate in hostel decision voting polls.
- **Emergency SOS Button**: Fast 2-click distress alert dispatch to Warden and Security.

### 🛡️ Warden & Admin Operations Hub
- **Warden Dashboard**: Real-time room occupancy, active emergency alerts, pending out-passes, open complaints, and quick action bar.
- **Smart Hostel Health Score (0–100)**: Algorithmic health score calculated per block (`Block A`, `Block B`, `Block C`, `Block D`) based on unresolved tickets, escalated issues, and active emergency alerts.
- **Hostel Problem Heatmap**: Visual floor-by-floor and block-by-block maintenance heat matrix.
- **Complaints Hub**: Filter complaints by block, category, and status. Assign technicians, escalate tickets, inspect attached photos, and preserve student anonymity for anonymous tickets.
- **Leave Approvals**: Review and grant out-pass approvals with remarks.
- **Emergency Control & Broadcast**: Monitor live emergency alerts and broadcast announcements to specific hostel blocks or all residents.
- **Room Allocation Manager**: Add new rooms, set bed capacity, and update room maintenance status.
- **Student Directory**: Complete student records with emergency contact details.
- **Daily Night Attendance Manager**: Roll-call attendance marking by block and room.
- **Digital Notice Board & Poll Creator**: Post priority circulars with auto-expiry dates and create student voting polls.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **Database & Auth**: Supabase (PostgreSQL with RLS Policies) + Dual-Mode Mock Storage Engine
- **State & Context**: Custom Auth & Role-Based Access Control (RBAC) Context

---

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-hostel-system.git
cd smart-hostel-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Database Setup (Supabase)

To connect to your own Supabase project:

1. Create a project at [Supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run the full schema script provided in `supabase/schema.sql`.
3. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🔒 Security & Privacy

- **Strict Role-Based Access Control**: Students cannot access management routes or other students' private information.
- **Anonymous Complaints**: Complaints submitted anonymously mask the student identity in the Warden UI while keeping valid block & room ticket data.
- **Row-Level Security (RLS)**: Enforces database-level isolation where students can query only `auth.uid() = student_id`.

---

## 📄 License

MIT License. Free for educational and commercial use.
