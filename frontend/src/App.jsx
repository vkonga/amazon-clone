import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Spinner from './components/common/Spinner';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Lazy-loaded pages for code splitting
const HomePage         = lazy(() => import('./pages/HomePage'));
const ProductListPage  = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage= lazy(() => import('./pages/ProductDetailPage'));
const CartPage         = lazy(() => import('./pages/CartPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const ProfilePage      = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'));

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', gap: 16 }}>
    <div style={{ fontSize: 80 }}>🔍</div>
    <h1>404 – Page Not Found</h1>
    <p style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
    <a href="/" className="btn btn-primary btn-lg btn-rounded">Go to Homepage</a>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />

          <div style={{ flex: 1 }}>
            <Suspense fallback={<Spinner fullPage />}>
              <Routes>
                {/* Public */}
                <Route path="/"            element={<HomePage />} />
                <Route path="/products"    element={<ProductListPage />} />
                <Route path="/search"      element={<ProductListPage />} />
                <Route path="/products/:id"element={<ProductDetailPage />} />
                <Route path="/cart"        element={<CartPage />} />
                <Route path="/login"       element={<LoginPage />} />
                <Route path="/register"    element={<RegisterPage />} />

                {/* Protected — Customer */}
                <Route path="/checkout"    element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                <Route path="/account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Admin only */}
                <Route path="/admin"       element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/*"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>

          <Footer />
        </div>

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: 14,
              background: '#232F3E',
              color: '#fff',
              borderLeft: '4px solid #FF9900',
            },
            success: { style: { borderLeftColor: '#007600' } },
            error:   { style: { borderLeftColor: '#c40000' } },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
