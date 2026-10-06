import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, EmergencyType, EmergencyAlert } from '../../types';
import { localStore } from '../../lib/supabase';
import { AlertTriangle, ShieldAlert, HeartPulse, Flame, Lock, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addNotification } = useAuth();
  const student = currentUser as StudentProfile;

  const [type, setType] = useState<EmergencyType>('medical');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen || !student) return null;

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newAlert: EmergencyAlert = {
      id: 'e_' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      type,
      block: student.hostelBlock,
      roomNumber: student.roomNumber,
      status: 'active',
      notes,
      createdAt: new Date().toISOString(),
    };

    const all = localStore.getEmergencies();
    localStore.setEmergencies([newAlert, ...all]);

    // Dispatch broadcast alert to warden & emergency users
    addNotification(
      'warden',
      `🚨 EMERGENCY ALERT: ${type.toUpperCase()}`,
      `IMMEDIATE ASSISTANCE REQUIRED in ${student.hostelBlock} Room ${student.roomNumber}! Student: ${student.fullName} (${student.phone}). Notes: ${notes || 'None'}`,
      'emergency'
    );

    setIsSubmitting(false);
    setIsConfirmed(true);
    setTimeout(() => {
      setIsConfirmed(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-rose-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-rose-400 animate-in fade-in zoom-in duration-200">
        <div className="bg-rose-600 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <h3 className="font-extrabold text-base tracking-wide">HOSTEL EMERGENCY SOS</h3>
          </div>
          <button onClick={onClose} className="p-1 text-rose-200 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isConfirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-ping">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-rose-900">EMERGENCY BROADCAST SENT!</h4>
            <p className="text-xs text-rose-700">
              Hostel Warden and Security desk have been alerted for <strong>{student.hostelBlock} - Room {student.roomNumber}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendSOS} className="p-6 space-y-5 text-xs">
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-900 leading-snug">
              <strong>Emergency Location:</strong> {student.hostelBlock} - Room {student.roomNumber} ({student.fullName})
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-2">Select Emergency Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
                  { id: 'fire', label: 'Fire Hazard', icon: Flame, color: 'text-amber-600 bg-amber-50' },
                  { id: 'security', label: 'Security Threat', icon: Lock, color: 'text-purple-600 bg-purple-50' },
                  { id: 'other', label: 'Other Emergency', icon: ShieldAlert, color: 'text-blue-600 bg-blue-50' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = type === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id as EmergencyType)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-100 font-bold shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-1 ${item.color}`} />
                      <span className="text-[11px] text-gray-900">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Brief Details / Floor Landmark</label>
              <input
                type="text"
                placeholder="e.g. Asthma attack, room 204"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-lg shadow-rose-200 uppercase tracking-wider"
              >
                Confirm & Dispatch SOS
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
