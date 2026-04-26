import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, LogOut, Settings, User 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const Navbar = ({ onMenuClick }) => {
  const { user, clearAuth } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="h-16 bg-white border-b border-border-custom px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* <div className="text-dark-blue font-black text-xl tracking-tighter">
          LOST<span className="text-red-cta">&</span>FOUND
        </div> */}
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <form onSubmit={handleSearchSubmit} className="relative w-full group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..." 
            className="w-full px-4 py-2 bg-secondary-bg border border-transparent focus:border-dark-blue focus:bg-white outline-none rounded-xl text-sm transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <Button 
            to="/notifications" 
            isIconOnly 
            leftIcon={Bell} 
            className="text-text-primary"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-cta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white pointer-events-none">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="relative">
          <Button
            isIconOnly
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-1"
          >
            <div className="w-8 h-8 rounded-full bg-medium-blue/10 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-dark-blue" />
              )}
            </div>
          </Button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border-custom bg-secondary-bg/50">
                    <p className="text-sm font-semibold text-dark-blue truncate">{user?.name}</p>
                    <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                  </div>
                  
                  <div className="p-1 space-y-1">
                    <Button
                      to="/profile"
                      variant="ghost"
                      size="md"
                      className="w-full justify-start font-normal"
                      leftIcon={User}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      View Profile
                    </Button>
                    <Button
                      to="/profile"
                      variant="ghost"
                      size="md"
                      className="w-full justify-start font-normal"
                      leftIcon={Settings}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      destructive
                      className="w-full justify-start font-normal"
                      leftIcon={LogOut}
                      onClick={() => {
                        clearAuth();
                        setShowProfileMenu(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
