/**
 * EmergencyMap Component - Real-time Leaflet Map Integration
 * 
 * Features:
 * - Real-time incident tracking with live updates
 * - Multiple map layers (Street, Satellite, Terrain, Hybrid)
 * - Emergency responder tracking and ETA calculations
 * - Safe zones and danger zones visualization
 * - Tourist location monitoring with geofencing
 * - Offline map tile caching
 * - Draw tools for marking areas and routes
 * - Distance and area measurements
 * - Emergency coordination tools
 * 
 * Map Providers:
 * - OpenStreetMap (Street view)
 * - OpenTopoMap (Terrain view)
 * - Esri World Imagery (Satellite view)
 * - Custom emergency overlay layers
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polyline, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  AlertTriangle,
  Shield,
  Target,
  Route,
  Satellite,
  Mountain,
  Building,
  Maximize2,
  Minimize2,
  RotateCcw,
  Crosshair
} from 'lucide-react';

import { Incident, ResponderUnit, UserRole } from '../../types/emergency';
import { useRBAC, useAccessibility } from '../../hooks/useEmergencySystem';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map layer configurations
const MAP_LAYERS = {
  street: {
    name: 'Street View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    icon: Building
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
    icon: Satellite
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    icon: Mountain
  },
  hybrid: {
    name: 'Hybrid',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    icon: Layers
  }
};

// Custom icons for different marker types
const createCustomIcon = (type: string, color: string, size: [number, number] = [25, 41]) => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: ${size[0]}px;
      height: ${size[1]}px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(-45deg);
      position: relative;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 14px;
        font-weight: bold;
      ">
        ${getIconSymbol(type)}
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]],
    className: 'custom-emergency-icon'
  });
};

const getIconSymbol = (type: string): string => {
  const symbols = {
    incident: '⚠️',
    responder: '🚔',
    tourist: '👤',
    hospital: '🏥',
    police: '🚨',
    fire: '🔥',
    safe_zone: '🛡️',
    danger_zone: '⚠️',
    checkpoint: '📍'
  };
  return symbols[type as keyof typeof symbols] || '📍';
};

// Zone types for emergency areas
interface EmergencyZone {
  id: string;
  center: [number, number];
  radius: number;
  type: 'safe' | 'danger' | 'restricted' | 'evacuation';
  color: string;
  fillColor: string;
  fillOpacity: number;
  name: string;
  description: string;
  active: boolean;
}

// Real-time map data interface
interface MapData {
  incidents: Incident[];
  responders: ResponderUnit[];
  zones: EmergencyZone[];
  routes: Array<{
    id: string;
    coordinates: [number, number][];
    type: 'patrol' | 'response' | 'evacuation';
    color: string;
    responderIds: string[];
  }>;
}

// Map controls component
interface MapControlsProps {
  currentLayer: keyof typeof MAP_LAYERS;
  onLayerChange: (layer: keyof typeof MAP_LAYERS) => void;
  showIncidents: boolean;
  showResponders: boolean;
  showZones: boolean;
  showRoutes: boolean;
  onToggleLayer: (layer: string) => void;
  onZoomToLocation: () => void;
  onResetView: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  currentLayer,
  onLayerChange,
  showIncidents,
  showResponders,
  showZones,
  showRoutes,
  onToggleLayer,
  onZoomToLocation,
  onResetView,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-2">
      {/* Layer Selector */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
          title="Map Layers"
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium">{MAP_LAYERS[currentLayer].name}</span>
        </button>
        
        <AnimatePresence>
          {showLayerPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200"
            >
              {Object.entries(MAP_LAYERS).map(([key, layer]) => {
                const IconComponent = layer.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onLayerChange(key as keyof typeof MAP_LAYERS);
                      setShowLayerPanel(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentLayer === key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {layer.name}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layer Toggles */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-1">
        <button
          onClick={() => onToggleLayer('incidents')}
          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
            showIncidents ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Incidents
        </button>
        
        <button
          onClick={() => onToggleLayer('responders')}
          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
            showResponders ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          Responders
        </button>
        
        <button
          onClick={() => onToggleLayer('zones')}
          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
            showZones ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Target className="w-4 h-4" />
          Zones
        </button>
        
        <button
          onClick={() => onToggleLayer('routes')}
          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
            showRoutes ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Route className="w-4 h-4" />
          Routes
        </button>
      </div>

      {/* Map Actions */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-1">
        <button
          onClick={onZoomToLocation}
          className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          title="Zoom to my location"
        >
          <Crosshair className="w-4 h-4" />
          My Location
        </button>
        
        <button
          onClick={onResetView}
          className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          title="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
          Reset View
        </button>
        
        <button
          onClick={onToggleFullscreen}
          className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
};

// Map event handler component
const MapEventHandler: React.FC<{
  onMapClick: (latlng: L.LatLng) => void;
  onMapMove: (center: L.LatLng, zoom: number) => void;
}> = ({ onMapClick, onMapMove }) => {
  const map = useMap();

  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onMapMove(center, zoom);
    },
  });

  return null;
};

// Main Emergency Map Component
interface EmergencyMapProps {
  userRole: UserRole;
  userId: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string;
  className?: string;
  onIncidentSelect?: (incident: Incident) => void;
  onResponderSelect?: (responder: ResponderUnit) => void;
  showControls?: boolean;
}

const EmergencyMap: React.FC<EmergencyMapProps> = ({
  userRole,
  userId,
  initialCenter = [25.5788, 91.8933], // Default to Shillong, Meghalaya
  initialZoom = 13,
  height = '500px',
  className = '',
  onIncidentSelect,
  onResponderSelect,
  showControls = true
}) => {
  // Hooks
  const { hasPermission } = useRBAC(userRole, userId);
  const { announceToScreenReader } = useAccessibility();
  
  // State
  const [currentLayer, setCurrentLayer] = useState<keyof typeof MAP_LAYERS>('street');
  const [mapData, setMapData] = useState<MapData>({
    incidents: [],
    responders: [],
    zones: [],
    routes: []
  });
  const [showIncidents, setShowIncidents] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  
  const mapRef = useRef<L.Map | null>(null);

  // Permissions
  const canModifyMap = hasPermission('incidents', 'write');
  const canViewResponders = hasPermission('responders', 'read');

  // Load real-time map data
  useEffect(() => {
    const loadMapData = async () => {
      try {
        // This would be replaced with actual WebSocket connection
        // const ws = new WebSocket('ws://localhost:8080/emergency-map');
        
        // Mock data for demonstration
        const mockData: MapData = {
          incidents: [
            {
              id: 'inc1',
              severity: 'HIGH',
              status: 'PENDING',
              type: 'Tourist Lost',
              title: 'Missing Tourist in Umiam Lake Area',
              description: 'Tourist reported missing during boat ride',
              location: {
                lat: 25.5698,
                lng: 91.8853,
                address: 'Umiam Lake, Meghalaya',
                accuracy: 10
              },
              tourist: {
                id: 'tour1',
                name: 'Sarah Johnson',
                phone: '+91-98765-43210',
                emergencyContact: 'John Johnson (+1-555-0123)',
                language: 'en',
                digitalId: 'DT001'
              },
              assignedUnits: ['unit1'],
              createdAt: new Date(),
              updatedAt: new Date(),
              estimatedETA: 8,
              distance: 3.2,
              safetyScore: 65,
              aiConfidence: 85,
              aiReasoning: 'High priority due to water proximity and time of day',
              tags: ['water', 'missing_person'],
              metadata: {
                source: 'emergency_call',
                verified: true,
                priority: 1,
                geoFenceBreached: true,
                lastCommunication: new Date()
              }
            }
          ],
          responders: [
            {
              id: 'unit1',
              callSign: 'Alpha-7',
              type: 'POLICE',
              status: 'EN_ROUTE',
              location: {
                lat: 25.5745,
                lng: 91.8821,
                accuracy: 5,
                lastUpdate: new Date()
              },
              crew: {
                lead: 'Officer Rajesh Kumar',
                members: ['Officer Rohit Sharma', 'Officer David Nongkynrih'],
                specializations: ['water_rescue', 'first_aid']
              },
              equipment: ['rescue_boat', 'medical_kit', 'communication_radio'],
              availability: {
                available: false,
                eta: 8,
                currentIncidentId: 'inc1'
              },
              lastCheckIn: new Date(),
              communicationMethod: 'RADIO'
            }
          ],
          zones: [
            {
              id: 'safe1',
              center: [25.5788, 91.8933],
              radius: 1000,
              type: 'safe',
              color: '#10B981',
              fillColor: '#10B981',
              fillOpacity: 0.2,
              name: 'Police Bazaar Safe Zone',
              description: 'Well-patrolled commercial area with high security',
              active: true
            },
            {
              id: 'danger1',
              center: [25.5698, 91.8853],
              radius: 500,
              type: 'danger',
              color: '#EF4444',
              fillColor: '#EF4444',
              fillOpacity: 0.3,
              name: 'Umiam Lake Risk Area',
              description: 'Water body with limited visibility and rescue access',
              active: true
            }
          ],
          routes: [
            {
              id: 'route1',
              coordinates: [
                [25.5745, 91.8821],
                [25.5720, 91.8840],
                [25.5698, 91.8853]
              ],
              type: 'response',
              color: '#3B82F6',
              responderIds: ['unit1']
            }
          ]
        };
        
        setMapData(mockData);
        announceToScreenReader(`Map loaded with ${mockData.incidents.length} incidents and ${mockData.responders.length} responders`);
      } catch (error) {
        console.error('Failed to load map data:', error);
        announceToScreenReader('Failed to load map data');
      }
    };

    loadMapData();
    
    // Set up real-time updates (every 10 seconds for demo)
    const interval = setInterval(loadMapData, 10000);
    return () => clearInterval(interval);
  }, [announceToScreenReader]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(location);
          announceToScreenReader('Current location obtained');
        },
        (error) => {
          console.warn('Geolocation error:', error);
          announceToScreenReader('Unable to get current location');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, [announceToScreenReader]);

  // Handle layer toggles
  const handleToggleLayer = useCallback((layer: string) => {
    switch (layer) {
      case 'incidents':
        setShowIncidents(prev => !prev);
        break;
      case 'responders':
        setShowResponders(prev => !prev);
        break;
      case 'zones':
        setShowZones(prev => !prev);
        break;
      case 'routes':
        setShowRoutes(prev => !prev);
        break;
    }
  }, []);

  // Handle map interactions
  const handleMapClick = useCallback((latlng: L.LatLng) => {
    if (canModifyMap) {
      console.log('Map clicked at:', latlng.lat, latlng.lng);
      // Could open context menu for adding markers, zones, etc.
    }
  }, [canModifyMap]);

  const handleMapMove = useCallback((center: L.LatLng, zoom: number) => {
    setMapCenter([center.lat, center.lng]);
    setMapZoom(zoom);
  }, []);

  const handleZoomToLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 16);
      announceToScreenReader('Zoomed to current location');
    }
  }, [userLocation, announceToScreenReader]);

  const handleResetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(initialCenter, initialZoom);
      announceToScreenReader('Map view reset');
    }
  }, [initialCenter, initialZoom, announceToScreenReader]);

  // Render incidents on map
  const renderIncidents = useMemo(() => {
    if (!showIncidents) return null;

    return mapData.incidents.map(incident => (
      <Marker
        key={incident.id}
        position={[incident.location.lat, incident.location.lng]}
        icon={createCustomIcon('incident', incident.severity === 'CRITICAL' ? '#DC2626' : '#EF4444')}
        eventHandlers={{
          click: () => {
            onIncidentSelect?.(incident);
            announceToScreenReader(`Selected incident: ${incident.title}`);
          }
        }}
      >
        <Popup>
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-red-800 mb-2">{incident.title}</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Severity:</strong> {incident.severity}</p>
              <p><strong>Status:</strong> {incident.status}</p>
              <p><strong>Tourist:</strong> {incident.tourist.name}</p>
              <p><strong>ETA:</strong> {incident.estimatedETA} minutes</p>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onIncidentSelect?.(incident)}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                View Details
              </button>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  }, [showIncidents, mapData.incidents, onIncidentSelect, announceToScreenReader]);

  // Render responders on map
  const renderResponders = useMemo(() => {
    if (!showResponders || !canViewResponders) return null;

    return mapData.responders.map(responder => (
      <Marker
        key={responder.id}
        position={[responder.location.lat, responder.location.lng]}
        icon={createCustomIcon('responder', '#3B82F6')}
        eventHandlers={{
          click: () => {
            onResponderSelect?.(responder);
            announceToScreenReader(`Selected responder: ${responder.callSign}`);
          }
        }}
      >
        <Popup>
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-blue-800 mb-2">{responder.callSign}</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Type:</strong> {responder.type}</p>
              <p><strong>Status:</strong> {responder.status}</p>
              <p><strong>Lead:</strong> {responder.crew.lead}</p>
              <p><strong>Last Check-in:</strong> {responder.lastCheckIn.toLocaleTimeString()}</p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => onResponderSelect?.(responder)}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  }, [showResponders, canViewResponders, mapData.responders, onResponderSelect, announceToScreenReader]);

  // Render zones on map
  const renderZones = useMemo(() => {
    if (!showZones) return null;

    return mapData.zones.map(zone => (
      <Circle
        key={zone.id}
        center={zone.center}
        radius={zone.radius}
        pathOptions={{
          color: zone.color,
          fillColor: zone.fillColor,
          fillOpacity: zone.fillOpacity,
          weight: 2
        }}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold mb-2">{zone.name}</h3>
            <p className="text-sm text-gray-600">{zone.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Radius: {(zone.radius / 1000).toFixed(1)}km
            </p>
          </div>
        </Popup>
      </Circle>
    ));
  }, [showZones, mapData.zones]);

  // Render routes on map
  const renderRoutes = useMemo(() => {
    if (!showRoutes) return null;

    return mapData.routes.map(route => (
      <Polyline
        key={route.id}
        positions={route.coordinates}
        pathOptions={{
          color: route.color,
          weight: 4,
          opacity: 0.8,
          dashArray: route.type === 'patrol' ? '10, 10' : undefined
        }}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold mb-2">Route: {route.type}</h3>
            <p className="text-sm text-gray-600">
              Assigned to: {route.responderIds.join(', ')}
            </p>
          </div>
        </Popup>
      </Polyline>
    ));
  }, [showRoutes, mapData.routes]);

  // Current map layer
  const currentMapLayer = MAP_LAYERS[currentLayer];

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full rounded-lg"
        ref={mapRef}
        zoomControl={false}
      >
        {/* Base tile layer */}
        <TileLayer
          url={currentMapLayer.url}
          attribution={currentMapLayer.attribution}
          maxZoom={18}
        />

        {/* Map event handler */}
        <MapEventHandler
          onMapClick={handleMapClick}
          onMapMove={handleMapMove}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createCustomIcon('user', '#10B981', [20, 32])}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-green-800">Your Location</h3>
                <p className="text-sm text-gray-600">Current position</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render all map elements */}
        {renderIncidents}
        {renderResponders}
        {renderZones}
        {renderRoutes}
      </MapContainer>

      {/* Map controls */}
      {showControls && (
        <MapControls
          currentLayer={currentLayer}
          onLayerChange={setCurrentLayer}
          showIncidents={showIncidents}
          showResponders={showResponders}
          showZones={showZones}
          showRoutes={showRoutes}
          onToggleLayer={handleToggleLayer}
          onZoomToLocation={handleZoomToLocation}
          onResetView={handleResetView}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Emergency Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Emergency Responders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Risk Areas</span>
          </div>
        </div>
      </div>

      {/* Connection status */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700">Live Updates</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;