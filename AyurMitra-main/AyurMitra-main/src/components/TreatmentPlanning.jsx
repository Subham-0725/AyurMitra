import React from "react";
import { motion } from "framer-motion";

const TreatmentPlanning = ({ 
  treatmentForm, 
  setTreatmentForm, 
  availablePatients, 
  assignedTherapist 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Treatment plan created successfully!');
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
          <h3 className="text-2xl font-bold text-slate-800">🌿 Create Treatment Plan</h3>
          <p className="text-slate-600 mt-1">Design personalized Ayurvedic treatment protocols</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Patient Name</label>
                <select
                  value={treatmentForm.patientName}
                  onChange={(e) => setTreatmentForm({...treatmentForm, patientName: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select Patient</option>
                  {availablePatients.filter(patient => patient.patientName).map((patient, index) => (
                    <option key={index} value={patient.patientName}>
                      {patient.patientName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Treatment Type</label>
                <select
                  value={treatmentForm.treatmentType}
                  onChange={(e) => setTreatmentForm({...treatmentForm, treatmentType: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select Treatment</option>
                  <option value="Panchakarma">Panchakarma</option>
                  <option value="Herbal Medicine">Herbal Medicine</option>
                  <option value="Yoga Therapy">Yoga Therapy</option>
                  <option value="Dietary Consultation">Dietary Consultation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Treatment Plan</label>
              <textarea
                value={treatmentForm.treatmentPlan}
                onChange={(e) => setTreatmentForm({...treatmentForm, treatmentPlan: e.target.value})}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows="4"
                placeholder="Describe the treatment plan..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Date</label>
                <input
                  type="date"
                  value={treatmentForm.appointmentDate}
                  onChange={(e) => setTreatmentForm({...treatmentForm, appointmentDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Time</label>
                <input
                  type="time"
                  value={treatmentForm.appointmentTime}
                  onChange={(e) => setTreatmentForm({...treatmentForm, appointmentTime: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Protocol</label>
              <textarea
                value={treatmentForm.detailedProtocol}
                onChange={(e) => setTreatmentForm({...treatmentForm, detailedProtocol: e.target.value})}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows="3"
                placeholder="Detailed treatment protocol..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pre-treatment Notification</label>
                <textarea
                  value={treatmentForm.preNotification}
                  onChange={(e) => setTreatmentForm({...treatmentForm, preNotification: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="2"
                  placeholder="Instructions before treatment..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Post-treatment Notification</label>
                <textarea
                  value={treatmentForm.postNotification}
                  onChange={(e) => setTreatmentForm({...treatmentForm, postNotification: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="2"
                  placeholder="Instructions after treatment..."
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-sm text-emerald-700">
                <strong>Assigned Therapist:</strong> {assignedTherapist || 'No therapist assigned'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Treatment Plan
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default TreatmentPlanning;