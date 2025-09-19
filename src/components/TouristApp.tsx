import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TouristOnboarding from './tourist/TouristOnboarding';
import TouristDashboard from './tourist/TouristDashboard';
import TouristProfile from './tourist/TouristProfile';
import TouristSafety from './tourist/TouristSafety';
import TouristMap from './tourist/TouristMap';

const TouristApp: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Routes>
        <Route path="/onboarding" element={<TouristOnboarding />} />
        <Route path="/dashboard" element={<TouristDashboard />} />
        <Route path="/profile" element={<TouristProfile />} />
        <Route path="/safety" element={<TouristSafety />} />
        <Route path="/map" element={<TouristMap />} />
        <Route path="*" element={<Navigate to="/tourist/dashboard" replace />} />
      </Routes>
    </motion.div>
  );
};

export default TouristApp;