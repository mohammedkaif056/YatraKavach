import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const PoliceDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="bg-blue-900/50 p-6 rounded-xl mb-8 border border-blue-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold">Police Dashboard</h1>
        </div>
        
        <p className="text-lg mb-6">
          This is a simplified dashboard to ensure routing is working correctly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/police/test" className="bg-purple-600 hover:bg-purple-700 p-4 text-center rounded-lg">
            Go to Test Page
          </Link>
          <Link to="/police/alerts" className="bg-red-600 hover:bg-red-700 p-4 text-center rounded-lg">
            Go to Alerts
          </Link>
          <Link to="/" className="bg-green-600 hover:bg-green-700 p-4 text-center rounded-lg">
            Go to Landing Page
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
        <p className="mb-4">If you can see this page, the routing to the police dashboard is working correctly!</p>
        
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-400 font-semibold">Current URL: /police/dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;