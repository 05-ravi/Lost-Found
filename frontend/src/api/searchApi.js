import axiosInstance from './axiosInstance';

export const searchReports = (params) => axiosInstance.get('/search', { params });
