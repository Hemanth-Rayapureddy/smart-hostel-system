import React from 'react';
import { Building2, ShieldCheck, Cpu, Database, Layers, CheckCircle2, Server, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/30">
          About SmartHostel
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Digital Hostel Administration Platform
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          The Smart Student Hostel Management System is a digital platform designed to simplify hostel administration and improve student convenience by managing student registration, room allocation, attendance, complaints, leave requests, visitor records, hostel fees, and notices.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To create a seamless, paperless digital hostel ecosystem where student room allocation is as intuitive as seat selection, warden attendance verification is instant, and campus security is reinforced through verified cloud logs.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Empower educational institutions with real-time analytics, automated fee tracking, instant warden approval workflows, and transparent multi-role access for Admins, Wardens, and Students.
          </p>
        </div>
      </div>

      {/* System Architecture Specifications */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Full-Stack Platform Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>Frontend Stack</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              React.js single-page web app styled with Tailwind CSS, Framer Motion animations, Lucide React iconography, and Recharts interactive graphs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Server className="w-4 h-4" />
              <span>Backend API</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Node.js and Express.js REST API with JWT role-based security headers, input validation, and asynchronous ticket allocation handling.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>Database Engine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              MongoDB with Mongoose schemas for Students, Wardens, Rooms, Attendance, Leaves, Complaints, Visitors, Fees, Notices, and Rules.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
