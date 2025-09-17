import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuthService';
import { 
  LayoutDashboard, Users, Calendar, BarChart3, MessageSquare, 
  LogOut, ChevronRight, Bell, Search, Settings
} from 'lucide-react';

// Import dashboard components
import DashboardAnalytics from '../components/admin/DashboardAnalytics';
import UserManagement from '../components/admin/UserManagement';
import AppointmentManagement from '../components/admin/AppointmentManagement';
import FeedbackManagement from '../components/admin/FeedbackManagement';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentAdmin = adminAuthService.getCurrentAdmin();
    if (currentAdmin) {
      setAdmin(currentAdmin);
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin-login');
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardAnalytics />;
      case 'users':
        return <UserManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      default:
        return <DashboardAnalytics />;
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-slate-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-indigo-700">Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-1">{admin.role}</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${activeSection === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span>Dashboard & Analytics</span>
              {activeSection === 'dashboard' && <ChevronRight className="ml-auto h-5 w-5" />}
            </button>

            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${activeSection === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Users className="mr-3 h-5 w-5" />
              <span>User Management</span>
              {activeSection === 'users' && <ChevronRight className="ml-auto h-5 w-5" />}
            </button>

            <button
              onClick={() => setActiveSection('appointments')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${activeSection === 'appointments' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              <span>Appointment Management</span>
              {activeSection === 'appointments' && <ChevronRight className="ml-auto h-5 w-5" />}
            </button>

            <button
              onClick={() => setActiveSection('feedback')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${activeSection === 'feedback' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              <span>Feedback Management</span>
              {activeSection === 'feedback' && <ChevronRight className="ml-auto h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {activeSection === 'dashboard' && 'Dashboard & Analytics'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'appointments' && 'Appointment Management'}
              {activeSection === 'feedback' && 'Feedback Management'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>

            <button className="p-2 rounded-lg hover:bg-slate-100 relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 rounded-lg hover:bg-slate-100">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                {admin.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{admin.name}</p>
                <p className="text-xs text-slate-500">{admin.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;