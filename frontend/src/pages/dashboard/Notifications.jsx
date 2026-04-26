import { useState, useEffect } from 'react';
import { 
  Bell, Check, Trash2, 
  Flame, MessageSquare, 
  ShieldCheck, Info, Clock,
  CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import * as notificationsApi from '../../api/notificationsApi';
import useNotificationStore from '../../store/notificationStore';
import { formatDate, formatTimeAgo } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const Notifications = () => {
  const { notifications, setNotifications, markAsRead } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationsApi.getNotifications();
      setNotifications(res.data);
    } catch (error) {
      toast.error('Could not fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAll = async () => {
    try {
      await notificationsApi.readAllNotifications();
      toast.success('All marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.readNotification(id);
      markAsRead(id);
    } catch (error) {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationsApi.deleteNotification(id);
      toast.success('Notification removed');
      fetchNotifications();
    } catch (error) {
      toast.error('Could not delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match': return { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'claim': return { icon: ShieldCheck, color: 'text-medium-blue', bg: 'bg-blue-50' };
      case 'message': return { icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' };
      default: return { icon: Bell, color: 'text-dark-blue', bg: 'bg-secondary-bg' };
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-blue">Notifications</h1>
          <p className="text-text-secondary mt-1">Stay updated with matches, claims, and activity.</p>
        </div>
        
        <Button 
            onClick={handleReadAll}
            variant="outlined-blue"
            size="sm"
            leftIcon={CheckCircle2}
            className="px-6 py-2.5 bg-white font-bold rounded-2xl shadow-sm"
        >
            Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
           {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-20 bg-white border border-border-custom rounded-2xl animate-pulse" />
           ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="bg-white border border-border-custom rounded-[40px] overflow-hidden shadow-sm">
           <AnimatePresence initial={false}>
             {notifications.map((n, i) => {
               const config = getNotificationIcon(n.type);
               return (
                 <motion.div 
                   key={n._id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   transition={{ delay: i * 0.05 }}
                   className={`p-6 border-b border-border-custom/50 flex items-start gap-4 hover:bg-secondary-bg/30 transition-all group relative cursor-pointer
                    ${!n.isRead ? 'bg-blue-50/30' : ''}
                   `}
                   onClick={() => handleMarkRead(n._id)}
                 >
                    {!n.isRead && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-medium-blue rounded-full shadow-lg shadow-medium-blue/50" />
                    )}
                    
                    <div className={`p-3 rounded-2xl ${config.bg} ${config.color} shrink-0`}>
                        <config.icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">{n.type}</p>
                            <span className="text-[10px] font-medium text-text-secondary flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(n.createdAt)}
                            </span>
                        </div>
                        <h4 className={`text-sm font-bold text-dark-blue leading-snug ${!n.isRead ? 'text-black' : ''}`}>
                            {n.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1">{n.message}</p>
                    </div>

                    <Button 
                        onClick={(e) => handleDelete(e, n._id)}
                        variant="ghost"
                        isIconOnly
                        leftIcon={Trash2}
                        className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-cta transition-all shrink-0"
                    />
                 </motion.div>
               );
             })}
           </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-border-custom rounded-[40px] py-40 text-center">
            <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-text-secondary opacity-10" />
            </div>
            <p className="text-text-secondary text-sm italic">Inbox is empty. We'll alert you here.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
