import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Room, RoomChangeRequest } from '../../types';
import { localStore } from '../../lib/supabase';
import {
  Home,
  Plus,
  Users,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Wrench,
  X,
  UserPlus,
  RotateCcw,
  Check,
  XCircle,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const RoomManager: React.FC = () => {
  const { allStudents, updateStudentByWarden, addNotification } = useAuth();
  const [rooms, setRooms] = useState<Room[]>(() => localStore.getRooms());
  const [roomChangeRequests, setRoomChangeRequests] = useState<RoomChangeRequest[]>(() =>
    localStore.getRoomChangeRequests()
  );

  const [activeTab, setActiveTab] = useState<'inventory' | 'transfers'>('inventory');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [allocatingRoom, setAllocatingRoom] = useState<Room | null>(null);
  const [selectedStudentToAllocate, setSelectedStudentToAllocate] = useState('');

  // Transfer Action State
  const [reassignTargetRooms, setReassignTargetRooms] = useState<Record<string, string>>({});
  const [transferRemarks, setTransferRemarks] = useState<Record<string, string>>({});

  // Add Room Form State
  const [block, setBlock] = useState('Block A');
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState(1);
  const [capacity, setCapacity] = useState(2);

  // Edit Room State
  const [editCapacity, setEditCapacity] = useState(2);
  const [editStatus, setEditStatus] = useState<'available' | 'full' | 'maintenance'>('available');

  // Calculate live occupants for each room from allStudents
  const getRoomOccupants = (rmBlock: string, rmNumber: string) => {
    return allStudents.filter((s) => s.hostelBlock === rmBlock && s.roomNumber === rmNumber);
  };

  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + getRoomOccupants(r.block, r.roomNumber).length, 0);
  const availableBeds = Math.max(0, totalBeds - totalOccupied);

  const filteredRooms = rooms.filter((r) => {
    if (selectedBlockFilter !== 'all' && r.block !== selectedBlockFilter) return false;
    return true;
  });

  const pendingTransfers = roomChangeRequests.filter((rc) => rc.status === 'pending');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) return;

    const newRoom: Room = {
      id: 'r_' + Date.now(),
      block,
      roomNumber: roomNumber.trim(),
      floor,
      capacity,
      occupiedCount: 0,
      status: 'available',
    };

    const updated = [newRoom, ...rooms];
    localStore.setRooms(updated);
    setRooms(updated);

    setShowAddModal(false);
    setRoomNumber('');
  };

  const handleSaveEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const occupants = getRoomOccupants(editingRoom.block, editingRoom.roomNumber);
    let calculatedStatus = editStatus;
    if (editStatus !== 'maintenance') {
      calculatedStatus = occupants.length >= editCapacity ? 'full' : 'available';
    }

    const updated = rooms.map((r) =>
      r.id === editingRoom.id
        ? {
            ...r,
            capacity: editCapacity,
            status: calculatedStatus,
            occupiedCount: occupants.length,
          }
        : r
    );

    localStore.setRooms(updated);
    setRooms(updated);
    setEditingRoom(null);
  };

  const handleAllocateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingRoom || !selectedStudentToAllocate) return;

    updateStudentByWarden(selectedStudentToAllocate, {
      hostelBlock: allocatingRoom.block,
      roomNumber: allocatingRoom.roomNumber,
    });

    setAllocatingRoom(null);
    setSelectedStudentToAllocate('');
  };

  // Handle Room Change Request Approval or Rejection
  const handleTransferDecision = (requestId: string, decision: 'approved' | 'rejected') => {
    const targetRoomKey = reassignTargetRooms[requestId]; // e.g. "Block B::102"
    const remarks = transferRemarks[requestId] || (decision === 'approved' ? 'Transfer approved.' : 'Rejected by warden office.');

    const targetReq = roomChangeRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    if (decision === 'approved') {
      if (!targetRoomKey) {
        alert('Please select an available target room to reassign the student.');
        return;
      }

      const [targetBlock, targetRoomNum] = targetRoomKey.split('::');

      // 1. Reassign student's room in student profile
      updateStudentByWarden(targetReq.studentId, {
        hostelBlock: targetBlock,
        roomNumber: targetRoomNum,
      });

      // 2. Notify student
      addNotification(
        targetReq.studentId,
        'Room Transfer Application Approved',
        `Your room transfer request has been approved! You have been reassigned to ${targetBlock} - Room ${targetRoomNum}. Remarks: ${remarks}`,
        'leave'
      );
    } else {
      addNotification(
        targetReq.studentId,
        'Room Transfer Request Rejected',
        `Your room transfer request has been rejected. Remarks: ${remarks}`,
        'leave'
      );
    }

    // Update room change requests in store
    const updatedRequests = roomChangeRequests.map((r) =>
      r.id === requestId ? { ...r, status: decision as any, wardenRemarks: remarks } : r
    );

    localStore.setRoomChangeRequests(updatedRequests);
    setRoomChangeRequests(updatedRequests);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Rooms & Inventory</h2>
          <p className="text-xs text-gray-500">Manage room capacity, bed allocations and room transfer requests</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Tabs: Inventory vs Room Transfers */}
      <div className="flex border-b border-gray-200 bg-white px-4 pt-2 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Room Inventory & Beds ({rooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'transfers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Room Transfer Applications</span>
          {pendingTransfers.length > 0 && (
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full animate-pulse">
              {pendingTransfers.length} Pending
            </span>
          )}
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Metrics Banner */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-500">Total Rooms</span>
              <div className="text-2xl font-black text-gray-900 mt-0.5">{rooms.length}</div>
              <span className="text-[11px] text-gray-500">Across 4 Blocks</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-blue-600">Occupied Beds</span>
              <div className="text-2xl font-black text-blue-900 mt-0.5">{totalOccupied}</div>
              <span className="text-[11px] text-blue-600 font-medium">Beds Filled</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Available Beds</span>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">{availableBeds}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Vacant Ready</span>
            </div>
          </div>

          {/* Filter by Block */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Filter Rooms by Hostel Block:</span>
            <select
              value={selectedBlockFilter}
              onChange={(e) => setSelectedBlockFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800"
            >
              <option value="all">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
            </select>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((r) => {
              const occupants = getRoomOccupants(r.block, r.roomNumber);
              const isFull = occupants.length >= r.capacity;
              const status = r.status === 'maintenance' ? 'maintenance' : isFull ? 'full' : 'available';

              return (
                <div
                  key={r.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase">{r.block}</span>
                        <h3 className="text-lg font-black text-gray-900">Room {r.roomNumber}</h3>
                        <p className="text-[11px] text-gray-500">Floor {r.floor}</p>
                      </div>
                      <Badge status={status} />
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-2">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-600">Bed Occupancy:</span>
                        <span className="text-gray-900">
                          {occupants.length} / {r.capacity} Beds
                        </span>
                      </div>

                      {/* Occupants list */}
                      <div className="pt-2 border-t border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Allocated Residents:</span>
                        {occupants.length === 0 ? (
                          <p className="text-[11px] text-gray-400 italic">No students allocated</p>
                        ) : (
                          occupants.map((occ) => (
                            <div key={occ.id} className="flex items-center space-x-1.5 text-[11px] text-gray-700">
                              <Users className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              <span className="font-semibold truncate">
                                {occ.fullName} ({occ.studentIdNo})
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-end space-x-2">
                    {!isFull && r.status !== 'maintenance' && (
                      <button
                        onClick={() => setAllocatingRoom(r)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                        title="Allocate Student"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Allocate</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingRoom(r);
                        setEditCapacity(r.capacity);
                        setEditStatus(r.status);
                      }}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                      title="Edit Room"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* ROOM TRANSFER APPLICATIONS TAB */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          <div className="p-4 bg-gray-50 font-bold text-xs text-gray-700 flex justify-between items-center">
            <span>Student Room Transfer Requests</span>
            <span>{pendingTransfers.length} Action Required</span>
          </div>

          {roomChangeRequests.length === 0 ? (
            <p className="p-8 text-center text-xs text-gray-400">No room transfer applications submitted yet.</p>
          ) : (
            roomChangeRequests.map((req) => (
              <div key={req.id} className="p-5 space-y-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-gray-900">{req.studentName}</span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Current: {req.block} - Room {req.currentRoomNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded capitalize">
                        Reason: {req.reasonCategory}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge status={req.status} />
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed font-medium">
                  <strong>Student Justification:</strong> {req.details}
                </div>

                {req.status === 'pending' ? (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Reassign to Vacant Room *
                        </label>
                        <select
                          value={reassignTargetRooms[req.id] || ''}
                          onChange={(e) =>
                            setReassignTargetRooms({ ...reassignTargetRooms, [req.id]: e.target.value })
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Choose target vacant room --</option>
                          {rooms
                            .filter(
                              (rm) =>
                                rm.status !== 'maintenance' &&
                                getRoomOccupants(rm.block, rm.roomNumber).length < rm.capacity &&
                                !(rm.block === req.block && rm.roomNumber === req.currentRoomNumber)
                            )
                            .map((rm) => (
                              <option key={rm.id} value={`${rm.block}::${rm.roomNumber}`}>
                                {rm.block} - Room {rm.roomNumber} ({rm.capacity - getRoomOccupants(rm.block, rm.roomNumber).length} beds available)
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Warden Remarks</label>
                        <input
                          type="text"
                          placeholder="Approval / rejection remarks..."
                          value={transferRemarks[req.id] || ''}
                          onChange={(e) =>
                            setTransferRemarks({ ...transferRemarks, [req.id]: e.target.value })
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleTransferDecision(req.id, 'rejected')}
                        className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Request</span>
                      </button>

                      <button
                        onClick={() => handleTransferDecision(req.id, 'approved')}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Reassign Room</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  req.wardenRemarks && (
                    <p className="text-xs text-gray-600 font-medium pt-1">
                      <strong>Warden Remarks:</strong> {req.wardenRemarks}
                    </p>
                  )
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================
          ADD ROOM MODAL
      ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Add Hostel Room</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Hostel Block</label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
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
                  placeholder="e.g. 205"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          EDIT ROOM MODAL
      ============================================================ */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">Edit Room Details</h3>
                <p className="text-[11px] text-gray-500">
                  {editingRoom.block} - Room {editingRoom.roomNumber}
                </p>
              </div>
              <button onClick={() => setEditingRoom(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Bed Capacity</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Room Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold"
                >
                  <option value="available">Available (Open for Allocation)</option>
                  <option value="full">Full (Capacity Reached)</option>
                  <option value="maintenance">Maintenance (Closed)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          ALLOCATE STUDENT TO ROOM MODAL
      ============================================================ */}
      {allocatingRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">Allocate Resident</h3>
                <p className="text-[11px] text-gray-500">
                  To {allocatingRoom.block} - Room {allocatingRoom.roomNumber}
                </p>
              </div>
              <button onClick={() => setAllocatingRoom(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Student</label>
                <select
                  required
                  value={selectedStudentToAllocate}
                  onChange={(e) => setSelectedStudentToAllocate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-medium"
                >
                  <option value="">-- Choose a student to allocate --</option>
                  {allStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} (Currently: {st.hostelBlock} - R{st.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAllocatingRoom(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudentToAllocate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
