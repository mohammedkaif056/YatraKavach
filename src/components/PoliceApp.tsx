import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PoliceDashboard from './police/PoliceDashboard';
import PoliceAlerts from './police/PoliceAlerts';
import PoliceAnalytics from './police/PoliceAnalytics';
import PoliceTourists from './police/PoliceTourists';
import TestPage from './police/TestPage';

const PoliceApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<PoliceDashboard />} />
        <Route path="/dashboard" element={<PoliceDashboard />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/alerts" element={<PoliceAlerts />} />
        <Route path="/analytics" element={<PoliceAnalytics />} />
        <Route path="/tourists" element={<PoliceTourists />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default PoliceApp;