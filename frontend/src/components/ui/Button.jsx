import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Button = ({
  variant = 'primary-blue',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  children,
  to,
  className,
  type = 'button',
  isIconOnly = false,
  destructive = false,
  ...props
}) => {
  const isLink = Boolean(to);
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary-red':
        return 'bg-red-cta text-white shadow-button';
      case 'primary-blue':
        return 'bg-dark-blue text-white shadow-card-default';
      case 'outlined-blue':
        return 'bg-transparent border border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white';
      case 'outlined-red':
        return 'bg-transparent border border-red-cta text-red-cta hover:bg-red-cta hover:text-white';
      case 'ghost':
        return 'bg-transparent text-text-primary hover:bg-secondary-bg';
      default:
        return 'bg-dark-blue text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3.5 text-[13px] rounded-lg';
      case 'lg':
        return 'h-11 px-6 text-base rounded-btn';
      case 'full':
        return 'w-full h-11 px-6 text-[15px] rounded-btn justify-center';
      default: // md
        return 'h-10 px-5 text-sm rounded-btn';
    }
  };

  const iconSize = size === 'sm' ? 14 : 18;

  const content = (
    <div className={cn(
      "flex items-center gap-2 h-full w-full",
      className?.includes('justify-start') ? "justify-start" : "justify-center"
    )}>
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-custom shrink-0" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon size={iconSize} className="shrink-0" />}
          {children}
          {RightIcon && <RightIcon size={iconSize} className="shrink-0" />}
        </>
      )}
    </div>
  );

  const buttonClasses = cn(
    'inline-flex items-center transition-all duration-150 relative overflow-hidden font-medium cursor-pointer select-none',
    getVariantStyles(),
    getSizeStyles(),
    isDisabled && 'opacity-45 cursor-not-allowed filter grayscale-[20%] pointer-events-none',
    !isDisabled && 'hover:brightness-90 active:scale-95',
    isIconOnly && 'p-2 rounded-full aspect-square',
    className
  );

  const motionProps = {
    whileHover: !isDisabled ? { scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } : {},
    whileTap: !isDisabled ? { scale: 0.97, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } : {},
    transition: { duration: 0.15 },
  };

  // Special handling for Icon Button hover logic as requested
  const iconButtonContent = (
    <motion.div
      className={cn(
        "p-2 rounded-full transition-all duration-300 flex items-center justify-center",
        destructive ? "text-red-cta hover:bg-red-50 hover:text-red-cta" : "text-text-secondary hover:bg-secondary-bg hover:text-dark-blue",
        isDisabled && "opacity-45 pointer-events-none grayscale-[20%]",
        className
      )}
      whileHover={!isDisabled ? { scale: 1.1, backgroundColor: destructive ? 'rgba(254,226,226,0.8)' : 'rgba(240,244,255,1)' } : {}}
      whileTap={!isDisabled ? { scale: 0.9 } : {}}
    >
      {children || (LeftIcon && <LeftIcon size={iconSize * 1.2} />)}
    </motion.div>
  );

  if (isIconOnly) {
    if (isLink) {
      return (
        <Link to={to} className="contents" {...props}>
          {iconButtonContent}
        </Link>
      );
    }
    return (
      <button
        type={type}
        className="contents"
        onClick={onClick}
        disabled={isDisabled}
        {...props}
      >
        {iconButtonContent}
      </button>
    );
  }

  if (isLink) {
    return (
      <Link to={to} className="contents" {...props}>
        <motion.div className={cn(buttonClasses, "flex items-center", !className?.includes('justify-') && "justify-center")} {...motionProps}>
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;
