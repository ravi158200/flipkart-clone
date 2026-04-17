import React from 'react';
import { HelpCircle, ShieldCheck, MailQuestion, Facebook, Twitter, Youtube, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { userInfo } = useAuth();
  return (
    <footer className="w-full bg-[#172337] text-white pt-12 pb-8 mt-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-10 px-8 border-b border-gray-700 pb-12">
        {/* ABOUT Section */}
        <div className="flex-1 min-w-[150px]">
          <h5 className="text-gray-400 text-[13px] font-bold mb-4 uppercase tracking-wider">ABOUT</h5>
          <ul className="text-[13px] space-y-2 font-medium text-gray-200">
            <li><Link to="/customer-care" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/seller-onboarding" className="hover:underline">About Us</Link></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Flipkart Stories</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
            <li><a href="#" className="hover:underline">Corporate Information</a></li>
          </ul>
        </div>

        {/* HELP Section */}
        <div className="flex-1 min-w-[150px]">
          <h5 className="text-gray-400 text-[13px] font-bold mb-4 uppercase tracking-wider">HELP</h5>
          <ul className="text-[13px] space-y-2 font-medium text-gray-200">
            <li><Link to="/orders" className="hover:underline">Payments</Link></li>
            <li><Link to="/orders" className="hover:underline">Shipping</Link></li>
            <li><Link to="/orders" className="hover:underline">Cancellation & Returns</Link></li>
            <li><Link to="/customer-care" className="hover:underline">FAQ</Link></li>
            <li><Link to="/customer-care" className="hover:underline">Report Infringement</Link></li>
          </ul>
        </div>

        {/* CONSUMER POLICY Section */}
        <div className="flex-1 min-w-[150px]">
          <h5 className="text-gray-400 text-[13px] font-bold mb-4 uppercase tracking-wider">CONSUMER POLICY</h5>
          <ul className="text-[13px] space-y-2 font-medium text-gray-200">
            <li><Link to="/customer-care" className="hover:underline">Return Policy</Link></li>
            <li><Link to="/profile" className="hover:underline">Terms of Use</Link></li>
            <li><Link to="/profile" className="hover:underline">Security</Link></li>
            <li><Link to="/profile" className="hover:underline">Privacy</Link></li>
            <li><Link to="/" className="hover:underline">Sitemap</Link></li>
            <li><Link to="/customer-care" className="hover:underline">Grievance Redressal</Link></li>
            <li><a href="#" className="hover:underline">EPR Compliance</a></li>
          </ul>
        </div>

        {/* SOCIAL Section */}
        <div className="flex-1 min-w-[150px]">
          <h5 className="text-gray-400 text-[13px] font-bold mb-4 uppercase tracking-wider">SOCIAL</h5>
          <ul className="text-[13px] space-y-2 font-medium text-gray-200">
            <li><a href="https://facebook.com" className="flex items-center gap-2 hover:underline"><Facebook size={14} /> Facebook</a></li>
            <li><a href="https://twitter.com" className="flex items-center gap-2 hover:underline"><Twitter size={14} /> Twitter</a></li>
            <li><a href="https://youtube.com" className="flex items-center gap-2 hover:underline"><Youtube size={14} /> YouTube</a></li>
          </ul>
        </div>

        {/* MAIL US Section */}
        <div className="flex-1 min-w-[200px] border-l border-gray-700 pl-8">
          <h5 className="text-gray-400 text-[13px] font-bold mb-4 uppercase tracking-wider">Mail Us:</h5>
          <p className="text-[13px] leading-relaxed text-gray-200 font-normal">
            Flipkart Internet Private Limited, <br/>
            Buildings Alyssa, Begonia & <br/>
            Clove Embassy Tech Village, <br/>
            Outer Ring Road, Devarabeesanahalli Village, <br/>
            Bengaluru, 560103, <br/>
            Karnataka, India
          </p>
        </div>

        {/* REGISTERED OFFICE Section */}
        <div className="flex-1 min-w-[200px] border-l border-gray-700 pl-8">
          <h5 className="text-gray-400 text-[13px] font-bold mb-4 uppercase tracking-wider">Registered Office Address:</h5>
          <p className="text-[13px] leading-relaxed text-gray-200 font-normal">
            Flipkart Internet Private Limited, <br/>
            Buildings Alyssa, Begonia & <br/>
            Clove Embassy Tech Village, <br/>
            Outer Ring Road, Devarabeesanahalli Village, <br/>
            Bengaluru, 560103, <br/>
            Karnataka, India <br/>
            CIN : U51109KA2012PTC066107 <br/>
            Telephone: <span className="text-blue-400">044-45614700 / 044-67415800</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-8 pt-8 pb-4">
        <div className="flex flex-wrap gap-10 text-[13px] font-medium text-white">
          <Link to={userInfo?.role === 'retailer' ? "/retailer-dashboard" : "/seller-onboarding"} className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
            <HelpCircle size={16} className="text-[#ffe500]" /> {userInfo?.role === 'retailer' ? "Seller Dashboard" : "Become a Seller"}
          </Link>
          <Link to="/advertise" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
            <MailQuestion size={16} className="text-[#ffe500]" /> Advertise
          </Link>
          <Link to="/gift-cards" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
            <HelpCircle size={16} className="text-[#ffe500]" /> Gift Cards
          </Link>
          <Link to="/customer-care" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
            <HelpCircle size={16} className="text-[#ffe500]" /> Help Center
          </Link>
        </div>
        
        <div className="mt-6 lg:mt-0 flex flex-wrap items-center gap-8">
          <p className="text-[13px] font-medium text-gray-400">© 2007-2026 Flipkart.com</p>
          <div className="flex items-center gap-4 border-l border-gray-700 pl-8">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">Payments:</span>
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-69e7ec.svg" alt="Payments" className="h-5 object-contain opacity-80" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
