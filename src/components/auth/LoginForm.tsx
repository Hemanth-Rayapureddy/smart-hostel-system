import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { DEMO_STUDENTS } from '../../lib/supabase';
import { Shield, User, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { loginAsStudent, loginAsWarden, loginWithCredentials } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email or Student ID');
      return;
    }

    const success = loginWithCredentials(email, role);
    if (!success) {
      setErrorMsg(
        role === 'warden'
          ? 'Invalid Warden credentials. Use warden@hostel.com'
          : 'Student record not found. Try student1@hostel.com or student2@hostel.com'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 text-white text-center relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Smart Hostel Management</h2>
          <p className="text-xs text-blue-100 mt-1">Secure Student & Warden Access Portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'student'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('warden');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'warden'
                ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Warden / Admin</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {role === 'student' ? 'Student Email or ID Number' : 'Warden Email Address'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={role === 'student' ? 'student1@hostel.com or CS2023-042' : 'warden@hostel.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In as {role.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-4 border-t border-gray-100 text-xs space-y-3">
            <p className="font-bold text-gray-700 text-[11px] uppercase tracking-wider text-center">
              ⚡ Instant 1-Click Demo Login
            </p>

            {role === 'student' ? (
              <div className="space-y-2">
                {DEMO_STUDENTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => loginAsStudent(s.id)}
                    className="w-full p-2.5 bg-blue-50/70 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-blue-900">{s.fullName}</div>
                      <div className="text-[10px] text-blue-700">
                        {s.hostelBlock} - Room {s.roomNumber} ({s.department})
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                      Login
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => loginAsWarden()}
                className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-left transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-indigo-900">Dr. K. V. Raman (Chief Warden)</div>
                  <div className="text-[10px] text-indigo-700">warden@hostel.com • Full Access</div>
                </div>
                <span className="text-[10px] bg-indigo-700 text-white font-bold px-2.5 py-1 rounded">
                  Login Warden
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
