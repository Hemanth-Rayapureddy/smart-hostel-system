import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, Poll } from '../../types';
import { localStore } from '../../lib/supabase';
import { Vote, CheckCircle2 } from 'lucide-react';

export const PollsView: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser as StudentProfile;

  const [polls, setPolls] = useState<Poll[]>(() => localStore.getPolls());

  if (!student) return null;

  const handleVote = (pollId: string, optionIdx: number) => {
    const updated = polls.map((p) => {
      if (p.id === pollId) {
        const prevVotes = p.votes[optionIdx] || 0;
        const newVotes = { ...p.votes, [optionIdx]: prevVotes + 1 };
        return { ...p, votes: newVotes, userVotedOption: optionIdx };
      }
      return p;
    });

    setPolls(updated);
    localStore.setPolls(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Vote className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Voting Polls</h2>
          <p className="text-xs text-gray-500">Participate in hostel decision polls created by Warden</p>
        </div>
      </div>

      <div className="space-y-4">
        {polls.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-500 bg-white rounded-2xl border border-gray-200">
            No active polls available right now.
          </p>
        ) : (
          polls.map((poll) => {
            const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0) || 1;

            return (
              <div key={poll.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900">{poll.question}</h3>

                <div className="space-y-2">
                  {poll.options.map((opt, idx) => {
                    const count = poll.votes[idx] || 0;
                    const percent = Math.round((count / totalVotes) * 100);
                    const isSelected = poll.userVotedOption === idx;

                    return (
                      <button
                        key={idx}
                        disabled={poll.userVotedOption !== undefined}
                        onClick={() => handleVote(poll.id, idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50/50 font-bold'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {/* Progress Bar background */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-purple-100/60 z-0"
                          style={{ width: `${percent}%` }}
                        ></div>

                        <div className="relative z-10 flex justify-between items-center">
                          <span className="text-gray-900">{opt}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 font-semibold">{percent}% ({count} votes)</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100 flex justify-between">
                  <span>Posted by {poll.createdBy}</span>
                  <span>{poll.userVotedOption !== undefined ? '✓ Vote Logged' : 'Select an option to vote'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
