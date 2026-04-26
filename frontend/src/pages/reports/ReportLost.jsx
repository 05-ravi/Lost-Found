import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, ArrowRight, Check, 
  MapPin, Clock, Camera, FileText,
  Loader2, Sparkles, Hash, Search
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
  photos: z.array(z.any()).max(3, 'Max 3 photos allowed'),
  isPrivate: z.boolean().default(false),
});

const ReportLost = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: '',
      photos: [],
      location: { text: '' },
      isPrivate: false,
    },
    mode: 'onChange'
  });

  const selectedCategory = watch('category');
  const photos = watch('photos');

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
      formData.append('type', 'lost');

      await reportsApi.createReport(formData);
      toast.success('Report published! Our AI is searching for matches...');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
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
    if (step === 3) fields = ['photos']; // Photos are optional, but ensures schema validates max 3 count
    
    const isStepValid = await trigger(fields);
    if (isStepValid) {
      setStep(s => s + 1);
    } else {
      toast.error('Please complete all required fields for this step.');
    }
  };
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { title: 'Basic Info', icon: FileText },
    { title: 'Location & Time', icon: MapPin },
    { title: 'Photos', icon: Camera },
    { title: 'Review', icon: Check },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-dark-blue mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white border border-border-custom rounded-2xl overflow-hidden shadow-sm">
        {/* Progress Bar */}
        <div className="bg-secondary-bg/50 px-8 py-6 border-b border-border-custom">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark-blue">Report Lost Item</h2>
              <p className="text-text-secondary text-sm">Fill in the details to help find your item.</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border-custom -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-dark-blue transition-all duration-500 -z-10" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${step > i + 1 ? 'bg-dark-blue text-white' : (step === i + 1 ? 'bg-dark-blue text-white scale-125' : 'bg-white border-2 border-border-custom text-text-secondary')}
                  `}
                >
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-dark-blue' : 'text-text-secondary'}`}>
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
                  <label className="block text-sm font-bold text-dark-blue">What did you lose?</label>
                  <input
                    {...register('title')}
                    placeholder="e.g. Blue Nike Backpack"
                    className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue"
                  />
                  {errors.title && <p className="text-xs text-red-cta font-medium">{errors.title.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Select Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <Button
                        key={cat.name}
                        type="button"
                        variant="ghost"
                        onClick={() => setValue('category', cat.name)}
                        className={`h-auto p-4 rounded-[24px] border transition-all flex flex-col items-center gap-3
                          ${selectedCategory === cat.name 
                            ? 'bg-dark-blue border-dark-blue text-white shadow-lg' 
                            : 'bg-white border-border-custom text-text-secondary hover:border-medium-blue hover:text-dark-blue'}
                        `}
                      >
                        <cat.icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                      </Button>
                    ))}
                  </div>
                  {errors.category && <p className="text-xs text-red-cta font-medium">{errors.category.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Description</label>
                  <textarea
                    {...register('description')}
                    onBlur={handleDescriptionBlur}
                    rows={4}
                    placeholder="Brand, color, special marks, contents inside..."
                    className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue resize-none"
                  />
                  {errors.description && <p className="text-xs text-red-cta font-medium">{errors.description.message}</p>}
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
                  <label className="block text-sm font-bold text-dark-blue">Where was it lost?</label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <MapPicker value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.location?.text && <p className="text-xs text-red-cta font-medium">{errors.location.text.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">When was it lost?</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      {...register('dateOccurred')}
                      type="date"
                      className="w-full pl-12 pr-4 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all text-dark-blue"
                    />
                  </div>
                  {errors.dateOccurred && <p className="text-xs text-red-cta font-medium">{errors.dateOccurred.message}</p>}
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
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-medium-blue">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-blue text-sm">Visual Search Advantage</h4>
                    <p className="text-xs text-text-secondary mt-1">Our AI can match your items 80% faster if you upload clear reference photos of the item.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-dark-blue">Add Photos (Optional)</label>
                  <Controller
                    name="photos"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload value={field.value} onChange={field.onChange} />
                    )}
                  />
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
                <div className="p-6 bg-secondary-bg rounded-2xl border border-border-custom space-y-6">
                  {photos && photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border-custom bg-white">
                          <img 
                            src={img.preview} 
                            alt="preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-medium-blue uppercase tracking-widest">{selectedCategory}</p>
                      <h3 className="text-xl font-bold text-dark-blue">{watch('title')}</h3>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-border-custom">
                      <Hash className="w-5 h-5 text-dark-blue" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{watch('location.text')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{watch('dateOccurred')}</span>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary line-clamp-3 italic">"{watch('description')}"</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white border border-border-custom rounded-2xl">
                  <input 
                    type="checkbox" 
                    {...register('isPrivate')}
                    className="w-5 h-5 rounded accent-dark-blue"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-dark-blue">Make report private</p>
                    <p className="text-xs text-text-secondary">Only visible to administrators and through AI matches.</p>
                  </div>
                </div>

                <div className="p-6 bg-secondary-bg rounded-2xl flex items-center gap-4 border border-border-custom">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800 font-medium">Ready to submit! Your item will be visible in the campus feed once published.</p>
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
                key="btn-continue"
                type="button"
                onClick={nextStep}
                variant="primary-blue"
                rightIcon={ArrowRight}
                className="px-8 font-bold"
              >
                Continue
              </Button>
            ) : (
              <Button
                key="btn-submit"
                type="submit"
                loading={isSubmitting}
                variant="primary-blue"
                rightIcon={Sparkles}
                className="px-10 font-bold"
              >
                Publish Report
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;
