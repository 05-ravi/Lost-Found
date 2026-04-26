import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

const ImageLightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const handlePrev = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () => setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));

  const currentImage = images[currentIndex];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.preview}
          alt={currentImage.name}
          className="w-full h-full object-contain rounded-xl"
        />

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-sm font-medium">{currentImage.name}</span>
            <span className="text-white/60 text-xs">({currentImage.size})</span>
            {currentIndex === 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                Main Photo
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'bg-white w-6' : 'bg-white/30 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ImageLightbox;
