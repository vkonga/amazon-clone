import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/userApi';
import { setCredentials } from '../features/auth/authSlice';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      dispatch(setCredentials(res.data.data));
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', background: 'var(--bg-page)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div className="text-center mb-lg">
          <Link to="/" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-secondary)' }}>
            amaz<span style={{ color: 'var(--color-primary)' }}>o</span>n
          </Link>
        </div>

        <div className="card card-body" style={{ padding: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>Sign In</h1>

          {error && <div className="alert alert-error mb-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
                autoComplete="email"
              />
            </div>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <button id="login-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-md">
            <Link to="/forgot-password" className="text-link text-sm">Forgot your password?</Link>
          </div>

          <hr className="divider" />

          <p className="text-sm text-center">
            New to Amazon Clone?{' '}
            <Link to="/register" id="go-register" className="text-link font-semibold">
              Create your account
            </Link>
          </p>
        </div>

        <p className="text-xs text-muted text-center mt-md" style={{ padding: '0 24px' }}>
          By signing in, you agree to our <a href="#" className="text-link">Conditions of Use</a> and{' '}
          <a href="#" className="text-link">Privacy Notice</a>.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
