import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2, Clock } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/30">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Contact Hostel Administration
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Have queries regarding room booking tickets, fee receipts, or warden assistance? Send us a direct message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Hostel Address</h4>
                <p className="text-xs text-slate-300">University Green Campus, Innovation Way, CA 90210</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Emergency Helplines</h4>
                <p className="text-xs text-slate-300">+1 (800) 555-HOSTEL • Ext: 104 (Block A Warden)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Official Support Email</h4>
                <p className="text-xs text-slate-300">support@smarthostel.edu</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Warden Helpdesk Hours</h4>
                <p className="text-xs text-slate-300">Mon - Sat: 08:00 AM - 08:00 PM</p>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed Card */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 block px-2">Campus Location Map</span>
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
              <iframe
                title="Hostel Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Send Admin Inquiry</h3>
              <p className="text-xs text-slate-400">Fill out the form below to reach out directly to Chief Warden & Admin office.</p>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been routed to the Warden Helpdesk.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@student.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room Allocation Inquiry / Fee Receipt"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Message</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Describe your inquiry in detail..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
