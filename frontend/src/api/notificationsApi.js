import axiosInstance from './axiosInstance';

export const getNotifications = () => axiosInstance.get('/notifications');
export const readAllNotifications = () => axiosInstance.patch('/notifications/read-all');
export const readNotification = (id) => axiosInstance.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => axiosInstance.delete(`/notifications/${id}`);
