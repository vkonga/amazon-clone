import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__back-to-top" onClick={scrollTop} role="button" aria-label="Back to top">
        Back to top
      </div>

      <div className="footer__main">
        <div className="footer__col">
          <h4>Get to Know Us</h4>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">About Amazon Clone</a>
          <a href="#">Investor Relations</a>
          <a href="#">Amazon Devices</a>
        </div>
        <div className="footer__col">
          <h4>Make Money with Us</h4>
          <a href="#">Sell products on Amazon</a>
          <a href="#">Sell on Amazon Business</a>
          <a href="#">Become an Affiliate</a>
          <a href="#">Advertise Your Products</a>
        </div>
        <div className="footer__col">
          <h4>Amazon Payment Products</h4>
          <a href="#">Amazon Business Card</a>
          <a href="#">Shop with Points</a>
          <a href="#">Reload Your Balance</a>
          <a href="#">Amazon Currency Converter</a>
        </div>
        <div className="footer__col">
          <h4>Let Us Help You</h4>
          <a href="#">Your Account</a>
          <a href="#">Your Orders</a>
          <a href="#">Shipping Rates</a>
          <a href="#">Returns & Replacements</a>
          <a href="#">Help</a>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__logo">amaz<span>o</span>n</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 8 }}>
          <FiFacebook size={20} style={{ cursor: 'pointer' }} />
          <FiTwitter  size={20} style={{ cursor: 'pointer' }} />
          <FiInstagram size={20} style={{ cursor: 'pointer' }} />
          <FiYoutube  size={20} style={{ cursor: 'pointer' }} />
        </div>
        <p>© {new Date().getFullYear()} Amazon Clone. All rights reserved.</p>
        <p style={{ marginTop: 4 }}>
          <a href="#" style={{ color: '#aaa', margin: '0 8px' }}>Privacy Notice</a>
          <a href="#" style={{ color: '#aaa', margin: '0 8px' }}>Conditions of Use</a>
          <a href="#" style={{ color: '#aaa', margin: '0 8px' }}>Cookie Notice</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
