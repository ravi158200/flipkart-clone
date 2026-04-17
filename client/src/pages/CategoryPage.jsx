import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import CategoryBar from '../components/CategoryBar';

const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/products', {
                    params: { category }
                });
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching category products:', err);
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [category]);

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-10">
            <CategoryBar />
            
            <div className="max-w-[1500px] mx-auto px-4 mt-4">
                <div className="bg-white p-4 shadow-sm rounded-sm mb-4">
                    <h1 className="text-xl font-bold capitalize">Best of {category}</h1>
                    <p className="text-gray-500 text-sm">{products.length} Items Found</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {products.map((item) => (
                            <Link 
                                to={`/product/${item._id || item.id}`} 
                                key={item._id || item.id}
                                className="bg-white p-4 flex flex-col items-center hover:shadow-xl transition-all cursor-pointer group rounded-sm border border-transparent hover:border-gray-200"
                            >
                                <div className="h-48 w-full flex items-center justify-center p-2 mb-4 overflow-hidden">
                                    <img 
                                        src={item.image || (item.images && item.images[0])} 
                                        alt={item.title} 
                                        className="h-full object-contain transform group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                <div className="w-full">
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1 group-hover:text-[#2874f0]">{item.title}</h3>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                                            {item.rating || '4.2'} ★
                                        </span>
                                        <span className="text-xs text-gray-400">({(Math.random() * 5000).toFixed(0)})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                                        <span className="text-xs text-green-600 font-bold">20% off</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="bg-white p-16 flex flex-col items-center justify-center shadow-sm rounded-sm">
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No results" className="w-64 mb-4" />
                        <h2 className="text-lg font-medium text-gray-800">No products found in this category.</h2>
                        <p className="text-gray-500 mb-6">Try exploring other categories or come back later!</p>
                        <Link to="/" className="bg-[#2874f0] text-white px-8 py-2 rounded-sm font-bold shadow-md hover:bg-blue-600 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
