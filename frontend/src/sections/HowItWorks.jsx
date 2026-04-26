import { motion } from 'framer-motion';
import { FileText, GitMerge, HandHelping, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StepCard = ({ number, icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="group relative bg-white border border-[#E5E5E5] rounded-[32px] p-10 text-left overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
    >
      {/* Step Number Watermark */}
      <div className="absolute top-4 right-8 text-[120px] font-extrabold text-black opacity-[0.03] select-none leading-none">
        {number}
      </div>

      {/* Left Accent Line (Hover) */}
      <div className="absolute left-0 top-0 bottom-0 w-0 bg-black transition-all duration-300 group-hover:w-[4px]" />

      {/* Icon */}
      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-10 rotate-3 transition-transform group-hover:rotate-0">
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-[24px] font-[800] text-black mb-4 tracking-tight">{title}</h3>
      <p className="text-[#666666] text-[16px] leading-[1.8] mb-8 font-medium">
        {description}
      </p>

      {/* Link */}
      <button className="flex items-center gap-2 text-[15px] font-bold text-black group/link uppercase tracking-wider">
        Learn more 
        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-2" />
      </button>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Report Your Item",
      description: "Submit a detailed report with category, location, and photos within minutes using our intuitive interface."
    },
    {
      number: "02",
      icon: GitMerge,
      title: "AI Finds a Match",
      description: "Our proprietary algorithm cross-references every report to find the highest probability matches for you."
    },
    {
      number: "03",
      icon: HandHelping,
      title: "Get Reunited",
      description: "Coordinate with the finder through our secure platform and collect your item from designated campus spots."
    }
  ];

  return (
    <section id="how-it-works" className="py-[120px] bg-[#F9F9F9]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="inline-block px-5 py-1.5 bg-black/5 border border-black/10 rounded-full text-[12px] font-bold text-black uppercase tracking-[0.2em] mb-8">
            The Process
          </div>
          <h2 className="text-[48px] md:text-[56px] font-[800] text-black leading-[1.1] tracking-[-0.03em] mb-6">
            Three Simple Steps <br className="hidden md:block" />
            to Reclaim What's Yours
          </h2>
          <p className="text-[#777777] text-[18px] md:text-[20px] max-w-[600px] mx-auto">
            We've streamlined the Lost & Found experience to be as frictionless as possible for the campus community.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>

        {/* CTA Strip */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mt-[80px] bg-black rounded-[40px] p-12 md:p-[72px] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
        >
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="text-center lg:text-left relative z-10">
            <h3 className="text-[32px] md:text-[40px] font-bold text-white mb-4 tracking-tight">Ready to start the search?</h3>
            <p className="text-white/60 text-[18px] md:text-[20px] max-w-[500px]">Create your campus account today and let's find what you've lost.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto relative z-10">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-12 py-5 bg-white text-black font-[800] rounded-2xl hover:bg-[#F5F5F5] hover:scale-105 active:scale-95 transition-all text-center uppercase tracking-wider text-[14px]"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 hover:border-white transition-all text-center uppercase tracking-wider text-[14px]"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
