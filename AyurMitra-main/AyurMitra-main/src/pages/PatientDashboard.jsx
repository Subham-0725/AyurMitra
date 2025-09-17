import { useUser } from "@clerk/clerk-react";
import {
  Calendar,
  Clock,
  Activity,
  MessageSquare,
  Settings,
  User,
  Heart,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Star,
  Send,
  Phone,
  MapPin,
  Save,
  Loader2,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../utils/i18n";
import AppointmentBooking from "../components/AppointmentBooking";
import PatientProfileForm from "../components/PatientProfileForm";
import PatientDetailsForm from "../components/PatientDetailsForm";
import PredictionForm from "../components/PredictionForm";
import { treatmentService } from "../services/treatmentService";
import { appointmentManager } from "../services/appointmentManager";
import Footer from "../components/Footer";
import MyReports from "../components/MyReports";

// Manage Profile Form Component
const ManageProfileForm = ({ onComplete }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: "",
    medicalHistory: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem("patientProfile");
      if (savedProfile) {
        setFormData(JSON.parse(savedProfile));
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.phone) {
      setError(t("profile.error.required", "Please fill all required fields"));
      return;
    }

    setIsSaving(true);
    localStorage.setItem("patientProfile", JSON.stringify(formData));

    setTimeout(() => {
      setIsSaving(false);
      onComplete && onComplete();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-8 space-y-6">
      {error && (
        <div className="bg-gradient-to-r from-red-500/10 via-pink-500/5 to-red-500/10 backdrop-blur-xl border border-red-200/30 rounded-3xl p-6 flex items-center space-x-4 shadow-lg">
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-lg font-bold text-gray-900">
            {t("profile.fullName", "Full Name *")}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t(
              "profile.fullNamePlaceholder",
              "Enter your full name"
            )}
            className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg"
            disabled={isSaving || isLoading}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-bold text-gray-900">
            {t("profile.age", "Age *")}
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder={t("profile.agePlaceholder", "Enter your age")}
            min="1"
            max="120"
            className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg"
            disabled={isSaving || isLoading}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-bold text-gray-900">
            {t("profile.phone", "Phone Number *")}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t(
              "profile.phonePlaceholder",
              "Enter your phone number"
            )}
            className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg"
            disabled={isSaving || isLoading}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-bold text-gray-900">
            {t("profile.gender", "Gender")}
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg"
            disabled={isSaving || isLoading}
          >
            <option value="">
              {t("profile.selectGender", "Select gender")}
            </option>
            <option value="male">{t("profile.gender.male", "Male")}</option>
            <option value="female">
              {t("profile.gender.female", "Female")}
            </option>
            <option value="other">{t("profile.gender.other", "Other")}</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-bold text-gray-900">
            {t("profile.bloodGroup", "Blood Group")}
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg"
            disabled={isSaving || isLoading}
          >
            <option value="">
              {t("profile.selectBloodGroup", "Select blood group")}
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-bold text-gray-900">
            {t("profile.emergencyContact", "Emergency Contact")}
          </label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder={t(
              "profile.emergencyPlaceholder",
              "Emergency contact number"
            )}
            className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg"
            disabled={isSaving || isLoading}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-lg font-bold text-gray-900">
          {t("profile.address", "Address")}
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder={t(
            "profile.addressPlaceholder",
            "Enter your complete address"
          )}
          rows="3"
          className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg resize-none"
          disabled={isSaving || isLoading}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-lg font-bold text-gray-900">
          {t("profile.medicalHistory", "Medical History")}
        </label>
        <textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleInputChange}
          placeholder={t(
            "profile.medicalHistoryPlaceholder",
            "Any existing medical conditions, allergies, or medications"
          )}
          rows="4"
          className="w-full p-4 border-0 rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 text-lg resize-none"
          disabled={isSaving || isLoading}
        />
      </div>

      <div className="relative pt-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="group relative w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white py-6 px-8 rounded-3xl font-black text-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] hover:-translate-y-2 transform active:scale-95 shadow-[0_8px_32px_rgba(16,185,129,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-center space-x-4">
            {isSaving ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="tracking-wide">
                  {t("profile.updating", "Updating Profile...")}
                </span>
              </>
            ) : (
              <>
                <Save className="w-7 h-7 group-hover:scale-125 transition-all duration-300" />
                <span className="tracking-wide">
                  {t("profile.update", "Update Profile")}
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

// Lightweight Feedback form used in the Feedback section
const FeedbackForm = ({ onSubmit, userName }) => {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("uiux");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const categories = [
    { value: "appointments", label: "Appointments" },
    { value: "uiux", label: "UI/UX" },
    { value: "performance", label: "Performance" },
    { value: "support", label: "Support" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    onSubmit({
      rating,
      category,
      comment: comment.trim(),
      name: isAnonymous ? "Anonymous" : userName,
      date: new Date().toISOString(),
    });
    setRating(0);
    setHoverRating(0);
    setCategory("uiux");
    setComment("");
    setIsAnonymous(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rating */}
        <div className="bg-white rounded-xl p-4 border border-emerald-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("feedback.rating", "Rating")}
          </label>
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label="Rating"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const index = i + 1;
              const active = (hoverRating || rating) >= index;
              return (
                <button
                  type="button"
                  key={index}
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(index)}
                  className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  aria-checked={rating === index}
                  role="radio"
                >
                  <Star
                    className={`w-6 h-6 ${
                      active ? "text-amber-400" : "text-gray-300"
                    }`}
                    fill={active ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-4 border border-emerald-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("feedback.category", "Category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-emerald-200 text-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {t(`feedback.category.${c.value}`, c.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Anonymity */}
        <div className="bg-white rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">
              {t("feedback.anonymous.title", "Submit anonymously")}
            </div>
            <div className="text-xs text-gray-500">
              {t("feedback.anonymous.subtitle", "Your name will be hidden")}
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only"
            />
            <span
              className={`w-10 h-6 flex items-center bg-emerald-200 rounded-full p-1 transition ${
                isAnonymous ? "bg-emerald-500" : ""
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                  isAnonymous ? "translate-x-4" : ""
                }`}
              ></span>
            </span>
          </label>
        </div>
      </div>

      {/* Comment */}
      <div className="bg-white rounded-xl p-4 border border-emerald-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("feedback.comments", "Comments")}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder={t(
            "feedback.commentsPlaceholder",
            "Share details about your experience..."
          )}
          className="w-full bg-white border border-emerald-200 text-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
          required
        />
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40 transition"
        >
          <Send className="w-4 h-4" />
          {t("feedback.submit", "Submit feedback")}
        </button>
      </div>
    </form>
  );
};

const PatientDashboard = () => {
  const { t } = useI18n();
  const { user, isLoaded } = useUser();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem("patientFeedback");
    return saved ? JSON.parse(saved) : [];
  });
  const [patientDetails, setPatientDetails] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // keyboard-accessible card activation
  const handleCardKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "Guest";
    return (
      user.firstName ||
      user.fullName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "Patient"
    );
  };

  // Check if user has profile on component mount
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      // Check localStorage only (no API call)
      const savedProfile = localStorage.getItem("patientProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.name) {
          setHasProfile(true);
        }
      }
      setIsCheckingProfile(false);
    };

    if (isLoaded) {
      checkProfile();
    }
  }, [user, isLoaded]);

  // Persist feedback
  useEffect(() => {
    localStorage.setItem("patientFeedback", JSON.stringify(feedbackList));
  }, [feedbackList]);

  if (!isLoaded || isCheckingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl text-gray-700 font-bold tracking-wide"
          >
            {t(
              "loading.preparing_dashboard",
              "Preparing your wellness dashboard..."
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Show profile form if user doesn't have profile
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              {t("profile.welcome_title", "Welcome to Your Ayurvedic Journey")}
            </h1>
            <p className="text-gray-700 text-lg">
              🌿{" "}
              {t(
                "profile.complete_prompt",
                "Please complete your profile to get personalized wellness recommendations"
              )}
            </p>
          </div>
          <PatientProfileForm
            onComplete={() => {
              setHasProfile(true);
              setActiveSection("dashboard");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden"
    >
      {/* Ayurvedic Natural Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Ayurvedic Leaves */}
        {[...Array(8)].map((_, i) => (
          <motion.img
            key={`ayur-leaf-${i}`}
            src="/img/ayurvedic-leaf.svg"
            alt=""
            animate={{
              x: [0, 100 * Math.sin(i * 0.8), 0],
              y: [0, 80 * Math.cos(i * 0.6), 0],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 25 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            className="absolute opacity-20"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 12}%`,
              top: `${15 + i * 10}%`,
              filter: "blur(1px)",
            }}
          />
        ))}

        {/* Floating Lotus Flowers */}
        {[...Array(4)].map((_, i) => (
          <motion.img
            key={`lotus-${i}`}
            src="/img/lotus-flower.svg"
            alt=""
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 30 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 4,
            }}
            className="absolute"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              left: `${20 + i * 25}%`,
              top: `${20 + i * 20}%`,
              filter: "blur(2px)",
            }}
          />
        ))}

        {/* Herb Branches */}
        {[...Array(6)].map((_, i) => (
          <motion.img
            key={`herb-${i}`}
            src="/img/herb-branch.svg"
            alt=""
            animate={{
              x: [0, 50 * Math.sin(i), 0],
              y: [0, 30 * Math.cos(i), 0],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
            className="absolute opacity-25"
            style={{
              width: `${100 + i * 25}px`,
              height: `${50 + i * 15}px`,
              left: `${5 + i * 15}%`,
              top: `${25 + i * 12}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Brass Bowls */}
        {[...Array(3)].map((_, i) => (
          <motion.img
            key={`bowl-${i}`}
            src="/img/brass-bowl.svg"
            alt=""
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 18 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 6,
            }}
            className="absolute"
            style={{
              width: `${70 + i * 20}px`,
              height: `${42 + i * 12}px`,
              left: `${25 + i * 30}%`,
              top: `${70 + i * 5}%`,
            }}
          />
        ))}

        {/* Bamboo Stalks */}
        {[...Array(4)].map((_, i) => (
          <motion.img
            key={`bamboo-${i}`}
            src="/img/bamboo.svg"
            alt=""
            animate={{
              x: [0, 10 * Math.sin(i * 0.5), 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 25 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 4,
            }}
            className="absolute opacity-30"
            style={{
              width: `${25 + i * 5}px`,
              height: `${120 + i * 20}px`,
              left: `${80 + i * 5}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}

        {/* Neem Leaves */}
        {[...Array(5)].map((_, i) => (
          <motion.img
            key={`neem-${i}`}
            src="/img/neem-leaf.svg"
            alt=""
            animate={{
              rotate: [0, 360],
              x: [0, 60 * Math.cos(i), 0],
              y: [0, 40 * Math.sin(i), 0],
            }}
            transition={{
              duration: 35 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
            className="absolute opacity-20"
            style={{
              width: `${50 + i * 10}px`,
              height: `${75 + i * 15}px`,
              left: `${15 + i * 18}%`,
              top: `${5 + i * 18}%`,
            }}
          />
        ))}

        {/* Tulsi Leaves */}
        {[...Array(4)].map((_, i) => (
          <motion.img
            key={`tulsi-${i}`}
            src="/img/tulsi-leaf.svg"
            alt=""
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 28 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 7,
            }}
            className="absolute"
            style={{
              width: `${45 + i * 12}px`,
              height: `${60 + i * 18}px`,
              left: `${60 + i * 10}%`,
              top: `${40 + i * 15}%`,
            }}
          />
        ))}

        {/* Soft Green Gradient Overlays */}
        <motion.div
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.06) 0%, transparent 60%)
            `,
          }}
        />

        {/* Floating Ayurvedic Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [100, -100],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              width: `${6 + Math.random() * 10}px`,
              height: `${6 + Math.random() * 10}px`,
              background:
                i % 4 === 0
                  ? "#22c55e"
                  : i % 4 === 1
                  ? "#16a34a"
                  : i % 4 === 2
                  ? "#84cc16"
                  : "#f59e0b",
              borderRadius: i % 2 === 0 ? "50%" : "30% 70% 70% 30%",
              left: `${Math.random() * 100}%`,
              top: "100%",
            }}
          />
        ))}

        {/* Subtle Mandala Pattern */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5"
          style={{
            width: "600px",
            height: "300px",
            background:
              "conic-gradient(from 0deg, #22c55e, #16a34a, #84cc16, #f59e0b, #22c55e)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Header with Stats */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl mb-8 shadow-2xl relative"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-4xl">👋</span>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-20 blur-lg"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-7xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 tracking-tight">
                {t("welcome_back", "Welcome back")}, {getDisplayName()}
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <span className="text-green-600 font-semibold">
                  {t("health.status_excellent", "Health Status: Excellent")}
                </span>
              </div>
              <p className="text-gray-700 text-2xl font-medium max-w-4xl mx-auto leading-relaxed">
                🌿{" "}
                {t(
                  "welcome.subtitle",
                  "Ready to continue your Ayurvedic wellness journey? Let's nurture your mind, body, and spirit today."
                )}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Action */}

        <AnimatePresence mode="wait">
          {activeSection === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>

              <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-8 shadow-xl border border-emerald-200/60">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {t("feedback.title", "We value your feedback")}
                  </h2>
                  <p className="text-slate-600">
                    {t(
                      "feedback.subtitle",
                      "Tell us what went well and where we can improve."
                    )}
                  </p>
                </div>

                {/* Feedback form */}
                <FeedbackForm
                  onSubmit={(entry) =>
                    setFeedbackList([entry, ...feedbackList])
                  }
                  userName={getDisplayName()}
                />

                {/* Previous feedback */}
                {feedbackList.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {t("feedback.recent", "Recent feedback")}
                    </h3>
                    <div className="space-y-4">
                      {feedbackList.slice(0, 6).map((f, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl p-4 border border-emerald-100 flex items-start gap-4"
                        >
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <Star
                                key={si}
                                className={`w-4 h-4 ${
                                  si < f.rating
                                    ? "text-amber-400"
                                    : "text-gray-300"
                                }`}
                                fill={si < f.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-semibold text-gray-800">
                                {f.name}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{f.category}</span>
                              <span>•</span>
                              <span>{new Date(f.date).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-800 mt-1 whitespace-pre-line">
                              {f.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {activeSection === "patient-details" && (
            <motion.div
              key="patient-details"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>
              <PatientDetailsForm
                onSubmit={(details) => {
                  setPatientDetails(details);
                  setActiveSection("book-appointment");
                }}
                onBack={() => setActiveSection("dashboard")}
              />
            </motion.div>
          )}

          {activeSection === "book-appointment" && (
            <motion.div
              key="book-appointment"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("patient-details")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>{t("actions.back_to_details", "Back to Details")}</span>
              </motion.button>
              <AppointmentBooking patientDetails={patientDetails} />
            </motion.div>
          )}

          {activeSection === "prediction" && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>

              <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-8 shadow-xl border border-emerald-200/60">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {t("prediction.title", "Panchakarma Dosha Predictor")}
                  </h2>
                  <p className="text-slate-600">
                    {t(
                      "prediction.subtitle",
                      "Enter symptoms and get a dosha prediction to assist your doctor"
                    )}
                  </p>
                </div>

                <PredictionForm />
              </div>
            </motion.div>
          )}

          {activeSection === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>

              <div className="max-w-2xl mx-auto p-6">
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 rounded-[2rem]"></div>

                  <div className="relative bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-8 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]"></div>
                    <div className="relative flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-lg">
                        <User className="w-8 h-8 drop-shadow-sm" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tight drop-shadow-sm">
                          {t("profile.manage_title", "Manage Profile")}
                        </h2>
                        <p className="text-white/90 font-medium drop-shadow-sm">
                          {t(
                            "profile.manage_subtitle",
                            "Update your information"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ManageProfileForm
                    onComplete={() => setActiveSection("dashboard")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "wellness" && (
            <motion.div
              key="wellness"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>

              <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl p-8 shadow-xl border border-green-200/50">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    🌿 {t("wellness.title", "Wellness Tracking Dashboard")}
                  </h2>
                  <p className="text-slate-600 text-lg">
                    {t(
                      "wellness.subtitle",
                      "Monitor your Ayurvedic wellness journey and dosha balance"
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🩺</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {t(
                            "wellness.treatment_progress.title",
                            "Treatment Progress"
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t(
                            "wellness.treatment_progress.subtitle",
                            "Current therapy status"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Panchakarma</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">Day 15/20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Herbal Medicine
                        </span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">Week 3/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Diet Plan</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">Following</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">💧</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          Symptom Tracker
                        </h3>
                        <p className="text-sm text-gray-600">
                          Monitor your health improvements
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🤕 Joint Pain</span>
                        <span className="text-green-600 font-medium">
                          Improved
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">😴 Sleep Quality</span>
                        <span className="text-green-600 font-medium">
                          Better
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🌡️ Digestion</span>
                        <span className="text-yellow-600 font-medium">
                          Moderate
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">🧘‍♀️ Energy Level</span>
                        <span className="text-green-600 font-medium">High</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          Wellness Score
                        </h3>
                        <p className="text-sm text-gray-600">
                          Overall health rating
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        8.2
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        out of 10
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Excellent Progress
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">💡</span>
                    {t(
                      "wellness.recommendations_title",
                      "Today's Ayurvedic Recommendations"
                    )}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-start">
                      <span className="mr-2">🌿</span>
                      <span>Drink warm ginger tea to balance Vata dosha</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">🧘</span>
                      <span>Practice 10 minutes of pranayama breathing</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">🥗</span>
                      <span>Include more warm, cooked foods in your diet</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">💤</span>
                      <span>Sleep by 10 PM for optimal Kapha balance</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>
              <MyReports />
            </motion.div>
          )}

          {activeSection === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setActiveSection("dashboard")}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:shadow-xl mb-8"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {t("actions.back_to_dashboard", "Back to Dashboard")}
                </span>
              </motion.button>

              <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl p-8 shadow-xl border border-green-200/50">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    🌿 {t("schedule.title", "My Schedule & Treatment Plans")}
                  </h2>
                  <p className="text-slate-600 text-lg">
                    {t(
                      "schedule.subtitle",
                      "Your appointments and personalized healing protocols"
                    )}
                  </p>
                </div>

                {(() => {
                  const savedProfile = localStorage.getItem("patientProfile");
                  const patientName = savedProfile
                    ? JSON.parse(savedProfile).name
                    : getDisplayName();

                  // Get treatment plans created by doctors
                  const treatments =
                    treatmentService.getPatientTreatments(patientName);

                  // Get regular appointments from all doctors
                  const allAppointments =
                    appointmentManager.getAllAppointments();
                  const patientAppointments = [];

                  Object.keys(allAppointments).forEach((doctorUsername) => {
                    const doctorAppointments = allAppointments[
                      doctorUsername
                    ].filter(
                      (apt) =>
                        apt.patientName.toLowerCase() ===
                        patientName.toLowerCase()
                    );
                    patientAppointments.push(...doctorAppointments);
                  });

                  const hasContent =
                    treatments.length > 0 || patientAppointments.length > 0;

                  if (hasContent) {
                    return (
                      <div className="space-y-6">
                        {/* Treatment Plans */}
                        {treatments.map((treatment, index) => (
                          <div
                            key={treatment.id}
                            className="bg-white rounded-2xl p-8 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                  <span className="text-2xl">
                                    {treatment.treatmentType.includes(
                                      "Panchakarma"
                                    )
                                      ? "🧘"
                                      : treatment.treatmentType.includes(
                                          "Herbal"
                                        )
                                      ? "🌿"
                                      : treatment.treatmentType.includes("Yoga")
                                      ? "⚡"
                                      : "🌱"}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {treatment.treatmentType}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <span className="mr-1">👨⚕️</span>
                                      Dr.{" "}
                                      {treatment.doctorName || "Your Doctor"}
                                    </span>
                                    <span className="flex items-center">
                                      <span className="mr-1">📅</span>
                                      {new Date(
                                        treatment.createdAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                                  ✨ Treatment Plan
                                </span>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-6 border border-green-100">
                              <div className="flex items-center mb-4">
                                <span className="text-lg mr-2">📋</span>
                                <h4 className="text-lg font-bold text-gray-900">
                                  {t(
                                    "treatment.protocol_title",
                                    "Your Personalized Treatment Protocol"
                                  )}
                                </h4>
                              </div>
                              <div className="prose prose-green max-w-none">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-white rounded-lg p-4 border border-green-100">
                                  {treatment.treatmentPlan}
                                </div>
                              </div>
                            </div>

                            {treatment.appointmentDate &&
                              treatment.appointmentTime && (
                                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-semibold text-gray-900 mb-1 flex items-center">
                                        <span className="mr-2">📅</span>
                                        {t(
                                          "schedule.next_appointment",
                                          "Next Scheduled Appointment"
                                        )}
                                      </h5>
                                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                                        <span className="flex items-center">
                                          <span className="mr-1">📆</span>
                                          {new Date(
                                            treatment.appointmentDate
                                          ).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </span>
                                        <span className="flex items-center">
                                          <span className="mr-1">⏰</span>
                                          {treatment.appointmentTime}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                      Scheduled
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}

                        {/* Regular Appointments */}
                        {patientAppointments.map((appointment, index) => (
                          <div
                            key={appointment.id}
                            className="bg-white rounded-2xl p-8 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                  <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {t(
                                      "appointments.consultation_title",
                                      "Consultation Appointment"
                                    )}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <span className="mr-1">📅</span>
                                      {new Date(
                                        appointment.createdAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span
                                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                                    appointment.status === "confirmed"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : appointment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : appointment.status === "completed"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : "bg-red-100 text-red-800 border-red-200"
                                  }`}
                                >
                                  {appointment.status.charAt(0).toUpperCase() +
                                    appointment.status.slice(1)}
                                </span>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-6 border border-blue-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    📋 {t("appointments.symptoms", "Symptoms")}
                                  </h4>
                                  <p className="text-gray-700">
                                    {appointment.symptoms}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    📞 {t("appointments.contact", "Contact")}
                                  </h4>
                                  <p className="text-gray-700">
                                    {appointment.phone}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 bg-white rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center space-x-4 text-sm text-gray-700">
                                  <span className="flex items-center">
                                    <span className="mr-1">📆</span>
                                    {new Date(
                                      appointment.appointmentDate
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <span className="flex items-center">
                                    <span className="mr-1">⏰</span>
                                    {appointment.appointmentTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <span className="text-4xl">🌿</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                          {t(
                            "schedule.empty_title",
                            "Your Healing Journey Awaits"
                          )}
                        </h3>
                        <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                          {t(
                            "schedule.empty_message",
                            "Once you complete your consultation, your Ayurvedic doctor will create personalized treatment plans tailored to your unique constitution and health needs."
                          )}
                        </p>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 max-w-lg mx-auto border border-green-200">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            👨⚕️{" "}
                            {t("schedule.what_to_expect", "What to Expect:")}
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1 text-left">
                            <li>
                              •{" "}
                              {t(
                                "schedule.expect.dosha",
                                "Comprehensive dosha analysis"
                              )}
                            </li>
                            <li>
                              •{" "}
                              {t(
                                "schedule.expect.protocols",
                                "Customized Panchakarma protocols"
                              )}
                            </li>
                            <li>
                              •{" "}
                              {t(
                                "schedule.expect.herbal",
                                "Herbal medicine prescriptions"
                              )}
                            </li>
                            <li>
                              •{" "}
                              {t(
                                "schedule.expect.lifestyle",
                                "Lifestyle and dietary guidance"
                              )}
                            </li>
                            <li>
                              •{" "}
                              {t(
                                "schedule.expect.monitoring",
                                "Regular progress monitoring"
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Dashboard Grid */}
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            {/* All Cards in Single Row */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
            >
              {[
                {
                  id: "book-appointment",
                  icon: Calendar,
                  title: t(
                    "dashboard.cards.book_appointment.title",
                    "Book Appointment"
                  ),
                  description: t(
                    "dashboard.cards.book_appointment.desc",
                    "AI-powered Ayurvedic doctor matching for your dosha"
                  ),
                  gradient: "from-emerald-400 via-green-500 to-teal-600",
                  bgGradient: "from-emerald-50 via-green-50 to-teal-50",
                  iconBg: "from-emerald-500 to-green-600",
                  action: () => setActiveSection("patient-details"),
                  delay: 0,
                  emoji: "🌿",
                },
                {
                  id: "profile",
                  icon: User,
                  title: t("dashboard.cards.profile.title", "Manage Profile"),
                  description: t(
                    "dashboard.cards.profile.desc",
                    "Update your Ayurvedic health constitution & preferences"
                  ),
                  gradient: "from-blue-400 via-indigo-500 to-purple-600",
                  bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
                  iconBg: "from-blue-500 to-indigo-600",
                  action: () => setActiveSection("profile"),
                  delay: 0.1,
                  emoji: "👤",
                },
                {
                  id: "schedule",
                  icon: Clock,
                  title: t("dashboard.cards.schedule.title", "My Schedule"),
                  description: t(
                    "dashboard.cards.schedule.desc",
                    "View your Panchakarma & consultation appointments"
                  ),
                  gradient: "from-orange-400 via-amber-500 to-yellow-600",
                  bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
                  iconBg: "from-orange-500 to-amber-600",
                  action: () => setActiveSection("schedule"),
                  delay: 0.2,
                  emoji: "📅",
                },
                {
                  id: "health",
                  icon: Heart,
                  title: t("dashboard.cards.health.title", "Wellness Tracking"),
                  description: t(
                    "dashboard.cards.health.desc",
                    "Monitor your dosha balance & holistic wellness journey"
                  ),
                  gradient: "from-pink-400 via-rose-500 to-red-600",
                  bgGradient: "from-pink-50 via-rose-50 to-red-50",
                  iconBg: "from-pink-500 to-rose-600",
                  action: () => setActiveSection("wellness"),
                  delay: 0.3,
                  emoji: "💖",
                },
                {
                  id: "reports",
                  icon: FileText,
                  title: t("dashboard.cards.reports.title", "My Reports"),
                  description: t(
                    "dashboard.cards.reports.desc",
                    "Download and share your treatment reports"
                  ),
                  gradient: "from-violet-400 via-purple-500 to-indigo-600",
                  bgGradient: "from-violet-50 via-purple-50 to-indigo-50",
                  iconBg: "from-violet-500 to-purple-600",
                  action: () => setActiveSection("reports"),
                  delay: 0.4,
                  emoji: "📄",
                },
                {
                  id: "feedback",
                  icon: MessageSquare,
                  title: t("dashboard.cards.feedback.title", "Feedback"),
                  description: t(
                    "dashboard.cards.feedback.desc",
                    "Share your experience and help us improve"
                  ),
                  gradient: "from-emerald-400 via-blue-500 to-purple-600",
                  bgGradient: "from-emerald-50 via-blue-50 to-purple-50",
                  iconBg: "from-emerald-500 to-blue-600",
                  action: () => setActiveSection("feedback"),
                  delay: 0.5,
                  emoji: "💬",
                },
                {
                  id: "prediction",
                  icon: Zap,
                  title: t(
                    "dashboard.cards.prediction.title",
                    "Dosha Predictor"
                  ),
                  description: t(
                    "dashboard.cards.prediction.desc",
                    "Quick dosha prediction from symptoms"
                  ),
                  gradient: "from-amber-400 via-orange-500 to-red-600",
                  bgGradient: "from-amber-50 via-orange-50 to-red-50",
                  iconBg: "from-amber-500 to-orange-600",
                  action: () => setActiveSection("prediction"),
                  delay: 0.6,
                  emoji: "⚡",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: item.delay,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                    },
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.action}
                  onKeyDown={(e) => handleCardKeyDown(e, item.action)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.title} - ${item.description}`}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl p-8 h-72 w-full transition-all duration-500 transform-gpu focus:outline-none focus:ring-4 focus:ring-green-200/50"
                >
                  {/* Enhanced gradient background overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated border gradient */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}
                  />

                  {/* Decorative corner elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header section with icon and emoji */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative">
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                            rotate: [0, -3, 3, 0],
                            transition: { duration: 0.5 },
                          }}
                          className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${item.iconBg} shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300`}
                        >
                          <item.icon className="w-8 h-8 text-white drop-shadow-sm" />

                          {/* Icon glow effect */}
                          <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.iconBg} opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300`}
                          />
                        </motion.div>

                        {/* Floating emoji */}
                        <motion.div
                          animate={{
                            y: [0, -4, 0],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute -top-2 -right-2 text-2xl filter drop-shadow-sm"
                        >
                          {item.emoji}
                        </motion.div>
                      </div>

                      {/* Action arrow */}
                      <motion.div
                        whileHover={{
                          x: 4,
                          scale: 1.1,
                        }}
                        className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                      </motion.div>
                    </div>

                    {/* Content section */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <motion.h3
                          whileHover={{ x: 2 }}
                          className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors duration-300"
                        >
                          {item.title}
                        </motion.h3>
                        <motion.p
                          whileHover={{ x: 1 }}
                          className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300"
                        >
                          {item.description}
                        </motion.p>
                      </div>

                      {/* Bottom section with progress bar */}
                      <div className="mt-6">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{
                            delay: item.delay + 0.8,
                            duration: 1.2,
                            ease: "easeOut",
                          }}
                          className={`h-1.5 rounded-full bg-gradient-to-r ${item.gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
                        />

                        {/* Status indicator */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                            {t("dashboard.card_ready", "Ready to use")}
                          </span>
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.3,
                                }}
                                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle shine effect */}
                  <motion.div
                    animate={{
                      x: [-100, 400],
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:opacity-50"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      {activeSection === "dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <Footer />
        </motion.div>
      )}
    </motion.div>
  );
};

export default PatientDashboard;
