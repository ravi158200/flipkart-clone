import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useLocation as useRouteLocation } from 'react-router-dom';

const Login = () => {
  const { login, userInfo } = useAuth();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const isSellerLogin = new URLSearchParams(routeLocation.search).get('type') === 'seller';
  
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (isOtpMode && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpMode, timer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      // Immediate redirect after successful POST
      if (data.role === 'retailer') {
        navigate('/retailer-dashboard?tab=profile');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter email/mobile to request OTP');
    setIsOtpMode(true);
    setShowOtpInput(true);
    setTimer(30);
    setCanResend(false);
    setError('');
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp('');
    setError('A new OTP has been sent for verification.');
    // Simulated Resend logic...
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp === '123456') { // High-Fidelity Simulator Bypass
        try {
            const { data } = await api.post('/auth/login', { email, password: 'otp_bypass_simulation' });
            login(data);
            if (data.role === 'retailer') {
                navigate('/retailer-dashboard?tab=profile');
            } else if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            // Simulator Fail-safe: Mock a successful login
            const mockUser = {
                _id: 'sim_user_123',
                name: 'Beta Tester',
                email: email,
                role: isSellerLogin ? 'retailer' : 'user',
                token: 'mock_jwt_simulation'
            };
            login(mockUser);
            if (mockUser.role === 'retailer') {
                navigate('/retailer-dashboard?tab=profile');
            } else {
                navigate('/');
            }
        }
    } else {
        setError('Invalid OTP. Use 123456 for testing.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f1f3f6]">
      <div className="flex w-full max-w-4xl h-[530px] shadow-2xl rounded-sm overflow-hidden bg-white">
        {/* Left Side (Aesthetics) */}
        <div className={`w-[35%] ${isSellerLogin ? 'bg-[#fb641b]' : 'bg-[#2874f0]'} p-10 flex flex-col items-start text-white relative transition-colors duration-500`}>
          <h2 className="text-3xl font-bold mb-4">{isSellerLogin ? 'Seller Hub Login' : 'Login'}</h2>
          <p className="text-lg opacity-80 leading-relaxed font-medium">
            {isSellerLogin 
              ? 'Access your seller dashboard and manage your business on the go'
              : 'Get access to your Orders, Wishlist and Recommendations'}
          </p>
          <img 
            src={isSellerLogin 
              ? "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80"
              : "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80"}
            alt="Login Illustration"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 object-cover rounded-2xl opacity-90 drop-shadow-2xl animate-float-slow border-4 border-white/20 backdrop-blur-sm"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 p-10 flex flex-col">
          <div className="space-y-8 flex-grow">
            {error && <p className={`text-xs font-black p-3 rounded-lg border-l-4 animate-in fade-in duration-300 ${error.includes('new OTP') ? 'text-green-600 bg-green-50 border-green-500' : 'text-red-500 bg-red-50 border-red-500'}`}>{error}</p>}
            
            {/* Standard Input for Email/Phone */}
            {!isOtpMode ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter Email/Mobile number"
                    required
                    className="w-full border-b-2 border-gray-100 hover:border-fb-blue focus:border-fb-blue outline-none py-2 text-sm transition-all font-bold"
                  />
                </div>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter Password"
                    required
                    className="w-full border-b-2 border-gray-100 hover:border-fb-blue focus:border-fb-blue outline-none py-2 text-sm transition-all font-bold"
                  />
                  <p className="text-xs text-[#2874f0] font-black mt-2 cursor-pointer hover:underline transition-all w-fit">Forgot?</p>
                </div>
                <p className="text-[10px] uppercase font-black text-gray-400 leading-normal tracking-wide">
                  By continuing, you agree to Flipkart's <span className="text-[#2874f0]">Terms of Use</span> and <span className="text-[#2874f0]">Privacy Policy</span>.
                </p>
                <button 
                    onClick={handleLogin} 
                    disabled={loading}
                    className={`w-full ${isSellerLogin ? 'bg-[#2874f0]' : 'bg-[#fb641b]'} text-white py-4 rounded-sm font-black shadow-lg hover:scale-[1.01] active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50`}
                  >
                  {loading ? 'Authenticating...' : (isSellerLogin ? 'Access Merchant Hub' : 'Login')}
                </button>
                <div className="relative border-b border-gray-100 py-3">
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 bg-white px-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">OR</span>
                </div>
                <button 
                    onClick={handleRequestOtp}
                    className={`w-full bg-white ${isSellerLogin ? 'text-[#fb641b] border-orange-100 hover:bg-orange-50' : 'text-[#2874f0] border-gray-100 hover:bg-gray-50'} py-4 rounded-sm font-black shadow-md border transition-all text-xs uppercase tracking-widest`}
                  >
                  {isSellerLogin ? 'Login with OTP' : 'Request OTP'}
                </button>
              </div>
            ) : (
              /* OTP Verification Mode */
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-gray-600">OTP sent to: <span className="text-fb-blue">{email}</span></p>
                    <button onClick={() => setIsOtpMode(false)} className="text-[10px] font-black text-fb-blue uppercase hover:underline">Change</button>
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={otp}
                    maxLength="6"
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (Try 123456)"
                    className="w-full border-b-2 border-fb-blue text-center text-xl tracking-[12px] font-black outline-none py-4 text-fb-blue placeholder:tracking-normal placeholder:text-sm"
                  />
                </div>
                <button 
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-black shadow-lg shadow-orange-100 hover:scale-[1.01] active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                  Verify & Proceed
                </button>
                <div className="text-center text-xs text-gray-400 font-bold">
                    Didn't receive OTP? {canResend ? (
                        <span 
                            onClick={handleResendOtp}
                            className="text-fb-blue cursor-pointer font-black ml-1 hover:underline animate-bounce-slow"
                        >
                            Resend Now
                        </span>
                    ) : (
                        <span className="text-gray-300 ml-1">Resend in {timer}s</span>
                    )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto text-center pt-6">
            <Link 
              to={isSellerLogin ? "/signup?role=retailer" : "/signup"} 
              className="text-sm text-[#2874f0] font-black hover:underline transition-all uppercase tracking-tight"
            >
              New to Flipkart? Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
