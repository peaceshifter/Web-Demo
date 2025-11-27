import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { getOrderById } from '../services/mockData';
import { Order } from '../types';

export const OrderTracking: React.FC = () => {
  const { currentStore } = useApp();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    // Simulate API delay
    setTimeout(() => {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check your Order ID and try again.');
      }
      setLoading(false);
    }, 800);
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const steps = [
    { label: 'Order Placed', icon: Clock, date: 'Oct 15, 10:30 AM' },
    { label: 'Processing', icon: Package, date: 'Oct 16, 02:15 PM' },
    { label: 'Shipped', icon: Truck, date: 'Oct 17, 09:45 AM' },
    { label: 'Delivered', icon: CheckCircle, date: 'Estimated Oct 20' }
  ];

  // Theme color fallback
  const themeColor = order ? (
    order.storeId === 'store1' ? 'quilling' : 
    order.storeId === 'store2' ? 'gifts' : 'art'
  ) : (currentStore?.themeColor || 'quilling');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Track Your Order</h1>
          <p className="text-lg text-gray-500 mb-10">Enter your order ID to see the current status of your shipment.</p>
          
          <form onSubmit={handleTrack} className="relative max-w-lg mx-auto">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Order ID (e.g. o1, o2)" 
                 className="w-full pl-12 pr-32 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none text-lg"
                 value={orderId}
                 onChange={(e) => setOrderId(e.target.value)}
               />
               <button 
                 type="submit"
                 disabled={loading}
                 className={`absolute right-2 top-2 bottom-2 px-6 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors ${loading ? 'opacity-70 cursor-wait' : ''}`}
               >
                 {loading ? 'Tracking...' : 'Track'}
               </button>
            </div>
            {error && <p className="text-red-500 mt-3 text-sm font-medium">{error}</p>}
          </form>
        </div>
      </div>

      {/* Result Area */}
      {order && (
        <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in-up">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
             {/* Order Header */}
             <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                 <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Order #{order.id}</p>
                 <h2 className="text-2xl font-bold text-gray-900">Arriving to {order.customerName}</h2>
               </div>
               <div className={`px-4 py-2 rounded-full bg-${themeColor}-100 text-${themeColor}-700 font-bold text-sm uppercase tracking-wide`}>
                 {order.status}
               </div>
             </div>

             {/* Stepper */}
             <div className="p-8 md:p-12">
               <div className="relative">
                 {/* Progress Bar Background */}
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block" />
                 
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 relative">
                    {steps.map((step, index) => {
                      const status = getStepStatus(index, order.status);
                      const isCompleted = status === 'completed';
                      const isCurrent = status === 'current';
                      
                      return (
                        <div key={index} className="flex md:flex-col items-center gap-4 md:gap-4 relative z-10">
                           {/* Icon Circle */}
                           <div className={`
                             w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 flex-shrink-0
                             ${isCompleted 
                               ? `bg-${themeColor}-500 border-${themeColor}-500 text-white` 
                               : isCurrent 
                                 ? `bg-white border-${themeColor}-500 text-${themeColor}-500 scale-110 shadow-lg` 
                                 : 'bg-white border-gray-200 text-gray-300'}
                           `}>
                             <step.icon size={isCurrent ? 20 : 18} strokeWidth={isCurrent ? 2.5 : 2} />
                           </div>
                           
                           {/* Text */}
                           <div className="md:text-center">
                             <p className={`font-bold text-sm ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                             <p className="text-xs text-gray-400 mt-1">{isCompleted || isCurrent ? step.date : 'Pending'}</p>
                           </div>
                        </div>
                      );
                    })}
                 </div>
               </div>
             </div>
             
             {/* Order Details Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-100">
                <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                     <MapPin size={18} className="text-gray-400" /> Shipping Address
                   </h3>
                   <p className="text-gray-600 leading-relaxed text-sm">
                     {order.customerName}<br />
                     123 Skyline Avenue, Apt 4B<br />
                     New York, NY 10001<br />
                     United States
                   </p>
                </div>
                <div className="p-8">
                   <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between text-sm text-gray-600">
                       <span>Subtotal</span>
                       <span>${order.total}</span>
                     </div>
                     <div className="flex justify-between text-sm text-gray-600">
                       <span>Shipping</span>
                       <span>$0.00</span>
                     </div>
                     <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                       <span>Total Paid</span>
                       <span>${order.total}</span>
                     </div>
                   </div>
                </div>
             </div>

             <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-sm font-bold text-gray-900 hover:underline flex items-center justify-center gap-1">
                   View Invoice <ArrowRight size={14} />
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};