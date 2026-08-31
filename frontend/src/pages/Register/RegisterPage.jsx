import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Register.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { email, password, fullName });

      if (data.session) {
        await supabase.auth.setSession(data.session);
        navigate('/dashboard');
      } else {
        setSuccess('Account created! Please check your email to confirm your account before logging in.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Panel: High Contrast Graphic & Benefits */}
      <div className="register-left-panel">
        {/* Glow Spheres */}
        <div className="register-glow one"></div>
        <div className="register-glow two"></div>

        {/* Logo / Header */}
        <div className="logo-header" onClick={() => navigate('/')}>
          <div className="logo-icon-box">
            <FiFeather />
          </div>
          <span className="logo-text">QuillSync</span>
        </div>

        {/* Content Container */}
        <div className="register-content-container">
          {/* Main Visual Card representing Collaboration */}
          <div className="register-card">
            <div className="collab-card-header">
              <span className="collab-card-header-text">COLLABORATION GRAPH</span>
            </div>
            {/* Visual placeholder representation of diagram */}
            <div className="collab-mock-box">
              <div className="avatar-stack">
                <div className="avatar-circle indigo">JD</div>
                <div className="avatar-circle emerald">AS</div>
                <div className="avatar-circle rose">MK</div>
              </div>
              <div className="collab-dashed-overlay">
                <div className="collab-dashed-circle"></div>
              </div>
              <div className="collab-caption">Live Document Editing Session</div>
            </div>
          </div>

          <div className="headline-block">
            <h2 className="headline-title">
              Work together, <span className="gradient-text-blue">faster</span> and <span className="gradient-text-purple">smarter</span>.
            </h2>
            <p className="headline-subtext">
              QuillSync brings your team's documents, spreadsheets, and creative projects into one unified, real-time workspace.
            </p>
          </div>

          {/* Checklist */}
          <div className="checklist-grid">
            <div className="checklist-item">
              <div className="checklist-icon-box">
                <FiCheck />
              </div>
              <span className="checklist-text">Real-time multi-user editing</span>
            </div>
            <div className="checklist-item">
              <div className="checklist-icon-box">
                <FiCheck />
              </div>
              <span className="checklist-text">Advanced version control</span>
            </div>
            <div className="checklist-item">
              <div className="checklist-icon-box">
                <FiCheck />
              </div>
              <span className="checklist-text">Bank-grade encryption</span>
            </div>
            <div className="checklist-item">
              <div className="checklist-icon-box">
                <FiCheck />
              </div>
              <span className="checklist-text">200+ Integrations</span>
            </div>
          </div>

          {/* Avatar counter line */}
          <div className="avatar-counter-line">
            <div className="avatar-counter-stack">
              <div className="avatar-counter-circle c1">1</div>
              <div className="avatar-counter-circle c2">2</div>
              <div className="avatar-counter-circle c3">3</div>
            </div>
            <span className="avatar-counter-text">Join 70,000+ teams already syncing.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="register-footer-text">
          © 2026 QuillSync Inc.
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="register-right-panel">
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
            <h1 className="form-title">Create your account</h1>
            <p className="form-subtitle">Get started with your free workspace today.</p>
          </div>

          {/* Success / Error Feedback */}
          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          {/* Social Sign Up */}
          <div className="social-section">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="register-social-button"
            >
              <FcGoogle />
              <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="divider-wrapper">
              <div className="divider-line"></div>
              <span className="divider-text">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="field-group">
              <label htmlFor="name" className="field-label">
                Full Name
              </label>
              <div className="field-input-wrapper">
                <div className="field-icon">
                  <FiUser />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Cooper"
                  className="register-input"
                />
              </div>
            </div>

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
                  placeholder="jane@company.com"
                  className="register-input"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="password-grid">
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
                    className="register-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="confirm" className="field-label">
                  Confirm
                </label>
                <div className="field-input-wrapper">
                  <div className="field-icon">
                    <FiLock />
                  </div>
                  <input
                    id="confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="register-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <FiArrowRight />}
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="login-redirect-text">
            Already have an account?{' '}
            <Link to="/login" className="register-link">
              Log in
            </Link>
          </div>

          {/* Agreement Notice */}
          <p className="agreement-text">
            By clicking "Create Account", you agree to our{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="agreement-link">Terms of Service</a>{' '}
            and{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="agreement-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
