import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, AlertTriangle } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">YatraKavach Dashboard</h1>
          <p className="text-xl text-gray-400">Select a portal to access</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Police Dashboard Links */}
          <div className="bg-blue-900/30 rounded-xl border border-blue-800 p-6 hover:bg-blue-900/50 transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Police Dashboard</h2>
            <div className="space-y-4">
              <Link 
                to="/police"
                className="block w-full bg-blue-700 hover:bg-blue-600 p-3 rounded-lg text-center"
              >
                Access via /police
              </Link>
              
              <Link 
                to="/police/dashboard"
                className="block w-full bg-green-700 hover:bg-green-600 p-3 rounded-lg text-center"
              >
                Access via /police/dashboard
              </Link>
              
              <Link 
                to="/policedashboard"
                className="block w-full bg-purple-700 hover:bg-purple-600 p-3 rounded-lg text-center"
              >
                Access via /policedashboard
              </Link>
              
              <Link 
                to="/dashboard"
                className="block w-full bg-pink-700 hover:bg-pink-600 p-3 rounded-lg text-center"
              >
                Access via /dashboard
              </Link>
            </div>
          </div>
          
          {/* Tourist Portal */}
          <div className="bg-green-900/30 rounded-xl border border-green-800 p-6 hover:bg-green-900/50 transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Tourist Portal</h2>
            <Link 
              to="/tourist"
              className="block w-full bg-green-700 hover:bg-green-600 p-3 rounded-lg text-center"
            >
              Access Tourist App
            </Link>
          </div>
          
          {/* Emergency Portal */}
          <div className="bg-red-900/30 rounded-xl border border-red-800 p-6 hover:bg-red-900/50 transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Emergency Portal</h2>
            <Link 
              to="/emergency"
              className="block w-full bg-red-700 hover:bg-red-600 p-3 rounded-lg text-center"
            >
              Access Emergency Interface
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-block bg-yellow-900/30 rounded-xl border border-yellow-800 p-6">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="mb-4">Try accessing one of these specific routes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                to="/police/test"
                className="block bg-yellow-700 hover:bg-yellow-600 p-3 rounded-lg text-center"
              >
                Test Page
              </Link>
              <Link 
                to="/access"
                className="block bg-yellow-700 hover:bg-yellow-600 p-3 rounded-lg text-center"
              >
                Access Dashboard Helper
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;