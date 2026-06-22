import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { formatPrice, formatDate, getStatusBadge } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import { FiPackage } from 'react-icons/fi';

const ORDER_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

const OrderHistoryPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getOrders()
      .then(r => setOrders(r.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage />;

  return (
    <main className="page-content">
      <div className="container">
        <h1 style={{ marginBottom: 'var(--space-lg)' }}>Your Orders</h1>

        {orders.length === 0 ? (
          <div className="card card-body text-center" style={{ padding: 80 }}>
            <FiPackage size={64} style={{ color: 'var(--border-color)', margin: '0 auto 24px', display: 'block' }} />
            <h2>No Orders Yet</h2>
            <p className="text-muted mt-sm mb-md">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg btn-rounded" style={{ display: 'inline-flex' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {orders.map(order => {
              const stepIndex = ORDER_STEPS.indexOf(order.orderStatus);
              return (
                <div key={order._id} className="card">
                  {/* Order Header */}
                  <div style={{
                    background: 'var(--bg-hover)', padding: '12px var(--space-md)',
                    display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto',
                    gap: 'var(--space-md)', alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <p className="text-xs text-muted">ORDER PLACED</p>
                      <p className="text-sm font-semibold">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">TOTAL</p>
                      <p className="text-sm font-semibold">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">PAYMENT</p>
                      <span className={`badge ${getStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted">STATUS</p>
                      <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted">ORDER # {order._id.slice(-8).toUpperCase()}</p>
                      <Link to={`/account/orders/${order._id}`} className="text-link text-sm">
                        View details
                      </Link>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.orderStatus !== 'Cancelled' && (
                    <div style={{ padding: '12px var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                        {ORDER_STEPS.map((step, i) => (
                          <React.Fragment key={step}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: '50%',
                                background: i <= stepIndex ? 'var(--color-primary)' : 'var(--border-color)',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 700
                              }}>
                                {i < stepIndex ? '✓' : i + 1}
                              </div>
                              <span style={{ fontSize: 10, color: i <= stepIndex ? 'var(--color-primary)' : 'var(--text-secondary)', fontWeight: i === stepIndex ? 700 : 400 }}>
                                {step}
                              </span>
                            </div>
                            {i < ORDER_STEPS.length - 1 && (
                              <div style={{ flex: 1, height: 2, background: i < stepIndex ? 'var(--color-primary)' : 'var(--border-color)', margin: '0 4px', marginBottom: 16 }} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="card-body">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <img
                          src={item.image || 'https://placehold.co/50x50'}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 4, background: '#f8f8f8' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-sm text-muted">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted">+ {order.items.length - 3} more item(s)</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderHistoryPage;
