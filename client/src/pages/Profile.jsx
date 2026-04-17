import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Edit, Calendar, Package, MapPin, Camera, X, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
    const { userInfo, login, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        if (!authLoading && !userInfo) {
            navigate('/login');
        }
    }, [userInfo, authLoading]);

    const [editForm, setEditForm] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        bio: userInfo?.bio || '',
        profilePic: userInfo?.profilePic || '',
        mobile: userInfo?.mobile || '',
        address: userInfo?.address || '',
        houseNo: userInfo?.houseNo || '',
        street: userInfo?.street || '',
        landmark: userInfo?.landmark || '',
        city: userInfo?.city || '',
        state: userInfo?.state || '',
        pincode: userInfo?.pincode || ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userInfo) {
            setEditForm({
                name: userInfo.name || '',
                email: userInfo.email || '',
                bio: userInfo.bio || '',
                profilePic: userInfo.profilePic || '',
                mobile: userInfo.mobile || '',
                address: userInfo.address || '',
                houseNo: userInfo.houseNo || '',
                street: userInfo.street || '',
                landmark: userInfo.landmark || '',
                city: userInfo.city || '',
                state: userInfo.state || '',
                pincode: userInfo.pincode || ''
            });
        }
    }, [userInfo]);

    if (!userInfo) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Asset too large. Please upload an image under 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm({ ...editForm, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.put('/users/profile', editForm);
            login(data);
            setIsEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile. Please check your connection.');
            setTimeout(() => setError(''), 5000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-20 pb-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="h-32 bg-fb-blue relative">
                        <div className="absolute -bottom-12 left-10 p-1 bg-white rounded-full shadow-lg group">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-fb-blue font-black text-4xl border-4 border-white overflow-hidden relative">
                                {userInfo.profilePic ? (
                                    <img src={userInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userInfo.name.charAt(0).toUpperCase()
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-8 px-10 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{userInfo.name}</h1>
                                {success && <CheckCircle2 className="text-green-500 animate-bounce" size={24} />}
                            </div>
                            <p className="text-gray-500 font-bold flex items-center gap-2 mt-1 italic">
                                <Shield size={16} className="text-fb-blue" /> {userInfo.role.toUpperCase()} ACCOUNT
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-fb-blue text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(40,116,240,0.3)] p-12 overflow-y-auto max-h-[90vh] relative border-4 border-white">
                            <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 bg-gray-50 p-2.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                <X size={24} />
                            </button>
                            <h3 className="text-3xl font-black text-fb-blue uppercase tracking-tighter italic mb-10 border-b-4 border-fb-blue/5 pb-6">Update Identity</h3>
                            
                            {error && (
                                <div className="mb-8 p-5 bg-red-50 border-l-[6px] border-red-500 text-red-700 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 duration-300 rounded-r-xl">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-10">
                                <div className="flex flex-col items-center mb-6">
                                     <div className="w-28 h-28 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 flex items-center justify-center text-fb-blue font-black text-4xl relative group shadow-2xl transition-transform hover:scale-105">
                                        {editForm.profilePic ? <img src={editForm.profilePic} className="w-full h-full object-cover" /> : editForm.name.charAt(0)}
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-[2px]">
                                            <Camera size={24} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                     </div>
                                     <p className="text-[10px] text-[#2874f0] font-black mt-4 uppercase tracking-[3px] italic bg-blue-50 px-4 py-1.5 rounded-full">Evolutionary Avatar</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Legal Full Name</label>
                                        <input required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Contact Email</label>
                                        <input required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Secure Mobile Number</label>
                                        <input required value={editForm.mobile} onChange={e => setEditForm({...editForm, mobile: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white" placeholder="+91" />
                                    </div>

                                    <div className="md:col-span-2 mt-4">
                                        <p className="text-xs font-black text-fb-blue uppercase tracking-[4px] mb-8 border-l-4 border-fb-blue pl-4 bg-blue-50/50 py-2">Delivery Coordinates</p>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                                            <div className="col-span-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Primary Summary Address</label>
                                                <textarea rows="2" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all resize-none shadow-inner focus:bg-white" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">House No. / Flat</label>
                                                <input value={editForm.houseNo} onChange={e => setEditForm({...editForm, houseNo: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Landmark</label>
                                                <input value={editForm.landmark} onChange={e => setEditForm({...editForm, landmark: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Street / Block Area</label>
                                                <input value={editForm.street} onChange={e => setEditForm({...editForm, street: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white" />
                                            </div>
                                            <div className="grid grid-cols-3 col-span-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">City</label>
                                                    <input value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white text-center" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">State</label>
                                                    <input value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white text-center" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Pincode</label>
                                                    <input value={editForm.pincode} onChange={e => setEditForm({...editForm, pincode: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all shadow-inner focus:bg-white text-center" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 pt-6">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block ml-1">Public Bio Terminal</label>
                                        <textarea rows="3" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-fb-blue outline-none font-bold placeholder:text-gray-300 transition-all resize-none shadow-inner focus:bg-white italic" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#fb641b] text-white py-6 rounded-3xl font-black shadow-[0_20px_50px_-10px_rgba(251,100,27,0.4)] tracking-[4px] uppercase hover:scale-[1.02] active:scale-95 transition-all text-xs border-b-4 border-orange-700">
                                    {loading ? 'Propagating Synchronization...' : 'Confirm Identity Synthesis'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b pb-2">Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-fb-blue"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                        <p className="text-sm font-bold text-gray-800 break-all">{userInfo.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-fb-blue"><MapPin size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</p>
                                        <p className="text-sm font-bold text-gray-800">{userInfo.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-fb-blue"><Package size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Mobile Number</p>
                                        <p className="text-sm font-bold text-gray-800">{userInfo.mobile}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-fb-blue"><Edit size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Biography</p>
                                        <p className="text-sm font-bold text-gray-800 leading-relaxed">{userInfo.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    <Package size={22} className="text-fb-blue" /> My Order History
                                </h3>
                                <span className="text-fb-blue font-black text-xs uppercase tracking-widest cursor-pointer hover:underline">Full View</span>
                            </div>
                            
                            <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                                <Package size={48} className="text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold text-sm tracking-tight italic">You haven't placed any orders yet.</p>
                                <button className="mt-4 bg-[#fb641b]/10 text-[#fb641b] px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#fb641b] hover:text-white transition-all">Start Exploring</button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    <MapPin size={22} className="text-fb-blue" /> Manage Addresses
                                </h3>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="text-fb-blue font-black text-[10px] uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full hover:bg-fb-blue hover:text-white transition-all"
                                >
                                    + Add New
                                </button>
                            </div>
                            
                            {userInfo.address ? (
                                <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl group hover:border-fb-blue transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest">Home</span>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{userInfo.name}</p>
                                        <p className="text-sm font-black text-gray-900 ml-auto">{userInfo.mobile}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-600 leading-relaxed max-w-md italic">
                                        {userInfo.address}
                                    </p>
                                    <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
                                         <button onClick={() => setIsEditing(true)} className="text-[10px] font-black text-fb-blue uppercase tracking-widest hover:underline">Edit Address</button>
                                         <button className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Remove</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                                    <MapPin size={48} className="text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-bold text-sm tracking-tight italic">No addresses saved yet.</p>
                                    <button onClick={() => setIsEditing(true)} className="mt-4 bg-fb-blue text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-all">Add Manually</button>
                                </div>
                            )}
                        </div>

                        <div className="bg-fb-blue p-8 rounded-3xl shadow-2xl shadow-blue-100 relative overflow-hidden group">
                           <div className="relative z-10">
                                <h3 className="text-white text-2xl font-black italic tracking-tighter mb-2">Flipkart Plus Member</h3>
                                <p className="text-blue-100 font-bold text-sm leading-relaxed max-w-[320px]">You have an active Plus membership. Enjoy zero-cost delivery and exclusive deals across the platform.</p>
                           </div>
                           <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png" alt="Plus" className="absolute -right-6 -bottom-6 w-44 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
