
import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Package, FolderTree, Settings, Users, LogOut, Store } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { adminStoreId, stores, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const activeStore = stores.find(s => s.id === adminStoreId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!activeStore) return <>{children}</>;

  const tabs = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800 flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">TELIZ</h1>
          <span className="text-xs text-gray-400 uppercase tracking-widest">Admin Panel</span>
        </div>

        <div className="p-4 border-b border-gray-800">
             <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                <div className={`w-10 h-10 rounded-lg bg-${activeStore.themeColor}-500 flex items-center justify-center text-white`}>
                    <Store size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{activeStore.name}</p>
                    <p className="text-xs text-gray-400 truncate">Store Admin</p>
                </div>
             </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? `bg-${activeStore.themeColor}-600 text-white shadow-lg` 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-10">
           <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
           <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Administrator</span>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">A</div>
           </div>
        </header>

        <main className="flex-1 p-6 md:p-10 animate-fade-in">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};
