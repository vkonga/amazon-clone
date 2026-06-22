import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { orderApi } from '../api/orderApi';
import { formatPrice, formatDate, getStatusBadge } from '../utils/helpers';
import { FiPackage, FiShoppingBag, FiUsers, FiLayers, FiBarChart2, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: FiBarChart2 },
  { key: 'products',  label: 'Products',  icon: FiShoppingBag },
  { key: 'categories',label: 'Categories',icon: FiLayers },
  { key: 'orders',    label: 'Orders',    icon: FiPackage },
];

const AdminDashboard = () => {
  const [tab, setTab]           = useState('overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);

  // New category form
  const [catName, setCatName]   = useState('');
  const [catDesc, setCatDesc]   = useState('');

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', stock: '', images: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({ limit: 50 });
      setProducts(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const res = await productApi.getCategories();
      setCategories(res.data.data || []);
    } catch {}
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllOrders({ limit: 50 });
      setOrders(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
    if (tab === 'products')   loadProducts();
    if (tab === 'orders')     loadOrders();
    if (tab === 'overview')   { loadProducts(); loadOrders(); }
  }, [tab]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await productApi.createCategory({ name: catName, description: catDesc });
      toast.success('Category created!');
      setCatName(''); setCatDesc('');
      loadCategories();
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || 'Failed to create category');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productApi.createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        images: newProduct.images ? newProduct.images.split(',').map(s => s.trim()) : []
      });
      toast.success('Product created!');
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', images: '' });
      loadProducts();
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderApi.updateStatus(id, status);
      toast.success('Order status updated');
      loadOrders();
    } catch {
      toast.error('Failed to update order status');
    }
  };

  // Stats
  const totalRevenue  = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title">Admin Panel</div>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`admin-tab-${key}`}
            className={`admin-sidebar__link ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon size={16} />{label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="admin-content">
        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Dashboard Overview</h2>
            <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
              {[
                { icon: '📦', label: 'Total Products',  value: products.length,       border: 'var(--color-primary)' },
                { icon: '🛒', label: 'Total Orders',    value: orders.length,          border: '#0066c0' },
                { icon: '⏳', label: 'Pending Orders',  value: pendingOrders,          border: '#e68a00' },
                { icon: '💰', label: 'Total Revenue',   value: formatPrice(totalRevenue), border: 'var(--color-success)' },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ borderLeftColor: s.border }}>
                  <div className="stat-card__icon">{s.icon}</div>
                  <div>
                    <div className="stat-card__value">{s.value}</div>
                    <div className="stat-card__label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: 'var(--space-md)' }}>Recent Orders</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th><th>Date</th><th>Total</th>
                    <th>Payment</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o._id}>
                      <td>#{o._id.slice(-8).toUpperCase()}</td>
                      <td>{formatDate(o.createdAt)}</td>
                      <td>{formatPrice(o.totalAmount)}</td>
                      <td><span className={`badge ${getStatusBadge(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
                      <td><span className={`badge ${getStatusBadge(o.orderStatus)}`}>{o.orderStatus}</span></td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Products ── */}
        {tab === 'products' && (
          <>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Products</h2>

            {/* Create Product Form */}
            <div className="card card-body" style={{ marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Add New Product</h3>
              <form onSubmit={handleCreateProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-name">Name</label>
                    <input id="prod-name" className="form-control" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-price">Price ($)</label>
                    <input id="prod-price" className="form-control" type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-category">Category</label>
                    <select id="prod-category" className="form-control" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} required>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-stock">Stock</label>
                    <input id="prod-stock" className="form-control" type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" htmlFor="prod-desc">Description</label>
                    <textarea id="prod-desc" className="form-control" rows={3} value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" htmlFor="prod-images">Image URLs (comma-separated)</label>
                    <input id="prod-images" className="form-control" value={newProduct.images} onChange={e => setNewProduct(p => ({ ...p, images: e.target.value }))} placeholder="https://..." />
                  </div>
                </div>
                <button id="create-product-btn" type="submit" className="btn btn-primary mt-md">
                  <FiPlus /> Add Product
                </button>
              </form>
            </div>

            {/* Products Table */}
            {loading ? <Spinner /> : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                        <td>{p.category?.name || '—'}</td>
                        <td>{formatPrice(p.price)}</td>
                        <td>
                          <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td>⭐ {p.rating?.toFixed(1)} ({p.numReviews})</td>
                        <td>
                          <button
                            id={`delete-product-${p._id}`}
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No products yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Categories ── */}
        {tab === 'categories' && (
          <>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Categories</h2>
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div className="card card-body">
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Add Category</h3>
                <form onSubmit={handleCreateCategory}>
                  <div className="form-group mb-md">
                    <label className="form-label" htmlFor="cat-name">Category Name</label>
                    <input id="cat-name" className="form-control" value={catName} onChange={e => setCatName(e.target.value)} required />
                  </div>
                  <div className="form-group mb-md">
                    <label className="form-label" htmlFor="cat-desc">Description</label>
                    <textarea id="cat-desc" className="form-control" rows={3} value={catDesc} onChange={e => setCatDesc(e.target.value)} />
                  </div>
                  <button id="create-category-btn" type="submit" className="btn btn-primary">
                    <FiPlus /> Add Category
                  </button>
                </form>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Slug</th></tr>
                  </thead>
                  <tbody>
                    {categories.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td>{c.name}</td>
                        <td><code>{c.slug}</code></td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No categories yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>All Orders</h2>
            {loading ? <Spinner /> : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Date</th><th>Total</th>
                      <th>Payment</th><th>Status</th><th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td>#{o._id.slice(-8).toUpperCase()}</td>
                        <td>{formatDate(o.createdAt)}</td>
                        <td>{formatPrice(o.totalAmount)}</td>
                        <td><span className={`badge ${getStatusBadge(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
                        <td><span className={`badge ${getStatusBadge(o.orderStatus)}`}>{o.orderStatus}</span></td>
                        <td>
                          <select
                            className="form-control"
                            style={{ fontSize: 12, padding: '4px 6px' }}
                            value={o.orderStatus}
                            onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                            disabled={o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled'}
                          >
                            {['Pending','Confirmed','Shipped','Delivered','Cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
