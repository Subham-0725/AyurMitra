// Admin authentication service
export const adminAuthService = {
  // Login admin
  async loginAdmin(username, password) {
    try {
      // For demo purposes, we'll use hardcoded admin credentials
      // In a real application, this would be validated against a secure database
      const adminCredentials = [
        { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Super Admin' },
        { username: 'manager', password: 'manager123', name: 'Manager User', role: 'Manager' }
      ];
      
      const admin = adminCredentials.find(
        (admin) => admin.username === username && admin.password === password
      );
      
      if (admin) {
        const adminData = {
          id: '1',
          name: admin.name,
          username: admin.username,
          role: admin.role
        };
        
        // Store in sessionStorage
        sessionStorage.setItem('loggedInAdmin', JSON.stringify(adminData));
        return { success: true, admin: adminData };
      }
      
      return { success: false, error: 'Invalid username or password' };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  // Get current logged-in admin
  getCurrentAdmin() {
    const adminData = sessionStorage.getItem('loggedInAdmin');
    return adminData ? JSON.parse(adminData) : null;
  },

  // Logout admin
  logout() {
    sessionStorage.removeItem('loggedInAdmin');
  },

  // Check if admin is logged in
  isLoggedIn() {
    return !!sessionStorage.getItem('loggedInAdmin');
  }
};