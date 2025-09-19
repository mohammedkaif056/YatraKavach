import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin, User, Phone, CheckCircle, X, Filter } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

const PoliceAlerts: React.FC = () => {
  const { alerts, updateAlert } = useMockData();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    return severityMatch && statusMatch;
  });

  const handleResolveAlert = (alertId: string) => {
    updateAlert(alertId, { status: 'resolved' });
  };

  const handleInvestigateAlert = (alertId: string) => {
    updateAlert(alertId, { status: 'investigating' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <span>Alert Management Center</span>
            </h1>
            <p className="text-gray-400 mt-1">Monitor and respond to tourist safety alerts</p>
          </div>
          <Link 
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Severity:</label>
              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Status:</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`bg-gray-800 rounded-lg border-l-4 ${
              alert.severity === 'high' ? 'border-red-500' :
              alert.severity === 'medium' ? 'border-yellow-500' :
              'border-blue-500'
            } border border-gray-700`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-900/50' :
                      alert.severity === 'medium' ? 'bg-yellow-900/50' :
                      'bg-blue-900/50'
                    }`}>
                      <AlertTriangle className={`w-6 h-6 ${
                        alert.severity === 'high' ? 'text-red-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{alert.type}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'active' ? 'bg-red-600 text-white' :
                          alert.status === 'investigating' ? 'bg-yellow-600 text-white' :
                          'bg-emerald-600 text-white'
                        }`}>
                          {alert.status.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{alert.message}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{alert.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Tourist ID: {alert.touristId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    {alert.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleInvestigateAlert(alert.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Start Investigation
                        </button>
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </>
                    )}
                    {alert.status === 'investigating' && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {alert.status === 'resolved' && (
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Resolved</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Contact Tourist</span>
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>View Location</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No alerts found</h3>
            <p className="text-gray-500">No alerts match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceAlerts;