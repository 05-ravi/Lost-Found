import { motion } from 'framer-motion';
import { 
  ShieldCheck, BarChart3, Users, History, 
  ArrowRight, ArrowLeft, Lock, FileText 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-8 bg-white border border-border-custom rounded-[32px] hover:border-dark-blue transition-all group">
    <div className="w-14 h-14 bg-secondary-bg rounded-2xl flex items-center justify-center mb-6 group-hover:bg-dark-blue transition-colors">
      <Icon className="w-7 h-7 text-dark-blue group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-dark-blue mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed text-[15px]">{description}</p>
  </div>
);

const AdminInfo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShieldCheck,
      title: "Item Verification",
      description: "Approve or flag found items across campus to ensure high-quality, verified listings for students."
    },
    {
      icon: BarChart3,
      title: "Campus Analytics",
      description: "Track 'Hot Zones' for lost items and monitor overall recovery success rates for monthly reporting."
    },
    {
      icon: Users,
      title: "Account Moderation",
      description: "Manage student reports, resolve claim disputes, and handle user behavioral flags with a unified dashboard."
    },
    {
      icon: History,
      title: "Full Audit Trail",
      description: "Complete logs of every handover, claim, and message thread for accountability and security purposes."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-6">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-dark-blue transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Portal
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-blue/5 text-dark-blue rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8">
                <Lock className="w-3.5 h-3.5" /> Staff Only
              </div>
              <h1 className="text-[56px] md:text-[72px] font-black text-dark-blue tracking-tighter leading-[0.95] mb-8">
                Administrative <br />
                <span className="text-text-secondary/30">Governance.</span>
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed mb-12 max-w-[500px]">
                The centralized command center for VJIT campus security and administrative oversight of the recovery ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button to="/login" variant="primary" size="lg" className="w-full sm:w-auto h-16 px-10 gap-3">
                  Admin Login <ArrowRight className="w-5 h-5" />
                </Button>
                <Button to="/support" variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10">
                  Request Access
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="w-[120%] aspect-square bg-secondary-bg rounded-[60px] absolute -top-20 -right-20 -z-10 rotate-12" />
              <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-border-custom relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border-custom">
                  <div className="w-12 h-12 bg-dark-blue rounded-xl flex items-center justify-center text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-secondary uppercase">Draft Dashboard</div>
                    <div className="text-lg font-black text-dark-blue tracking-tight hover:text-red-500 cursor-pointer">Security Overview v4.2</div>
                  </div>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-secondary-bg rounded-full w-full relative overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-dark-blue/10 to-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-secondary-bg py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20 text-center max-w-[600px] mx-auto">
            <h2 className="text-4xl font-black text-dark-blue tracking-tight mb-4">Enterprise Moderation</h2>
            <p className="text-text-secondary">A robust set of tools designed to keep the campus community safe, verified, and efficient.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-32 px-6 text-center">
        <div className="max-w-[700px] mx-auto">
          <div className="w-20 h-20 bg-dark-blue rounded-3xl flex items-center justify-center text-white mx-auto mb-10 shadow-xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-5xl font-black text-dark-blue tracking-tight mb-8 leading-tight">
            Empowering Campus <br />
            Security Excellence.
          </h2>
          <p className="text-lg text-text-secondary mb-12">
            Are you a faculty member or campus coordinator? Join the task force to help maintain the integrity of our lost and found network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/support" variant="primary" size="lg" className="h-16 px-12">Contact Registrar</Button>
            <Button to="/" variant="ghost" size="lg" className="h-16 px-12">Learn More</Button>
          </div>
        </div>
      </div>

      {/* Footer mimic */}
      <div className="border-t border-border-custom py-10 text-center text-text-secondary text-sm font-bold uppercase tracking-widest">
        VJIT Administrative Services Internal Portal
      </div>
    </div>
  );
};

export default AdminInfo;
