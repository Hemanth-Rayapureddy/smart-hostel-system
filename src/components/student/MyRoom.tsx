import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types';
import { Home, Users, Shield, RotateCcw, CheckCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface MyRoomProps {
  setActiveTab: (tab: string) => void;
}

export const MyRoom: React.FC<MyRoomProps> = ({ setActiveTab }) => {
  const { currentUser, allStudents } = useAuth();
  const student = currentUser as StudentProfile;

  if (!student) return null;

  // Find roommates in same block and room (excluding self)
  const roommates = allStudents.filter(
    (s) => s.hostelBlock === student.hostelBlock && s.roomNumber === student.roomNumber && s.id !== student.id
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Room Allocation</h2>
          <p className="text-xs text-gray-500">Official hostel accommodation details</p>
        </div>
        <button
          onClick={() => setActiveTab('room_change')}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <span>Request Room Change</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room Overview Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Hostel Block</span>
            <Badge status="ALLOCATED" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold">{student.hostelBlock}</h3>
            <p className="text-xl text-blue-200 mt-1">Room Number {student.roomNumber}</p>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs space-y-2 text-blue-100">
            <div className="flex justify-between">
              <span>Floor Level:</span>
              <span className="font-semibold text-white">Floor {student.roomNumber.charAt(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Room Capacity:</span>
              <span className="font-semibold text-white">2 Beds (Double Sharing)</span>
            </div>
            <div className="flex justify-between">
              <span>Current Status:</span>
              <span className="font-semibold text-emerald-300">Occupied (Good Standing)</span>
            </div>
          </div>
        </div>

        {/* Roommates Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">Roommate Information</h3>
          </div>

          {roommates.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
              No roommate allocated yet. You currently have single occupancy for Room {student.roomNumber}.
            </div>
          ) : (
            <div className="space-y-3">
              {roommates.map((rm) => (
                <div
                  key={rm.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={rm.avatarUrl}
                      alt={rm.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{rm.fullName}</h4>
                      <p className="text-[11px] text-gray-500">
                        {rm.department} • Year {rm.yearOfStudy}
                      </p>
                    </div>
                  </div>
                  <Badge status="Roommate" />
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
            💡 <strong>Privacy Note:</strong> Personal contact numbers and emergency details of roommates are kept private in compliance with hostel privacy guidelines.
          </div>
        </div>
      </div>
    </div>
  );
};
