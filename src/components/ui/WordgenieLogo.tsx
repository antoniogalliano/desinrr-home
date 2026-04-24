'use client';

import { motion } from 'framer-motion';

interface WordgenieLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-2xl' },
  lg: { icon: 36, text: 'text-3xl' },
};

export function WordgenieLogo({ size = 'md', className = '' }: WordgenieLogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <SparkleIcon size={config.icon} />
      </motion.div>
      <span className={`font-bold gradient-text ${config.text}`}>
        Wordgenie Pro
      </span>
    </div>
  );
}

function SparkleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
        fill="url(#sparkle-gradient)"
      />
      <path
        d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
        fill="url(#sparkle-gradient)"
        opacity="0.3"
        transform="scale(0.5) translate(12, 12)"
      />
    </svg>
  );
}
