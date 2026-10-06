import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Notice, NoticePriority } from '../../types';
import { localStore } from '../../lib/supabase';
import { Bell, Plus, Calendar, Send } from 'lucide-react';
import { Badge } from '../common/Badge';

export const NoticeCreator: React.FC = () => {
  const { addNotification } = useAuth();
  const [notices, setNotices] = useState<Notice[]>(() => localStore.getNotices());

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<NoticePriority>('normal');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !expiryDate) return;

    const newNotice: Notice = {
      id: 'n_' + Date.now(),
      title,
      description,
      priority,
      expiryDate,
      createdBy: 'Warden Dr. K. V. Raman',
      createdAt: new Date().toISOString(),
    };

    const all = localStore.getNotices();
    localStore.setNotices([newNotice, ...all]);
    setNotices([newNotice, ...notices]);

    addNotification('all', `Notice Posted: ${title}`, description, 'notice');

    setTitle('');
    setDescription('');
    setExpiryDate('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Digital Notice Board Creator</h2>
          <p className="text-xs text-gray-500">Broadcast official circulars and priority notices to all students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Notice Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Mandatory Room Cleanliness Inspection Notice"
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Notice Circular Body</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter full notice text..."
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as NoticePriority)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
            >
              <option value="normal">Normal Priority</option>
              <option value="important">Important Priority</option>
              <option value="emergency">Emergency Alert Priority</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Publish Circular Notice</span>
          </button>
        </div>
      </form>

      {/* Published Notices List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50 font-bold text-xs text-gray-700">Published Active Notices</div>
        {notices.map((n) => (
          <div key={n.id} className="p-4 space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-900">{n.title}</h4>
              <Badge status={n.priority} />
            </div>
            <p className="text-gray-600">{n.description}</p>
            <div className="text-[10px] text-gray-400 font-medium">Expires: {n.expiryDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
