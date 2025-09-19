import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Clock, Shield, Users, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';

interface StatsOverviewProps {
  stats: {
    totalTourists?: number;
    activeTourists?: number;
    safetyScore?: number;
    incidentsResolved?: number;
    averageResponseTime?: number;
    activeCases?: number;
    recentIncidents?: number;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  // Define container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  // Define item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
            <p className="text-slate-400 text-xs">September 19, 2025</p>
          </div>
        </div>
        
        <Link 
          to="/police/analytics"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full 
            bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-100 
            transition-all duration-200 font-medium"
        >
          View Analytics
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Safety Score"
            value={`${stats.safetyScore || 96.5}%`}
            icon={Shield}
            iconBgColor="bg-emerald-600"
            iconBgClass="bg-gradient-to-br from-emerald-500 to-emerald-700"
            valueClass="text-emerald-400"
            secondaryValue="Protected"
            trend={{
              direction: 'up',
              value: '+2.3% this week',
              color: 'text-emerald-400',
              icon: TrendingUp
            }}
            highlight={true}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Response Time"
            value={`${stats.averageResponseTime || 1.8}m`}
            icon={Clock}
            iconBgColor="bg-blue-600"
            iconBgClass="bg-gradient-to-br from-blue-500 to-blue-700"
            valueClass="text-blue-400"
            description="Average emergency response"
            trend={{
              direction: 'down',
              value: '-14% from last month',
              color: 'text-emerald-400',
              icon: TrendingDown
            }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Active Tourists"
            value={stats.activeTourists || 267}
            secondaryValue={`of ${stats.totalTourists || 284} total`}
            icon={Users}
            iconBgColor="bg-violet-600"
            iconBgClass="bg-gradient-to-br from-violet-500 to-purple-700"
            valueClass="text-white"
            trend={{
              direction: 'up',
              value: '+15 in last hour',
              color: 'text-blue-400',
              icon: TrendingUp
            }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Active Alerts"
            value={stats.activeCases || 13}
            secondaryValue="requiring attention"
            icon={AlertTriangle}
            iconBgColor="bg-amber-600"
            iconBgClass="bg-gradient-to-br from-amber-500 to-amber-700"
            valueClass="text-amber-400"
            trend={{
              direction: 'down',
              value: '-4 from yesterday',
              color: 'text-emerald-400',
              icon: TrendingDown
            }}
            onClick={() => console.log('View alerts')}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StatsOverview;