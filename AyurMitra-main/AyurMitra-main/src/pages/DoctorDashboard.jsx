import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Video,
  FileText,
  Settings
} from "lucide-react";
import { doctorAuthService } from "../services/doctorAuthService";
import { appointmentManager } from "../services/appointmentManager";
import { treatmentService } from "../services/treatmentService";
import DashboardOverview from "../components/DashboardOverview";
import PatientManagement from "../components/PatientManagement";
import ConsultationHub from "../components/ConsultationHub";
import TreatmentPlanning from "../components/TreatmentPlanning";
import ProfileSettings from "../components/ProfileSettings";

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
    detailedProtocol: '',
    preNotification: '',
    postNotification: ''
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
        detailedProtocol: '',
        preNotification: '',
        postNotification: ''
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

  const deleteAppointment = (appointmentIndex) => {
    if (window.confirm('Do you want to delete this patient data?')) {
      const appointment = appointments[appointmentIndex];
      const success = appointmentManager.deleteAppointment(
        doctorInfo.username,
        appointment.id
      );

      if (success) {
        // Update local state
        const updatedAppointments = appointments.filter((_, idx) => idx !== appointmentIndex);
        setAppointments(updatedAppointments);
      }
    }
  };

  const addPatient = (patient) => {
    const newAppointment = {
      ...patient,
      doctorUsername: doctorInfo.username
    };
    
    // Save to appointment manager
    const success = appointmentManager.addAppointment(doctorInfo.username, newAppointment);
    
    if (success) {
      // Update local state immediately
      setAppointments(prev => [...prev, newAppointment]);
      alert('Patient added successfully!');
    } else {
      alert('Failed to add patient');
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
                  {activeSection === "overview" && `🙏 Welcome, ${displayName}`}
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
                <DashboardOverview 
                  appointments={appointments}
                  treatmentPlans={treatmentPlans}
                  setActiveSection={setActiveSection}
                  getStatusColor={getStatusColor}
                />
              )}

              {activeSection === "patients" && (
                <PatientManagement 
                  appointments={appointments}
                  updateAppointmentStatus={updateAppointmentStatus}
                  deleteAppointment={deleteAppointment}
                  getStatusColor={getStatusColor}
                  addPatient={addPatient}
                />
              )}

              {activeSection === "consultation" && (
                <ConsultationHub />
              )}

              {activeSection === "treatment" && (
                <TreatmentPlanning 
                  treatmentForm={treatmentForm}
                  setTreatmentForm={setTreatmentForm}
                  availablePatients={[...availablePatients, ...appointments]}
                  assignedTherapist={assignedTherapist}
                />
              )}

              {activeSection === "settings" && (
                <ProfileSettings doctorInfo={doctorInfo} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;