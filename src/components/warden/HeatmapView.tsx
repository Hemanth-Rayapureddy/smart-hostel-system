import React, { useState } from 'react';
import { localStore } from '../../lib/supabase';
import { calculateHostelHealth } from '../../lib/healthScore';
import { ShieldAlert, Layers, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../common/Badge';

export const HeatmapView: React.FC = () => {
  const complaints = localStore.getComplaints();
  const emergencies = localStore.getEmergencies();

  const healthData = calculateHostelHealth(complaints, emergencies);

  const [selectedBlock, setSelectedBlock] = useState<string | null>(healthData.blockScores[0].block);

  const currentBlockData = healthData.blockScores.find((b) => b.block === selectedBlock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hostel Problem Heatmap</h2>
            <p className="text-xs text-gray-500">
              Visual floor & block maintenance heat matrix (Warden Management Exclusive)
            </p>
          </div>
        </div>
      </div>

      {/* Block Heatmap Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthData.blockScores.map((b) => {
          let heatColor = 'bg-emerald-500 text-white shadow-emerald-200';
          let heatText = 'Low Maintenance Issues';

          if (b.score < 65) {
            heatColor = 'bg-rose-600 text-white shadow-rose-200 animate-pulse';
            heatText = 'HIGH PROBLEM CONCENTRATION';
          } else if (b.score < 82) {
            heatColor = 'bg-amber-500 text-white shadow-amber-200';
            heatText = 'Moderate Maintenance';
          }

          const isSelected = selectedBlock === b.block;

          return (
            <div
              key={b.block}
              onClick={() => setSelectedBlock(b.block)}
              className={`p-5 rounded-2xl cursor-pointer transition-all shadow-md ${heatColor} ${
                isSelected ? 'ring-4 ring-purple-600 ring-offset-2' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-lg">{b.block}</span>
                <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
                  Score: {b.score}
                </span>
              </div>
              <p className="text-xs font-semibold opacity-90">{heatText}</p>

              <div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-xs font-medium">
                <span>{b.unresolvedComplaints} Open Tickets</span>
                <span>{b.escalatedComplaints} Escalated</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Floor Breakdown for Selected Block */}
      {currentBlockData && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Detailed Floor Heatmap: {currentBlockData.block}
              </h3>
              <p className="text-xs text-gray-500">Floor-by-floor issue breakdown and active categories</p>
            </div>
            <Badge status={currentBlockData.statusText} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Floor Matrix */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-gray-700 uppercase">Floor Heat Index</h4>
              <div className="space-y-2">
                {currentBlockData.floors.map((fl) => {
                  let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  if (fl.statusColor === 'red') badgeBg = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
                  else if (fl.statusColor === 'orange') badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';

                  return (
                    <div
                      key={fl.floor}
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center space-x-2 font-bold text-gray-900">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span>Floor {fl.floor}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{fl.openComplaints} Open Complaints</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] ${badgeBg}`}>
                          {fl.statusColor.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-gray-700 uppercase">Top Problem Categories</h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                {Object.keys(currentBlockData.categoryBreakdown).length === 0 ? (
                  <p className="text-xs text-gray-500">No active complaints in this block!</p>
                ) : (
                  Object.entries(currentBlockData.categoryBreakdown).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-800 capitalize">{cat}</span>
                      <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {count} tickets
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
