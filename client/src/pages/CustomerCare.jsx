import React from 'react';
import { Phone, Mail, Clock, ShieldCheck, MapPin, MessageSquare, ChevronLeft, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerCare = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-8"
                >
                    <ChevronLeft size={16} /> Back to Shopping
                </button>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-700">
                    <div className="bg-[#2874f0] p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <Headphones size={48} className="text-[#ffe500]" />
                                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Customer Support</h1>
                                </div>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-[4px]">24x7 High-Fidelity Assistance</p>
                            </div>
                            <div className="bg-white/10 px-8 py-4 rounded-3xl border border-white/20 backdrop-blur-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Current Wait Time</p>
                                <p className="text-2xl font-black text-[#ffe500] tracking-tighter italic">LESS THAN 1 MIN</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 md:p-20 space-y-16">
                        {/* Primary Contact Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="bg-blue-50 p-10 rounded-[32px] border-2 border-dashed border-blue-100 flex flex-col items-center text-center group hover:border-blue-300 transition-all shadow-inner">
                                <div className="bg-white p-5 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    <Phone size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Phone Support</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Available 24*7 for Voice Help</p>
                                <a href="tel:18002029898" className="text-3xl font-black text-blue-600 tracking-tighter italic hover:underline">1800-202-9898</a>
                                <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase italic">Zero Call Waiting Protocol</p>
                            </div>

                            <div className="bg-orange-50 p-10 rounded-[32px] border-2 border-dashed border-orange-100 flex flex-col items-center text-center group hover:border-orange-300 transition-all shadow-inner">
                                <div className="bg-white p-5 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    <Mail size={32} className="text-[#fb641b]" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Email Desk</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Send us your detailed queries</p>
                                <a href="mailto:support@flipkart-clone.com" className="text-xl font-black text-[#fb641b] tracking-tight hover:underline lowercase break-all">support@flipkart-clone.com</a>
                                <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase italic">Avg Response Time: 4 Hours</p>
                            </div>
                        </div>

                        {/* Secondary Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center p-6 space-y-4">
                                <Clock size={28} className="text-blue-600" />
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Round-the-Clock Help</p>
                                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Our automated vault logic and human operators are online 24/7/365.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 space-y-4">
                                <ShieldCheck size={28} className="text-green-600" />
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Secured Data Handling</p>
                                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">All support communications are end-to-end encrypted for your security.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 space-y-4">
                                <MessageSquare size={28} className="text-orange-600" />
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Live Chat Terminal</p>
                                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Instant messaging support for quick issues and transaction tracking.</p>
                            </div>
                        </div>

                        {/* Location / Physical HQ */}
                        <div className="bg-gray-50/50 p-10 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                                <MapPin size={40} className="text-red-600" />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Corporate Headquarters</h3>
                                <p className="text-base font-black text-gray-900 uppercase tracking-tight">Flipkart Clone Marketplace Hub</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Digital Square, Tech Corridor, Bangalore, Karnataka - 560103</p>
                            </div>
                            <button className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-100">Locate Us</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCare;
