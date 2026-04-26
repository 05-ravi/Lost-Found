import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { UploadCloud, X, PlusCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import ImagePreviewCard from './ImagePreviewCard';
import ImageLightbox from './ImageLightbox';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const ImageUpload = ({ 
  value = [], 
  onChange, 
  maxImages = 3, 
  maxSizeMB = 5,
  existingImages = [] 
}) => {
  const [images, setImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Initialize with value or existing images
  useEffect(() => {
    if (value && value.length > 0 && images.length === 0) {
      setImages(value);
    }
  }, [value]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(err => {
        if (err.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Max size is ${maxSizeMB}MB`);
        } else if (err.code === 'file-invalid-type') {
          toast.error(`${file.name} is not a supported image type`);
        }
      });
    });

    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} photos allowed`);
      acceptedFiles = acceptedFiles.slice(0, maxImages - images.length);
    }

    const newImages = acceptedFiles.map(file => {
      // Check for duplicates
      const isDuplicate = images.some(img => img.name === file.name && img.file?.size === file.size);
      if (isDuplicate) {
        toast.error(`${file.name} is already added`);
        return null;
      }

      return {
        id: nanoid(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: formatFileSize(file.size),
        loaded: false,
        error: false
      };
    }).filter(Boolean);

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onChange(updatedImages);
  }, [images, onChange, maxImages, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxImages - images.length,
    maxSize: maxSizeMB * 1024 * 1024,
    noClick: images.length > 0, // Click only if no images (unless using the 'Add more' button)
    disabled: images.length >= maxImages
  });

  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const handleReorder = (newOrder) => {
    setImages(newOrder);
    onChange(newOrder);
  };

  const isFull = images.length >= maxImages;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {images.length === 0 ? (
          <motion.div
            key="empty-state"
            {...getRootProps()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "border-2 border-dashed rounded-[16px] p-10 transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-white group",
              isDragActive ? "border-dark-blue bg-blue-50/50" : "border-border-custom hover:border-dark-blue/40"
            )}
            whileTap={{ scale: 0.99 }}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-blue-50 text-dark-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <UploadCloud className={cn("w-10 h-10", isDragActive && "animate-bounce")} />
            </motion.div>
            
            <h3 className="text-[17px] font-semibold text-dark-blue font-inter mb-1">
              {isDragActive ? "Drop your photos here!" : "Drag your photos here"}
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              or click to browse from your device
            </p>
            
            <span className="text-[13px] text-text-secondary/60 mb-6 font-medium">
              JPG, PNG, WEBP · Max 3 images · 5MB each
            </span>
            
            <Button
              variant="outlined-blue"
              className="rounded-full px-8 pointer-events-none group-hover:bg-dark-blue group-hover:text-white transition-colors"
            >
              Choose Photos
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="compact-strip"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={cn(
              "h-16 px-6 border-2 border-dashed rounded-2xl flex items-center justify-between transition-all overflow-hidden",
              isFull ? "bg-secondary-bg/50 border-border-custom cursor-not-allowed" : "bg-white border-dark-blue/20 hover:border-dark-blue/40 cursor-default"
            )}
            {...(!isFull ? getRootProps() : {})}
          >
            <input {...getInputProps()} />
            <div className="flex items-center gap-4">
              <UploadCloud className={cn("w-6 h-6 text-dark-blue", !isFull && "animate-pulse")} />
              <div>
                <p className="text-sm font-bold text-dark-blue">
                  {isFull ? "Maximum 3 photos added" : "Add more photos"}
                </p>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                  {images.length} of {maxImages} photos added
                </p>
              </div>
            </div>
            {!isFull && (
              <Button
                variant="ghost"
                size="sm"
                className="text-dark-blue font-bold hover:bg-dark-blue/5 rounded-full px-4"
              >
                Browse
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Grid */}
      {images.length > 0 && (
        <Reorder.Group 
          axis="x" 
          values={images} 
          onReorder={handleReorder}
          className={cn(
            "grid gap-4",
            images.length === 1 && "grid-cols-1",
            images.length === 2 && "grid-cols-2",
            images.length === 3 && "grid-cols-1 md:grid-cols-5 md:grid-rows-2"
          )}
        >
          {images.map((img, index) => {
            let layoutProps = {};
            if (images.length === 3) {
              if (index === 0) layoutProps = { className: "md:col-span-3 md:row-span-2 h-[320px] aspect-auto" };
              else layoutProps = { className: "md:col-span-2 h-[152px] aspect-auto" };
            } else if (images.length === 2) {
              layoutProps = { className: "h-[240px] aspect-auto" };
            } else {
              layoutProps = { className: "h-[320px] aspect-auto" };
            }

            return (
              <Reorder.Item 
                key={img.id} 
                value={img}
                className={layoutProps.className}
              >
                <ImagePreviewCard
                  image={img}
                  index={index}
                  isMain={index === 0}
                  onRemove={removeImage}
                  onView={setLightboxIndex}
                />
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
