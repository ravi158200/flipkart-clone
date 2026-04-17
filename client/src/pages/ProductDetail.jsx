import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, ShieldCheck, Tag, Star, ChevronLeft } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { userInfo } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const premiumDeals = [
        { id: 'p1', title: 'NeoBook Pro X15', price: 89999, originalPrice: 110000, rating: 4.9, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', description: 'Experience the next generation of computing with-high performance processing and crystal-clear display.', category: 'Electronics' },
        { id: 'p2', title: 'Sonic Zenith Buds', price: 12999, originalPrice: 19999, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', description: 'Crystal-clear audio with hybrid active noise cancellation for the perfect sound experience.', category: 'Electronics' },
        { id: 'f1', title: 'Avenue Luxe Suit', price: 15499, originalPrice: 22000, rating: 4.8, image: 'https://images.unsplash.com/photo-1594932224440-7cd3b94689c1?auto=format&fit=crop&w=800&q=80', description: 'Tailored for perfection, the Avenue Luxe Suit brings modern elegance to any occasion.', category: 'Fashion' },
        { id: 'f2', title: 'Chrono Gold Heritage', price: 24999, originalPrice: 35000, rating: 4.9, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80', description: 'A timeless piece with high-precision movement and classic gold finish.', category: 'Fashion' }
    ];

    const handleAddToCart = () => {
        addToCart(product);
        // Maybe show a toast here?
    };

    const handleBuyNow = () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        navigate(`/checkout?id=${id}`);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const premiumItem = premiumDeals.find(item => item.id === id);
            if (premiumItem) {
                setProduct(premiumItem);
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-2-results_2353c5.png" alt="No product" className="w-64 mb-6" />
                <h1 className="text-xl font-bold text-gray-800">Product not found!</h1>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-6 bg-blue-600 text-white px-8 py-2 rounded-lg font-black shadow-lg"
                >
                    Back to Homepage
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] min-h-screen py-8 pb-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4">
                {/* Image Section */}
                <div className="w-full lg:w-[40%] bg-white p-6 md:p-10 flex flex-col items-center gap-6 lg:sticky lg:top-24 h-fit rounded-2xl shadow-sm border border-gray-100 group">
                    <button 
                        onClick={() => navigate(-1)}
                        className="self-start flex items-center gap-2 text-gray-400 font-bold hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-2"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    <div className="w-full aspect-square border border-gray-50 flex items-center justify-center rounded-2xl bg-gray-50/30 overflow-hidden">
                        <img 
                            src={product.image || (product.images && product.images[0])} 
                            className="h-full w-full object-contain transform transition-transform duration-1000 group-hover:scale-110" 
                            alt={product.title} 
                        />
                    </div>
                    <div className="flex gap-4 w-full">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#ff9f00] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            className="flex-1 bg-[#fb641b] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <Zap size={20} /> Buy Now
                        </button>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in fade-in slide-in-from-right-12 duration-1000">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        <span>{product.category || 'Product Details'}</span>
                        <span className="text-gray-200">/</span>
                        <span className="text-blue-600">{product.title}</span>
                    </div>
                    
                    <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight mb-3">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-[12px] font-black flex items-center gap-1 shadow-md shadow-green-100">
                            {product.rating || '4.2'} <Star size={14} fill="white" />
                        </div>
                        <span className="text-gray-400 font-bold text-sm tracking-tight border-r border-gray-200 pr-4">2,564 Ratings & 482 Reviews</span>
                        <img src="https://static-assets-web.flixcart.com/batman-returns/static/content/img/fa_62673a.png" className="h-5 ml-2" alt="f-assured" />
                    </div>

                    <div className="flex items-baseline gap-4 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{product.price?.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="text-gray-400 font-bold line-through text-lg tracking-tight">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-green-600 font-black text-xl uppercase tracking-widest">20% OFF</span>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-black text-gray-900 text-[10px] tracking-[3px] uppercase border-b-2 border-blue-600 w-fit pb-1 mb-6">Product Description</h3>
                            <p className="text-base text-gray-600 leading-relaxed font-medium">
                                {product.description || 'Elevate your lifestyle with this premium top-tier product, designed for individuals who demand the absolute best in design, durability, and high-performance functionality.'}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-black text-gray-900 text-[10px] tracking-[3px] uppercase border-b-2 border-blue-600 w-fit pb-1 mb-6">Available Offers</h3>
                            <div className="space-y-4">
                                <p className="text-sm font-bold flex items-start gap-4 text-gray-700">
                                    <Tag size={18} className="text-green-600 shrink-0 mt-0.5" /> 
                                    <span>Bank Offer <span className="font-medium text-gray-500 line-clamp-1">10% instant discount on Bank Cards up to ₹1,500.</span> <span className="text-blue-600 font-black cursor-pointer hover:underline text-[10px] ml-2">T&C</span></span>
                                </p>
                                <p className="text-sm font-bold flex items-start gap-4 text-gray-700">
                                    <Tag size={18} className="text-green-600 shrink-0 mt-0.5" /> 
                                    <span>Partner Offer <span className="font-medium text-gray-500 line-clamp-1">Buy this product and get extra ₹500 off on your next purchase.</span> <span className="text-blue-600 font-black cursor-pointer hover:underline text-[10px] ml-2">T&C</span></span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 p-8 bg-blue-600/5 rounded-3xl border-2 border-dashed border-blue-100 flex items-center gap-6 group hover:border-blue-300 transition-all">
                            <div className="bg-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-black text-gray-900 tracking-tight text-lg">1 Year Brand Warranty</p>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Authorized Seller Guarantee</p>
                            </div>
                        </div>

                        {product.seller && (
                            <div className="flex-1 p-8 bg-gray-50/80 rounded-3xl border-2 border-transparent hover:border-gray-200 transition-all flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-100 shadow-md">
                                    {product.seller.profilePic ? (
                                        <img src={product.seller.profilePic} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-blue-600 font-black text-xl">{product.seller.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-gray-900 leading-none">{product.seller.name}</p>
                                        <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase italic">PLUS RETAILER</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Top Rated Flipkart Partner</p>
                                    <button className="text-[9px] font-black text-blue-600 uppercase mt-2 tracking-[2px] transition-all hover:bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit">View Store Information</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
