import axiosInstance from './axiosInstance';

export const submitClaim = (data) => {
    const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return axiosInstance.post('/claims', data, config);
};
export const getMyClaims = () => axiosInstance.get('/claims/my/claims');
export const getReceivedClaims = () => axiosInstance.get('/claims/received');
export const acceptClaim = (id) => axiosInstance.patch(`/claims/${id}/accept`);
export const rejectClaim = (id, data) => axiosInstance.patch(`/claims/${id}/reject`, data);
export const markAsReceived = (id) => axiosInstance.patch(`/claims/${id}/received`);
