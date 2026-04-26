import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Check, X, 
  ArrowRight, ShieldCheck, 
  HelpCircle, Sparkles, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import * as matchesApi from '../../api/matchesApi';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const MyMatches = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const res = await matchesApi.getMyMatches();
      setMatches(res.data);
    } catch (error) {
      toast.error('Could not fetch matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
        await matchesApi.dismissMatch(id);
        setMatches(matches.filter(m => m._id !== id));
        toast.success('Match dismissed');
    } catch (error) {
        toast.error('Failed to dismiss');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Flame className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-3xl font-bold text-dark-blue">Smart Matches</h1>
          </div>
          <p className="text-text-secondary">Our AI has found these potential connections between reports.</p>
        </div>
        
        <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-medium-blue" />
           <span className="text-xs font-bold text-medium-blue uppercase tracking-widest">{matches.length} matches found</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
           {[1, 2].map(i => (
               <div key={i} className="h-48 bg-white border border-border-custom rounded-[32px] animate-pulse" />
           ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6">
           {matches.map((match) => (
             <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               key={match._id}
               className="bg-white border border-border-custom rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all relative group"
             >
                <div className="grid grid-cols-1 md:grid-cols-11 items-stretch">
                    {/* Lost side */}
                    <div className="md:col-span-5 p-8 flex flex-col justify-between h-full">
                        <div>
                            <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest bg-orange-50 px-2 py-1 rounded-lg">Lost Item</span>
                            <h3 className="text-xl font-bold text-dark-blue mt-4">{match.lostReport?.title}</h3>
                            <p className="text-xs text-text-secondary mt-2 line-clamp-2 italic">"{match.lostReport?.description}"</p>
                        </div>
                        <div className="mt-8 pt-4 border-t border-secondary-bg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-secondary-bg overflow-hidden border border-white">
                                    <img src={match.lostReport?.reportedBy?.avatar} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold text-dark-blue">{match.lostReport?.reportedBy?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Match Score Divider */}
                    <div className="md:col-span-1 bg-secondary-bg/50 border-x border-border-custom/50 flex flex-col items-center justify-center p-4 min-h-[100px]">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-orange-500 shadow-lg shadow-orange-500/20 text-orange-600">
                             <Flame className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-dark-blue uppercase mt-3 tracking-tighter">{Math.round(match.score * 100)}%</p>
                        <p className="text-[8px] font-bold text-text-secondary uppercase">Match</p>
                    </div>

                    {/* Found side */}
                    <div className="md:col-span-11 md:col-span-5 p-8 flex flex-col justify-between h-full bg-blue-50/20">
                        <div>
                            <span className="text-[10px] font-black uppercase text-medium-blue tracking-widest bg-blue-100 px-2 py-1 rounded-lg">Found Item</span>
                            <h3 className="text-xl font-bold text-dark-blue mt-4">{match.foundReport?.title}</h3>
                            <p className="text-xs text-text-secondary mt-2 line-clamp-2 italic">"{match.foundReport?.description}"</p>
                        </div>
                        <div className="mt-8 pt-4 border-t border-border-custom/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-border-custom">
                                    <img src={match.foundReport?.reportedBy?.avatar} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold text-dark-blue">{match.foundReport?.reportedBy?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-dark-blue/90 to-transparent flex items-center justify-center gap-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button 
                        onClick={() => handleDismiss(match._id)}
                        variant="ghost"
                        size="sm"
                        leftIcon={X}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl"
                    >
                        Not a match
                    </Button>
                    <Button 
                        to={`/claims/request/${match.foundReport?._id}`}
                        variant="ghost"
                        size="sm"
                        leftIcon={ShieldCheck}
                        className="bg-white text-dark-blue font-bold rounded-xl shadow-xl hover:scale-105 transition-all"
                    >
                        This is mine!
                    </Button>
                    <Button 
                        variant="ghost"
                        isIconOnly
                        leftIcon={MessageSquare}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl"
                    />
                </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-border-custom rounded-[40px] py-40 text-center">
            <p className="text-text-secondary text-sm italic">No automated matches found at the moment.</p>
            <p className="text-xs text-text-secondary/50 mt-1">Our AI checks all new reports every few minutes.</p>
        </div>
      )}
    </div>
  );
};

export default MyMatches;
