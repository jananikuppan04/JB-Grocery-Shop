import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import api from '../services/api';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add to cart');
      return;
    }
    addToCart(product.id, quantity);
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500 text-lg mb-4">Product not found.</p>
        <Link to="/products" className="text-green-600 font-medium hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/2 p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-[500px] object-contain mix-blend-multiply" />
          ) : (
            <div className="text-gray-400">No Image Available</div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="mb-2 text-sm text-green-600 font-medium">{product.category?.name}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="text-2xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)} <span className="text-lg font-normal text-gray-500">/ {product.unit}</span></div>
          
          <div className="prose prose-green mb-8 text-gray-600">
            <p>{product.description || "No description available for this product."}</p>
          </div>
          
          <div className="border-t border-gray-100 pt-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <span className="font-medium text-gray-900 w-20">Status:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <span className="font-medium text-gray-900 w-20">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock === 0}
                  className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  disabled={product.stock === 0}
                  className="w-12 text-center py-2 border-x border-gray-300 outline-none"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                  className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-6 w-6" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
