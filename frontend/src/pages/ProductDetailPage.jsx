import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productApi } from '../api/productApi';
import { addToCart } from '../features/cart/cartSlice';
import { selectIsAuth } from '../features/auth/authSlice';
import StarRating from '../components/common/StarRating';
import Spinner from '../components/common/Spinner';
import { formatPrice, formatDate, getErrorMessage } from '../utils/helpers';
import { FiShoppingCart, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://placehold.co/500x500/f8f8f8/ccc?text=Product';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth   = useSelector(selectIsAuth);

  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [qty, setQty]           = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          productApi.getProduct(id),
          productApi.getReviews(id)
        ]);
        setProduct(prodRes.data.data);
        setReviews(revRes.data.data || []);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      image:     product.images?.[0] || PLACEHOLDER,
      quantity:  qty
    }));
    toast.success(`${qty}x "${product.name.slice(0, 25)}..." added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuth) { toast.error('Please login to submit a review'); return; }
    setSubmitting(true);
    try {
      const res = await productApi.addReview(id, newReview);
      setReviews(prev => [res.data.data, ...prev]);
      toast.success('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (!product) return null;

  const images = product.images?.length ? product.images : [PLACEHOLDER];

  return (
    <main className="page-content">
      <div className="container">
        {/* Breadcrumb */}
        <p className="text-sm text-muted mb-md">
          <span className="text-link" onClick={() => navigate('/')}>Home</span>
          {' › '}
          <span className="text-link" onClick={() => navigate('/products')}>Products</span>
          {' › '}{product.name}
        </p>

        {/* Product detail grid */}
        <div className="product-detail" style={{ marginBottom: 'var(--space-xl)' }}>
          {/* Images Column */}
          <div>
            <img
              src={images[selectedImg]}
              alt={product.name}
              className="product-detail__image-main"
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    style={{
                      width: 64, height: 64, objectFit: 'contain',
                      border: i === selectedImg ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      borderRadius: 4, cursor: 'pointer', background: '#f8f8f8', padding: 4
                    }}
                    onClick={() => setSelectedImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 8 }}>{product.name}</h1>
            <div style={{ marginBottom: 8 }}>
              <StarRating rating={product.rating} count={product.numReviews} size={16} />
            </div>
            <hr className="divider" />

            <p className="product-detail__price" style={{ color: 'var(--color-error)', marginBottom: 12 }}>
              {formatPrice(product.price)}
            </p>

            <p className="text-sm" style={{ marginBottom: 16, lineHeight: 1.7 }}>
              {product.description}
            </p>

            {product.category && (
              <p className="text-sm text-muted mb-sm">
                Category: <strong>{product.category.name}</strong>
              </p>
            )}

            <p className="text-sm mb-md" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {product.stock > 0 ? (
                <><FiCheckCircle style={{ color: 'var(--color-success)' }} />
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>In Stock ({product.stock} available)</span></>
              ) : (
                <><FiAlertCircle style={{ color: 'var(--color-error)' }} />
                  <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>Out of Stock</span></>
              )}
            </p>
          </div>

          {/* Buy Box */}
          <div className="product-detail__buy-box">
            <p className="product-detail__price" style={{ color: 'var(--color-error)', marginBottom: 12 }}>
              {formatPrice(product.price)}
            </p>

            {product.price > 100 && (
              <p className="text-sm text-success mb-sm">
                ✓ FREE delivery on this order
              </p>
            )}

            {product.stock > 0 ? (
              <>
                <div className="form-group mb-md">
                  <label className="form-label" htmlFor="qty-select">Quantity:</label>
                  <select
                    id="qty-select"
                    className="form-control"
                    value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                    style={{ width: 80 }}
                  >
                    {[...Array(Math.min(product.stock, 10)).keys()].map(n => (
                      <option key={n + 1} value={n + 1}>{n + 1}</option>
                    ))}
                  </select>
                </div>
                <button
                  id="add-to-cart-detail"
                  className="btn btn-primary btn-full mb-sm"
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <button
                  id="buy-now-btn"
                  className="btn btn-orange btn-full"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </>
            ) : (
              <button className="btn btn-secondary btn-full" disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section aria-label="Customer reviews">
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Customer Reviews</h2>
          <div className="grid-2" style={{ gap: 'var(--space-xl)', alignItems: 'start' }}>
            {/* Review List */}
            <div>
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((rev, i) => (
                  <div key={rev._id || i} style={{
                    padding: 'var(--space-md) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong>{rev.userName}</strong>
                      <span className="text-sm text-muted">{formatDate(rev.createdAt)}</span>
                    </div>
                    <StarRating rating={rev.rating} size={14} />
                    <p className="text-sm" style={{ marginTop: 8 }}>{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review */}
            <div className="card card-body">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Write a Review</h3>
              {isAuth ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="form-group mb-md">
                    <label className="form-label" htmlFor="review-rating">Rating</label>
                    <select
                      id="review-rating"
                      className="form-control"
                      value={newReview.rating}
                      onChange={e => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="form-group mb-md">
                    <label className="form-label" htmlFor="review-comment">Comment</label>
                    <textarea
                      id="review-comment"
                      className="form-control"
                      rows={4}
                      value={newReview.comment}
                      onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Write your review here..."
                      required
                    />
                  </div>
                  <button id="submit-review-btn" type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-muted">
                  Please <span className="text-link" onClick={() => navigate('/login')}>log in</span> to write a review.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetailPage;
