import React, { useEffect, useState } from 'react';
import { Package, Search, Plus, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/admin/inventory');
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustInventory = async (productId: string) => {
    if (adjustQuantity === 0) {
      setAdjustingId(null);
      return;
    }

    try {
      await api.post('/admin/inventory/adjust', {
        productId,
        quantity: adjustQuantity,
        note: 'Manual adjustment from admin panel'
      });
      fetchInventory();
      setAdjustingId(null);
      setAdjustQuantity(0);
    } catch (error) {
      alert('Failed to adjust inventory');
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-none focus:ring-0 outline-none text-gray-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-700">Product Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Current Stock</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.category?.name}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{item.stock}</td>
                  <td className="px-6 py-4">
                    {item.stock === 0 ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                        <AlertTriangle className="h-3 w-3" /> Out of Stock
                      </span>
                    ) : item.stock <= item.minStock ? (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
                        <AlertTriangle className="h-3 w-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        <CheckCircle className="h-3 w-3" /> In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {adjustingId === item.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <input 
                          type="number" 
                          value={adjustQuantity}
                          onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <button 
                          onClick={() => handleAdjustInventory(item.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => {
                            setAdjustingId(null);
                            setAdjustQuantity(0);
                          }}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setAdjustingId(item.id);
                          setAdjustQuantity(0);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                      >
                        Adjust
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
