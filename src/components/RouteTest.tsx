import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RouteTest: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">Route Testing Page</h1>
          <p className="text-lg text-blue-300">
            This page helps debug routing issues in the application.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Current Route Information</h2>
          <div className="space-y-2">
            <p><strong>Current Path:</strong> {location.pathname}</p>
            <p><strong>Search Params:</strong> {location.search || "(none)"}</p>
            <p><strong>Hash:</strong> {location.hash || "(none)"}</p>
            <p><strong>Key:</strong> {location.key}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Dashboard Routes</h2>
            <div className="space-y-4">
              <Link to="/police" className="block w-full bg-blue-700 hover:bg-blue-600 p-3 rounded-lg text-center">
                /police
              </Link>
              <Link to="/police/dashboard" className="block w-full bg-green-700 hover:bg-green-600 p-3 rounded-lg text-center">
                /police/dashboard
              </Link>
              <Link to="/dashboard" className="block w-full bg-purple-700 hover:bg-purple-600 p-3 rounded-lg text-center">
                /dashboard
              </Link>
              <Link to="/policedashboard" className="block w-full bg-pink-700 hover:bg-pink-600 p-3 rounded-lg text-center">
                /policedashboard
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Other App Routes</h2>
            <div className="space-y-4">
              <Link to="/" className="block w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center">
                Landing Page (/)
              </Link>
              <Link to="/tourist" className="block w-full bg-green-700 hover:bg-green-600 p-3 rounded-lg text-center">
                Tourist App (/tourist)
              </Link>
              <Link to="/emergency" className="block w-full bg-red-700 hover:bg-red-600 p-3 rounded-lg text-center">
                Emergency (/emergency)
              </Link>
              <Link to="/registration" className="block w-full bg-yellow-700 hover:bg-yellow-600 p-3 rounded-lg text-center">
                Registration (/registration)
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Route Debugging Information</h2>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-64">
            {JSON.stringify(location, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RouteTest;