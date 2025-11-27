import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStats, getOrders, STORES } from '../services/mockData';
import { useApp } from '../context/AppContext';
import { Package, DollarSign, Users, TrendingUp, ArrowRight, LayoutGrid } from 'lucide-react';
import { AdminLayout } from '../layouts/AdminLayout';

export const AdminDashboard: React.FC = () => {
  const { adminStoreId, setAdminStoreId, setCurrentStoreId } = useApp();
  
  // If no store is selected, show the selection screen
  if (!adminStoreId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Control Center</h1>
          <p className="text-gray-500 text-lg">Select a store to manage its products, categories, and settings.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {STORES.map((store, index) => (
            <div 
              key={store.id}
              onClick={() => {
                setAdminStoreId(store.id);
                setCurrentStoreId(store.id);
              }}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-${store.themeColor}-500`} />
              <div className="mb-6 relative">
                 <div className={`w-16 h-16 rounded-2xl bg-${store.themeColor}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <LayoutGrid className={`text-${store.themeColor}-600`} size={32} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">{store.name}</h2>
                 <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{store.type} Store</p>
              </div>
              
              <div className="space-y-3 mb-8">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Orders Pending</span>
                   <span className="font-bold text-gray-900">
                      {getOrders(store.id).filter(o => o.status === 'Pending').length}
                   </span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Revenue Today</span>
                   <span className="font-bold text-gray-900">$1,240</span>
                 </div>
              </div>

              <div className={`flex items-center gap-2 text-${store.themeColor}-600 font-bold group-hover:gap-4 transition-all`}>
                Manage Store <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Store Specific Dashboard
  const store = STORES.find(s => s.id === adminStoreId)!;
  const stats = getStats(adminStoreId);
  const orders = getOrders(adminStoreId);

  // Chart data
  const data = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 550 },
    { name: 'Thu', sales: 450 },
    { name: 'Fri', sales: 600 },
    { name: 'Sat', sales: 800 },
    { name: 'Sun', sales: 700 },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-50 p-6 rounded-xl relative overflow-hidden border border-gray-100">
             <div className={`absolute top-0 right-0 p-3 opacity-10 text-${store.themeColor}-600`}>
                <DollarSign size={80} />
             </div>
             <p className="text-sm text-gray-500 font-medium mb-1">Total Revenue</p>
             <h3 className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl relative overflow-hidden border border-gray-100">
             <div className="absolute top-0 right-0 p-3 opacity-10 text-blue-600">
                <Package size={80} />
             </div>
             <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
             <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl relative overflow-hidden border border-gray-100">
             <div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-600">
                <Users size={80} />
             </div>
             <p className="text-sm text-gray-500 font-medium mb-1">Total Customers</p>
             <h3 className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalOrders * 0.8)}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl relative overflow-hidden border border-gray-100">
             <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-600">
                <TrendingUp size={80} />
             </div>
             <p className="text-sm text-gray-500 font-medium mb-1">Conversion Rate</p>
             <h3 className="text-3xl font-bold text-gray-900">3.2%</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly Sales Performance</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} prefix="$" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f9fafb'}}
                  />
                  <Bar dataKey="sales" fill={store.themeColor === 'quilling' ? '#f43f5e' : store.themeColor === 'gifts' ? '#8b5cf6' : '#f59e0b'} radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders for this store */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {orders.length > 0 ? orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">${order.total}</p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                 <div className="text-center py-10 text-gray-400">No orders yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};