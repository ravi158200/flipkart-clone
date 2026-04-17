import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Fashion', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050212.png' },
  { id: 2, name: 'Electronics', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png' },
  { id: 3, name: 'Mobiles', icon: 'https://cdn-icons-png.flaticon.com/512/3137/3137807.png' },
  { id: 4, name: 'Home', icon: 'https://cdn-icons-png.flaticon.com/512/2665/2665181.png' },
  { id: 5, name: 'Beauty', icon: 'https://cdn-icons-png.flaticon.com/512/3163/3163201.png' },
  { id: 6, name: 'Toys', icon: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png' }, 
  { id: 7, name: 'Appliances', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659929.png' },
  { id: 8, name: 'Travel', icon: 'https://cdn-icons-png.flaticon.com/512/201/201623.png' },
  { id: 9, name: 'Bikes', icon: 'https://cdn-icons-png.flaticon.com/512/5111/5111162.png' },
  { id: 10, name: 'Grocery', icon: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png' }
];

const CategoryBar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-sm border-b overflow-x-auto overflow-y-hidden">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-4 py-3 gap-6 no-scrollbar">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
            className="flex flex-col items-center gap-2 group cursor-pointer transition-all hover:scale-110 min-w-[90px] py-2 shrink-0"
          >
            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors shadow-sm transform group-hover:-translate-y-1 duration-300">
                <img src={cat.icon} alt={cat.name} className="h-full w-full object-contain" />
            </div>
            <span className="text-[11px] font-bold text-gray-800 group-hover:text-[#2874f0] transition-colors uppercase tracking-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
