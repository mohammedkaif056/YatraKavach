import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Zap, 
  Users, 
  Verified,
  TrendingUp
} from 'lucide-react';

interface StatItem {
  id: string;
  icon: typeof Users; // Lucide icon type
  number: string;
  label: string;
  color: string;
  bgColor: string;
  glowColor: string;
  description?: string;
}

interface StatCardProps {
  stat: StatItem;
  index: number;
  inView: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, inView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = stat.icon;

  return (
    <motion.div
      className={`group relative p-6 rounded-2xl backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 ${stat.bgColor} overflow-hidden cursor-pointer`}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        boxShadow: isHovered ? `0 20px 40px ${stat.glowColor}` : '0 8px 25px rgba(0,0,0,0.1)'
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role="region"
      aria-label={`Statistic: ${stat.label}`}
      tabIndex={0}
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"
        animate={{ 
          opacity: isHovered ? 0.8 : 0.4,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${stat.color}`}
        style={{
          background: `radial-gradient(circle at center, ${stat.glowColor}, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <motion.div
          className={`p-4 rounded-xl ${stat.color} shadow-lg`}
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ 
            duration: 0.6,
            rotate: { duration: 0.8 }
          }}
        >
          <IconComponent 
            className="w-8 h-8 text-white" 
            aria-hidden="true"
          />
        </motion.div>

        {/* Number */}
        <motion.div
          className="space-y-2"
          animate={{
            y: isHovered ? -2 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
            {stat.number}
          </h3>
          
          {/* Label */}
          <p className="text-white/90 font-medium text-sm md:text-base leading-relaxed">
            {stat.label}
          </p>
        </motion.div>

        {/* Verified Badge */}
        <motion.div
          className="flex items-center gap-1 text-emerald-300 text-xs font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: (index * 0.2) + 0.8 }}
        >
          <Verified className="w-4 h-4" aria-hidden="true" />
          <span>Verified</span>
        </motion.div>
      </div>

      {/* Tooltip */}
      {stat.description && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 pointer-events-none"
          initial={{ y: 10, opacity: 0 }}
          animate={{ 
            y: isHovered ? 0 : 10, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          {stat.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

const StatsSection: React.FC = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const stats: StatItem[] = [
    {
      id: 'travelers',
      icon: Users,
      number: '50,000+',
      label: 'Travelers Protected Daily',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      description: 'Active travelers using our safety platform every day'
    },
    {
      id: 'districts',
      icon: MapPin,
      number: '30+',
      label: 'Districts & Growing',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      description: 'Geographic coverage across India with expanding reach'
    },
    {
      id: 'response',
      icon: Zap,
      number: '<90s',
      label: 'Response Time',
      color: 'bg-gradient-to-br from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      description: 'Average emergency response time across all districts'
    }
  ];

  return (
    <section 
      ref={ref}
      className="relative py-16 md:py-24 overflow-hidden"
      aria-labelledby="stats-title"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Background Patterns */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-500/20 mb-6"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span className="text-emerald-300 font-medium text-sm">Our Impact So Far</span>
          </motion.div>
          
          <h2 
            id="stats-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-display leading-tight"
          >
            Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Nationwide</span>
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Real-time safety metrics demonstrating our commitment to protecting travelers across India
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              inView={inView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <Shield className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Data updated in real-time • Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;