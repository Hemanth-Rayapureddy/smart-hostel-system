import React from 'react';
import { localStore } from '../../lib/supabase';
import { Bell, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '../common/Badge';

export const NoticesView: React.FC = () => {
  const notices = localStore
    .getNotices()
    .filter((n) => new Date(n.expiryDate) >= new Date())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Digital Notice Board</h2>
          <p className="text-xs text-gray-500">Official circulars and emergency announcements from Warden office</p>
        </div>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-500 bg-white rounded-2xl border border-gray-200">
            No active notices right now.
          </p>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
                n.priority === 'emergency'
                  ? 'bg-rose-50/60 border-rose-300'
                  : n.priority === 'important'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-gray-900">{n.title}</h3>
                </div>
                <Badge status={n.priority} />
              </div>

              <p className="text-xs text-gray-700 leading-relaxed font-medium">{n.description}</p>

              <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
                <span>Posted by {n.createdBy} on {new Date(n.createdAt).toLocaleDateString()}</span>
                <span>Expiry Date: {n.expiryDate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
