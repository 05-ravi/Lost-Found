import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, MapPin, 
  ClipboardList, Bell, 
  User, CheckCircle, Flame, 
  HelpCircle, Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from './ui/Button';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Items Feed', icon: Search, path: '/items-feed' },
    { name: 'My Reports', icon: ClipboardList, path: '/my-reports' },

    { name: 'Claim Tracking', icon: CheckCircle, path: '/claims/tracking' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const secondaryItems = [
    { name: 'Profile Settings', icon: User, path: '/profile' },
    { name: 'Help & Support', icon: HelpCircle, path: '/help' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-dark-blue/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className={cn(
          "fixed lg:static top-0 left-0 h-screen w-[280px] bg-white border-r border-border-custom z-50 flex flex-col transition-all duration-300 ease-in-out shadow-sidebar",
          !isOpen && "lg:w-0 lg:opacity-0"
        )}
      >
        <div className="px-6 py-8 flex items-center justify-between">
          <Button
            to="/"
            variant="ghost"
            className="p-0 hover:bg-transparent justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dark-blue rounded-xl flex items-center justify-center shadow-lg shadow-dark-blue/20">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-dark-blue tracking-tight">FoundIt</span>
            </div>
          </Button>
          <Button 
            onClick={onClose}
            isIconOnly
            leftIcon={Menu}
            className="text-dark-blue lg:hidden"
          />
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">Main Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.name}
                  to={item.path}
                  variant={isActive ? "primary-blue" : "ghost"}
                  size="md"
                  className={cn(
                    "w-full justify-start gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                    isActive 
                      ? "shadow-lg shadow-dark-blue/20" 
                      : "text-text-secondary hover:text-dark-blue"
                  )}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 flex justify-center flex-shrink-0">
                        <item.icon size={18} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </Button>
              );
            })}
          </div>

          <p className="px-4 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-10 mb-4 opacity-50">Account</p>
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.name}
                  to={item.path}
                  variant={isActive ? "primary-blue" : "ghost"}
                  size="md"
                  className={cn(
                    "w-full justify-start gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                    isActive 
                      ? "shadow-lg shadow-dark-blue/20" 
                      : "text-text-secondary hover:text-dark-blue"
                  )}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 flex justify-center flex-shrink-0">
                        <item.icon size={18} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
