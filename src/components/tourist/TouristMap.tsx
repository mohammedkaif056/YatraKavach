import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Navigation, Layers, Search } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
// Removed Circle import as it's not needed anymore
import MapComponent, { MapMarker } from '../common/MapComponent';
import 'leaflet/dist/leaflet.css';

// Using MapComponent which already handles Leaflet icon fix

const TouristMap: React.FC = () => {
  const { currentUser } = useMockData();
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'street'>('street');
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  
  // Default center location (Shillong, Meghalaya)
  const centerPosition: [number, number] = [25.5788, 91.8933];
  
  // Using MapMarker type imported from MapComponent
  
  // Mock map markers
  const mockupState = {
    mapMarkers: [
      { id: 1, position: [25.5788, 91.8933] as [number, number], type: 'tourist', name: 'You (Current Location)', status: 'safe' },
      { id: 2, position: [25.5698, 91.8853] as [number, number], type: 'authority', name: 'Police Station', status: 'active' },
      { id: 3, position: [25.5678, 91.8823] as [number, number], type: 'medical', name: 'Medical Center', status: 'standby' },
      { id: 4, position: [25.5818, 91.8973] as [number, number], type: 'info', name: 'Tourist Information', status: 'active' },
      { id: 5, position: [25.5738, 91.8893] as [number, number], type: 'alert', name: 'Traffic Alert', status: 'warning' }
    ] as MapMarker[]
  };

  const nearbyPlaces = [
    { name: 'Police Station', distance: '0.8 km', type: 'safety', icon: Shield },
    { name: 'Hospital', distance: '1.2 km', type: 'medical', icon: Shield },
    { name: 'Tourist Information', distance: '0.5 km', type: 'info', icon: MapPin },
    { name: 'Safe Zone Boundary', distance: '0.3 km', type: 'zone', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Safety Map</h1>
              <p className="text-blue-100 text-sm">{currentUser?.currentLocation}</p>
            </div>
          </div>
          <Link 
            to="/tourist/dashboard"
            className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Map Controls */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-600" />
              <select 
                value={mapView}
                onChange={(e) => setMapView(e.target.value as 'satellite' | 'terrain' | 'street')}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="street">Street View</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={showSafeZones}
                  onChange={(e) => setShowSafeZones(e.target.checked)}
                  className="rounded"
                />
                <span>Safe Zones</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={showAlerts}
                  onChange={(e) => setShowAlerts(e.target.checked)}
                  className="rounded"
                />
                <span>Alerts</span>
              </label>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Navigation className="w-4 h-4" />
            <span>Navigate</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="h-96 m-6 rounded-lg overflow-hidden border border-gray-300 shadow-md">
            {/* Real Leaflet Map Implementation */}
            <div className="absolute inset-0">
              <MapComponent
                center={centerPosition}
                zoom={13}
                markers={mockupState.mapMarkers}
                showSafeZones={showSafeZones}
                showAlertZones={showAlerts}
                safeZones={[
                  {
                    center: [25.5788, 91.8933],
                    radius: 500,
                    color: '#10B981',
                    fillColor: '#10B981',
                    fillOpacity: 0.1
                  }
                ]}
                alertZones={[
                  {
                    center: [25.5738, 91.8893],
                    radius: 300,
                    color: '#F59E0B',
                    fillColor: '#F59E0B',
                    fillOpacity: 0.1
                  }
                ]}
              />
            </div>
            
            {/* Map Legend - Overlay on the map */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 z-[500]">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div className="text-xs text-gray-700">Your Location</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="text-xs text-gray-700">Safe Zones</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="text-xs text-gray-700">Caution Areas</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="text-xs text-gray-700">Restricted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Location Indicator */}
          <div className="absolute top-8 left-8 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-[500]">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">You are here</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{currentUser?.currentLocation}</p>
          </div>

          {/* Safety Status */}
          <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-[500]">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">Safe Zone</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Within designated area</p>
          </div>
        </div>
      </div>
      
      {/* Nearby Places */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-600" />
          <span>Nearby Safety Points</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {nearbyPlaces.map((place, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                place.type === 'safety' ? 'bg-emerald-100' :
                place.type === 'medical' ? 'bg-red-100' :
                place.type === 'info' ? 'bg-blue-100' : 'bg-yellow-100'
              }`}>
                <place.icon className={`w-4 h-4 ${
                  place.type === 'safety' ? 'text-emerald-600' :
                  place.type === 'medical' ? 'text-red-600' :
                  place.type === 'info' ? 'text-blue-600' : 'text-yellow-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{place.name}</p>
                <p className="text-xs text-gray-600">{place.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristMap;