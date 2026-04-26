import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, GitMerge, CheckCircle2 } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-[120px] bg-white overflow-hidden" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <div className="w-fit px-5 py-1.5 border-2 border-black rounded-full text-[12px] font-bold text-black tracking-[0.2em] uppercase mb-8">
            Our Mission
          </div>
          
          <h2 className="text-[48px] md:text-[64px] font-[800] text-black leading-[1.05] tracking-[-0.03em] mb-10">
            Reconnecting You <br />
            with Your World.
          </h2>

          <div className="space-y-8 mb-12">
            <p className="text-[#444444] text-[18px] md:text-[20px] leading-[1.8] max-w-[540px]">
              Lost & Found Portal is the specialized digital hub for campus discovery and recovery. We leverage intelligent matching to bridge the gap between finders and owners.
            </p>
            <p className="text-[#666666] text-[16px] md:text-[18px] leading-[1.8] max-w-[540px]">
              Whether it's a forgotten student ID in the library or a wallet left in the cafeteria, our platform ensures a secure and rapid reunification process.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-10 md:gap-16">
            <div className="pl-6 border-l-[4px] border-black">
              <div className="text-[36px] font-[800] text-black leading-none mb-2">95%</div>
              <div className="text-[14px] text-[#888888] font-bold uppercase tracking-widest">Match Accuracy</div>
            </div>
            <div className="pl-6 border-l-[4px] border-black">
              <div className="text-[36px] font-[800] text-black leading-none mb-2">&lt; 24h</div>
              <div className="text-[14px] text-[#888888] font-bold uppercase tracking-widest">Resolution Time</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visual Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="bg-black rounded-[40px] p-12 md:p-20 aspect-square md:aspect-auto md:h-[600px] flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
            
            {/* Background Texture (Grid) */}
            <div 
              className="absolute inset-0 opacity-[0.1]" 
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />

            {/* Floating Visual Elements */}
            <div className="relative z-10 w-full flex flex-col items-center gap-16">
              
              {/* Lost Item Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="w-full max-w-[240px] bg-white rounded-2xl p-5 shadow-[0_20px_60px_rgba(255,255,255,0.1)] self-start -ml-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-black">Blue Wallet</div>
                    <div className="text-[12px] text-black/40">Lost • Library</div>
                  </div>
                </div>
              </motion.div>

              {/* Connection Line */}
              <div className="relative w-full h-[80px]">
                <svg className="w-full h-full" viewBox="0 0 400 80" fill="none">
                  <motion.path
                    d="M60 40 Q 200 -20, 340 40"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    initial={{ strokeDashoffset: 160 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                  />
                  <motion.circle
                    r="6"
                    fill="white"
                    animate={{ 
                      offsetDistance: ["0%", "100%"],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    style={{ 
                      offsetPath: "path('M60 40 Q 200 -20, 340 40')",
                    }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center shadow-xl">
                   <GitMerge className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Found Item Card */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="w-full max-w-[240px] bg-white rounded-2xl p-5 shadow-[0_20px_60px_rgba(255,255,255,0.1)] self-end -mr-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-black">Identified Match</div>
                    <div className="text-[12px] text-black/40">Ready for pickup</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
