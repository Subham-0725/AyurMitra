import JSZip from 'jszip';

export const downloadFile = (data, filename, mimeType = 'application/octet-stream') => {
  try {
    let blob;
    
    if (data instanceof Blob) {
      blob = data;
    } else if (data instanceof ArrayBuffer) {
      blob = new Blob([data], { type: mimeType });
    } else if (typeof data === 'string') {
      blob = new Blob([data], { type: mimeType });
    } else {
      throw new Error('Unsupported data type');
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

export const downloadCSV = (csvData, filename) => {
  const csvString = typeof csvData === 'string' ? csvData : JSON.stringify(csvData);
  downloadFile(csvString, filename, 'text/csv');
};

export const downloadJSON = (jsonData, filename) => {
  const jsonString = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData, null, 2);
  downloadFile(jsonString, filename, 'application/json');
};

export const downloadExcel = (binaryData, filename) => {
  downloadFile(binaryData, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

export const generateTimestampedFilename = (baseName, extension) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  return `${baseName}_${timestamp}.${extension}`;
};

export const supportsDownload = () => {
  const a = document.createElement('a');
  return typeof a.download !== 'undefined';
};

export const downloadAsZip = async (files, zipFilename) => {
  try {
    const zip = new JSZip();
    
    files.forEach(({ name, data }) => {
      zip.file(name, data);
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, zipFilename, 'application/zip');
  } catch (error) {
    console.error('ZIP download failed:', error);
    throw error;
  }
};