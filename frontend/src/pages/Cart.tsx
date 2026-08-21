import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import useCartStore from '../store/cart';

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.00;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Browse our products to find something you'll love!</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-medium">
          Start Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</h2>
        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="object-contain w-full h-full mix-blend-multiply" />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </Link>
                
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-gray-900 text-lg hover:text-green-600 transition">{item.product.name}</h3>
                  </Link>
                  <p className="text-gray-500 text-sm">{item.product.unit}</p>
                  <div className="mt-2 text-green-600 font-bold">${item.product.price.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-gray-600 hover:text-green-600 transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50 transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-lg font-bold text-gray-900 w-24 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-medium text-gray-900">
                {deliveryFee === 0 ? <span className="text-green-600">Free</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (5%)</span>
              <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition font-bold text-lg"
          >
            Proceed to Checkout <ArrowRight className="h-5 w-5" />
          </button>
          
          {deliveryFee > 0 && (
            <p className="text-sm text-center text-gray-500 mt-4">
              Add ${(50 - subtotal).toFixed(2)} more to your cart to get <span className="text-green-600 font-medium">Free Delivery</span>!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
