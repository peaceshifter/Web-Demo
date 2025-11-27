import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { AdminLayout } from '../layouts/AdminLayout';

export const AdminCategories: React.FC = () => {
  const { adminStoreId, categories, addCategory, updateCategory, deleteCategory, stores } = useApp();
  const activeStore = stores.find(s => s.id === adminStoreId);
  const storeCategories = categories.filter(c => c.storeId === adminStoreId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory({
        storeId: adminStoreId!,
        name: '',
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingCategory?.name || !editingCategory?.storeId) return;

    if (editingCategory.id) {
      updateCategory(editingCategory as Category);
    } else {
      addCategory({
        ...editingCategory,
        id: `c${Date.now()}`
      } as Category);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  if (!adminStoreId) return null;

  return (
    <AdminLayout title="Categories">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">All Categories</h2>
          <button 
            onClick={() => handleOpenModal()}
            className={`flex items-center gap-2 px-4 py-2 bg-${activeStore?.themeColor}-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeCategories.map(category => (
            <div key={category.id} className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="aspect-video bg-gray-100 relative">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(category)}
                    className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">ID: {category.id}</p>
              </div>
            </div>
          ))}
        </div>

        {storeCategories.length === 0 && (
           <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             No categories found. Add one to start organizing products.
           </div>
        )}
      </div>

      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{editingCategory.id ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  placeholder="e.g. Summer Collection"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="text"
                  value={editingCategory.image}
                  onChange={e => setEditingCategory({...editingCategory, image: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  placeholder="https://..."
                />
                {editingCategory.image && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={editingCategory.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSave} className={`px-4 py-2 bg-${activeStore?.themeColor}-500 text-white font-bold rounded-lg hover:opacity-90 flex items-center gap-2`}>
                <Save size={16} /> Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};