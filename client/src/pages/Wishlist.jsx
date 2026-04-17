import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ShieldCheck, ChevronLeft, Star, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const { addToCart, removeFromCart, cartItems, updateQuantity } = useCart();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const isInCart = (id) => cartItems.some(item => item.id === id || item._id === id);
    const getItemQty = (id) => cartItems.find(item => item.id === id || item._id === id)?.quantity || 0;

    useEffect(() => {
        // High-Fidelity Wishlist Simulation
        // In a real app, this would fetch from /users/wishlist
        setLoading(true);
        setTimeout(() => {
            setWishlistItems([
                { id: 'w1', title: 'NeoBook Pro X15 (Silver Ed.)', price: 89999, rating: 4.9, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80', stock: 'In Stock' },
                { id: 'w2', title: 'Luxe Crimson Suede Sneakers', price: 7999, rating: 4.7, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', stock: 'Limited Stock' }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const handleRemove = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    if (!userInfo) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] pt-28 flex flex-col items-center">
                <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-md w-full border border-gray-100 flex flex-col items-center gap-6">
                    <div className="bg-pink-50 p-6 rounded-full">
                        <Heart size={64} className="text-pink-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Login Required</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Please access your account to view your curated high-fidelity wishlist.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-fb-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100"
                    >
                        LOGIN TO PROCEED
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4 italic">
            <div className="max-w-5xl mx-auto">
                {/* Header Terminal */}
                <div className="flex justify-between items-end mb-10 relative z-10 px-4">
                    <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-4 not-italic"
                        >
                            <ChevronLeft size={16} /> Return to Market
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none italic border-l-8 border-pink-500 pl-6">My Wishlist</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[6px] mt-4 ml-6 italic">Curated Selection ({wishlistItems.length} items)</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-lg hidden md:block">
                        <p className="text-[10px] font-black uppercase text-pink-500 tracking-widest">SAVED ASSETS</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1,2].map(i => <div key={i} className="bg-white h-48 rounded-[40px] animate-pulse"></div>)}
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden not-italic">
                        {wishlistItems.map((item, idx) => (
                            <div key={item.id} className={`p-8 flex flex-col md:flex-row items-center gap-8 ${idx !== wishlistItems.length - 1 ? 'border-b border-gray-50' : ''} group hover:bg-gray-50 transition-colors`}>
                                {/* Product Image */}
                                <div className="w-40 h-40 bg-gray-50 rounded-3xl p-4 shrink-0 flex items-center justify-center relative overflow-hidden">
                                     <img src={item.image} alt={item.title} className="h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-gray-900 line-clamp-1 uppercase tracking-tight">{item.title}</h3>
                                            <div className="flex items-center gap-3">
                                                 <div className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                                    {item.rating} <Star size={10} fill="white" />
                                                 </div>
                                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Verified</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="space-y-1">
                                            <p className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{item.price.toLocaleString()}</p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${item.stock === 'In Stock' ? 'text-green-600' : 'text-orange-500'}`}>{item.stock}</p>
                                        </div>
                                        
                                        {/* Action Bridge */}
                                        {isInCart(item.id) ? (
                                             <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 italic">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, getItemQty(item.id) - 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-blue-600 font-black hover:bg-fb-blue hover:text-white transition-all shadow-sm"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-black text-blue-600 text-base w-6 text-center italic">{getItemQty(item.id)}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, getItemQty(item.id) + 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-blue-600 font-black hover:bg-fb-blue hover:text-white transition-all shadow-sm"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                             </div>
                                        ) : (
                                            <button 
                                                onClick={() => addToCart(item)}
                                                className="bg-[#2874f0] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all outline-none italic"
                                            >
                                                <ShoppingBag size={14} /> Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-24 rounded-[48px] shadow-2xl text-center space-y-8 flex flex-col items-center border border-gray-50">
                        <div className="bg-gray-50 p-12 rounded-full shadow-inner">
                            <Heart size={80} className="text-gray-200" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Your Wishlist is Empty</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic max-w-md mx-auto">Explore high-fidelity products and save your favorites to your curated vault for later.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-fb-blue text-white px-12 py-4 rounded-3xl font-black text-xs uppercase tracking-[4px] shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all outline-none not-italic"
                        >
                            START EXPLORING
                        </button>
                    </div>
                )}

                {/* Secure Badge */}
                <div className="mt-12 flex justify-center items-center gap-6 opacity-40">
                    <ShieldCheck size={28} className="text-blue-600" />
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-[4px]">Verified Wishlist Data Vault (Secured)</p>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
