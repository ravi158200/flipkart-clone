import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Trash2, MapPin, ShieldCheck, ShoppingBag, Plus, Minus, ArrowLeft, CreditCard, Wallet, Landmark } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Cart = () => {
    const { userInfo } = useAuth();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    
    const subtotal = Number(getCartTotal() || 0);

    const handlePlaceOrder = async () => {
        if (!userInfo) {
            alert('Please login to place an order.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            const orderPayload = {
                orderItems: cartItems.map(item => ({
                    product: item._id || item.id,
                    title: item.title,
                    quantity: item.quantity,
                    image: item.images?.[0] || item.image,
                    price: Number(item.price)
                })),
                shippingAddress: {
                    address: userInfo.address || 'Sector 126, Noida',
                    city: 'Noida',
                    postalCode: '201303',
                    country: 'India'
                },
                paymentMethod: paymentMethod,
                itemsPrice: subtotal,
                taxPrice: Number((subtotal * 0.18).toFixed(2)),
                shippingPrice: 0,
                totalPrice: subtotal
            };

            const { data } = await api.post('/orders', orderPayload);
            
            if (data) {
                clearCart();
                navigate('/orders');
            }
        } catch (err) {
            console.error('Order Finalization Error:', err.response?.data || err.message);
            alert(`VAULT DIAGNOSTIC: Could not finalize transaction.`);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (location.state?.isExpress && userInfo && cartItems.length > 0 && !isProcessing) {
            handlePlaceOrder();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, userInfo, cartItems]);

    if (cartItems.length === 0) {
        return (
            <div className="bg-[#f1f3f6] min-h-screen flex flex-col items-center justify-center p-10 italic font-black uppercase">
                <div className="bg-white p-16 rounded-[48px] shadow-2xl flex flex-col items-center text-center max-w-md border border-gray-100">
                    <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                        <ShoppingCart size={64} className="text-fb-blue animate-bounce" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Inventory Empty</h1>
                    <p className="text-gray-400 font-bold text-sm mb-12 tracking-widest leading-relaxed">Your digital bag is waiting for marketplace assets.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-fb-blue text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest border-b-4 border-blue-800"
                    >
                        Explore Vault
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] min-h-screen py-12 pb-32 italic font-black uppercase">
            {isProcessing && (
                <div className="fixed inset-0 z-[500] bg-white/60 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <div className="bg-white p-16 rounded-[64px] shadow-2xl border border-gray-50 flex flex-col items-center gap-10 text-center max-w-md">
                        <div className="relative w-32 h-32">
                           <div className="absolute inset-0 border-[12px] border-gray-50 rounded-full"></div>
                           <div className="absolute inset-0 border-[12px] border-fb-blue border-t-transparent rounded-full animate-spin"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <ShieldCheck size={40} className="text-fb-blue" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none italic underline decoration-8 decoration-blue-100">Securing Transaction</h3>
                           <p className="text-[10px] font-black text-gray-400 tracking-[4px] leading-relaxed italic">Synchronizing with Payment Gateway AES-256...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 px-4">
                {/* Product Ledger */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white shadow-2xl rounded-[40px] p-10 flex flex-col md:flex-row justify-between items-center border border-gray-100 group hover:border-blue-300 transition-all gap-10">
                        <div className="flex items-center gap-8">
                            <div className="bg-blue-50 p-4 rounded-3xl group-hover:scale-110 transition-transform shadow-inner">
                                <MapPin size={32} className="text-fb-blue" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-gray-400 tracking-[30%] mb-2 italic">Delivery Terminal</p>
                                <p className="text-lg font-black text-gray-900 tracking-tighter italic">
                                    {userInfo ? (
                                        <>
                                            <span className="text-fb-blue">{userInfo.name}</span>
                                            <span className="text-gray-400 ml-4 font-bold opacity-60 text-sm">[{userInfo.address || 'Noida High-Fidelity Hub'}]</span>
                                        </>
                                    ) : (
                                        <Link to="/login" className="text-[#fb641b]">Login to Select Terminal</Link>
                                    )}
                                </p>
                            </div>
                        </div>
                        <Link to="/profile" className="text-fb-blue text-[10px] font-black border-4 border-blue-50 px-10 py-4 rounded-2xl hover:bg-fb-blue hover:text-white transition-all bg-white tracking-widest shadow-lg">Modify</Link>
                    </div>

                    <div className="bg-white shadow-3xl rounded-[56px] overflow-hidden border border-gray-50">
                        <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 italic">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-6">
                                <ShoppingBag size={32} className="text-fb-blue" /> Marketplace Bag ({cartItems.length})
                            </h2>
                            <button onClick={clearCart} className="text-[10px] font-black text-gray-400 hover:text-red-500 tracking-[4px] transition-colors underline">Clear Ledger</button>
                        </div>
                        
                        <div className="divide-y divide-gray-50">
                            {cartItems.map((item) => (
                                <div key={item._id || item.id} className="p-12 flex flex-col md:flex-row gap-12 group hover:bg-gray-50/50 transition-all duration-500">
                                    <div className="w-48 h-48 p-6 border-2 border-gray-50 rounded-[40px] bg-white shadow-inner group-hover:scale-105 transition-all overflow-hidden flex items-center justify-center shrink-0">
                                        <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/200'} className="h-full w-full object-contain" alt={item.title || 'Product'} />
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="flex justify-between items-start gap-4">
                                            <Link to={`/product/${item._id || item.id}`} className="text-2xl font-black text-gray-900 leading-[1.1] hover:text-fb-blue transition-colors tracking-tighter line-clamp-2 italic">{item.title || 'Marketplace Asset'}</Link>
                                            <div className="bg-green-50 text-green-700 text-[8px] font-black px-4 py-1.5 rounded-full tracking-widest shrink-0 border border-green-100 shadow-sm animate-pulse">VERIFIED_STOCK</div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6 pt-2">
                                            <span className="text-4xl font-black text-gray-900 tracking-tighter italic">₹{item.price.toLocaleString()}</span>
                                            <span className="bg-blue-50 text-fb-blue px-3 py-1 rounded-lg text-[9px] font-black tracking-widest italic border border-blue-100">x{item.quantity}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-12 pt-6">
                                            <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl border-2 border-gray-100 italic font-black">
                                                <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg hover:text-red-600 transition-all border border-gray-100"><Minus size={18} /></button>
                                                <span className="font-black text-gray-900 w-8 text-center text-xl">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg hover:text-fb-blue transition-all border border-gray-100"><Plus size={18} /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id || item.id)} className="text-[10px] font-black text-gray-300 hover:text-red-500 transition-all underline tracking-[3px] italic uppercase">Remove Asset</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center bg-gray-50/20 gap-10">
                            <button onClick={() => navigate('/')} className="flex items-center gap-4 text-xs font-black text-fb-blue tracking-widest hover:translate-x-[-10px] transition-transform"><ArrowLeft size={20} /> Marketplace Home</button>
                            <button onClick={handlePlaceOrder} className="w-full md:w-auto bg-[#fb641b] text-white px-24 py-6 rounded-3xl font-black shadow-3xl shadow-orange-900 hover:scale-105 active:scale-95 transition-all text-xs tracking-[5px] border-b-6 border-orange-900 uppercase italic">Execute Settlement</button>
                        </div>
                    </div>
                </div>

                {/* Economic & Payment Terminal */}
                <aside className="w-full lg:w-[450px] space-y-8 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white p-12 rounded-[56px] shadow-3xl border border-gray-100 overflow-hidden animate-in slide-in-from-right-12 duration-1000 italic">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic border-l-8 border-fb-blue pl-8 mb-10 decoration-8 decoration-blue-50 underline underline-offset-4">Payment Vault</h3>
                        
                        <div className="space-y-4 mb-12">
                             {[
                                { id: 'Cash on Delivery', icon: Wallet, label: 'Cash on Delivery' },
                                { id: 'Credit Card', icon: CreditCard, label: 'Credit Card (High-Fi)' },
                                { id: 'Debit Card', icon: Landmark, label: 'Debit Card (Certified)' }
                             ].map((method) => (
                                <button 
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`w-full flex items-center justify-between p-8 rounded-[32px] border-4 transition-all group ${paymentMethod === method.id ? 'border-fb-blue bg-blue-50 shadow-2xl shadow-blue-100 scale-[1.02]' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl transition-all shadow-sm ${paymentMethod === method.id ? 'bg-fb-blue text-white rotate-6' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                            <method.icon size={24} />
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest italic ${paymentMethod === method.id ? 'text-fb-blue' : 'text-gray-500'}`}>{method.label}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${paymentMethod === method.id ? 'border-fb-blue bg-white' : 'border-gray-50'}`}>
                                        {paymentMethod === method.id && <div className="w-3.5 h-3.5 rounded-full bg-fb-blue animate-pulse"></div>}
                                    </div>
                                </button>
                             ))}
                        </div>

                        <div className="space-y-8 text-sm font-black text-gray-900 pt-10 border-t border-gray-50">
                            <div className="flex justify-between items-center text-gray-400 text-[10px] tracking-widest">
                                <span>Yield Total ({cartItems.length} items)</span>
                                <span className="text-gray-900 text-xl tracking-tighter">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-4xl font-black text-gray-900 pt-6 tracking-tighter">
                                <span>Payable</span>
                                <span className="text-fb-blue underline decoration-fb-blue/20">₹{subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[40px] border-4 border-dashed border-blue-100 flex items-center gap-8 group hover:border-blue-400 transition-all shadow-inner">
                             <div className="bg-white p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform text-fb-blue">
                                <ShieldCheck size={36} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-blue-900 uppercase tracking-[4px]">Secured Hub</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-1 tracking-widest underline italic">Flipkart Protocol V3.1 Enforced</p>
                             </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Cart;
