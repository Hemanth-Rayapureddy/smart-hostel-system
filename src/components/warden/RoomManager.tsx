import React, { useState } from 'react';
import { Room } from '../../types';
import { localStore } from '../../lib/supabase';
import { Home, Plus, Users, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() => localStore.getRooms());
  const [showModal, setShowModal] = useState(false);

  const [block, setBlock] = useState('Block A');
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState(1);
  const [capacity, setCapacity] = useState(2);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return;

    const newRoom: Room = {
      id: 'r_' + Date.now(),
      block,
      roomNumber,
      floor,
      capacity,
      occupiedCount: 0,
      status: 'available',
    };

    const updated = [newRoom, ...rooms];
    localStore.setRooms(updated);
    setRooms(updated);

    setShowModal(false);
    setRoomNumber('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Rooms & Capacity</h2>
          <p className="text-xs text-gray-500">Manage room inventory, block allocations and maintenance status</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((r) => (
          <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">{r.block}</span>
                <h3 className="text-lg font-extrabold text-gray-900">Room {r.roomNumber}</h3>
              </div>
              <Badge status={r.status} />
            </div>

            <div className="space-y-1 text-xs text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Floor Level:</span>
                <span>Floor {r.floor}</span>
              </div>
              <div className="flex justify-between">
                <span>Beds Occupancy:</span>
                <span className="font-bold text-gray-900">
                  {r.occupiedCount} / {r.capacity} Beds
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Add Hostel Room</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Hostel Block</label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 205"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs shadow-md"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
