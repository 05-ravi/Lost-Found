import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const ImagePreviewCard = ({ image, index, isMain, onRemove, onView, isDragging }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={!isDragging ? { y: -4 } : {}}
      className="relative rounded-[14px] overflow-hidden group border border-border-custom bg-secondary-bg aspect-square"
    >
      {/* Loading Shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-bg via-white/5 to-secondary-bg bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-cta p-4 text-center">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">Failed to load</span>
        </div>
      )}

      {/* Image */}
      <img
        src={image.preview}
        alt={image.name}
        className={cn(
          "w-full h-full object-contain transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Main Photo Badge */}
      {isMain && (
        <div className="absolute top-0 left-0 bg-black/75 text-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider rounded-br-lg z-10 font-inter">
          Main Photo
        </div>
      )}

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => { e.stopPropagation(); onView(index); }}
          className="w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => { e.stopPropagation(); onRemove(image.id); }}
          className="w-8 h-8 bg-black/50 hover:bg-red-cta/85 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-10">
        <div className="flex items-center justify-between gap-4">
          <span className="text-white text-[12px] font-medium truncate flex-1">{image.name}</span>
          <span className="text-white/60 text-[11px] whitespace-nowrap">{image.size}</span>
        </div>
      </div>

      {/* Drag Handle */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePreviewCard;
