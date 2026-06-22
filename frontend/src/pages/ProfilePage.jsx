import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCredentials } from '../features/auth/authSlice';
import { userApi } from '../api/userApi';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const user     = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);

  useEffect(() => {
    userApi.getAddresses()
      .then(r => setAddresses(r.data.data || []))
      .catch(() => {})
      .finally(() => setAddrLoading(false));
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userApi.updateProfile(form);
      dispatch(setCredentials({
        user: res.data.data,
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-content">
      <div className="container">
        <h1 style={{ marginBottom: 'var(--space-lg)' }}>Your Account</h1>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Profile Info */}
          <div className="card card-body">
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Personal Information</h2>
            <form onSubmit={handleProfileSave}>
              <div className="form-group mb-md">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group mb-md">
                <label className="form-label" htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group mb-md">
                <label className="form-label">Role</label>
                <div style={{ padding: '8px 10px', background: 'var(--bg-hover)', borderRadius: 'var(--border-radius-sm)' }}>
                  <span className={`badge ${user?.role === 'Admin' ? 'badge-primary' : 'badge-success'}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <button id="profile-save-btn" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Addresses */}
          <div className="card card-body">
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Your Addresses</h2>
            {addrLoading ? (
              <p className="text-muted text-sm">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="text-muted text-sm">No saved addresses. Add one at checkout.</p>
            ) : (
              addresses.map(addr => (
                <div key={addr._id} style={{
                  padding: 'var(--space-sm)',
                  border: addr.isDefault ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  marginBottom: 8,
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 1.7
                }}>
                  {addr.isDefault && (
                    <span className="badge badge-primary" style={{ marginBottom: 4 }}>Default</span>
                  )}
                  <p><strong>{addr.fullName}</strong></p>
                  <p>{addr.streetAddress}</p>
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  <p>📞 {addr.phoneNumber}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
