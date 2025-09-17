import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  Activity,
  Eye,
  Trash2,
  Plus,
  X
} from "lucide-react";

const PatientManagement = ({ 
  appointments, 
  updateAppointmentStatus, 
  deleteAppointment, 
  getStatusColor,
  addPatient 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientName: '',
    age: '',
    phone: '',
    symptoms: '',
    panchakarma: ''
  });

  const handleAddPatient = (e) => {
    e.preventDefault();
    const patient = {
      ...newPatient,
      id: Date.now().toString(),
      status: 'pending'
    };
    addPatient(patient);
    setNewPatient({ patientName: '', age: '', phone: '', symptoms: '', panchakarma: '' });
    setShowAddForm(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Enhanced Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="Search patients by name, symptoms, or phone..."
              className="w-full pl-12 pr-4 py-3 border-2 border-emerald-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add Patient</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group">
              <Filter className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 p-6 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-2">📊 Total Appointments</p>
              <p className="text-3xl font-bold text-blue-900 group-hover:scale-110 transition-transform">{appointments.length}</p>
              <p className="text-sm text-blue-600 font-medium">All patients</p>
            </div>
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-200/30 p-6 rounded-2xl shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700 mb-2">⏳ Pending</p>
              <p className="text-3xl font-bold text-orange-900 group-hover:scale-110 transition-transform">{appointments.filter(apt => apt.status === "pending").length}</p>
              <p className="text-sm text-orange-600 font-medium">Awaiting approval</p>
            </div>
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 via-green-100/50 to-green-200/30 p-6 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-2">✅ Confirmed</p>
              <p className="text-3xl font-bold text-green-900 group-hover:scale-110 transition-transform">{appointments.filter(apt => apt.status === "confirmed").length}</p>
              <p className="text-sm text-green-600 font-medium">Ready for treatment</p>
            </div>
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-200/30 p-6 rounded-2xl shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-2">🎯 Completed</p>
              <p className="text-3xl font-bold text-emerald-900 group-hover:scale-110 transition-transform">{appointments.filter(apt => apt.status === "completed").length}</p>
              <p className="text-sm text-emerald-600 font-medium">Successfully treated</p>
            </div>
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                <span className="mr-3">👥</span>
                Patient Appointments
              </h3>
              <p className="text-slate-600 mt-1">Comprehensive patient care and appointment management</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                {appointments.length} Total
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-emerald-50/30">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 tracking-wide">👤 Patient</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 tracking-wide">📅 Age</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 tracking-wide">🩺 Symptoms</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 tracking-wide">📞 Contact</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 tracking-wide">📊 Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 tracking-wide">⚡ Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-emerald-100/50">
              {appointments.length > 0 ? appointments.map((appointment, index) => (
                <motion.tr
                  key={`appointment-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="hover:bg-emerald-50/50 transition-all duration-200 group"
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm">{appointment.patientName.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-semibold text-slate-800">{appointment.patientName}</div>
                        <div className="text-sm text-slate-500">ID: #{String(index + 1).padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-700">{appointment.age} years</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm text-slate-700 max-w-xs">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.symptoms}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-700">{appointment.phone}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(appointment.status)} shadow-sm`}>
                      {appointment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 group"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <select
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(index, e.target.value)}
                        className="px-3 py-2 border-2 border-emerald-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => deleteAppointment(index)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md"
                        title="Delete Patient"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-600 mb-2">No appointments found</p>
                      <p className="text-sm text-slate-400">Patient appointments will appear here once scheduled</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add New Patient</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={newPatient.patientName}
                  onChange={(e) => setNewPatient({...newPatient, patientName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
                <textarea
                  value={newPatient.symptoms}
                  onChange={(e) => setNewPatient({...newPatient, symptoms: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Panchakarma</label>
                <select
                  value={newPatient.panchakarma}
                  onChange={(e) => setNewPatient({...newPatient, panchakarma: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select Panchakarma</option>
                  <option value="Abhyanga">Abhyanga</option>
                  <option value="Shirodhara">Shirodhara</option>
                  <option value="Basti">Basti</option>
                  <option value="Nasya">Nasya</option>
                  <option value="Virechana">Virechana</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PatientManagement;