import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex bg-white border border-border-custom rounded-2xl p-1 shadow-sm w-fit", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              isActive ? "text-white" : "text-text-secondary hover:bg-secondary-bg"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-dark-blue rounded-xl -z-0 shadow-lg shadow-dark-blue/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <tab.icon size={18} />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[10px]",
                  isActive ? "bg-white/20 text-white" : "bg-secondary-bg text-text-secondary"
                )}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
