import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useAuth from '../hooks/useAuth';

const Navbar = ({ activeSection }) => {
  const { isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[68px] z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-[0_1px_16px_rgba(0,0,0,0.08)] border-b border-[#E5E5E5]' 
          : 'bg-transparent border-none'
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 flex items-center">
        {/* LEFT: LOGO (1/3 weight implicitly) */}
        <div className="flex-1 flex items-center justify-start">
          <a href="#home" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center border border-white/10">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className={`text-[19px] font-bold tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}>
              Lost<span className="font-medium">&</span>Found
            </span>
          </a>
        </div>

        {/* CENTER: NAVIGATION LINKS (1/3 weight) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-[14px] font-semibold transition-all duration-300 py-1 ${
                  isScrolled ? 'text-[#444444]' : 'text-white/80'
                } group`}
              >
                <span className={`transition-colors duration-300 ${
                  isScrolled ? 'group-hover:text-black' : 'group-hover:text-white'
                }`}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2.5px] transition-all duration-300 group-hover:w-full ${
                  activeSection === link.href.slice(1) ? 'w-full' : 'w-0'
                } ${isScrolled ? 'bg-black' : 'bg-white'}`} />
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="nav-dot"
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isScrolled ? 'bg-black' : 'bg-white'
                    }`}
                  />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT: BUTTONS (1/3 weight) */}
        <div className="flex-1 flex items-center justify-end">
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all duration-200 border flex items-center gap-2 ${
                    isScrolled 
                      ? 'border-black text-black hover:bg-black hover:text-white' 
                      : 'border-white/30 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isScrolled 
                      ? 'text-black/60 hover:text-black' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'text-black hover:bg-black/5' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all duration-200 shadow-sm ${
                    isScrolled 
                      ? 'bg-black text-white hover:bg-black/90' 
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden p-2 transition-colors duration-300 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[280px] h-full bg-white z-[120] p-8 shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[18px] font-semibold text-black hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="mt-8 flex flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-3 text-center font-semibold bg-black rounded-lg text-white hover:bg-black/90 transition-all flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-3 text-center font-medium border border-black rounded-lg text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-5 h-5" />
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-3 text-center font-medium border border-black rounded-lg text-black hover:bg-black hover:text-white transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-3 text-center font-semibold bg-black rounded-lg text-white hover:bg-black/90 transition-all"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
