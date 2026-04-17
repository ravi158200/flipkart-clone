import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Package, LayoutDashboard, Search, Trash2, Edit, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const { userInfo, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ✅ All hooks MUST be declared before any conditional returns
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({
        title: '', description: '', price: '', discount: 0, category: 'Fashion', brand: '', images: ['']
    });
    const [editingItem, setEditingItem] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        if (!authLoading && (!userInfo || userInfo.role !== 'admin')) {
            navigate(userInfo?.role === 'retailer' ? '/retailer-dashboard' : '/');
        }
    }, [userInfo, authLoading]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
            const total = data.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
            setStats(prev => ({ ...prev, orders: data.length, revenue: total }));
        } catch (err) {
            console.error('Error fetching global orders:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setItems(data);
            setStats(prev => ({ ...prev, products: data.length }));
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
            setStats(prev => ({ ...prev, users: data.length }));
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading || !userInfo || userInfo.role !== 'admin') return;
            setLoading(true);
            try {
                if (activeTab === 'dashboard' || activeTab === 'products' || activeTab === 'analytics') await fetchProducts();
                if (activeTab === 'dashboard' || activeTab === 'users') await fetchUsers();
                if (activeTab === 'dashboard' || activeTab === 'orders' || activeTab === 'analytics') await fetchOrders();
            } catch (err) {
                console.error('Error fetching admin data:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [activeTab, userInfo, authLoading]);

    // ✅ Now safe to conditionally return AFTER all hooks
    if (authLoading) return null;

    const handleDownloadPDF = () => {
        window.print();
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Data Sanitization Node
            const sterilizedProduct = {
                ...newProduct,
                price: Number(newProduct.price),
                discount: Number(newProduct.discount || 0),
                images: newProduct.images.filter(img => img.trim() !== '') // Remove empty image nodes
            };

            if (sterilizedProduct.images.length === 0) {
                alert('CRITICAL: At least one valid image URL is required.');
                setLoading(false);
                return;
            }

            if (editingItem) {
                await api.put(`/products/${editingItem._id}`, sterilizedProduct);
                setSuccessMsg('INVENTORY UPDATED: Product modifications successfully pushed to the vault.');
            } else {
                await api.post('/products', sterilizedProduct);
                setSuccessMsg('VAULT PUSH: New product successfully integrated into the catalog.');
            }
            
            setIsModalOpen(false);
            setEditingItem(null);
            setNewProduct({ title: '', description: '', price: '', discount: 0, category: 'Fashion', brand: '', images: [''] });
            await fetchProducts();
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            console.error('Save Error:', err.response?.data || err.message);
            alert(`FAILED: ${err.response?.data?.message || 'Server Validation Error'}`);
        }
        setLoading(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('ARE YOU ABSOLUTELY SURE? This will permanently delete the product from the inventory.')) return;
        setLoading(true);
        try {
            await api.delete(`/products/${id}`);
            setSuccessMsg('ASSET DELETED: Product successfully removed from the inventory vault.');
            await fetchProducts();
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            alert('Deletion failed. Please try again.');
        }
        setLoading(false);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setNewProduct({
            title: item.title,
            description: item.description,
            price: item.price,
            discount: item.discount || 0,
            category: item.category,
            brand: item.brand,
            images: item.images || [item.image] || ['']
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingItem(null);
        setNewProduct({ title: '', description: '', price: '', discount: 0, category: 'Fashion', brand: '', images: [''] });
        setIsModalOpen(true);
    };
    
    return (
        <div className="min-h-screen bg-[#f1f3f6] flex">
            {/* Sidebar */}
            <aside className="w-68 bg-white shadow-2xl border-r border-gray-100 flex flex-col h-[calc(100vh-56px)] sticky top-14 z-40">
                <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                        <LayoutDashboard size={24} className="text-blue-100" /> Control Center
                    </h2>
                    <p className="text-[10px] font-bold text-blue-200 mt-1 uppercase tracking-widest">Flipkart Management</p>
                </div>
                <nav className="flex-grow p-5 mt-6 space-y-3">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-[#2874f0] text-white shadow-xl shadow-blue-100 scale-[1.02] active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard size={18} /> Dashboard
                        </div>
                        <ChevronRight size={14} className={activeTab === 'dashboard' ? 'opacity-100' : 'opacity-0'} />
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-[#2874f0] text-white shadow-xl shadow-blue-100 scale-[1.02] active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Package size={18} /> Products
                        </div>
                        <ChevronRight size={14} className={activeTab === 'products' ? 'opacity-100' : 'opacity-0'} />
                    </button>
                                <div className={`w-full flex items-center justify-between p-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-[#2874f0] text-white shadow-xl shadow-blue-100 scale-[1.02] active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`} onClick={() => setActiveTab('users')}>
                                    <div className="flex items-center gap-3"><Users size={18} /> User Records</div>
                                    <ChevronRight size={14} className={activeTab === 'users' ? 'opacity-100' : 'opacity-0'} />
                                </div>
                                <div className={`w-full flex items-center justify-between p-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-[#2874f0] text-white shadow-xl shadow-blue-100 scale-[1.02] active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`} onClick={() => setActiveTab('analytics')}>
                                    <div className="flex items-center gap-3"><LayoutDashboard size={18} /> Daily Analysis</div>
                                    <ChevronRight size={14} className={activeTab === 'analytics' ? 'opacity-100' : 'opacity-0'} />
                                </div>
                                <div className={`w-full flex items-center justify-between p-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#2874f0] text-white shadow-xl shadow-blue-100 scale-[1.02] active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`} onClick={() => setActiveTab('orders')}>
                                    <div className="flex items-center gap-3"><ShoppingBag size={18} /> Marketplace Orders</div>
                                    <ChevronRight size={14} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-0'} />
                                </div>
                            </nav>
                        </aside>

                        <main className="flex-1 p-10">
                            {loading && (
                                <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[200] flex items-center justify-center">
                                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin text-[#2874f0]" size={48} />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Updating Vault...</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'dashboard' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="flex items-baseline gap-4">
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Executive Overview</h1>
                                        <div className="h-1 flex-1 bg-gray-200 rounded-full opacity-20"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        {[
                                            { label: 'Total Products', value: stats.products, icon: Package, color: 'blue' },
                                            { label: 'Total Users', value: stats.users, icon: Users, color: 'green' },
                                            { label: 'Gross Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: ShoppingBag, color: 'emerald' }
                                        ].map((stat, i) => (
                                <div key={i} className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-50 flex flex-col gap-6 group hover:translate-y-[-8px] hover:shadow-2xl transition-all duration-500">
                                    <div className={`w-16 h-16 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={32} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[3px] mb-2">{stat.label}</p>
                                        <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-50 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex flex-col">
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Inventory</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time Catalog Management</p>
                            </div>
                            <button 
                                onClick={openAddModal}
                                className="bg-[#fb641b] text-white px-10 py-4 rounded-2xl font-black flex items-center gap-4 shadow-2xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[2px]"
                            >
                                <Plus size={22} /> Add New Entry
                            </button>
                        </div>
                        
                        {isModalOpen && (
                            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-lg animate-in fade-in duration-500">
                                <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-12 max-h-[90vh] overflow-y-auto border border-white/20">
                                    <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-8">
                                        <div className="flex flex-col">
                                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{editingItem ? 'Edit Product' : 'New Product'}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 tracking-[3px] uppercase mt-1">Catalog Entry Terminal</p>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-3 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all rotate-45 hover:rotate-[135deg]">
                                            <Plus size={28} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-8">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Product Title</label>
                                            <input required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner" placeholder="e.g. NeoBook Ultra Edition" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Market Price (₹)</label>
                                            <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner" placeholder="99,999" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Promotion Discount (%)</label>
                                            <input type="number" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner" placeholder="0" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Manufacturer</label>
                                            <input required value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner" placeholder="e.g. Sony" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Inventory Category</label>
                                            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-black transition-all appearance-none cursor-pointer shadow-inner">
                                                {['Fashion', 'Electronics', 'Mobiles', 'Home', 'Beauty', 'Toys'].map(cat => (
                                                    <option key={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Asset Description</label>
                                            <textarea required rows="4" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner" placeholder="Provide a deep technical breakdown of the product specs..." />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-3 ml-1">Universal Asset Locators (Image URLs)</label>
                                            {newProduct.images.map((msg, i) => (
                                                <div key={i} className="flex gap-4 mb-4">
                                                    <input required value={msg} onChange={e => {
                                                        const updated = [...newProduct.images];
                                                        updated[i] = e.target.value;
                                                        setNewProduct({...newProduct, images: updated});
                                                    }} className="flex-1 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner" placeholder={`Source URL #${i+1}`} />
                                                    {i > 0 && (
                                                        <button type="button" onClick={() => setNewProduct({...newProduct, images: newProduct.images.filter((_, idx) => idx !== i)})} className="bg-red-50 text-red-600 p-5 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setNewProduct({...newProduct, images: [...newProduct.images, '']})} className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl uppercase tracking-[2px] transition-all border-2 border-dashed border-blue-200 w-full mt-2">+ Cluster New Image Node</button>
                                        </div>
                                        <div className="col-span-2 pt-8">
                                            <button type="submit" className="w-full bg-[#2874f0] text-white py-6 rounded-[32px] font-black shadow-2xl shadow-blue-100 uppercase tracking-[4px] hover:scale-[1.02] active:scale-95 transition-all outline-none border-b-6 border-blue-800">
                                                {editingItem ? 'Save Changes' : 'Push to Inventory'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-gray-400 font-black text-[10px] uppercase tracking-[4px]">
                                        <th className="px-8 pb-6">Asset Details</th>
                                        <th className="px-8 pb-6">classification</th>
                                        <th className="px-8 pb-6">Market Value</th>
                                        <th className="px-8 pb-6 text-right">Operation Terminal</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {items.map((item) => (
                                        <tr key={item._id} className="group bg-white hover:bg-blue-50/30 transition-all duration-300 rounded-3xl overflow-hidden border border-transparent hover:border-blue-100 shadow-sm hover:shadow-xl translate-all">
                                            <td className="px-8 py-8 flex items-center gap-6 rounded-l-[32px]">
                                                <div className="w-20 h-20 bg-gray-50 rounded-2xl p-3 border border-gray-100 overflow-hidden group-hover:scale-110 transition-transform shadow-inner shrink-0">
                                                    <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/150'} className="w-full h-full object-contain" alt={item.title} />
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <p className="font-black text-gray-900 line-clamp-1 text-lg tracking-tight uppercase">{item.title}</p>
                                                    <p className="text-[10px] text-blue-400 font-bold tracking-widest mt-1">UID: {item._id.slice(-8)}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">{item.category}</span>
                                            </td>
                                            <td className="px-8 py-8 font-black text-gray-900 text-xl tracking-tighter">₹{item.price.toLocaleString()}</td>
                                            <td className="px-8 py-8 text-right rounded-r-[32px] space-x-4">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="p-4 text-blue-600 hover:bg-white rounded-2xl shadow-sm hover:shadow-xl border border-transparent hover:border-blue-100 hover:scale-110 active:scale-90 transition-all duration-300"
                                                >
                                                    <Edit size={22} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(item._id)}
                                                    className="p-4 text-red-600 hover:bg-white rounded-2xl shadow-sm hover:shadow-xl border border-transparent hover:border-red-100 hover:scale-110 active:scale-90 transition-all duration-300"
                                                >
                                                    <Trash2 size={22} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 animate-in zoom-in-95 duration-300">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">User Access Control</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Global Permissions Management</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#2874f0]/5 text-gray-700 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-6 rounded-tl-xl">Identification</th>
                                        <th className="px-8 py-6">Communication</th>
                                        <th className="px-8 py-6">Permission Level</th>
                                        <th className="px-8 py-6 rounded-tr-xl">Security Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-sm text-gray-700">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50 transition-all border-b border-gray-50">
                                            <td className="px-8 py-8 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                    {u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                                                </div>
                                                <p className="font-black text-gray-900 uppercase tracking-tight">{u.name}</p>
                                            </td>
                                            <td className="px-8 py-8 font-bold text-gray-400">{u.email}</td>
                                            <td className="px-8 py-8 uppercase">
                                                <span className={`px-4 py-2 rounded-full text-[9px] font-black tracking-widest border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : u.role === 'retailer' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <button className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 active:scale-95"><Trash2 size={20} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === 'analytics' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Daily Revenue Analysis</h1>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">7-Day Economic Lifecycle Mapping</p>
                            </div>
                            <div className="flex gap-4 items-center no-print">
                                <div className="text-right mr-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Sales (7D)</p>
                                    <p className="text-2xl font-black text-blue-600 tracking-tighter italic">₹{orders.filter(o => {
                                        const d = new Date();
                                        d.setDate(d.getDate() - 7);
                                        return new Date(o.createdAt) > d;
                                    }).reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={handleDownloadPDF}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
                                >
                                    Download PDF Report
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Revenue Graph Hub */}
                            <div className="lg:col-span-2 bg-white p-12 rounded-[48px] shadow-2xl border border-gray-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[4px] mb-12">Revenue Lifecycle (7D)</h3>
                                <div className="flex justify-between items-end h-[350px] gap-6 relative z-10">
                                    {(() => {
                                        // Pre-calculate daily metrics for performance
                                        const dailyTotals = [...Array(7)].map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - (6 - i));
                                            const dateStr = d.toISOString().split('T')[0];
                                            const dayRev = orders.filter(o => o.createdAt?.startsWith(dateStr)).reduce((acc, o) => acc + (o.totalPrice || 0), 0);
                                            return { date: d, revenue: dayRev, dateStr };
                                        });
                                        const maxRev = Math.max(...dailyTotals.map(d => d.revenue), 1000);
                                        const avgRev = dailyTotals.reduce((acc, d) => acc + d.revenue, 0) / 7;
                                        const avgHeight = (avgRev / maxRev) * 100;

                                        return (
                                            <>
                                                {/* Performance Baseline Line */}
                                                <div 
                                                    style={{ bottom: `${avgHeight + 9}%` }} 
                                                    className="absolute left-0 right-0 border-t-2 border-dashed border-blue-600/20 z-0 flex justify-end"
                                                >
                                                    <span className="bg-white px-2 -mt-3 text-[8px] font-black text-blue-600 uppercase tracking-tighter">Avg Performance</span>
                                                </div>

                                                {dailyTotals.map((day, i) => {
                                                    const height = (day.revenue / maxRev) * 100;
                                                    return (
                                                        <div key={i} className="flex-1 flex flex-col items-center group gap-4 h-full">
                                                            <div className="relative w-full h-full flex flex-col justify-end items-center">
                                                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all bg-gray-900/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-2xl z-20 whitespace-nowrap">
                                                                    ₹{day.revenue.toLocaleString()}
                                                                </div>
                                                                <div 
                                                                    style={{ height: `${Math.max(height, 4)}%` }}
                                                                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-1000 group-hover:scale-x-110 group-hover:shadow-[0_20px_40px_-10px_rgba(40,116,240,0.4)] relative ${day.revenue > 0 ? (day.revenue >= avgRev ? 'bg-gradient-to-t from-blue-700 to-blue-400' : 'bg-gradient-to-t from-gray-400 to-gray-300') : 'bg-gray-100 border-2 border-dashed border-gray-100'}`}
                                                                >
                                                                    {day.revenue >= avgRev && day.revenue > 0 && (
                                                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm shadow-white"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[9px] font-black text-gray-900 uppercase">{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Category Distribution Terminal */}
                            <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-50 flex flex-col h-full">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[4px] mb-10">Sector Dominance</h3>
                                <div className="space-y-6 flex-1 flex flex-col justify-center">
                                    {Object.entries(items.reduce((acc, p) => {
                                        acc[p.category] = (acc[p.category] || 0) + 1;
                                        return acc;
                                    }, {})).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([cat, count], i) => {
                                        const percentage = items.length > 0 ? (count / items.length * 100) : 0;
                                        return (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{cat}</span>
                                                    <span className="text-[10px] font-bold text-blue-600">{percentage.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                                    <div 
                                                        style={{ width: `${percentage}%` }} 
                                                        className={`h-full bg-gradient-to-r ${i === 0 ? 'from-blue-600 to-blue-400' : 'from-gray-300 to-gray-200'} transition-all duration-1000`}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Top Merchants Performance Ledger */}
                        <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-50">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[4px] mb-12">Merchant Performance Hierarchy</h3>
                            <div className="space-y-8">
                                {(() => {
                                    // Calculate revenue per seller
                                    const sellerStats = orders.reduce((acc, o) => {
                                        o.orderItems.forEach(item => {
                                            const sId = item.seller?._id || item.seller;
                                            if (sId) {
                                                const sName = users.find(u => u._id === sId)?.name || `Merchant ${sId.toString().slice(-4)}`;
                                                acc[sId] = acc[sId] || { name: sName, revenue: 0, orders: new Set() };
                                                acc[sId].revenue += (item.price * item.quantity);
                                                acc[sId].orders.add(o._id);
                                            }
                                        });
                                        return acc;
                                    }, {});

                                    const sortedSellers = Object.entries(sellerStats).sort((a,b) => b[1].revenue - a[1].revenue).slice(0, 5);
                                    const maxSellerRev = Math.max(...sortedSellers.map(s => s[1].revenue), 1000);

                                    return sortedSellers.map(([id, data], i) => (
                                        <div key={id} className="group">
                                            <div className="flex justify-between items-end mb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] border border-blue-100">#{i+1}</div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{data.name}</p>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{data.orders.size} Successful Orders</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-black text-blue-600 italic">₹{data.revenue.toLocaleString()}</p>
                                            </div>
                                            <div className="w-full h-4 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-0.5">
                                                <div 
                                                    style={{ width: `${(data.revenue / maxSellerRev * 100)}%` }}
                                                    className={`h-full rounded-md transition-all duration-[1500ms] ${i === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(40,116,240,0.3)]' : 'bg-gray-300'}`}
                                                ></div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        {/* Per-Day Statistical Report */}
                        <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-50">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-10 border-l-4 border-fb-blue pl-4">Detailed Daily Ledger</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-gray-400 font-black text-[10px] uppercase tracking-[4px]">
                                            <th className="px-8 pb-4">Timeline</th>
                                            <th className="px-8 pb-4">Transaction Count</th>
                                            <th className="px-8 pb-4">Net value</th>
                                            <th className="px-8 pb-4">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {[...Array(7)].map((_, i) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() - i);
                                            const dateStr = date.toISOString().split('T')[0];
                                            const dayOrders = orders.filter(o => (o.createdAt?.split('T')[0]) === dateStr);
                                            const dayRevenue = dayOrders.reduce((acc, o) => acc + o.totalPrice, 0);

                                            return (
                                                <tr key={i} className="bg-gray-50/30 hover:bg-blue-50/50 transition-all rounded-2xl group">
                                                    <td className="px-8 py-6 rounded-l-2xl font-black text-gray-700">
                                                        {date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-8 py-6 font-bold text-gray-500">
                                                        <span className="bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100">{dayOrders.length} Orders</span>
                                                    </td>
                                                    <td className="px-8 py-6 font-black text-gray-900 text-lg tracking-tighter">
                                                        ₹{dayRevenue.toLocaleString()}
                                                    </td>
                                                    <td className="px-8 py-6 rounded-r-2xl">
                                                        <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full w-fit ${dayRevenue > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                                            {dayRevenue > 0 ? 'Surge Detected' : 'Baseline'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-gray-50 animate-in zoom-in-95 duration-500">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Order Fulfillment Terminal</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Global Transaction Monitoring</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-gray-400 font-black text-[10px] uppercase tracking-[4px]">
                                        <th className="px-8 pb-4">Transactional ID</th>
                                        <th className="px-8 pb-4">Customer</th>
                                        <th className="px-8 pb-4">Settlement</th>
                                        <th className="px-8 pb-4">Status</th>
                                        <th className="px-8 pb-4 text-right">Fulfillment</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {orders.map((o) => (
                                        <tr key={o._id} className="bg-white hover:bg-gray-50/50 transition-all border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                            <td className="px-8 py-6 rounded-l-2xl">
                                                <p className="font-black text-fb-blue uppercase tracking-tighter">#{o._id.slice(-8).toUpperCase()}</p>
                                                <p className="text-[9px] text-gray-400 font-bold mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-gray-900 uppercase tracking-tight">{o.user?.name || 'Guest User'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1">{o.user?.email || 'N/A'}</p>
                                                <p className="text-[10px] text-fb-blue font-black mt-0.5 italic">{o.user?.mobile ? `+91 ${o.user.mobile}` : 'No Mobile'}</p>
                                            </td>
                                            <td className="px-8 py-6 font-black text-gray-900">₹{o.totalPrice.toLocaleString()}</td>
                                            <td className="px-8 py-6 uppercase">
                                                <span className={`px-4 py-2 rounded-full text-[9px] font-black tracking-widest border ${o.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right rounded-r-2xl">
                                                <div className="flex justify-end gap-3">
                                                    {o.status !== 'Delivered' && (
                                                        <button 
                                                            onClick={async () => {
                                                                setLoading(true);
                                                                try {
                                                                    const nextStatus = o.status === 'Processing' ? 'Shipped' : 'Delivered';
                                                                    await api.put(`/orders/${o._id}/status`, { status: nextStatus });
                                                                    await fetchOrders();
                                                                } catch (err) {
                                                                    alert('Status update failed');
                                                                }
                                                                setLoading(false);
                                                            }}
                                                            className="text-[9px] font-black uppercase tracking-widest text-blue-600 border-2 border-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-all"
                                                        >
                                                            Move to {o.status === 'Processing' ? 'Ship' : 'Deliver'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
