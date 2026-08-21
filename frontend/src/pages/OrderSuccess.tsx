import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 md:p-12 border border-gray-200 rounded-2xl shadow-sm text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for shopping with JB Grocery. Your order has been successfully placed and is being processed.
      </p>
      
      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <p className="text-sm text-gray-500 mb-1">Order Reference</p>
        <p className="font-mono font-bold text-gray-900">ID: {id}</p>
      </div>
      
      <div className="space-y-4">
        <Link to="/orders" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-medium">
          <Package className="h-5 w-5" /> View My Orders
        </Link>
        <Link to="/products" className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition font-medium">
          Continue Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
