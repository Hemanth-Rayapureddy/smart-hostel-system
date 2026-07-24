import React, { useState, useEffect } from 'react';
import { Bed, CheckCircle2, AlertCircle, Info, Sparkles, Building, Layers, ShieldCheck, Ticket, User, DollarSign } from 'lucide-react';

export default function TicketRoomSelector({ roomsData, onAllocateBed, activeRole }) {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [studentNameInput, setStudentNameInput] = useState("Alex Johnson");
  const [allocationSuccess, setAllocationSuccess] = useState(null);

  // Filter rooms by active floor
  const roomsOnFloor = roomsData ? roomsData.filter(r => r.floor === selectedFloor) : [];

  const handleSelectBed = (room, bed) => {
    if (bed.isOccupied) return; // Cannot select occupied bed
    setSelectedRoom(room);
    setSelectedBed(bed);
    setAllocationSuccess(null);
  };

  const handleConfirmAllocation = () => {
    if (!selectedRoom || !selectedBed) return;

    onAllocateBed(selectedRoom.id, selectedBed.id, "u-student-1", studentNameInput || "Alex Johnson");
    setAllocationSuccess(`Ticket Confirmed! ${selectedBed.name} in Room ${selectedRoom.roomNo} successfully booked for ${studentNameInput}!`);
    
    // Reset selection after delay
    setTimeout(() => {
      setSelectedBed(null);
      setSelectedRoom(null);
    }, 2500);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
      
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Ticket className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Ticket-Style Visual Room & Bed Allocator</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Interactive seat-matrix layout. Select floor, pick an available bed (Green), inspect room amenities, and confirm ticket allocation.
          </p>
        </div>

        {/* Floor Selection Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider">Floor:</span>
          {[1, 2].map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFloor === floor 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-emerald-500/30 border border-emerald-400 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </span>
            <span className="text-slate-300 font-semibold">Available Bed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-rose-500/30 border border-rose-400 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            </span>
            <span className="text-slate-300 font-semibold">Occupied Bed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-blue-500/40 border-2 border-blue-400 shadow-md shadow-blue-500/50 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
            </span>
            <span className="text-cyan-300 font-bold">Selected Seat</span>
          </div>
        </div>

        <span className="text-slate-400 italic">Click any green bed to launch allocation ticket details</span>
      </div>

      {/* Room Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomsOnFloor.map(room => (
          <div 
            key={room.id}
            className={`rounded-2xl p-5 transition-all duration-300 ${
              selectedRoom?.id === room.id 
                ? 'bg-slate-900/90 border-2 border-blue-500 shadow-xl shadow-blue-500/20' 
                : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Room Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white">Room {room.roomNo}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {room.type}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{room.block}</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {room.pricePerSemester}/sem
              </span>
            </div>

            {/* Beds Graphic Array (Ticket Booking Seat Design) */}
            <div className="mt-4 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Bed Slot:</span>
              <div className="grid grid-cols-2 gap-2.5">
                {room.beds.map(bed => {
                  const isSelected = selectedBed?.id === bed.id;
                  const isOccupied = bed.isOccupied;

                  return (
                    <button
                      key={bed.id}
                      disabled={isOccupied}
                      onClick={() => handleSelectBed(room, bed)}
                      className={`p-3 rounded-xl flex flex-col items-start transition-all duration-200 text-left relative ${
                        isSelected 
                          ? 'bed-card-selected' 
                          : isOccupied 
                          ? 'bed-card-occupied cursor-not-allowed opacity-80' 
                          : 'bed-card-available hover:scale-[1.03] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Bed className={`w-4 h-4 ${isSelected ? 'text-blue-300' : isOccupied ? 'text-rose-400' : 'text-emerald-400'}`} />
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isSelected 
                            ? 'bg-blue-500 text-white' 
                            : isOccupied 
                            ? 'bg-rose-500/30 text-rose-300' 
                            : 'bg-emerald-500/30 text-emerald-300'
                        }`}>
                          {isSelected ? 'SELECTED' : isOccupied ? 'TAKEN' : 'VACANT'}
                        </span>
                      </div>

                      <span className={`text-xs font-bold mt-2 ${isSelected ? 'text-white' : isOccupied ? 'text-slate-300' : 'text-emerald-200'}`}>
                        {bed.name}
                      </span>

                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                        {isOccupied ? `Occupant: ${bed.studentName}` : 'Click to Reserve'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Amenities Tags */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              {room.amenities.map(am => (
                <span key={am} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                  • {am}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Bed Ticket Booking Confirmation Card */}
      {selectedRoom && selectedBed && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/60 border-2 border-blue-500/80 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h4 className="text-lg font-extrabold text-white">Bed Allocation Ticket Details</h4>
              </div>
              <p className="text-xs text-slate-300">
                Reserving <span className="font-bold text-cyan-300">{selectedBed.name}</span> in <span className="font-bold text-white">Room {selectedRoom.roomNo}</span> ({selectedRoom.block}, Floor {selectedRoom.floor}).
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span>Type: <strong className="text-white">{selectedRoom.type}</strong></span>
                <span>Semester Fee: <strong className="text-emerald-400">{selectedRoom.pricePerSemester}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="Enter Student Name"
                  className="bg-transparent text-xs text-white focus:outline-none w-36 font-semibold"
                />
              </div>

              <button
                onClick={handleConfirmAllocation}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Issue Allocation Ticket</span>
              </button>
            </div>

          </div>

          {allocationSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{allocationSuccess}</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
