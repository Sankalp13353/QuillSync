import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFeather, FiUsers, FiFileText, FiLayers, FiClock,
  FiCheckCircle, FiPlus, FiArrowRight, FiSettings,
  FiActivity, FiShield, FiSliders, FiEye, FiGrid,
  FiBookOpen, FiCornerDownRight
} from 'react-icons/fi';

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with ${email}!`);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-900/80 bg-slate-950/75 backdrop-blur-xl shadow-lg shadow-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:shadow-indigo-500/30 transition-all duration-300">
              <FiFeather className="w-4.5 h-4.5 text-white group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                QuillSync
              </span>
              <span className="text-[9px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Beta
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-2 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white hover:bg-slate-900/50 px-3 py-1.5 rounded-lg transition-all duration-200">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white hover:bg-slate-900/50 px-3 py-1.5 rounded-lg transition-all duration-200">
              How it Works
            </a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/50 px-3.5 py-2 rounded-lg transition-all duration-200">
              Login
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-98 rounded-lg transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <span>DESIGNED FOR METICULOUS TEAMS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Collaborate. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Organize.</span> <br />
              Preserve Knowledge.
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
              Build documents, collaborate with your team in real-time, organize knowledge, and store critical important information. The modern workspace for high-performing teams.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5"
              >
                Get Started
                <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all hover:-translate-y-0.5"
              >
                Learn More
              </a>
            </div>

            <div className="pt-6 flex flex-col space-y-3 items-center lg:items-start">
              <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">TRUSTED BY INNOVATIVE TEAMS</span>
              <div className="flex items-center space-x-6 grayscale opacity-45 hover:opacity-75 transition-opacity">
                {/* Tech logo mockups */}
                <div className="flex items-center space-x-1 font-bold text-slate-400 text-sm">
                  <FiGrid className="w-4 h-4 text-indigo-400" />
                  <span>Stripe</span>
                </div>
                <div className="flex items-center space-x-1 font-bold text-slate-400 text-sm">
                  <FiShield className="w-4 h-4 text-indigo-400" />
                  <span>Vercel</span>
                </div>
                <div className="flex items-center space-x-1 font-bold text-slate-400 text-sm">
                  <FiActivity className="w-4 h-4 text-indigo-400" />
                  <span>Linear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right - Glassmorphic Workspace Preview */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950/40 p-1.5 shadow-2xl shadow-slate-950/80 overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center space-x-2 px-4 py-2 border-b border-slate-800 bg-slate-950/60">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-slate-500 font-mono ml-4">QuillSync - Product Roadmap</span>
              </div>

              <div className="flex min-h-[380px] bg-slate-950/70">
                {/* Workspace Sidebar */}
                <aside className="w-44 border-r border-slate-800/80 p-3 hidden sm:flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 px-2 py-1 bg-slate-900 rounded-md border border-slate-800">
                    <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">Q</div>
                    <span className="text-xs font-semibold text-slate-200 truncate">QuillSync Corp</span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-2 tracking-wider">Favorites</span>
                    <a className="flex items-center space-x-2 px-2 py-1 text-xs text-indigo-400 bg-slate-900/60 rounded font-medium">
                      <FiFileText className="w-3.5 h-3.5" />
                      <span className="truncate">Sprint Roadmap</span>
                    </a>
                    <a className="flex items-center space-x-2 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 rounded transition-colors">
                      <FiFileText className="w-3.5 h-3.5" />
                      <span className="truncate">Design System</span>
                    </a>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-2 tracking-wider">Workspaces</span>
                    <a className="flex items-center space-x-2 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded">
                      <FiLayers className="w-3.5 h-3.5 text-blue-400" />
                      <span className="truncate">Engineering</span>
                    </a>
                    <a className="flex items-center space-x-2 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded">
                      <FiLayers className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">Product</span>
                    </a>
                    <a className="flex items-center space-x-2 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded">
                      <FiLayers className="w-3.5 h-3.5 text-pink-400" />
                      <span className="truncate">Design Team</span>
                    </a>
                  </div>
                </aside>

                {/* Workspace Main Content */}
                <main className="flex-1 p-4 sm:p-5 flex flex-col space-y-4">
                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Workspaces</span>
                      <span className="text-xs text-slate-600">/</span>
                      <span className="text-xs font-semibold text-slate-200">Sprint Product Roadmap</span>
                    </div>
                    {/* Collaborative Users Presence */}
                    <div className="flex items-center -space-x-1.5">
                      <span className="w-5 h-5 rounded-full border border-slate-950 bg-indigo-500 text-[8px] font-bold text-white flex items-center justify-center">JD</span>
                      <span className="w-5 h-5 rounded-full border border-slate-950 bg-emerald-500 text-[8px] font-bold text-white flex items-center justify-center">AS</span>
                      <span className="w-5 h-5 rounded-full border border-slate-950 bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center">MK</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 border border-slate-950 ml-1 pulse-active"></div>
                    </div>
                  </div>

                  {/* Document Title / Description */}
                  <div className="flex flex-col space-y-1">
                    <h2 className="text-lg font-bold text-white">Sprint Product Roadmap</h2>
                    <p className="text-xs text-slate-500">Track task updates, assign owners, and manage weekly documentation progress.</p>
                  </div>

                  {/* Kanban style preview or Rich Layout */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900 flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">TO DO</span>
                        <span className="bg-slate-900 text-slate-400 px-1 py-0.5 rounded text-[8px] font-mono">2</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80 text-[10px] text-slate-300">
                        <p className="font-semibold text-white">Auth Schema Doc</p>
                        <p className="text-slate-500 mt-1">Review validation flow</p>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80 text-[10px] text-slate-300">
                        <p className="font-semibold text-white">Database Migration</p>
                        <p className="text-slate-500 mt-1">Map relational schema</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900 flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400">IN PROGRESS</span>
                        <span className="bg-indigo-950/40 text-indigo-400 px-1 py-0.5 rounded text-[8px] font-mono">2</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-indigo-900/40 text-[10px] text-slate-300 relative">
                        <p className="font-semibold text-white">API Integration Specs</p>
                        <p className="text-slate-500 mt-1">Documenting Axios layer</p>
                        {/* Cursor indicator */}
                        <div className="absolute right-2 bottom-2 flex items-center space-x-0.5 bg-indigo-500 text-[7px] text-white px-1 py-0.5 rounded">
                          <span>Alex editing...</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80 text-[10px] text-slate-300">
                        <p className="font-semibold text-white">UI Wireframe Mockup</p>
                        <p className="text-slate-500 mt-1">Syncing Visily screens</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900 flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400">DONE</span>
                        <span className="bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded text-[8px] font-mono">1</span>
                      </div>
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-900 text-[10px] text-slate-500 line-through">
                        <p className="font-semibold">Setup Vite Template</p>
                        <p className="mt-1">Boilerplate initialized</p>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Float decorative tag */}
            <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 p-3 rounded-xl hidden sm:flex items-center space-x-3 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FiActivity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live Sync Active</p>
                <p className="text-[10px] text-slate-400">250ms Global Latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-y border-slate-800 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">FEATURES FOR PROS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Everything you need to work better</h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Powerful enough for enterprises, simple enough for solo founders. Experience documentation at the speed of thought.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                <FiFileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rich Document Editor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Collaborative editor with headings, tables, markdown support, nested bullet lists, and special blocks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                <FiUsers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Collaboration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simultaneous multi-user editing, visual cursor tracking, inline comments, and live presence indicators.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Version History</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track historical snapshots, inspect changes with visual diffs, and restore documents to any state instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                <FiLayers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Team Workspaces</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create structured, isolated team spaces (Engineering, Product, Marketing) with unique workspace-level controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">WORKFLOW</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How QuillSync works</h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Go from clean slate to shared team knowledge in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Workflow Step 1 */}
          <div className="flex flex-col space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-500/30">01</div>
            <h3 className="text-lg font-bold text-white">Create Workspace</h3>
            <p className="text-sm text-slate-400">
              Set up dedicated, isolated spaces for specific client deliverables, teams, or internal company wikis.
            </p>
          </div>

          {/* Workflow Step 2 */}
          <div className="flex flex-col space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-500/30">02</div>
            <h3 className="text-lg font-bold text-white">Invite Team</h3>
            <p className="text-sm text-slate-400">
              Add collaborators easily via secret shareable links or secure email invites, with fine-grained ACL roles.
            </p>
          </div>

          {/* Workflow Step 3 */}
          <div className="flex flex-col space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-500/30">03</div>
            <h3 className="text-lg font-bold text-white">Create Documents</h3>
            <p className="text-sm text-slate-400">
              Write release roadmaps, build tech architecture specifications, create meeting logs, and embed content blocks.
            </p>
          </div>

          {/* Workflow Step 4 */}
          <div className="flex flex-col space-y-3 relative">
            <div className="text-3xl font-extrabold text-indigo-500/30">04</div>
            <h3 className="text-lg font-bold text-white">Collaborate Together</h3>
            <p className="text-sm text-slate-400">
              Co-author at identical speeds, comment inline on selected paragraphs, resolve threads, and sync knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-indigo-950/40 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">10K+</div>
            <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Active Teams</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</div>
            <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Uptime SLA</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">250ms</div>
            <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Collaborative Latency</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">24/7</div>
            <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Dedicated Support</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 border border-indigo-800 p-8 sm:p-12 md:p-16 rounded-3xl text-center relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Ready to organize your team's knowledge?
          </h2>
          <p className="text-indigo-200 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of teams using QuillSync to collaborate productively together. Start writing and syncing documents instantly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-indigo-900 bg-white hover:bg-slate-100 rounded-lg transition-all shadow-lg hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="text-white font-semibold hover:underline flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>Login to Workspace</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo & Desc & Newsletter */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                <FiFeather className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">QuillSync</span>
            </div>
            <p className="text-slate-500 text-xs">
              Collaborative knowledge management editing and knowledge management for the next generation of product and dev teams.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-xs pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-l-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg px-3 py-1.5 text-xs font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-2 flex flex-col space-y-3">
            <span className="text-white font-semibold text-xs tracking-wider uppercase">PRODUCT</span>
            <a href="#features" className="hover:text-white transition-colors text-xs">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors text-xs">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors text-xs">Pricing</a>
            <a className="hover:text-white transition-colors text-xs">Changelog</a>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-2 flex flex-col space-y-3">
            <span className="text-white font-semibold text-xs tracking-wider uppercase">COMPANY</span>
            <a className="hover:text-white transition-colors text-xs">About Us</a>
            <a className="hover:text-white transition-colors text-xs">Careers</a>
            <a className="hover:text-white transition-colors text-xs">Privacy Policy</a>
            <a className="hover:text-white transition-colors text-xs">Terms of Service</a>
          </div>

          {/* Links 3 */}
          <div className="md:col-span-4 flex flex-col space-y-3">
            <span className="text-white font-semibold text-xs tracking-wider uppercase">SUBSCRIBE TO NEWSLETTER</span>
            <p className="text-slate-500 text-xs leading-relaxed">
              Get the latest updates, tips, and articles delivered directly to your inbox every week.
            </p>
            <span className="text-xs text-slate-600">© 2026 QuillSync Inc. All rights reserved. Built for collaborative excellence.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
