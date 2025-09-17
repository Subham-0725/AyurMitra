import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/clerk-react";
import { doctorAuthService } from "../services/doctorAuthService";
import { therapistAuthService } from "../services/therapistAuthService";
import { useI18n } from "../utils/i18n.jsx";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);
  const [isTherapistLoggedIn, setIsTherapistLoggedIn] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Service", path: "/service" },
    { name: "Contact", path: "/contact" },
  ];
  const loginOptions = ["Patient", "Vaidya", "Therapist", "Admin"];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check vaidya and therapist authentication status
  useEffect(() => {
    const checkAuthStates = () => {
      setIsDoctorLoggedIn(doctorAuthService.isLoggedIn());
      setIsTherapistLoggedIn(therapistAuthService.isLoggedIn());
    };

    checkAuthStates();

    // Listen for storage changes to update auth status
    window.addEventListener("storage", checkAuthStates);

    // Also check periodically in case sessionStorage changes in same tab
    const interval = setInterval(checkAuthStates, 1000);

    return () => {
      window.removeEventListener("storage", checkAuthStates);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = () => {
    if (isDoctorLoggedIn) {
      doctorAuthService.logout();
      setIsDoctorLoggedIn(false);
      navigate("/");
    } else if (isTherapistLoggedIn) {
      therapistAuthService.logout();
      setIsTherapistLoggedIn(false);
      navigate("/");
    } else if (isSignedIn) {
      signOut(() => navigate("/"));
    }
    setShowSignOutConfirm(false);
  };

  const isAnyUserLoggedIn =
    isSignedIn || isDoctorLoggedIn || isTherapistLoggedIn;
  const { language, setLanguage, availableLanguages } = useI18n();

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100/50 py-3"
            : "bg-white/90 backdrop-blur-lg shadow-lg py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-16">
              {/* Professional Logo */}
              <div
                className="group cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden">
                    <img
                      src="/img/logo.png"
                      alt="AyurMitra Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                      AyurMitra
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">
                      Wellness Management
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {menuItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group"
                  >
                    {item.name}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language selector (desktop) */}
              <div className="hidden sm:flex items-center bg-white/90 border border-gray-100 rounded-xl px-2 py-1">
                <span className="text-xs text-gray-500 mr-2">Lang</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm bg-transparent outline-none cursor-pointer"
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* User Status Indicator */}
              {isAnyUserLoggedIn && (
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">
                    Online
                  </span>
                </div>
              )}

              {/* Authentication Button */}
              {isAnyUserLoggedIn ? (
                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7"
                    />
                  </svg>
                  <span>Sign Out</span>
                </button>
              ) : (
                <DropdownMenu open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DropdownMenuTrigger className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl border border-emerald-500/20">
                    <span>Login</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isLoginOpen && "rotate-180"
                      )}
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48 bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 mt-2 p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-1">
                      Login as
                    </div>
                    {loginOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        className="px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer rounded-xl transition-all duration-200 font-medium flex items-center space-x-3"
                        onClick={() => {
                          const routes = {
                            Patient: "/patient-login",
                            Vaidya: "/doctor-login",
                            Therapist: "/therapist-login",
                            Admin: "/admin-login",
                          };
                          navigate(routes[option]);
                          setIsLoginOpen(false);
                        }}
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>{option}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl p-2 transition-all duration-200"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 bg-white/98 backdrop-blur-xl border-t border-gray-100">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              {isAnyUserLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      Currently Online
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSignOutConfirm(true)}
                    className="block w-full text-left px-4 py-3 text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2">
                    Login as:
                  </div>
                  {loginOptions.map((option, index) => (
                    <button
                      key={option}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all duration-200 font-medium flex items-center space-x-3"
                      onClick={() => {
                        const routes = {
                          Patient: "/patient-login",
                          Vaidya: "/doctor-login",
                          Therapist: "/therapist-login",
                          Admin: "/admin-login",
                        };
                        navigate(routes[option]);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>{option}</span>
                    </button>
                  ))}
                  {/* Mobile language selector */}
                  <div className="mt-4 px-4">
                    <div className="flex items-center space-x-2 bg-white/90 border border-gray-100 rounded-xl px-2 py-1">
                      <span className="text-xs text-gray-500">Lang</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-sm bg-transparent outline-none cursor-pointer"
                      >
                        {availableLanguages.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Professional Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Are you sure you want to end your current session?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
