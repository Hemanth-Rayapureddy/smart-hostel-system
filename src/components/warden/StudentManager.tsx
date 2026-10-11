import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types';
import { localStore } from '../../lib/supabase';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Home,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const StudentManager: React.FC = () => {
  const { allStudents, addStudentByWarden, updateStudentByWarden, deleteStudentByWarden } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);

  // Add Student Form State
  const [newName, setNewName] = useState('');
  const [newIdNo, setNewIdNo] = useState('');
  const [newDept, setNewDept] = useState('Computer Science & Eng');
  const [newYear, setNewYear] = useState(1);
  const [newBlock, setNewBlock] = useState('Block A');
  const [newRoom, setNewRoom] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmergencyName, setNewEmergencyName] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');

  // Edit Form State
  const [editRoom, setEditRoom] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmergencyName, setEditEmergencyName] = useState('');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState('');

  // Filter students
  const filteredStudents = allStudents.filter((st) => {
    if (selectedBlock !== 'all' && st.hostelBlock !== selectedBlock) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = st.fullName.toLowerCase().includes(q);
      const matchId = st.studentIdNo.toLowerCase().includes(q);
      const matchRoom = st.roomNumber.toLowerCase().includes(q);
      const matchDept = st.department.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchRoom && !matchDept) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newIdNo.trim() || !newRoom.trim() || !newEmail.trim()) return;

    addStudentByWarden({
      fullName: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: 'student',
      phone: newPhone.trim(),
      studentIdNo: newIdNo.trim(),
      department: newDept.trim(),
      yearOfStudy: Number(newYear),
      hostelBlock: newBlock,
      roomNumber: newRoom.trim(),
      emergencyContactName: newEmergencyName.trim() || 'Parent/Guardian',
      emergencyContactPhone: newEmergencyPhone.trim() || '+91 90000 00000',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });

    setShowAddModal(false);
    setNewName('');
    setNewIdNo('');
    setNewRoom('');
    setNewPhone('');
    setNewEmail('');
    setNewEmergencyName('');
    setNewEmergencyPhone('');
  };

  const handleOpenEdit = (st: StudentProfile) => {
    setEditingStudent(st);
    setEditBlock(st.hostelBlock);
    setEditRoom(st.roomNumber);
    setEditPhone(st.phone);
    setEditEmergencyName(st.emergencyContactName);
    setEditEmergencyPhone(st.emergencyContactPhone);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudentByWarden(editingStudent.id, {
      hostelBlock: editBlock,
      roomNumber: editRoom,
      phone: editPhone,
      emergencyContactName: editEmergencyName,
      emergencyContactPhone: editEmergencyPhone,
    });

    setEditingStudent(null);
  };

  // Get student history data for viewing student
  const getStudentHistory = (stId: string) => {
    const attendance = localStore.getAttendance().filter((a) => a.studentId === stId);
    const leaves = localStore.getLeaves().filter((l) => l.studentId === stId);
    const complaints = localStore.getComplaints().filter((c) => c.studentId === stId);
    const fees = localStore.getFees().find((f) => f.studentId === stId);

    const totalAtt = attendance.length;
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

    return { attendance, leaves, complaints, fees, attPct };
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Directory & Records</h2>
          <p className="text-xs text-gray-500">Official registry of all hostel residents, rooms and emergency contacts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, student roll ID, room, or dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Hostel Blocks</option>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
          <option value="Block D">Block D</option>
        </select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="md:col-span-2 bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-2">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-600">No students found matching your criteria</p>
            <p className="text-[11px] text-gray-400">Try adjusting your search terms or filter.</p>
          </div>
        ) : (
          filteredStudents.map((st) => (
            <div key={st.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start space-x-4 hover:border-blue-200 transition-all">
              <img
                src={st.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={st.fullName}
                className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-sm flex-shrink-0"
              />
              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{st.fullName}</h3>
                    <p className="text-gray-500 font-medium text-[11px]">
                      {st.department} • Year {st.yearOfStudy} (ID: {st.studentIdNo})
                    </p>
                  </div>
                  <Badge status={`${st.hostelBlock} - R${st.roomNumber}`} />
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-600 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{st.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Resident: {st.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-rose-700">
                    <Phone className="w-3.5 h-3.5 text-rose-500" />
                    <span>Emergency: {st.emergencyContactName} ({st.emergencyContactPhone})</span>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setViewingStudent(st)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 text-[11px] font-semibold"
                    title="View History"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>History</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(st)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-1 text-[11px] font-semibold"
                    title="Edit & Reallocate Room"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove student ${st.fullName}?`)) {
                        deleteStudentByWarden(st.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Student"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================================
          ADD STUDENT MODAL
      ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Register New Hostel Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Gupta"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student Roll / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS2025-089"
                    value={newIdNo}
                    onChange={(e) => setNewIdNo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Year of Study *</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Department *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Information Technology"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hostel Block *</label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 104"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Resident Phone *</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@hostel.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="Parent / Guardian"
                    value={newEmergencyName}
                    onChange={(e) => setNewEmergencyName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={newEmergencyPhone}
                    onChange={(e) => setNewEmergencyPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          EDIT STUDENT & ALLOCATE ROOM MODAL
      ============================================================ */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">Edit Student & Room Allocation</h3>
                <p className="text-[11px] text-gray-500">{editingStudent.fullName} ({editingStudent.studentIdNo})</p>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hostel Block</label>
                  <select
                    value={editBlock}
                    onChange={(e) => setEditBlock(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={editEmergencyName}
                    onChange={(e) => setEditEmergencyName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW STUDENT HISTORY & DETAIL MODAL
      ============================================================ */}
      {viewingStudent && (() => {
        const history = getStudentHistory(viewingStudent.id);
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={viewingStudent.avatarUrl}
                    alt={viewingStudent.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{viewingStudent.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      {viewingStudent.department} • Year {viewingStudent.yearOfStudy} (ID: {viewingStudent.studentIdNo})
                    </p>
                  </div>
                </div>
                <button onClick={() => setViewingStudent(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Metric Cards */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <span className="text-blue-600 font-semibold block text-[10px] uppercase">Attendance</span>
                  <span className="text-xl font-black text-blue-900">{history.attPct}%</span>
                  <span className="text-[10px] text-blue-700 block mt-0.5">Overall Standing</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-amber-700 font-semibold block text-[10px] uppercase">Leave History</span>
                  <span className="text-xl font-black text-amber-900">{history.leaves.length}</span>
                  <span className="text-[10px] text-amber-700 block mt-0.5">Total Out-Passes</span>
                </div>

                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <span className="text-purple-700 font-semibold block text-[10px] uppercase">Complaints</span>
                  <span className="text-xl font-black text-purple-900">{history.complaints.length}</span>
                  <span className="text-[10px] text-purple-700 block mt-0.5">Tickets Filed</span>
                </div>
              </div>

              {/* Room & Allocation */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-1">
                <div className="font-bold text-gray-900 flex justify-between">
                  <span>Assigned Accommodation:</span>
                  <span className="text-blue-600 font-bold">{viewingStudent.hostelBlock} - Room {viewingStudent.roomNumber}</span>
                </div>
                <div className="text-gray-600 flex justify-between pt-1">
                  <span>Fee Standing:</span>
                  <span className="font-semibold text-emerald-700">
                    {history.fees ? `₹${history.fees.paidAmount} / ₹${history.fees.totalAmount} (${history.fees.status.toUpperCase()})` : 'Fees Cleared'}
                  </span>
                </div>
              </div>

              {/* Recent Leaves */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-gray-800">Recent Leave Requests</h4>
                {history.leaves.length === 0 ? (
                  <p className="text-[11px] text-gray-400">No leave records submitted yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {history.leaves.map((l) => (
                      <div key={l.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-gray-900">{l.startDate} to {l.endDate}</span>
                          <p className="text-[11px] text-gray-500">{l.reason}</p>
                        </div>
                        <Badge status={l.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
