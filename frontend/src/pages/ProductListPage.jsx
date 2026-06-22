import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest Arrivals' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc',label: 'Price: High to Low' },
  { value: 'rating',   label: 'Avg. Customer Rating' },
];

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword  = searchParams.get('q') || searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort') || 'newest';
  const page     = parseInt(searchParams.get('page') || '1');

  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [minPrice, setMinPrice]     = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice]     = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating]         = useState(searchParams.get('rating') || '');

  // Fetch categories once
  useEffect(() => {
    productApi.getCategories()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 20, sort };
        if (keyword)  params.keyword  = keyword;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (rating)   params.rating   = rating;

        const res = await productApi.getProducts(params);
        setProducts(res.data.data || []);
        setPagination(res.data.pagination || null);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [keyword, category, sort, page, minPrice, maxPrice, rating]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice(''); setRating('');
    setSearchParams({ page: '1', sort: 'newest' });
  };

  return (
    <main className="page-content">
      <div className="container">
        {keyword && (
          <p style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
            Results for: <strong>"{keyword}"</strong>
            {pagination && ` — ${pagination.total} results`}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-lg)', alignItems: 'start' }}>
          {/* Sidebar Filters */}
          <aside className="sidebar" aria-label="Filters">
            <div className="sidebar__title">Department</div>

            <div className="sidebar__section">
              <div className="sidebar__section-title">Category</div>
              <div
                className={`sidebar__item ${!category ? 'font-bold' : ''}`}
                onClick={() => updateParam('category', '')}
              >
                All Categories
              </div>
              {categories.map(cat => (
                <div
                  key={cat._id}
                  className={`sidebar__item ${category === cat.slug ? 'font-bold text-primary-color' : ''}`}
                  onClick={() => updateParam('category', cat.slug)}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            <div className="sidebar__section">
              <div className="sidebar__section-title">Avg. Customer Review</div>
              {[4, 3, 2, 1].map(r => (
                <div
                  key={r}
                  className={`sidebar__item ${rating == r ? 'font-bold text-primary-color' : ''}`}
                  onClick={() => updateParam('rating', r)}
                >
                  ⭐ {r}+ Stars
                </div>
              ))}
            </div>

            <div className="sidebar__section">
              <div className="sidebar__section-title">Price</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  id="filter-min-price"
                  className="form-control"
                  type="number"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  style={{ width: '50%' }}
                />
                <input
                  id="filter-max-price"
                  className="form-control"
                  type="number"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  style={{ width: '50%' }}
                />
              </div>
              <button id="apply-price-filter" className="btn btn-secondary btn-sm btn-full" onClick={applyPriceFilter}>
                Apply
              </button>
            </div>

            <button id="clear-filters" className="btn btn-danger btn-sm btn-full mt-sm" onClick={clearFilters}>
              Clear Filters
            </button>
          </aside>

          {/* Main Content */}
          <div>
            {/* Sort Bar */}
            <div className="flex-between mb-md" style={{ background: '#f0f2f2', padding: '10px 16px', borderRadius: 'var(--border-radius-sm)' }}>
              <span className="text-sm text-muted">
                {pagination ? `${pagination.total} results` : 'Loading...'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label htmlFor="sort-select" className="text-sm font-semibold">Sort by:</label>
                <select
                  id="sort-select"
                  className="form-control"
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                  style={{ width: 'auto' }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : products.length === 0 ? (
              <div className="card card-body text-center" style={{ padding: 60 }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                <h3>No products found</h3>
                <p className="text-muted mt-sm">Try different keywords or filters</p>
                <button className="btn btn-primary mt-md" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {pagination && (
                  <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={p => updateParam('page', p)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductListPage;
