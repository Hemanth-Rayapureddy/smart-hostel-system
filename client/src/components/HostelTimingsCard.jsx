import React from 'react';
import { Clock, ShieldAlert, Utensils, BookOpen, Users, Dumbbell, Sparkles } from 'lucide-react';

export default function HostelTimingsCard({ timingsData }) {
  
  const getIcon = (category) => {
    if (category.toLowerCase().includes('curfew')) return ShieldAlert;
    if (category.toLowerCase().includes('breakfast') || category.toLowerCase().includes('lunch') || category.toLowerCase().includes('dinner') || category.toLowerCase().includes('snacks')) return Utensils;
    if (category.toLowerCase().includes('study') || category.toLowerCase().includes('quiet')) return BookOpen;
    if (category.toLowerCase().includes('visitor')) return Users;
    if (category.toLowerCase().includes('gym') || category.toLowerCase().includes('sports')) return Dumbbell;
    return Clock;
  };

  const getColor = (category) => {
    if (category.toLowerCase().includes('curfew')) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    if (category.toLowerCase().includes('breakfast') || category.toLowerCase().includes('lunch') || category.toLowerCase().includes('dinner')) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (category.toLowerCase().includes('study')) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    if (category.toLowerCase().includes('visitor')) return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 shadow-2xl relative space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">Hostel Operational Timings & Rules</h3>
            <p className="text-xs text-slate-400">Official daily curfew, dining, study and recreational hours schedule</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Schedule Active</span>
        </div>
      </div>

      {/* Grid of Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(timingsData || []).map(t => {
          const IconComp = getIcon(t.category);
          const colorStyles = getColor(t.category);

          return (
            <div key={t.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl border ${colorStyles}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {t.status}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white pt-1">{t.category}</h4>
              <span className="text-xs font-extrabold text-cyan-300 block">{t.time}</span>
              <p className="text-[11px] text-slate-400 leading-snug">{t.detail}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
