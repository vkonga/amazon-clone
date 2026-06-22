import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems, selectTotalAmount,
  removeFromCart, updateQuantity, clearCart
} from '../features/cart/cartSlice';
import { selectIsAuth } from '../features/auth/authSlice';
import { formatPrice } from '../utils/helpers';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://placehold.co/100x100/f8f8f8/ccc?text=Item';

const CartPage = () => {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const items        = useSelector(selectCartItems);
  const totalAmount  = useSelector(selectTotalAmount);
  const isAuth       = useSelector(selectIsAuth);

  const handleRemove = (productId, name) => {
    dispatch(removeFromCart(productId));
    toast.success(`"${name.slice(0, 20)}..." removed from cart`);
  };

  const handleQty = (productId, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ productId, quantity: qty }));
  };

  const handleCheckout = () => {
    if (!isAuth) {
      toast.error('Please sign in to checkout');
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="card card-body text-center" style={{ padding: 80 }}>
            <FiShoppingBag size={64} style={{ color: 'var(--border-color)', marginBottom: 24, display: 'block', margin: '0 auto 24px' }} />
            <h2>Your Cart is Empty</h2>
            <p className="text-muted mt-sm mb-md">Looks like you haven't added anything to your cart yet.</p>
            <button id="cart-shop-now" className="btn btn-primary btn-lg btn-rounded"
              onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        </div>
      </main>
    );
  }

  const shippingPrice = totalAmount > 100 ? 0 : 10;
  const taxPrice      = parseFloat((totalAmount * 0.08).toFixed(2));
  const orderTotal    = parseFloat((totalAmount + shippingPrice + taxPrice).toFixed(2));

  return (
    <main className="page-content">
      <div className="container">
        <h1 style={{ marginBottom: 'var(--space-md)' }}>Shopping Cart</h1>

        <div className="checkout-grid">
          {/* Cart Items */}
          <div className="card card-body">
            <div className="flex-between mb-md" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-sm)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)' }}>Cart ({items.length} item{items.length > 1 ? 's' : ''})</h2>
              <button
                id="clear-cart-btn"
                className="btn btn-danger btn-sm"
                onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
              >
                <FiTrash2 /> Clear All
              </button>
            </div>

            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  className="cart-item__image"
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
                <div className="cart-item__info">
                  <p className="cart-item__name" onClick={() => navigate(`/products/${item.productId}`)}
                    style={{ cursor: 'pointer', color: 'var(--text-link)' }}>
                    {item.name}
                  </p>
                  <p style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-sm)', margin: '4px 0' }}>
                    In Stock
                  </p>
                  <p className="cart-item__price">{formatPrice(item.price)}</p>

                  <div className="qty-selector" style={{ marginTop: 'var(--space-sm)' }}>
                    <button
                      id={`qty-dec-${item.productId}`}
                      className="qty-selector__btn"
                      onClick={() => handleQty(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="qty-selector__value">{item.quantity}</span>
                    <button
                      id={`qty-inc-${item.productId}`}
                      className="qty-selector__btn"
                      onClick={() => handleQty(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  <button
                    id={`remove-${item.productId}`}
                    className="btn btn-danger btn-sm mt-sm"
                    onClick={() => handleRemove(item.productId, item.name)}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Order Summary</h3>
            <div className="order-summary__row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="order-summary__row">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? <span className="text-success">FREE</span> : formatPrice(shippingPrice)}</span>
            </div>
            <div className="order-summary__row">
              <span>Estimated Tax (8%)</span>
              <span>{formatPrice(taxPrice)}</span>
            </div>
            <div className="order-summary__row total">
              <span>Order Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
            <button
              id="checkout-btn"
              className="btn btn-primary btn-full btn-lg mt-md"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            {!isAuth && (
              <p className="text-sm text-muted text-center mt-sm">
                <span className="text-link" onClick={() => navigate('/login')}>Sign in</span> to checkout
              </p>
            )}
            <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm)', background: 'var(--bg-hover)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              🔒 Safe and Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
