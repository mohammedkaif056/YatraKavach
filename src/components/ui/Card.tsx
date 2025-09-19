import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'gradient';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-soft',
    glass: 'glass-morphism',
    elevated: 'bg-white shadow-large border-0',
    gradient: 'bg-gradient-primary text-white shadow-medium',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      className={cn(
        'rounded-xl p-6 transition-all duration-300',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;