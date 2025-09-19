import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, MapPin, Phone, Users, Info, CheckCircle, Clock } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

const TouristSafety: React.FC = () => {
  const { currentUser, alerts } = useMockData();

  const safetyTips = [
    {
      icon: MapPin,
      title: "Stay in Safe Zones",
      description: "Remain within designated tourist areas and follow geo-fence boundaries",
      priority: "high"
    },
    {
      icon: Phone,
      title: "Keep Emergency Contacts Updated",
      description: "Ensure your emergency contacts are current and accessible",
      priority: "high"
    },
    {
      icon: Users,
      title: "Travel in Groups",
      description: "When possible, explore with other tourists or local guides",
      priority: "medium"
    },
    {
      icon: Clock,
      title: "Regular Check-ins",
      description: "Update your location and status regularly through the app",
      priority: "medium"
    }
  ];

  const culturalGuidelines = [
    "Respect local customs and traditions",
    "Dress modestly when visiting religious sites",
    "Ask permission before photographing people",
    "Learn basic local greetings and phrases",
    "Be mindful of local festivals and celebrations"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Safety Center</h1>
            <p className="text-blue-100">Your comprehensive safety guide</p>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Current Safety Score</p>
              <p className="text-2xl font-bold">{currentUser?.safetyScore}/100</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Risk Level</p>
              <p className="text-lg font-semibold">
                {(currentUser?.safetyScore || 0) >= 80 ? 'Low' : 
                 (currentUser?.safetyScore || 0) >= 60 ? 'Medium' : 'High'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span>Recent Safety Alerts</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Essential Safety Tips</span>
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  tip.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <tip.icon className={`w-5 h-5 ${
                    tip.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    tip.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tip.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Guidelines */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold flex items-center space-x-2">
              <Info className="w-5 h-5 text-purple-600" />
              <span>Cultural Guidelines</span>
            </h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4">
              Respecting local culture enhances your safety and travel experience in Northeast India.
            </p>
            <div className="space-y-3">
              {culturalGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold flex items-center space-x-2">
              <Phone className="w-5 h-5 text-red-600" />
              <span>Emergency Contacts</span>
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { name: 'Emergency Services', number: '112', description: 'National Emergency Number' },
              { name: 'Tourist Helpline', number: '1363', description: 'Ministry of Tourism' },
              { name: 'Police Control Room', number: '100', description: 'Local Police Emergency' },
              { name: 'Medical Emergency', number: '108', description: 'Ambulance Services' }
            ].map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-lg text-blue-600">{contact.number}</span>
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors">
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/tourist/map" 
            className="bg-blue-600 text-white p-4 rounded-xl text-center hover:bg-blue-700 transition-colors"
          >
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Safety Map</span>
          </Link>
          <Link 
            to="/tourist/profile" 
            className="bg-emerald-600 text-white p-4 rounded-xl text-center hover:bg-emerald-700 transition-colors"
          >
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TouristSafety;