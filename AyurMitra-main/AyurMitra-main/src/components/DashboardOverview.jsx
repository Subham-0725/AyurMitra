import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  FileText,
  Video,
  Settings
} from "lucide-react";

const DashboardOverview = ({ 
  appointments, 
  treatmentPlans, 
  setActiveSection, 
  getStatusColor 
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Total Appointments</p>
              <p className="text-3xl font-bold text-blue-900">{appointments.length}</p>
              <p className="text-sm text-blue-600 font-medium">Active patients</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-2xl shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-orange-900">{appointments.filter(apt => apt.status === "pending").length}</p>
              <p className="text-sm text-orange-600 font-medium">Awaiting confirmation</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-1">Treatment Plans</p>
              <p className="text-3xl font-bold text-emerald-900">{treatmentPlans.length}</p>
              <p className="text-sm text-emerald-600 font-medium">Created plans</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-green-900">94%</p>
              <p className="text-sm text-green-600 font-medium">Patient satisfaction</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50"
      >
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">⚡ Quick Actions</h3>
          <p className="text-slate-600 mt-1">Access your most used features instantly</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setActiveSection("patients")}
              className="group flex items-center space-x-4 p-6 border-2 border-blue-200/50 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 group-hover:text-blue-700">Manage Patients</p>
                <p className="text-sm text-slate-500">View appointments</p>
              </div>
            </button>
            <button
              onClick={() => setActiveSection("consultation")}
              className="group flex items-center space-x-4 p-6 border-2 border-purple-200/50 rounded-2xl hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 group-hover:text-purple-700">Start Consultation</p>
                <p className="text-sm text-slate-500">Video calls</p>
              </div>
            </button>
            <button
              onClick={() => setActiveSection("treatment")}
              className="group flex items-center space-x-4 p-6 border-2 border-emerald-200/50 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Create Treatment</p>
                <p className="text-sm text-slate-500">New plan</p>
              </div>
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className="group flex items-center space-x-4 p-6 border-2 border-slate-200/50 rounded-2xl hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 group-hover:text-slate-700">Settings</p>
                <p className="text-sm text-slate-500">Profile & preferences</p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50"
      >
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">📋 Recent Activity</h3>
          <p className="text-slate-600 mt-1">Your latest appointments and patient interactions</p>
        </div>
        <div className="p-8">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-4 p-4 border border-slate-200/50 rounded-xl hover:bg-slate-50/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{appointment.patientName}</p>
                    <p className="text-sm text-slate-600">Age: {appointment.age} | {appointment.symptoms}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-medium">No recent activity</p>
              <p className="text-sm">Your appointments will appear here</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;