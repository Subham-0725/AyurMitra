import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Award, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doctorAuthService } from "../services/doctorAuthService";

const ProfileSettings = ({ doctorInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    doctorAuthService.logout();
    navigate("/doctor-login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50">
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">👤 Profile Information</h3>
          <p className="text-slate-600 mt-1">Manage your professional profile and preferences</p>
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">{doctorInfo?.name?.charAt(0) || 'D'}</span>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{doctorInfo?.name || 'Doctor Name'}</h4>
              <p className="text-emerald-600 font-medium">{doctorInfo?.panchakarma || 'Ayurvedic Specialist'}</p>
              <p className="text-slate-500">Username: {doctorInfo?.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <User className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Full Name</p>
                  <p className="font-semibold text-slate-800">{doctorInfo?.name || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Award className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Specialization</p>
                  <p className="font-semibold text-slate-800">{doctorInfo?.panchakarma || 'Ayurvedic Medicine'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Experience</p>
                  <p className="font-semibold text-slate-800">10+ Years</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="font-semibold text-slate-800">{doctorInfo?.username}@ayurmitra.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <Phone className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-800">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="font-semibold text-slate-800">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50">
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">⚙️ Account Settings</h3>
          <p className="text-slate-600 mt-1">Manage your account preferences and security</p>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
              <span className="font-medium text-slate-800">Change Password</span>
              <span className="text-slate-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
              <span className="font-medium text-slate-800">Notification Preferences</span>
              <span className="text-slate-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
              <span className="font-medium text-slate-800">Privacy Settings</span>
              <span className="text-slate-400">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100/50">
        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;