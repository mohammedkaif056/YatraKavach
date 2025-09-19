import React, { useMemo } from 'react';
import MapComponent, { MapMarker } from '../common/MapComponent';
import { Tourist, Alert } from '../../services/mockData';

interface PoliceMapProps {
  tourists: Tourist[];
  alerts: Alert[];
  className?: string;
}

interface SafeZone {
  center: [number, number];
  radius: number;
  color: string;
  fillColor: string;
  fillOpacity: number;
  name: string;
  type: 'safe' | 'caution' | 'alert';
  description?: string;
}

// Northeast India coordinate mapping (approximate)
const locationCoordinates: Record<string, [number, number]> = {
  'Shillong, Meghalaya': [25.5788, 91.8933],
  'Gangtok, Sikkim': [27.3389, 88.6065],
  'Guwahati, Assam': [26.1445, 91.7362],
  'Imphal, Manipur': [24.8170, 93.9368],
  'Kohima, Nagaland': [25.6747, 94.1086],
  'Itanagar, Arunachal Pradesh': [27.0844, 93.6053],
  'Kaziranga National Park': [26.5767, 93.1698],
  'Tawang, Arunachal Pradesh': [27.5855, 91.8594],
  'Nathu La, Sikkim': [27.3870, 88.8303]
};

// Default location if not found
const defaultLocation: [number, number] = [25.5788, 91.8933]; // Shillong

const PoliceMap: React.FC<PoliceMapProps> = ({ tourists, alerts, className = "h-96" }) => {
  
  // Define safety zones based on the Northeast India region
  const safeZones: SafeZone[] = useMemo(() => [
    {
      center: locationCoordinates['Shillong, Meghalaya'],
      radius: 2000,
      color: '#10B981', // emerald-500
      fillColor: '#10B981',
      fillOpacity: 0.2,
      name: 'Shillong City Safe Zone',
      type: 'safe',
      description: 'Main tourist area with regular police patrols'
    },
    {
      center: locationCoordinates['Gangtok, Sikkim'],
      radius: 1800,
      color: '#10B981', // emerald-500
      fillColor: '#10B981',
      fillOpacity: 0.2,
      name: 'Gangtok Tourist District',
      type: 'safe',
      description: 'Main tourist area with 24/7 monitoring'
    },
    {
      center: locationCoordinates['Guwahati, Assam'],
      radius: 3000,
      color: '#10B981', // emerald-500
      fillColor: '#10B981',
      fillOpacity: 0.2,
      name: 'Guwahati Central',
      type: 'safe',
      description: 'City center with high security'
    },
    {
      center: locationCoordinates['Imphal, Manipur'],
      radius: 1500,
      color: '#10B981', // emerald-500
      fillColor: '#10B981',
      fillOpacity: 0.2,
      name: 'Imphal Tourist Zone',
      type: 'safe',
      description: 'Designated safe area for tourists'
    }
  ], []);

  // Define caution zones
  const cautionZones: SafeZone[] = useMemo(() => [
    {
      center: [27.2046, 88.7223], // Near Sikkim-China border
      radius: 5000,
      color: '#F59E0B', // amber-500
      fillColor: '#F59E0B',
      fillOpacity: 0.2,
      name: 'Border Region',
      type: 'caution',
      description: 'Border area with restricted access'
    },
    {
      center: [26.5767, 93.6698], // Near Kaziranga
      radius: 4000,
      color: '#F59E0B', // amber-500
      fillColor: '#F59E0B',
      fillOpacity: 0.2,
      name: 'Wildlife Reserve Buffer',
      type: 'caution',
      description: 'Wildlife area with limited cell coverage'
    },
    {
      center: [26.0456, 92.7589], // Remote area in Meghalaya
      radius: 3000,
      color: '#F59E0B', // amber-500
      fillColor: '#F59E0B',
      fillOpacity: 0.2,
      name: 'Remote Hills',
      type: 'caution',
      description: 'Hilly terrain with poor accessibility'
    }
  ], []);

  // Define alert zones based on active high-severity alerts
  const alertZones: SafeZone[] = useMemo(() => {
    const highAlerts = alerts.filter(alert => alert.severity === 'high' && alert.status === 'active');
    
    return highAlerts.map(alert => {
      const coordinates = locationCoordinates[alert.location] || defaultLocation;
      
      return {
        center: coordinates,
        radius: 1000,
        color: '#EF4444', // red-500
        fillColor: '#EF4444',
        fillOpacity: 0.3,
        name: `Alert: ${alert.type}`,
        type: 'alert',
        description: alert.message
      };
    });
  }, [alerts]);

  // Convert tourists to map markers
  const touristMarkers: MapMarker[] = useMemo(() => {
    return tourists.map(tourist => {
      const coordinates = locationCoordinates[tourist.currentLocation] || defaultLocation;
      
      return {
        id: parseInt(tourist.id),
        position: coordinates,
        type: 'Tourist',
        name: tourist.name,
        status: tourist.status
      };
    });
  }, [tourists]);

  // Calculate map center based on all tourist positions
  const mapCenter = useMemo(() => {
    if (touristMarkers.length === 0) return defaultLocation;
    
    const totalLat = touristMarkers.reduce((sum, marker) => sum + marker.position[0], 0);
    const totalLng = touristMarkers.reduce((sum, marker) => sum + marker.position[1], 0);
    
    return [
      totalLat / touristMarkers.length,
      totalLng / touristMarkers.length
    ] as [number, number];
  }, [touristMarkers]);

  // Combine all zones for display
  const allSafeZones = useMemo(() => [...safeZones], [safeZones]);
  const allAlertZones = useMemo(() => [...cautionZones, ...alertZones], [cautionZones, alertZones]);

  return (
    <div className="relative w-full h-full">
      <MapComponent
        markers={touristMarkers}
        center={mapCenter}
        zoom={7}
        safeZones={allSafeZones}
        alertZones={allAlertZones}
        showSafeZones={true}
        showAlertZones={true}
        className={className}
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-90 text-white p-3 rounded-lg shadow-lg text-xs">
        <h4 className="font-semibold mb-2 text-sm">Map Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span>Safe Zones ({safeZones.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span>Caution Areas ({cautionZones.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Alert Zones ({alertZones.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Tourists ({touristMarkers.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceMap;