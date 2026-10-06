import React from 'react';
import { localStore } from '../../lib/supabase';
import { calculateHostelHealth } from '../../lib/healthScore';
import { Activity, ShieldCheck, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export const HealthScoreView: React.FC = () => {
  const complaints = localStore.getComplaints();
  const emergencies = localStore.getEmergencies();

  const healthData = calculateHostelHealth(complaints, emergencies);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Smart Hostel Health Score</h2>
            <p className="text-xs text-gray-500">
              Algorithmic maintenance & safety index calculated from real operational indicators
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 rounded-xl shadow-md">
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200">Overall Score</div>
            <div className="text-2xl font-extrabold">{healthData.overallScore} / 100</div>
          </div>
          <Badge status={healthData.overallStatus} />
        </div>
      </div>

      {/* Transparent Algorithm Card */}
      <div className="bg-blue-50/80 border border-blue-200 p-5 rounded-2xl space-y-2 text-xs text-blue-950">
        <div className="flex items-center space-x-2 font-bold text-blue-900">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Transparent Scoring Algorithm (0 – 100 Points):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-blue-800 font-medium pl-1">
          <li><strong>Base Score:</strong> 100 points per block</li>
          <li><strong>Unresolved Complaint:</strong> -4 points deduction</li>
          <li><strong>Escalated Complaint:</strong> -8 points deduction</li>
          <li><strong>Active Emergency Alert:</strong> -12 points deduction</li>
          <li><strong>Status Levels:</strong> Good (82–100), Needs Attention (65–81), Critical (&lt;65)</li>
        </ul>
      </div>

      {/* Block-wise Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthData.blockScores.map((b) => (
          <div key={b.block} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{b.block}</h3>
                <p className="text-xs text-gray-500">{b.totalComplaints} Total Registered Complaints</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-gray-900">{b.score}/100</div>
                <Badge status={b.statusText} />
              </div>
            </div>

            {/* Health Meter Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  b.score >= 82
                    ? 'bg-emerald-500'
                    : b.score >= 65
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${b.score}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-500 block">Unresolved:</span>
                <span className="font-bold text-gray-900">{b.unresolvedComplaints} tickets</span>
              </div>

              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                <span className="text-rose-700 block">Escalated:</span>
                <span className="font-bold text-rose-900">{b.escalatedComplaints} tickets</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
