import React, { useState } from 'react';
import { Poll } from '../../types';
import { localStore } from '../../lib/supabase';
import { Vote, Plus, Trash2, Send } from 'lucide-react';

export const PollCreator: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>(() => localStore.getPolls());

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [expiryDays, setExpiryDays] = useState(7);

  const handleOptionChange = (index: number, value: string) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  const addOptionField = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const validOpts = options.map((o) => o.trim()).filter(Boolean);
    if (!question || validOpts.length < 2) return;

    const expires = new Date();
    expires.setDate(expires.getDate() + expiryDays);

    const votesInit: Record<number, number> = {};
    validOpts.forEach((_, idx) => {
      votesInit[idx] = 0;
    });

    const newPoll: Poll = {
      id: 'p_' + Date.now(),
      question,
      options: validOpts,
      votes: votesInit,
      isActive: true,
      expiresAt: expires.toISOString(),
      createdBy: 'Warden Dr. K. V. Raman',
      createdAt: new Date().toISOString(),
    };

    const updated = [newPoll, ...polls];
    localStore.setPolls(updated);
    setPolls(updated);

    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Vote className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Student Poll Creator</h2>
          <p className="text-xs text-gray-500">Conduct student opinion voting polls for hostel mess & facilities</p>
        </div>
      </div>

      <form onSubmit={handleCreatePoll} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Poll Question</label>
          <input
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What time should Sunday morning cleaning start?"
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Poll Options (At least 2)</label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                required
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}...`}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}

          {options.length < 5 && (
            <button
              type="button"
              onClick={addOptionField}
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center space-x-1 pt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Option</span>
            </button>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Launch Student Poll</span>
          </button>
        </div>
      </form>
    </div>
  );
};
