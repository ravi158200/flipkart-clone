import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();
    const defaultBanners = [
        {
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
            title: "MEGA ELECTRONICS SALE",
            subtitle: "Unleash the next generation of performance and style.",
            buttonText: "Shop Gear",
            gradient: "from-blue-600/80",
            fallbackColor: "bg-blue-500",
            path: "/category/electronics"
        },
        {
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
            title: "FASHION EXTRAVAGANZA",
            subtitle: "Up to 80% Off on Global Luxe Brands.",
            buttonText: "Update Wardrobe",
            gradient: "from-orange-500/80",
            fallbackColor: "bg-orange-400",
            path: "/category/fashion"
        },
        {
            image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1600&q=80",
            title: "MOBILE BONANZA",
            subtitle: "Flagship phones with powerful cameras and displays.",
            buttonText: "Explore Now",
            gradient: "from-purple-600/80",
            fallbackColor: "bg-purple-500",
            path: "/category/mobiles"
        },
        {
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
            title: "HOME & LIFESTYLE",
            subtitle: "Transform your living space with modern aesthetics.",
            buttonText: "Decor Now",
            gradient: "from-emerald-600/80",
            fallbackColor: "bg-emerald-500",
            path: "/category/home"
        }
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === defaultBanners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [defaultBanners.length]);

    const next = () => setCurrent((prev) => (prev === defaultBanners.length - 1 ? 0 : prev + 1));
    const prev = () => setCurrent((prev) => (prev === 0 ? defaultBanners.length - 1 : prev - 1));

    return (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden group rounded-xl shadow-2xl">
            {/* Banner Slides */}
            <div 
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {defaultBanners.map((banner, index) => (
                    <div key={index} className={`w-full h-full flex-shrink-0 relative overflow-hidden ${banner.fallbackColor}`}>
                        <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {/* Overlay Content */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} to-transparent flex flex-col justify-center px-8 md:px-16 text-white space-y-4`}>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-2xl transform translate-y-0 opacity-100 transition-all duration-700 delay-200">
                                {banner.title}
                            </h2>
                            <p className="text-lg md:text-2xl font-medium text-gray-100 drop-shadow-xl max-w-lg">
                                {banner.subtitle}
                            </p>
                            <button 
                                onClick={() => navigate(banner.path)}
                                className="bg-white text-[#2874f0] hover:bg-blue-50 font-bold py-3 px-8 rounded-full w-max shadow-2xl transform transition hover:scale-110 active:scale-95 uppercase tracking-wider text-sm md:text-base border-2 border-transparent hover:border-white animate-pulse-subtle"
                            >
                                {banner.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 z-10"
            >
                <ChevronLeft size={32} />
            </button>
            <button 
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 z-10"
            >
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {defaultBanners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-300 rounded-full ${
                            current === index ? 'w-10 bg-[#2874f0]' : 'w-3 bg-white/60 hover:bg-white'
                        } h-3`}
                    />
                ))}
            </div>

            {/* Decorative Glassmorphism Element */}
            <div className="absolute top-4 right-8 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2 rounded-full hidden md:block">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Special Offer • Limited Time</span>
            </div>
        </div>
    );
};

export default Banner;
