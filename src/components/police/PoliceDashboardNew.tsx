import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Users, BarChart3 } from 'lucide-react';

const PoliceDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Police Dashboard</h1>
          </div>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            Home
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="p-6">
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            Dashboard is working correctly!
          </h2>
          <p className="mt-2">This is a simplified dashboard to verify routing.</p>
        </div>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/police/alerts" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl border border-gray-700 flex flex-col items-center transition-all">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="text-lg font-bold">Alerts</h3>
            <p className="text-gray-400 text-sm text-center mt-1">View and respond to safety alerts</p>
          </Link>
          
          <Link to="/police/tourists" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl border border-gray-700 flex flex-col items-center transition-all">
            <Users className="w-10 h-10 text-blue-500 mb-2" />
            <h3 className="text-lg font-bold">Tourists</h3>
            <p className="text-gray-400 text-sm text-center mt-1">Monitor registered tourists</p>
          </Link>
          
          <Link to="/police/analytics" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl border border-gray-700 flex flex-col items-center transition-all">
            <BarChart3 className="w-10 h-10 text-purple-500 mb-2" />
            <h3 className="text-lg font-bold">Analytics</h3>
            <p className="text-gray-400 text-sm text-center mt-1">View safety statistics and trends</p>
          </Link>
        </div>
        
        {/* Route Info */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h3 className="font-bold mb-2">Current Route Information:</h3>
          <div className="bg-gray-800 p-3 rounded-lg font-mono text-sm">
            <div>path: /police/dashboard</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PoliceDashboard;