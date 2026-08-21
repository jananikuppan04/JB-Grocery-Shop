import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, MapPin } from 'lucide-react';
import useAuthStore from '../store/auth';
import useCartStore from '../store/cart';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Package className="h-8 w-8" />
              JB Grocery
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-full border border-green-200 text-gray-700">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-800">Deliver to: <span className="font-bold text-green-700">Chennai</span></span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-green-600 font-medium">Products</Link>
          </nav>

          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6 text-green-500" /> JB Grocery
            </h3>
            <p className="text-gray-400 mb-3">Fresh groceries, delivered to your doorstep. Quality you can trust.</p>
            <div className="flex items-start gap-2 text-gray-300 text-sm bg-gray-800 p-3 rounded-lg border border-gray-700">
              <MapPin className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Location Details:</p>
                <p>Chennai, Tamil Nadu, India</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-green-400">Home</Link></li>
              <li><Link to="/products" className="hover:text-green-400">Products</Link></li>
              <li><Link to="/cart" className="hover:text-green-400">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/profile" className="hover:text-green-400">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-green-400">Order History</Link></li>
              <li><span className="hover:text-green-400 cursor-pointer">Contact Us</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for offers and updates in Chennai.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-md w-full text-black focus:outline-none" />
              <button className="bg-green-600 px-4 py-2 rounded-r-md hover:bg-green-500">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} JB Grocery Shop - Chennai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
