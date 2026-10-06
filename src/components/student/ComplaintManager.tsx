import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, Complaint, ComplaintCategory } from '../../types';
import { localStore } from '../../lib/supabase';
import { AlertCircle, Plus, Camera, EyeOff, Image, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ComplaintManager: React.FC = () => {
  const { currentUser, addNotification } = useAuth();
  const student = currentUser as StudentProfile;

  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    localStore.getComplaints().filter((c) => c.studentId === student.id)
  );

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('maintenance');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  if (!student) return null;

  const categories: ComplaintCategory[] = [
    'water',
    'electricity',
    'plumbing',
    'cleanliness',
    'food',
    'maintenance',
    'internet',
    'security',
    'other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const ticketNumber = 'CMP-2026-' + Math.floor(100 + Math.random() * 900);

    const newComplaint: Complaint = {
      id: 'c_' + Date.now(),
      ticketNumber,
      studentId: student.id,
      studentName: isAnonymous ? 'Anonymous Student' : student.fullName,
      category,
      title,
      description,
      block: student.hostelBlock,
      roomNumber: student.roomNumber,
      isAnonymous,
      photoUrl: photoUrl.trim() || undefined,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allComplaints = localStore.getComplaints();
    const updated = [newComplaint, ...allComplaints];
    localStore.setComplaints(updated);
    setComplaints([newComplaint, ...complaints]);

    // Notify warden
    addNotification(
      'warden',
      'New Hostel Complaint Filed',
      `New Ticket ${ticketNumber} (${category}) for ${student.hostelBlock} - ${student.roomNumber}. ${
        isAnonymous ? '[ANONYMOUS]' : ''
      }`,
      'complaint'
    );

    setShowModal(false);
    setTitle('');
    setDescription('');
    setPhotoUrl('');
    setIsAnonymous(false);
  };

  const handleReopen = (complaintId: string) => {
    const allComplaints = localStore.getComplaints();
    const updated = allComplaints.map((c) =>
      c.id === complaintId
        ? { ...c, status: 'reopened' as const, updatedAt: new Date().toISOString() }
        : c
    );
    localStore.setComplaints(updated);
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: 'reopened' as const } : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Complaints & Maintenance</h2>
          <p className="text-xs text-gray-500">Report issues with photo proof or submit anonymously</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint Ticket</span>
        </button>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {complaints.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-semibold text-gray-600">No complaints registered</p>
            <p className="text-[11px] text-gray-400">All your room and hostel equipment are functioning properly.</p>
          </div>
        ) : (
          complaints.map((cmp) => (
            <div key={cmp.id} className="p-5 hover:bg-gray-50/60 transition-colors space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {cmp.ticketNumber}
                    </span>
                    <Badge status={cmp.category} />
                    {cmp.isAnonymous && (
                      <span className="flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        <EyeOff className="w-3 h-3" />
                        <span>Anonymous</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">{cmp.title}</h4>
                </div>
                <Badge status={cmp.status} />
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                {cmp.description}
              </p>

              {cmp.photoUrl && (
                <div className="flex items-center space-x-2">
                  <img
                    src={cmp.photoUrl}
                    alt="Complaint photo"
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                  />
                  <span className="text-[11px] text-gray-500 font-medium">📷 Photo Proof Attached</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                <span>Filed: {new Date(cmp.createdAt).toLocaleString()}</span>
                {cmp.assignedTo && (
                  <span className="text-blue-700 font-semibold">Assigned To: {cmp.assignedTo}</span>
                )}
                {cmp.status === 'resolved' && (
                  <button
                    onClick={() => handleReopen(cmp.id)}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Registering Complaint */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>File Complaint Ticket</span>
              <span className="text-xs font-normal text-gray-500">Room {student.roomNumber}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 capitalize focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Water leakage under bathroom sink"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the problem clearly..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Optional Photo URL (Image attachment)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or image link"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="anonymousCheck" className="text-xs font-semibold text-purple-900 cursor-pointer">
                  🔒 Submit Anonymously (Hide my identity from Warden UI)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs shadow-md"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
