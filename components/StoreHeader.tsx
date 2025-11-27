
import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Menu, User, LayoutDashboard, ShoppingCart, LogOut, ArrowLeft } from 'lucide-react';
import { STORES } from '../services/mockData';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const StoreHeader: React.FC = () => {
  const { cart, currentStore, setCurrentStoreId, isAdmin, logout, adminStoreId, setAdminStoreId, customerUser, customerLogout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isOnAdminPage = location.pathname.startsWith('/admin');

  const handleStoreSwitch = (storeId: string) => {
    setCurrentStoreId(storeId);
    navigate(`/store/${storeId}`);
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleCustomerLogout = () => {
    customerLogout();
    navigate('/');
  };

  const exitAdminStore = () => {
    setAdminStoreId(null);
    navigate('/admin');
  };

  // Determine header style based on state
  const headerBg = isOnAdminPage ? 'bg-gray-900 text-white border-b border-gray-800' : 'bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-900';
  const logoColor = isOnAdminPage ? 'text-white' : `text-${currentStore?.themeColor}-500`;

  // Helper to get hex color for shadows (Tailwind class names can't easily be used in inline styles for box-shadow colors)
  const getThemeHex = (colorName: string) => {
    switch(colorName) {
      case 'quilling': return '#f43f5e'; // Rose-500
      case 'gifts': return '#8b5cf6';    // Violet-500
      case 'art': return '#f59e0b';      // Amber-500
      default: return '#000000';
    }
  };

  return (
    <div className="sticky top-0 z-50 font-sans shadow-sm">
      
      {/* 3D Top Navigation Bar (Hidden on Admin) - LIGHT THEME */}
      {!isOnAdminPage && (
        <div className="bg-gray-50 pt-4 pb-0 overflow-hidden relative border-b border-gray-200">
          {/* Perspective Container */}
          <div 
            className="max-w-[1920px] mx-auto px-6 flex justify-center items-end gap-4 md:gap-8"
            style={{ perspective: '1000px' }}
          >
            {STORES.map(store => {
              const isActive = currentStore?.id === store.id;
              const themeHex = getThemeHex(store.themeColor);
              
              return (
                <button
                  key={store.id}
                  onClick={() => handleStoreSwitch(store.id)}
                  className={`
                    relative group px-8 md:px-14 py-3 text-sm md:text-base font-bold uppercase tracking-widest outline-none
                    ${isActive 
                      ? `bg-${store.themeColor}-500 text-white z-20` 
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-800 z-10'
                    }
                    rounded-t-xl transition-colors duration-300
                  `}
                  style={{ 
                    transformOrigin: 'bottom center',
                    // Fluid Spring Physics Animation
                    transform: isActive 
                      ? 'translateY(0px) translateZ(0px) rotateX(0deg) scale(1)' 
                      : 'translateY(8px) translateZ(-40px) rotateX(20deg) scale(0.92)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease',
                    boxShadow: isActive 
                      ? `0 -8px 25px -5px ${themeHex}66, 0 0 15px ${themeHex}33` // Soft colored glow for light mode
                      : '0 4px 12px rgba(0,0,0,0.1)' // Subtle depth shadow
                  }}
                >
                  {/* Inner shine effect */}
                  <div className={`absolute inset-0 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                    {store.name}
                  </span>
                  
                  {/* Bottom connector to hide pixel gaps */}
                  {isActive && (
                    <div className={`absolute -bottom-1 left-0 right-0 h-2 bg-${store.themeColor}-500`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className={`transition-colors duration-300 ${headerBg}`}>
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center gap-2 group">
                {isOnAdminPage && adminStoreId ? (
                   <button onClick={exitAdminStore} className="mr-2 p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                      <ArrowLeft size={20} />
                   </button>
                ) : null}
                
                <div className="flex flex-col">
                  <span className={`text-2xl md:text-3xl font-serif font-bold tracking-tight ${logoColor}`}>
                    {isOnAdminPage && !adminStoreId ? 'Admin Panel' : currentStore?.name}
                  </span>
                  {!isOnAdminPage && (
                     <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">
                       {currentStore?.tagline.split(' ')[0]} Store
                     </span>
                  )}
                </div>
              </Link>
              
              {/* Admin Nav Link (Only if logged in) */}
              {isAdmin && !isOnAdminPage && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  <LayoutDashboard size={14} /> Admin
                </Link>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6 md:space-x-8">
              {!isOnAdminPage && (
                <div className="relative cursor-pointer group">
                  <div className="relative p-2">
                      <ShoppingCart className={`w-6 h-6 hover:text-${currentStore?.themeColor}-500 transition-colors`} />
                      {cartCount > 0 && (
                      <span className={`absolute top-0 right-0 bg-${currentStore?.themeColor}-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white`}>
                          {cartCount}
                      </span>
                      )}
                  </div>
                  
                  {/* Mini Cart Preview */}
                  <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                     <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                       <span className="font-heading font-semibold text-gray-900">Your Cart</span>
                       <span className="text-xs text-gray-400 font-medium">{cartCount} Items</span>
                     </div>
                     
                     {cart.length > 0 ? (
                       <>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {cart.map(item => (
                            <div key={item.id} className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-50 rounded-lg bg-cover bg-center flex-shrink-0" style={{backgroundImage: `url(${item.image})`}}></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm font-bold">${item.price}</span>
                                  <span className="text-xs text-gray-400">x{item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between font-bold text-gray-900">
                              <span>Total</span>
                              <span>${cart.reduce((t, i) => t + (i.price * i.quantity), 0)}</span>
                          </div>
                          <Link to="/checkout" className={`w-full py-3 rounded-xl bg-${currentStore?.themeColor}-900 text-white font-medium text-sm hover:opacity-90 transition-opacity block text-center`}>
                              Checkout
                          </Link>
                        </div>
                       </>
                     ) : (
                       <div className="text-center py-8">
                         <ShoppingBag className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                         <p className="text-gray-400 text-sm">Cart is empty</p>
                       </div>
                     )}
                  </div>
                </div>
              )}
              
              {isAdmin ? (
                <div className="flex items-center gap-4">
                   <span className="text-xs text-gray-500 hidden md:block">
                      {isOnAdminPage ? 'Administrator' : ''}
                   </span>
                   <button 
                      onClick={handleAdminLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 text-xs font-bold uppercase transition-all"
                    >
                      <LogOut size={14} /> <span className="hidden md:inline">Sign Out</span>
                    </button>
                </div>
              ) : (
                <>
                  {customerUser ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900 hidden md:block">Hi, {customerUser.name.split(' ')[0]}</span>
                        <button onClick={handleCustomerLogout} className="text-xs font-medium text-gray-500 hover:text-black">Sign Out</button>
                    </div>
                  ) : (
                    <Link to="/auth" className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors group relative">
                        <User className="w-6 h-6 text-gray-900" />
                        <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Sign In
                        </span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
