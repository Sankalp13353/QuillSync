import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFeather, FiGrid, FiLayers, FiSearch, FiBell, FiStar,
  FiClock, FiHash, FiUser, FiSettings, FiZap, FiFileText,
  FiUsers, FiCheckCircle, FiMessageSquare, FiMoreHorizontal,
  FiPlus, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar - Hidden on mobile, fixed width on desktop */}
      <aside className="sidebar">
        <div>
          {/* Logo */}
          <div className="sidebar-logo" onClick={() => navigate('/')}>
            <div className="sidebar-logo-icon">
              <FiFeather />
            </div>
            <span className="sidebar-logo-text">QuillSync</span>
          </div>

          <div className="sidebar-body">
            {/* Main Menu */}
            <div className="sidebar-section">
              <span className="sidebar-section-label">Main Menu</span>
              <button className="sidebar-item sidebar-item--active">
                <FiGrid />
                <span>Dashboard</span>
              </button>
              <button className="sidebar-item">
                <FiLayers />
                <span>Workspaces</span>
              </button>
              <button className="sidebar-item">
                <FiSearch />
                <span>Search</span>
              </button>
              <button className="sidebar-item">
                <FiBell />
                <span>Notifications</span>
              </button>
            </div>

            {/* Workspace Links */}
            <div className="sidebar-section">
              <span className="sidebar-section-label">Workspace</span>
              <button className="sidebar-item">
                <FiStar />
                <span>Favorites</span>
              </button>
              <button className="sidebar-item">
                <FiClock />
                <span>Recent</span>
              </button>
              <button className="sidebar-item">
                <FiHash />
                <span>Tags</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sidebar-footer">
          <button className="sidebar-item">
            <FiUser />
            <span>Profile</span>
          </button>
          <button className="sidebar-item">
            <FiSettings />
            <span>Settings</span>
          </button>
          <button onClick={handleSignOut} className="sidebar-item sidebar-item--danger">
            <FiLogOut />
            <span>Sign Out</span>
          </button>

          <div className="upgrade-card">
            <div className="upgrade-card-header">
              <FiZap />
              <span className="upgrade-card-label">Pro Plan</span>
            </div>
            <p className="upgrade-card-text">Unlock advanced collaboration and unlimited storage.</p>
            <button className="upgrade-card-button">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        {/* Header */}
        <header className="header">
          <div className="header-search">
            <div className="header-search-wrap">
              <div className="header-search-icon">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search anything... (Cmd + K)"
                className="header-search-input"
              />
            </div>
          </div>

          <div className="header-right">
            <div className="header-icons">
              <button className="header-icon-button">
                <FiBell />
                <span className="header-icon-badge"></span>
              </button>
              <button className="header-icon-button">
                <FiMessageSquare />
              </button>
            </div>

            <div className="header-divider"></div>

            <div className="header-user">
              <div className="header-user-text">
                <span className="header-user-name">{displayName}</span>
                <span className="header-user-email">{displayEmail}</span>
              </div>
              <div className="header-avatar">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=transparent`} alt="Avatar" className="header-avatar-img" />
                <div className="header-avatar-status"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="content">
          {/* Welcome Section */}
          <div className="welcome">
            <div>
              <span className="welcome-badge">
                Productivity Dashboard
              </span>
              <h1 className="welcome-title">Welcome Back, Alex</h1>
              <p className="welcome-text">You have <strong>4 active projects</strong> and 12 pending notifications today.</p>
            </div>
            <button className="welcome-cta">
              <FiPlus />
              <span>Create Workspace</span>
            </button>
          </div>

          {/* KPI Cards */}
          <div className="kpi-grid">
            {/* Card 1 */}
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon">
                  <FiFileText />
                </div>
                <span className="kpi-change">+12%</span>
              </div>
              <span className="kpi-label">Total Documents</span>
              <span className="kpi-value">1,284</span>
            </div>

            {/* Card 2 */}
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon">
                  <FiZap />
                </div>
                <span className="kpi-change">+5.4%</span>
              </div>
              <span className="kpi-label">Team Velocity</span>
              <span className="kpi-value">84.2%</span>
            </div>

            {/* Card 3 */}
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon">
                  <FiUsers />
                </div>
                <span className="kpi-change">+8.2%</span>
              </div>
              <span className="kpi-label">Weekly Active</span>
              <span className="kpi-value">482</span>
            </div>

            {/* Card 4 */}
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon">
                  <FiCheckCircle />
                </div>
                <span className="kpi-change kpi-change--negative">-2.1%</span>
              </div>
              <span className="kpi-label">Pending Tasks</span>
              <span className="kpi-value">24</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="main-grid">

            {/* Left Column (Workspaces & Documents) */}
            <div className="main-grid-left">

              {/* Recent Workspaces */}
              <section>
                <div className="section-header">
                  <div className="section-header-title">
                    <FiGrid />
                    <h2>Recent Workspaces</h2>
                  </div>
                  <button className="section-link">View All</button>
                </div>

                <div className="workspace-grid">
                  {/* Workspace 1 */}
                  <div className="workspace-card workspace-card--indigo">
                    <div className="workspace-card-left">
                      <div className="workspace-avatar workspace-avatar--indigo">P</div>
                      <div>
                        <h3 className="workspace-name">Product Design</h3>
                        <p className="workspace-meta">
                          <FiUsers /> 12 members <span className="workspace-meta-sep">•</span> Active 2m ago
                        </p>
                      </div>
                    </div>
                    <button className="workspace-menu-button"><FiMoreHorizontal /></button>
                  </div>

                  {/* Workspace 2 */}
                  <div className="workspace-card workspace-card--emerald">
                    <div className="workspace-card-left">
                      <div className="workspace-avatar workspace-avatar--emerald">M</div>
                      <div>
                        <h3 className="workspace-name">Marketing Hub</h3>
                        <p className="workspace-meta">
                          <FiUsers /> 8 members <span className="workspace-meta-sep">•</span> Active 45m ago
                        </p>
                      </div>
                    </div>
                    <button className="workspace-menu-button"><FiMoreHorizontal /></button>
                  </div>

                  {/* Workspace 3 */}
                  <div className="workspace-card workspace-card--blue">
                    <div className="workspace-card-left">
                      <div className="workspace-avatar workspace-avatar--blue">E</div>
                      <div>
                        <h3 className="workspace-name">Engineering</h3>
                        <p className="workspace-meta">
                          <FiUsers /> 24 members <span className="workspace-meta-sep">•</span> Active 1h ago
                        </p>
                      </div>
                    </div>
                    <button className="workspace-menu-button"><FiMoreHorizontal /></button>
                  </div>

                  {/* Workspace 4 */}
                  <div className="workspace-card workspace-card--rose">
                    <div className="workspace-card-left">
                      <div className="workspace-avatar workspace-avatar--rose">C</div>
                      <div>
                        <h3 className="workspace-name">Client Portal</h3>
                        <p className="workspace-meta">
                          <FiUsers /> 4 members <span className="workspace-meta-sep">•</span> Active 3h ago
                        </p>
                      </div>
                    </div>
                    <button className="workspace-menu-button"><FiMoreHorizontal /></button>
                  </div>
                </div>
              </section>

              {/* Recent Documents */}
              <section>
                <div className="section-header section-header--bordered">
                  <div className="section-header-title">
                    <FiFileText />
                    <h2>Recent Documents</h2>
                  </div>
                  <button className="section-filter-button">
                    Filter
                  </button>
                </div>

                <div className="document-list">
                  {/* Doc 1 */}
                  <div className="document-item">
                    <div className="document-item-left">
                      <div className="document-icon">
                        <FiFileText />
                      </div>
                      <div>
                        <h4 className="document-name">Brand Guidelines 2024</h4>
                        <p className="document-meta">Product Design <span className="document-meta-sep">•</span> Updated 10m ago</p>
                      </div>
                    </div>
                    <div className="document-avatars">
                      <img className="document-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="" />
                      <img className="document-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="" />
                    </div>
                  </div>

                  {/* Doc 2 */}
                  <div className="document-item">
                    <div className="document-item-left">
                      <div className="document-icon">
                        <FiFileText />
                      </div>
                      <div>
                        <h4 className="document-name">Q3 Strategic Roadmap</h4>
                        <p className="document-meta">Management <span className="document-meta-sep">•</span> Updated 2h ago</p>
                      </div>
                    </div>
                    <div className="document-avatars">
                      <img className="document-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="" />
                    </div>
                  </div>

                  {/* Doc 3 */}
                  <div className="document-item">
                    <div className="document-item-left">
                      <div className="document-icon">
                        <FiFileText />
                      </div>
                      <div>
                        <h4 className="document-name">Technical Debt Review</h4>
                        <p className="document-meta">Engineering <span className="document-meta-sep">•</span> Updated 4h ago</p>
                      </div>
                    </div>
                    <div className="document-avatars">
                      <img className="document-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" alt="" />
                    </div>
                  </div>

                  {/* Doc 4 */}
                  <div className="document-item">
                    <div className="document-item-left">
                      <div className="document-icon">
                        <FiFileText />
                      </div>
                      <div>
                        <h4 className="document-name">Customer Interview #14</h4>
                        <p className="document-meta">Product Design <span className="document-meta-sep">•</span> Updated Yesterday</p>
                      </div>
                    </div>
                    <div className="document-avatars">
                      <img className="document-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="" />
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column (Activity Feed) */}
            <div className="right-column">

              <section className="activity-section">
                <div className="activity-section-header">
                  <FiClock />
                  <h2>Activity Feed</h2>
                </div>

                <div className="activity-list">

                  {/* Activity Item 1 */}
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="" />
                    </div>
                    <div className="activity-bubble">
                      <div className="activity-bubble-arrow"></div>
                      <p className="activity-text">
                        <strong className="mr">Sarah Chen</strong>
                        commented on
                        <strong className="ml">Homepage Hero Redesign</strong>
                      </p>
                      <p className="activity-time">2 minutes ago</p>
                    </div>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" alt="" />
                    </div>
                    <div className="activity-bubble">
                      <div className="activity-bubble-arrow"></div>
                      <p className="activity-text">
                        <strong className="mr">James Wilson</strong>
                        updated the document
                        <strong className="ml">Q4 Budget Planning</strong>
                      </p>
                      <p className="activity-time">1 hour ago</p>
                    </div>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="activity-item">
                    <div className="activity-avatar activity-avatar--icon">
                      <div className="activity-avatar-icon-inner">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="activity-bubble">
                      <div className="activity-bubble-arrow"></div>
                      <p className="activity-text">
                        <strong className="mr">Engineering Team</strong>
                        reached milestone
                        <strong className="ml">API v2.0 Beta Release</strong>
                      </p>
                      <p className="activity-time">3 hours ago</p>
                    </div>
                  </div>

                  {/* Activity Item 4 */}
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="" />
                    </div>
                    <div className="activity-bubble">
                      <div className="activity-bubble-arrow"></div>
                      <p className="activity-text">
                        <strong className="mr">Marcus Aurelius</strong>
                        joined the workspace
                        <strong className="ml">Strategic Growth</strong>
                      </p>
                      <p className="activity-time">Yesterday</p>
                    </div>
                  </div>

                </div>

                <button className="activity-show-more">
                  Show More Activity
                </button>
              </section>

              {/* Promo Banner */}
              <div className="promo-banner">
                {/* Decorative background shapes */}
                <div className="promo-decoration promo-decoration--1"></div>
                <div className="promo-decoration promo-decoration--2"></div>

                <h3 className="promo-title">Invite your team</h3>
                <p className="promo-text">
                  Collaborate faster and sync all your documents in one place.
                </p>
                <button className="promo-button">
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