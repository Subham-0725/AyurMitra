import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Phone,
  MessageCircle,
} from "lucide-react";
import VideoCall from "./VideoCall";

const ConsultationHub = () => {
  const [isInCall, setIsInCall] = useState(false);

  const startVideoCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
  };

  if (isInCall) {
    return <VideoCall onEndCall={endCall} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Consultation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700 mb-1">
                Active Sessions
              </p>
              <p className="text-3xl font-bold text-purple-900">3</p>
              <p className="text-sm text-purple-600 font-medium">
                Ongoing consultations
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">
                Scheduled Today
              </p>
              <p className="text-3xl font-bold text-blue-900">8</p>
              <p className="text-sm text-blue-600 font-medium">
                Video consultations
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-1">
                Completed Today
              </p>
              <p className="text-3xl font-bold text-green-900">12</p>
              <p className="text-sm text-green-600 font-medium">
                Successful sessions
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Start Consultation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50"
      >
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">
            🚀 Quick Start Consultation
          </h3>
          <p className="text-slate-600 mt-1">
            Start an instant video consultation with your patients
          </p>
        </div>
        <div className="p-8">
          <div className="flex justify-center">
            <button
              onClick={startVideoCall}
              className="group flex items-center space-x-4 p-6 border-2 border-purple-200/50 rounded-2xl hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-slate-800 group-hover:text-purple-700">
                  Start Video Call
                </p>
                <p className="text-sm text-slate-500">
                  Begin instant consultation
                </p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scheduled Consultations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50"
      >
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">
            📅 Today's Scheduled Consultations
          </h3>
          <p className="text-slate-600 mt-1">
            Manage your upcoming video consultations
          </p>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[
              {
                time: "10:00 AM",
                patient: "Rajesh Kumar",
                type: "Follow-up",
                status: "upcoming",
              },
              {
                time: "11:30 AM",
                patient: "Priya Sharma",
                type: "Initial Consultation",
                status: "in-progress",
              },
              {
                time: "2:00 PM",
                patient: "Amit Patel",
                type: "Treatment Review",
                status: "upcoming",
              },
              {
                time: "3:30 PM",
                patient: "Sunita Devi",
                type: "Panchakarma Consultation",
                status: "upcoming",
              },
            ].map((consultation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-6 border border-slate-200/50 rounded-xl hover:bg-slate-50/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {consultation.patient}
                    </p>
                    <p className="text-sm text-slate-600">
                      {consultation.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {consultation.time}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        consultation.status === "in-progress"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {consultation.status === "in-progress"
                        ? "In Progress"
                        : "Upcoming"}
                    </span>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md">
                    <Video className="w-4 h-4" />
                    <span className="font-medium">Join</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Consultation Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50"
      >
        <div className="px-8 py-6 border-b border-emerald-100/50">
          <h3 className="text-2xl font-bold text-slate-800">
            🛠 Consultation Tools
          </h3>
          <p className="text-slate-600 mt-1">
            Additional tools to enhance your consultation experience
          </p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group flex flex-col items-center space-y-3 p-6 border-2 border-slate-200/50 rounded-2xl hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Chat Support</p>
                <p className="text-sm text-slate-500">Text messaging</p>
              </div>
            </button>
            <button className="group flex flex-col items-center space-y-3 p-6 border-2 border-slate-200/50 rounded-2xl hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Screen Share</p>
                <p className="text-sm text-slate-500">Share documents</p>
              </div>
            </button>
            <button className="group flex flex-col items-center space-y-3 p-6 border-2 border-slate-200/50 rounded-2xl hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Schedule</p>
                <p className="text-sm text-slate-500">Book appointments</p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConsultationHub;
