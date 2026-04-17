import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const { login, userInfo } = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'user';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialRole);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'retailer') {
                navigate('/retailer-dashboard?tab=profile');
            } else if (userInfo.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [userInfo]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            login(data);
            if (role === 'retailer') {
                navigate('/retailer-dashboard?tab=profile');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f1f3f6]">
            <div className="flex w-full max-w-4xl h-[530px] shadow-2xl rounded-sm overflow-hidden bg-white">
                {/* Left Side (Aesthetics) */}
                <div className={`w-[35%] ${role === 'retailer' ? 'bg-[#fb641b]' : 'bg-[#2874f0]'} p-10 flex flex-col items-start text-white relative transition-colors duration-500`}>
                    <h2 className="text-3xl font-bold mb-4">{role === 'retailer' ? 'Seller Signup' : 'Signup'}</h2>
                    <p className="text-lg opacity-80 leading-relaxed font-medium">
                        {role === 'retailer' 
                            ? 'Register your business and reach millions of customers today' 
                            : 'Create your account to start shopping and get exciting offers'}
                    </p>
                    <img 
                        src={role === 'retailer' 
                            ? "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80" 
                            : "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80"}
                        alt="Signup Illustration"
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 object-cover rounded-2xl opacity-90 drop-shadow-2xl animate-float-slow border-4 border-white/20 backdrop-blur-sm"
                    />
                </div>

                {/* Right Side (Form) */}
                <form onSubmit={handleSignup} className="flex-1 p-10 flex flex-col">
                    <div className="space-y-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded">{error}</p>}
                        
                        {role === 'retailer' && (
                            <div className="bg-orange-50 p-3 rounded-sm border-l-4 border-orange-500 animate-in fade-in duration-500">
                                <p className="text-[10px] text-orange-700 font-bold uppercase tracking-wider">Business Mode Active: Registering as Seller</p>
                            </div>
                        )}

                        <div className="relative group">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={role === 'retailer' ? 'Enter Business Name' : 'Enter Name'}
                                required
                                className="w-full border-b-2 border-gray-100 hover:border-fb-blue focus:border-fb-blue outline-none py-2 text-sm transition-all focus:placeholder:text-[10px] focus:placeholder:-translate-y-4 placeholder:transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email/Mobile number"
                                required
                                className="w-full border-b-2 border-gray-100 hover:border-fb-blue focus:border-fb-blue outline-none py-2 text-sm transition-all focus:placeholder:text-[10px] focus:placeholder:-translate-y-4 placeholder:transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                required
                                className="w-full border-b-2 border-gray-100 hover:border-fb-blue focus:border-fb-blue outline-none py-2 text-sm transition-all focus:placeholder:text-[10px] focus:placeholder:-translate-y-4 placeholder:transition-all"
                            />
                        </div>
                        {/* Role selection is now handled automatically via route parameters */}
                        {role === 'admin' && (
                            <div className="relative group animate-in slide-in-from-top-4 duration-300">
                                <input 
                                    type="password" 
                                    placeholder="Enter Admin Secret Code"
                                    onChange={(e) => {
                                        if (e.target.value !== 'raviraj_admin_2026') {
                                            setError('UNAUTHORIZED VAULT KEY: Admin registration requires a valid secondary pass.');
                                        } else {
                                            setError('');
                                        }
                                    }}
                                    required
                                    className="w-full border-b-2 border-red-100 hover:border-red-500 focus:border-red-500 bg-red-50/20 px-2 outline-none py-2 text-sm transition-all"
                                />
                            </div>
                        )}
                        <p className="text-xs text-gray-500 leading-normal">
                            By continuing, you agree to Flipkart's <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
                        </p>
                        <button type="submit" className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold shadow-md hover:bg-[#fb641b]/90 transition-all active:scale-95 transform">
                            CONTINUE
                        </button>
                    </div>
                    <div className="mt-auto text-center border-t py-4">
                        <Link 
                            to={role === 'retailer' ? "/login?type=seller" : "/login"} 
                            className="text-sm text-[#2874f0] font-bold hover:underline transition-all"
                        >
                            Existing User? Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;