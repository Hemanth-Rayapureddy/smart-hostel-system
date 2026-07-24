import React, { useState } from 'react';
import { Bell, Search, Filter, Pin, Calendar, Plus, CheckCircle2 } from 'lucide-react';

export default function NoticeBoard({ notices, activeRole, onAddNotice }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', category: 'Announcement', content: '', pinned: false });
  const [feedback, setFeedback] = useState(null);

  const categories = ['All', 'Announcement', 'Events', 'Circular'];

  const filteredNotices = (notices || []).filter(n => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostNotice = (e) => {
    e.preventDefault();
    onAddNotice({
      author: activeRole === 'Admin' ? 'Dr. Robert Vance (Admin)' : 'Prof. Marcus Brody (Warden)',
      ...noticeForm
    });
    setShowAddModal(false);
    setFeedback("Notice posted successfully to live bulletin!");
    setNoticeForm({ title: '', category: 'Announcement', content: '', pinned: false });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-white">Campus Digital Notice Board</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Official circulars, curfew reminders, and event announcements</p>
        </div>

        {(activeRole === 'Admin' || activeRole === 'Warden') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Notice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotices.map(notice => (
          <div key={notice.id} className={`glass-panel p-6 rounded-3xl border space-y-3 relative ${notice.pinned ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/20 to-slate-950/60' : 'border-slate-800'}`}>
            
            {notice.pinned && (
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Pin className="w-3 h-3 fill-amber-400" />
                <span>PINNED</span>
              </div>
            )}

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {notice.category}
            </span>

            <h3 className="text-lg font-bold text-white pr-16">{notice.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{notice.content}</p>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
              <span>Published by: <strong className="text-slate-200">{notice.author}</strong></span>
              <span>{notice.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* POST NOTICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-white">Post Announcement to Notice Board</h3>
            <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Notice Category</label>
                <select
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Events">Events</option>
                  <option value="Circular">Circular</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gate Timing Curfew Update"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Content / Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write clear instructions for students..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={noticeForm.pinned}
                  onChange={(e) => setNoticeForm({ ...noticeForm, pinned: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0"
                />
                <label htmlFor="pinned" className="text-slate-300 text-xs cursor-pointer">Pin to top of notice board</label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
