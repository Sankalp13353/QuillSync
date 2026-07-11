import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage('A password reset link has been sent to your email. Please check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Unable to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1 className="forgot-password-title">Forgot your password?</h1>
        <p className="forgot-password-subtitle">
          Enter the email address associated with your account and we’ll send you a secure reset link.
        </p>

        {message && <div className="forgot-password-message success">{message}</div>}
        {error && <div className="forgot-password-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="forgot-password-input"
          />

          <button type="submit" disabled={loading} className="forgot-password-button">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
          Back to{' '}
          <Link to="/login" className="forgot-password-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
