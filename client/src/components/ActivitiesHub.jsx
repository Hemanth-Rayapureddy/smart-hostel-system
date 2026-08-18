import React, { useState } from 'react';
import { Calendar, Trophy, Users, MapPin, Sparkles, CheckCircle2, Ticket, Clock } from 'lucide-react';

export default function ActivitiesHub({ activitiesData, onRegisterActivity, studentName }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [registeredIds, setRegisteredIds] = useState([]);
  const [successMsg, setSuccessMsg] = useState(null);

  const categories = ['All', 'Sports & Gaming', 'Cultural & Arts', 'Technical & Tech'];

  const filteredActivities = (activitiesData || []).filter(a => 
    selectedCategory === 'All' || a.category === selectedCategory
  );

  const handleRegister = (act) => {
    if (registeredIds.includes(act.id)) return;

    onRegisterActivity(act.id, "u-student-1", studentName || "Alex Johnson");
    setRegisteredIds(prev => [...prev, act.id]);
    setSuccessMsg(`Registered for ${act.title}! Slot confirmed.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 shadow-2xl relative space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Hostel Sports, Cultural & Tech Activities</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Participate in inter-hostel tournaments, open mic nights, and tech hackathons</p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredActivities.map(act => {
          const isRegistered = registeredIds.includes(act.id);
          const isFull = act.registeredCount >= act.maxSlots;

          return (
            <div key={act.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all group">
              
              <div className="space-y-3">
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img 
                    src={act.image} 
                    alt={act.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-purple-300 border border-purple-500/30">
                    {act.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {act.maxSlots - act.registeredCount} Slots Left
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base group-hover:text-purple-300 transition-colors">{act.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{act.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Date & Time: <strong className="text-slate-200">{act.date} ({act.time})</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Venue: <strong className="text-slate-200">{act.venue}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">By: {act.organizer}</span>

                <button
                  disabled={isRegistered || isFull}
                  onClick={() => handleRegister(act)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    isRegistered 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                      : isFull 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 hover:scale-105'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Spot Registered</span>
                    </>
                  ) : isFull ? (
                    <span>Slots Full</span>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Register Spot</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
