import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentStore, categories } = useApp();
  
  if (!currentStore) return null;

  const storeCategories = categories.filter(c => c.storeId === currentStore.id);

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-2xl font-bold text-${currentStore.themeColor}-900 mb-2`}>{currentStore.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{currentStore.tagline}</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-${currentStore.themeColor}-50 hover:text-${currentStore.themeColor}-600 transition-all`}>
                <Instagram size={18} />
              </a>
              <a href="#" className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-${currentStore.themeColor}-50 hover:text-${currentStore.themeColor}-600 transition-all`}>
                <Facebook size={18} />
              </a>
              <a href="#" className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-${currentStore.themeColor}-50 hover:text-${currentStore.themeColor}-600 transition-all`}>
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Shop Collections</h4>
            <ul className="space-y-3">
              {storeCategories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link to={`/store/${currentStore.id}`} className="text-gray-500 hover:text-black transition-colors text-sm">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={`/store/${currentStore.id}`} className={`text-${currentStore.themeColor}-600 font-medium text-sm`}>
                  View All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/track-order" className="hover:text-black transition-colors">Order Tracking</Link></li>
              <li><a href="#" className="hover:text-black transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin size={18} className={`flex-shrink-0 text-${currentStore.themeColor}-500`} />
                <span>{currentStore.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className={`flex-shrink-0 text-${currentStore.themeColor}-500`} />
                <a href={`mailto:${currentStore.email}`} className="hover:text-black">{currentStore.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className={`flex-shrink-0 text-${currentStore.themeColor}-500`} />
                <a href={`tel:${currentStore.phone}`} className="hover:text-black">{currentStore.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; 2024 Teliz. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>Powered by Teliz Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};