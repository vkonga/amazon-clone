import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiSearch, FiMenu, FiUser, FiPackage, FiLogOut } from 'react-icons/fi';
import { selectCurrentUser, selectIsAuth, selectIsAdmin, logout } from '../../features/auth/authSlice';
import { selectTotalItems } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectCurrentUser);
  const isAuth    = useSelector(selectIsAuth);
  const isAdmin   = useSelector(selectIsAdmin);
  const totalItems = useSelector(selectTotalItems);
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Main row */}
      <div className="navbar__main">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          amaz<span>o</span>n
        </Link>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch} style={{ flex: 1 }}>
          <input
            id="navbar-search-input"
            className="search-bar__input"
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Search products"
          />
          <button id="navbar-search-btn" type="submit" className="search-bar__btn" aria-label="Search">
            <FiSearch />
          </button>
        </form>

        {/* Nav links */}
        <div className="navbar__nav">
          {isAuth ? (
            <>
              <div className="navbar__link" style={{ cursor: 'default' }}>
                <span className="navbar__link-small">Hello, {user?.name?.split(' ')[0]}</span>
                <span className="navbar__link-bold">Account</span>
              </div>
              <Link to="/account/profile" className="navbar__link" id="nav-profile">
                <span className="navbar__link-small">Your</span>
                <span className="navbar__link-bold">Profile</span>
              </Link>
              <Link to="/account/orders" className="navbar__link" id="nav-orders">
                <span className="navbar__link-small">Your</span>
                <span className="navbar__link-bold">Orders</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="navbar__link" id="nav-admin"
                  style={{ color: 'var(--color-primary)' }}>
                  <span className="navbar__link-small">Admin</span>
                  <span className="navbar__link-bold">Dashboard</span>
                </Link>
              )}
              <button className="navbar__link" id="nav-logout" onClick={handleLogout}>
                <span className="navbar__link-small">Sign</span>
                <span className="navbar__link-bold">Out</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__link" id="nav-signin">
              <span className="navbar__link-small">Hello, Guest</span>
              <span className="navbar__link-bold">Sign In</span>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="navbar__cart" id="nav-cart">
            <div style={{ position: 'relative' }}>
              <FiShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="navbar__cart-count" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                  {totalItems}
                </span>
              )}
            </div>
            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="navbar__sub">
        <span className="navbar__sub-link"><FiMenu style={{ verticalAlign: 'middle', marginRight: 4 }} />All</span>
        {['Electronics', 'Books', 'Clothing', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive'].map((cat) => (
          <Link
            key={cat}
            to={`/search?category=${encodeURIComponent(cat.toLowerCase())}`}
            className="navbar__sub-link"
          >
            {cat}
          </Link>
        ))}
        <Link to="/products" className="navbar__sub-link">Today's Deals</Link>
      </div>
    </nav>
  );
};

export default Navbar;
