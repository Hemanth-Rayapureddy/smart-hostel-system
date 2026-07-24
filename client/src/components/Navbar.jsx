import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  Sparkles,
  Bed,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeRole, setActiveRole, darkMode, setDarkMode, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Curfew reminder: Gates close at 10:00 PM", time: "10m ago", icon: AlertCircle, color: "text-amber-400" },
    { id: 2, text: "Your leave request for July 28 has been Approved", time: "1h ago", icon: Calendar, color: "text-emerald-400" },
    { id: 3, text: "Room Maintenance ticket A-204 resolved", time: "3h ago", icon: Bed, color: "text-blue-400" }
  ];

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  SmartHostel
                </span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Digital Management Portal</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'features', label: 'Features' },
              { id: 'notices', label: 'Notice Board' },
              { id: 'contact', label: 'Contact' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activePage === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Quick Role Selector Badge & Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Dashboard Link based on Active Role */}
            <button
              onClick={() => handleNavClick(`${activeRole.toLowerCase()}-dashboard`)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-cyan-300 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{activeRole} Portal</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">Role:</span>
              {['Student', 'Warden', 'Admin'].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setActivePage(`${r.toLowerCase()}-dashboard`);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeRole === r 
                      ? r === 'Admin' ? 'bg-purple-600 text-white' : r === 'Warden' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 relative transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl z-50 border border-slate-700/80 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="font-bold text-sm text-slate-100">Live Notifications</h4>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {notifications.map(n => {
                      const IconComp = n.icon;
                      return (
                        <div key={n.id} className="flex gap-3 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800">
                          <IconComp className={`w-5 h-5 ${n.color} shrink-0 mt-0.5`} />
                          <div>
                            <p className="text-xs text-slate-200 leading-snug">{n.text}</p>
                            <span className="text-[10px] text-slate-500">{n.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 mb-2">
            <span className="text-xs font-semibold text-slate-400">Switch Role:</span>
            <div className="flex gap-1">
              {['Student', 'Warden', 'Admin'].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setActivePage(`${r.toLowerCase()}-dashboard`);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    activeRole === r ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About System' },
            { id: 'features', label: 'Hostel Features' },
            { id: 'notices', label: 'Notice Board' },
            { id: 'contact', label: 'Contact Us' },
            { id: `${activeRole.toLowerCase()}-dashboard`, label: `${activeRole} Dashboard` }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activePage === item.id 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
