import axiosInstance from './axiosInstance';

export const getReports = (params) => axiosInstance.get('/reports', { params });
export const getReportById = (id) => axiosInstance.get(`/reports/${id}`);
export const createReport = (data) => {
    // Check if data is FormData (for images)
    const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return axiosInstance.post('/reports', data, config);
};
export const updateReport = (id, data) => axiosInstance.put(`/reports/${id}`, data);
export const deleteReport = (id) => axiosInstance.delete(`/reports/${id}`);
export const resolveReport = (id) => axiosInstance.patch(`/reports/${id}/resolve`);
export const getMyReports = () => axiosInstance.get('/reports/my/reports');
export const getRelevantFoundItems = (params) => axiosInstance.get('/reports/found/relevant', { params });
export const getPublicStats = () => axiosInstance.get('/reports/stats');

// ML API
export const analyzeImage = (formData) => axiosInstance.post('/reports/ml/ocr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const classifyDescription = (description) => axiosInstance.post('/reports/ml/classify', { description });
