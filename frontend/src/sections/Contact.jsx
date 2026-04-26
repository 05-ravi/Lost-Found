import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ContactInfoCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ backgroundColor: "#000000", color: "#ffffff", scale: 1.02 }}
    className="group flex items-center gap-6 p-6 md:p-8 bg-white border-2 border-black rounded-[20px] transition-all duration-300 cursor-default shadow-sm hover:shadow-xl"
  >
    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center transition-colors group-hover:bg-white">
      <Icon className="w-6 h-6 text-white transition-colors group-hover:text-black" />
    </div>
    <div>
      <div className="text-[16px] font-bold text-black uppercase tracking-wider group-hover:text-white mb-1">{label}</div>
      <div className="text-[15px] text-[#666666] group-hover:text-white/70 font-medium">{value}</div>
    </div>
  </motion.div>
);

const Contact = () => {
  const [formState, setFormState] = useState('idle'); // idle, loading, success
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey || accessKey.includes('your_')) {
      toast.error('Web3Forms Access Key is missing in .env');
      setFormState('idle');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Campus Lost & Found Support'
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormState('success');
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Web3Forms Error:', error);
      toast.error('Failed to send message. Please try again.');
      setFormState('idle');
    }
  };

  return (
    <section id="contact" className="py-[120px] bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-block px-5 py-1.5 border-2 border-black rounded-full text-[12px] font-bold text-black uppercase tracking-[0.2em] mb-8">
            Get in Touch
          </div>
          <h2 className="text-[48px] md:text-[64px] font-[800] text-black leading-[1.05] tracking-[-0.03em] mb-8">
            Ready to <br />
            Find Your Items?
          </h2>
          <p className="text-[#666666] text-[18px] md:text-[20px] leading-[1.8] mb-12 max-w-[500px]">
            Have an urgent question or need technical support? Our specialized campus task force is here to assist you navigate the portal.
          </p>

          <div className="space-y-6">
            <ContactInfoCard icon={Mail} label="Support Email" value="support@lostfound.edu" />
            <ContactInfoCard icon={MapPin} label="Campus Office" value="Admin Block, Executive Wing — Room 12" />
            <ContactInfoCard icon={Clock} label="Operating Hours" value="Monday – Friday, 9:00 AM – 5:00 PM" />
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, x: 50 }}
           whileInView={{ opacity: 1, scale: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white border-2 border-[#E5E5E5] rounded-[40px] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative min-h-[600px] flex flex-col justify-center transition-all hover:border-black">
            
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
                    className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mb-10 shadow-xl"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-[36px] font-[800] text-black mb-4 tracking-tight">Transmission Received</h3>
                  <p className="text-[#666666] text-[18px] mb-10 max-w-[320px]">Success! Your message has been safely delivered to our support team.</p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="text-black font-extrabold text-[15px] uppercase tracking-widest border-b-2 border-black hover:opacity-50 transition-opacity pb-1"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[13px] font-[800] text-black uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Johnson"
                        className="w-full h-14 bg-white border-2 border-[#E5E5E5] rounded-xl px-5 text-[16px] font-medium outline-none transition-all focus:border-black focus:shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[13px] font-[800] text-black uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@university.edu"
                        className="w-full h-14 bg-white border-2 border-[#E5E5E5] rounded-xl px-5 text-[16px] font-medium outline-none transition-all focus:border-black focus:shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[13px] font-[800] text-black uppercase tracking-widest ml-1">Subject</label>
                    <input
                      required
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is your inquiry about?"
                      className="w-full h-14 bg-white border-2 border-[#E5E5E5] rounded-xl px-5 text-[16px] font-medium outline-none transition-all focus:border-black focus:shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                    />
                  </div>

                  <div className="space-y-3 relative">
                    <label className="text-[13px] font-[800] text-black uppercase tracking-widest ml-1">Your Message</label>
                    <textarea
                      required
                      name="message"
                      placeholder="Please provide details about your situation..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 text-[16px] font-medium outline-none transition-all focus:border-black focus:shadow-[0_8px_20px_rgba(0,0,0,0.05)] resize-none"
                    />
                    <div className="absolute bottom-4 right-6 text-[12px] font-bold text-[#999999] opacity-50">
                      {formData.message.length} / 500
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formState === 'loading'}
                    className="w-full h-16 bg-black text-white font-[800] rounded-2xl flex items-center justify-center gap-3 hover:bg-[#222222] transition-all shadow-xl disabled:opacity-70 uppercase tracking-[0.2em] text-[14px]"
                  >
                    {formState === 'loading' ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Dispatch
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
