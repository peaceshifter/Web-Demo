import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentStore } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!currentStore) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center animate-fade-in-up">
        <div className={`w-24 h-24 bg-${currentStore.themeColor}-100 rounded-full flex items-center justify-center mx-auto mb-8`}>
            <CheckCircle className={`text-${currentStore.themeColor}-600 w-12 h-12`} strokeWidth={3} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-xl text-gray-500 mb-8">
            Your order has been placed successfully.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Order ID</p>
            <p className="text-2xl font-mono font-bold text-gray-900">{orderId}</p>
        </div>

        <p className="text-gray-500 mb-10 leading-relaxed">
            We've sent a confirmation email to your inbox. <br/>
            You can track your package using the Order ID above.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                to="/track-order"
                className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                <Package size={20} /> Track Order
            </Link>
            <Link 
                to="/"
                className={`px-8 py-3 bg-${currentStore.themeColor}-600 text-white font-bold rounded-full hover:bg-${currentStore.themeColor}-700 shadow-lg shadow-${currentStore.themeColor}-200 transition-colors flex items-center justify-center gap-2`}
            >
                Continue Shopping <ArrowRight size={20} />
            </Link>
        </div>
      </div>
    </div>
  );
};