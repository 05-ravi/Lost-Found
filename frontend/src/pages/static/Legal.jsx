import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Copy, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Legal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('privacy');

  const content = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "April 12, 2026",
      sections: [
        {
          title: "1. Information We Collect",
          text: "We collect information you provide directly to us, such as your VJIT roll number, email address, and profile details. We also collect item descriptions, locations, and photos uploaded for lost and found reports."
        },
        {
          title: "2. How We Use Information",
          text: "Information is used solely for facilitating item recovery. Your VJIT email is used for critical notifications. Item data is processed by our AI to find matches. We do not sell your personal data to third parties."
        },
        {
          title: "3. Information Sharing",
          text: "Your contact information (name/email/phone) is hidden by default. It is only shared with another student once a claim has been verified and accepted by both parties."
        },
        {
          title: "4. Data Security",
          text: "We implement multi-layered security protocols to protect your information. Item photos are stored on secure cloud servers with restricted access."
        }
      ]
    },
    terms: {
      title: "Terms of Use",
      lastUpdated: "April 12, 2026",
      sections: [
        {
          title: "1. Acceptance of Terms",
          text: "By accessing the VJIT Lost & Found Portal, you agree to comply with these terms and our Academic Integrity Handbook."
        },
        {
          title: "2. Code of Conduct",
          text: "Users must provide accurate information. Reporting fake items, submitting fraudulent claims, or harassing other users will result in immediate suspension and disciplinary action by the Dean of Students."
        },
        {
          title: "3. Liability",
          text: "The University provides this portal as a tool but does not take legal responsibility for the physical condition, loss, or theft of items listed. Handover of items is done at the users' own discretion."
        },
        {
          title: "4. Handover Rules",
          text: "For safety, we recommend all handovers occur at designated campus security desks or public 'Safe Zones' during daylight hours."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-secondary-bg">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-border-custom px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-secondary-bg flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-dark-blue" />
          </button>
          <div className="flex bg-secondary-bg p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'privacy' ? 'bg-white text-dark-blue shadow-sm' : 'text-text-secondary'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'terms' ? 'bg-white text-dark-blue shadow-sm' : 'text-text-secondary'
              }`}
            >
              Terms of Use
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-dark-blue px-4 py-2 transition-all">
            <Copy className="w-4 h-4" /> Copy Link
          </button>
          <button className="flex items-center gap-2 text-sm font-bold bg-dark-blue text-white px-5 py-2.5 rounded-xl hover:bg-dark-blue/90 transition-all shadow-lg">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[40px] p-10 md:p-16 shadow-xl border border-border-custom"
        >
          <div className="mb-12">
            <div className="text-[12px] font-bold text-dark-blue uppercase tracking-widest mb-4">Documentation</div>
            <h1 className="text-[40px] font-black text-dark-blue leading-tight mb-4">{content[activeTab].title}</h1>
            <p className="text-text-secondary text-sm font-medium italic">Last updated: {content[activeTab].lastUpdated}</p>
          </div>

          <div className="space-y-12">
            {content[activeTab].sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-[20px] font-bold text-dark-blue tracking-tight">{section.title}</h3>
                <p className="text-text-secondary leading-relaxed text-[16px]">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 bg-secondary-bg rounded-3xl flex items-center justify-between gap-8 border-2 border-dashed border-border-custom">
            <div>
              <h4 className="font-bold text-dark-blue mb-1">Agreement</h4>
              <p className="text-sm text-text-secondary">By using the portal, you consent to these policies.</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <Check className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center text-text-secondary text-sm">
          Questions about our legal framework? <a href="/support" className="text-dark-blue font-bold hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default Legal;
