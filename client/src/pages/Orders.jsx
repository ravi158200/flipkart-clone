import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, ChevronRight, MapPin, Clock, ShieldCheck, FileText, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Orders = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                const augmented = data.map(order => ({
                    ...order,
                    tracking: [
                        { status: 'Order Confirmed', time: new Date(order.createdAt).toLocaleString(), completed: true },
                        { status: 'Processing vault push', time: 'Completed', completed: true },
                        { status: 'Out for Delivery', time: order.status === 'Delivered' ? 'Completed' : 'Estimated 2 days', completed: order.status === 'Delivered' },
                        { status: 'Delivered', time: order.status === 'Delivered' ? 'Handed Over' : 'Pending', completed: order.status === 'Delivered' }
                    ]
                }));
                setOrders(augmented);
            } catch (err) {
                console.error('Vault Retrieval Error:', err);
            } finally {
                setLoading(false);
            }
        };
        if (userInfo) fetchOrders();
    }, [userInfo]);

    const filteredOrders = orders.filter(o => activeTab === 'All' || o.status === activeTab);

    const handleViewInvoice = (id) => {
        navigate(`/invoice/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-28 pb-20 italic font-black uppercase tracking-tighter">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10">
                     <div className="flex-1">
                        <button 
                            onClick={() => navigate('/')} 
                            className="flex items-center gap-2 text-gray-400 font-black hover:text-fb-blue transition-colors uppercase text-[10px] tracking-widest mb-4 not-italic"
                        >
                            <ChevronLeft size={16} /> Return to Market
                        </button>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none border-l-8 border-fb-blue pl-8 italic">My Order Ledger</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[6px] mt-4 ml-8 italic">Verified Transaction & Fulfillment History</p>
                     </div>
                     <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-[32px] shadow-3xl shadow-blue-100 border border-gray-50 italic">
                        {['All', 'Confirmed', 'Delivered'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-fb-blue text-white shadow-2xl shadow-blue-100 scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {t}
                            </button>
                        ))}
                     </div>
                </div>

                {filteredOrders.length === 0 && !loading && (
                    <div className="bg-white rounded-[64px] p-24 text-center shadow-3xl border border-gray-50 flex flex-col items-center">
                        <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center mb-12 shadow-inner group">
                            <ShoppingBag size={64} className="text-fb-blue group-hover:scale-125 transition-transform duration-500" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic underline decoration-8 decoration-blue-50">Ledger Empty</h2>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-[5px] mt-6 mb-16 italic opacity-60">Targeted {activeTab} assets not found in your commercial history.</p>
                        <button onClick={() => navigate('/')} className="bg-fb-blue text-white px-20 py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-3xl shadow-blue-900 border-b-8 border-blue-900 italic">Explore Marketplace assets</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Orders List */}
                    <div className="lg:col-span-2 space-y-10">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[48px] shadow-3xl border border-gray-50 overflow-hidden hover:shadow-fb-blue/10 transition-all group not-italic">
                                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 italic">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Transaction ID</p>
                                        <p className="text-lg font-black text-fb-blue uppercase tracking-tighter">VX-{order._id.substring(0, 12).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`flex items-center gap-3 mb-1 justify-end ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'}`}>
                                            {order.status === 'Delivered' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{order.status === 'Delivered' ? 'SUCCESSFULLY_DELIVERED' : 'COMMERCIAL_LOCK'}</span>
                                        </div>
                                        <p className="text-sm font-black text-gray-400 italic opacity-60">Fulfillment On: {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="p-12 space-y-8">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row items-center gap-10 border-b border-gray-50 last:border-0 pb-8 last:pb-0">
                                            <div className="w-28 h-28 bg-white rounded-[32px] p-4 border-2 border-gray-50 group-hover:border-blue-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                                <img src={item.image} className="h-full w-full object-contain group-hover:scale-125 transition-transform duration-700" alt={item.title} />
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase leading-tight italic line-clamp-2">{item.title}</h3>
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-blue-50 text-fb-blue text-[8px] font-black px-3 py-1 rounded-lg border border-blue-100 italic tracking-widest uppercase">Verified Yield: {item.quantity} Units</div>
                                                    <p className="text-xl font-black text-fb-blue tracking-tighter italic">₹{item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50/30 p-8 rounded-[32px] gap-8 mt-6">
                                        <div className="space-y-1 text-center md:text-left">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Aggregated Total</p>
                                            <p className="text-4xl font-black text-gray-900 tracking-tighter italic font-black">₹{order.totalPrice.toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-5 shrink-0 w-full md:w-auto">
                                            <button 
                                                onClick={() => handleViewInvoice(order._id)}
                                                className={`flex items-center justify-center gap-4 text-[11px] font-black border-4 px-10 py-4 rounded-[24px] transition-all uppercase tracking-widest italic bg-white shadow-lg ${order.status === 'Delivered' ? 'border-green-100 text-green-600 hover:bg-green-600 hover:text-white' : 'border-blue-50 text-fb-blue hover:bg-fb-blue hover:text-white'}`}
                                            >
                                                <FileText size={20} /> Invoice Ledger
                                            </button>
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="bg-fb-blue text-white px-10 py-5 rounded-[24px] font-black text-[11px] shadow-3xl shadow-blue-100 uppercase tracking-[4px] hover:scale-[1.05] active:scale-95 transition-all italic border-b-8 border-blue-900"
                                            >
                                                Track Fulfillment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Tracking Sidebar Overlay */}
                    <div className="space-y-8">
                        {selectedOrder ? (
                            <div className="bg-white rounded-[56px] shadow-3xl border border-gray-50 p-12 sticky top-28 animate-in slide-in-from-right-12 duration-700 italic">
                                <div className="flex justify-between items-center mb-10 border-b-2 border-gray-50 pb-6">
                                     <h3 className="text-2xl font-black text-fb-blue uppercase tracking-tighter italic border-l-8 border-fb-blue pl-6 leading-none">Live Tracking</h3>
                                     <button onClick={() => setSelectedOrder(null)} className="text-gray-300 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-xl">
                                        <CheckCircle2 size={24} />
                                     </button>
                                </div>

                                <div className="space-y-12 relative px-4">
                                    <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-50"></div>
                                    {selectedOrder.tracking.map((step, idx) => (
                                        <div key={idx} className="flex gap-10 relative z-10 group">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all ${step.completed ? 'bg-green-500 text-white scale-110 rotate-6' : 'bg-white border-4 border-gray-50 text-gray-200'}`}>
                                                {step.completed ? <CheckCircle2 size={20} /> : <div className="w-3 h-3 bg-gray-100 rounded-full"></div>}
                                            </div>
                                            <div className={`${step.completed ? 'opacity-100' : 'opacity-30'} space-y-1`}>
                                                <p className="text-lg font-black text-gray-900 tracking-tighter leading-none">{step.status}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 tracking-widest">
                                                    <Clock size={12} /> {step.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 pt-10 border-t-2 border-gray-50 bg-gray-50 p-8 rounded-[40px] flex items-start gap-8 shadow-inner">
                                    <div className="bg-white p-4 rounded-3xl shadow-xl">
                                        <MapPin size={32} className="text-red-600 fill-red-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Shipping Destination</p>
                                        <p className="text-sm font-black text-gray-900 leading-snug uppercase tracking-tight italic">
                                            {userInfo.name}, {userInfo.address || 'Noida High-Fidelity Hub'} <br/> Sector 126, Noida, UP
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-4 bg-green-50 p-6 rounded-3xl border-2 border-green-100 shadow-lg shadow-green-50/50">
                                    <ShieldCheck size={28} className="text-green-600" />
                                    <p className="text-[11px] font-black text-green-800 tracking-tight leading-relaxed uppercase italic">Fulfillment Verified by <br/> Flipkart Secure Protocol</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-fb-blue rounded-[56px] shadow-4xl shadow-blue-200 p-12 text-white relative overflow-hidden h-[600px] flex flex-col justify-end group border-b-12 border-blue-900">
                                <Package size={200} className="absolute -top-16 -right-20 opacity-20 group-hover:rotate-45 transition-transform duration-1000 grayscale brightness-200" />
                                <Truck size={120} className="absolute top-1/3 -left-20 opacity-10 group-hover:translate-x-[400px] transition-all duration-[2000ms] ease-in-out" />
                                <div className="relative z-10 space-y-8">
                                    <h3 className="text-5xl font-black italic tracking-tighter leading-none uppercase underline decoration-white/20 decoration-8 underline-offset-8">Track Your Success</h3>
                                    <p className="text-blue-100 font-bold text-lg leading-relaxed uppercase italic tracking-widest opacity-80">Select an order from your history to view its real-time tracking status and estimated delivery time.</p>
                                    <div className="flex gap-4">
                                        {[1,2,3,4].map(i => <div key={i} className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white animate-pulse" style={{ animationDelay: `${i*300}ms` }}></div></div>)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
