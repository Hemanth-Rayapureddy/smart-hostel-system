import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NoticeBoard from './pages/NoticeBoard';
import Contact from './pages/Contact';

// Initial Mock Data Fallback for smooth state transitions
const initialRooms = [
  {
    id: "rm-101",
    roomNo: "A-101",
    floor: 1,
    block: "Block A - Blue Crest",
    type: "2-Sharing AC",
    pricePerSemester: "$1,200",
    amenities: ["AC", "Attached Bath", "Study Table", "High-Speed WiFi", "Balcony"],
    beds: [
      { id: "A-101-BedA", name: "Bed A (Window)", isOccupied: true, studentId: "u-student-9", studentName: "Michael Chang" },
      { id: "A-101-BedB", name: "Bed B (Door)", isOccupied: false, studentId: null, studentName: null }
    ]
  },
  {
    id: "rm-102",
    roomNo: "A-102",
    floor: 1,
    block: "Block A - Blue Crest",
    type: "2-Sharing Non-AC",
    pricePerSemester: "$900",
    amenities: ["Ceiling Fan", "Shared Bath", "Study Desk", "High-Speed WiFi"],
    beds: [
      { id: "A-102-BedA", name: "Bed A", isOccupied: true, studentId: "u-student-10", studentName: "Daniel Smith" },
      { id: "A-102-BedB", name: "Bed B", isOccupied: true, studentId: "u-student-11", studentName: "David Miller" }
    ]
  },
  {
    id: "rm-204",
    roomNo: "A-204",
    floor: 2,
    block: "Block A - Blue Crest",
    type: "3-Sharing Deluxe AC",
    pricePerSemester: "$1,350",
    amenities: ["AC", "Attached Bath", "Personal Locker", "High-Speed WiFi", "Garden View"],
    beds: [
      { id: "A-204-BedA", name: "Bed A (Garden View)", isOccupied: true, studentId: "u-student-2", studentName: "Sophia Martinez" },
      { id: "A-204-BedB", name: "Bed B (Study Alcove)", isOccupied: true, studentId: "u-student-1", studentName: "Alex Johnson" },
      { id: "A-204-BedC", name: "Bed C (Available)", isOccupied: false, studentId: null, studentName: null }
    ]
  },
  {
    id: "rm-205",
    roomNo: "A-205",
    floor: 2,
    block: "Block A - Blue Crest",
    type: "2-Sharing AC",
    pricePerSemester: "$1,200",
    amenities: ["AC", "Attached Bath", "Study Table", "WiFi"],
    beds: [
      { id: "A-205-BedA", name: "Bed A", isOccupied: false, studentId: null, studentName: null },
      { id: "A-205-BedB", name: "Bed B", isOccupied: false, studentId: null, studentName: null }
    ]
  }
];

const initialUsers = [
  {
    id: "u-admin-1",
    name: "Dr. Robert Vance",
    email: "admin@hostel.edu",
    role: "Admin",
    phone: "+1 (555) 019-2834",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    department: "Chief Hostel Administrator",
    joiningDate: "2021-08-15"
  },
  {
    id: "u-warden-1",
    name: "Prof. Marcus Brody",
    email: "warden@hostel.edu",
    role: "Warden",
    phone: "+1 (555) 012-9988",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    assignedBlock: "Block A - Blue Crest",
    shift: "Day & Evening"
  },
  {
    id: "u-student-1",
    name: "Alex Johnson",
    email: "alex.j@student.edu",
    role: "Student",
    rollNo: "CS-2024-042",
    course: "B.Tech Computer Science (3rd Year)",
    phone: "+1 (555) 018-7733",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
    roomNo: "A-204",
    bedNo: "Bed B",
    block: "Block A - Blue Crest",
    guardianName: "Richard Johnson",
    guardianPhone: "+1 (555) 018-9900",
    feeStatus: "Paid",
    attendancePercentage: 94
  },
  {
    id: "u-student-2",
    name: "Sophia Martinez",
    email: "sophia.m@student.edu",
    role: "Student",
    rollNo: "EC-2024-019",
    course: "B.Tech Electronics (2nd Year)",
    phone: "+1 (555) 017-3322",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    roomNo: "A-204",
    bedNo: "Bed A",
    block: "Block A - Blue Crest",
    guardianName: "Carlos Martinez",
    guardianPhone: "+1 (555) 017-4488",
    feeStatus: "Paid",
    attendancePercentage: 98
  },
  {
    id: "u-student-3",
    name: "Liam O'Connor",
    email: "liam.o@student.edu",
    role: "Student",
    rollNo: "ME-2024-088",
    course: "B.Tech Mechanical (4th Year)",
    phone: "+1 (555) 016-5544",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    roomNo: "B-102",
    bedNo: "Bed A",
    block: "Block B - Emerald Hall",
    guardianName: "Patrick O'Connor",
    guardianPhone: "+1 (555) 016-1122",
    feeStatus: "Due",
    attendancePercentage: 88
  }
];

const initialLeaves = [
  {
    id: "l-101",
    studentId: "u-student-1",
    studentName: "Alex Johnson",
    roomNo: "A-204",
    reason: "Attending National AI hackathon at Tech Summit City",
    startDate: "2026-07-28",
    endDate: "2026-07-31",
    destination: "San Francisco, CA",
    status: "Approved",
    appliedOn: "2026-07-20",
    approvedBy: "Prof. Marcus Brody"
  },
  {
    id: "l-102",
    studentId: "u-student-3",
    studentName: "Liam O'Connor",
    roomNo: "B-102",
    reason: "Family emergency visit to hometown",
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    destination: "Chicago, IL",
    status: "Approved",
    appliedOn: "2026-07-22",
    approvedBy: "Sarah Jenkins"
  }
];

const initialComplaints = [
  {
    id: "c-301",
    studentId: "u-student-1",
    studentName: "Alex Johnson",
    roomNo: "A-204",
    category: "Maintenance",
    title: "AC cooling issue in Room A-204",
    description: "The AC unit is blowing ambient air and making a low humming noise. Requesting technician check.",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-07-23",
    resolution: "Technician assigned for maintenance."
  }
];

const initialVisitors = [
  {
    id: "v-501",
    studentId: "u-student-1",
    studentName: "Alex Johnson",
    visitorName: "Richard Johnson",
    relation: "Father",
    contact: "+1 (555) 018-9900",
    purpose: "Delivering luggage & textbook supplies",
    visitDate: "2026-07-25",
    timeSlot: "02:00 PM - 05:00 PM",
    status: "Approved",
    approvedBy: "Prof. Marcus Brody"
  }
];

const initialFees = [
  {
    id: "f-101",
    studentId: "u-student-1",
    studentName: "Alex Johnson",
    roomNo: "A-204",
    academicYear: "2026-2027 (Fall Semester)",
    roomRent: 1350,
    messCharges: 450,
    utilityDeposit: 150,
    totalAmount: 1950,
    paidAmount: 1950,
    status: "Paid",
    dueDate: "2026-08-10",
    paymentDate: "2026-07-10",
    transactionId: "TXN-8829104-X"
  },
  {
    id: "f-102",
    studentId: "u-student-3",
    studentName: "Liam O'Connor",
    roomNo: "B-102",
    academicYear: "2026-2027 (Fall Semester)",
    roomRent: 900,
    messCharges: 450,
    utilityDeposit: 150,
    totalAmount: 1500,
    paidAmount: 0,
    status: "Due",
    dueDate: "2026-08-10",
    paymentDate: null,
    transactionId: null
  }
];

const initialNotices = [
  {
    id: "n-1",
    title: "Hostel Entry Curfew & Gate Timing Reminder",
    category: "Announcement",
    content: "All hostel residents are advised that the main entrance gates will strictly close at 10:00 PM daily. Late entry requires warden approval.",
    author: "Dr. Robert Vance (Admin)",
    date: "2026-07-22",
    pinned: true
  },
  {
    id: "n-2",
    title: "Annual Sports & Cultural Festival Registration",
    category: "Events",
    content: "Registration for inter-hostel football, chess, and robotics tournaments is now open until July 30th.",
    author: "Prof. Marcus Brody (Warden)",
    date: "2026-07-21",
    pinned: false
  }
];

const initialRules = [
  { id: "r-1", title: "Quiet Hours Policy", detail: "Strict silence in study blocks from 10:30 PM to 6:00 AM." },
  { id: "r-2", title: "Visitor Guidelines", detail: "External guests allowed only in common lounge between 9:00 AM and 6:00 PM." }
];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeRole, setActiveRole] = useState('Student');
  const [darkMode, setDarkMode] = useState(true);

  // Application Data States
  const [users, setUsers] = useState(initialUsers);
  const [rooms, setRooms] = useState(initialRooms);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [visitors, setVisitors] = useState(initialVisitors);
  const [fees, setFees] = useState(initialFees);
  const [notices, setNotices] = useState(initialNotices);
  const [rules, setRules] = useState(initialRules);

  // Handle Dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch initial data from Express backend if server is up
  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length) setRooms(data); })
      .catch(() => {});

    fetch('/api/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length) setUsers(data); })
      .catch(() => {});
  }, []);

  // Handlers for Stateful Actions & Ticket Room Allocations
  const handleAllocateBed = (roomId, bedId, studentId, studentName) => {
    setRooms(prevRooms => prevRooms.map(rm => {
      if (rm.id === roomId || rm.roomNo === roomId) {
        return {
          ...rm,
          beds: rm.beds.map(b => b.id === bedId ? { ...b, isOccupied: true, studentId, studentName } : b)
        };
      }
      return rm;
    }));

    setUsers(prev => prev.map(u => {
      if (u.id === studentId || u.name === studentName) {
        const matchedRoom = rooms.find(r => r.id === roomId || r.roomNo === roomId);
        const matchedBed = matchedRoom?.beds.find(b => b.id === bedId);
        return {
          ...u,
          roomNo: matchedRoom?.roomNo || 'A-204',
          bedNo: matchedBed?.name || 'Bed C',
          block: matchedRoom?.block || 'Block A - Blue Crest'
        };
      }
      return u;
    }));
  };

  const handleSaveAttendance = (records, markedBy, date) => {
    // API call or local update
    fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendanceRecords: records, markedBy, date })
    }).catch(() => {});
  };

  const handleApplyLeave = (leaveData) => {
    const newLeave = {
      id: `l-${Date.now()}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      approvedBy: null,
      ...leaveData
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const handleUpdateLeaveStatus = (id, status, approvedBy) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status, approvedBy } : l));
  };

  const handleSubmitComplaint = (complaintData) => {
    const newC = {
      id: `c-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      resolution: null,
      ...complaintData
    };
    setComplaints(prev => [newC, ...prev]);
  };

  const handleUpdateComplaintStatus = (id, status, resolution) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, resolution: resolution || c.resolution } : c));
  };

  const handleRequestVisitor = (visitorData) => {
    const newV = {
      id: `v-${Date.now()}`,
      status: 'Pending',
      approvedBy: null,
      ...visitorData
    };
    setVisitors(prev => [newV, ...prev]);
  };

  const handleUpdateVisitorStatus = (id, status, approvedBy) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status, approvedBy } : v));
  };

  const handlePayFee = (feeId) => {
    setFees(prev => prev.map(f => {
      if (f.id === feeId) {
        return {
          ...f,
          status: 'Paid',
          paidAmount: f.totalAmount,
          paymentDate: new Date().toISOString().split('T')[0],
          transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}-SUCCESS`
        };
      }
      return f;
    }));
  };

  const handleAddUser = (newUser) => {
    const created = { id: `u-${Date.now()}`, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250", attendancePercentage: 100, ...newUser };
    setUsers(prev => [...prev, created]);
  };

  const handleAddNotice = (noticeData) => {
    const newN = { id: `n-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...noticeData };
    setNotices(prev => [newN, ...prev]);
  };

  const handleAddRule = (ruleData) => {
    const newR = { id: `r-${Date.now()}`, ...ruleData };
    setRules(prev => [...prev, newR]);
  };

  // Current active logged-in user profile
  const currentStudent = users.find(u => u.role === 'Student') || users[2];
  const currentWarden = users.find(u => u.role === 'Warden') || users[1];
  const currentAdmin = users.find(u => u.role === 'Admin') || users[0];

  const analytics = {
    totalStudents: users.filter(u => u.role === 'Student').length,
    totalWardens: users.filter(u => u.role === 'Warden').length,
    totalBeds: rooms.reduce((sum, r) => sum + r.beds.length, 0),
    occupiedBeds: rooms.reduce((sum, r) => sum + r.beds.filter(b => b.isOccupied).length, 0),
    availableBeds: rooms.reduce((sum, r) => sum + r.beds.filter(b => !b.isOccupied).length, 0),
    occupancyRate: Math.round((rooms.reduce((sum, r) => sum + r.beds.filter(b => b.isOccupied).length, 0) / (rooms.reduce((sum, r) => sum + r.beds.length, 0) || 1)) * 100),
    feeStats: {
      totalCollected: fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.totalAmount, 0),
      totalDue: fees.filter(f => f.status === 'Due').reduce((sum, f) => sum + f.totalAmount, 0)
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 flex flex-col justify-between`}>
      
      {/* Navbar Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        user={activeRole === 'Admin' ? currentAdmin : activeRole === 'Warden' ? currentWarden : currentStudent}
      />

      {/* Main Page Body Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {activePage === 'home' && (
          <Home 
            setActivePage={setActivePage} 
            setActiveRole={setActiveRole} 
            roomsData={rooms} 
            onAllocateBed={handleAllocateBed} 
          />
        )}

        {activePage === 'about' && <About />}

        {activePage === 'features' && <Features setActivePage={setActivePage} />}

        {activePage === 'student-dashboard' && (
          <StudentDashboard 
            student={currentStudent}
            leaves={leaves}
            complaints={complaints}
            visitors={visitors}
            fees={fees}
            notices={notices}
            roomsData={rooms}
            onApplyLeave={handleApplyLeave}
            onSubmitComplaint={handleSubmitComplaint}
            onRequestVisitor={handleRequestVisitor}
            onPayFee={handlePayFee}
            onAllocateBed={handleAllocateBed}
          />
        )}

        {activePage === 'warden-dashboard' && (
          <WardenDashboard 
            warden={currentWarden}
            students={users.filter(u => u.role === 'Student')}
            leaves={leaves}
            complaints={complaints}
            visitors={visitors}
            roomsData={rooms}
            onSaveAttendance={handleSaveAttendance}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
            onUpdateVisitorStatus={handleUpdateVisitorStatus}
            onAllocateBed={handleAllocateBed}
          />
        )}

        {activePage === 'admin-dashboard' && (
          <AdminDashboard 
            admin={currentAdmin}
            users={users}
            roomsData={rooms}
            rules={rules}
            analytics={analytics}
            onAddUser={handleAddUser}
            onAddRule={handleAddRule}
            onAllocateBed={handleAllocateBed}
          />
        )}

        {activePage === 'notices' && (
          <NoticeBoard 
            notices={notices} 
            activeRole={activeRole} 
            onAddNotice={handleAddNotice} 
          />
        )}

        {activePage === 'contact' && <Contact />}
      </main>

      {/* Footer Component */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
