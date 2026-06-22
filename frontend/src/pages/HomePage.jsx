import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Electronics',   emoji: '💻', slug: 'electronics' },
  { name: 'Books',         emoji: '📚', slug: 'books' },
  { name: 'Clothing',      emoji: '👕', slug: 'clothing' },
  { name: 'Home & Garden', emoji: '🏡', slug: 'home-garden' },
  { name: 'Sports',        emoji: '⚽', slug: 'sports' },
  { name: 'Toys',          emoji: '🧸', slug: 'toys' },
  { name: 'Beauty',        emoji: '💄', slug: 'beauty' },
  { name: 'Automotive',    emoji: '🚗', slug: 'automotive' },
];

const FEATURES = [
  { icon: FiTruck,       title: 'Free Shipping',  desc: 'On orders over $100' },
  { icon: FiShield,      title: 'Secure Payment', desc: '100% protected' },
  { icon: FiRefreshCw,   title: 'Easy Returns',   desc: '30-day return policy' },
  { icon: FiHeadphones,  title: '24/7 Support',   desc: 'Always here to help' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featured, setFeatured]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getProducts({ limit: 8, sort: 'newest' });
        setFeatured(res.data.data || []);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="page-content">
      <div className="container">

        {/* Hero Banner */}
        <section className="hero" aria-label="Hero banner">
          <h1>Discover Millions of Products</h1>
          <p>Shop the best deals on electronics, clothing, books, and more</p>
          <div className="hero-cta" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button id="hero-shop-now" className="btn btn-primary btn-lg btn-rounded"
              onClick={() => navigate('/products')}>
              Shop Now <FiArrowRight />
            </button>
            <button id="hero-learn-more" className="btn btn-secondary btn-lg btn-rounded"
              onClick={() => navigate('/search')}>
              Explore Deals
            </button>
          </div>
        </section>

        {/* Feature Highlights */}
        <section style={{ marginBottom: 'var(--space-xl)' }} aria-label="Features">
          <div className="grid-4" style={{ marginBottom: 0 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card-body flex-center flex-col gap-sm"
                style={{ textAlign: 'center', padding: 24 }}>
                <Icon size={32} style={{ color: 'var(--color-primary)' }} />
                <h4>{title}</h4>
                <p className="text-muted text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section style={{ marginBottom: 'var(--space-xl)' }} aria-label="Categories">
          <div className="flex-between mb-md">
            <h2>Shop by Category</h2>
            <Link to="/products" className="text-link text-sm">See all →</Link>
          </div>
          <div className="grid-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}
                className="card card-body flex-center flex-col gap-sm"
                style={{ cursor: 'pointer', padding: 24, textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => navigate(`/search?category=${cat.slug}`)}
                role="button"
                aria-label={`Browse ${cat.name}`}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: 36 }}>{cat.emoji}</span>
                <h4>{cat.name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section aria-label="Featured products">
          <div className="flex-between mb-md">
            <h2>Featured Products</h2>
            <Link to="/products" className="text-link text-sm">View all →</Link>
          </div>

          {loading ? (
            <Spinner />
          ) : featured.length === 0 ? (
            <div className="card card-body text-center" style={{ padding: 48 }}>
              <p className="text-muted">No products yet. Start by adding products from the Admin panel.</p>
              <Link to="/admin" className="btn btn-primary mt-md" style={{ display: 'inline-flex' }}>
                Go to Admin
              </Link>
            </div>
          ) : (
            <div className="grid-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Deal Banner */}
        <section style={{
          background: 'linear-gradient(135deg,#FF9900,#FF6600)',
          borderRadius: 'var(--border-radius)',
          padding: '40px 32px',
          marginTop: 'var(--space-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          color: '#fff'
        }} aria-label="Deals promotion">
          <div>
            <h2 style={{ fontSize: 28 }}>🔥 Today's Deals</h2>
            <p style={{ opacity: 0.9, marginTop: 8 }}>Up to 70% off on selected items. Limited time only!</p>
          </div>
          <button id="deals-shop-btn" className="btn btn-secondary btn-lg btn-rounded"
            onClick={() => navigate('/products?sort=newest')}>
            Shop Deals
          </button>
        </section>

      </div>
    </main>
  );
};

export default HomePage;
