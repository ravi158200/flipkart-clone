import React, { useState, useEffect } from 'react';
import CategoryBar from '../components/CategoryBar';
import { ChevronRight, ShoppingBag, Star, Heart, Plus, ShieldCheck, Minus } from 'lucide-react';
import api from '../utils/api';
import Banner from '../components/Banner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Home = () => {
  const { userInfo } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isInCart = (id) => cartItems.some(item => item.id === id || item._id === id);
  const getItemQty = (id) => cartItems.find(item => item.id === id || item._id === id)?.quantity || 0;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword');
  const category = queryParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Failsafe timeout to prevent infinite loading state
                const timeoutId = setTimeout(() => {
                    if (loading) setLoading(false);
                }, 5000);

                const { data: pData } = await api.get('/products', {
                    params: { keyword, category }
                });
                
                clearTimeout(timeoutId);
                setProducts(pData || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching marketplace data:', err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category, userInfo]);

  // Premium Electronics Deals for high-end preview
  const premiumElectronics = [
      { id: 'p1', title: 'NeoBook Pro X15', price: 89999, rating: 4.9, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80', isNew: true },
      { id: 'p2', title: 'Sonic Zenith Buds', price: 12999, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', isNew: true },
      { id: 'p3', title: 'SkyGlass OLED 55', price: 145999, rating: 4.7, image: 'https://images.unsplash.com/photo-1593359677771-482062143fff?auto=format&fit=crop&w=400&q=80' },
      { id: 'p4', title: 'Horizon Smart Watch', price: 15999, rating: 4.8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
      { id: 'p5', title: 'Eon VR Headset', price: 54999, rating: 4.6, image: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&w=400&q=80' },
      { id: 'p6', title: 'Pulse Speaker Z', price: 7999, rating: 4.5, image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=400&q=80' }
  ];

  // Premium Fashion Deals for high-end preview
  const premiumFashion = [
      { id: 'f1', title: 'Avenue Luxe Suit', price: 15499, rating: 4.8, image: 'https://images.unsplash.com/photo-1594932224440-7cd3b94689c1?auto=format&fit=crop&w=400&q=80', isNew: true },
      { id: 'f2', title: 'Chrono Gold Heritage', price: 24999, rating: 4.9, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&q=80', isNew: true },
      { id: 'f3', title: 'Luxe Crimson Suede', price: 7999, rating: 4.7, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
      { id: 'f4', title: 'Oasis Ivory Dress', price: 4999, rating: 4.6, image: 'https://images.unsplash.com/photo-1539109132332-6906bf3bf093?auto=format&fit=crop&w=400&q=80' },
      { id: 'f5', title: 'Urban Edge Denim', price: 3499, rating: 4.5, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80' },
      { id: 'f6', title: 'Aura Silk Scarf', price: 1299, rating: 4.8, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80' }
  ];

  const handleQuickAdd = (e, item) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(item);
  };

  const handleUpdateQty = (e, id, qty) => {
      e.preventDefault();
      e.stopPropagation();
      updateQuantity(id, qty);
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <CategoryBar />
      
      <div className="max-w-[1580px] mx-auto px-2 mt-4 space-y-4 pb-12">
        {(keyword || category) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-50 mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                        {category ? `Category: ${category}` : `Search Results for "${keyword}"`}
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Found {products.length} products
                    </p>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 uppercase tracking-[2px] transition-all"
                >
                  Clear Filters
                </button>
            </div>
        )}

        {/* Search Results */}
        {(keyword || category) && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 bg-white p-8 rounded-xl shadow-sm">
                {products.map((item) => (
              <Link to={`/product/${item._id || item.id}`} key={item._id || item.id} className="bg-white p-6 flex flex-col items-center hover:shadow-2xl transition-all cursor-pointer group rounded-3xl border border-gray-50 hover:border-blue-100 min-w-[280px] snap-center relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                   <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-50 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <Heart size={16} className="text-gray-400 hover:text-pink-500 transition-colors" />
                   </div>
                </div>
                <div className="h-52 w-full flex items-center justify-center p-4 mb-6 relative overflow-hidden bg-gray-50/30 rounded-2xl">
                  <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/300'} alt={item.title} className="h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="w-full space-y-3">
                  <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-black shadow-sm shadow-green-100">{item.rating || '4.5'} <Star size={10} fill="white" /></div>
                    <p className="text-[10px] font-bold text-gray-400">(2,143)</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-gray-900 tracking-tighter italic">₹{item.price.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">{item.discount || '20'}% OFF</span>
                    </div>
                    {isInCart(item._id || item.id) ? (
                        <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-xl border border-blue-100">
                             <button onClick={(e) => handleUpdateQty(e, item._id || item.id, getItemQty(item._id || item.id) - 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Minus size={14} /></button>
                             <span className="font-black text-blue-600 text-sm w-4 text-center">{getItemQty(item._id || item.id)}</span>
                             <button onClick={(e) => handleUpdateQty(e, item._id || item.id, getItemQty(item._id || item.id) + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Plus size={14} /></button>
                        </div>
                    ) : (
                        <div onClick={(e) => handleQuickAdd(e, item)} className="bg-blue-600/5 text-blue-600 p-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Plus size={16} /></div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            </div>
        )}

        {/* Empty Search */}
        {(keyword || category) && products.length === 0 && !loading && (
            <div className="bg-white p-20 rounded-xl shadow-sm text-center flex flex-col items-center gap-6">
                <div className="bg-gray-50 p-10 rounded-full"><ShoppingBag size={64} className="text-gray-200" /></div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase">No results found</h2>
                    <p className="text-gray-400 font-bold mt-2">Try generic terms or check category list.</p>
                </div>
            </div>
        )}

        {/* Homepage Sections */}
        {!keyword && !category && (
            <>
                <Banner />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80", title: "Beauty & Wellness", subtitle: "Premium Skincare", accent: "bg-pink-500", gradient: "from-pink-600/60" },
                    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", title: "Home & Kitchen", subtitle: "Essentials", accent: "bg-amber-500", gradient: "from-amber-600/60" },
                    { url: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80", title: "Top Travel Deals", subtitle: "Dream destinations", accent: "bg-blue-500", gradient: "from-blue-600/60" }
                  ].map((promo, idx) => (
                    <div key={idx} className="relative aspect-square md:aspect-[1.1/1] group cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                       <img src={promo.url} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className={`absolute inset-0 bg-gradient-to-t ${promo.gradient} opacity-60`} />
                       <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
                          <div className={`w-8 h-1 ${promo.accent} mb-3 group-hover:w-16 transition-all duration-500`} />
                          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{promo.title}</h3>
                          <p className="text-sm font-bold text-white/80 uppercase tracking-widest">{promo.subtitle}</p>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Electronics */}
                <section className="bg-white p-6 shadow-sm rounded-xl">
                  <div className="flex justify-between items-center mb-8 border-b pb-6">
                    <h2 className="text-2xl font-black text-gray-900 uppercase">Electronics Deals</h2>
                    <button onClick={() => navigate('/category/electronics')} className="bg-[#2874f0] text-white px-6 py-2 rounded-lg text-xs font-black uppercase">View All</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {(products.filter(p => p.category === 'Electronics').length > 0 ? products.filter(p => p.category === 'Electronics') : premiumElectronics).slice(0, 6).map((item) => (
                      <Link to={`/product/${item._id || item.id}`} key={item._id || item.id} className="group p-4 flex flex-col items-center hover:shadow-xl transition-all border rounded-2xl">
                        <div className="h-44 w-full flex items-center justify-center p-2 mb-4 bg-gray-50 rounded-xl">
                          <img src={item.images?.[0] || item.image} alt={item.title} className="h-full object-contain group-hover:scale-110 transition-all" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 uppercase text-center">{item.title}</h3>
                        <p className="text-lg font-black text-gray-900 mt-2 italic">₹{item.price.toLocaleString()}</p>
                        {isInCart(item._id || item.id) ? (
                            <div className="flex items-center gap-2 mt-4 bg-blue-50 p-1 rounded-lg">
                                <button onClick={(e) => handleUpdateQty(e, item._id || item.id, getItemQty(item._id || item.id) - 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow text-blue-600"><Minus size={12} /></button>
                                <span className="text-xs font-black text-blue-600">{getItemQty(item._id || item.id)}</span>
                                <button onClick={(e) => handleUpdateQty(e, item._id || item.id, getItemQty(item._id || item.id) + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow text-blue-600"><Plus size={12} /></button>
                            </div>
                        ) : (
                            <button onClick={(e) => handleQuickAdd(e, item)} className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:scale-110 transition-all"><Plus size={12} /></button>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Fashion */}
                <section className="bg-white p-6 shadow-sm rounded-xl">
                  <div className="flex justify-between items-center mb-8 border-b pb-6">
                    <h2 className="text-2xl font-black text-gray-900 uppercase">Fashion Finds</h2>
                    <button onClick={() => navigate('/category/fashion')} className="bg-[#fb641b] text-white px-6 py-2 rounded-lg text-xs font-black uppercase">View All</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {(products.filter(p => p.category === 'Fashion').length > 0 ? products.filter(p => p.category === 'Fashion') : premiumFashion).slice(0, 6).map((item) => (
                      <Link to={`/product/${item._id || item.id}`} key={item._id || item.id} className="group p-4 flex flex-col items-center hover:shadow-xl transition-all border rounded-2xl">
                        <div className="h-44 w-full flex items-center justify-center p-2 mb-4 bg-gray-50 rounded-xl">
                          <img src={item.images?.[0] || item.image} alt={item.title} className="h-full object-cover rounded-lg group-hover:scale-110 transition-all" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 uppercase text-center">{item.title}</h3>
                        <p className="text-lg font-black text-gray-900 mt-2 italic">₹{item.price.toLocaleString()}</p>
                        {isInCart(item._id || item.id) ? (
                            <div className="flex items-center gap-2 mt-4 bg-orange-50 p-1 rounded-lg">
                                <button onClick={(e) => handleUpdateQty(e, item._id || item.id, getItemQty(item._id || item.id) - 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow text-orange-600"><Minus size={12} /></button>
                                <span className="text-xs font-black text-orange-600">{getItemQty(item._id || item.id)}</span>
                                <button onClick={(e) => handleUpdateQty(e, item._id || item.id, getItemQty(item._id || item.id) + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow text-orange-600"><Plus size={12} /></button>
                            </div>
                        ) : (
                            <button onClick={(e) => handleQuickAdd(e, item)} className="mt-4 bg-[#fb641b] text-white p-2 rounded-lg hover:scale-110 transition-all"><Plus size={12} /></button>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
            </>
        )}
      </div>
    </div>
  );
};

export default Home;
