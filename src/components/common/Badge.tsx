import React from 'react';

interface BadgeProps {
  status: string;
  variant?: 'default' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant = 'default' }) => {
  let colorClass = 'bg-gray-100 text-gray-800';

  const s = status.toLowerCase();

  if (s === 'approved' || s === 'resolved' || s === 'present' || s === 'paid' || s === 'good' || s === 'completed') {
    colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (s === 'pending' || s === 'submitted' || s === 'in_progress' || s === 'assigned' || s === 'partial' || s === 'needs attention') {
    colorClass = 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (s === 'rejected' || s === 'escalated' || s === 'absent' || s === 'overdue' || s === 'critical' || s === 'active' || s === 'emergency') {
    colorClass = 'bg-rose-100 text-rose-800 border-rose-200 font-semibold animate-pulse';
  } else if (s === 'important' || s === 'leave' || s === 'late') {
    colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};
