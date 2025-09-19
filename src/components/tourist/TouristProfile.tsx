import React from 'react';
import { User, Shield, MapPin, Phone, Settings, QrCode, Globe, Calendar } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

const TouristProfile: React.FC = () => {
  const { currentUser } = useMockData();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-8">
        <div className="text-center">
          <img 
            src={currentUser.avatar} 
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white/20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">{currentUser.name}</h1>
          <p className="text-blue-100">{currentUser.nationality} Tourist</p>
        </div>
      </div>

      <div className="px-6 -mt-8">
        {/* Digital ID Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Digital Tourist ID</span>
            </h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">ID Number</p>
              <p className="font-semibold">TSI-{currentUser.id.padStart(6, '0')}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-emerald-600 capitalize">{currentUser.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Safety Score</p>
              <p className="font-semibold">{currentUser.safetyScore}/100</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-semibold">{currentUser.lastSeen}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-emerald-700 text-sm font-medium">✓ Verified Tourist Identity</p>
            <p className="text-emerald-600 text-xs">Blockchain secured • Privacy protected</p>
          </div>
        </div>

        {/* Trip Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Current Trip</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">{currentUser.destination}</p>
                  <p className="text-sm text-gray-600">Day {currentUser.currentDay} of {currentUser.totalDays}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{currentUser.tripProgress}%</p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentUser.tripProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{currentUser.distanceTraveled}km</p>
                <p className="text-sm text-gray-600">Distance Traveled</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{currentUser.totalDays - currentUser.currentDay}</p>
                <p className="text-sm text-gray-600">Days Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-red-600" />
            <span>Emergency Contact</span>
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="font-medium text-red-800">Primary Emergency Contact</p>
              <p className="text-red-600">{currentUser.emergencyContact}</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
              Call Now
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span>Privacy & Settings</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Sharing</p>
                <p className="text-sm text-gray-600">Share location with authorities</p>
              </div>
              <div className="bg-emerald-500 w-12 h-6 rounded-full relative">
                <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Family Notifications</p>
                <p className="text-sm text-gray-600">Notify emergency contacts</p>
              </div>
              <div className="bg-emerald-500 w-12 h-6 rounded-full relative">
                <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safety Alerts</p>
                <p className="text-sm text-gray-600">Receive area safety notifications</p>
              </div>
              <div className="bg-emerald-500 w-12 h-6 rounded-full relative">
                <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Language Preferences</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {['English', 'हिन्दी', 'বাংলা', 'தமிழ்', 'मराठी', 'ગુજરાતી'].map((language, index) => (
              <button 
                key={language}
                className={`p-3 rounded-lg border-2 text-left ${
                  index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                } transition-colors`}
              >
                <span className="font-medium">{language}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristProfile;