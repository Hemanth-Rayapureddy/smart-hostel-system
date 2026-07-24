import React, { useState } from 'react';
import { 
  UserPlus, 
  Ticket, 
  UserCheck, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  DollarSign, 
  Bell, 
  LayoutDashboard, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Features({ setActivePage }) {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const featureList = [
    {
      id: "reg",
      title: "Student Registration",
      icon: UserPlus,
      color: "text-blue-400",
      desc: "Complete digital onboarding for student residents with course details, roll number, guardian contacts, and profile photo upload.",
      highlights: ["Role-based user profile creation", "Emergency contact storage", "Course & semester association"]
    },
    {
      id: "room",
      title: "Ticket-Booking Room Allocation",
      icon: Ticket,
      color: "text-cyan-400",
      desc: "Interactive movie/flight style seat matrix layout! Pick floors, inspect AC/Non-AC amenities, and select available Bed A/B/C slots with instant ticket confirmation.",
      highlights: ["Visual floor bed map grid", "Live occupied vs vacant color indicators", "Semester room price breakdown"]
    },
    {
      id: "att",
      title: "Attendance Tracking (Warden Charge)",
      icon: UserCheck,
      color: "text-emerald-400",
      desc: "Supervised by Hostel Wardens. Daily roll call with quick Present/Absent/On Leave toggles, batch action buttons, and downloadable CSV/PDF reports.",
      highlights: ["Warden block filtering", "Automated percentage calculation", "Export daily attendance sheets"]
    },
    {
      id: "leave",
      title: "Leave Request Management",
      icon: Calendar,
      color: "text-amber-400",
      desc: "Paperless leave applications with start/end date pickers, travel destination reason, and instant Warden approve/reject action queue.",
      highlights: ["Real-time application status", "Destination logging", "Warden digital sign-off"]
    },
    {
      id: "comp",
      title: "Complaint Management",
      icon: MessageSquare,
      color: "text-rose-400",
      desc: "Raise issues under Maintenance, Plumbing, IT WiFi, or Electrical categories. Track priority levels and resolution notes from maintenance teams.",
      highlights: ["Category tagging & priority flags", "Maintenance notes feed", "Status updates (Pending, In Progress, Resolved)"]
    },
    {
      id: "vis",
      title: "Visitor Management",
      icon: ShieldCheck,
      color: "text-purple-400",
      desc: "Log guest entries, visitor contact details, relation to student, visit time slot, and mandatory Warden security approval.",
      highlights: ["Pre-visit request form", "Curfew time slot verification", "Complete visitor log audit history"]
    },
    {
      id: "fee",
      title: "Hostel Fee Management",
      icon: DollarSign,
      color: "text-teal-400",
      desc: "Transparent breakdown of room rent, mess charges, and utility deposits. Online fee payment simulation with instant transaction receipt generation.",
      highlights: ["Itemized semestral breakdown", "Due date alerts & status badges", "Simulated payment gateway"]
    },
    {
      id: "not",
      title: "Notice Board & Announcements",
      icon: Bell,
      color: "text-indigo-400",
      desc: "Central hub for campus circulars, curfew reminders, maintenance schedules, and event announcements posted by Wardens and Admins.",
      highlights: ["Category filtering (Announcements, Circulars, Events)", "Pinned priority notices", "Search announcements"]
    },
    {
      id: "warden",
      title: "Warden Dashboard",
      icon: LayoutDashboard,
      color: "text-orange-400",
      desc: "Dedicated command center for Wardens to oversee attendance marking, leave approval queue, complaint resolution, and resident block roster.",
      highlights: ["Quick metrics overview", "Leave & visitor approval desks", "Attendance marking launcher"]
    },
    {
      id: "admin",
      title: "Secure Database & Admin Control",
      icon: Lock,
      color: "text-violet-400",
      desc: "Centralized Admin control to manage student records, warden assignments, room capacities, hostel rules, and system analytics.",
      highlights: ["Full CRUD user management", "Hostel policy & rule editor", "PDF & CSV analytics reporting"]
    }
  ];

  const current = featureList[selectedFeature];
  const IconComp = current.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30">
          Module Directory
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Smart Hostel Core Features
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Explore all 10 specialized modules built to digitize hostel operations.
        </p>
      </div>

      {/* Feature Showcase Interactive Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigation Buttons */}
        <div className="lg:col-span-5 space-y-2">
          {featureList.map((f, index) => {
            const FIcon = f.icon;
            const isSelected = selectedFeature === index;

            return (
              <button
                key={f.id}
                onClick={() => setSelectedFeature(index)}
                className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                  isSelected 
                    ? 'bg-slate-900 border-blue-500/80 shadow-lg shadow-blue-500/10 text-white' 
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FIcon className={`w-5 h-5 ${f.color}`} />
                  <span className="text-xs font-bold">{f.title}</span>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'opacity-0'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Feature Deep-Dive Card */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 space-y-6 sticky top-28">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <IconComp className={`w-8 h-8 ${current.color}`} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">{current.title}</h3>
                <span className="text-xs text-slate-400">Smart Hostel Module #{selectedFeature + 1}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {current.desc}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Capabilities & Workflows:</h4>
              <ul className="space-y-2">
                {current.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 text-xs text-slate-200 font-semibold bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePage('student-dashboard')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
              >
                <span>Launch Demo View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
