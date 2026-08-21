import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Sales</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">${stats.totalSales.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Orders</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Products</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Customers</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm font-medium text-green-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{order.user.name}</div>
                  <div className="text-sm text-gray-500">{order.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                  <div className="text-xs font-medium text-green-600 uppercase">{order.status}</div>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">No recent orders.</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
            <Link to="/admin/inventory" className="text-sm font-medium text-green-600 hover:underline">Manage Inventory</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.lowStockProducts.map((product: any) => (
              <div key={product.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center p-1">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="object-contain w-full h-full" />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  </div>
                </div>
                <div className="text-right">
                  {product.stock === 0 ? (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">Only {product.stock} left</span>
                  )}
                </div>
              </div>
            ))}
            {stats.lowStockProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500">All products have sufficient stock.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
