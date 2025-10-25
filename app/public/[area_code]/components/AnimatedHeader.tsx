// app/public/[area_code]/components/AnimatedHeader.tsx
'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface AnimatedHeaderProps {
  logoUrl: string | null;
  customerName: string;
  introText: string;
  brandColor: string;
}

export function AnimatedHeader({
  logoUrl,
  customerName,
  introText,
  brandColor,
}: AnimatedHeaderProps) {
  // Get initials for fallback
  const initials = customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full border-b shadow-sm"
      style={{ backgroundColor: brandColor }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo or Fallback */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${customerName} logo`}
                className="h-16 sm:h-20 w-auto object-contain"
              />
            ) : (
              <div
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {initials}
              </div>
            )}
          </motion.div>

          {/* Company Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
              {customerName}
            </h1>
          </motion.div>

          {/* Intro Text */}
          {introText && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed"
            >
              {introText}
            </motion.p>
          )}
        </div>
      </div>
    </motion.header>
  );
}