import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(catsRes.data);
        setProducts(prodsRes.data.slice(0, 8)); // Just show 8 on home
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-50 rounded-2xl p-8 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Fresh Groceries, <br />
            <span className="text-green-600">Delivered to You</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Get the freshest produce, dairy, and pantry staples delivered right to your doorstep in minutes.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition font-medium text-lg">
            Shop Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="md:w-1/2">
          {/* Placeholder for hero image */}
          <div className="aspect-video bg-green-200 rounded-xl overflow-hidden shadow-lg relative">
             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" alt="Fresh vegetables" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-green-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md transition hover:border-green-200 group"
            >
              <div className="h-16 w-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-100 transition">
                {/* Fallback icon if no image */}
                <span className="text-2xl">{category.name.charAt(0)}</span>
              </div>
              <h3 className="font-medium text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition group">
              <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 p-4">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="object-contain w-full h-full mix-blend-multiply" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="absolute top-2 left-2 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
                    Only {product.stock} left
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 left-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </Link>
              <div className="p-4 border-t border-gray-100">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 mb-1 truncate hover:text-green-600">{product.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-3">{product.unit}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => {
                      if (!user) {
                        alert('Please login to add to cart');
                        return;
                      }
                      addToCart(product.id, 1);
                    }}
                    disabled={product.stock === 0}
                    className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:hover:bg-green-50 disabled:hover:text-green-600"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
