import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Store } from '../types';
import { Save, RefreshCw, CreditCard } from 'lucide-react';
import { AdminLayout } from '../layouts/AdminLayout';

export const AdminSettings: React.FC = () => {
  const { adminStoreId, stores, updateStoreSettings } = useApp();
  const currentStore = stores.find(s => s.id === adminStoreId);
  
  const [formData, setFormData] = useState<Store | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentStore) {
      setFormData(currentStore);
    }
  }, [currentStore]);

  const handleChange = (field: keyof Store, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    if (formData) {
      updateStoreSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (!formData || !adminStoreId) return null;

  return (
    <AdminLayout title="Store Settings">
       <div className="p-6 max-w-3xl">
          <div className="space-y-8">
            {/* General Info */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Home Page Visuals */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Home Page Appearance</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={formData.heroImage}
                    onChange={(e) => handleChange('heroImage', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div className="mt-4 h-48 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                  <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Preview
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Gateway Configuration */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                 <CreditCard size={20} /> Payment Gateway
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Razorpay API Key ID</label>
                    <p className="text-xs text-gray-500 mb-2">Enter your Razorpay Key ID (usually starts with rzp_test_ or rzp_live_).</p>
                    <input 
                      type="text" 
                      value={formData.razorpayKey || ''}
                      onChange={(e) => handleChange('razorpayKey', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                      placeholder="rzp_test_..."
                    />
                 </div>
              </div>
            </section>

            {/* Contact Details */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Contact & Footer Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
              <button 
                onClick={handleSave}
                className={`px-8 py-3 bg-${formData.themeColor}-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2`}
              >
                <Save size={18} /> Save Changes
              </button>
              {isSaved && (
                <span className="text-green-600 font-medium animate-fade-in flex items-center gap-1">
                   Settings saved successfully!
                </span>
              )}
            </div>
          </div>
       </div>
    </AdminLayout>
  );
};