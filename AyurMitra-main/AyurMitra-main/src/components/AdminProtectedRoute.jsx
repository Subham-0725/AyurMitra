import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuthService';

const AdminProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = adminAuthService.isLoggedIn();
        if (!isLoggedIn) {
            navigate('/admin-login');
        }
    }, [navigate]);

    const isLoggedIn = adminAuthService.isLoggedIn();

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-xl text-slate-600 animate-pulse">Loading...</div>
            </div>
        );
    }

    return children;
};

export default AdminProtectedRoute;