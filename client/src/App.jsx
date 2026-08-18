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
  }
];

const initialTimings = [
  { id: "t-1", category: "Hostel Entry Curfew", time: "10:00 PM Daily", detail: "Main gate locks strictly. Late arrival requires pre-approved Warden pass.", status: "Strict" },
  { id: "t-2", category: "Breakfast Service", time: "07:30 AM - 09:30 AM", detail: "Dining Hall 1 & 2. Hot fresh breakfast & tea/coffee counter.", status: "Mess Schedule" },
  { id: "t-3", category: "Lunch Service", time: "12:30 PM - 02:30 PM", detail: "Full meal menu with salad bar and dessert.", status: "Mess Schedule" },
  { id: "t-4", category: "Evening Tea & Snacks", time: "05:00 PM - 06:30 PM", detail: "Crispy snacks, sandwiches, hot tea & coffee.", status: "Mess Schedule" },
  { id: "t-5", category: "Dinner Service", time: "07:30 PM - 09:30 PM", detail: "Dinner buffet with roti, rice, paneer/chicken curries.", status: "Mess Schedule" },
  { id: "t-6", category: "Quiet Study Hours", time: "10:30 PM - 06:00 AM", detail: "Library & floor corridor silence policy for peaceful study.", status: "Daily Policy" },
  { id: "t-7", category: "Visitor Lounge Hours", time: "09:00 AM - 06:00 PM", detail: "Parents & registered guests permitted in ground floor lounge.", status: "Security" },
  { id: "t-8", category: "Gym & Sports Complex", time: "06:00 AM - 09:00 PM", detail: "Fitness equipment, badminton courts & indoor games.", status: "Recreation" }
];

const initialMessMenu = [
  {
    day: "Monday",
    breakfast: "Puri Bhaji, Oats Porridge, Boiled Eggs, Fresh Fruits, Tea/Coffee",
    lunch: "Rajma Masala, Steamed Basmati Rice, Butter Roti, Cucumber Salad, Curd",
    snacks: "Samosa with Mint Chutney, Masala Tea, Coffee",
    dinner: "Kadai Paneer / Chicken Curry, Dal Tadka, Jeera Rice, Chapati, Gulab Jamun",
    specialTag: "Chef Special North Indian Thali"
  },
  {
    day: "Tuesday",
    breakfast: "Idli Sambhar, Coconut Chutney, Cornflakes with Milk, Coffee",
    lunch: "Chole Bhature, Veg Pulao, Boondi Raita, Onion Salad",
    snacks: "Veg Cheese Sandwich, Cold Coffee",
    dinner: "Mix Veg Handi, Dal Makhani, Phulka, Steamed Rice, Fruit Custard",
    specialTag: "South Indian Special Breakfast"
  },
  {
    day: "Wednesday",
    breakfast: "Aloo Paratha with White Butter, Curd, Sprouts, Hot Tea",
    lunch: "Kadhi Pakoda, Steam Rice, Bhindi Fry, Chapati, Roasted Papad",
    snacks: "Pav Bhaji, Lemonade",
    dinner: "Paneer Butter Masala / Butter Chicken, Garlic Naan, Veg Biryani, Ice Cream",
    specialTag: "Special Feast Dinner"
  },
  {
    day: "Thursday",
    breakfast: "Masala Dosa, Tomato Chutney, Medu Vada, Filter Coffee",
    lunch: "Dal Fry, Jeera Aloo, Peas Pulao, Roti, Salad",
    snacks: "Bhel Puri / Sev Puri, Ginger Tea",
    dinner: "Malai Kofta, Dal Panchmel, Butter Roti, Basmati Rice, Kheer",
    specialTag: "Comfort Food Menu"
  },
  {
    day: "Friday",
    breakfast: "Poha with Roasted Peanuts, Veg Cutlet, Omelette, Tea",
    lunch: "Veg Hyderabadi Biryani / Chicken Biryani, Mirchi Ka Salan, Raita",
    snacks: "French Fries with Dip, Hot Chocolate",
    dinner: "Paneer Tikka Masala, Dal Makhani, Tandoori Roti, Veg Pulao, Rasgulla",
    specialTag: "Biryani Special Friday"
  },
  {
    day: "Saturday",
    breakfast: "Uttapam with Sambhar, Upma, Fresh Orange Juice, Tea",
    lunch: "Aloo Gobi, Chana Dal, Rice, Chapati, Green Salad",
    snacks: "Bread Pakora, Hot Coffee",
    dinner: "Shahi Paneer, Dal Tadka, Missi Roti, Steamed Rice, Moong Dal Halwa",
    specialTag: "Traditional Thali"
  },
  {
    day: "Sunday",
    breakfast: "Chole Puri, Sweet Lassi, Boiled Eggs, Fruits",
    lunch: "Special Dum Biryani (Veg/Non-Veg), Paneer Pasanda, Garlic Naan, Sweet Paan",
    snacks: "Samosa Chaat, Milkshake",
    dinner: "Hakha Noodles, Manchurian, Fried Rice, Ice Cream Sundae",
    specialTag: "Sunday Fiesta Special"
  }
];

const initialActivities = [
  {
    id: "act-1",
    title: "Inter-Hostel Chess Championship 2026",
    category: "Sports & Gaming",
    date: "2026-08-25",
    time: "04:00 PM - 08:00 PM",
    venue: "Block A Common Recreation Lounge",
    organizer: "Hostel Sports Council",
    description: "Speed chess tournament with trophies & cash prizes for top 3 grandmasters.",
    maxSlots: 32,
    registeredCount: 21,
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "act-2",
    title: "Annual Cultural Music & Open Mic Night",
    category: "Cultural & Arts",
    date: "2026-08-30",
    time: "06:30 PM - 09:30 PM",
    venue: "Central Amphitheatre Grounds",
    organizer: "Student Cultural Committee",
    description: "Live acoustic performances, poetry reading, stand-up comedy, and band acts.",
    maxSlots: 100,
    registeredCount: 64,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "act-3",
    title: "Robotics & AI Innovation Hackathon",
    category: "Technical & Tech",
    date: "2026-09-05",
    time: "09:00 AM - 06:00 PM",
    venue: "Smart Innovation Lab Floor 3",
    organizer: "Hostel IT & Tech Society",
    description: "24-hour prototype build challenge. IoT smart room projects & automation.",
    maxSlots: 50,
    registeredCount: 38,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400"
  }
];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeRole, setActiveRole] = useState('Student');
  const [darkMode, setDarkMode] = useState(true);

  // Application Data States
  const [users, setUsers] = useState(initialUsers);
  const [rooms, setRooms] = useState(initialRooms);
  const [timings, setTimings] = useState(initialTimings);
  const [messMenu, setMessMenu] = useState(initialMessMenu);
  const [activities, setActivities] = useState(initialActivities);

  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [fees, setFees] = useState([
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
      paymentDate: "2026-08-01",
      transactionId: "TXN-8829104-X"
    }
  ]);
  const [notices, setNotices] = useState([
    {
      id: "n-1",
      title: "Hostel Entry Curfew & Gate Timing Reminder",
      category: "Announcement",
      content: "All hostel residents are advised that main entrance gates close strictly at 10:00 PM daily. Late entry requires warden clearance.",
      author: "Dr. Robert Vance (Admin)",
      date: "2026-08-15",
      pinned: true
    }
  ]);
  const [rules, setRules] = useState([
    { id: "r-1", title: "Quiet Hours Policy", detail: "Strict silence in study blocks from 10:30 PM to 6:00 AM." }
  ]);

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

    fetch('/api/timings')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length) setTimings(data); })
      .catch(() => {});

    fetch('/api/mess-menu')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length) setMessMenu(data); })
      .catch(() => {});

    fetch('/api/activities')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length) setActivities(data); })
      .catch(() => {});
  }, []);

  // Handlers
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
  };

  const handleRegisterActivity = (activityId, studentId, studentName) => {
    setActivities(prev => prev.map(a => {
      if (a.id === activityId && a.registeredCount < a.maxSlots) {
        return { ...a, registeredCount: a.registeredCount + 1 };
      }
      return a;
    }));
  };

  const handleSaveAttendance = (records, markedBy, date) => {
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
            timingsData={timings}
            messMenuData={messMenu}
            activitiesData={activities}
            onAllocateBed={handleAllocateBed}
            onRegisterActivity={handleRegisterActivity}
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
            timingsData={timings}
            messMenuData={messMenu}
            activitiesData={activities}
            onApplyLeave={handleApplyLeave}
            onSubmitComplaint={handleSubmitComplaint}
            onRequestVisitor={handleRequestVisitor}
            onPayFee={handlePayFee}
            onAllocateBed={handleAllocateBed}
            onRegisterActivity={handleRegisterActivity}
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
