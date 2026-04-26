import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const FileDropzone = ({ value = [], onChange, maxFiles = 3 }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // In a real app, you might upload to temporary storage here
    // For this implementation, we just pass the files up
    const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
    onChange(newFiles);
  }, [value, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles
  });

  const removeFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragActive ? 'border-medium-blue bg-blue-50' : 'border-border-custom hover:border-medium-blue hover:bg-secondary-bg'}
        `}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-blue-50 text-medium-blue rounded-2xl flex items-center justify-center mb-4">
          <Upload className="w-8 h-8" />
        </div>
        <p className="text-dark-blue font-bold">Click or drag images here</p>
        <p className="text-text-secondary text-xs mt-1">Upload up to {maxFiles} photos (max 5MB each)</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {value.map((file, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-border-custom group"
            >
              <img 
                src={typeof file === 'string' ? file : URL.createObjectURL(file)} 
                alt="preview" 
                className="w-full h-full object-cover"
              />
              <Button 
                isIconOnly
                variant="primary-red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                leftIcon={X}
                className="absolute top-2 right-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileDropzone;
