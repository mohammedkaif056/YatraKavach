import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, MapPin, Phone, Shield, Clock } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

const PoliceTourists: React.FC = () => {
  const { tourists } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTourists = tourists.filter(tourist => {
    const nameMatch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'all' || tourist.status === filterStatus;
    return nameMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-900/50';
      case 'inactive': return 'text-gray-400 bg-gray-900/50';
      case 'emergency': return 'text-red-400 bg-red-900/50';
      default: return 'text-gray-400 bg-gray-900/50';
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <span>Tourist Database</span>
            </h1>
            <p className="text-gray-400 mt-1">Monitor and manage registered tourists</p>
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
        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tourists by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tourists Grid */}
        <div className="grid gap-6">
          {filteredTourists.map((tourist) => (
            <div key={tourist.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src={tourist.avatar} 
                    alt={tourist.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{tourist.name}</h3>
                        <p className="text-gray-400">{tourist.nationality} • Age {tourist.age}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tourist.status)}`}>
                          {tourist.status.toUpperCase()}
                        </span>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getSafetyScoreColor(tourist.safetyScore)}`}>
                            {tourist.safetyScore}
                          </div>
                          <div className="text-xs text-gray-400">Safety Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Current Location</p>
                        <p className="font-medium flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{tourist.currentLocation}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Destination</p>
                        <p className="font-medium">{tourist.destination}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Last Seen</p>
                        <p className="font-medium flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{tourist.lastSeen}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Trip Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${tourist.tripProgress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{tourist.tripProgress}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Tourist ID: TSI-{tourist.id.padStart(6, '0')}</span>
                        <span>Day {tourist.currentDay} of {tourist.totalDays}</span>
                        <span>{tourist.distanceTraveled}km traveled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Contact</span>
                        </button>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Track</span>
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTourists.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No tourists found</h3>
            <p className="text-gray-500">No tourists match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceTourists;