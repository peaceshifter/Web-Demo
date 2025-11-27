import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct as removeProduct } from '../services/mockData';
import { generateProductDescription } from '../services/geminiService';
import { Product } from '../types';
import { Plus, Wand2, Loader2, Save, X, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../layouts/AdminLayout';

export const AdminProducts: React.FC = () => {
  const { adminStoreId, stores, categories } = useApp();
  
  if (!adminStoreId) return null;

  const [products, setProducts] = useState(getProducts(adminStoreId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const initialFormState: Partial<Product> = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    stock: 0,
    storeId: adminStoreId,
    description: '',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'
  };

  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(initialFormState);
  const activeStore = stores.find(s => s.id === adminStoreId);
  const storeCategories = categories.filter(c => c.storeId === adminStoreId);

  useEffect(() => {
    setProducts(getProducts(adminStoreId));
  }, [adminStoreId]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      removeProduct(id);
      setProducts(getProducts(adminStoreId));
    }
  };

  const handleGenerateDescription = async () => {
    if (!currentProduct.name || !currentProduct.category) {
      alert("Please enter a name and category first.");
      return;
    }
    
    setIsGenerating(true);
    const desc = await generateProductDescription(
      currentProduct.name!, 
      currentProduct.category!, 
      `${currentProduct.brand}, ${activeStore?.name} style, premium quality`
    );
    setCurrentProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.price) return;

    if (currentProduct.id) {
        // Update existing
        updateProduct(currentProduct as Product);
    } else {
        // Add new
        const product: Product = {
        ...currentProduct as Product,
        id: `p${Date.now()}`,
        rating: 0,
        storeId: adminStoreId
        };
        addProduct(product);
    }
    
    setProducts(getProducts(adminStoreId));
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Products">
      <div className="p-6">
        <div className="flex justify-end mb-6">
            <button 
            onClick={() => handleOpenModal()}
            className={`bg-${activeStore?.themeColor}-500 hover:bg-${activeStore?.themeColor}-600 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md`}
            >
            <Plus size={20} /> Add New Item
            </button>
        </div>

        <div className="overflow-x-auto">
            {products.length > 0 ? (
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Product</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Category</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Price</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Stock</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{p.brand}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                            {p.category}
                        </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-sm">${p.price}</td>
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span className={`text-xs font-medium ${p.stock < 10 ? 'text-red-600' : 'text-green-700'}`}>
                                {p.stock}
                            </span>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
                <div className="p-10 text-center text-gray-400">
                    No products found.
                </div>
            )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={currentProduct.name}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  />
                </div>
                 <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={currentProduct.image}
                    onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={currentProduct.brand}
                    onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-white"
                    value={currentProduct.category}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {storeCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={currentProduct.price}
                    onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                  <input 
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={currentProduct.stock}
                    onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={currentProduct.description}
                    onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  />
                  <button 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="absolute bottom-3 right-3 bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-md hover:bg-black transition-all"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                    {isGenerating ? 'Thinking...' : 'AI Generate'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className={`px-6 py-2 rounded-lg font-bold text-white bg-${activeStore?.themeColor}-500 hover:bg-${activeStore?.themeColor}-600 shadow-md transition-colors flex items-center gap-2`}
              >
                <Save size={18} /> Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};