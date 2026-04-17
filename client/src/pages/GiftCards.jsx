import React, { useState } from 'react';
import { Gift, Star, ShieldCheck, ChevronLeft, CreditCard, Heart, Zap, Plus, ArrowRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GiftCards = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('active');

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4 italic font-black uppercase tracking-tighter italic">
            <div className="max-w-7xl mx-auto italic">
                {/* Header Terminal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10 px-4">
                     <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-4 not-italic"
                        >
                            <ChevronLeft size={16} /> Return to Market
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none border-l-8 border-purple-600 pl-8 italic">Gift Card Vault</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[6px] mt-6 ml-8 italic">Commercial Credits & Premium Rewards</p>
                     </div>
                     <div className="bg-white p-6 rounded-[40px] shadow-2xl border border-gray-100 flex items-center gap-10">
                        <div className="flex items-center gap-4 border-r border-gray-100 pr-10">
                             <div className="bg-purple-50 p-4 rounded-3xl shadow-inner">
                                <Wallet size={32} className="text-purple-600" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Vault Balance</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter italic">₹12,450.00</p>
                             </div>
                        </div>
                        <button className="bg-fb-blue text-white px-8 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none not-italic border-b-4 border-blue-800">Add Credit</button>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 not-italic">
                    {/* Active Cards Grid */}
                    <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">
                        <div className="flex items-center justify-between px-6 border-b-4 border-gray-100 pb-6">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Your Active Cards</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { id: 'gc1', balance: 5000, color: 'blue', type: 'FLIPKART PREMIUM' },
                                { id: 'gc2', balance: 2500, color: 'purple', type: 'MARKETPLACE ELITE' },
                                { id: 'gc3', balance: 4950, color: 'gold', type: 'CORPORATE GIFT' }
                            ].map((card) => (
                                <div key={card.id} className={`aspect-[1.6/1] rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl hover:scale-[1.03] transition-all cursor-pointer border-4 border-white ${card.color === 'blue' ? 'bg-gradient-to-br from-blue-600 to-blue-800' : card.color === 'purple' ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-amber-600 to-[#fb641b]'}`}>
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                                     <div className="relative z-10 h-full flex flex-col justify-between">
                                         <div className="flex justify-between items-start">
                                             <Gift size={40} className="text-white group-hover:rotate-12 transition-all translate-y-1" />
                                             <span className="text-[10px] font-black tracking-[4px] uppercase border border-white/40 px-4 py-1.5 rounded-full backdrop-blur-md">{card.type}</span>
                                         </div>
                                         <div className="space-y-2">
                                             <p className="text-[10px] font-black tracking-widest opacity-60 uppercase mb-4">CARD NO: **** **** **** {Math.floor(Math.random() * 8999) + 1000}</p>
                                             <div className="flex items-end gap-2">
                                                 <span className="text-xs font-black uppercase opacity-80 mb-2">BALANCE</span>
                                                 <p className="text-5xl font-black tracking-tighter italic leading-none">₹{card.balance.toLocaleString()}</p>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Purchase Sidebar */}
                    <div className="space-y-10 order-1 lg:order-2">
                        <div className="bg-white p-12 rounded-[56px] shadow-2xl border border-gray-100 space-y-10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 blur-2xl opacity-60"></div>
                             <div className="space-y-4">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none italic">Buy New Gift</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-relaxed">Instant delivery to your digital vault or email.</p>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4">
                                { [1000, 2000, 5000, 10000].map(v => (
                                    <button key={v} className="bg-gray-50 p-6 rounded-3xl border-2 border-transparent hover:border-blue-600 hover:bg-white hover:shadow-xl transition-all font-black text-xl text-gray-900 italic tracking-tighter outline-none focus:border-blue-600">₹{v.toLocaleString()}</button>
                                )) }
                             </div>

                             <div className="space-y-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-100 pb-2">Custom Amount Terminal</p>
                                <div className="bg-gray-50 border-2 border-gray-100 rounded-3xl p-5 flex items-center gap-4 group-hover:border-blue-200 transition-colors">
                                    <span className="text-2xl font-black text-gray-900 italic">₹</span>
                                    <input type="number" placeholder="Enter (Max ₹10k)" className="bg-transparent border-none outline-none font-black text-2xl text-gray-900 w-full placeholder:text-gray-300 italic tracking-tighter" />
                                </div>
                             </div>

                             <button className="w-full bg-[#1f2937] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[6px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 italic">
                                Purchase Assets <ArrowRight size={20} />
                             </button>
                        </div>

                        {/* Gift Tracker Feature */}
                        <div className="bg-[#fb641b] p-10 rounded-[48px] text-white flex flex-col items-center text-center gap-6 relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
                             <div className="bg-white/20 p-4 rounded-3xl border border-white/20 backdrop-blur-md">
                                <CreditCard size={32} />
                             </div>
                             <div className="space-y-2">
                                <h4 className="text-xl font-black tracking-tighter uppercase italic">Gift Recipient Ledger</h4>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-relaxed">Track every voucher you've sent across the network.</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-20 flex justify-center items-center gap-8 opacity-40 italic">
                    <ShieldCheck size={32} className="text-blue-600" />
                    <p className="text-[12px] font-bold text-gray-900 uppercase tracking-[6px] italic underline decoration-blue-600 decoration-8">Verified Premium Asset Terminal (Active)</p>
                </div>
            </div>
        </div>
    );
};

export default GiftCards;
