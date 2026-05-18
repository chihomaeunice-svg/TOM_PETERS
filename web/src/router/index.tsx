import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import SellerLayout from '../layouts/SellerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import BecomeASeller from '../pages/auth/BecomeASeller';

// Customer pages
import Home from '../pages/customer/Home';
import Shop from '../pages/customer/Shop';
import ProductDetail from '../pages/customer/ProductDetail';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Profile from '../pages/customer/Profile';
import OrderHistory from '../pages/customer/OrderHistory';
import Wishlist from '../pages/customer/Wishlist';

// Seller pages
import SellerDashboard from '../pages/seller/Dashboard';
import SellerProducts from '../pages/seller/Products';
import AddProduct from '../pages/seller/AddProduct';
import EditProduct from '../pages/seller/EditProduct';
import SellerOrders from '../pages/seller/Orders';
import SellerAccount from '../pages/seller/Account';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminSellers from '../pages/admin/SellersManagement';
import AdminSubscriptions from '../pages/admin/Subscriptions';
import AdminOrders from '../pages/admin/Orders';

function RequireRole({ role, children }: { role: string | string[]; children: JSX.Element }) {
  const { profile, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-tp-cream"><div className="animate-pulse-soft text-tp-gold font-display text-2xl">TOM PETERS</div></div>;
  if (!profile) return <Navigate to="/login" replace />;
  const allowed = Array.isArray(role) ? role.includes(profile.role) : profile.role === role;
  if (!allowed) return <Navigate to="/" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public / auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/become-a-seller" element={<BecomeASeller />} />

      {/* Customer routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<RequireRole role={['customer', 'seller', 'admin']}><Checkout /></RequireRole>} />
        <Route path="profile" element={<RequireRole role={['customer', 'seller', 'admin']}><Profile /></RequireRole>} />
        <Route path="orders" element={<RequireRole role={['customer', 'seller', 'admin']}><OrderHistory /></RequireRole>} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Seller routes */}
      <Route path="/seller" element={<RequireRole role="seller"><SellerLayout /></RequireRole>}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="account" element={<SellerAccount />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
        <Route index element={<AdminDashboard />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
