import React from 'react';
import { useLocation } from 'react-router-dom';

const RouteDebug: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 right-0 bg-black/70 text-white p-2 text-xs z-50 max-w-md">
      <div><strong>Route Debug:</strong></div>
      <div><strong>Path:</strong> {location.pathname}</div>
      <div><strong>Search:</strong> {location.search || 'none'}</div>
      <div><strong>Hash:</strong> {location.hash || 'none'}</div>
    </div>
  );
};

export default RouteDebug;