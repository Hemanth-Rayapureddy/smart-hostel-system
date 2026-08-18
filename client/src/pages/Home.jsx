import React from 'react';
import { 
  Building2, 
  Ticket, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Users, 
  Bed, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  MessageSquare,
  Lock,
  Download,
  Utensils,
  Trophy,
  Star
} from 'lucide-react';
import TicketRoomSelector from '../components/TicketRoomSelector';
import MessMenuViewer from '../components/MessMenuViewer';
import HostelTimingsCard from '../components/HostelTimingsCard';
import ActivitiesHub from '../components/ActivitiesHub';

export default function Home({ setActivePage, setActiveRole, roomsData, timingsData, messMenuData, activitiesData, onAllocateBed, onRegisterActivity }) {
  
  const objectives = [
    { title: "Digitize Hostel Management", desc: "Automate room allocations, resident logs, and daily record keeping.", icon: Zap },
    { title: "Simplify Room Allocation", desc: "Ticket-booking seat selection format for effortless floor and bed reservation.", icon: Ticket },
    { title: "Track Attendance Digitally", desc: "Warden-managed real-time present/absent logs with monthly exports.", icon: UserCheck },
    { title: "Manage Leave Requests Online", desc: "Digital paperless approval workflow with instant Warden notifications.", icon: Clock },
    { title: "Enable Complaint Submission", desc: "Category-based issue ticketing with status tracking and resolution notes.", icon: MessageSquare },
    { title: "Weekly Mess Menu & Timings", desc: "Track 4-meal daily catering items, dining hours, and curfew schedules.", icon: Utensils },
    { title: "Hostel Sports & Activities", desc: "Register for inter-hostel chess, football, open mic & tech hackathons.", icon: Trophy },
    { title: "Increase Campus Security", desc: "Approved visitor log management and curfew tracking for safety.", icon: Lock }
  ];

  const teamMembers = [
    { name: "Dr. Robert Vance", role: "Chief Hostel Administrator", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300", department: "Admin Oversight & Policy" },
    { name: "Prof. Marcus Brody", role: "Senior Warden (Block A)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300", department: "Attendance & Student Welfare" },
    { name: "Sarah Jenkins", role: "Warden (Block B)", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", department: "Leave & Security Verification" }
  ];

  return (
    <div className="space-y-24">
      
      {/* Hero Banner */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-blue-500/10">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Next-Gen Smart Student Accommodation</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smart Student Hostel <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              A comprehensive digital portal offering <span className="text-cyan-300 font-semibold">ticket-booking style room allocation</span>, warden digital attendance, hostel curfew timings, weekly mess menus, sports activities, and instant fee management.
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setActiveRole('Student');
                  setActivePage('student-dashboard');
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Student Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveRole('Warden');
                  setActivePage('warden-dashboard');
                }}
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Warden Portal</span>
              </button>

              <button
                onClick={() => {
                  setActiveRole('Admin');
                  setActivePage('admin-dashboard');
                }}
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Portal</span>
              </button>
            </div>

            {/* Key Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
              {[
                { label: 'Total Hostel Residents', val: '1,240+', icon: Users, color: 'text-blue-400' },
                { label: 'Room Occupancy Rate', val: '96.4%', icon: Bed, color: 'text-cyan-400' },
                { label: 'Digital Attendance Log', val: '99.8%', icon: UserCheck, color: 'text-emerald-400' },
                { label: 'Daily Catering Meals', val: '4 Meals', icon: Utensils, color: 'text-amber-400' }
              ].map(st => {
                const IconC = st.icon;
                return (
                  <div key={st.label} className="glass-panel p-4 rounded-2xl border border-slate-800/80 text-left">
                    <IconC className={`w-5 h-5 ${st.color} mb-1`} />
                    <span className="text-2xl font-extrabold text-white block">{st.val}</span>
                    <span className="text-xs text-slate-400">{st.label}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Ticket-Booking Style Room Allocation Interactive Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            Featured Innovation
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Ticket-Booking Method for Room Allocation
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Eliminate traditional paper queues. Residents and wardens can visually pick exact floor rooms and bed positions just like booking a flight or cinema seat.
          </p>
        </div>

        <TicketRoomSelector roomsData={roomsData} onAllocateBed={onAllocateBed} activeRole="Student" />
      </section>

      {/* Hostel Timings & Schedule Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HostelTimingsCard timingsData={timingsData} />
      </section>

      {/* Weekly Mess Food Menu Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MessMenuViewer messMenuData={messMenuData} activeRole="Student" />
      </section>

      {/* Hostel Activities & Sports Hub Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ActivitiesHub 
          activitiesData={activitiesData} 
          onRegisterActivity={onRegisterActivity} 
          studentName="Alex Johnson" 
        />
      </section>

      {/* Problems Identified vs Proposed Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Problems */}
          <div className="glass-panel rounded-3xl p-8 border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-950/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Traditional Hostel Problems</h3>
                <p className="text-xs text-slate-400">Manual friction and legacy paper management</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span><strong>Manual Paper Registers:</strong> Attendance sheets getting lost or damaged with prone clerical error.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span><strong>Opaque Room Allocation:</strong> Students cannot choose preferred bed positions or check live room availability.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span><strong>Delayed Leave & Complaints:</strong> Paper leave applications take days to reach Wardens for physical signature.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <span><strong>Uncertain Mess Food & Timings:</strong> Lack of weekly menu visibility and missing curfew notifications.</span>
              </li>
            </ul>
          </div>

          {/* Solution */}
          <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-950/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Smart Digital Solution</h3>
                <p className="text-xs text-slate-400">Cloud platform built for efficiency & security</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span><strong>Warden Attendance Dashboard:</strong> Instant present/absent/leave status marking with auto-calculated stats.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span><strong>Ticket-Style Seat Allocation:</strong> Visual seat map with live occupancy indicators and instant ticket confirmation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span><strong>Digital Catering & Activity Hub:</strong> Transparent 4-meal daily food items list, curfew clock, and sports event registrations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span><strong>Centralized Admin Command:</strong> Comprehensive user role controls, fee tracking, and downloadable PDF/CSV reports.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Core Objectives Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Key System Objectives</h2>
          <p className="text-slate-400 text-sm mt-2">Designed to empower administration, wardens, and students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map(obj => {
            const IconC = obj.icon;
            return (
              <div key={obj.title} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
                  <IconC className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">{obj.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{obj.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership & Warden Staff */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Hostel Administration & Wardens</h2>
          <p className="text-slate-400 text-sm mt-2">Dedicated personnel supervising student resident well-being</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map(tm => (
            <div key={tm.name} className="glass-panel rounded-3xl p-6 border border-slate-800 text-center space-y-4 hover:border-slate-700 transition-all">
              <img 
                src={tm.image} 
                alt={tm.name} 
                className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-blue-500/50 shadow-lg shadow-blue-500/20"
              />
              <div>
                <h4 className="font-bold text-lg text-white">{tm.name}</h4>
                <span className="text-xs font-semibold text-blue-400 block">{tm.role}</span>
                <span className="text-[11px] text-slate-400">{tm.department}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
