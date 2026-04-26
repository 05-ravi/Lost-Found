import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  MapPin, Clock, User, ArrowLeft, 
  Share2, Flag, ShieldCheck, CheckCircle2,
  Calendar, Info, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import * as reportsApi from '../../api/reportsApi';
import { formatDate } from '../../utils/formatDate';
import { getCategoryIcon } from '../../utils/getCategoryIcon';
import { getStatusColor } from '../../utils/getStatusColor';
import useAuthStore from '../../store/authStore';
import { fixLocalImageUrl } from '../../utils/urlFixer';
import Button from '../../components/ui/Button';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { state } = useLocation();
  const relevance = state?.relevance;
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await reportsApi.getReportById(id);
        setItem(res.data);
      } catch (error) {
        toast.error('Item not found');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (isLoading || !item) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-blue"></div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(item.category);
  const status = getStatusColor(item.status);
  const isOwner = user?._id === item.reportedBy?._id;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={ArrowLeft}
          className="font-bold text-text-secondary hover:text-dark-blue"
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="ghost"
            isIconOnly
            className="p-2.5 bg-white border border-border-custom rounded-xl"
            leftIcon={Share2}
          />
          <Button 
            variant="ghost"
            isIconOnly
            className="p-2.5 bg-white border border-border-custom rounded-xl hover:text-red-cta"
            leftIcon={Flag}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Media */}
        <div className="space-y-6">
          <div className="relative aspect-[4/3] bg-secondary-bg rounded-[40px] overflow-hidden group shadow-2xl shadow-dark-blue/5">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activePhoto}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={fixLocalImageUrl(item.photos?.[activePhoto]?.url) || 'https://via.placeholder.com/600x450?text=No+Photo+Available'} 
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>
            
            {item.photos?.length > 1 && (
              <>
                <Button 
                  isIconOnly
                  variant="ghost"
                  onClick={() => setActivePhoto(curr => (curr === 0 ? item.photos.length - 1 : curr - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100"
                  leftIcon={ChevronLeft}
                />
                <Button 
                  isIconOnly
                  variant="ghost"
                  onClick={() => setActivePhoto(curr => (curr === item.photos.length - 1 ? 0 : curr + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100"
                  leftIcon={ChevronRight}
                />
              </>
            )}

            <div className={`absolute top-6 left-6 ${status.bg} ${status.text} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-white/20`}>
              {status.label}
            </div>
          </div>

          {item.photos?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {item.photos.map((photo, i) => (
                <Button 
                  key={i}
                  variant="ghost"
                  onClick={() => setActivePhoto(i)}
                  className={`w-20 h-20 p-0 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0
                    ${activePhoto === i ? 'border-medium-blue scale-105 shadow-lg shadow-medium-blue/20' : 'border-transparent opacity-60 hover:opacity-100'}
                  `}
                >
                  <img src={fixLocalImageUrl(photo.url)} className="w-full h-full object-contain" />
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="space-y-8 py-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${item.type === 'lost' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                {item.type} Item
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-custom" />
              <div className="flex items-center gap-1.5 text-text-secondary">
                <CategoryIcon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">{item.category}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-dark-blue mb-4 leading-tight">{item.title}</h1>
            <p className="text-text-secondary leading-relaxed bg-secondary-bg/50 p-6 rounded-3xl border border-border-custom italic">
              "{item.description}"
            </p>

            {relevance && (
              <div className="bg-secondary-bg border-l-[3px] border-dark-blue p-5 rounded-r-2xl mt-6 space-y-3">
                <p className="text-xs font-bold text-dark-blue mb-2">Why this item was shown to you:</p>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-dark-blue flex-shrink-0" />
                  <p className="text-sm font-medium text-dark-blue truncate">Category matches your lost {item.category} report</p>
                </div>
                
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-dark-blue flex-shrink-0" />
                   <p className="text-sm font-medium text-dark-blue truncate">Found locally near {item.location?.text?.split(',')[0]} where you lost your item</p>
                </div>
                
                <div className="pt-3 mt-3 border-t border-dark-blue/10 flex items-center gap-2">
                  <span className="text-sm font-bold text-dark-blue">Match Score:</span>
                  <span className="text-xl font-bold text-red-cta">{relevance.score}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 pb-8 border-b border-border-custom">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-medium-blue rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Location</p>
                <p className="text-sm font-bold text-dark-blue truncate max-w-[150px]">{item.location?.text}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-medium-blue rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Date Reported</p>
                <p className="text-sm font-bold text-dark-blue">{formatDate(item.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-white border border-border-custom rounded-[32px]">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-secondary-bg rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                 {item.reportedBy?.avatar ? (
                     <img src={item.reportedBy.avatar} className="w-full h-full object-cover" />
                 ) : (
                     <User className="w-6 h-6 text-text-secondary" />
                 )}
               </div>
               <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase">Reported By</p>
                  <p className="text-sm font-bold text-dark-blue">{item.reportedBy?.name}</p>
               </div>
            </div>
            <Button 
              to={`/profile/${item.reportedBy?._id}`} 
              variant="ghost" 
              size="sm" 
              className="text-medium-blue font-bold px-4 hover:bg-secondary-bg rounded-xl"
            >
                View Profile
            </Button>
          </div>

          <div className="pt-4">
            {isOwner ? (
                <div className="grid grid-cols-2 gap-4">
                    <Button 
                        onClick={() => navigate(`/report-${item.type === 'lost' ? 'lost' : 'found'}/${item._id}/edit`)}
                        variant="outlined-blue"
                        size="lg"
                        className="w-full font-bold rounded-2xl"
                    >
                        Edit Report
                    </Button>
                    <Button 
                        onClick={() => reportsApi.resolveReport(item._id).then(() => navigate('/dashboard'))}
                        variant="primary-blue"
                        size="lg"
                        leftIcon={CheckCircle2}
                        className="w-full font-bold rounded-2xl shadow-lg shadow-dark-blue/20"
                    >
                        Mark as Resolved
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                   {item.type === 'found' ? (
                       <Button 
                           to={`/claims/request/${item._id}`}
                           variant="primary-blue"
                           size="lg"
                           leftIcon={ShieldCheck}
                           className="w-full font-bold rounded-2xl shadow-lg shadow-dark-blue/20"
                       >
                           Claim This Item
                       </Button>
                   ) : (
                       <Button 
                         onClick={() => navigate('/report-found')}
                         variant="primary-blue"
                         size="lg"
                         leftIcon={Info}
                         className="w-full font-bold rounded-2xl shadow-lg shadow-dark-blue/20"
                       >
                           I Have Found This
                       </Button>
                   )}
                   <p className="text-[10px] text-center text-text-secondary px-12">
                       All information exchanged is protected. Providing false claims is against campus policy.
                   </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
