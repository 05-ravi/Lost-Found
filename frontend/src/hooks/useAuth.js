import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import * as authApi from '../api/authApi';
import toast from 'react-hot-toast';

const useAuth = () => {
    const navigate = useNavigate();
    const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore();

    const login = async (email, password) => {
        try {
            const response = await authApi.login({ email, password });
            const { data } = response;
            setAuth(data, data.accessToken);
            toast.success('Welcome back!');
            navigate('/dashboard');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);
            const { data } = response;
            setAuth(data, data.accessToken);
            toast.success('Registration successful!');
            navigate('/dashboard');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            clearAuth();
            toast.success('Logged out');
            navigate('/login');
        } catch (error) {
            clearAuth(); // Clear anyway
            navigate('/login');
        }
    };

    return {
        user,
        accessToken,
        isAuthenticated,
        login,
        register,
        logout
    };
};

export default useAuth;
