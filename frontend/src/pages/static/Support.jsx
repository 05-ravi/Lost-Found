import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Search, HelpCircle, Shield, 
  MapPin, MessageCircle, ArrowLeft, ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-custom last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-dark-blue transition-colors group"
      >
        <span className="text-[17px] font-semibold tracking-tight">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-dark-blue' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-text-secondary leading-relaxed text-[15px]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Support = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('General');

  const categories = ['General', 'Reporting', 'Claims', 'Privacy'];
  
  const faqs = {
    'General': [
      { question: "What is the VJIT Lost & Found Portal?", answer: "The Portal is a centralized infrastructure for students and staff to report, browse, and recover items lost on the university campus. It uses AI to match reports automatically." },
      { question: "Who can use this portal?", answer: "Currently, access is restricted to students and staff with a valid VJIT email address." },
      { question: "Is there any cost involved?", answer: "No, the portal is a free service provided for the benefit of the university community." }
    ],
    'Reporting': [
      { question: "How do I report a lost item?", answer: "Click on 'Report Lost' in your dashboard, fill in the details (category, location, date), and upload clear photos if available. Our AI will instantly scan for matches." },
      { question: "How long is a report kept active?", answer: "Reports stay active for 90 days. After that, they are archived but can be re-activated if the item is still missing." },
      { question: "What should I do if I find an item?", answer: "Report it as 'Found' immediately. If possible, hand over the physical item to the security desk in the Admin Block after reporting it." }
    ],
    'Claims': [
      { question: "How do I claim a found item?", answer: "If you find your item in the browse feed, click 'Claim'. You will be asked to provide a 'Unique Detail' (like a passcode or a specific scratch) that only the owner would know." },
      { question: "What happens after I submit a claim?", answer: "The finder will review your claim. If accepted, you'll be notified via email and in-app message to coordinate a meetup." },
      { question: "What if my claim is rejected?", answer: "Claims are only rejected if the 'Unique Detail' doesn't match or someone else has already provided proof of ownership. You can contact support for secondary verification." }
    ],
    'Privacy': [
      { question: "Is my personal data safe?", answer: "Yes, we only store minimal data necessary for recovery. Your mobile number is only shared with the other party AFTER a claim is accepted." },
      { question: "Can anyone see my lost report?", answer: "By default, lost reports are 'Private.' Only the finder of a matching item will see relevant details. You can choose to make it public if you want more eyes on it." }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-dark-blue text-white py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-medium tracking-wide uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <h1 className="text-[48px] md:text-[64px] font-black tracking-tighter leading-[1.1] mb-6">
            Help <span className="text-white/40">Center</span>
          </h1>
          <p className="text-xl text-white/70 max-w-[600px] leading-relaxed">
            Everything you need to know about navigating the VJIT item recovery ecosystem.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-16">
          
          {/* Sidebar */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.2em]">Categories</h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl transition-all font-semibold ${
                      activeCategory === cat 
                        ? 'bg-secondary-bg text-dark-blue shadow-sm' 
                        : 'text-text-secondary hover:text-dark-blue'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-secondary-bg rounded-[32px] space-y-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <MessageCircle className="w-6 h-6 text-dark-blue" />
              </div>
              <div>
                <h4 className="font-bold text-dark-blue mb-2">Still need help?</h4>
                <p className="text-sm text-text-secondary leading-normal">
                  Our task force is available Mon-Fri, 9am - 5pm.
                </p>
              </div>
              <Button to="/#contact" className="w-full justify-center">Contact Support</Button>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="space-y-12">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search for articles, guides..." 
                className="w-full pl-16 pr-6 h-16 bg-secondary-bg border-2 border-transparent focus:bg-white focus:border-dark-blue rounded-2xl outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-[28px] font-black text-dark-blue mb-8">{activeCategory} Questions</h2>
              <div className="border-t border-border-custom px-2">
                {faqs[activeCategory].map((faq, i) => (
                  <FAQItem key={i} {...faq} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
              <div className="p-8 border-2 border-border-custom rounded-[32px] hover:border-dark-blue transition-all cursor-pointer group">
                <Shield className="w-10 h-10 text-dark-blue mb-6" />
                <h4 className="font-bold text-lg mb-2">Security Guides</h4>
                <p className="text-sm text-text-secondary leading-relaxed">Learn how we verify item ownership and protect your assets.</p>
                <div className="mt-6 flex items-center gap-2 text-dark-blue font-bold text-sm uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all">
                  Read more <ExternalLink className="w-4 h-4" />
                </div>
              </div>
              <div className="p-8 border-2 border-border-custom rounded-[32px] hover:border-dark-blue transition-all cursor-pointer group">
                <MapPin className="w-10 h-10 text-dark-blue mb-6" />
                <h4 className="font-bold text-lg mb-2">Campus Map</h4>
                <p className="text-sm text-text-secondary leading-relaxed">See where the official handover points are located across VJIT.</p>
                <div className="mt-6 flex items-center gap-2 text-dark-blue font-bold text-sm uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all">
                  View map <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;
