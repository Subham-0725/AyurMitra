import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('doctorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('doctorToken');
      window.location.href = '/doctor-login';
    }
    return Promise.reject(error);
  }
);

const getAcceptHeader = (format) => {
  const headers = {
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json'
  };
  return headers[format] || 'application/octet-stream';
};

export const exportPatients = async (format, doctorId) => {
  const response = await api.get(`/export/patients`, {
    params: { format, doctorId },
    headers: { Accept: getAcceptHeader(format) },
    responseType: 'blob'
  });
  return response.data;
};

export const exportPatientsWithDateRange = async (format, startDate, endDate) => {
  const response = await api.get(`/export/patients/date-range`, {
    params: { format, startDate, endDate },
    headers: { Accept: getAcceptHeader(format) },
    responseType: 'blob'
  });
  return response.data;
};

export const getBackupPreferences = async () => {
  const response = await api.get('/export/backup-preferences');
  return response.data;
};

export const updateBackupPreferences = async (preferences) => {
  const response = await api.put('/export/backup-preferences', preferences);
  return response.data;
};

export const checkExportServiceHealth = async () => {
  const response = await api.get('/export/health');
  return response.data;
};