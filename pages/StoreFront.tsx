import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProducts } from '../services/mockData';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, ArrowRight, Sparkles, Box } from 'lucide-react';

export const StoreFront: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { setCurrentStoreId, stores, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (storeId) {
      setCurrentStoreId(storeId);
    }
  }, [storeId, setCurrentStoreId]);

  const store = stores.find(s => s.id === storeId);
  if (!store) return <Navigate to="/store/store1" replace />;

  const products = getProducts(storeId).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const storeCategories = categories.filter(c => c.storeId === storeId);

  return (
    <div className="min-h-screen bg-white">
      {/* Immersive Wide Hero Section */}
      <div className="relative w-full h-[75vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/30 z-10" />
        <div className={`absolute inset-0 bg-gradient-to-r from-${store.themeColor}-900/60 to-transparent z-10`} />
        
        <img 
          src={store.heroImage} 
          alt={store.name} 
          className="w-full h-full object-cover transform scale-105" 
          style={{ transition: 'transform 20s ease-out' }}
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 max-w-[1920px] mx-auto">
          <div className="max-w-3xl animate-fade-in-up">
            <span className={`inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-6`}>
              {store.name} Collection 2024
            </span>
            <h1 className={`text-6xl md:text-8xl font-bold text-white mb-6 leading-tight ${(store.type === 'quilling' || store.type === 'art') ? 'font-serif' : 'font-sans'}`}>
              {store.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 font-light mb-10 max-w-xl leading-relaxed">
              Curated items for the modern lifestyle. Discover distinct quality and exceptional design.
            </p>
            <button className={`bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 group`}>
              Explore Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Wide Container */}
      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12 py-20">
        
        {/* Categories Section */}
        {storeCategories.length > 0 && (
          <div className="mb-24">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
              <button className="hidden md:flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storeCategories.map((cat, idx) => (
                <div key={cat.id} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                   <div className="absolute inset-0 bg-gray-200" />
                   <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                   
                   <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-3xl font-bold text-white mb-2">{cat.name}</h3>
                      <p className="text-white/80 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-medium">
                        Browse Products <ArrowRight size={14} />
                      </p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter & Search */}
        <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-lg py-4 -mx-6 md:-mx-12 px-6 md:px-12 mb-10 border-b border-gray-100 transition-all">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
               <Sparkles className={`text-${store.themeColor}-500`} /> 
               <span>Trending Now</span>
            </div>
            
            <div className="flex w-full md:w-auto gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-gray-700 font-medium">
                <Filter size={18} /> <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid - Wide & Spacious */}
        <div className="min-h-[400px]">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Box size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                We couldn't find what you're looking for. Try adjusting your search terms or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};