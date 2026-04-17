import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Plus, LogOut, MapPin, Bell, Ticket, Heart, Gift, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const moreRef = useRef(null);
  const profileRef = useRef(null);
  const { userInfo, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [location, setLocation] = useState('New Delhi, 110001');

  const [keyword, setKeyword] = useState('');

  const cartCount = getCartCount();

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation("Current Location");
        }, (err) => {
            console.log("Location access denied", err);
        });
    }

    // Click outside to close protocol
    const handleClickOutside = (event) => {
        if (moreRef.current && !moreRef.current.contains(event.target)) {
            setIsMoreOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsProfileOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#2874f0] h-14 flex items-center justify-center z-50 shadow-md">
      <div className="w-full max-w-6xl flex items-center px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center leading-none group">
          <img 
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png" 
            alt="Flipkart" 
            className="w-20 object-contain brightness-0 invert"
          />
          <div className="flex items-center gap-0.5 -mt-0.5">
            <span className="text-[10px] italic text-gray-200 group-hover:text-white transition-colors">
              Explore <span className="text-[#ffe500] font-bold">Plus</span>
            </span>
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png" alt="Plus" className="w-2.5 h-2.5" />
          </div>
        </Link>

        {/* Live Location Section */}
        <div className="hidden lg:flex items-center gap-1.5 cursor-pointer hover:bg-black/10 px-2 py-1.5 rounded-sm transition-colors group">
            <MapPin size={18} className="text-[#ffe500] group-hover:animate-bounce" />
            <div className="flex flex-col text-white leading-tight">
                <span className="text-[10px] font-medium text-blue-100 italic">Deliver to</span>
                <span className="text-sm font-black whitespace-nowrap tracking-tight">
                    {location}
                </span>
            </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[560px] bg-white h-9 flex items-center rounded-sm overflow-hidden px-4 shadow-sm group focus-within:shadow-md transition-shadow">
          <input 
            type="text" 
            placeholder="Search for products, brands and more"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full h-full border-none outline-none text-sm text-gray-700"
          />
          <Search size={18} className="text-[#2874f0] cursor-pointer hover:scale-110 transition-transform" onClick={handleSearch} />
        </div>

        {/* Right Nav Items */}
        <div className="flex items-center gap-8 pl-4">
          {userInfo ? (
            <>
                <div ref={profileRef} className="relative">
                    <div 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-1.5 text-white font-bold text-sm cursor-pointer select-none"
                    >
                        {userInfo?.profilePic ? (
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#ffe500] shadow-sm">
                                <img src={userInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#2874f0] text-[10px] font-black border border-[#ffe500]">
                                {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                        {userInfo?.name?.split(' ')[0] || 'User'}
                        <ChevronDown size={14} className={`${isProfileOpen ? 'rotate-180' : ''} transition-transform`} />
                    </div>
                    {/* Expanded Profile Dropdown */}
                    <div className={`absolute top-full -left-20 w-64 bg-white shadow-2xl mt-1 rounded-sm ${isProfileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all z-50 border border-gray-100`}>
                        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">My Account</span>
                            <span className="text-[10px] font-black uppercase text-gray-400 italic">{userInfo?.role?.toUpperCase() || 'USER'}</span>
                        </div>
                        
                        <div className="py-2">
                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item">
                                <User size={18} className="text-blue-600 group-hover/item:scale-110 transition-transform" /> My Profile
                            </Link>
                            <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item">
                                <Plus size={18} className="text-fb-blue group-hover/item:scale-110 transition-transform" /> Orders
                            </Link>
                            <Link to="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item">
                                <Heart size={18} className="text-pink-500 group-hover/item:scale-110 transition-transform" /> Wishlist
                            </Link>
                            <Link to="/notifications" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item">
                                <Bell size={18} className="text-yellow-500 group-hover/item:scale-110 transition-transform" /> Notifications
                            </Link>
                            <Link to="/coupons" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item">
                                <Ticket size={18} className="text-green-600 group-hover/item:scale-110 transition-transform" /> Coupons
                            </Link>
                            <Link to="/gift-cards" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item">
                                <Gift size={18} className="text-purple-600 group-hover/item:scale-110 transition-transform" /> Gift Cards
                            </Link>
                            <Link to="/profile?tab=address" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm group/item border-b">
                                <MapPin size={18} className="text-red-500 group-hover/item:scale-110 transition-transform" /> Saved Addresses
                            </Link>
    
                            {userInfo.role === 'admin' && (
                                <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-blue-600 hover:text-white bg-blue-50/50 text-fb-blue text-sm font-black border-b transition-colors group/admin">
                                    <Shield size={18} className="group-hover/admin:animate-pulse" /> Admin Console
                                </Link>
                            )}
                            {userInfo.role === 'retailer' && (
                                <Link to="/retailer-dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-[#fb641b] hover:text-white bg-orange-50/50 text-[#fb641b] text-sm font-black border-b transition-colors group/retailer">
                                    <Plus size={18} className="group-hover/retailer:rotate-90 transition-transform" /> Retailer Store
                                </Link>
                            )}
                            {userInfo.role === 'user' && (
                                <Link to="/seller-onboarding" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 text-fb-blue text-sm font-black border-b transition-colors group/seller">
                                    <Plus size={18} className="group-hover/seller:rotate-90 transition-transform" /> Become a Seller
                                </Link>
                            )}
    
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-black transition-colors"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
                {userInfo.role === 'user' && (
                    <Link to="/seller-onboarding" className="hidden lg:flex items-center gap-1.5 text-white font-black text-sm hover:scale-105 transition-all ml-4 py-1 px-2 hover:bg-white/10 rounded-sm">
                        <Plus size={18} className="text-[#ffe500]" />
                        Become a Seller
                    </Link>
                )}
            </>
          ) : (
            <Link to="/login" className="bg-white text-[#2874f0] px-8 py-1 rounded-sm font-semibold text-sm hover:bg-opacity-95">
                Login
            </Link>
          )}

          <Link to="/cart" className="flex items-center gap-2 text-white font-semibold text-sm group relative">
            <div className="relative">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#fb641b] text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#2874f0] animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

              <div 
                ref={moreRef}
                className="relative group cursor-pointer"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                <div className="flex items-center gap-1 text-white font-semibold text-sm">
                  More <ChevronDown size={14} className={isMoreOpen ? 'rotate-180 transition-all' : 'transition-all'} />
                </div>
                {isMoreOpen && (
                  <div className="absolute top-10 -left-10 w-48 bg-white shadow-xl rounded-sm py-2 text-gray-700 font-medium z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link to="/notifications" onClick={() => setIsMoreOpen(false)} className="block px-4 py-3 hover:bg-gray-100 text-sm border-b cursor-pointer transition-colors">Notifications</Link>
                    <Link to="/customer-care" onClick={() => setIsMoreOpen(false)} className="block px-4 py-3 hover:bg-gray-100 text-sm border-b cursor-pointer transition-colors">24x7 Customer Care</Link>
                    <Link to="/advertise" onClick={() => setIsMoreOpen(false)} className="block px-4 py-3 hover:bg-gray-100 text-sm border-b cursor-pointer transition-colors">Advertise</Link>
                    <Link to="/seller-onboarding" onClick={() => setIsMoreOpen(false)} className="block px-4 py-3 hover:bg-blue-50 text-fb-blue text-sm font-black cursor-pointer transition-colors italic">Become a Seller</Link>
                  </div>
                )}
              </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
