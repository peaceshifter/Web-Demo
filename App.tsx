
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { StoreFront } from './pages/StoreFront';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminCategories } from './pages/AdminCategories';
import { AdminSettings } from './pages/AdminSettings';
import { AdminUsers } from './pages/AdminUsers';
import { Login } from './pages/Login';
import { CustomerAuth } from './pages/CustomerAuth';
import { ProductDetails } from './pages/ProductDetails';
import { OrderTracking } from './pages/OrderTracking';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';

// Protected Route Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useApp();
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<CustomerAuth />} />
          
          <Route path="/" element={<MainLayout />}>
            {/* Redirect root to first store */}
            <Route index element={<Navigate to="/store/store1" replace />} />
            
            {/* Public Routes */}
            <Route path="store/:storeId" element={<StoreFront />} />
            <Route path="store/:storeId/product/:productId" element={<ProductDetails />} />
            <Route path="track-order" element={<OrderTracking />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:orderId" element={<OrderSuccess />} />
            
            {/* Protected Admin Routes */}
            <Route path="admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="admin/products" element={
              <ProtectedAdminRoute>
                <AdminProducts />
              </ProtectedAdminRoute>
            } />
            <Route path="admin/categories" element={
              <ProtectedAdminRoute>
                <AdminCategories />
              </ProtectedAdminRoute>
            } />
             <Route path="admin/users" element={
              <ProtectedAdminRoute>
                <AdminUsers />
              </ProtectedAdminRoute>
            } />
             <Route path="admin/settings" element={
              <ProtectedAdminRoute>
                <AdminSettings />
              </ProtectedAdminRoute>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
