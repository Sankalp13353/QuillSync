import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFeather, FiGrid, FiLayers, FiSearch, FiBell, FiStar, 
  FiClock, FiHash, FiUser, FiSettings, FiZap, FiFileText, 
  FiUsers, FiCheckCircle, FiMessageSquare, FiMoreHorizontal, 
  FiPlus 
} from 'react-icons/fi';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Sidebar - Hidden on mobile, fixed width on desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between sticky top-0 h-screen">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/60 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 mr-3">
              <FiFeather className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">QuillSync</span>
          </div>

          <div className="py-6 px-4 space-y-8">
            {/* Main Menu */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Main Menu</span>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg font-medium transition-colors">
                <FiGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
                <FiLayers className="w-4 h-4" />
                <span>Workspaces</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
                <FiSearch className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
                <FiBell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
            </div>

            {/* Workspace Links */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Workspace</span>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
                <FiStar className="w-4 h-4" />
                <span>Favorites</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
                <FiClock className="w-4 h-4" />
                <span>Recent</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
                <FiHash className="w-4 h-4" />
                <span>Tags</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
            <FiUser className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg font-medium transition-colors">
            <FiSettings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          <div className="mt-4 bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-start">
            <div className="flex items-center space-x-2 text-indigo-400 mb-1">
              <FiZap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pro Plan</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Unlock advanced collaboration and unlimited storage.</p>
            <button className="w-full bg-slate-950 hover:bg-black border border-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-950">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <FiSearch className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="Search anything... (Cmd + K)" 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 ml-4">
            <div className="flex items-center space-x-4 text-slate-400">
              <button className="hover:text-slate-200 transition-colors relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border border-slate-950 rounded-full"></span>
              </button>
              <button className="hover:text-slate-200 transition-colors">
                <FiMessageSquare className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-slate-800"></div>
            
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-white">Alex Rivers</span>
                <span className="text-[10px] text-slate-400">Design Director</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center overflow-hidden relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Productivity Dashboard
              </span>
              <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back, Alex</h1>
              <p className="text-slate-400">You have <strong className="text-white">4 active projects</strong> and 12 pending notifications today.</p>
            </div>
            <button className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-white/5">
              <FiPlus className="w-4 h-4" />
              <span>Create Workspace</span>
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Card 1 */}
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700/50">
                  <FiFileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md">+12%</span>
              </div>
              <span className="text-sm text-slate-400 font-medium mb-1">Total Documents</span>
              <span className="text-2xl font-bold text-white">1,284</span>
            </div>
            
            {/* Card 2 */}
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700/50">
                  <FiZap className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md">+5.4%</span>
              </div>
              <span className="text-sm text-slate-400 font-medium mb-1">Team Velocity</span>
              <span className="text-2xl font-bold text-white">84.2%</span>
            </div>
            
            {/* Card 3 */}
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700/50">
                  <FiUsers className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md">+8.2%</span>
              </div>
              <span className="text-sm text-slate-400 font-medium mb-1">Weekly Active</span>
              <span className="text-2xl font-bold text-white">482</span>
            </div>
            
            {/* Card 4 */}
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700/50">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-md">-2.1%</span>
              </div>
              <span className="text-sm text-slate-400 font-medium mb-1">Pending Tasks</span>
              <span className="text-2xl font-bold text-white">24</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Workspaces & Documents) */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Recent Workspaces */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-2">
                    <FiGrid className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-bold text-white">Recent Workspaces</h2>
                  </div>
                  <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">View All</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Workspace 1 */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-indigo-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">P</div>
                      <div>
                        <h3 className="text-white font-semibold mb-0.5 group-hover:text-indigo-400 transition-colors">Product Design</h3>
                        <p className="text-xs text-slate-500 flex items-center">
                          <FiUsers className="w-3 h-3 mr-1" /> 12 members <span className="mx-2">•</span> Active 2m ago
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-white"><FiMoreHorizontal className="w-5 h-5" /></button>
                  </div>
                  
                  {/* Workspace 2 */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-emerald-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">M</div>
                      <div>
                        <h3 className="text-white font-semibold mb-0.5 group-hover:text-emerald-400 transition-colors">Marketing Hub</h3>
                        <p className="text-xs text-slate-500 flex items-center">
                          <FiUsers className="w-3 h-3 mr-1" /> 8 members <span className="mx-2">•</span> Active 45m ago
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-white"><FiMoreHorizontal className="w-5 h-5" /></button>
                  </div>
                  
                  {/* Workspace 3 */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-lg border border-slate-700">E</div>
                      <div>
                        <h3 className="text-white font-semibold mb-0.5 group-hover:text-blue-400 transition-colors">Engineering</h3>
                        <p className="text-xs text-slate-500 flex items-center">
                          <FiUsers className="w-3 h-3 mr-1" /> 24 members <span className="mx-2">•</span> Active 1h ago
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-white"><FiMoreHorizontal className="w-5 h-5" /></button>
                  </div>
                  
                  {/* Workspace 4 */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-rose-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/30">C</div>
                      <div>
                        <h3 className="text-white font-semibold mb-0.5 group-hover:text-rose-400 transition-colors">Client Portal</h3>
                        <p className="text-xs text-slate-500 flex items-center">
                          <FiUsers className="w-3 h-3 mr-1" /> 4 members <span className="mx-2">•</span> Active 3h ago
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-white"><FiMoreHorizontal className="w-5 h-5" /></button>
                  </div>
                </div>
              </section>

              {/* Recent Documents */}
              <section>
                <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center space-x-2">
                    <FiFileText className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-bold text-white">Recent Documents</h2>
                  </div>
                  <button className="text-xs font-semibold text-slate-400 hover:text-white border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-lg transition-colors">
                    Filter
                  </button>
                </div>
                
                <div className="space-y-1">
                  {/* Doc 1 */}
                  <div className="flex items-center justify-between py-3 px-2 hover:bg-slate-900/50 rounded-lg cursor-pointer transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Brand Guidelines 2024</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Product Design <span className="mx-1">•</span> Updated 10m ago</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="" />
                      <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="" />
                    </div>
                  </div>
                  
                  {/* Doc 2 */}
                  <div className="flex items-center justify-between py-3 px-2 hover:bg-slate-900/50 rounded-lg cursor-pointer transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Q3 Strategic Roadmap</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Management <span className="mx-1">•</span> Updated 2h ago</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="" />
                    </div>
                  </div>
                  
                  {/* Doc 3 */}
                  <div className="flex items-center justify-between py-3 px-2 hover:bg-slate-900/50 rounded-lg cursor-pointer transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Technical Debt Review</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Engineering <span className="mx-1">•</span> Updated 4h ago</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" alt="" />
                    </div>
                  </div>
                  
                  {/* Doc 4 */}
                  <div className="flex items-center justify-between py-3 px-2 hover:bg-slate-900/50 rounded-lg cursor-pointer transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Customer Interview #14</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Product Design <span className="mx-1">•</span> Updated Yesterday</p>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="" />
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column (Activity Feed) */}
            <div className="space-y-8 flex flex-col h-full">
              
              <section className="flex-1">
                <div className="flex items-center space-x-2 mb-6">
                  <FiClock className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-bold text-white">Activity Feed</h2>
                </div>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                  
                  {/* Activity Item 1 */}
                  <div className="relative flex items-start space-x-4">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-950 overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex-1 relative">
                      <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-900 border-l border-t border-slate-800 rotate-45 hidden md:block"></div>
                      <p className="text-sm text-slate-300">
                        <strong className="text-white mr-1">Sarah Chen</strong> 
                        commented on
                        <strong className="text-white ml-1">Homepage Hero Redesign</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">2 minutes ago</p>
                    </div>
                  </div>
                  
                  {/* Activity Item 2 */}
                  <div className="relative flex items-start space-x-4">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-950 overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex-1 relative">
                      <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-900 border-l border-t border-slate-800 rotate-45 hidden md:block"></div>
                      <p className="text-sm text-slate-300">
                        <strong className="text-white mr-1">James Wilson</strong> 
                        updated the document
                        <strong className="text-white ml-1">Q4 Budget Planning</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                  
                  {/* Activity Item 3 */}
                  <div className="relative flex items-start space-x-4">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-950 shrink-0 flex items-center justify-center text-indigo-400">
                      <div className="w-full h-full rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <FiCheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex-1 relative">
                      <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-900 border-l border-t border-slate-800 rotate-45 hidden md:block"></div>
                      <p className="text-sm text-slate-300">
                        <strong className="text-white mr-1">Engineering Team</strong> 
                        reached milestone
                        <strong className="text-white ml-1">API v2.0 Beta Release</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">3 hours ago</p>
                    </div>
                  </div>

                  {/* Activity Item 4 */}
                  <div className="relative flex items-start space-x-4">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-950 overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex-1 relative">
                      <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-900 border-l border-t border-slate-800 rotate-45 hidden md:block"></div>
                      <p className="text-sm text-slate-300">
                        <strong className="text-white mr-1">Marcus Aurelius</strong> 
                        joined the workspace
                        <strong className="text-white ml-1">Strategic Growth</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">Yesterday</p>
                    </div>
                  </div>
                  
                </div>
                
                <button className="w-full mt-6 text-sm font-semibold text-slate-400 hover:text-white py-2 transition-colors">
                  Show More Activity
                </button>
              </section>

              {/* Promo Banner */}
              <div className="bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-indigo-500/20 mt-auto">
                {/* Decorative background shapes */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 border-[16px] border-white/10 rounded-full pointer-events-none"></div>
                <div className="absolute -right-20 -bottom-20 w-48 h-48 border-[16px] border-white/10 rounded-full pointer-events-none"></div>
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Invite your team</h3>
                <p className="text-indigo-100 text-sm mb-5 relative z-10">
                  Collaborate faster and sync all your documents in one place.
                </p>
                <button className="bg-white text-indigo-600 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors relative z-10">
                  Send Invites
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
