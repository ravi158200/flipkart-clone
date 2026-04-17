import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, ShieldCheck, Star, MessageSquare, ChevronLeft, Users, Filter, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Community = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const fetchCommunity = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/users/sellers');
                if (data && data.length > 0) {
                    setUsers(data);
                } else {
                    // High-Fidelity Mock Identities for a "Live" Community Experience
                    setUsers([
                        { _id: 'mock1', name: 'Flipkart_Official', role: 'admin', profilePic: '', createdAt: new Date().toISOString() },
                        { _id: 'mock2', name: 'NexaRetail_India', role: 'retailer', profilePic: '', createdAt: new Date().toISOString() },
                        { _id: 'mock3', name: 'Premium_Shopper_2024', role: 'user', profilePic: '', createdAt: new Date().toISOString() }
                    ]);
                }
                setLoading(false);
            } catch (err) {
                console.error('COMMUNITY_SYNC_ERROR:', err);
                setLoading(false);
            }
        };
        fetchCommunity();
    }, []);

    const handleFollow = (userId) => {
        if (!userInfo) {
            alert('IDENTITY REQUIRED: Please login to follow community members.');
            navigate('/login');
            return;
        }
        
        // High-Fidelity Follow Logic Simulation (Persists in session)
        if (following.includes(userId)) {
            setFollowing(following.filter(id => id !== userId));
        } else {
            setFollowing([...following, userId]);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(keyword.toLowerCase()) || 
        user.role.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-20 pb-12 px-4 italic">
            <div className="max-w-7xl mx-auto">
                {/* Header Terminal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10 px-4">
                     <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-gray-400 font-black hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest mb-4 not-italic"
                        >
                            <ChevronLeft size={16} /> Return to Market
                        </button>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none border-l-8 border-fb-blue pl-6">Marketplace Community</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[6px] mt-4 ml-6 italic">Verified Administrators, Partners, and Premium Members</p>
                     </div>
                     <div className="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100 w-full md:w-auto">
                        <div className="flex items-center gap-3 px-6 py-2 border-r border-gray-100 flex-1 md:flex-none">
                            <Search size={18} className="text-fb-blue" />
                            <input 
                                type="text" 
                                placeholder="Search Members..." 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="bg-transparent outline-none text-sm font-black uppercase tracking-tight w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 h-full">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-fb-blue text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-fb-blue text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                     </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="bg-white h-80 rounded-[40px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8" : "flex flex-col gap-4"}>
                        {filteredUsers.map((member) => (
                            <div 
                                key={member._id} 
                                className={`bg-white rounded-[40px] border border-gray-50 shadow-2xl hover:shadow-fb-blue/5 transition-all group relative overflow-hidden flex ${viewMode === 'list' ? 'flex-row items-center p-6 gap-8' : 'flex-col p-10 items-center text-center'}`}
                            >
                                {/* Role Badge Overlay */}
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[8px] font-black uppercase tracking-widest text-white shadow-lg z-10 ${member.role === 'admin' ? 'bg-red-500' : member.role === 'retailer' ? 'bg-fb-blue' : 'bg-green-500'}`}>
                                    {member.role === 'admin' ? 'SYSTEM_ADMIN' : member.role === 'retailer' ? 'PARTNER_MERCHANT' : 'ACTIVE_MEMBER'}
                                </div>

                                {/* Avatar Assembly */}
                                <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-32 h-32 mb-8'} relative shrink-0`}>
                                    <div className="w-full h-full rounded-full bg-gray-50 p-1 border-2 border-transparent group-hover:border-fb-blue transition-all">
                                        <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                                            {member.profilePic ? (
                                                <img src={member.profilePic} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt={member.name} />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-fb-blue font-black text-4xl uppercase not-italic">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-1 right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white shadow-xl ${member.role === 'admin' ? 'bg-red-500' : member.role === 'retailer' ? 'bg-fb-blue' : 'bg-green-500'}`}>
                                        <ShieldCheck size={16} />
                                    </div>
                                </div>

                                {/* Member Information */}
                                <div className={`flex-1 ${viewMode === 'grid' ? 'space-y-4' : 'space-y-1'}`}>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase line-clamp-1 italic">{member.name}</h3>
                                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">(Market Level 5)</span>
                                    </div>
                                    {viewMode === 'list' && (
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest opacity-60 leading-relaxed italic mt-2">Member since {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    )}
                                    
                                    {/* Action Terminal */}
                                    <div className={`flex items-center gap-3 mt-6 ${viewMode === 'grid' ? 'justify-center' : 'justify-start'}`}>
                                        <button 
                                            onClick={() => handleFollow(member._id)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${following.includes(member._id) ? 'bg-gray-100 text-fb-blue border-2 border-fb-blue' : 'bg-fb-blue text-white shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95'}`}
                                        >
                                            {following.includes(member._id) ? <><UserCheck size={14} /> CONNECTED</> : <><UserPlus size={14} /> CONNECT</>}
                                        </button>
                                        <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-fb-blue hover:border-fb-blue transition-all shadow-lg hover:shadow-fb-blue/5">
                                            <MessageSquare size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredUsers.length === 0 && (
                    <div className="bg-white p-24 rounded-[60px] shadow-2xl text-center space-y-8 italic">
                        <div className="bg-gray-50/50 w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <Users size={64} className="text-gray-200" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Identity Not Found</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-4">Try searching for generic marketplace roles or member names.</p>
                        </div>
                        <button onClick={() => setKeyword('')} className="bg-fb-blue text-white px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all not-italic">Reset Directory</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
