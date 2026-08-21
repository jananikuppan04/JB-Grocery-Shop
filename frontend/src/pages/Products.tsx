import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import api from '../services/api';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products', {
            params: {
              category: categoryId,
              search: searchTerm || undefined
            }
          })
        ]);
        setCategories(catsRes.data);
        setProducts(prodsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [categoryId, searchTerm]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar / Filters */}
      <aside className="md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-lg font-bold text-gray-900">
            <Filter className="h-5 w-5" /> Filters
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSearchParams({})}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition ${!categoryId ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition ${categoryId === cat.id ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center">
          <Search className="h-5 w-5 text-gray-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border-none focus:ring-0 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition group flex flex-col">
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
                <div className="p-4 border-t border-gray-100 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`} className="mb-1">
                    <h3 className="font-medium text-gray-900 truncate hover:text-green-600">{product.name}</h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-auto">{product.unit}</p>
                  <div className="flex items-center justify-between mt-4">
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
        )}
      </div>
    </div>
  );
}
