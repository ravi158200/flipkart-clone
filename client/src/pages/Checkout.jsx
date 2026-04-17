import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, MapPin, CreditCard, Wallet, Landmark, ShieldCheck, CheckCircle2, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo } = useAuth();
    const { clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [product, setProduct] = useState(null);

    // Initial Load Logic: Detect single-product "Buy Now" or "Cart Checkout"
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const params = new URLSearchParams(location.search);
        const productId = params.get('id');
        
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.get(`/products/${productId}`);
                    setProduct(data);
                } catch (err) {
                    console.error('Checkout Product Sync Failure:', err);
                }
            };
            fetchProduct();
        }
    }, [location.search, userInfo]);

    const handleExecutePayment = async () => {
        setIsProcessing(true);
        try {
            // High-Fidelity Order Payload Assembly
            const orderPayload = {
                orderItems: product ? [{
                    product: product._id,
                    title: product.title,
                    quantity: 1,
                    image: product.images?.[0] || product.image,
                    price: product.price
                }] : [], // Simplified for single product flow requested
                shippingAddress: {
                    address: userInfo.address || 'Sector 126, Noida, U.P.',
                    city: 'Noida',
                    postalCode: '201303',
                    country: 'India'
                },
                paymentMethod: paymentMethod,
                itemsPrice: product?.price || 0,
                taxPrice: Number(((product?.price || 0) * 0.18).toFixed(2)),
                shippingPrice: 0,
                totalPrice: product?.price || 0
            };

            const { data } = await api.post('/orders', orderPayload);
            if (data) {
                // Success State Visualization
                setStep(3);
                setTimeout(() => {
                    navigate('/orders');
                }, 3000);
            }
        } catch (err) {
            alert('VAULT SETTLEMENT FAILED: Transaction could not be executed.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!product && step !== 3) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6]">
                <Loader2 className="animate-spin text-fb-blue" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-24 pb-20 italic font-black uppercase tracking-tighter">
            <div className="max-w-4xl mx-auto px-4">
                {/* Stepper Manifest */}
                <div className="flex justify-between items-center mb-16 relative px-10">
                    <div className="absolute top-1/2 left-10 right-10 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
                    {[
                        { s: 1, label: 'Asset Review' },
                        { s: 2, label: 'Payment Vault' },
                        { s: 3, label: 'Settlement' }
                    ].map((st) => (
                        <div key={st.s} className="flex flex-col items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all ${step >= st.s ? 'bg-fb-blue border-white text-white shadow-xl scale-110' : 'bg-white border-gray-100 text-gray-300'}`}>
                                {step > st.s ? <CheckCircle2 size={24} /> : <span className="text-xl italic font-black">{st.s}</span>}
                            </div>
                            <span className={`text-[10px] tracking-widest font-black uppercase ${step >= st.s ? 'text-fb-blue' : 'text-gray-300'}`}>{st.label}</span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Asset Review */}
                {step === 1 && (
                    <div className="space-y-10 animate-in slide-in-from-right-20 duration-500">
                        <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-gray-50 flex flex-col md:flex-row gap-10 items-center group">
                             <div className="w-48 h-48 bg-gray-50 rounded-[40px] p-6 border-2 border-transparent group-hover:border-blue-100 transition-all flex items-center justify-center shrink-0 shadow-inner">
                                <img src={product.images?.[0] || product.image} className="w-full h-full object-contain" alt={product.title} />
                             </div>
                             <div className="flex-1 space-y-4">
                                <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tighter italic decoration-8 decoration-blue-50 underline">{product.title}</h2>
                                <p className="text-[10px] font-black text-gray-400 tracking-[40%] uppercase italic">Verified Marketplace Asset ID: #{product._id.slice(-6)}</p>
                                <div className="text-5xl font-black text-fb-blue tracking-tighter">₹{product.price.toLocaleString()}</div>
                             </div>
                        </div>

                        <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-gray-50 flex justify-between items-center italic">
                             <div className="flex items-center gap-6">
                                <div className="bg-blue-50 p-4 rounded-3xl">
                                    <MapPin size={28} className="text-fb-blue shadow-sm" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Delivery Terminal</p>
                                    <p className="text-lg font-black text-gray-900 tracking-tight">{userInfo.name} <span className="opacity-40 ml-4 font-bold">[{userInfo.address || 'Sector 126, Noida'}]</span></p>
                                </div>
                             </div>
                             <button onClick={() => navigate('/profile')} className="text-fb-blue font-black text-[10px] tracking-widest border-4 border-blue-50 px-8 py-3 rounded-2xl bg-white shadow-lg uppercase">Update</button>
                        </div>

                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-fb-blue text-white py-8 rounded-[36px] font-black text-xs tracking-[8px] shadow-3xl shadow-blue-900 transition-all hover:scale-[1.02] active:scale-95 border-b-8 border-blue-900 flex items-center justify-center gap-4 italic"
                        >
                            Proceed to Payment Vault <ChevronRight size={24} />
                        </button>
                    </div>
                )}

                {/* Step 2: Payment Selector */}
                {step === 2 && (
                    <div className="space-y-10 animate-in slide-in-from-right-20 duration-500">
                        <div className="bg-white p-12 rounded-[56px] shadow-3xl border border-gray-100">
                             <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic border-l-8 border-fb-blue pl-8 mb-12">High-Fidelity Settlement</h2>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {[
                                    { id: 'Cash on Delivery', icon: Wallet, label: 'Cash on Delivery' },
                                    { id: 'Credit Card', icon: CreditCard, label: 'Credit Card (Secured)' },
                                    { id: 'Debit Card', icon: Landmark, label: 'Debit Card (Certified)' }
                                ].map((method) => (
                                    <button 
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex items-center justify-between p-8 rounded-[32px] border-4 transition-all ${paymentMethod === method.id ? 'border-fb-blue bg-blue-50/50 shadow-2xl shadow-blue-100' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`p-4 rounded-2xl ${paymentMethod === method.id ? 'bg-fb-blue text-white rotate-6 animate-pulse' : 'bg-gray-50 text-gray-300'}`}>
                                                <method.icon size={24} />
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-widest italic leading-none ${paymentMethod === method.id ? 'text-fb-blue' : 'text-gray-400'}`}>{method.label}</span>
                                        </div>
                                    </button>
                                ))}
                             </div>

                             <div className="p-10 bg-gray-50 rounded-[40px] border-2 border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-gray-400 text-[10px] tracking-[4px]">
                                    <span>Economic Yield Total</span>
                                    <span className="text-gray-900 text-xl font-black">₹{product.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-5xl font-black text-gray-900 pt-4 tracking-tighter">
                                    <span>DUE</span>
                                    <span className="text-fb-blue">₹{product.price.toLocaleString()}</span>
                                </div>
                             </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <button 
                                onClick={() => setStep(1)}
                                className="flex-1 bg-white text-gray-400 py-8 rounded-[36px] font-black text-xs tracking-widest border-4 border-gray-100 hover:bg-gray-50 transition-all italic flex items-center justify-center gap-4"
                            >
                                <ArrowLeft size={20} /> Back to Review
                            </button>
                            <button 
                                onClick={handleExecutePayment}
                                disabled={isProcessing}
                                className="flex-[2] bg-[#fb641b] text-white py-8 rounded-[36px] font-black text-xs tracking-[8px] shadow-3xl shadow-orange-900 transition-all hover:scale-[1.02] active:scale-95 border-b-8 border-orange-900 flex items-center justify-center gap-4 italic uppercase"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : <>Complete Settlement <ShieldCheck size={24} /></>}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success Terminal */}
                {step === 3 && (
                    <div className="bg-white p-20 rounded-[64px] shadow-3xl border border-gray-100 text-center space-y-10 animate-in zoom-in duration-700 italic">
                         <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                            <CheckCircle2 size={80} className="text-green-600 relative z-10" />
                         </div>
                         <div className="space-y-4">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase underline decoration-8 decoration-green-100">Settlement Success</h2>
                            <p className="text-[10px] font-black text-gray-400 tracking-[8px] uppercase">Transaction #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                         </div>
                         <p className="text-lg font-black text-gray-400 uppercase tracking-widest leading-relaxed">Redirecting to Order Ledger V4.2... <br/> Your assets are now being dispatched from the <span className="text-fb-blue">Noida Hub.</span></p>
                         <button onClick={() => navigate('/orders')} className="bg-fb-blue text-white px-16 py-6 rounded-3xl font-black text-[10px] tracking-[6px] shadow-2xl transition-all hover:scale-105 active:scale-95 border-b-6 border-blue-900">View Order Ledger</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Checkout;
