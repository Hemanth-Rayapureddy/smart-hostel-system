import React, { useState } from 'react';
import { Utensils, Sun, Coffee, Moon, Sparkles, Star, CheckCircle2, ChevronRight, Apple } from 'lucide-react';

export default function MessMenuViewer({ messMenuData, activeRole, onUpdateMessMenu }) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [userRating, setUserRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const currentMenu = (messMenuData || []).find(
    m => m.day.toLowerCase() === selectedDay.toLowerCase()
  ) || messMenuData?.[0] || {
    day: 'Monday',
    breakfast: 'Puri Bhaji, Tea/Coffee',
    lunch: 'Rajma Masala, Basmati Rice, Chapati',
    snacks: 'Samosa, Masala Tea',
    dinner: 'Kadai Paneer, Dal Tadka, Rice, Gulab Jamun',
    specialTag: 'Chef Special Thali'
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 4000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-8">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Utensils className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Weekly Hostel Mess Food Menu</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Hygienic 4-meal daily dining schedule supervised by Hostel Mess Committee
          </p>
        </div>

        {/* Special Menu Tag Badge */}
        {currentMenu.specialTag && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{currentMenu.specialTag}</span>
          </div>
        )}
      </div>

      {/* Days Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {daysOfWeek.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              selectedDay === day 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-105' 
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 4-Meals Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Meal 1: Breakfast */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sun className="w-4 h-4" />
              <span>Breakfast</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
              07:30 - 09:30 AM
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentMenu.breakfast}
          </p>
        </div>

        {/* Meal 2: Lunch */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Utensils className="w-4 h-4" />
              <span>Lunch</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
              12:30 - 02:30 PM
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentMenu.lunch}
          </p>
        </div>

        {/* Meal 3: Evening Snacks */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
              <Coffee className="w-4 h-4" />
              <span>Evening Snacks</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
              05:00 - 06:30 PM
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentMenu.snacks}
          </p>
        </div>

        {/* Meal 4: Dinner */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Moon className="w-4 h-4" />
              <span>Dinner</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
              07:30 - 09:30 PM
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentMenu.dinner}
          </p>
        </div>

      </div>

      {/* Mess Rating & Feedback Form */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Apple className="w-4 h-4 text-emerald-400" />
            <span>Daily Mess Quality Feedback</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Rate today's hygiene & food quality for the mess committee.</p>
        </div>

        {ratingSubmitted ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Rating submitted.</span>
          </div>
        ) : (
          <form onSubmit={handleRatingSubmit} className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="focus:outline-none hover:scale-125 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition-all shadow-md shadow-amber-600/20"
            >
              Submit Rating
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
