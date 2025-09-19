import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconBgClass?: string; // Optional class for icon background
  valueClass?: string; // Optional class for value text
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    color: string;
    icon: LucideIcon;
  };
  secondaryValue?: string; // Optional secondary value like percentage
  description?: string; // Optional description text
  ariaLabel?: string;
  onClick?: () => void;
  highlight?: boolean; // Optional highlight for important stats
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconBgClass,
  valueClass,
  trend,
  secondaryValue,
  description,
  ariaLabel,
  onClick,
  highlight = false
}) => {
  // Card hover animation variations
  const hoverAnimation = onClick ? { scale: 1.02, y: -4 } : { y: -4 };
  
  return (
    <motion.div
      whileHover={hoverAnimation}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={`relative bg-slate-800/90 rounded-xl p-6 backdrop-blur-sm border ${highlight ? 'border-blue-500/40' : 'border-slate-700/50'} shadow-lg hover:shadow-xl ${onClick ? 'cursor-pointer' : ''} transition-all duration-200`}
      role={onClick ? "button" : "region"}
      aria-label={ariaLabel || `${title} statistics: ${value}`}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {highlight && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider font-medium text-slate-400/80 mb-1">{title}</div>
          <div className="flex items-end gap-2">
            <div className={`text-2xl font-bold ${valueClass || 'text-white'}`}>{value}</div>
            {secondaryValue && (
              <div className="text-sm font-medium text-slate-400/70 mb-0.5">{secondaryValue}</div>
            )}
          </div>
          {description && (
            <div className="text-xs text-slate-400/60 mt-1">{description}</div>
          )}
        </div>
        
        <div className={`${iconBgClass || iconBgColor} flex items-center justify-center rounded-lg p-3 shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium pt-3 border-t border-slate-700/30">
          <trend.icon className={`w-3.5 h-3.5 ${trend.color}`} />
          <span className={trend.color}>{trend.value}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;