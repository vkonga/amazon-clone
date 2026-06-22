import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalAmount, clearCart } from '../features/cart/cartSlice';
import { userApi } from '../api/userApi';
import { orderApi } from '../api/orderApi';
import { formatPrice, getErrorMessage } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const items       = useSelector(selectCartItems);
  const subtotal    = useSelector(selectTotalAmount);

  const [addresses, setAddresses]   = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading]       = useState(false);
  const [addrLoading, setAddrLoading] = useState(true);

  // New address form
  const [useNew, setUseNew] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '', phoneNumber: '', streetAddress: '',
    city: '', state: '', postalCode: '', country: 'United States'
  });

  const shippingPrice = subtotal > 100 ? 0 : 10;
  const taxPrice      = parseFloat((subtotal * 0.08).toFixed(2));
  const orderTotal    = parseFloat((subtotal + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (items.length === 0) { navigate('/cart'); return; }
    userApi.getAddresses()
      .then(r => {
        const addrs = r.data.data || [];
        setAddresses(addrs);
        const def = addrs.find(a => a.isDefault) || addrs[0];
        if (def) setSelectedAddr(def._id);
        else     setUseNew(true);
      })
      .catch(() => setUseNew(true))
      .finally(() => setAddrLoading(false));
  }, []);

  const handleNewAddrChange = (e) => {
    setNewAddr(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = useNew
      ? newAddr
      : addresses.find(a => a._id === selectedAddr);

    if (!shippingAddress?.streetAddress) {
      toast.error('Please provide a shipping address'); return;
    }

    setLoading(true);
    try {
      const res = await orderApi.createOrder({ shippingAddress, paymentMethod });
      dispatch(clearCart());
      toast.success('🎉 Order placed successfully!');
      navigate(`/account/orders/${res.data.data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (addrLoading) return <Spinner fullPage />;

  return (
    <main className="page-content">
      <div className="container">
        <h1 style={{ marginBottom: 'var(--space-md)' }}>Checkout</h1>

        <div className="checkout-grid">
          {/* Left: Address + Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

            {/* Shipping Address */}
            <div className="card card-body">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>① Shipping Address</h3>

              {addresses.length > 0 && (
                <>
                  {addresses.map(addr => (
                    <div key={addr._id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: 'var(--space-sm)', marginBottom: 8,
                      border: selectedAddr === addr._id && !useNew
                        ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
                      background: selectedAddr === addr._id && !useNew ? '#fff9f0' : '#fff'
                    }}
                      onClick={() => { setSelectedAddr(addr._id); setUseNew(false); }}
                    >
                      <input
                        id={`addr-${addr._id}`}
                        type="radio"
                        checked={selectedAddr === addr._id && !useNew}
                        readOnly
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                        <strong>{addr.fullName}</strong>{addr.isDefault && ' (Default)'}
                        <br />{addr.streetAddress}<br />
                        {addr.city}, {addr.state} {addr.postalCode}<br />
                        {addr.country} · {addr.phoneNumber}
                      </div>
                    </div>
                  ))}

                  <div
                    style={{ padding: 'var(--space-sm)', border: useNew ? '2px solid var(--color-primary)' : '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer', background: useNew ? '#fff9f0' : '#fff', display: 'flex', gap: 12, alignItems: 'center' }}
                    onClick={() => { setUseNew(true); setSelectedAddr(null); }}
                  >
                    <input id="addr-new" type="radio" checked={useNew} readOnly />
                    <span className="text-sm font-semibold">+ Use a new address</span>
                  </div>
                </>
              )}

              {(useNew || addresses.length === 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  {[
                    { name: 'fullName', label: 'Full Name', colSpan: 2 },
                    { name: 'phoneNumber', label: 'Phone Number' },
                    { name: 'streetAddress', label: 'Street Address', colSpan: 2 },
                    { name: 'city', label: 'City' },
                    { name: 'state', label: 'State' },
                    { name: 'postalCode', label: 'Postal Code' },
                    { name: 'country', label: 'Country' },
                  ].map(f => (
                    <div key={f.name} className="form-group" style={{ gridColumn: f.colSpan === 2 ? '1 / -1' : 'auto' }}>
                      <label className="form-label" htmlFor={`addr-field-${f.name}`}>{f.label}</label>
                      <input
                        id={`addr-field-${f.name}`}
                        className="form-control"
                        name={f.name}
                        value={newAddr[f.name]}
                        onChange={handleNewAddrChange}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card card-body">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>② Payment Method</h3>
              {['Credit Card', 'PayPal', 'COD'].map(method => (
                <div key={method} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 'var(--space-sm)', marginBottom: 8,
                  border: paymentMethod === method ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
                  background: paymentMethod === method ? '#fff9f0' : '#fff'
                }}
                  onClick={() => setPaymentMethod(method)}
                >
                  <input
                    id={`pay-${method}`}
                    type="radio"
                    checked={paymentMethod === method}
                    readOnly
                  />
                  <span className="font-semibold text-sm">
                    {method === 'Credit Card' && '💳 '}
                    {method === 'PayPal'      && '🅿️ '}
                    {method === 'COD'         && '💵 '}
                    {method}
                  </span>
                </div>
              ))}
            </div>

            {/* Items Review */}
            <div className="card card-body">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>③ Review Items ({items.length})</h3>
              {items.map(item => (
                <div key={item.productId} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
                  <img
                    src={item.image || 'https://placehold.co/60x60'}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 4, background: '#f8f8f8' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-sm text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Order Summary</h3>
            <div className="order-summary__row"><span>Items</span><span>{formatPrice(subtotal)}</span></div>
            <div className="order-summary__row">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? <span className="text-success">FREE</span> : formatPrice(shippingPrice)}</span>
            </div>
            <div className="order-summary__row"><span>Tax (8%)</span><span>{formatPrice(taxPrice)}</span></div>
            <div className="order-summary__row total"><span>Order Total</span><span>{formatPrice(orderTotal)}</span></div>

            <button
              id="place-order-btn"
              className="btn btn-primary btn-full btn-lg mt-md"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order · ${formatPrice(orderTotal)}`}
            </button>
            <p className="text-xs text-muted text-center mt-sm">
              🔒 By placing your order, you agree to our privacy notice and terms of use.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
