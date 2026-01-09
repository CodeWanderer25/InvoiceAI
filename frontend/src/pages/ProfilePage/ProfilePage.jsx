import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { Building, Loader2, Mail, MapPin, Phone,  User } from 'lucide-react';
import axiosInstance from '../../utils/axios';
import { API_ROUTES } from '../../utils/ApiRoute';
import toast from 'react-hot-toast';

const ProfilePage = () => {
const { user, loading, updateProfile } = useAuth();
const [isUpdating, setIsUpdating] = useState(false);
const [formData, setFormData] = useState({
        name:"",
        businessName: "",
        address: "",
        phone: ""
      });

useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || '',
      businessName: user.businessName || '',
      address: user.address || '',
      phone: user.phone || ''
    });
  }
}, [user]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setIsUpdating(true);
  
  try {
    const response = await axiosInstance.put(API_ROUTES.AUTH.UPDATE_PROFILE, formData);
    updateProfile(response.data);
    toast.success('Profile updated successfully!');
  } catch (error) {
    toast.error('Failed to update profile.');
    console.error(error);
  } finally {
    setIsUpdating(false);
  }
};


if(loading){
  <Loader2/>
}

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="text-3xl font-bold text-white">My Profile</div>
          </div>

            <form onSubmit={handleUpdateProfile}>

                        <div className="p-8 space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type='email' 
                  readOnly 
                  value={user?.email || ""} 
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  placeholder='Enter your name' 
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  name='businessName' 
                  value={formData.businessName} 
                  placeholder='Business Name' 
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  name="phone" 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 flex justify-end">
            <button 
              type="submit" 
              disabled={isUpdating} 
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isUpdating ? 'Saving ... ' : 'Save Changes'}
            </button>
          </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage