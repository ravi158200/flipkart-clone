import React, { useEffect } from 'react';
import { ShoppingBag, TrendingUp, Users, ShieldCheck, Zap, ArrowRight, BarChart3, Globe, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SellerLanding = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo?.role === 'retailer') {
            navigate('/retailer-dashboard');
        }
    }, [userInfo]);

    return (
        <div className="bg-white min-h-screen pb-12 font-sans tracking-tight">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 py-20 bg-gradient-to-r from-blue-50/50 to-transparent rounded-[40px] px-12 mb-20 animate-in fade-in duration-700 relative">
                    <div className="absolute top-8 left-12 flex items-center gap-1.5 hidden lg:flex bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-blue-50 group hover:scale-105 transition-all">
                        <div className="bg-[#2874f0] p-1.5 rounded-lg shadow-inner">
                            <ShoppingBag size={20} className="text-[#ffe500]" />
                        </div>
                        <div className="flex flex-col leading-none ml-1">
                            <span className="text-[#2874f0] font-black text-xl tracking-tighter italic">Flipkart</span>
                            <span className="text-[#fb641b] font-black text-[9px] uppercase tracking-[4px] mt-0.5">Seller Hub</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#172337] leading-[1.1]">
                            Sell Online with <br/><span className="text-[#2874f0]">Flipkart Seller Hub</span>
                        </h1>
                        <p className="text-lg font-medium text-gray-600 max-w-xl leading-relaxed">
                            Join 14 Lakh+ sellers who sell to 50 Crore+ customers across India. Start your journey with 0% Commission* and 24x7 support.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
                             <button 
                                onClick={() => navigate('/signup?role=retailer')} 
                                className="w-full sm:w-auto bg-[#fb641b] text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-[#e65a16] transition-all flex items-center justify-center gap-3 active:scale-95"
                             >
                                Start Selling <ArrowRight size={18} />
                             </button>
                             <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                <ShieldCheck size={20} className="text-green-600" /> 1.4M+ Sellers Trusted
                             </div>
                        </div>
                    </div>
                    <div className="flex-1 relative group">
                        <img 
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                            className="w-full h-[450px] object-cover rounded-3xl shadow-2xl border-4 border-white" 
                            alt="Seller Dashboard" 
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                            <div className="bg-green-50 p-3 rounded-xl">
                                <TrendingUp size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900 leading-none tracking-tighter">245%</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg Growth</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {[
                        { icon: <ShieldCheck size={32} />, title: "Secure Vaults", desc: "Your earnings are safe with our high-fidelity commercial ledger.", color: "blue" },
                        { icon: <Zap size={32} />, title: "Quick Listing", desc: "List and start selling within minutes of verification.", color: "orange" },
                        { icon: <BarChart3 size={32} />, title: "Analytics Hub", desc: "Track your business scaling with real-time analytics.", color: "purple" },
                        { icon: <Globe size={32} />, title: "Pan-India Reach", desc: "Access premium customers across all territories.", color: "green" }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
                             <div className={`p-5 rounded-2xl ${feature.color === 'blue' ? 'bg-blue-50 text-[#2874f0]' : feature.color === 'orange' ? 'bg-orange-50 text-orange-600' : feature.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                                {feature.icon}
                             </div>
                             <h4 className="text-lg font-bold text-[#172337]">{feature.title}</h4>
                             <p className="text-sm font-medium text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Banner */}
                <div className="bg-[#172337] rounded-[40px] p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center space-y-8">
                        <Rocket size={64} className="text-[#ffe500]" />
                        <h2 className="text-4xl md:text-5xl font-extrabold max-w-2xl leading-tight">
                            Ready to join India's most trusted marketplace?
                        </h2>
                        <button 
                            onClick={() => navigate('/signup?role=retailer')} 
                            className="bg-[#2874f0] text-white px-12 py-5 rounded-sm font-bold text-sm uppercase tracking-[4px] shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
                        >
                            Create Seller Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerLanding;
