import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, Search, MapPin, 
  Settings, Trash2, CheckCircle, 
  ExternalLink, MoreVertical, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import * as reportsApi from '../../api/reportsApi';
import { formatDate } from '../../utils/formatDate';
import { getStatusColor } from '../../utils/getStatusColor';
import { fixLocalImageUrl } from '../../utils/urlFixer';
import Button from '../../components/ui/Button';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setIsLoading(true);
    try {
      const res = await reportsApi.getMyReports();
      setReports(res.data);
    } catch (error) {
      toast.error('Could not fetch items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
        try {
            await reportsApi.deleteReport(id);
            setReports(reports.filter(r => r._id !== id));
            toast.success('Report deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    }
  };

  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(r => r.type === activeTab);

  const stats = {
    total: reports.length,
    lost: reports.filter(r => r.type === 'lost').length,
    found: reports.filter(r => r.type === 'found').length
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-blue">My Reports</h1>
          <p className="text-text-secondary mt-1">Manage and track your active lost & found items.</p>
        </div>
        
        <div className="flex bg-white border border-border-custom rounded-2xl p-1 shadow-sm">
           {[
             { id: 'all', label: 'All Items', count: stats.total },
             { id: 'lost', label: 'Lost', count: stats.lost },
             { id: 'found', label: 'Found', count: stats.found }
           ].map(tab => (
             <Button
                key={tab.id}
                variant={activeTab === tab.id ? "primary-blue" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                size="sm"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${activeTab === tab.id ? 'shadow-lg shadow-dark-blue/20' : 'text-text-secondary hover:bg-secondary-bg'}
                `}
             >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-secondary-bg text-text-secondary'}`}>
                    {tab.count}
                </span>
             </Button>
           ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
               <div key={i} className="h-64 bg-white border border-border-custom rounded-[32px] animate-pulse" />
           ))}
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredReports.map((report) => {
             const status = getStatusColor(report.status);
             return (
               <motion.div 
                 layout
                 key={report._id}
                 className="bg-white border border-border-custom rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl transition-all"
               >
                  <div className="relative h-40 overflow-hidden">
                    {report.photos?.[0]?.url ? (
                        <img src={fixLocalImageUrl(report.photos[0].url)} className="w-full h-full object-contain transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full bg-secondary-bg flex items-center justify-center">
                            <ClipboardList className="w-12 h-12 text-text-secondary opacity-10" />
                        </div>
                    )}
                    <div className={`absolute top-4 left-4 flex gap-2`}>
                        <div className={`px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase text-dark-blue shadow-sm shadow-black/10`}>
                            {report.type}
                        </div>
                        <div className={`px-3 py-1 ${status.bg} ${status.text} rounded-xl text-[10px] font-black uppercase shadow-sm shadow-black/10`}>
                            {status.label}
                        </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-dark-blue truncate mb-2">{report.title}</h3>
                    <div className="flex items-center gap-3 text-text-secondary text-[10px] mb-6">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{report.location.text}</span>
                        <div className="w-1 h-1 rounded-full bg-border-custom" />
                        <div className="flex items-center gap-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>{formatDate(report.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-border-custom/50">
                        {report.type === 'lost' && report.status === 'published' && (
                            <Button 
                                to={`/items-feed?mode=found&category=${report.category}&search=${report.location?.text || ''}`}
                                variant="outlined-blue"
                                size="sm"
                                leftIcon={Search}
                                className="w-full font-bold rounded-xl mb-1"
                            >
                                View Relevant Found Items
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button 
                                to={`/items/${report._id}`}
                                variant="ghost"
                                size="sm"
                                rightIcon={ExternalLink}
                                className="flex-1 bg-secondary-bg text-dark-blue font-bold rounded-xl"
                            >
                                View
                            </Button>
                            <Button 
                                onClick={() => handleDelete(report._id)}
                                variant="ghost"
                                isIconOnly
                                leftIcon={Trash2}
                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                            />
                        </div>
                    </div>
                  </div>
               </motion.div>
             );
           })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-border-custom rounded-[40px] py-32 text-center">
           <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-10 h-10 text-text-secondary opacity-30" />
           </div>
           <h3 className="text-xl font-bold text-dark-blue">No reports found</h3>
           <p className="text-text-secondary mt-2 text-sm italic">You haven't posted any lost or found items yet.</p>
           <div className="mt-8 flex justify-center gap-4">
              <Button to="/report-lost" variant="outlined-blue" className="px-6 py-3 font-bold rounded-2xl">Report Lost</Button>
              <Button to="/report-found" variant="primary-blue" className="px-6 py-3 font-bold rounded-2xl shadow-lg shadow-dark-blue/20">Report Found</Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
