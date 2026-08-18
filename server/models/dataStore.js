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
    }
  ],

  // Hostel Operational Schedule & Timings
  timings: [
    { id: "t-1", category: "Hostel Entry Curfew", time: "10:00 PM Daily", detail: "Main gate locks strictly. Late arrival requires pre-approved Warden pass.", status: "Strict" },
    { id: "t-2", category: "Breakfast Service", time: "07:30 AM - 09:30 AM", detail: "Dining Hall 1 & 2. Hot fresh breakfast & tea/coffee counter.", status: "Mess Schedule" },
    { id: "t-3", category: "Lunch Service", time: "12:30 PM - 02:30 PM", detail: "Full meal menu with salad bar and dessert.", status: "Mess Schedule" },
    { id: "t-4", category: "Evening Tea & Snacks", time: "05:00 PM - 06:30 PM", detail: "Crispy snacks, sandwiches, hot tea & coffee.", status: "Mess Schedule" },
    { id: "t-5", category: "Dinner Service", time: "07:30 PM - 09:30 PM", detail: "Dinner buffet with roti, rice, paneer/chicken curries.", status: "Mess Schedule" },
    { id: "t-6", category: "Quiet Study Hours", time: "10:30 PM - 06:00 AM", detail: "Library & floor corridor silence policy for peaceful study.", status: "Daily Policy" },
    { id: "t-7", category: "Visitor Lounge Hours", time: "09:00 AM - 06:00 PM", detail: "Parents & registered guests permitted in ground floor lounge.", status: "Security" },
    { id: "t-8", category: "Gym & Sports Complex", time: "06:00 AM - 09:00 PM", detail: "Fitness equipment, badminton courts & indoor games.", status: "Recreation" }
  ],

  // Weekly Mess Menu Dataset
  messMenu: [
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
  ],

  // Hostel Activities & Events
  activities: [
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
    },
    {
      id: "act-4",
      title: "Table Tennis & Badminton Tournament",
      category: "Sports & Gaming",
      date: "2026-09-12",
      time: "07:00 AM - 01:00 PM",
      venue: "Hostel Indoor Sports Complex",
      organizer: "Prof. Marcus Brody (Warden)",
      description: "Singles and doubles knockout tournament for all resident blocks.",
      maxSlots: 40,
      registeredCount: 29,
      image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&q=80&w=400"
    }
  ],

  // Rooms dataset formatted for Ticket Booking Style
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
    }
  ],

  attendance: [
    { id: "att-1", studentId: "u-student-1", studentName: "Alex Johnson", roomNo: "A-204", date: "2026-08-18", status: "Present", markedBy: "Prof. Marcus Brody" },
    { id: "att-2", studentId: "u-student-2", studentName: "Sophia Martinez", roomNo: "A-204", date: "2026-08-18", status: "Present", markedBy: "Prof. Marcus Brody" },
    { id: "att-3", studentId: "u-student-3", studentName: "Liam O'Connor", roomNo: "B-102", date: "2026-08-18", status: "On Leave", markedBy: "Sarah Jenkins" }
  ],

  leaves: [
    {
      id: "l-101",
      studentId: "u-student-1",
      studentName: "Alex Johnson",
      roomNo: "A-204",
      reason: "Attending National AI hackathon at Tech Summit City",
      startDate: "2026-08-28",
      endDate: "2026-08-31",
      destination: "San Francisco, CA",
      status: "Approved",
      appliedOn: "2026-08-15",
      approvedBy: "Prof. Marcus Brody"
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
      createdAt: "2026-08-17",
      resolution: "Technician assigned for maintenance on 19th August."
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
      visitDate: "2026-08-20",
      timeSlot: "02:00 PM - 05:00 PM",
      status: "Approved",
      approvedBy: "Prof. Marcus Brody"
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
      paymentDate: "2026-08-01",
      transactionId: "TXN-8829104-X"
    }
  ],

  notices: [
    {
      id: "n-1",
      title: "Hostel Entry Curfew & Gate Timing Reminder",
      category: "Announcement",
      content: "All hostel residents are advised that main entrance gates close strictly at 10:00 PM daily. Late entry requires warden clearance.",
      author: "Dr. Robert Vance (Admin)",
      date: "2026-08-15",
      pinned: true
    },
    {
      id: "n-2",
      title: "Sunday Special Menu & Feast Voting",
      category: "Events",
      content: "Vote for your preferred Sunday dinner special menu item on the Mess Module by Friday evening.",
      author: "Hostel Mess Committee",
      date: "2026-08-16",
      pinned: false
    }
  ],

  rules: [
    { id: "r-1", title: "Quiet Hours Policy", detail: "Strict silence in study blocks from 10:30 PM to 6:00 AM." },
    { id: "r-2", title: "Visitor Guidelines", detail: "External guests allowed only in common lounge between 9:00 AM and 6:00 PM with Warden approval log." },
    { id: "r-3", title: "Electrical Appliance Code", detail: "High wattage induction stoves & heaters strictly prohibited inside student rooms for safety." }
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
