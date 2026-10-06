import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, MessFeedback } from '../../types';
import { localStore } from '../../lib/supabase';
import { Utensils, Star, Send, CheckCircle2 } from 'lucide-react';

export const MessFeedbackView: React.FC = () => {
  const { currentUser } = useAuth();
  const student = currentUser as StudentProfile;

  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [taste, setTaste] = useState(4);
  const [quality, setQuality] = useState(4);
  const [quantity, setQuantity] = useState(4);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFb: MessFeedback = {
      id: 'fb_' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      mealDate: new Date().toISOString().split('T')[0],
      mealType,
      tasteRating: taste,
      qualityRating: quality,
      quantityRating: quantity,
      comments,
      createdAt: new Date().toISOString(),
    };

    const all = localStore.getMessFeedback();
    localStore.setMessFeedback([newFb, ...all]);

    setComments('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderStars = (val: number, setVal: (v: number) => void) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setVal(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-6 h-6 ${
              star <= val ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mess & Food Feedback</h2>
          <p className="text-xs text-gray-500">Rate today's meals to help improve food quality</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex space-x-2 border-b border-gray-100 pb-4">
          {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMealType(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                mealType === m ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Taste Rating</label>
            {renderStars(taste, setTaste)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Food Quality Rating</label>
            {renderStars(quality, setQuality)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity & Serving Rating</label>
            {renderStars(quantity, setQuantity)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Optional Comments</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Constructive suggestions for mess menu..."
              className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {submitted ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Feedback recorded! Thank you.</span>
            </span>
          ) : (
            <span className="text-[11px] text-gray-400">Feedback is aggregated anonymously for mess committee.</span>
          )}

          <button
            type="submit"
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Food Rating</span>
          </button>
        </div>
      </form>
    </div>
  );
};
