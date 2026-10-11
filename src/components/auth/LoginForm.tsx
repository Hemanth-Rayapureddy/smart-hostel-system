import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Shield,
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  HeartHandshake,
  Activity,
  Layers,
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { loginWithCredentials, registerStudent, registerWarden } = useAuth();

  // Selected portal view: null = Portal Chooser, 'student' = Student Auth, 'warden' = Warden Auth
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Shared state: empty by default - NO default emails or passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student registration specific fields (all empty by default)
  const [fullName, setFullName] = useState('');
  const [studentIdNo, setStudentIdNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Eng');
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [hostelBlock, setHostelBlock] = useState('Block A');
  const [roomNumber, setRoomNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Feedback state
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setStudentIdNo('');
    setRoomNumber('');
    setPhone('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setErrorMsg('');
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('login');
    resetFormFields();
  };

  const handleBackToChooser = () => {
    setSelectedRole(null);
    setAuthMode('login');
    resetFormFields();
  };

  /*
   * Handle Submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedRole) return;

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const result = await loginWithCredentials(email.trim(), password, selectedRole);
        if (!result.success) {
          setErrorMsg(result.error || 'Failed to sign in. Please try again.');
        }
      } else {
        // Registration Mode
        if (selectedRole === 'student') {
          if (!fullName.trim() || !studentIdNo.trim() || !roomNumber.trim()) {
            setErrorMsg('Please fill in your name, student ID, and room number.');
            setIsLoading(false);
            return;
          }

          const res = await registerStudent({
            fullName,
            studentIdNo,
            department,
            yearOfStudy,
            hostelBlock,
            roomNumber,
            phone,
            emergencyContactName,
            emergencyContactPhone,
            email,
            password,
          });

          if (!res.success) {
            setErrorMsg(res.error || 'Failed to register student account.');
          }
        } else {
          // Warden Registration
          if (!fullName.trim()) {
            setErrorMsg('Please enter your full name.');
            setIsLoading(false);
            return;
          }

          const res = await registerWarden({
            fullName,
            phone,
            email,
            password,
            passcode: 'WARDEN2026',
          });

          if (!res.success) {
            setErrorMsg(res.error || 'Failed to register warden account.');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ============================================================
   * 1. PORTAL SELECTION SCREEN (FIRST LANDING VIEW)
   * ============================================================
   */
  if (selectedRole === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500 selection:text-white">
        {/* Top Navbar */}
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">SmartHostel</span>
              <span className="text-[10px] text-blue-300 font-medium">Digital Campus Housing System</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded-full flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live System Online</span>
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-5xl w-full mx-auto my-auto py-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart Student Hostel Management Platform</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Welcome to the <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Smart Hostel Portal
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Please choose your role to access your personalized services, submit requests, or manage hostel facilities.
            </p>
          </div>

          {/* TWO PRIMARY PORTAL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4 text-left">
            {/* STUDENT PORTAL CARD */}
            <div
              onClick={() => handleSelectRole('student')}
              className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold rounded-full">
                  Hostel Resident
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                    Student Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    For resident students and hostel boarders
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/10 font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>View Room allocation & roommates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Apply Out-Pass & Leave requests</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Report maintenance (Photo & Anonymous)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>One-tap Emergency Distress SOS button</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group-hover:shadow-blue-500/30"
              >
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* WARDEN / ADMIN PORTAL CARD */}
            <div
              onClick={() => handleSelectRole('warden')}
              className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-indigo-500/50 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold rounded-full">
                  Hostel Management
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                    Warden & Admin Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    For chief wardens, assistant wardens & administrators
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/10 font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Hostel Health Score (0–100) analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Hostel Problem Heatmap by floor & block</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Approve leave requests & visitor logs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Emergency Control & Broadcast announcements</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group-hover:shadow-indigo-500/30"
              >
                <span>Continue as Warden / Admin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Value Props Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-slate-400 text-[11px] font-semibold">
            <div className="flex items-center justify-center space-x-1.5 p-2 bg-white/5 rounded-xl border border-white/5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Strict Security & RLS</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 p-2 bg-white/5 rounded-xl border border-white/5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mobile-First UI</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 p-2 bg-white/5 rounded-xl border border-white/5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hostel Health Score</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 p-2 bg-white/5 rounded-xl border border-white/5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>24/7 Safety SOS</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl w-full mx-auto py-3 border-t border-white/10 text-center text-[11px] text-slate-500">
          Smart Student Hostel Management System • Built with React, TypeScript & Supabase
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * 2. ROLE-SPECIFIC LOGIN & REGISTRATION FORMS
   * ============================================================
   */
  const isStudent = selectedRole === 'student';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header with Back button */}
        <div
          className={`p-6 sm:p-8 text-white relative ${
            isStudent
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700'
              : 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800'
          }`}
        >
          <button
            type="button"
            onClick={handleBackToChooser}
            className="flex items-center space-x-1.5 text-white/80 hover:text-white text-xs font-bold mb-4 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Role Selection</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
              {isStudent ? <GraduationCap className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {isStudent ? 'Student Resident Portal' : 'Warden & Admin Portal'}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                {authMode === 'login'
                  ? `Enter your email and password to access the ${isStudent ? 'student dashboard' : 'warden control room'}`
                  : `Register your new ${isStudent ? 'resident student' : 'warden'} profile`}
              </p>
            </div>
          </div>

          {/* Toggle Tabs: Sign In / Register */}
          <div className="mt-6 flex bg-black/20 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'login' ? 'bg-white text-gray-900 shadow-md' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'register' ? 'bg-white text-gray-900 shadow-md' : 'text-white/80 hover:text-white'
              }`}
            >
              {isStudent ? 'Register as Student' : 'Warden Registration'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-start space-x-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* =================================================
                REGISTRATION EXTRA FIELDS
            ================================================== */}
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {isStudent && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Student Roll / ID No *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CS2025-042"
                          value={studentIdNo}
                          onChange={(e) => setStudentIdNo(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Year of Study *</label>
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value={1}>1st Year (Freshman)</option>
                          <option value={2}>2nd Year (Sophomore)</option>
                          <option value={3}>3rd Year (Junior)</option>
                          <option value={4}>4th Year (Senior)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Academic Department *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Computer Science & Eng"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Hostel Block *</label>
                        <select
                          value={hostelBlock}
                          onChange={(e) => setHostelBlock(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Block A">Block A</option>
                          <option value="Block B">Block B</option>
                          <option value="Block C">Block C</option>
                          <option value="Block D">Block D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Room Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 204"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Emergency Contact Person</label>
                        <input
                          type="text"
                          placeholder="Parent / Guardian"
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Emergency Contact Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 00000"
                          value={emergencyContactPhone}
                          onChange={(e) => setEmergencyContactPhone(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* =================================================
                EMAIL FIELD (NO DEFAULT EMAILS)
            ================================================== */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {isStudent ? 'Student Email Address *' : 'Warden Email Address *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD FIELD (NO DEFAULT VALUE)
            ================================================== */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* =================================================
                SUBMIT BUTTON
            ================================================== */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isStudent
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'login'
                      ? `Sign In as ${isStudent ? 'Student' : 'Warden'}`
                      : `Create ${isStudent ? 'Student' : 'Warden'} Account`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};