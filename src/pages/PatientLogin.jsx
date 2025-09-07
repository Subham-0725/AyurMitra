import { SignIn } from '@clerk/clerk-react';
import { User, Sparkles, Lock } from 'lucide-react';

const PatientLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-emerald-400/25 to-teal-500/15 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-bl from-green-300/20 to-lime-400/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-tr from-teal-400/15 to-green-500/20 rounded-full blur-2xl animate-ping" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-green-400/5 via-emerald-400/10 to-teal-400/5 rounded-full blur-3xl animate-spin" style={{animationDuration: '30s'}}></div>
        {/* Modern grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 0'}}></div>
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35))]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-500 w-full">
          {/* Gradient border animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-[1px] bg-slate-900/90 rounded-3xl"></div>
          {/* Sheen */}
          <div className="pointer-events-none absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent translate-y-0 group-hover:translate-y-full transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-3">Patient Portal</h1>
              <p className="text-green-100/80 text-lg font-medium">Your wellness journey starts here</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex flex-col items-center space-y-2 group">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Lock className="w-6 h-6 text-green-300" />
                  </div>
                  <span className="text-xs text-green-200 font-medium">Encrypted</span>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-green-400/50 to-transparent"></div>
                <div className="flex flex-col items-center space-y-2 group">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <Sparkles className="w-6 h-6 text-emerald-300" />
                  </div>
                  <span className="text-xs text-green-200 font-medium">AI-Powered</span>
                </div>
              </div>
            </div>

            <SignIn 
              fallbackRedirectUrl="/patient-dashboard"
              signUpFallbackRedirectUrl="/patient-dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40',
                  card: 'shadow-none bg-transparent',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-300/50 transition-shadow duration-200',
                  formFieldLabel: 'text-green-200 font-medium',
                  identityPreviewText: 'text-white',
                  formFieldInputShowPasswordButton: 'text-green-300 hover:text-green-200'
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;