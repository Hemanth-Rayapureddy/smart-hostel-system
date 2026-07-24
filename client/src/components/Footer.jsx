import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="glass-panel border-t border-slate-800 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                SmartHostel
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Next-generation digital student hostel administration platform. Simplifying room allocation via ticket booking system, digital attendance, warden supervision, and instant fee tracking.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                System Operational v2.4
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Home', 'About', 'Features', 'Notice Board', 'Contact'].map(link => (
                <li key={link}>
                  <button 
                    onClick={() => setActivePage(link.toLowerCase().replace(' ', ''))}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <span>{link}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: System Modules */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Hostel Modules</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => setActivePage('features')} className="hover:text-blue-400">Ticket Room Allocator</button></li>
              <li><button onClick={() => setActivePage('warden-dashboard')} className="hover:text-blue-400">Warden Attendance Portal</button></li>
              <li><button onClick={() => setActivePage('student-dashboard')} className="hover:text-blue-400">Leave & Complaint Hub</button></li>
              <li><button onClick={() => setActivePage('admin-dashboard')} className="hover:text-blue-400">Admin Controls & Rules</button></li>
              <li><button onClick={() => setActivePage('notices')} className="hover:text-blue-400">Circulars & Announcements</button></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Campus Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>Hostel Block A, University Green Campus, Innovation Way, CA 90210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+1 (800) 555-HOSTEL</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@smarthostel.edu</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart Student Hostel Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span className="flex items-center gap-1 text-slate-400">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for modern hostels
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
