import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, Download, ShoppingBag, ShieldCheck, MapPin, CreditCard, ChevronLeft } from 'lucide-react';
import api from '../utils/api';

const Invoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                console.error('Invoice Retrieval Error:', err);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
                <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">Vault Retrieval Failed</h1>
                <p className="text-gray-400 font-bold mt-2">Could not locate Order ID in the marketplace ledger.</p>
                <button onClick={() => navigate('/orders')} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg uppercase text-xs tracking-widest">Back to Orders</button>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] min-h-screen py-12 px-4 print:bg-white print:p-0">
            {/* Control Bar (Hidden on Print) */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden px-4 md:px-0">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest"
                >
                    <ChevronLeft size={16} /> Return to Orders
                </button>
                <div className="flex gap-6">
                    <button 
                        onClick={handlePrint}
                        className="bg-white border-4 border-blue-50 text-fb-blue px-10 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-fb-blue hover:text-white transition-all flex items-center gap-4 italic"
                    >
                        <Printer size={18} /> Print Record
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="bg-fb-blue text-white px-10 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-100 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all italic border-b-6 border-blue-900"
                    >
                        <Download size={18} /> Download Commercial Receipt
                    </button>
                </div>
            </div>

            {/* High-Fidelity Invoice Terminal */}
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none animate-in fade-in zoom-in duration-700">
                {/* Header Section */}
                <div className="bg-[#2874f0] p-12 text-white flex flex-col md:flex-row justify-between items-start gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <ShoppingBag size={48} className="text-white bg-white/20 p-2 rounded-2xl" />
                            <h1 className="text-5xl font-black tracking-tighter italic">FLIPKART</h1>
                        </div>
                        <p className="text-sm font-black opacity-80 uppercase tracking-[4px]">Tax Invoice / Bill of Supply</p>
                    </div>
                    <div className="text-right flex flex-col gap-2 relative z-10">
                        <h2 className="text-2xl font-black tracking-tight mb-2">ORDER RECEIPT</h2>
                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Transaction ID: <span className="text-white ml-2 opacity-100">#{order._id.toString().slice(-12).toUpperCase()}</span></p>
                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Date: <span className="text-white ml-2 opacity-100">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-12 md:p-20 space-y-20">
                    {/* Address Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b-2 border-blue-600 w-fit pb-1">
                                <MapPin size={20} className="text-blue-600" />
                                <h3 className="font-black text-gray-900 text-[10px] tracking-[4px] uppercase">Shipping Destination</h3>
                            </div>
                            <div className="text-gray-600 space-y-2">
                                <p className="text-xl font-black text-gray-900">{order.user?.name || 'Authorized Customer'}</p>
                                <p className="text-sm font-medium leading-relaxed">{order.shippingAddress.address}</p>
                                <p className="text-sm font-medium">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest pt-2 italic">{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        <div className="space-y-6 md:text-right md:items-end flex flex-col">
                            <div className="flex items-center gap-4 border-b-2 border-red-600 w-fit pb-1">
                                <CreditCard size={20} className="text-red-600" />
                                <h3 className="font-black text-gray-900 text-[10px] tracking-[4px] uppercase">Payment Terminal</h3>
                            </div>
                            <div className="text-gray-600 space-y-2">
                                <p className="text-xl font-black text-gray-900">{order.paymentMethod}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Status: <span className="text-green-600 ml-2">PAYMENT PROTECTED</span></p>
                                <div className="mt-4 flex items-center justify-end gap-3 text-red-600 bg-red-50 px-6 py-2 rounded-xl border border-red-100 w-fit self-end">
                                   <ShieldCheck size={18} />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Verified Transaction</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Terminal */}
                    <div className="border border-gray-100 rounded-[40px] overflow-hidden shadow-inner">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Description</th>
                                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amnt (INR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.orderItems.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/20 transition-all">
                                        <td className="p-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-xl border border-gray-100 p-2 flex items-center justify-center shrink-0">
                                                    <img src={item.image} className="h-full object-contain" alt={item.title} />
                                                </div>
                                                <p className="text-sm font-black text-gray-900 tracking-tight leading-tight uppercase line-clamp-2">{item.title}</p>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center text-sm font-black text-gray-900">x {item.quantity}</td>
                                        <td className="p-8 text-right text-sm font-bold text-gray-500 italic">₹{item.price.toLocaleString()}</td>
                                        <td className="p-8 text-right text-sm font-black text-gray-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Finance Ledger Grid */}
                    <div className="flex flex-col md:flex-row justify-end items-end gap-16 pr-8">
                         <div className="w-full md:w-80 space-y-6">
                            <div className="flex justify-between items-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                                <span>Subtotal Amnt</span>
                                <span className="text-gray-900 font-black text-lg tracking-tight">₹{order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                                <span>Tax Applied (18%)</span>
                                <span className="text-gray-900 font-black text-lg tracking-tight">₹{order.taxPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                                <span>Shipping Fees</span>
                                <span className="text-green-600 font-black text-lg tracking-tight uppercase italic">{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                            </div>
                            <div className="pt-8 border-t-4 border-fb-blue flex justify-between items-center text-3xl font-black text-gray-900 tracking-tighter italic">
                                <span>TOTAL</span>
                                <span className="text-fb-blue">₹{order.totalPrice.toLocaleString()}</span>
                            </div>
                         </div>
                    </div>

                    {/* Footer / High-Authority Message */}
                    <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="max-w-xs text-center md:text-left">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[3px] leading-relaxed italic">
                                THANK YOU FOR SHOPPING AT THE REIMAGINED MARKETPLACE HUB. YOUR TRANSACTION IS SECURED BY FLIPKART AUTHORITY VAULT.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-8 py-4 rounded-3xl border border-gray-100 shadow-inner group">
                             <div className="bg-white p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} className="text-green-600" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Verified Digital Invoice</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[3px]">Authentic Commercial Ledger</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
