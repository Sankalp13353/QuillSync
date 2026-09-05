import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      // Set the Supabase session from backend response — triggers AuthContext sync
      await supabase.auth.setSession(data.session);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel: Glassmorphic App Illustration (Hidden on Mobile) */}
      <div className="login-left-panel">
        {/* Glow Spheres */}
        <div className="login-glow one"></div>
        <div className="login-glow two"></div>

        {/* Logo / Header */}
        <div className="logo-header" onClick={() => navigate('/')}>
          <div className="logo-icon-box">
            <FiFeather />
          </div>
          <span className="logo-text">QuillSync</span>
        </div>

        {/* Dashboard Mockup card */}
        <div className="login-content-container">
          <div className="login-card">
            {/* Top window headers */}
            <div className="window-dots">
              <div className="window-dot red"></div>
              <div className="window-dot yellow"></div>
              <div className="window-dot green"></div>
            </div>

            {/* Small Mock Editor Layout */}
            <div className="mock-editor-layout">
              <div className="mock-line"></div>
              <div className="mock-line-sub"></div>
              <div className="mock-block-grid">
                <div className="mock-block">
                  <div className="mock-block-dot indigo"></div>
                  <div className="mock-block-line"></div>
                  <div className="mock-block-line-sub"></div>
                </div>
                <div className="mock-block">
                  <div className="mock-block-dot emerald"></div>
                  <div className="mock-block-line"></div>
                  <div className="mock-block-line-sub"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="login-headline-block">
            <h2 className="login-headline-title">Sync Your Team's Knowledge</h2>
            <p className="login-headline-subtext">
              The all-in-one workspace for documentation, wikis, and real-time collaboration. Build something great together.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer-text">
          © 2026 QuillSync Inc.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="login-right-panel">
        <div className="mobile-logo-wrapper">
          <div className="mobile-logo-inner" onClick={() => navigate('/')}>
            <div className="mobile-logo-icon">
              <FiFeather />
            </div>
            <span className="mobile-logo-text">QuillSync</span>
          </div>
        </div>

        <div className="form-container">
          <div className="form-header">
            <div className="form-header-logo">
              <div className="form-header-icon-box">
                <FiFeather />
              </div>
              <span className="form-header-brand">QuillSync</span>
            </div>
            <h1 className="form-title">Welcome Back</h1>
            <p className="form-subtitle">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="field-group">
              <label htmlFor="email" className="field-label">
                Work Email
              </label>
              <div className="field-input-wrapper">
                <div className="field-icon">
                  <FiMail />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="field-group">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="field-input-wrapper">
                <div className="field-icon">
                  <FiLock />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-meta-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-me-checkbox"
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              {!loading && <FiArrowRight />}
            </button>
          </form>

          {/* Social Logins */}
          <div className="social-section">
            <div className="divider-wrapper">
              <div className="divider-line"></div>
              <span className="divider-text">
                OR CONTINUE WITH
              </span>
            </div>

            {error && (
              <p className="auth-error">{error}</p>
            )}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="auth-social-button"
            >
              <FcGoogle />
              <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Redirect to Register */}
          <div className="register-redirect-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
