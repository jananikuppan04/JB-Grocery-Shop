import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import useCartStore from '../store/cart';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.00;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderData = {
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: total,
      deliveryFee,
      taxAmount: tax,
      paymentMethod,
      deliveryAddr: address
    };

    try {
      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order-success/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
            
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input 
                    type="text" 
                    required 
                    value={address.street}
                    onChange={e => setAddress({...address, street: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none transition" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" 
                      required 
                      value={address.city}
                      onChange={e => setAddress({...address, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                    <input 
                      type="text" 
                      required 
                      value={address.state}
                      onChange={e => setAddress({...address, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none transition" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    required 
                    value={address.zip}
                    onChange={e => setAddress({...address, zip: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none transition" 
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'CARD' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="CARD" 
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" 
                  />
                  <span className="ml-3 font-medium text-gray-900">Credit / Debit Card (Dummy)</span>
                </label>
                
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'CASH' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="CASH" 
                    checked={paymentMethod === 'CASH'}
                    onChange={() => setPaymentMethod('CASH')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" 
                  />
                  <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                </label>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div className="text-gray-600 flex-1 truncate pr-4">
                    {item.quantity}x {item.product.name}
                  </div>
                  <div className="font-medium text-gray-900 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-4 mb-6">
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
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition font-bold text-lg disabled:opacity-50"
            >
              <CheckCircle className="h-5 w-5" />
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
