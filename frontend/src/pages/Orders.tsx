import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PROCESSING': 
      case 'SHIPPED': return <Clock className="h-4 w-4 mr-1" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't placed any orders with us yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Order Placed</div>
                <div className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total</div>
                <div className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Order #</div>
                <div className="font-mono text-gray-900">{order.orderNumber}</div>
              </div>
              <div className="sm:ml-auto">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-4">Items in this order:</h3>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-1 border border-gray-100">
                           {item.product.imageUrl ? (
                             <img src={item.product.imageUrl} alt={item.product.name} className="object-contain w-full h-full mix-blend-multiply" />
                           ) : (
                             <Package className="h-6 w-6 text-gray-300" />
                           )}
                        </div>
                        <div className="flex-1">
                          <Link to={`/product/${item.product.id}`} className="font-medium text-gray-900 hover:text-green-600 transition block">
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="font-medium text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
