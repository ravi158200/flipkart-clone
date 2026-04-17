import React, { useState } from 'react';
import { Ticket, Star, ShieldCheck, ChevronLeft, LayoutGrid, List, Plus, Trash2, Zap, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Coupons = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    
    // High-Fidelity Coupons Data Simulation
    const couponsData = [
        { id: 'c1', title: '20% OFF ON ELECTRONICS', subtitle: 'Special Festive Offer', code: 'TECH24FK', status: 'ACTIVE', color: 'blue' },
        { id: 'c2', title: '₹500 FLAT OFF ON FASHION', subtitle: 'Minimum Purchase ₹2999', code: 'LUXE500', status: 'ACTIVE', color: 'pink' },
        { id: 'c3', title: 'FREE DELIVERY ON ALL ORDERS', subtitle: 'Global Logistics Reward', code: 'FREEDEL', status: 'EXPIRING', color: 'green' }
    ];

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4 italic">
            <div className="max-w-6xl mx-auto">
                {/* Header Terminal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10 px-4">
                     <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-4 not-italic"
                        >
                            <ChevronLeft size={16} /> Return to Market
                        </button>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none border-l-8 border-green-500 pl-6 italic">My Coupons</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[6px] mt-4 ml-6 italic">Active Rewards & Digital Vouchers</p>
                     </div>
                     <div className="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100">
                        <div className="flex items-center gap-2 px-4">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                     </div>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                    {couponsData.map((coupon) => (
                        <div key={coupon.id} className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 flex flex-col items-center text-center group hover:scale-[1.02] transition-all relative overflow-hidden">
                             {/* Accent Decoration */}
                             <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 ${coupon.color === 'blue' ? 'bg-blue-600' : coupon.color === 'pink' ? 'bg-pink-600' : 'bg-green-600'}`}></div>
                             
                             <div className={`w-20 h-20 rounded-full flex items-center justify-center p-5 shadow-lg mb-8 ${coupon.color === 'blue' ? 'bg-blue-50 text-blue-600 shadow-blue-50' : coupon.color === 'pink' ? 'bg-pink-50 text-pink-600 shadow-pink-50' : 'bg-green-50 text-green-600 shadow-green-50'}`}>
                                <Ticket size={40} className="group-hover:rotate-12 transition-transform" />
                             </div>

                             <div className="space-y-4 mb-8">
                                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{coupon.title}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{coupon.subtitle}</p>
                             </div>

                             <div className="w-full space-y-6">
                                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-between group-hover:border-green-500 transition-colors cursor-pointer select-all">
                                    <span className="text-sm font-black text-fb-blue uppercase tracking-widest">{coupon.code}</span>
                                    <span className="text-[8px] font-black uppercase text-gray-400">COPY</span>
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                     <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${coupon.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{coupon.status}</span>
                                </div>
                             </div>

                             {/* Redirection Trigger */}
                             <button 
                                onClick={() => navigate('/')}
                                className="mt-10 bg-gray-900 text-white w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[4px] hover:bg-black transition-all outline-none not-italic"
                             >
                                APPLY FOR SHOPPING
                             </button>
                        </div>
                    ))}

                    <div className="bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center space-y-6 hover:border-blue-300 transition-all cursor-pointer group">
                         <div className="bg-white p-6 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-blue-600" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-none italic">Redeem External Voucher</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Enter physical gift coupon code</p>
                         </div>
                    </div>
                </div>

                {/* Footer Section (Commercial Value) */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 not-italic">
                    <div className="bg-blue-600 p-12 rounded-[48px] text-white flex flex-col items-center md:items-start text-center md:text-left gap-6 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
                        <Gift size={48} className="text-[#ffe500]" />
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Gift for your friends?</h3>
                            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Generate high-fidelity gift vouchers starting from ₹1000.</p>
                        </div>
                        <button className="bg-[#ffe500] text-gray-900 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Buy Gift Card</button>
                    </div>
                    <div className="bg-white p-12 border border-gray-100 rounded-[48px] shadow-2xl space-y-8 flex flex-col items-center md:items-start">
                         <div className="flex items-center gap-6">
                             <div className="bg-green-50 p-4 rounded-3xl border border-green-100">
                                <Zap size={32} className="text-green-600" />
                             </div>
                             <div>
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic underline decoration-green-500 decoration-8">Mega Reward Hub</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] mt-2 italic">Official Commercial Benefits</p>
                             </div>
                         </div>
                         <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest italic">All coupons are secure items in your digital marketplace vault. Expired coupons are automatically archived daily.</p>
                         <button className="w-full md:w-auto bg-gray-50 text-gray-900 px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-200 hover:bg-gray-100 transition-colors">ARCHIVE VAULT</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coupons;
