import React from 'react';
import { ShoppingBag, ChevronDown, Globe, HelpCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SellerNavbar = () => {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white h-20 flex items-center justify-between px-8 z-[100] shadow-sm border-b border-gray-100">
            <div className="flex items-center gap-12">
                <Link to="/seller-onboarding" className="flex items-center gap-2 group">
                    <div className="bg-[#2874f0] p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                        <ShoppingBag size={20} className="text-[#ffe500]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#2874f0] font-black text-xl tracking-tighter leading-none italic">Flipkart</span>
                        <span className="text-[#fb641b] font-black text-[9px] uppercase tracking-[4px] mt-0.5">Seller Hub</span>
                    </div>
                </Link>
                
                <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-gray-600 uppercase tracking-wide">
                    <a href="#" className="hover:text-[#2874f0] transition-colors border-b-2 border-transparent hover:border-[#2874f0] py-7 flex items-center gap-1">Sell Online <ChevronDown size={14} /></a>
                    <a href="#" className="hover:text-[#2874f0] transition-colors border-b-2 border-transparent hover:border-[#2874f0] py-7">Shopsy</a>
                    <a href="#" className="hover:text-[#2874f0] transition-colors border-b-2 border-transparent hover:border-[#2874f0] py-7">Fees & Pricing</a>
                    <a href="#" className="hover:text-[#2874f0] transition-colors border-b-2 border-transparent hover:border-[#2874f0] py-7 flex items-center gap-1">Success Stories <ChevronDown size={14} /></a>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-r pr-6 hidden md:flex">
                    <Globe size={18} className="text-fb-blue" /> EN
                </div>
                
                {!userInfo ? (
                    <>
                        <button 
                          onClick={() => navigate('/login?type=seller')} 
                          className="text-fb-blue font-black text-[13px] uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-sm transition-all"
                        >
                          Login
                        </button>
                        <button 
                          onClick={() => navigate('/signup?role=retailer')} 
                          className="bg-[#2874f0] text-white px-8 py-3 rounded-md font-black text-[12px] uppercase tracking-[2px] shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                          Start Selling
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400">Merchant Hub</span>
                            <span className="text-[13px] font-black text-[#172337]">{userInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(userInfo.role === 'retailer' ? '/retailer-dashboard' : '/')}
                                className="text-xs font-black uppercase text-blue-600 hover:underline"
                            >
                                Dashboard
                            </button>
                            <button 
                                onClick={() => { logout(); navigate('/login?type=seller'); }}
                                className="bg-red-50 text-red-600 p-2.5 rounded-full hover:bg-red-100 transition-colors"
                                title="Exit Seller Hub"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default SellerNavbar;
