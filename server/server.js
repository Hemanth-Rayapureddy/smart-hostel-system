const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { dataStore } = require('./models/dataStore');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'Smart Student Hostel Management Backend', time: new Date().toISOString() });
});

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = dataStore.users.find(u => u.email.toLowerCase() === email?.toLowerCase() || (role && u.role.toLowerCase() === role.toLowerCase()));
  
  if (user) {
    res.json({
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user
    });
  } else {
    const fallbackUser = dataStore.users.find(u => u.role.toLowerCase() === (role || 'student').toLowerCase()) || dataStore.users[0];
    res.json({
      token: `mock-jwt-token-${fallbackUser.id}-${Date.now()}`,
      user: fallbackUser
    });
  }
});

// User Management Routes
app.get('/api/users', (req, res) => {
  const { role } = req.query;
  if (role) {
    return res.json(dataStore.users.filter(u => u.role.toLowerCase() === role.toLowerCase()));
  }
  res.json(dataStore.users);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: `u-${Date.now()}`,
    ...req.body,
    attendancePercentage: 100,
    feeStatus: req.body.feeStatus || 'Paid'
  };
  dataStore.users.push(newUser);
  res.status(201).json(newUser);
});

// Ticket Booking Style Room Allocation API
app.get('/api/rooms', (req, res) => {
  res.json(dataStore.rooms);
});

app.post('/api/rooms/allocate-ticket', (req, res) => {
  const { roomId, bedId, studentId, studentName } = req.body;
  
  const room = dataStore.rooms.find(r => r.id === roomId || r.roomNo === roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const bed = room.beds.find(b => b.id === bedId);
  if (!bed) {
    return res.status(404).json({ error: 'Bed not found' });
  }

  if (bed.isOccupied) {
    return res.status(400).json({ error: 'Bed is already occupied!' });
  }

  bed.isOccupied = true;
  bed.studentId = studentId;
  bed.studentName = studentName;

  const student = dataStore.users.find(u => u.id === studentId);
  if (student) {
    student.roomNo = room.roomNo;
    student.bedNo = bed.name;
    student.block = room.block;
  }

  res.json({
    message: `Bed successfully allocated! ${studentName} assigned to ${room.roomNo} (${bed.name})`,
    room,
    student
  });
});

// Attendance Management API (Warden tool)
app.get('/api/attendance', (req, res) => {
  res.json(dataStore.attendance);
});

app.post('/api/attendance/mark', (req, res) => {
  const { attendanceRecords, markedBy, date } = req.body;
  
  if (!Array.isArray(attendanceRecords)) {
    return res.status(400).json({ error: 'attendanceRecords must be an array' });
  }

  const updatedEntries = [];
  attendanceRecords.forEach(rec => {
    const existingIndex = dataStore.attendance.findIndex(
      a => a.studentId === rec.studentId && a.date === (date || rec.date)
    );

    const recordObj = {
      id: existingIndex >= 0 ? dataStore.attendance[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      studentId: rec.studentId,
      studentName: rec.studentName,
      roomNo: rec.roomNo,
      date: date || rec.date || new Date().toISOString().split('T')[0],
      status: rec.status,
      markedBy: markedBy || 'Warden'
    };

    if (existingIndex >= 0) {
      dataStore.attendance[existingIndex] = recordObj;
    } else {
      dataStore.attendance.push(recordObj);
    }
    updatedEntries.push(recordObj);
  });

  res.json({ message: 'Attendance marked successfully', updatedCount: updatedEntries.length, attendance: updatedEntries });
});

// Leave Management API
app.get('/api/leaves', (req, res) => {
  res.json(dataStore.leaves);
});

app.post('/api/leaves/apply', (req, res) => {
  const newLeave = {
    id: `l-${Date.now()}`,
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0],
    approvedBy: null,
    ...req.body
  };
  dataStore.leaves.unshift(newLeave);
  res.status(201).json(newLeave);
});

app.patch('/api/leaves/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  const leave = dataStore.leaves.find(l => l.id === id);
  if (!leave) return res.status(404).json({ error: 'Leave request not found' });
  
  leave.status = status;
  leave.approvedBy = approvedBy || 'Warden';
  res.json(leave);
});

// Complaint Management API
app.get('/api/complaints', (req, res) => {
  res.json(dataStore.complaints);
});

app.post('/api/complaints/submit', (req, res) => {
  const newComplaint = {
    id: `c-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString().split('T')[0],
    resolution: null,
    ...req.body
  };
  dataStore.complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;
  const complaint = dataStore.complaints.find(c => c.id === id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  
  complaint.status = status;
  if (resolution) complaint.resolution = resolution;
  res.json(complaint);
});

// Visitor Management API
app.get('/api/visitors', (req, res) => {
  res.json(dataStore.visitors);
});

app.post('/api/visitors/request', (req, res) => {
  const newVisitor = {
    id: `v-${Date.now()}`,
    status: 'Pending',
    approvedBy: null,
    ...req.body
  };
  dataStore.visitors.unshift(newVisitor);
  res.status(201).json(newVisitor);
});

app.patch('/api/visitors/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  const visitor = dataStore.visitors.find(v => v.id === id);
  if (!visitor) return res.status(404).json({ error: 'Visitor record not found' });
  
  visitor.status = status;
  visitor.approvedBy = approvedBy || 'Warden';
  res.json(visitor);
});

// Fee Management API
app.get('/api/fees', (req, res) => {
  res.json(dataStore.fees);
});

app.post('/api/fees/pay', (req, res) => {
  const { feeId } = req.body;
  const fee = dataStore.fees.find(f => f.id === feeId);
  if (!fee) return res.status(404).json({ error: 'Fee record not found' });
  
  fee.status = 'Paid';
  fee.paidAmount = fee.totalAmount;
  fee.paymentDate = new Date().toISOString().split('T')[0];
  fee.transactionId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}-SUCCESS`;

  const student = dataStore.users.find(u => u.id === fee.studentId);
  if (student) student.feeStatus = 'Paid';

  res.json({ message: 'Payment simulated successfully!', fee });
});

// Notice Board API
app.get('/api/notices', (req, res) => {
  res.json(dataStore.notices);
});

app.post('/api/notices', (req, res) => {
  const newNotice = {
    id: `n-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    pinned: req.body.pinned || false,
    ...req.body
  };
  dataStore.notices.unshift(newNotice);
  res.status(201).json(newNotice);
});

// Rules & Policies API
app.get('/api/rules', (req, res) => {
  res.json(dataStore.rules);
});

app.post('/api/rules', (req, res) => {
  const newRule = { id: `r-${Date.now()}`, ...req.body };
  dataStore.rules.push(newRule);
  res.status(201).json(newRule);
});

// Analytics API
app.get('/api/analytics', (req, res) => {
  const students = dataStore.users.filter(u => u.role === 'Student');
  const wardens = dataStore.users.filter(u => u.role === 'Warden');
  const totalBeds = dataStore.rooms.reduce((sum, r) => sum + r.beds.length, 0);
  const occupiedBeds = dataStore.rooms.reduce((sum, r) => sum + r.beds.filter(b => b.isOccupied).length, 0);
  
  res.json({
    totalStudents: students.length,
    totalWardens: wardens.length,
    totalRooms: dataStore.rooms.length,
    totalBeds,
    occupiedBeds,
    availableBeds: totalBeds - occupiedBeds,
    occupancyRate: Math.round((occupiedBeds / totalBeds) * 100),
    pendingLeaves: dataStore.leaves.filter(l => l.status === 'Pending').length,
    pendingComplaints: dataStore.complaints.filter(c => c.status === 'Pending').length,
    pendingVisitors: dataStore.visitors.filter(v => v.status === 'Pending').length,
    feeStats: {
      totalCollected: dataStore.fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.totalAmount, 0),
      totalDue: dataStore.fees.filter(f => f.status === 'Due').reduce((sum, f) => sum + f.totalAmount, 0)
    }
  });
});

// Serve Static Frontend Assets in Production
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Smart Hostel Management Backend running on http://localhost:${PORT}`);
});
