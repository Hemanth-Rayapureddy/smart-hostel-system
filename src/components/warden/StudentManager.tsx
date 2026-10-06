import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Phone, Mail, Home } from 'lucide-react';
import { Badge } from '../common/Badge';

export const StudentManager: React.FC = () => {
  const { allStudents } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Student Directory</h2>
        <p className="text-xs text-gray-500">Official registry of all hostel residents, rooms and emergency contacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allStudents.map((st) => (
          <div key={st.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start space-x-4">
            <img
              src={st.avatarUrl}
              alt={st.fullName}
              className="w-14 h-14 rounded-2xl object-cover border border-gray-300 shadow-sm"
            />
            <div className="space-y-1 text-xs flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{st.fullName}</h3>
                <Badge status={`${st.hostelBlock} - R${st.roomNumber}`} />
              </div>

              <p className="text-gray-500 font-medium">
                {st.department} • Year {st.yearOfStudy} (ID: {st.studentIdNo})
              </p>

              <div className="pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-600 font-medium">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Phone: {st.phone}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-700">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Emergency: {st.emergencyContactName} ({st.emergencyContactPhone})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
