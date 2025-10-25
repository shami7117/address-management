// app/public/[area_code]/components/AnimatedFooter.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedFooter() {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Check if page is embedded in iframe
    setIsEmbedded(window.self !== window.top);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`w-full bg-white border-t mt-auto ${
        isEmbedded ? 'py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex ${
            isEmbedded ? 'justify-center' : 'flex-col sm:flex-row justify-between'
          } items-center gap-4 text-sm text-gray-600`}
        >
          {/* Brand Section */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <a
              href="https://copark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-900 transition-colors"
            >
              <span className="font-bold text-gray-900">COPARK</span>
              {!isEmbedded && (
                <>
                  <span>·</span>
                  <span>Contact Directory</span>
                </>
              )}
            </a>
          </motion.div>

          {/* Last Updated - Only show if not embedded */}
          {!isEmbedded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-500"
            >
              Powered by COPARK Contact Management
            </motion.div>
          )}
        </div>
      </div>
    </motion.footer>
  );
}