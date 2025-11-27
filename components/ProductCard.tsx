import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, currentStore } = useApp();

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-white/95 backdrop-blur-sm text-black py-3 rounded-xl font-semibold shadow-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>

        {/* Badges */}
        {product.stock < 5 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Low Stock
          </span>
        )}
      </div>

      <div>
        <div className="flex justify-between items-start mb-1">
          <p className={`text-xs font-bold uppercase tracking-widest text-gray-400`}>{product.brand}</p>
          <div className="flex items-center gap-1 text-yellow-500">
             <Star size={12} fill="currentColor" />
             <span className="text-xs font-medium text-gray-900">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/store/${product.storeId}/product/${product.id}`} className="block">
          <h3 className="text-gray-900 font-medium text-lg leading-snug mb-2 group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
        </Link>
        
        <span className="text-black font-bold text-xl">${product.price}</span>
      </div>
    </div>
  );
};