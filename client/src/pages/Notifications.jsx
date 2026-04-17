import React, { useState } from 'react';
import { Bell, ShoppingBag, Zap, CreditCard, ShieldCheck, ChevronLeft, Trash2, Filter, Settings, Trash, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    // High-Fidelity Marketplace Notifications Simulation
    const notifications = [
        { id: 'n1', type: 'order', title: 'ORDER #12450 DISPATCHED', desc: 'Your Premium Headphones are on the way to the delivery vault.', time: '2 mins ago', unread: true },
        { id: 'n2', type: 'promo', title: 'MEGA SALE UNLOCKED: 50% OFF', desc: 'High-fidelity tech assets are now at absolute discount levels.', time: '4 hours ago', unread: true },
        { id: 'n3', type: 'system', title: 'SECURITY PROTOCOL UPDATED', desc: 'Your marketplace account is now protected by 2FA Shield V2.', time: '1 day ago', unread: false },
        { id: 'n4', type: 'payment', title: 'PAYMENT VERIFIED: ₹5,499.00', desc: 'Commercial transaction for Order #9822 has been settled.', time: '2 days ago', unread: false }
    ];

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4 italic font-black uppercase tracking-tighter italic">
            <div className="max-w-4xl mx-auto italic">
                {/* Header Terminal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10 px-4">
                     <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-4 not-italic"
                        >
                            <ChevronLeft size={16} /> Return to Market
                        </button>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none border-l-8 border-yellow-500 pl-6 italic">Alert Center</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[6px] mt-4 ml-6 italic">Real-Time Marketplace Intelligence</p>
                     </div>
                     <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 italic">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 underline">MARK ALL AS READ</span>
                     </div>
                </div>

                {/* Filter Navigation */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 custom-scrollbar italic px-2">
                    {['all', 'order', 'promo', 'system', 'payment'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-fb-blue text-white shadow-xl shadow-blue-100 scale-105' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Notifications Ledger */}
                <div className="bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden not-italic">
                    {notifications.filter(n => filter === 'all' || n.type === filter).map((note, idx) => (
                        <div key={note.id} className={`p-8 flex items-start gap-8 relative hover:bg-gray-50/80 transition-colors group ${idx !== notifications.length - 1 ? 'border-b border-gray-100' : ''}`}>
                             {note.unread && <div className="absolute top-10 left-3 w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>}
                             
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform ${note.type === 'order' ? 'bg-blue-50 text-blue-600' : note.type === 'promo' ? 'bg-pink-50 text-pink-600' : note.type === 'system' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                {note.type === 'order' ? <ShoppingBag size={24} /> : note.type === 'promo' ? <Zap size={24} /> : note.type === 'system' ? <ShieldCheck size={24} /> : <CreditCard size={24} />}
                             </div>

                             <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`text-sm font-black tracking-tight italic uppercase ${note.unread ? 'text-gray-900' : 'text-gray-500'}`}>{note.title}</h3>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{note.time}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">{note.desc}</p>
                             </div>

                             <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-colors"><Trash size={16} /></button>
                                <button className="p-2 hover:bg-blue-50 text-blue-400 hover:text-blue-500 rounded-lg transition-colors"><CheckCircle2 size={16} /></button>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Empty State Action */}
                <div className="mt-12 flex flex-col items-center gap-8 opacity-20">
                    <div className="flex items-center gap-10">
                        <AlertCircle size={40} />
                        <Settings size={40} />
                        <Trash2 size={40} />
                    </div>
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-[8px] italic">Notifications Vault: Synchronized (Secured)</p>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
