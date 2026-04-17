import React from 'react';
import { Megaphone, Target, BarChart3, Rocket, MessageSquare, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Advertise = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const handleStartCampaign = () => {
        if (!userInfo) {
            alert('RETAILER VAULT ACCESS: Please login as a partner to launch campaigns.');
            navigate('/login');
            return;
        }

        if (userInfo.role === 'retailer' || userInfo.role === 'admin') {
            navigate('/retailer-dashboard');
        } else {
            alert('IDENTITY CONFLICT: Your current account is a consumer. Please register as a Retailer (BRM) to access advertising vaults.');
            navigate('/profile');
        }
    };

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4 italic">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-8 not-italic"
                >
                    <ChevronLeft size={16} /> Return to Market
                </button>

                <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    {/* Hero Section */}
                    <div className="bg-[#1f2937] p-16 md:p-24 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>
                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                             <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-500/20">
                                <Megaphone size={64} className="text-white" />
                             </div>
                             <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">Boost Your Sales</h1>
                                <p className="text-lg font-bold text-gray-400 uppercase tracking-[6px] max-w-2xl mx-auto italic">Scale your business with high-fidelity advertisements across the marketplace.</p>
                             </div>
                             <button 
                                onClick={handleStartCampaign}
                                className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all outline-none not-italic border-b-4 border-blue-800"
                             >
                                Start Campaigning Now
                             </button>
                        </div>
                    </div>

                    <div className="p-12 md:p-24 space-y-24">
                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-6 group">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Target size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">High Precision Targeting</h3>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-widest italic">Reach shoppers who are actively looking for your products using our AI-driven demographic vault.</p>
                            </div>
                            <div className="space-y-6 group">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <BarChart3 size={32} className="text-[#fb641b]" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Real-Time Data Ledger</h3>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-widest italic">Track every impression, click, and conversion with our high-fidelity commercial analytics terminal.</p>
                            </div>
                            <div className="space-y-6 group">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Rocket size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Instant Scalability</h3>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-widest italic">From local boutiques to global brands, scale your advertising budget with zero-latency deployment logic.</p>
                            </div>
                        </div>

                        {/* Ad Formats Section */}
                        <div className="space-y-12">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[8px] border-b-4 border-blue-600 w-fit pb-2 mx-auto md:mx-0">Premium Ad Formats</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-blue-200 transition-all group flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:rotate-6 transition-transform">
                                        <Zap size={48} className="text-blue-600" />
                                    </div>
                                    <div className="space-y-4 text-center md:text-left">
                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Sponsored Search Results</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">Appear at the absolute top of search queries for maximum visibility in the marketplace terminal.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-orange-200 transition-all group flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:rotate-6 transition-transform">
                                        <MessageSquare size={48} className="text-[#fb641b]" />
                                    </div>
                                    <div className="space-y-4 text-center md:text-left">
                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Product Feed Integration</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">Seamlessly blend your promoted items into the homepage and recommendation carousels.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Bar */}
                        <div className="pt-24 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                            <div className="flex items-center gap-6">
                                <div className="bg-blue-600/5 p-4 rounded-2xl shadow-inner border border-blue-100">
                                    <ShieldCheck size={40} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight italic underline decoration-blue-600 decoration-4">Brand Safety Verified</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1 italic">Authorized Flipkart Advertising Protocol</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-gray-900 tracking-tighter italic">1.2M+ ShoppersDaily</p>
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-[4px] italic">Potential Exposure Vault: ACTIVE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Advertise;
