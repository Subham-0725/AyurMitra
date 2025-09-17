import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Settings, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { adminAuthService } from '../services/adminAuthService';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await adminAuthService.loginAdmin(username, password);

    if (result.success) {
      navigate('/admin-dashboard');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-sm text-indigo-200">Sign in to access the administration dashboard</p>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Admin Login</h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl p-3 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-300" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-indigo-200 font-medium mb-2" htmlFor="admin-username">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" aria-hidden />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="admin-username"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus-visible:outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-indigo-200 font-medium mb-2" htmlFor="admin-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" aria-hidden />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="admin-password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus-visible:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-200 hover:text-white text-sm font-medium transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>

        <div className="flex justify-center space-x-8 mt-8">
          <div className="flex flex-col items-center space-y-2 group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Shield className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-xs text-blue-200 font-medium">Secure Access</span>
          </div>
          <div className="flex flex-col items-center space-y-2 group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
              <Settings className="w-6 h-6 text-indigo-300" />
            </div>
            <span className="text-xs text-indigo-200 font-medium">System Control</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;