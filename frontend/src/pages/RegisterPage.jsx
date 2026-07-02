import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Account created successfully for ${fullName}! Welcome to QuillSync!`);
      navigate('/login');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Left Panel: High Contrast Graphic & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-800">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo / Header */}
        <div className="flex items-center space-x-3 z-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
            <FiFeather className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QuillSync</span>
        </div>

        {/* Content Content Container */}
        <div className="my-auto z-10 max-w-lg mx-auto space-y-8">
          {/* Main Visual Image/Card representing Collaboration */}
          <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-800/80 mb-4">
              <span className="text-xs text-indigo-400 font-bold tracking-wider">COLLABORATION GRAPH</span>
            </div>
            {/* Visual placeholder representation of diagram */}
            <div className="h-32 flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800 relative">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">JD</div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">AS</div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">MK</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-around opacity-20">
                <div className="border border-dashed border-slate-700 w-1/2 h-1/2 rounded-full"></div>
              </div>
              <div className="absolute bottom-3 text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Live Document Editing Session</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Work together, <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">faster</span> and <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">smarter</span>.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              QuillSync brings your team's documents, spreadsheets, and creative projects into one unified, real-time workspace.
            </p>
          </div>

          {/* Checklist */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <FiCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Real-time multi-user editing</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <FiCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Advanced version control</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <FiCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Bank-grade encryption</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <FiCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">200+ Integrations</span>
            </div>
          </div>

          {/* Avatar counter line */}
          <div className="pt-2 flex items-center space-x-3">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full border border-slate-900 bg-slate-800 text-[9px] flex items-center justify-center font-bold">1</div>
              <div className="w-6 h-6 rounded-full border border-slate-900 bg-slate-700 text-[9px] flex items-center justify-center font-bold">2</div>
              <div className="w-6 h-6 rounded-full border border-slate-900 bg-slate-600 text-[9px] flex items-center justify-center font-bold">3</div>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Join 70,000+ teams already syncing.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 z-10">
          © 2026 QuillSync Inc.
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FiFeather className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">QuillSync</span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="hidden lg:flex items-center space-x-2 mb-4 justify-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <FiFeather className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-slate-400">QuillSync</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Create your account</h1>
            <p className="text-slate-400 text-sm">Get started with your free workspace today.</p>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => alert("Google Sign Up initiated (simulated).")}
              className="w-full bg-slate-900 hover:bg-slate-800/80 border border-slate-850 py-3 rounded-lg text-sm text-slate-200 hover:text-white transition-all font-semibold flex items-center justify-center space-x-3"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="absolute bg-slate-950 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Cooper"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-600/50 text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 flex items-center justify-center space-x-2 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <FiArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Log in
            </Link>
          </div>

          {/* Agreement Notice */}
          <p className="text-[10px] text-slate-500 text-center leading-relaxed max-w-xs mx-auto">
            By clicking "Create Account", you agree to our{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="underline hover:text-slate-400">Terms of Service</a>{' '}
            and{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="underline hover:text-slate-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
