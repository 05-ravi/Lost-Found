import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';
import { getCategoryIcon } from '../utils/getCategoryIcon';
import { getStatusColor } from '../utils/getStatusColor';
import { fixLocalImageUrl } from '../utils/urlFixer';

const ItemCard = ({ item }) => {
  const CategoryIcon = getCategoryIcon(item.category);
  const status = getStatusColor(item.status);
  const isLost = item.type === 'lost';

  const badgeKey = item.relevance?.matchLevel;
  let badgeColors = "bg-dark-blue text-white";
  if (badgeKey === 'perfect') badgeColors = "bg-red-cta text-white";
  if (badgeKey === 'possible') badgeColors = "bg-yellow-500 text-white";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="bg-white border border-border-custom rounded-[2rem] overflow-hidden transition-all duration-500 group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] flex flex-col h-full"
    >
      <Link to={`/items/${item._id}`}>
        <div className="relative h-64 bg-secondary-bg overflow-hidden whitespace-nowrap">
          {item.photos?.[0]?.url ? (
            <img 
              src={fixLocalImageUrl(item.photos[0].url)} 
              alt={item.title} 
              className="w-full h-full object-contain transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-blue-50/30">
              <CategoryIcon className="w-20 h-20 text-dark-blue/10" />
            </div>
          )}
          
          <div className="absolute top-5 left-5">
            <div className="bg-white/80 backdrop-blur-xl px-4 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-white/40">
              <CategoryIcon className="w-3.5 h-3.5 text-dark-blue" />
              <span className="text-[10px] font-bold text-dark-blue uppercase tracking-wider">{item.category}</span>
            </div>
          </div>

          <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
            <div className={` ${status.bg} ${status.text} px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20`}>
                {status.label}
            </div>
            {item.relevance && (
                <div className={`px-3 py-1 rounded-full border border-white/20 ${badgeColors} shadow-sm`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {badgeKey} Match
                    </span>
                </div>
            )}
          </div>
        </div>
      </Link>

      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-[#f97316]' : 'bg-[#10b981]'}`} />
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{item.type}</span>
        </div>
        
        <h3 className="text-xl font-bold text-dark-blue line-clamp-1 mb-2 group-hover:text-black transition-colors">
            {item.title}
        </h3>
        
        <p className="text-sm text-text-secondary line-clamp-2 mb-6 leading-relaxed font-medium opacity-80">
          {item.description}
        </p>

        {/* Relevance Bar */}
        {item.relevance && (
            <div className="mt-auto pt-4 mb-6">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Relevance</span>
                    <span className="text-[10px] font-bold text-dark-blue">{item.relevance.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary-bg rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${badgeKey === 'perfect' ? 'bg-red-cta' : (badgeKey === 'possible' ? 'bg-yellow-500' : 'bg-dark-blue')}`}
                        style={{ width: `${Math.min(item.relevance.score, 100)}%` }}
                    />
                </div>
            </div>
        )}

        <div className="flex items-center justify-between pt-5 border-t border-[#f1f1f1] mt-auto">
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="p-1.5 bg-[#f8f9fa] rounded-lg">
              <MapPin className="w-3.5 h-3.5 opacity-70" />
            </div>
            <span className="text-[11px] font-bold tracking-tight truncate max-w-[120px]">{item.location?.text}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="p-1.5 bg-[#f8f9fa] rounded-lg">
              <Clock className="w-3.5 h-3.5 opacity-70" />
            </div>
            <span className="text-[11px] font-bold tracking-tight">{formatDate(item.dateOccurred)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
