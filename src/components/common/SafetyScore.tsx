import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Brain, Zap, Eye } from 'lucide-react';

interface SafetyScoreProps {
  score: number;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const analysisTimer = setTimeout(() => setIsAnalyzing(false), 2000);
    
    // Animate score counting
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const scoreTimer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(scoreTimer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => {
      clearTimeout(analysisTimer);
      clearInterval(scoreTimer);
    };
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-emerald-500';
    if (score >= 60) return 'text-golden-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-crimson-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-emerald-600';
    if (score >= 75) return 'from-emerald-400 to-emerald-500';
    if (score >= 60) return 'from-golden-500 to-golden-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-crimson-500 to-crimson-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', icon: TrendingUp, color: 'emerald' };
    if (score >= 75) return { label: 'Very Good', icon: TrendingUp, color: 'emerald' };
    if (score >= 60) return { label: 'Good', icon: TrendingUp, color: 'golden' };
    if (score >= 40) return { label: 'Caution', icon: TrendingDown, color: 'orange' };
    return { label: 'High Risk', icon: TrendingDown, color: 'crimson' };
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Maximum safety - AI monitoring optimal';
    if (score >= 75) return 'Very safe area with active monitoring';
    if (score >= 60) return 'Safe zone - stay alert and follow guidelines';
    if (score >= 40) return 'Moderate risk - consider safer routes';
    return 'High risk area - return to safe zones immediately';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const scoreInfo = getScoreLabel(score);

  return (
    <div className="text-center">
      <div className="relative w-36 h-36 mx-auto mb-6">
        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreGradient(score)} opacity-20 blur-md`} />
        
        {/* Main SVG */}
        <svg className="w-36 h-36 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#safetyGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="safetyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={score >= 75 ? "#10b981" : score >= 60 ? "#f59e0b" : "#dc2626"} />
              <stop offset="100%" stopColor={score >= 75 ? "#059669" : score >= 60 ? "#d97706" : "#b91c1c"} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 1.5 }}
              >
                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {displayScore}
                </div>
              </motion.div>
            )}
            <div className="text-xs text-gray-500 font-medium">
              {isAnalyzing ? 'ANALYZING' : 'AI SCORE'}
            </div>
          </div>
        </div>

        {/* Floating indicators */}
        <motion.div
          className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Eye className="w-3 h-3 text-white" />
        </motion.div>
      </div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <h3 className="font-display font-bold text-lg text-gray-900">AI Safety Analysis</h3>
        
        <div className="flex items-center justify-center space-x-2">
          <scoreInfo.icon className={`w-5 h-5 text-${scoreInfo.color}-500`} />
          <span className={`text-${scoreInfo.color}-600 font-semibold`}>{scoreInfo.label}</span>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
          {getScoreMessage(score)}
        </p>

        {/* AI Features */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <div className="flex items-center space-x-1">
            <Brain className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-gray-500">AI Powered</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-golden-600" />
            <span className="text-xs text-gray-500">Real-time</span>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-emerald-600">Location</div>
              <div className="text-gray-600">Safe</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-golden-600">Weather</div>
              <div className="text-gray-600">Good</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-emerald-600">Network</div>
              <div className="text-gray-600">Strong</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafetyScore;