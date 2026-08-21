import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/auth';
import api from '../services/api';

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20">Failed to load profile.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-500 h-32"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-green-700 text-3xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {profile.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                <ShieldCheck className="h-4 w-4" /> Admin
              </span>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{profile.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Contact Information</h3>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>{profile.phone || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Account Details</h3>
              
              <div className="flex items-center gap-3 text-gray-600">
                <User className="h-5 w-5 text-gray-400" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
                <span>Regular Customer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
