import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Activity,
  TrendingUp,
  Clock,
  Video,
  FileText,
  Settings,
  BarChart3,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Star,
  LogOut,
  Search,
  Filter,
  Plus,
  Eye
} from "lucide-react";
import { doctorAuthService } from "../services/doctorAuthService";
import { appointmentManager } from "../services/appointmentManager";
import { treatmentService } from "../services/treatmentService";
import AnimatedBackground from "../components/AnimatedBackground";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [treatmentForm, setTreatmentForm] = useState({
    patientName: '',
    treatmentType: '',
    treatmentPlan: '',
    appointmentDate: '',
    appointmentTime: '',
    detailedProtocol: ''
  });
  const [availablePatients, setAvailablePatients] = useState([]);
  const [assignedTherapist, setAssignedTherapist] = useState('');

  useEffect(() => {
    // Check if vaidya is logged in
    const currentVaidya = doctorAuthService.getCurrentDoctor();
    if (!currentVaidya) {
      navigate("/doctor-login");
      return;
    }

    setDoctorInfo(currentVaidya);

    // Load appointments for this vaidya
    const vaidyaAppointments = appointmentManager.getDoctorAppointments(
      currentVaidya.username
    );
    setAppointments(vaidyaAppointments);

    // Load treatment plans created by this doctor
    const doctorTreatmentPlans = treatmentService.getTreatmentPlansByDoctor(currentVaidya.name);
    setTreatmentPlans(doctorTreatmentPlans);

    // Load available patients and assigned therapist
    loadDoctorData(currentVaidya.name);
  }, [navigate]);

  const displayName = useMemo(() => {
    return doctorInfo?.name || "Vaidya";
  }, [doctorInfo?.name]);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
  }, []);

  const loadDoctorData = async (doctorName) => {
    try {
      // Get patients for this doctor
      const patients = await treatmentService.getPatientsForDoctor(doctorName);
      setAvailablePatients(patients);

      // Get assigned therapist
      const therapist = await treatmentService.getTherapistForDoctor(doctorName);
      setAssignedTherapist(therapist);
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  };

  const refreshTreatmentPlans = () => {
    if (doctorInfo) {
      const doctorTreatmentPlans = treatmentService.getTreatmentPlansByDoctor(doctorInfo.name);
      setTreatmentPlans(doctorTreatmentPlans);
    }
  };

  const handleTreatmentSubmit = async (e) => {
    e.preventDefault();

    if (!treatmentForm.patientName || !treatmentForm.treatmentType) {
      alert('Please fill in all required fields');
      return;
    }

    const treatmentData = {
      ...treatmentForm,
      doctorName: doctorInfo.name,
      doctorUsername: doctorInfo.username,
      assignedTherapist: assignedTherapist,
      patientId: availablePatients.find(p => p.symptoms === treatmentForm.patientName)?.patientId || Date.now().toString()
    };

    const result = treatmentService.saveTreatmentPlan(treatmentData);

    if (result.success) {
      alert('Treatment plan created successfully and assigned to ' + assignedTherapist);
      setTreatmentForm({
        patientName: '',
        treatmentType: '',
        treatmentPlan: '',
        appointmentDate: '',
        appointmentTime: '',
        detailedProtocol: ''
      });
      // Refresh treatment plans to show in patient management
      refreshTreatmentPlans();
    } else {
      alert('Error creating treatment plan: ' + result.error);
    }
  };

  if (!doctorInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-slate-600 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Today's Patients", value: "12", icon: Users, color: "blue" },
    {
      label: "Pending Approvals",
      value: "5",
      icon: AlertCircle,
      color: "orange",
    },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "green" },
    {
      label: "Revenue Today",
      value: "₹8,500",
      icon: DollarSign,
      color: "purple",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateAppointmentStatus = (appointmentIndex, newStatus) => {
    const appointment = appointments[appointmentIndex];
    const success = appointmentManager.updateAppointmentStatus(
      doctorInfo.username,
      appointment.id,
      newStatus
    );

    if (success) {
      // Update local state
      const updatedAppointments = appointments.map((apt, idx) =>
        idx === appointmentIndex ? { ...apt, status: newStatus } : apt
      );
      setAppointments(updatedAppointments);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-72 bg-white/95 backdrop-blur-sm shadow-xl border-r border-emerald-100/50">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">🩺</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">AyurMitra Portal</h1>
                <p className="text-sm text-emerald-100">Doctor Dashboard</p>
              </div>
            </div>

            <nav className="space-y-3">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === "overview"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102"
                  }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveSection("patients")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === "patients"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102"
                  }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Patient Management</span>
              </button>

              <button
                onClick={() => setActiveSection("consultation")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === "consultation"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102"
                  }`}
              >
                <Video className="w-5 h-5" />
                <span className="font-medium">Consultation Hub</span>
              </button>

              <button
                onClick={() => setActiveSection("treatment")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === "treatment"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102"
                  }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Treatment Planning</span>
              </button>

              <button
                onClick={() => setActiveSection("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === "settings"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102"
                  }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Profile & Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100/50 px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent">
                  {activeSection === "overview" && `🙏 Welcome, Dr. ${displayName}`}
                  {activeSection === "patients" && "👥 Patient Management"}
                  {activeSection === "consultation" && "💬 Consultation Hub"}
                  {activeSection === "treatment" && "🌿 Treatment Planning"}
                  {activeSection === "settings" && "⚙️ Profile & Settings"}
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  {activeSection === "overview" && "Manage your Ayurvedic practice with ancient wisdom and modern efficiency"}
                  {activeSection === "patients" && "Comprehensive patient care and appointment management"}
                  {activeSection === "consultation" && "Connect with patients through secure video consultations"}
                  {activeSection === "treatment" && "Create personalized healing journeys with Ayurvedic protocols"}
                  {activeSection === "settings" && "Customize your profile and practice preferences"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-800">{displayName}</p>
                  <p className="text-sm text-emerald-600 font-medium">{doctorInfo?.panchakarma || 'Ayurvedic Specialist'}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">{displayName.charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 max-w-7xl mx-auto">

            {/* Main Content */}
            <div>
              {activeSection === "overview" && (
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
              )}

              {activeSection === "patients" && (
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
                        <button className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group">
                          <Filter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Filter</span>
                        </button>
                        <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl group">
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                          <span className="font-semibold">Add Patient</span>
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

                  <div className="space-y-6">
                    {/* Appointments Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        Appointments ({appointments.length})
                      </h3>
                      <div className="space-y-3">
                        {appointments.length > 0 ? (
                          appointments.map((appointment, index) => (
                            <div
                              key={`appointment-${index}`}
                              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {appointment.patientName}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    Age: {appointment.age} | Phone: {appointment.phone}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Symptoms: {appointment.symptoms}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    appointment.status
                                  )}`}
                                >
                                  {appointment.status}
                                </span>
                                <select
                                  value={appointment.status}
                                  onChange={(e) =>
                                    updateAppointmentStatus(index, e.target.value)
                                  }
                                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg">
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p>No appointments found</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Treatment Plans Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                        Treatment Plans ({treatmentPlans.length})
                      </h3>
                      <div className="space-y-3">
                        {treatmentPlans.length > 0 ? (
                          treatmentPlans.map((plan, index) => (
                            <div
                              key={`treatment-${index}`}
                              className="p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors bg-gradient-to-r from-emerald-50 to-green-50"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-emerald-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <p className="font-semibold text-slate-900">
                                        {plan.patientName}
                                      </p>
                                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                                        Treatment Plan
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">
                                      <strong>Treatment:</strong> {plan.treatmentType}
                                    </p>
                                    <p className="text-sm text-slate-600 mb-2">
                                      <strong>Assigned Therapist:</strong> {plan.assignedTherapist}
                                    </p>
                                    {plan.appointmentDate && (
                                      <p className="text-sm text-slate-600 mb-2">
                                        <strong>Next Appointment:</strong> {plan.appointmentDate} at {plan.appointmentTime}
                                      </p>
                                    )}
                                    <p className="text-sm text-slate-500">
                                      <strong>Plan:</strong> {plan.treatmentPlan?.substring(0, 100)}...
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Created: {new Date(plan.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Active
                                  </span>
                                  <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-slate-500 bg-emerald-50 rounded-lg">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p>No treatment plans created yet</p>
                            <p className="text-sm text-slate-400 mt-1">
                              Create treatment plans in the Treatment Planning section
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "consultation" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                      💬 Consultation Interface
                    </h2>
                    <p className="text-slate-600 text-lg">Connect with patients through secure video consultations</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100/50 shadow-xl overflow-hidden"
                    >
                      <div className="p-8 border-b border-purple-100/50 bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                            <Video className="w-6 h-6 mr-3 text-purple-600" />
                            Video Consultation
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-600">Ready</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="text-center z-10">
                            <Video className="w-20 h-20 text-slate-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-slate-400 text-lg font-medium">Video consultation area</p>
                            <p className="text-slate-500 text-sm mt-2">Click start to begin consultation</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-6 mt-8">
                          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 group">
                            <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Start Call</span>
                          </button>
                          <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 group">
                            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="w-2 h-2 bg-red-500 rounded-sm"></span>
                            </span>
                            <span>End Call</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-xl"
                    >
                      <div className="p-6 border-b border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                          Patient Records
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 flex items-center">
                                <Stethoscope className="w-4 h-4 mr-2 text-emerald-600" />
                                Specialization
                              </p>
                              <p className="text-sm text-slate-600 mt-1 font-medium">
                                {doctorInfo?.panchakarma}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                Total Appointments
                              </p>
                              <p className="text-2xl font-bold text-blue-700 mt-1">
                                {appointments.length}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-orange-600" />
                                Pending
                              </p>
                              <p className="text-2xl font-bold text-orange-700 mt-1">
                                {appointments.filter((apt) => apt.status === "pending").length}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 flex items-center">
                                <Star className="w-4 h-4 mr-2 text-purple-600" />
                                Success Rate
                              </p>
                              <p className="text-2xl font-bold text-purple-700 mt-1">94%</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeSection === "treatment" && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                      🌿 Ayurvedic Treatment Planning
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                      Create personalized healing journeys based on ancient Ayurvedic wisdom and modern medical insights
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl border border-green-200/50 shadow-xl">
                    <div className="p-8 border-b border-green-200/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">Create Personalized Treatment Plan</h3>
                          <p className="text-slate-600">Design holistic healing protocols for your patient's unique constitution</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                      {/* Patient Selection */}
                      <div className="bg-white rounded-xl p-6 border border-green-100">
                        <label className="block text-lg font-semibold text-slate-800 mb-3 flex items-center">
                          <span className="mr-2">👤</span> Select Patient
                        </label>
                        <select
                          value={treatmentForm.patientName}
                          onChange={(e) => setTreatmentForm({ ...treatmentForm, patientName: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                        >
                          <option>Choose patient from your consultation list</option>
                          {appointments.map((appointment, index) => (
                            <option key={index} value={appointment.patientName}>
                              {appointment.patientName} - {appointment.symptoms}
                            </option>
                          ))}
                        </select>
                        <p className="text-sm text-slate-500 mt-2">Select the patient you want to create a treatment plan for</p>
                      </div>

                      {/* Treatment Type */}
                      <div className="bg-white rounded-xl p-6 border border-green-100">
                        <label className="block text-lg font-semibold text-slate-800 mb-3 flex items-center">
                          <span className="mr-2">🌱</span> Primary Treatment Modality
                        </label>
                        <select
                          value={treatmentForm.treatmentType}
                          onChange={(e) => setTreatmentForm({ ...treatmentForm, treatmentType: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                        >
                          <option>Select primary treatment approach</option>
                          <option value={doctorInfo?.panchakarma || "Panchakarma"}>
                            🧘 {doctorInfo?.panchakarma || "Panchakarma"} - Detoxification & Rejuvenation
                          </option>
                          <option value="Herbal Medicine">🌿 Herbal Medicine - Natural Healing Compounds</option>
                          <option value="Yoga Therapy">🧘‍♀️ Yoga Therapy - Mind-Body Integration</option>
                          <option value="Dietary Therapy">🥗 Dietary Therapy - Nutritional Healing</option>
                          <option value="Lifestyle Counseling">⚖️ Lifestyle Counseling - Holistic Balance</option>
                        </select>
                        <p className="text-sm text-slate-500 mt-2">Choose the main therapeutic approach based on patient's dosha and condition</p>
                      </div>

                      {/* Appointment Scheduling */}
                      <div className="bg-white rounded-xl p-6 border border-green-100">
                        <label className="block text-lg font-semibold text-slate-800 mb-3 flex items-center">
                          <span className="mr-2">📅</span> Schedule Next Appointment
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Date</label>
                            <input
                              type="date"
                              value={treatmentForm.appointmentDate}
                              onChange={(e) => setTreatmentForm({ ...treatmentForm, appointmentDate: e.target.value })}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Time</label>
                            <select
                              value={treatmentForm.appointmentTime}
                              onChange={(e) => setTreatmentForm({ ...treatmentForm, appointmentTime: e.target.value })}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value="">Select time</option>
                              <option value="09:00">09:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="14:00">02:00 PM</option>
                              <option value="15:00">03:00 PM</option>
                              <option value="16:00">04:00 PM</option>
                            </select>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Schedule the next consultation or treatment session</p>
                      </div>

                      {/* Comprehensive Treatment Plan */}
                      <div className="bg-white rounded-xl p-6 border border-green-100">
                        <label className="block text-lg font-semibold text-slate-800 mb-3 flex items-center">
                          <span className="mr-2">📝</span> Detailed Treatment Protocol
                        </label>
                        <textarea
                          rows="8"
                          value={treatmentForm.treatmentPlan}
                          onChange={(e) => setTreatmentForm({ ...treatmentForm, treatmentPlan: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                          placeholder="📋 Comprehensive Treatment Plan:

🎯 Treatment Goals:
• Primary objective (e.g., balance Vata dosha, reduce inflammation)
• Secondary goals (e.g., improve digestion, enhance immunity)

⏰ Duration & Schedule:
• Treatment period: [e.g., 21 days, 3 months]
• Session frequency: [e.g., daily, 3x per week]

🌿 Specific Protocols:
• Panchakarma procedures: [e.g., Abhyanga, Shirodhara]
• Herbal formulations: [specific medicines with dosage]
• Dietary guidelines: [foods to include/avoid]
• Lifestyle modifications: [sleep, exercise, meditation]

📊 Progress Monitoring:
• Weekly assessments
• Symptom tracking parameters
• Follow-up schedule

⚠️ Precautions & Contraindications:
• Important safety notes
• When to contact doctor"
                        />
                        <div className="mt-3 flex items-start space-x-2 text-sm text-slate-600">
                          <span className="text-emerald-600">💡</span>
                          <p>Include specific procedures, timelines, herbal formulations, dietary guidelines, and lifestyle recommendations. Be detailed to ensure patient compliance and optimal outcomes.</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-green-200/50">
                        <div className="text-sm text-slate-500">
                          <span className="font-medium">Note:</span> This treatment plan will be immediately available to the patient in their dashboard
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setTreatmentForm({ patientName: '', treatmentType: '', treatmentPlan: '', appointmentDate: '', appointmentTime: '' })}
                            className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                          >
                            Clear Form
                          </button>
                          <button
                            onClick={() => {
                              if (treatmentForm.patientName && treatmentForm.treatmentType && treatmentForm.treatmentPlan) {
                                const treatmentData = {
                                  ...treatmentForm,
                                  doctorName: doctorInfo.name,
                                  doctorUsername: doctorInfo.username,
                                  assignedTherapist: assignedTherapist,
                                  patientId: availablePatients.find(p => p.symptoms === treatmentForm.patientName)?.patientId || Date.now().toString()
                                };
                                const savedPlan = treatmentService.saveTreatmentPlan(treatmentData);
                                if (savedPlan.success) {
                                  alert('🌿 Treatment plan created successfully! The patient can now view it in their dashboard and it will appear in Patient Management.');
                                  setTreatmentForm({ patientName: '', treatmentType: '', treatmentPlan: '', appointmentDate: '', appointmentTime: '' });
                                  // Refresh treatment plans to show in patient management
                                  refreshTreatmentPlans();
                                } else {
                                  alert('Error creating treatment plan: ' + savedPlan.error);
                                }
                              } else {
                                alert('Please fill in all required fields before saving.');
                              }
                            }}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <span>💾</span>
                            <span>Save Treatment Plan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "analytics" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900">
                    Analytics Dashboard
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="p-6 border-b border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900">
                          Patient Outcomes
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-16 h-16 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="p-6 border-b border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900">
                          Revenue Analytics
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-16 h-16 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-4">
                      ⚙️ Profile & Settings
                    </h2>
                    <p className="text-slate-600 text-lg">Customize your profile and practice preferences</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="lg:col-span-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-xl p-8"
                    >
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <span className="text-white font-bold text-3xl">{displayName.charAt(0)}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Dr. {displayName}</h3>
                        <p className="text-emerald-600 font-medium mb-4">{doctorInfo?.panchakarma || 'Ayurvedic Specialist'}</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-2 text-slate-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{appointments.length} Patients</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-slate-600">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">4.9 Rating</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-slate-600">
                            <Activity className="w-4 h-4 text-green-500" />
                            <span className="text-sm">94% Success Rate</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Settings Form */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-xl"
                    >
                      <div className="p-8 border-b border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                          <Settings className="w-6 h-6 mr-3 text-emerald-600" />
                          Professional Profile
                        </h3>
                        <p className="text-slate-600 mt-2">Update your professional information and preferences</p>
                      </div>
                      <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                              <span className="mr-2">👤</span> Full Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              defaultValue={`Dr. ${displayName}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                              <span className="mr-2">🩺</span> Specialization
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              defaultValue={doctorInfo?.panchakarma || "Ayurvedic Medicine"}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                              <span className="mr-2">💰</span> Consultation Fee
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                              <input
                                type="number"
                                className="w-full pl-8 pr-4 py-3 border-2 border-emerald-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                defaultValue="500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                              <span className="mr-2">📞</span> Contact Number
                            </label>
                            <input
                              type="tel"
                              className="w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                            <span className="mr-2">📝</span> Professional Bio
                          </label>
                          <textarea
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Share your experience, qualifications, and approach to Ayurvedic medicine..."
                          />
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-emerald-100/50">
                          <div className="text-sm text-slate-500">
                            <span className="font-medium">Last updated:</span> Never
                          </div>
                          <div className="flex items-center space-x-4">
                            <button className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-200">
                              Cancel
                            </button>
                            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
                              <span>💾</span>
                              <span>Update Profile</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;