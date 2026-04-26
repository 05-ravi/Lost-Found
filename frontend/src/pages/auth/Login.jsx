import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const schema = z.object({
  email: z.string().regex(/^[A-Z0-9]{10}@vjit\.ac\.in$/i, 'Please use your institutional email (rollno@vjit.ac.in)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await login(data.email, data.password);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Decoration */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-dark-blue text-white relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FoundIt</span>
          </Link>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Connecting lost items <br /> with their owners.
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            The smart way to find what you've lost on campus. AI-powered matching and real-time alerts.
          </p>
        </div>

        <div className="z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl max-w-sm">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
            ))}
          </div>
          <p className="text-sm italic text-white/80">
            "I found my keys within 10 minutes of posting! The AI matching is actually magic."
          </p>
          <p className="text-xs font-bold mt-3 text-white">— Sarah M., Sophomore</p>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-medium-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-red-cta/10 rounded-full blur-3xl" />
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
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
            <h2 className="text-3xl font-bold text-dark-blue mb-2 text-center">Welcome Back</h2>
            <p className="text-text-secondary mb-8 text-center">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <div>
              <label className="block text-sm font-semibold text-dark-blue mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="rollno@vjit.ac.in"
                  className={`w-full pl-12 pr-4 py-3 bg-secondary-bg border ${errors.email ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-cta">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-dark-blue">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-medium-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-secondary-bg border ${errors.password ? 'border-red-cta' : 'border-transparent'} rounded-xl outline-none focus:bg-white focus:border-medium-blue transition-all`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <Button
                    isIconOnly
                    variant="ghost"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-secondary"
                    leftIcon={showPassword ? EyeOff : Eye}
                  />
                </div>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-cta">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              variant="primary-blue"
              size="full"
              rightIcon={ArrowRight}
              className="font-bold"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-dark-blue hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
