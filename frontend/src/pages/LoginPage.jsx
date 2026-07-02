import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the session token (you might want to use a state management solution later)
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      
      alert(`Logged in successfully as ${email}!`);
      navigate('/dashboard');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Left Panel: Glassmorphic App Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-800">
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo / Header */}
        <div className="flex items-center space-x-3 z-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
            <FiFeather className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QuillSync</span>
        </div>

        {/* Dashboard Mockup card */}
        <div className="my-auto z-10 max-w-lg mx-auto w-full">
          <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Top window headers */}
            <div className="flex items-center space-x-1.5 pb-4 border-b border-slate-800/80 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
            </div>

            {/* Small Mock Editor Layout */}
            <div className="space-y-4">
              {/* Fake doc line 1 */}
              <div className="h-6 w-1/3 bg-slate-800 rounded-md"></div>
              {/* Fake doc line 2 */}
              <div className="h-4 w-3/4 bg-slate-800/60 rounded-md"></div>
              {/* Fake block columns */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900 border border-slate-800/60 p-3 rounded-lg flex flex-col space-y-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/40"></div>
                  <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                  <div className="h-2 w-1/2 bg-slate-800/60 rounded"></div>
                </div>
                <div className="bg-slate-900 border border-slate-800/60 p-3 rounded-lg flex flex-col space-y-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/40"></div>
                  <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                  <div className="h-2 w-1/2 bg-slate-800/60 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Sync Your Team's Knowledge</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
              The all-in-one workspace for documentation, wikis, and real-time collaboration. Build something great together.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 z-10">
          © 2026 QuillSync Inc.
        </div>
      </div>

      {/* Right Panel: Login Form */}
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
            <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
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
                  placeholder="name@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                />
                <span>Remember Me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset link sent (simulated)."); }} className="text-indigo-400 hover:text-indigo-300 font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-600/50 text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              {!loading && <FiArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Social Logins */}
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="absolute bg-slate-950 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                OR CONTINUE WITH
              </span>
            </div>

            <button
              type="button"
              onClick={() => alert("Google Login initiated (simulated).")}
              className="w-full bg-slate-900 hover:bg-slate-800/80 border border-slate-850 py-3 rounded-lg text-sm text-slate-200 hover:text-white transition-all font-semibold flex items-center justify-center space-x-3"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Redirect to Register */}
          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
