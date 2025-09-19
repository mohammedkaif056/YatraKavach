import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`
        fixed z-50 
        bottom-4 right-4 
        sm:bottom-6 sm:right-6 
        md:bottom-8 md:right-8
        ${className}
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: 2, 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      style={{
        // Ensure it doesn't interfere with page content
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 2rem)'
      }}
    >
      {children}
    </motion.div>
  );
};

export default ResponsiveWrapper;