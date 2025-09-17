import React, { useState } from 'react';
import { Download, FileText, Table, Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { exportPatients } from '../services/exportService';
import { downloadFile } from '../utils/fileDownload';

const PatientExport = ({ doctorId }) => {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });



  const handleExport = async (format) => {
    setLoading(format);
    setMessage({ type: '', text: '' });
    
    try {
      const data = await exportPatients(format, doctorId);
      const filename = `patients_${doctorId}_${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'xlsx' : format}`;
      downloadFile(data, filename);
      setMessage({ type: 'success', text: 'Export completed successfully!' });
    } catch (error) {
      let errorText = 'Export failed. Please try again.';
      if (error.message.includes('401')) errorText = 'Please login again.';
      if (error.message.includes('404')) errorText = 'No patient data found.';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(null);
    }
  };

  const formats = [
    { key: 'csv', label: 'CSV', icon: FileText },
    { key: 'excel', label: 'Excel', icon: Table },
    { key: 'json', label: 'JSON', icon: Database }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-emerald-600" />
        <h3 className="text-xl font-bold text-slate-800">Export Patient Data</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {formats.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleExport(key)}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === key ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {message.text && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default PatientExport;