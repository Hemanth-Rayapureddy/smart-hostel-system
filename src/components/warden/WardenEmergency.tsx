import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmergencyAlert, EmergencyStatus } from '../../types';
import { localStore } from '../../lib/supabase';
import { ShieldAlert, AlertTriangle, CheckCircle2, Megaphone, Send } from 'lucide-react';
import { Badge } from '../common/Badge';

export const WardenEmergency: React.FC = () => {
  const { addNotification } = useAuth();
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>(() => localStore.getEmergencies());

  const [broadcastTarget, setBroadcastTarget] = useState<string>('all');
  const [broadcastMsg, setBroadcastMsg] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleResolveAlert = (alertId: string) => {
    const all = localStore.getEmergencies();
    const updated = all.map((e) =>
      e.id === alertId
        ? { ...e, status: 'resolved' as EmergencyStatus, resolvedAt: new Date().toISOString() }
        : e
    );
    localStore.setEmergencies(updated);
    setEmergencies(updated);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;

    addNotification(
      'all',
      `🚨 EMERGENCY ANNOUNCEMENT (${broadcastTarget.toUpperCase()})`,
      broadcastMsg,
      'emergency'
    );

    setBroadcastMsg('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-rose-600 text-white p-6 rounded-2xl shadow-lg border-2 border-rose-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white text-rose-600 rounded-xl">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Warden Emergency Control Room</h2>
            <p className="text-xs text-rose-100 font-medium">
              Monitor live distress SOS signals & issue instant emergency broadcasts
            </p>
          </div>
        </div>
      </div>

      {/* Active Emergencies List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-rose-50 border-b border-rose-100 font-extrabold text-xs text-rose-900 flex justify-between">
          <span>Active & Historical Emergency SOS Alerts</span>
          <span>{emergencies.filter((e) => e.status === 'active').length} Active</span>
        </div>

        {emergencies.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-500">No active emergency alerts recorded.</p>
        ) : (
          emergencies.map((em) => (
            <div
              key={em.id}
              className={`p-5 space-y-2 transition-colors ${
                em.status === 'active' ? 'bg-rose-50/70 border-l-4 border-rose-600' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-gray-900">{em.studentName}</span>
                    <span className="font-bold text-xs bg-rose-600 text-white px-2.5 py-0.5 rounded-full">
                      {em.block} - Room {em.roomNumber}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-rose-800 mt-1 uppercase">
                    Type: {em.type} Emergency • Triggered at {new Date(em.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge status={em.status} />
              </div>

              {em.notes && (
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 text-xs text-gray-800 font-medium">
                  <strong>Notes:</strong> {em.notes}
                </div>
              )}

              {em.status === 'active' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleResolveAlert(em.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acknowledge & Resolve SOS</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Emergency Broadcast Form */}
      <form onSubmit={handleSendBroadcast} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
          <Megaphone className="w-5 h-5 text-rose-600" />
          <h3 className="font-bold text-sm text-gray-900">Send Hostel Emergency Broadcast</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Target Audience</label>
            <select
              value={broadcastTarget}
              onChange={(e) => setBroadcastTarget(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
            >
              <option value="all">📢 ALL Hostel Blocks</option>
              <option value="Block A">🏢 Block A Only</option>
              <option value="Block B">🏢 Block B Only</option>
              <option value="Block C">🏢 Block C Only</option>
              <option value="Block D">🏢 Block D Only</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Emergency Message Text</label>
            <input
              type="text"
              required
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="e.g. Fire drill scheduled in Block B at 4 PM / Severe storm warning - stay indoors..."
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {broadcastSent ? (
            <span className="font-bold text-emerald-600">🚨 Emergency Broadcast Dispatched to All Students!</span>
          ) : (
            <span className="text-[11px] text-gray-400">Broadcast triggers an instant high-priority banner notification.</span>
          )}

          <button
            type="submit"
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Broadcast</span>
          </button>
        </div>
      </form>
    </div>
  );
};
