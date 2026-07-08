import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFeather, FiUsers, FiFileText, FiLayers, FiClock,
  FiCheckCircle, FiPlus, FiArrowRight, FiSettings,
  FiActivity, FiShield, FiSliders, FiEye, FiGrid,
  FiBookOpen, FiCornerDownRight
} from 'react-icons/fi';
import './LandingPage.css';

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
    <div className="page">
      {/* Navigation */}
      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <FiFeather className="logo-icon-svg" />
            </div>
            <div className="logo-text">
              <span className="logo-title">QuillSync</span>
              <span className="beta-badge">Beta</span>
            </div>
          </div>

          {/* Links */}
          <nav className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How it Works
            </a>
          </nav>

          {/* CTAs */}
          <div className="header-actions">
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Glow Effects */}
        <div className="glow glow-indigo"></div>
        <div className="glow glow-blue"></div>

        <div className="hero-grid">
          {/* Hero Left */}
          <div className="hero-left">
            <div className="hero-badge">
              <span>DESIGNED FOR METICULOUS TEAMS</span>
            </div>

            <h1 className="hero-title">
              Collaborate. <br />
              <span className="hero-title-gradient">Organize.</span> <br />
              Preserve Knowledge.
            </h1>

            <p className="hero-subtitle">
              Build documents, collaborate with your team in real-time, organize knowledge, and store critical important information. The modern workspace for high-performing teams.
            </p>

            <div className="hero-cta-row">
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
                <FiArrowRight className="btn-icon" />
              </Link>
              <a
                href="#features"
                className="btn-secondary"
              >
                Learn More
              </a>
            </div>

            <div className="trusted">
              <span className="trusted-label">TRUSTED BY INNOVATIVE TEAMS</span>
              <div className="trusted-logos">
                {/* Tech logo mockups */}
                <div className="trusted-logo">
                  <FiGrid className="trusted-logo-icon" />
                  <span>Stripe</span>
                </div>
                <div className="trusted-logo">
                  <FiShield className="trusted-logo-icon" />
                  <span>Vercel</span>
                </div>
                <div className="trusted-logo">
                  <FiActivity className="trusted-logo-icon" />
                  <span>Linear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right - Glassmorphic Workspace Preview */}
          <div className="hero-right">
            <div className="mockup">
              {/* Window Controls */}
              <div className="mockup-titlebar">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
                <span className="mockup-filename">QuillSync - Product Roadmap</span>
              </div>

              <div className="mockup-body">
                {/* Workspace Sidebar */}
                <aside className="mockup-sidebar">
                  <div className="sidebar-workspace">
                    <div className="sidebar-workspace-icon">Q</div>
                    <span className="sidebar-workspace-name">QuillSync Corp</span>
                  </div>

                  <div className="sidebar-section">
                    <span className="sidebar-section-label">Favorites</span>
                    <a className="sidebar-link sidebar-link-active">
                      <FiFileText className="sidebar-link-icon" />
                      <span className="sidebar-link-text">Sprint Roadmap</span>
                    </a>
                    <a className="sidebar-link">
                      <FiFileText className="sidebar-link-icon" />
                      <span className="sidebar-link-text">Design System</span>
                    </a>
                  </div>

                  <div className="sidebar-section">
                    <span className="sidebar-section-label">Workspaces</span>
                    <a className="sidebar-link">
                      <FiLayers className="sidebar-link-icon icon-blue" />
                      <span className="sidebar-link-text">Engineering</span>
                    </a>
                    <a className="sidebar-link">
                      <FiLayers className="sidebar-link-icon icon-purple" />
                      <span className="sidebar-link-text">Product</span>
                    </a>
                    <a className="sidebar-link">
                      <FiLayers className="sidebar-link-icon icon-pink" />
                      <span className="sidebar-link-text">Design Team</span>
                    </a>
                  </div>
                </aside>

                {/* Workspace Main Content */}
                <main className="mockup-main">
                  {/* Top Bar inside mockup */}
                  <div className="mockup-topbar">
                    <div className="breadcrumb">
                      <span className="breadcrumb-item">Workspaces</span>
                      <span className="breadcrumb-sep">/</span>
                      <span className="breadcrumb-current">Sprint Product Roadmap</span>
                    </div>
                    {/* Collaborative Users Presence */}
                    <div className="presence">
                      <span className="avatar avatar-indigo">JD</span>
                      <span className="avatar avatar-emerald">AS</span>
                      <span className="avatar avatar-rose">MK</span>
                      <div className="presence-dot"></div>
                    </div>
                  </div>

                  {/* Document Title / Description */}
                  <div className="doc-header">
                    <h2 className="doc-title">Sprint Product Roadmap</h2>
                    <p className="doc-desc">Track task updates, assign owners, and manage weekly documentation progress.</p>
                  </div>

                  {/* Kanban style preview or Rich Layout */}
                  <div className="kanban">
                    <div className="kanban-col">
                      <div className="kanban-col-header">
                        <span className="kanban-col-title kanban-col-title-todo">TO DO</span>
                        <span className="kanban-count">2</span>
                      </div>
                      <div className="kanban-card">
                        <p className="kanban-card-title">Auth Schema Doc</p>
                        <p className="kanban-card-desc">Review validation flow</p>
                      </div>
                      <div className="kanban-card">
                        <p className="kanban-card-title">Database Migration</p>
                        <p className="kanban-card-desc">Map relational schema</p>
                      </div>
                    </div>

                    <div className="kanban-col">
                      <div className="kanban-col-header">
                        <span className="kanban-col-title kanban-col-title-progress">IN PROGRESS</span>
                        <span className="kanban-count kanban-count-progress">2</span>
                      </div>
                      <div className="kanban-card kanban-card-progress">
                        <p className="kanban-card-title">API Integration Specs</p>
                        <p className="kanban-card-desc">Documenting Axios layer</p>
                        {/* Cursor indicator */}
                        <div className="editing-badge">
                          <span>Alex editing...</span>
                        </div>
                      </div>
                      <div className="kanban-card">
                        <p className="kanban-card-title">UI Wireframe Mockup</p>
                        <p className="kanban-card-desc">Syncing Visily screens</p>
                      </div>
                    </div>

                    <div className="kanban-col">
                      <div className="kanban-col-header">
                        <span className="kanban-col-title kanban-col-title-done">DONE</span>
                        <span className="kanban-count kanban-count-done">1</span>
                      </div>
                      <div className="kanban-card kanban-card-done">
                        <p className="kanban-card-title">Setup Vite Template</p>
                        <p className="kanban-card-desc">Boilerplate initialized</p>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Float decorative tag */}
            <div className="float-tag">
              <div className="float-tag-icon">
                <FiActivity className="float-tag-icon-svg" />
              </div>
              <div>
                <p className="float-tag-title">Live Sync Active</p>
                <p className="float-tag-sub">250ms Global Latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features">
        <div className="features-inner">
          <div className="section-header">
            <span className="eyebrow">FEATURES FOR PROS</span>
            <h2 className="section-title">Everything you need to work better</h2>
            <p className="section-desc">
              Powerful enough for enterprises, simple enough for solo founders. Experience documentation at the speed of thought.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FiFileText className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Rich Document Editor</h3>
              <p className="feature-desc">
                Collaborative editor with headings, tables, markdown support, nested bullet lists, and special blocks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FiUsers className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Real-Time Collaboration</h3>
              <p className="feature-desc">
                Simultaneous multi-user editing, visual cursor tracking, inline comments, and live presence indicators.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FiClock className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Version History</h3>
              <p className="feature-desc">
                Track historical snapshots, inspect changes with visual diffs, and restore documents to any state instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FiLayers className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">Team Workspaces</h3>
              <p className="feature-desc">
                Create structured, isolated team spaces (Engineering, Product, Marketing) with unique workspace-level controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="workflow">
        <div className="section-header workflow-header">
          <span className="eyebrow">WORKFLOW</span>
          <h2 className="section-title">How QuillSync works</h2>
          <p className="section-desc">
            Go from clean slate to shared team knowledge in minutes.
          </p>
        </div>

        <div className="workflow-grid">
          {/* Workflow Step 1 */}
          <div className="workflow-step">
            <div className="workflow-number">01</div>
            <h3 className="workflow-title">Create Workspace</h3>
            <p className="workflow-desc">
              Set up dedicated, isolated spaces for specific client deliverables, teams, or internal company wikis.
            </p>
          </div>

          {/* Workflow Step 2 */}
          <div className="workflow-step">
            <div className="workflow-number">02</div>
            <h3 className="workflow-title">Invite Team</h3>
            <p className="workflow-desc">
              Add collaborators easily via secret shareable links or secure email invites, with fine-grained ACL roles.
            </p>
          </div>

          {/* Workflow Step 3 */}
          <div className="workflow-step">
            <div className="workflow-number">03</div>
            <h3 className="workflow-title">Create Documents</h3>
            <p className="workflow-desc">
              Write release roadmaps, build tech architecture specifications, create meeting logs, and embed content blocks.
            </p>
          </div>

          {/* Workflow Step 4 */}
          <div className="workflow-step">
            <div className="workflow-number">04</div>
            <h3 className="workflow-title">Collaborate Together</h3>
            <p className="workflow-desc">
              Co-author at identical speeds, comment inline on selected paragraphs, resolve threads, and sync knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="metrics">
        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-value">10K+</div>
            <p className="metric-label">Active Teams</p>
          </div>
          <div className="metric">
            <div className="metric-value">99.9%</div>
            <p className="metric-label">Uptime SLA</p>
          </div>
          <div className="metric">
            <div className="metric-value">250ms</div>
            <p className="metric-label">Collaborative Latency</p>
          </div>
          <div className="metric">
            <div className="metric-value">24/7</div>
            <p className="metric-label">Dedicated Support</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="cta-section">
        <div className="cta-box">
          {/* Ambient Glow */}
          <div className="cta-glow"></div>

          <h2 className="cta-title">
            Ready to organize your team's knowledge?
          </h2>
          <p className="cta-desc">
            Join thousands of teams using QuillSync to collaborate productively together. Start writing and syncing documents instantly.
          </p>

          <div className="cta-actions">
            <Link
              to="/register"
              className="btn-white"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="cta-login-link"
            >
              <span>Login to Workspace</span>
              <FiArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          {/* Logo & Desc & Newsletter */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FiFeather className="footer-logo-icon-svg" />
              </div>
              <span className="footer-logo-title">QuillSync</span>
            </div>
            <p className="footer-desc">
              Collaborative knowledge management editing and knowledge management for the next generation of product and dev teams.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="newsletter-input"
              />
              <button
                type="submit"
                className="newsletter-btn"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Links 1 */}
          <div className="footer-col">
            <span className="footer-col-title">PRODUCT</span>
            <a href="#features" className="footer-link">Features</a>
            <a href="#how-it-works" className="footer-link">Integrations</a>
            <a href="#pricing" className="footer-link">Pricing</a>
            <a className="footer-link">Changelog</a>
          </div>

          {/* Links 2 */}
          <div className="footer-col">
            <span className="footer-col-title">COMPANY</span>
            <a className="footer-link">About Us</a>
            <a className="footer-link">Careers</a>
            <a className="footer-link">Privacy Policy</a>
            <a className="footer-link">Terms of Service</a>
          </div>

          {/* Links 3 */}
          <div className="footer-col footer-col-subscribe">
            <span className="footer-col-title">SUBSCRIBE TO NEWSLETTER</span>
            <p className="footer-col-desc">
              Get the latest updates, tips, and articles delivered directly to your inbox every week.
            </p>
            <span className="footer-copyright">© 2026 QuillSync Inc. All rights reserved. Built for collaborative excellence.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
