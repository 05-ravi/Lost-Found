import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, ShieldCheck, HelpCircle, 
  Send, Loader2, Image as ImageIcon,
  MapPin, Clock, FileText, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import * as reportsApi from '../../api/reportsApi';
import * as claimsApi from '../../api/claimsApi';
import { fixLocalImageUrl } from '../../utils/urlFixer';
import FileDropzone from '../../components/FileDropzone';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';

const schema = z.object({
  uniqueDetail: z.string().min(10, 'Please provide more detail (min 10 characters)'),
  dateLost: z.string().optional(),
  locationLost: z.string().optional(),
  message: z.string().optional(),
  proofPhoto: z.array(z.any()).optional(),
});

const ClaimRequest = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await reportsApi.getReportById(reportId);
        setItem(res.data);
      } catch (error) {
        toast.error('Item not found');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [reportId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('reportId', reportId);
      formData.append('uniqueDetail', data.uniqueDetail);
      if (data.dateLost) formData.append('dateLost', data.dateLost);
      if (data.locationLost) formData.append('locationLost', data.locationLost);
      if (data.message) formData.append('message', data.message);
      if (data.proofPhoto && data.proofPhoto[0]) {
        formData.append('proofPhoto', data.proofPhoto[0]);
      }

      await claimsApi.submitClaim(formData);
      toast.success('Claim submitted successfully!');
      navigate('/claims/tracking');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !item) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <Button 
          to={`/items/${reportId}`} 
          variant="ghost" 
          size="sm" 
          leftIcon={ArrowLeft}
          className="font-bold text-text-secondary hover:text-dark-blue mb-4"
        >
          Back to Item
        </Button>
        <h1 className="text-3xl font-bold text-dark-blue">Submit Claim</h1>
        <p className="text-text-secondary">Verify your ownership to the finder.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item Summary Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white border border-border-custom rounded-[32px] overflow-hidden shadow-sm">
             <div className="h-60 bg-secondary-bg overflow-hidden relative">
                <img src={fixLocalImageUrl(item.photos?.[0]?.url)} alt="item" className="w-full h-full object-contain" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
                <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-bold text-medium-blue uppercase tracking-widest bg-white/80 px-2 py-1 rounded-lg">Found Item</span>
                </div>
             </div>
             <div className="p-6">
                <h3 className="font-bold text-dark-blue text-lg mb-4">{item.title}</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{item.location?.text}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Found {formatDate(item.dateOccurred)}</span>
                    </div>
                </div>
             </div>
           </div>

           <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex gap-4">
              <ShieldCheck className="w-6 h-6 text-medium-blue flex-shrink-0" />
              <div>
                 <p className="text-sm font-bold text-dark-blue">Trustworthy Campus</p>
                 <p className="text-xs text-text-secondary mt-1">Your details are only shared with the finder. Administrators keep a log of all claims to prevent fraud.</p>
              </div>
           </div>
        </div>

        {/* Claim Form */}
        <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border-custom rounded-[32px] p-8 shadow-sm space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-dark-blue" />
                        <label className="block text-sm font-bold text-dark-blue">Provide a unique detail</label>
                    </div>
                    <p className="text-xs text-text-secondary">What's something only the owner would know? (e.g. wallpaper color, specific scratches, specific apps on home screen, contents of bag)</p>
                    <textarea 
                        {...register('uniqueDetail')}
                        rows={4}
                        placeholder="Describe the unique identifier..."
                        className={`w-full px-6 py-4 bg-secondary-bg border ${errors.uniqueDetail ? 'border-red-cta' : 'border-transparent'} rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue`}
                    />
                    {errors.uniqueDetail && <p className="text-xs text-red-cta font-medium">{errors.uniqueDetail.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-dark-blue">When was it lost?</label>
                        <input 
                            {...register('dateLost')}
                            type="date"
                            className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-dark-blue">Where was it lost?</label>
                        <input 
                            {...register('locationLost')}
                            type="text"
                            placeholder="e.g. Near Library main gate"
                            className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-dark-blue" />
                        <label className="block text-sm font-bold text-dark-blue">Upload Identification Proof (Optional)</label>
                    </div>
                    <p className="text-xs text-text-secondary">A photo of a matching ID, a bill, or another photo of you with the item.</p>
                    <Controller
                        name="proofPhoto"
                        control={control}
                        render={({ field }) => (
                            <FileDropzone value={field.value} onChange={field.onChange} maxFiles={1} />
                        )}
                    />
                </div>

                <div className="space-y-4 pt-4">
                   <label className="block text-sm font-bold text-dark-blue">Message for Finder</label>
                   <textarea 
                        {...register('message')}
                        rows={3}
                        placeholder="Hi! I think this belongs to me. Let me know when you can meet..."
                        className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue"
                   />
                </div>

                <div className="pt-6">
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        variant="primary-blue"
                        size="lg"
                        rightIcon={Send}
                        className="w-full font-bold rounded-2xl shadow-lg shadow-dark-blue/20"
                    >
                        Submit Ownership Claim
                    </Button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Finder will be notified instantly</span>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimRequest;
