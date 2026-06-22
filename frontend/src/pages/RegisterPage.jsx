import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/userApi';
import { setCredentials } from '../features/auth/authSlice';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({ name: form.name, email: form.email, password: form.password });
      dispatch(setCredentials(res.data.data));
      toast.success(`Welcome, ${res.data.data.user.name}! Account created successfully.`);
      navigate('/');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', background: 'var(--bg-page)', padding: 'var(--space-md)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-lg">
          <Link to="/" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-secondary)' }}>
            amaz<span style={{ color: 'var(--color-primary)' }}>o</span>n
          </Link>
        </div>

        <div className="card card-body" style={{ padding: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>Create Account</h1>

          {error && <div className="alert alert-error mb-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="reg-name">Your name</label>
              <input id="reg-name" className="form-control" type="text" name="name" value={form.name} onChange={handleChange} required autoFocus placeholder="First and last name" />
            </div>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="At least 6 characters" />
            </div>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="reg-confirm">Re-enter password</label>
              <input id="reg-confirm" className="form-control" type="password" name="confirm" value={form.confirm} onChange={handleChange} required />
            </div>
            <button id="register-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create your Amazon account'}
            </button>
          </form>

          <p className="text-xs text-muted mt-md" style={{ lineHeight: 1.6 }}>
            By creating an account, you agree to Amazon Clone's{' '}
            <a href="#" className="text-link">Conditions of Use</a> and{' '}
            <a href="#" className="text-link">Privacy Notice</a>.
          </p>

          <hr className="divider" />
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" id="go-login" className="text-link font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
