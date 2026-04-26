import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ChevronDown, LayoutDashboard, SearchCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicStats } from '../api/reportsApi';
import useAuthStore from '../store/authStore';

const StatCounter = ({ end, label, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    if (end === 0) {
      setCount(0);
      return;
    }

    const timer = setTimeout(() => {
      const handle = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(handle);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(handle);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, delay]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-[32px] md:text-[40px] font-bold text-white leading-none">
        {count.toLocaleString()}+
      </div>
      <div className="text-[12px] md:text-[13px] text-white/50 font-normal mt-2 uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
};

const Hero = () => {
  const { isAuthenticated } = useAuthStore();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalLost: 0, totalFound: 0, totalResolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getPublicStats();
        // Assuming response structure is { data: { totalLost, totalFound, totalResolved } } 
        // because axiosInstance.js has interceptor that returns response.data
        if (response.data) {
          setStats(response.data);
        } else {
          setStats(response); // Fallback if data is directly in response
        }
      } catch (error) {
        console.error('Failed to fetch public stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section id="home" className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center pt-[68px]">
      
      {/* BACKGROUND LAYERS */}
      
      {/* Layer 1: Noise Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Layer 2: Top Right Glow */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white rounded-full blur-[200px] opacity-[0.07] pointer-events-none"
      />

      {/* Layer 3: Bottom Left Glow */}
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[160px] opacity-[0.06] pointer-events-none"
      />

      {/* Layer 4: Grid Lines */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 30 }}
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), 
                           linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Layer 5: Floating Shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute top-[10%] right-[15%] w-32 h-32 border border-white opacity-[0.05] pointer-events-none rounded-2xl"
      />
      
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute top-[65%] right-[25%] w-[80px] h-[80px] border border-white rounded-full opacity-[0.05] pointer-events-none"
      />

      {/* CONTENT */}
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 max-w-[1000px] w-full px-6 flex flex-col items-center text-center"
      >
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="px-5 py-2 border border-white/20 rounded-full text-[12px] md:text-[13px] font-semibold text-white tracking-[0.15em] uppercase mb-10 bg-white/5 backdrop-blur-sm"
        >
          Campus Lost & Found Hub
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col gap-3 mb-10">
          {["Lost Something?", "We'll Help You", "Find It Back."].map((text, i) => (
            <motion.h1
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4 + (i * 0.15), duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-white text-[48px] md:text-[84px] font-[800] leading-[1.05] tracking-[-0.03em] relative w-fit mx-auto"
            >
              {text}
              {i === 2 && (
                <svg className="absolute -bottom-4 left-0 w-full" height="15" viewBox="0 0 400 15" fill="none">
                  <motion.path
                    d="M2 12C80 3 160 14 240 8C320 2 398 13 398 6"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
                  />
                </svg>
              )}
            </motion.h1>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-white/60 text-[16px] md:text-[20px] leading-[1.7] max-w-[640px] mb-12"
        >
          The official collegiate platform to reconnect you with your misplaced belongings. Fast, secure, and AI-powered.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-5 mb-14 w-full sm:w-auto"
        >
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:bg-[#F5F5F5] hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Access Dashboard
              </Link>
              <Link
                to="/items-feed"
                className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <SearchCode className="w-5 h-5" />
                View Item Feed
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/report-lost"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:bg-[#F5F5F5] hover:scale-105 active:scale-95 transition-all text-center"
              >
                Report Lost Item
              </Link>
              <Link
                to="/items-feed"
                className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-center"
              >
                Browse Found Items
              </Link>
            </>
          )}
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="w-full max-w-[640px] h-16 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl flex items-center px-5 group focus-within:bg-white/15 focus-within:border-white/40 focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.08)] transition-all"
        >
          <Search className="w-5 h-5 text-white opacity-50 mr-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for lost keys, wallets, or electronics..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base md:text-lg"
          />
          <button type="submit" className="bg-white text-black px-6 py-2 rounded-xl text-[14px] font-bold hover:bg-[#F5F5F5] transition-all ml-2">
            Search
          </button>
        </motion.form>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="flex items-center gap-12 md:gap-24 mt-20"
        >
          <StatCounter end={stats.totalLost} label="Lost" delay={2.0} />
          <div className="w-[1px] h-12 bg-white/20" />
          <StatCounter end={stats.totalFound} label="Found" delay={2.2} />
          <div className="w-[1px] h-12 bg-white/20" />
          <StatCounter end={stats.totalResolved} label="Reunited" delay={2.4} />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ opacity: [0.5, 0.2, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="text-white/30 text-[11px] uppercase tracking-[0.3em] font-bold">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-6 h-6 text-white opacity-40" />
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
