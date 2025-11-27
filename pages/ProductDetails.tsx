import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProductById, getProducts } from '../services/mockData';
import { Product } from '../types';
import { Minus, Plus, ShoppingBag, Star, ArrowLeft, Heart, Share2, Truck, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { storeId, productId } = useParams<{ storeId: string, productId: string }>();
  const navigate = useNavigate();
  const { addToCart, stores, setCurrentStoreId } = useApp();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState('');

  // Find store to get theme color
  const store = stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (storeId) {
      setCurrentStoreId(storeId);
    }
  }, [storeId, setCurrentStoreId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.image);
        
        // Find related products (same category, different id)
        const allStoreProducts = getProducts(storeId);
        const related = allStoreProducts
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        // Product not found, go back
        navigate(`/store/${storeId}`);
      }
    }
  }, [productId, storeId, navigate]);

  if (!product || !store) return null;

  const handleAddToCart = () => {
    // Add multiple items based on quantity
    for(let i=0; i<quantity; i++) {
        addToCart(product);
    }
  };

  const incrementQty = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQty = () => setQuantity(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumbs & Back */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to={`/store/${storeId}`} className="hover:text-black flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Store
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Product Images (Sticky) */}
          <div className="relative">
            <div className="sticky top-32 space-y-4">
              <div className="aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden relative shadow-sm border border-gray-100">
                 <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                 {product.stock < 5 && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                        Low Stock: {product.stock} left
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="py-4 lg:py-12">
             <div className="mb-2 flex items-center gap-4">
               <span className="text-sm font-bold uppercase tracking-widest text-gray-400">{product.brand}</span>
               <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-900">{product.rating}</span>
               </div>
             </div>

             <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
               {product.name}
             </h1>

             <div className="flex items-end gap-4 mb-8">
               <span className="text-3xl font-bold text-gray-900">${product.price}</span>
               <span className="text-lg text-gray-400 line-through mb-1">${Math.round(product.price * 1.2)}</span>
               <span className={`text-sm font-bold text-${store.themeColor}-600 mb-2`}>Save 20%</span>
             </div>

             <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
               <p>{product.description}</p>
             </div>

             {/* Actions */}
             <div className="border-t border-b border-gray-100 py-8 mb-8 space-y-6">
                
                {/* Quantity & Cart */}
                <div className="flex flex-col sm:flex-row gap-4">
                   <div className="flex items-center bg-gray-100 rounded-full p-1 w-max">
                      <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={quantity <= 1}>
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                      <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={quantity >= product.stock}>
                        <Plus size={16} />
                      </button>
                   </div>
                   
                   <button 
                      onClick={handleAddToCart}
                      className={`flex-1 py-4 px-8 bg-${store.themeColor}-600 hover:bg-${store.themeColor}-700 text-white rounded-full font-bold text-lg shadow-xl shadow-${store.themeColor}-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3`}
                   >
                     <ShoppingBag size={20} /> Add to Cart - ${(product.price * quantity).toFixed(2)}
                   </button>

                   <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                     <Heart size={20} />
                   </button>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="flex items-center gap-3 text-gray-600">
                      <Truck size={18} className="text-gray-400" />
                      <span>Free Shipping over $100</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-600">
                      <ShieldCheck size={18} className="text-gray-400" />
                      <span>2 Year Warranty</span>
                   </div>
                </div>
             </div>

             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Description from AI Analysis</h3>
                <p className="text-sm text-gray-500">
                  This product has been curated for the {product.category} collection. 
                  It features premium materials suitable for {store.name}'s standards.
                </p>
             </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-gray-100 pt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
               {relatedProducts.map(p => (
                 <ProductCard key={p.id} product={p} />
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};