import { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, XCircle, 
  MessageSquare, User, ExternalLink,
  ShieldCheck, Package, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import * as claimsApi from '../../api/claimsApi';
import { formatDate } from '../../utils/formatDate';
import { getStatusColor } from '../../utils/getStatusColor';
import { fixLocalImageUrl } from '../../utils/urlFixer';
import Button from '../../components/ui/Button';

const ClaimTracking = () => {
  const [myClaims, setMyClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sent');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const [myRes, recRes] = await Promise.all([
        claimsApi.getMyClaims(),
        claimsApi.getReceivedClaims()
      ]);
      setMyClaims(myRes.data);
      setReceivedClaims(recRes.data);
    } catch (error) {
      toast.error('Could not fetch claims');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await claimsApi.acceptClaim(id);
      toast.success('Claim accepted!');
      fetchClaims();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await claimsApi.rejectClaim(id, { reason: 'Incorrect details provided' });
      toast.success('Claim rejected');
      fetchClaims();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const currentClaims = activeTab === 'sent' ? myClaims : receivedClaims;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-blue">Claim Hub</h1>
        <p className="text-text-secondary mt-1">Track items you've claimed and manage claims you've received.</p>
      </div>

      <div className="flex bg-white border border-border-custom rounded-2xl p-1 shadow-sm w-fit">
        <Button
            onClick={() => setActiveTab('sent')}
            variant={activeTab === 'sent' ? "primary-blue" : "ghost"}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                ${activeTab === 'sent' ? 'shadow-lg shadow-dark-blue/20' : 'text-text-secondary hover:bg-secondary-bg'}
            `}
        >
            Sent Claims
            {myClaims.length > 0 && <span className={activeTab === 'sent' ? "px-2 py-0.5 bg-white/20 rounded-lg text-[10px]" : "px-2 py-0.5 bg-secondary-bg rounded-lg text-[10px]"}>{myClaims.length}</span>}
        </Button>
        <Button
            onClick={() => setActiveTab('received')}
            variant={activeTab === 'received' ? "primary-blue" : "ghost"}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                ${activeTab === 'received' ? 'shadow-lg shadow-dark-blue/20' : 'text-text-secondary hover:bg-secondary-bg'}
            `}
        >
            Received Claims
            {receivedClaims.length > 0 && <span className={activeTab === 'received' ? "px-2 py-0.5 bg-white/20 rounded-lg text-[10px]" : "px-2 py-0.5 bg-secondary-bg rounded-lg text-[10px]"}>{receivedClaims.length}</span>}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
           {[1, 2, 3].map(i => (
               <div key={i} className="h-24 bg-white border border-border-custom rounded-2xl animate-pulse" />
           ))}
        </div>
      ) : currentClaims.length > 0 ? (
        <div className="space-y-4">
           {currentClaims.map((claim) => {
             const status = getStatusColor(claim.status);
             const isReceived = activeTab === 'received';
             const partner = isReceived ? claim.claimedBy : claim.report?.reportedBy;

             return (
               <motion.div 
                 layout
                 key={claim._id}
                 className="bg-white border border-border-custom rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
               >
                  <div className="w-24 h-24 bg-secondary-bg rounded-2xl overflow-hidden flex-shrink-0 border border-border-custom shadow-inner group-hover:shadow-md transition-shadow">
                    <img 
                      src={fixLocalImageUrl(claim.report?.photos?.[0]?.url)} 
                      className="w-full h-full object-contain transition-transform duration-500" 
                      alt="item" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                            {status.label}
                        </span>
                        <span className="text-[10px] font-bold text-text-secondary">• {formatDate(claim.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-dark-blue truncate">{claim.report?.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                                <User className="w-3 h-3 text-medium-blue" />
                            </div>
                            <span className="text-xs font-semibold text-text-secondary">{partner?.name}</span>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {isReceived && claim.status === 'pending' && (
                        <>
                            <Button 
                                onClick={() => handleReject(claim._id)}
                                variant="ghost"
                                size="sm"
                                leftIcon={XCircle}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100"
                            >
                                Reject
                            </Button>
                            <Button 
                                onClick={() => handleAccept(claim._id)}
                                variant="primary-blue"
                                size="sm"
                                leftIcon={CheckCircle}
                                className="flex-1 md:flex-none px-8 py-2.5 font-bold rounded-xl shadow-lg shadow-dark-blue/20"
                            >
                                Accept
                            </Button>
                        </>
                    )}
                    
                    {claim.status === 'accepted' && (
                        <div className="bg-green-50 px-6 py-2.5 rounded-xl border border-green-100 flex items-center gap-2 text-green-700 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            Proof Verified
                        </div>
                    )}

                    <Button 
                        isIconOnly
                        variant="ghost"
                        leftIcon={MessageSquare}
                        className="p-3 bg-secondary-bg text-dark-blue rounded-xl hover:bg-blue-50 border border-border-custom/50"
                    />
                  </div>
               </motion.div>
             );
           })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-border-custom rounded-[40px] py-40 text-center">
            <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-text-secondary opacity-20" />
            </div>
            <p className="text-text-secondary text-sm italic">You don't have any {activeTab} claims yet.</p>
        </div>
      )}
    </div>
  );
};

export default ClaimTracking;
