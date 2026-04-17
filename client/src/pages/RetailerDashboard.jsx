import React, { useState, useEffect } from 'react';
import { Plus, Users, Package, LayoutDashboard, Search, Trash2, Edit, ChevronRight, Loader2, ShoppingBag, BarChart3, ArrowRight, Wallet, ShieldCheck, Settings, Bell, HelpCircle, LogOut } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const RetailerDashboard = () => {
    const { userInfo, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'dashboard';

    // ✅ All hooks must be declared BEFORE any conditional returns
    const [activeTab, setActiveTab] = useState(initialTab);
    const [loading, setLoading] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', discount: 0, category: 'Fashion', brand: '', images: ['']
    });
    const [editingItem, setEditingItem] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        if (!authLoading && (!userInfo || userInfo.role !== 'retailer')) {
            navigate(userInfo?.role === 'admin' ? '/admin' : '/');
        }
    }, [userInfo, authLoading]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('tab', activeTab);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }, [activeTab]);

    const fetchData = async () => {
        if (!userInfo?._id) return;
        setLoading(true);
        try {
            const { data: allProducts } = await api.get('/products');
            const sellerProducts = allProducts.filter(p => (p.seller?._id || p.seller) === userInfo._id);
            setProducts(sellerProducts);

            const { data: allOrders } = await api.get('/orders');
            // Filter orders that contain products from this seller
            const sellerOrders = allOrders.filter(order => 
                order.orderItems.some(item => sellerProducts.some(p => p._id === item.product))
            );
            setOrders(sellerOrders);

            const sellerRevenue = sellerOrders.reduce((acc, order) => {
                const orderPart = order.orderItems
                    .filter(item => sellerProducts.some(p => p._id === item.product))
                    .reduce((oAcc, item) => oAcc + (item.price * item.quantity), 0);
                return acc + orderPart;
            }, 0);

            setStats({
                products: sellerProducts.length,
                orders: sellerOrders.length,
                revenue: sellerRevenue,
                customers: new Set(sellerOrders.map(o => o.user?._id)).size
            });
        } catch (err) {
            console.error('Retailer Hub Error:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!authLoading && userInfo?.role === 'retailer') {
            fetchData();
        }
    }, [userInfo, authLoading]);

    // ✅ Now safe to conditionally return AFTER all hooks are declared
    if (authLoading || !userInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f3f6]">
                <Loader2 size={64} className="text-[#2874f0] animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 animate-pulse">Authenticating Business Hub...</p>
            </div>
        );
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                discount: Number(formData.discount),
                images: formData.images.filter(img => img.trim() !== '')
            };

            if (editingItem) {
                await api.put(`/products/${editingItem._id}`, payload);
                setSuccessMsg('Product updated successfully');
            } else {
                await api.post('/products', payload);
                setSuccessMsg('Product listed successfully');
            }
            
            setIsProductModalOpen(false);
            setEditingItem(null);
            setFormData({ title: '', description: '', price: '', discount: 0, category: 'Fashion', brand: '', images: [''] });
            await fetchData();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to remove this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setSuccessMsg('Product removed');
            await fetchData();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            alert('Delete failed');
        }
    };

    const startEdit = (p) => {
        setEditingItem(p);
        setFormData({
            title: p.title,
            description: p.description,
            price: p.price,
            discount: p.discount || 0,
            category: p.category,
            brand: p.brand,
            images: p.images.length > 0 ? p.images : ['']
        });
        setIsProductModalOpen(true);
    };

    // Profile Management Protocol
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: userInfo?.name || '',
        bio: userInfo?.bio || '',
        mobile: userInfo?.mobile || '',
        address: userInfo?.address || '',
        city: userInfo?.city || '',
        state: userInfo?.state || '',
        pincode: userInfo?.pincode || '',
        profilePic: userInfo?.profilePic || ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const { data } = await api.put('/auth/profile', profileForm);
            login(data);
            setIsProfileModalOpen(false);
            setSuccessMsg('Business Identity Reconfigured Successfully');
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error('Update failed:', err);
            const msg = err.response?.data?.message || 'Security Protocol Failure: Unable to verify identity changes.';
            alert(msg);
        } finally {
            setProfileLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans">
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col pt-4">
                    <div className="px-6 mb-8 flex items-center justify-center p-3.5 bg-blue-50/50 rounded-b-2xl border-b border-blue-100 group">
                        <div className="bg-[#2874f0] p-1.5 rounded-lg shadow-md group-hover:rotate-12 transition-transform">
                            <ShoppingBag size={18} className="text-[#ffe500]" />
                        </div>
                        <div className="flex flex-col ml-2.5 leading-none">
                            <span className="text-[#2874f0] font-black text-lg tracking-tighter italic">Flipkart</span>
                            <span className="text-[#fb641b] font-black text-[10px] uppercase tracking-widest mt-0.5">Seller Hub</span>
                        </div>
                    </div>
                    <nav className="space-y-1 px-4">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'listings', label: 'My Listings', icon: Package },
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'payments', label: 'Payments', icon: Wallet },
                            { id: 'profile', label: 'Profile', icon: Users }
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-sm text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-[#2874f0] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main View */}
                <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-64px)]">
                    {successMsg && (
                        <div className="fixed top-20 right-8 bg-green-600 text-white px-6 py-3 rounded-sm shadow-2xl z-[100] animate-in slide-in-from-right-12 duration-300 font-bold text-sm">
                            {successMsg}
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-800">Welcome, {userInfo?.name || 'Partner'}</h1>
                                <button onClick={() => setIsWithdrawModalOpen(true)} className="bg-green-600 text-white px-6 py-2.5 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md">
                                    <Wallet size={16} /> Withdraw Earnings
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Listings', value: stats.products, icon: Package, color: 'blue' },
                                    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'orange' },
                                    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: BarChart3, color: 'green' },
                                    { label: 'Active Customers', value: stats.customers, icon: Users, color: 'purple' }
                                ].map((s, i) => (
                                    <div key={i} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
                                        <div className={`p-4 rounded-full bg-${s.color}-50 text-${s.color === 'blue' ? 'blue-600' : s.color === 'orange' ? 'orange-600' : s.color === 'green' ? 'green-600' : 'purple-600'}`}>
                                            <s.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
                                            <p className="text-2xl font-extrabold text-gray-800">{s.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <ShoppingBag size={20} className="text-blue-600" /> Recent Sales
                                    </h2>
                                    <div className="space-y-4">
                                        {orders.slice(0, 5).map(o => (
                                            <div key={o._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-sm hover:bg-blue-50 transition-colors cursor-pointer">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{o.user?.name || 'Customer'}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-extrabold text-[#2874f0]">₹{o.totalPrice.toLocaleString()}</p>
                                                    <p className="text-[10px] uppercase font-black text-green-600 tracking-tighter">{o.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <LayoutDashboard size={20} className="text-orange-600" /> Quick Actions
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setIsProductModalOpen(true)} className="p-6 bg-blue-50 text-blue-700 rounded-sm flex flex-col items-center gap-3 hover:bg-blue-100 transition-colors">
                                            <Plus size={24} />
                                            <span className="text-xs font-bold uppercase">Add New Listing</span>
                                        </button>
                                        <button onClick={() => setActiveTab('listings')} className="p-6 bg-orange-50 text-orange-700 rounded-sm flex flex-col items-center gap-3 hover:bg-orange-100 transition-colors">
                                            <Package size={24} />
                                            <span className="text-xs font-bold uppercase">Manage Inventory</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                                <button onClick={() => setIsProductModalOpen(true)} className="bg-[#fb641b] text-white px-8 py-2.5 rounded-sm text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all">
                                    <Plus size={18} /> Add New Product
                                </button>
                            </div>

                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[2px] text-gray-500 border-b">
                                        <tr>
                                            <th className="px-6 py-4">Product Info</th>
                                            <th className="px-6 py-4">Stock Status</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Economics</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map(p => (
                                            <tr key={p._id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-6 flex items-center gap-4">
                                                    <img src={p.images[0]} alt="" className="w-12 h-12 object-contain rounded-sm bg-white shadow-sm" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#2874f0]">{p.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{p.category} | {p.brand}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">In Stock</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <p className="text-sm font-extrabold text-gray-800">₹{p.price.toLocaleString()}</p>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="text-[10px] font-bold text-orange-600">{p.discount}% OFF</div>
                                                    <div className="text-[8px] text-gray-400 uppercase">Earning: ₹{(p.price * 0.95).toFixed(0)}</div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button onClick={() => startEdit(p)} className="text-blue-600 hover:scale-125 transition-transform"><Edit size={16} /></button>
                                                        <button onClick={() => deleteProduct(p._id)} className="text-red-600 hover:scale-125 transition-transform"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <h1 className="text-2xl font-bold text-gray-800">Sales Orders</h1>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[2px] text-gray-500 border-b">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Total</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-12 text-gray-400 font-bold text-sm">No orders yet. Start selling to see your orders here!</td></tr>
                                        ) : orders.map(o => (
                                            <tr key={o._id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <span className="text-xs font-black text-[#2874f0] uppercase">#{o._id.toString().slice(-8).toUpperCase()}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-gray-800">{o.user?.name || 'Customer'}</p>
                                                    <p className="text-[10px] text-gray-400">{o.user?.email}</p>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-600 font-semibold">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-5 text-sm font-extrabold text-gray-800">₹{o.totalPrice.toLocaleString()}</td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                                                        o.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        o.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-orange-50 text-orange-600 border-orange-100'
                                                    }`}>{o.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <h1 className="text-2xl font-bold text-gray-800">Business Profile</h1>
                            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col items-center max-w-2xl mx-auto mt-10">
                                <div className="w-24 h-24 rounded-full bg-[#2874f0] flex items-center justify-center text-white text-4xl font-extrabold mb-6 shadow-lg overflow-hidden border-4 border-white">
                                    {userInfo.profilePic ? (
                                        <img src={userInfo.profilePic} className="w-full h-full object-cover" alt="Profile" />
                                    ) : userInfo.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-black text-[#172337]">{userInfo.name}</h2>
                                <p className="text-sm text-gray-500 font-semibold mb-8">{userInfo.email}</p>
                                
                                <div className="w-full space-y-4 mt-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-sm border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Merchant ID</span>
                                            <span className="text-sm font-black text-[#2874f0] truncate">{userInfo._id}</span>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-sm border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Status</span>
                                            <span className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={14}/> Verified</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-4 bg-gray-50 rounded-sm border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Contact</span>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-800">{userInfo.email}</span>
                                            <span className="text-sm font-bold text-gray-800">{userInfo.mobile || 'Not provided'}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-4 bg-gray-50 rounded-sm border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Operating Address</span>
                                        <span className="text-sm font-bold text-gray-800">{userInfo.address || 'India'}</span>
                                        {(userInfo.city || userInfo.state) && (
                                            <span className="text-xs text-gray-500 font-semibold">{userInfo.city}, {userInfo.state} {userInfo.pincode}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col p-4 bg-gray-50 rounded-sm border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Bio</span>
                                        <span className="text-sm font-semibold text-gray-600 italic">"{userInfo.bio || 'Official Flipkart Marketplace Partner.'}"</span>
                                    </div>
                                    
                                    <div className="flex justify-end pt-4">
                                        <button 
                                            onClick={() => setIsProfileModalOpen(true)}
                                            className="text-[#2874f0] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2"
                                        >
                                            <Settings size={14} /> Edit Identity
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-40"></div>
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic border-l-8 border-[#2874f0] pl-8">Business Intelligence</h2>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[6px] mt-4 ml-8">Revenue Lifecycle Analysis (7D)</p>
                                </div>

                                <div className="mt-20 flex justify-between items-end h-[350px] gap-8 relative z-20">
                                    {(() => {
                                        const dailyTotals = [...Array(7)].map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - (6 - i));
                                            const dateStr = d.toISOString().split('T')[0];
                                            const dayRev = orders
                                                .filter(o => o.createdAt?.startsWith(dateStr))
                                                .reduce((acc, o) => {
                                                    const orderPart = o.orderItems
                                                        .filter(item => products.some(p => p._id === item.product))
                                                        .reduce((oAcc, item) => oAcc + (item.price * item.quantity), 0);
                                                    return acc + orderPart;
                                                }, 0);
                                            return { date: d, revenue: dayRev };
                                        });
                                        const maxRev = Math.max(...dailyTotals.map(d => d.revenue), 1000);

                                        return dailyTotals.map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                                                <div className="relative w-full flex flex-col items-center justify-end h-full">
                                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl z-30">
                                                        ₹{day.revenue.toLocaleString()}
                                                    </div>
                                                    <div 
                                                        style={{ height: `${(day.revenue / maxRev * 100) || 4}%` }}
                                                        className={`w-full max-w-[50px] rounded-t-2xl transition-all duration-1000 group-hover:scale-x-110 shadow-lg ${day.revenue > 0 ? 'bg-gradient-to-t from-blue-700 to-blue-400' : 'bg-gray-100'}`}
                                                    ></div>
                                                </div>
                                                <span className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Profitability / Trends */}
                                <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-xl flex flex-col justify-center">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Category Inventory Velocity</h3>
                                    <div className="space-y-6">
                                        {(() => {
                                            const catStats = orders.reduce((acc, o) => {
                                                o.orderItems.forEach(item => {
                                                    const matchingProd = products.find(p => p._id === (item.product?._id || item.product));
                                                    if (matchingProd) {
                                                        const cat = matchingProd.category;
                                                        acc[cat] = (acc[cat] || 0) + item.quantity;
                                                    }
                                                });
                                                return acc;
                                            }, {});
                                            const totalUnits = Object.values(catStats).reduce((a, b) => a + b, 0) || 1;

                                            return Object.entries(catStats).sort((a,b) => b[1] - a[1]).slice(0, 4).map(([cat, units], i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{cat}</span>
                                                        <span className="text-[9px] font-bold text-blue-600">{units} Units Sold</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                                        <div 
                                                            style={{ width: `${(units/totalUnits*100)}%` }}
                                                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                                                        ></div>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>

                                {/* Efficiency Cluster */}
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: 'Asset Turnover', value: '4.2x', sub: 'Listing Liquidity Score', icon: Package },
                                        { label: 'Earning Efficiency', value: '92%', sub: 'Post-Commission Net', icon: Wallet }
                                    ].map((n, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl flex items-center gap-6">
                                            <div className="p-4 bg-gray-50 rounded-2xl text-blue-600">
                                                <n.icon size={24} />
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{n.label}</span>
                                                <span className="block text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{n.value}</span>
                                                <span className="block text-[9px] font-bold text-green-600 uppercase mt-1">{n.sub}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                           <div className="flex justify-between items-center bg-white p-10 rounded-[32px] border border-gray-50 shadow-xl">
                                <div>
                                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[4px] mb-2">Clearing Balance</h2>
                                    <p className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">₹{stats.revenue.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-4">
                                     <button 
                                        onClick={() => {
                                            const csvContent = "data:text/csv;charset=utf-8," 
                                                + "Order ID,Date,Revenue\n"
                                                + orders.map(o => `${o._id},${o.createdAt},${o.totalPrice}`).join("\n");
                                            const encodedUri = encodeURI(csvContent);
                                            const link = document.createElement("a");
                                            link.setAttribute("href", encodedUri);
                                            link.setAttribute("download", `flipkart_payments_${userInfo?._id}.csv`);
                                            document.body.appendChild(link);
                                            link.click();
                                        }}
                                        className="bg-gray-100 text-gray-800 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all border border-gray-200"
                                     >
                                        Export Ledger (.CSV)
                                     </button>
                                     <button onClick={() => setIsWithdrawModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                                        Initialize Withdrawal
                                     </button>
                                </div>
                           </div>

                           <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-50">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[4px] mb-12">Earnings Settlement Graph</h3>
                                <div className="flex justify-between items-end h-[300px] gap-6 relative">
                                    {(() => {
                                        const dailyTotals = [...Array(7)].map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - (6 - i));
                                            const dateStr = d.toISOString().split('T')[0];
                                            const dayRev = orders
                                                .filter(o => o.createdAt?.startsWith(dateStr))
                                                .reduce((acc, o) => {
                                                    const orderPart = o.orderItems
                                                        .filter(item => products.some(p => p._id === item.product))
                                                        .reduce((oAcc, item) => oAcc + (item.price * item.quantity), 0);
                                                    return acc + orderPart;
                                                }, 0);
                                            return { date: d, revenue: dayRev };
                                        });
                                        const maxRev = Math.max(...dailyTotals.map(d => d.revenue), 1000);

                                        return dailyTotals.map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                                                <div className="relative w-full flex flex-col items-center justify-end h-full">
                                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl z-30">
                                                        ₹{day.revenue.toLocaleString()}
                                                    </div>
                                                    <div 
                                                        style={{ height: `${(day.revenue / maxRev * 100) || 4}%` }}
                                                        className={`w-full max-w-[40px] rounded-t-xl transition-all duration-1000 group-hover:scale-x-110 ${day.revenue > 0 ? 'bg-gradient-to-t from-green-600 to-green-400 shadow-lg shadow-green-50' : 'bg-gray-50'}`}
                                                    ></div>
                                                </div>
                                                <span className="mt-4 text-[9px] font-black text-gray-400 uppercase">{day.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                           </div>

                           <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
                                <div className="p-10 border-b border-gray-50">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Electronic Transaction Ledger</h3>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
                                        <tr>
                                            <th className="px-10 py-6">Transaction ID</th>
                                            <th className="px-10 py-6">Reference</th>
                                            <th className="px-10 py-6">Amount</th>
                                            <th className="px-10 py-6 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map(o => {
                                            const myRev = o.orderItems
                                                .filter(item => products.some(p => p._id === item.product))
                                                .reduce((acc, item) => acc + (item.price * item.quantity), 0);
                                            return (
                                                <tr key={o._id} className="hover:bg-blue-50/20">
                                                    <td className="px-10 py-6 font-black text-xs text-blue-600 uppercase">#{o._id.toString().slice(-8).toUpperCase()}</td>
                                                    <td className="px-10 py-6 text-xs text-gray-500 font-bold">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-10 py-6 font-black text-gray-900 italic">₹{myRev.toLocaleString()}</td>
                                                    <td className="px-10 py-6 text-right">
                                                        <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-100">Settled</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                           </div>
                        </div>
                    )}

                    {/* Modals & Other Tabs... */}
                    {(isProductModalOpen) && (
                        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="bg-[#2874f0] p-6 text-white flex justify-between items-center">
                                    <h3 className="text-xl font-bold uppercase tracking-widest">{editingItem ? 'Edit Product Asset' : 'Push New Marketplace Asset'}</h3>
                                    <button onClick={() => { setIsProductModalOpen(false); setEditingItem(null); }} className="hover:rotate-90 transition-transform"><Plus size={32} className="rotate-45" /></button>
                                </div>
                                <form onSubmit={handleProductSubmit} className="p-10 grid grid-cols-2 gap-10 overflow-y-auto">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Master Title</label>
                                            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Asset Description</label>
                                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-500">Listing Price (₹)</label>
                                                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-500">Economic Discount (%)</label>
                                                <input required type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Sector (Category)</label>
                                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all">
                                                {['Fashion', 'Electronics', 'Home', 'Mobile', 'Grocery', 'Appliances'].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Brand Identity</label>
                                            <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Media Vault (Image URL)</label>
                                            <input required value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <button type="submit" className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-6 uppercase tracking-widest text-xs">
                                            {editingItem ? 'Confirm Update' : 'Initialize Listing'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Business Profile reconfiguration Vault */}
                    {isProfileModalOpen && (
                        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="bg-[#fb641b] p-6 text-white flex justify-between items-center">
                                    <h3 className="text-xl font-bold uppercase tracking-widest italic">Merchant Profile Configuration</h3>
                                    <button onClick={() => setIsProfileModalOpen(false)} className="hover:rotate-90 transition-transform"><Plus size={32} className="rotate-45" /></button>
                                </div>
                                <form onSubmit={handleProfileUpdate} className="p-8 space-y-6 overflow-y-auto">
                                    <div className="flex items-center gap-6 mb-8 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                        <div className="w-20 h-20 rounded-full bg-[#fb641b] flex items-center justify-center text-white text-3xl font-black shadow-lg overflow-hidden border-4 border-white">
                                            {profileForm.profilePic ? (
                                                <img src={profileForm.profilePic} className="w-full h-full object-cover" alt="Profile" />
                                            ) : userInfo.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Identity Avatar (URL)</label>
                                            <input 
                                                value={profileForm.profilePic} 
                                                onChange={e => setProfileForm({...profileForm, profilePic: e.target.value})} 
                                                placeholder="Paste PNG/JPG URL here"
                                                className="w-full border-2 border-gray-100 p-2 rounded-sm focus:border-[#fb641b] outline-none text-xs" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Display Name</label>
                                            <input required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Contact Mobile</label>
                                            <input value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500">Merchant Bio (Marketplace Statement)</label>
                                        <textarea rows={2} value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">City</label>
                                            <input value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">State</label>
                                            <input value={profileForm.state} onChange={e => setProfileForm({...profileForm, state: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">PIN Code</label>
                                            <input value={profileForm.pincode} onChange={e => setProfileForm({...profileForm, pincode: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-sm focus:border-fb-blue outline-none transition-all" />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={profileLoading}
                                        className={`w-full ${profileLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2874f0] hover:scale-[1.02] active:scale-95'} text-white py-4 rounded-sm font-black shadow-xl transition-all mt-4 uppercase tracking-[4px] text-xs flex items-center justify-center gap-2`}
                                    >
                                        {profileLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Synchronizing...
                                            </>
                                        ) : 'Confirm Identity Reconfiguration'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RetailerDashboard;
