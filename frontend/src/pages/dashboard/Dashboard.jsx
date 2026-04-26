import { useState, useEffect } from 'react';
import { 
  Plus, Search, MapPin, 
  Flame, ArrowRight,
  CheckCircle, Clock, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import * as dashboardApi from '../../api/dashboardApi';
// import * as matchesApi from '../../api/matchesApi';
import { formatDate } from '../../utils/formatDate';
import { getCategoryIcon } from '../../utils/getCategoryIcon';
import { fixLocalImageUrl } from '../../utils/urlFixer';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalLost: 0, totalFound: 0, totalResolved: 0, resolutionRate: 0 });
  const [recentReports, setRecentReports] = useState([]);
// const [recentMatches, setRecentMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes/*, matchesRes*/] = await Promise.all([
          dashboardApi.getStats(),
          // matchesApi.getMyMatches()
        ]);
        
        setStats(dashboardRes.data.stats);
        setRecentReports(dashboardRes.data.recentActivity);
        // setRecentMatches(matchesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-dark-blue">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-text-secondary text-sm mt-1">Here's what's happening with your items.</p>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          <Button 
            to="/report-lost"
            variant="primary-blue"
            size="lg"
            leftIcon={Search}
            className="rounded-2xl"
          >
            Lost Something?
          </Button>
          <Button 
            to="/report-found"
            variant="primary-blue"
            size="lg"
            leftIcon={MapPin}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 border-none"
          >
            Found Something?
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: 'Lost Items', count: stats.totalLost, icon: Search, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Found Items', count: stats.totalFound, icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Cases Resolved', count: stats.totalResolved, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)" }}
            className="p-8 bg-white border border-border-custom rounded-[2.5rem] flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all"
          >
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-4xl font-bold tracking-tighter text-dark-blue mt-2">{stat.count}</p>
            </div>
            <div className={`p-5 ${stat.bg} ${stat.color} rounded-2xl`}>
              <stat.icon className="w-7 h-7" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-dark-blue">Recent Activity</h2>
            <Button 
              to="/items-feed?mode=lost" 
              variant="outlined-blue" 
              size="sm" 
              rightIcon={ArrowRight}
              className="font-bold rounded-xl"
            >
              Explore All
            </Button>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-white border border-border-custom rounded-[2rem] animate-pulse" />
              ))
            ) : (
              recentReports.map((report) => {
                const CategoryIcon = getCategoryIcon(report.category);
                return (
                  <motion.div 
                    key={report._id}
                    variants={item}
                    className="group bg-white border border-border-custom rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                  >
                    <div className="relative h-56 bg-secondary-bg overflow-hidden">
                      {report.photos?.[0]?.url ? (
                        <img 
                          src={fixLocalImageUrl(report.photos[0].url)} 
                          alt={report.title} 
                          className="w-full h-full object-contain transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50/30">
                          <CategoryIcon className="w-16 h-16 text-dark-blue/10" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/20 shadow-sm">
                        <CategoryIcon className="w-3 h-3 text-dark-blue" />
                        <span className="text-[10px] font-bold text-dark-blue uppercase tracking-wider">{report.category}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${report.type === 'lost' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{report.type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-dark-blue line-clamp-1 mb-4">{report.title}</h3>
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[80px]">{report.location.text}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(report.dateOccurred)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

        {/* Sidebar: Matches & Notifications */}
        <div className="space-y-8">
          {/* Matches section */}
          {/* Pro Recovery Tips Section */}
          <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-dark-blue">Pro Recovery Tips</h3>
              </div>
              <Button to="/support" variant="ghost" size="sm" className="text-medium-blue font-bold">Help Center</Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Be Ultra-Descriptive",
                  description: "Include brand, unique scratches, or distinct stickers when reporting.",
                  icon: Search
                },
                {
                  title: "Check 'Hot Zones'",
                  description: "Visit the Central Library, Canteen, and Admin Block's security desk.",
                  icon: MapPin
                },
                {
                  title: "Verify Hands-on",
                  description: "Always ask for proof of ownership before finalizing any handover.",
                  icon: CheckCircle
                }
              ].map((tip, i) => (
                <div key={i} className="p-4 bg-secondary-bg rounded-2xl flex gap-4 group transition-all duration-300 border border-transparent hover:border-border-custom shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <tip.icon className="w-5 h-5 text-dark-blue opacity-70" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-dark-blue">{tip.title}</h4>
                    <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              to="/items-feed"
              variant="outlined-blue"
              size="lg"
              className="mt-6 w-full rounded-2xl"
              rightIcon={ArrowRight}
            >
              Browse All Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
