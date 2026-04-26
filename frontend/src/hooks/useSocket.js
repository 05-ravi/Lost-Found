import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:5001`;

const useSocket = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket']
            });

            socketRef.current.on('connect', () => {
                console.log('Socket connected:', socketRef.current.id);
                socketRef.current.emit('join', user._id);
            });

            socketRef.current.on('notification:new', (notification) => {
                addNotification(notification);
                toast(notification.message, {
                    icon: '🔔',
                    duration: 4000
                });
            });

            socketRef.current.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        }

        return () => {
            // We usually want socket to persist while user is logged in
            // so we only disconnect if user logs out (handled above)
        };
    }, [isAuthenticated, user, addNotification]);

    return socketRef.current;
};

export default useSocket;
