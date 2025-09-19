import React from 'react';

const PoliceDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">Police Dashboard</h1>
          <p className="text-lg text-blue-300">
            Welcome to the Police Dashboard. This is a simplified version to ensure visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Active Alerts</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">High Priority Alert</span>
                  <span className="px-2 py-1 bg-red-700 text-xs rounded">Urgent</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">Tourist in distress at Central Market</p>
              </div>
              
              <div className="p-4 bg-yellow-900/30 border border-yellow-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Medium Priority Alert</span>
                  <span className="px-2 py-1 bg-yellow-700 text-xs rounded">Warning</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">Suspicious activity reported near Temple Square</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Tourist Distribution</h2>
            <div className="aspect-video bg-blue-900/30 rounded-lg flex items-center justify-center">
              <p className="text-lg font-medium">Map Visualization Placeholder</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Recent Incidents</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">ID</th>
                <th className="text-left py-2 px-4">Type</th>
                <th className="text-left py-2 px-4">Location</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-4">#42891</td>
                <td className="py-2 px-4">Theft</td>
                <td className="py-2 px-4">City Market</td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-700 text-xs rounded">Resolved</span></td>
                <td className="py-2 px-4">10:23 AM</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-4">#42890</td>
                <td className="py-2 px-4">Harassment</td>
                <td className="py-2 px-4">Central Park</td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-blue-700 text-xs rounded">In Progress</span></td>
                <td className="py-2 px-4">09:45 AM</td>
              </tr>
              <tr>
                <td className="py-2 px-4">#42889</td>
                <td className="py-2 px-4">Lost Tourist</td>
                <td className="py-2 px-4">Old Town</td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-700 text-xs rounded">Resolved</span></td>
                <td className="py-2 px-4">Yesterday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;