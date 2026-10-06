import { Complaint, EmergencyAlert, HostelHealthOverview, HostelBlockHealth } from '../types';

export function calculateHostelHealth(
  complaints: Complaint[],
  emergencies: EmergencyAlert[]
): HostelHealthOverview {
  const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];

  const blockScores: HostelBlockHealth[] = blocks.map((block) => {
    const blockComplaints = complaints.filter((c) => c.block === block);
    const blockEmergencies = emergencies.filter(
      (e) => e.block === block && e.status === 'active'
    );

    const totalComplaints = blockComplaints.length;
    const unresolvedComplaints = blockComplaints.filter(
      (c) => c.status !== 'resolved'
    ).length;
    const escalatedComplaints = blockComplaints.filter(
      (c) => c.status === 'escalated'
    ).length;

    // Health Score calculation base = 100
    // Deduction: -4 per unresolved, -8 per escalated, -12 per active emergency
    let score = 100 - (unresolvedComplaints * 4 + escalatedComplaints * 8 + blockEmergencies.length * 12);
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    let statusText: 'Good' | 'Needs Attention' | 'Critical' = 'Good';
    if (score < 65) {
      statusText = 'Critical';
    } else if (score < 82) {
      statusText = 'Needs Attention';
    }

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    blockComplaints.forEach((c) => {
      if (c.status !== 'resolved') {
        categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
      }
    });

    // Floor breakdown (floors 1-4)
    const floors = [1, 2, 3, 4].map((floorNum) => {
      // room numbers starting with floor digit (e.g. 101, 204)
      const floorComplaints = blockComplaints.filter((c) => {
        if (c.status === 'resolved') return false;
        const roomDigit = c.roomNumber.charAt(0);
        return roomDigit === String(floorNum);
      }).length;

      let statusColor: 'green' | 'orange' | 'red' = 'green';
      if (floorComplaints >= 3) {
        statusColor = 'red';
      } else if (floorComplaints >= 1) {
        statusColor = 'orange';
      }

      return {
        floor: floorNum,
        openComplaints: floorComplaints,
        statusColor,
      };
    });

    return {
      block,
      score,
      statusText,
      totalComplaints,
      unresolvedComplaints,
      escalatedComplaints,
      categoryBreakdown,
      floors,
    };
  });

  // Overall Score = average of block scores
  const avgScore = Math.round(
    blockScores.reduce((acc, b) => acc + b.score, 0) / blockScores.length
  );

  let overallStatus: 'Good' | 'Needs Attention' | 'Critical' = 'Good';
  if (avgScore < 65) overallStatus = 'Critical';
  else if (avgScore < 82) overallStatus = 'Needs Attention';

  return {
    overallScore: avgScore,
    overallStatus,
    blockScores,
  };
}
