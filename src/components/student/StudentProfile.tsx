import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile as StudentType } from '../../types';
import { User, Phone, Mail, Shield, Home, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const StudentProfile: React.FC = () => {
  const { currentUser, updateStudentProfile } = useAuth();
  const student = currentUser as StudentType;

  const [phone, setPhone] = useState(student?.phone || '');
  const [emergencyName, setEmergencyName] = useState(student?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(student?.emergencyContactPhone || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!student) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={student.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{student.fullName}</h2>
            <p className="text-xs text-gray-500">{student.email}</p>
            <div className="mt-1 flex items-center space-x-2">
              <Badge status="STUDENT" />
              <span className="text-xs text-gray-600 font-medium">ID: {student.studentIdNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
          Personal & Academic Profile (Read-Only Academic Fields)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={student.fullName}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Student ID Number</label>
            <input
              type="text"
              value={student.studentIdNo}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Department</label>
            <input
              type="text"
              value={student.department}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Year of Study</label>
            <input
              type="text"
              value={`Year ${student.yearOfStudy}`}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Hostel Block</label>
            <input
              type="text"
              value={student.hostelBlock}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Room Number</label>
            <input
              type="text"
              value={`Room ${student.roomNumber}`}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 pt-4">
          Editable Student Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Emergency Contact Person</label>
            <input
              type="text"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Emergency Contact Phone</label>
            <input
              type="text"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {isSaved ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </span>
          ) : (
            <span className="text-[11px] text-gray-400">
              Note: Room changes and academic info can only be modified by Warden.
            </span>
          )}

          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
