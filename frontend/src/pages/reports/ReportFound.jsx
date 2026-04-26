import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, ArrowRight, Check, 
  MapPin, Clock, Camera, FileText,
  Loader2, Sparkles, Hash, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import Button from '../../components/ui/Button';
import ImageUpload from '../../components/upload/ImageUpload';
import MapPicker from '../../components/MapPicker';
import { categories } from '../../utils/getCategoryIcon';
import * as reportsApi from '../../api/reportsApi';
import { cn } from '../../utils/cn';

const schema = z.object({
  title: z.string().min(3, 'Title is too short'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Please provide a detailed description'),
  dateOccurred: z.string().min(1, 'Date is required'),
  location: z.object({
    text: z.string().min(1, 'Location is required'),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  photos: z.array(z.any()).min(1, 'At least one photo is required for found items'),
  requiresProof: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
});

const ReportFound = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOCRing, setIsOCRing] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: '',
      photos: [],
      location: { text: '' },
      requiresProof: true,
      isPrivate: false,
    },
    mode: 'onChange'
  });

  const selectedCategory = watch('category');
  const photos = watch('photos');

  const handlePhotosChange = async (images) => {
    setValue('photos', images);
    
    // Auto-OCR for found items
    if (images.length > 0 && step === 3) {
      setIsOCRing(true);
      const loadingToast = toast.loading('AI is analyzing image details...');
      
      try {
        const formData = new FormData();
        formData.append('photo', images[0].file);
        
        const res = await reportsApi.analyzeImage(formData);
        const { text, fields } = res.data;
        
        if (text) {
          toast.success('Image analyzed successfully!', { id: loadingToast });
          
          // Smart logic to update fields if they are empty
          const currentDescription = watch('description');
          if (!currentDescription) {
            setValue('description', `Found this item with following text: ${text.substring(0, 100)}...`);
          }
          
          // If we detect specific keywords, suggest category
          if (text.toLowerCase().includes('id card') || text.toLowerCase().includes('license')) {
             setValue('category', 'Documents');
             setValue('title', 'Found Identification Card');
          }
        } else {
          toast.dismiss(loadingToast);
        }
      } catch (error) {
        console.error('OCR failed:', error);
        toast.error('Could not analyze image text.', { id: loadingToast });
      } finally {
        setIsOCRing(false);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'photos') {
          data.photos.forEach(img => formData.append('photos', img.file));
        } else if (key === 'location') {
          formData.append('location', JSON.stringify(data.location));
        } else {
          formData.append(key, data[key]);
        }
      });
      formData.append('type', 'found');

      await reportsApi.createReport(formData);
      toast.success('Found item published! Thanks for being honest.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDescriptionBlur = async (e) => {
    const desc = e.target.value;
    if (desc.trim().length > 10 && !selectedCategory) {
      try {
        const res = await reportsApi.classifyDescription(desc);
        if (res.data.category && res.data.category !== 'Other') {
          setValue('category', res.data.category);
          toast.success(`Suggested category: ${res.data.category}`, {
            icon: '✨'
          });
        }
      } catch (error) {
        console.error('Classification failed:', error);
      }
    }
  };

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ['title', 'category', 'description'];
    if (step === 2) fields = ['location', 'location.text', 'dateOccurred'];
    if (step === 3) fields = ['photos'];
    
    const isStepValid = await trigger(fields);
    if (isStepValid) {
      setStep(s => s + 1);
    } else {
      toast.error('Please complete all required fields for this step.');
    }
  };
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { title: 'Item Info', icon: FileText },
    { title: 'Discovery Details', icon: MapPin },
    { title: 'Photos & OCR', icon: Camera },
    { title: 'Security', icon: Check },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-dark-blue mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white border border-border-custom rounded-2xl overflow-hidden shadow-sm">
        {/* Progress Bar Container */}
        <div className="bg-secondary-bg/50 px-8 py-6 border-b border-border-custom">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark-blue">Report Found Item</h2>
              <p className="text-text-secondary text-sm">Provide details to help the owner identify it.</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-medium-blue rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border-custom -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-medium-blue transition-all duration-500 -z-10" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${step > i + 1 ? 'bg-medium-blue text-white' : (step === i + 1 ? 'bg-medium-blue text-white scale-125' : 'bg-white border-2 border-border-custom text-text-secondary')}
                  `}
                >
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-medium-blue' : 'text-text-secondary'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Item Name</label>
                  <input
                    {...register('title')}
                    placeholder="e.g. Set of Silver Keys with a Lego keychain"
                    className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue"
                  />
                  {errors.title && <p className="text-xs text-red-cta font-medium">{errors.title.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <Button
                        key={cat.name}
                        type="button"
                        variant="ghost"
                        onClick={() => setValue('category', cat.name)}
                        className={`h-auto p-4 rounded-[24px] border transition-all flex flex-col items-center gap-3
                          ${selectedCategory === cat.name 
                            ? 'bg-medium-blue border-medium-blue text-white shadow-lg shadow-medium-blue/20' 
                            : 'bg-white border-border-custom text-text-secondary hover:border-medium-blue hover:text-dark-blue'}
                        `}
                      >
                        <cat.icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Description</label>
                  <textarea
                    {...register('description')}
                    onBlur={handleDescriptionBlur}
                    rows={4}
                    placeholder="Keep it somewhat general so you can ask for proof details from claimants..."
                    className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Found Location</label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <MapPicker value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Found On</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      {...register('dateOccurred')}
                      type="date"
                      className="w-full pl-12 pr-4 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-secondary-bg p-6 rounded-2xl flex gap-4 border border-border-custom">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-blue text-sm">Smart Auto-fill (OCR)</h4>
                    <p className="text-xs text-text-secondary mt-1">If this is a Document or ID card, upload a photo and our AI will automatically extract details for you.</p>
                  </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-dark-blue">Upload Photos</label>
                    <ImageUpload value={photos} onChange={handlePhotosChange} />
                    {isOCRing && (
                         <div className="flex items-center gap-2 text-xs font-bold text-medium-blue animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            AI is analyzing image details...
                        </div>
                    )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-8 border border-border-custom rounded-2xl space-y-8 bg-white">
                    {photos && photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {photos.map((img, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border-custom bg-secondary-bg">
                            <img 
                              src={img.preview} 
                              alt="preview" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-dark-blue">Handover Security</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-secondary-bg rounded-2xl border border-transparent hover:border-medium-blue/30 transition-all cursor-pointer">
                            <input 
                                type="checkbox" 
                                {...register('requiresProof')}
                                className="w-5 h-5 rounded accent-medium-blue"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-dark-blue">Require Identification Proof</p>
                                <p className="text-xs text-text-secondary">Highly recommended. Claimants must provide unique details or proof photos.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-secondary-bg rounded-2xl border border-transparent hover:border-medium-blue/30 transition-all cursor-pointer">
                            <input 
                                type="checkbox" 
                                {...register('isPrivate')}
                                className="w-5 h-5 rounded accent-medium-blue"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-dark-blue">Publish Anonymously</p>
                                <p className="text-xs text-text-secondary">Hide your name and profile from the public feed. Users can still message you.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary-bg p-6 rounded-2xl flex items-center gap-4 border border-border-custom">
                    <div className="p-3 bg-white/10 rounded-xl">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-dark-blue">By publishing, you agree to safely store the item until a verified owner claims it.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-secondary-bg">
            <Button
              variant="ghost"
              onClick={prevStep}
              leftIcon={ArrowLeft}
              className={cn(
                "font-bold",
                step === 1 && "opacity-0 pointer-events-none"
              )}
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button
                key="btn-next"
                type="button"
                onClick={nextStep}
                variant="primary-blue"
                rightIcon={ArrowRight}
                className="px-8 font-bold"
              >
                Next Step
              </Button>
            ) : (
              <Button
                key="btn-complete"
                type="submit"
                loading={isSubmitting}
                variant="primary-blue"
                rightIcon={Sparkles}
                className="px-10 font-bold"
              >
                Complete Report
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
