import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Mail, Lock, User, Hash, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().regex(/^[A-Z0-9]{10}@vjit\.ac\.in$/i, 'Email must be in format rollno@vjit.ac.in (e.g., 23911A35B4@vjit.ac.in)'),
  collegeId: z.string().min(3, 'College ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { register: signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        collegeId: data.collegeId,
        password: data.password
      });
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Right Form (Moved to left for variety) */}
      <div className="flex items-center justify-center p-8 order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          {/* Logo */}
          <Link to="/" className="mb-8">
            <img 
              src="https://ik.imagekit.io/syustaging/SYU_PREPROD/Logo_fhak3ZVHd9.webp" 
              alt="VJIT Logo" 
              className="h-20 w-auto object-contain"
            />
          </Link>

          <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-dark-blue mb-2">Create Account</h2>
            <p className="text-text-secondary mb-8">Join your campus lost & found network</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-semibold text-dark-blue mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-secondary-bg border ${errors.name ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-cta">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-blue mb-1">College Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Rollno@vjit.ac.in"
                  className={`w-full pl-12 pr-4 py-3 bg-secondary-bg border ${errors.email ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-cta">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-blue mb-1">College ID</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  {...register('collegeId')}
                  type="text"
                  placeholder="2024-ABC-123"
                  className={`w-full pl-12 pr-4 py-3 bg-secondary-bg border ${errors.collegeId ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                />
              </div>
              {errors.collegeId && <p className="mt-1 text-xs text-red-cta">{errors.collegeId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-blue mb-1">Password</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                   <input
                     {...register('password')}
                     type={showPassword ? "text" : "password"}
                     placeholder="••••••••"
                     className={`w-full pl-12 pr-12 py-3 bg-secondary-bg border ${errors.password ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                   />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                     <Button
                       type="button"
                       variant="ghost"
                       isIconOnly
                       onClick={() => setShowPassword(!showPassword)}
                       className="text-text-secondary"
                       leftIcon={showPassword ? EyeOff : Eye}
                     />
                   </div>
                 </div>
                {errors.password && <p className="mt-1 text-xs text-red-cta">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-blue mb-1">Confirm</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                   <input
                     {...register('confirmPassword')}
                     type={showConfirmPassword ? "text" : "password"}
                     placeholder="••••••••"
                     className={`w-full pl-12 pr-12 py-3 bg-secondary-bg border ${errors.confirmPassword ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                   />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                     <Button
                       type="button"
                       variant="ghost"
                       isIconOnly
                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       className="text-text-secondary"
                       leftIcon={showConfirmPassword ? EyeOff : Eye}
                     />
                   </div>
                 </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-cta">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              variant="primary-blue"
              size="full"
              rightIcon={ArrowRight}
              className="font-bold shadow-lg shadow-dark-blue/20"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-dark-blue hover:underline">
              Log in instead
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Left Decoration */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-dark-blue text-white relative overflow-hidden order-1 lg:order-2">
        <div className="z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FoundIt</span>
          </Link>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join thousands of <br /> campus users.
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Verified student accounts ensure a safe and trustworthy environment for exchanging lost property.
          </p>
        </div>

        <div className="z-10 flex gap-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-xl flex-1">
            <p className="text-2xl font-bold">5k+</p>
            <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Reports Resolved</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-xl flex-1">
            <p className="text-2xl font-bold">98%</p>
            <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Match Accuracy</p>
          </div>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-red-cta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-medium-blue/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Register;
