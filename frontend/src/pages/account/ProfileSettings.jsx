import { useState } from 'react';
import { 
  User, Mail, Hash, Shield, 
  Camera, Lock, LogOut, Loader2,
  CheckCircle, Globe, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';

const ProfileSettings = () => {
  const { user, clearAuth } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Basic Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Real implementation would call userService.updateProfile
    setTimeout(() => {
        setIsSaving(false);
        toast.success('Settings updated successfully');
    }, 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-blue">Account Settings</h1>
        <p className="text-text-secondary mt-1">Manage your identity and preference on the platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2">
            {tabs.map(tab => (
                <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "primary-blue" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    leftIcon={tab.icon}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all
                        ${activeTab === tab.id ? 'shadow-lg shadow-dark-blue/20' : 'bg-white border border-border-custom text-text-secondary hover:bg-secondary-bg'}
                    `}
                >
                    {tab.label}
                </Button>
            ))}
            <Button 
                variant="ghost"
                onClick={() => {
                   if(window.confirm('Sign out?')) clearAuth();
                }}
                leftIcon={LogOut}
                className="mt-4 font-bold text-red-cta hover:bg-red-50 rounded-2xl"
            >
                Sign Out
            </Button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
             <form onSubmit={handleSave} className="bg-white border border-border-custom rounded-[40px] p-8 shadow-sm space-y-8">
                {activeTab === 'profile' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-secondary-bg flex items-center justify-center">
                                     {user?.avatar ? (
                                         <img src={user.avatar} className="w-full h-full object-cover" />
                                     ) : (
                                         <User className="w-12 h-12 text-text-secondary" />
                                     )}
                                </div>
                                <Button 
                                  type="button" 
                                  variant="primary-blue"
                                  isIconOnly
                                  leftIcon={Camera}
                                  className="absolute bottom-1 right-1 p-2 border-4 border-white shadow-lg rounded-full"
                                />
                            </div>
                            <p className="mt-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Profile Picture</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-blue uppercase ml-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                    <input 
                                        type="text" 
                                        defaultValue={user?.name} 
                                        className="w-full pl-12 pr-4 py-4 bg-secondary-bg rounded-2xl outline-none focus:bg-white focus:border-medium-blue border border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-blue uppercase ml-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-50" />
                                    <input 
                                        type="email" 
                                        disabled 
                                        value={user?.email} 
                                        className="w-full pl-12 pr-4 py-4 bg-secondary-bg/50 rounded-2xl border border-transparent opacity-60 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-dark-blue uppercase ml-2">College ID</label>
                             <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-50" />
                                <input 
                                    type="text" 
                                    disabled 
                                    value={user?.collegeId} 
                                    className="w-full pl-12 pr-4 py-4 bg-secondary-bg/50 rounded-2xl border border-transparent opacity-60 cursor-not-allowed"
                                />
                             </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex gap-4">
                            <Shield className="w-6 h-6 text-orange-600" />
                            <div>
                                <p className="text-sm font-bold text-dark-blue">Account Integrity</p>
                                <p className="text-xs text-text-secondary mt-1">Keep your credentials updated to prevent unauthorized claims made in your name.</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border-custom/50">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-blue uppercase ml-2">Current Password</label>
                                <input type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-blue uppercase ml-2">New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-secondary-bg border border-transparent rounded-2xl outline-none focus:bg-white focus:border-medium-blue transition-all" />
                             </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'notifications' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {[
                          { id: 'match', label: 'AI Match Alerts', desc: 'Notify me when the AI finds a potential match.' },
                          { id: 'claim', label: 'Claim Updates', desc: 'Alert me about new or updated claims on my reports.' },
                          { id: 'marketing', label: 'Emails', desc: 'Receive campus activity summaries via email.' },
                        ].map(item => (
                            <label key={item.id} className="flex items-center justify-between p-4 hover:bg-secondary-bg rounded-2xl cursor-pointer transition-all">
                                <div>
                                    <p className="text-sm font-bold text-dark-blue">{item.label}</p>
                                    <p className="text-[10px] text-text-secondary">{item.desc}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 accent-dark-blue" />
                            </label>
                        ))}
                    </motion.div>
                )}

                <div className="pt-8 border-t border-border-custom/50 flex justify-end">
                    <Button
                        type="submit"
                        loading={isSaving}
                        variant="primary-blue"
                        size="lg"
                        rightIcon={CheckCircle}
                        className="px-10 font-bold rounded-2xl shadow-lg shadow-dark-blue/20"
                    >
                        Save Changes
                    </Button>
                </div>
             </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
