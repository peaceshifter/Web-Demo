
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ShieldCheck, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

// Helper to load external scripts (Razorpay)
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const Checkout: React.FC = () => {
  const { cart, currentStore, processOrder, customerUser } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Razorpay'>('Razorpay');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Auth Guard & Redirect
  useEffect(() => {
    if (!customerUser) {
      navigate('/auth?redirect=/checkout');
      return;
    }
    
    // Pre-fill data if user is logged in
    if (customerUser) {
        const names = customerUser.name.split(' ');
        setFormData({
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            email: customerUser.email || '',
            phone: customerUser.phone || '',
            address: customerUser.address || '',
            city: '',
            zip: ''
        });
    }

    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate, customerUser]);

  if (!currentStore || !customerUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const completeOrder = async (method: 'COD' | 'Razorpay') => {
    setLoading(true);
    try {
      const orderId = await processOrder(formData, method);
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'COD') {
      await completeOrder('COD');
      return;
    }

    // Razorpay Flow
    if (!currentStore.razorpayKey) {
        alert("Payment Gateway Error: Razorpay API Key not configured in Admin Panel.");
        return;
    }

    setLoading(true);
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    // Mock options for Razorpay
    const options = {
      key: currentStore.razorpayKey, // Dynamic key from Admin Settings
      amount: total * 100, // Amount in paise
      currency: 'USD',
      name: currentStore.name,
      description: 'Order Payment',
      image: currentStore.heroImage,
      handler: async function (response: any) {
        // In a real app, verify signature here
        await completeOrder('Razorpay');
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: currentStore.themeColor === 'quilling' ? '#f43f5e' : 
               currentStore.themeColor === 'gifts' ? '#8b5cf6' : '#f59e0b'
      },
      modal: {
        ondismiss: function() {
            setLoading(false);
        }
      }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-8">
                
                {/* Shipping Info */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full bg-${currentStore.themeColor}-100 text-${currentStore.themeColor}-600 flex items-center justify-center text-sm`}>1</span>
                        Shipping Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="Doe" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="john@example.com" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input required name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="123 Main St" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input required name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="New York" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                            <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" placeholder="10001" />
                        </div>
                    </div>
                </section>

                {/* Payment Method */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                     <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full bg-${currentStore.themeColor}-100 text-${currentStore.themeColor}-600 flex items-center justify-center text-sm`}>2</span>
                        Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                        <div 
                            onClick={() => setPaymentMethod('Razorpay')}
                            className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'Razorpay' ? `border-${currentStore.themeColor}-500 bg-${currentStore.themeColor}-50` : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Razorpay' ? `border-${currentStore.themeColor}-500` : 'border-gray-300'}`}>
                                    {paymentMethod === 'Razorpay' && <div className={`w-2.5 h-2.5 rounded-full bg-${currentStore.themeColor}-500`} />}
                                </div>
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-gray-700" size={20} />
                                    <span className="font-medium text-gray-900">Pay Online (Razorpay)</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {/* Visa/Mastercard logos placeholder */}
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        <div 
                            onClick={() => setPaymentMethod('COD')}
                            className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'COD' ? `border-${currentStore.themeColor}-500 bg-${currentStore.themeColor}-50` : 'border-gray-200 hover:border-gray-300'}`}
                        >
                             <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? `border-${currentStore.themeColor}-500` : 'border-gray-300'}`}>
                                    {paymentMethod === 'COD' && <div className={`w-2.5 h-2.5 rounded-full bg-${currentStore.themeColor}-500`} />}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Banknote className="text-gray-700" size={20} />
                                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg bg-cover bg-center" style={{backgroundImage: `url(${item.image})`}} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold text-gray-900">${item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 py-6 border-t border-b border-gray-100 mb-6">
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>Subtotal</span>
                        <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                     <div className="flex justify-between text-gray-600 text-sm">
                        <span>Taxes</span>
                        <span>$0.00</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${total}</span>
                </div>

                <button 
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl bg-${currentStore.themeColor}-600 hover:bg-${currentStore.themeColor}-700 text-white font-bold text-lg shadow-lg shadow-${currentStore.themeColor}-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2`}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                    {loading ? 'Processing...' : `Pay ${paymentMethod === 'COD' ? 'on Delivery' : 'Securely'}`}
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheck size={14} /> Secure Checkout powered by Razorpay
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
