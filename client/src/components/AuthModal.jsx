import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialRole = 'Student' }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccessToast, setLoginSuccessToast] = useState(null);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('alex.j@student.edu');
  const [loginPassword, setLoginPassword] = useState('student123');

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'B.Tech Computer Science',
    rollNo: '',
    guardianName: '',
    guardianPhone: '',
    password: '',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'
  });

  if (!isOpen) return null;

  // Quick fill demo credentials
  const handleQuickDemo = (role) => {
    setSelectedRole(role);
    setAuthMode('login');
    if (role === 'Student') {
      setLoginEmail('alex.j@student.edu');
      setLoginPassword('student123');
    } else if (role === 'Warden') {
      setLoginEmail('warden@hostel.edu');
      setLoginPassword('warden123');
    } else {
      setLoginEmail('admin@hostel.edu');
      setLoginPassword('admin123');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, role: selectedRole })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('smart_hostel_jwt', data.token);
      }
    })
    .catch(() => {});

    setLoginSuccessToast(`Authenticated as ${selectedRole}! Redirecting to ${selectedRole} Portal...`);
    
    setTimeout(() => {
      onLoginSuccess(selectedRole, loginEmail);
      setLoginSuccessToast(null);
      onClose();
    }, 1200);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoginSuccessToast(`Account created successfully for ${regForm.name || 'New Resident'} as ${selectedRole}!`);

    setTimeout(() => {
      onLoginSuccess(selectedRole, regForm.email, regForm);
      setLoginSuccessToast(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 lg:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Secure Role-Based Portal Access</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {authMode === 'login' ? 'Sign In to SmartHostel' : 'Create New Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {authMode === 'login' ? 'Select your role and enter credentials to access your dashboard' : 'Register your details to obtain hostel room allocation & portal access'}
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
            ⚡ Quick Demo 1-Click Credentials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('Student')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                selectedRole === 'Student' && authMode === 'login'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Warden')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                selectedRole === 'Warden' && authMode === 'login'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Warden</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Admin')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                selectedRole === 'Admin' && authMode === 'login'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/30'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Mode Switch Tabs (Login vs Register) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              authMode === 'login' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              authMode === 'register' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Student / Staff
          </button>
        </div>

        {/* Toast feedback */}
        {loginSuccessToast && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{loginSuccessToast}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Email / Roll No</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@student.edu or admin@hostel.edu"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0" />
                <span>Remember Session</span>
              </label>
              <button type="button" onClick={() => alert("Password reset link sent to registered email!")} className="text-cyan-400 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Sign In as {selectedRole}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="alex@student.edu"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+1 (555) 018-7733"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Course / Dept</label>
                <input
                  type="text"
                  required
                  value={regForm.course}
                  onChange={(e) => setRegForm({ ...regForm, course: e.target.value })}
                  placeholder="B.Tech CS 3rd Year"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Guardian Name</label>
                <input
                  type="text"
                  value={regForm.guardianName}
                  onChange={(e) => setRegForm({ ...regForm, guardianName: e.target.value })}
                  placeholder="Richard Johnson"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Registration</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
