import React from 'react';
import { Link } from 'react-router-dom';

const AccessDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Dashboard Access</h1>
        
        <p className="mb-6">
          Choose one of the following links to access the police dashboard:
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/police" 
            className="bg-blue-600 hover:bg-blue-700 p-3 text-center w-full block rounded-lg"
          >
            Access via /police
          </Link>
          
          <Link 
            to="/police/dashboard" 
            className="bg-green-600 hover:bg-green-700 p-3 text-center w-full block rounded-lg"
          >
            Access via /police/dashboard
          </Link>
          
          <Link 
            to="/policedashboard" 
            className="bg-purple-600 hover:bg-purple-700 p-3 text-center w-full block rounded-lg"
          >
            Access via /policedashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDashboard;