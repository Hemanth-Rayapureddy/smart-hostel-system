// Initial Seed Data and Stateful In-Memory Store with MongoDB Mongoose Schema Ready Definitions

const initialData = {
  users: [
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
      id: "u-warden-2",
      name: "Sarah Jenkins",
      email: "sarah.warden@hostel.edu",
      role: "Warden",
      phone: "+1 (555) 014-4411",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
      assignedBlock: "Block B - Emerald Hall",
      shift: "Night Shift"
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
    },
    {
      id: "u-student-4",
      name: "Emily Zhang",
      email: "emily.z@student.edu",
      role: "Student",
      rollNo: "AI-2024-012",
      course: "B.Tech AI & ML (1st Year)",
      phone: "+1 (555) 015-8899",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
      roomNo: "Unassigned",
      bedNo: "-",
      block: "Unassigned",
      guardianName: "Wei Zhang",
      guardianPhone: "+1 (555) 015-3344",
      feeStatus: "Pending",
      attendancePercentage: 91
    }
  ],

  // Rooms dataset formatted for Ticket Booking Style (Floors, Rooms, Beds A/B/C)
  rooms: [
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
    },
    {
      id: "rm-301",
      roomNo: "B-102",
      floor: 1,
      block: "Block B - Emerald Hall",
      type: "2-Sharing Non-AC",
      pricePerSemester: "$900",
      amenities: ["Ceiling Fan", "Attached Bath", "Study Table", "WiFi"],
      beds: [
        { id: "B-102-BedA", name: "Bed A", isOccupied: true, studentId: "u-student-3", studentName: "Liam O'Connor" },
        { id: "B-102-BedB", name: "Bed B", isOccupied: false, studentId: null, studentName: null }
      ]
    },
    {
      id: "rm-302",
      roomNo: "B-201",
      floor: 2,
      block: "Block B - Emerald Hall",
      type: "3-Sharing Standard",
      pricePerSemester: "$850",
      amenities: ["Ceiling Fan", "Shared Bath", "Individual Desks", "WiFi"],
      beds: [
        { id: "B-201-BedA", name: "Bed A", isOccupied: false, studentId: null, studentName: null },
        { id: "B-201-BedB", name: "Bed B", isOccupied: false, studentId: null, studentName: null },
        { id: "B-201-BedC", name: "Bed C", isOccupied: false, studentId: null, studentName: null }
      ]
    }
  ],

  attendance: [
    { id: "att-1", studentId: "u-student-1", studentName: "Alex Johnson", roomNo: "A-204", date: "2026-07-24", status: "Present", markedBy: "Prof. Marcus Brody" },
    { id: "att-2", studentId: "u-student-2", studentName: "Sophia Martinez", roomNo: "A-204", date: "2026-07-24", status: "Present", markedBy: "Prof. Marcus Brody" },
    { id: "att-3", studentId: "u-student-3", studentName: "Liam O'Connor", roomNo: "B-102", date: "2026-07-24", status: "On Leave", markedBy: "Sarah Jenkins" },
    { id: "att-4", studentId: "u-student-4", studentName: "Emily Zhang", roomNo: "Unassigned", date: "2026-07-24", status: "Absent", markedBy: "Prof. Marcus Brody" }
  ],

  leaves: [
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
    },
    {
      id: "l-103",
      studentId: "u-student-2",
      studentName: "Sophia Martinez",
      roomNo: "A-204",
      reason: "Medical appointment & dental procedure",
      startDate: "2026-08-01",
      endDate: "2026-08-02",
      destination: "City Medical Center",
      status: "Pending",
      appliedOn: "2026-07-24",
      approvedBy: null
    }
  ],

  complaints: [
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
      resolution: "Technician assigned for maintenance on 25th July."
    },
    {
      id: "c-302",
      studentId: "u-student-3",
      studentName: "Liam O'Connor",
      roomNo: "B-102",
      category: "Plumbing",
      title: "Hot water valve leaking",
      description: "Bathroom hot water line has minor dripping leak in B-102.",
      priority: "High",
      status: "Pending",
      createdAt: "2026-07-24",
      resolution: null
    },
    {
      id: "c-303",
      studentId: "u-student-2",
      studentName: "Sophia Martinez",
      roomNo: "A-204",
      category: "Internet & IT",
      title: "WiFi speed drop on Floor 2",
      description: "Ping spikes during evening study hours (8 PM - 10 PM).",
      priority: "Low",
      status: "Resolved",
      createdAt: "2026-07-18",
      resolution: "Access point router restarted and firmware upgraded."
    }
  ],

  visitors: [
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
    },
    {
      id: "v-502",
      studentId: "u-student-2",
      studentName: "Sophia Martinez",
      visitorName: "Elena Martinez",
      relation: "Sister",
      contact: "+1 (555) 017-9911",
      purpose: "Weekend visit",
      visitDate: "2026-07-26",
      timeSlot: "10:00 AM - 01:00 PM",
      status: "Pending",
      approvedBy: null
    }
  ],

  fees: [
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
  ],

  notices: [
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
      content: "Registration for inter-hostel football, chess, and robotics tournaments is now open until July 30th. Sign up at warden desk.",
      author: "Prof. Marcus Brody (Warden)",
      date: "2026-07-21",
      pinned: false
    },
    {
      id: "n-3",
      title: "High-Speed Fiber Router Maintenance Schedule",
      category: "Circular",
      content: "Network maintenance will take place on Saturday midnight (1:00 AM - 3:00 AM). Brief internet service interruptions may occur.",
      author: "Hostel IT Cell",
      date: "2026-07-19",
      pinned: false
    }
  ],

  rules: [
    { id: "r-1", title: "Quiet Hours Policy", detail: "Strict silence in study blocks from 10:30 PM to 6:00 AM." },
    { id: "r-2", title: "Visitor Guidelines", detail: "External guests allowed only in common lounge between 9:00 AM and 6:00 PM with Warden approval log." },
    { id: "r-3", title: "Electrical Appliance Code", detail: "High wattage induction stoves & heaters strictly prohibited inside student rooms for safety." },
    { id: "r-4", title: "Mess & Dining Discipline", detail: "Food must be consumed in the dining hall; non-transferable biometric or RFID digital coupon scan required." }
  ]
};

// Mutable memory copy for instant full-stack REST API execution
let dataStore = JSON.parse(JSON.stringify(initialData));

module.exports = {
  dataStore,
  resetDataStore: () => {
    dataStore = JSON.parse(JSON.stringify(initialData));
  }
};
