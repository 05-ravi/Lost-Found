import axiosInstance from './axiosInstance';

export const getMyMatches = () => axiosInstance.get('/matches/my');
export const dismissMatch = (id) => axiosInstance.patch(`/matches/${id}/dismiss`);
