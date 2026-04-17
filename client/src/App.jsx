import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import RetailerDashboard from './pages/RetailerDashboard';
import Invoice from './pages/Invoice';
import CustomerCare from './pages/CustomerCare';
import Advertise from './pages/Advertise';
import Community from './pages/Community';
import Wishlist from './pages/Wishlist';
import Coupons from './pages/Coupons';
import GiftCards from './pages/GiftCards';
import Notifications from './pages/Notifications';
import SellerLanding from './pages/SellerLanding';
import Checkout from './pages/Checkout';

import CategoryPage from './pages/CategoryPage';
import SellerNavbar from './components/SellerNavbar';
import { CartProvider } from './context/CartContext';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isSellerRoute = 
    location.pathname === '/seller-onboarding' || 
    location.pathname === '/retailer-dashboard' ||
    (location.pathname === '/signup' && queryParams.get('role') === 'retailer') ||
    (location.pathname === '/login' && queryParams.get('type') === 'seller');

  return (
    <div className="flex flex-col min-h-screen">
      {isSellerRoute ? <SellerNavbar /> : <Navbar />}
      <main className={`flex-grow ${isSellerRoute ? 'pt-20' : 'pt-14'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
            <Route path="/seller/dashboard" element={<RetailerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/customer-care" element={<CustomerCare />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/seller-onboarding" element={<SellerLanding />} />
            <Route path="/community" element={<Community />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
