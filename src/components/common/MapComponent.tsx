import { memo, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Map marker type definition
export type MapMarker = {
  id: number;
  position: [number, number];
  type: string;
  name: string;
  status: string;
};

type SafeZoneCircle = {
  center: [number, number];
  radius: number;
  color: string;
  fillColor: string;
  fillOpacity: number;
};

type MapComponentProps = {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  safeZones?: SafeZoneCircle[];
  alertZones?: SafeZoneCircle[];
  showSafeZones?: boolean;
  showAlertZones?: boolean;
  className?: string;
};

// Fix Leaflet icon issues globally
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// This component handles map instance events and updates
// It properly uses the useMap hook from react-leaflet
const MapController: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // Map is ready, you can do any map setup here
    
    // Cleanup function to properly release resources when component unmounts
    return () => {
      // No need to manually remove the map here as react-leaflet handles this
      // Just clean up any custom event listeners you might have added
      map.off(); // Remove any custom event listeners
    };
  }, [map]);

  return null;
};

// ClientSideOnly wrapper component - only renders children on the client side
const ClientSideOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <>{children}</>;
};

const MapComponent = memo(({ 
  markers, 
  center = [25.5788, 91.8933], 
  zoom = 13,
  safeZones = [],
  alertZones = [],
  showSafeZones = true,
  showAlertZones = true,
  className = ""
}: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = `map-${Math.random().toString(36).substring(2, 11)}`;

  // Default safe zone if none provided
  const defaultSafeZones: SafeZoneCircle[] = [
    {
      center: [25.5788, 91.8933],
      radius: 500,
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.1
    }
  ];

  // Default alert zone if none provided
  const defaultAlertZones: SafeZoneCircle[] = [
    {
      center: [25.5738, 91.8893],
      radius: 300,
      color: '#F59E0B',
      fillColor: '#F59E0B',
      fillOpacity: 0.1
    }
  ];

  // Use provided zones or defaults
  const finalSafeZones = safeZones.length > 0 ? safeZones : defaultSafeZones;
  const finalAlertZones = alertZones.length > 0 ? alertZones : defaultAlertZones;

  // Clean up map on unmount - no need for additional cleanup here
  // since we're using MapController component that uses useMap() hook to handle cleanup
  useEffect(() => {
    return () => {
      mapRef.current = null;
    };
  }, []);

  return (
    <ClientSideOnly>
      <div id={mapContainerId} style={{ height: '100%', width: '100%' }} className={className}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          ref={(map) => {
            if (map) mapRef.current = map;
          }}
        >
          <MapController />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.id} position={m.position}>
              <Popup>
                <div>
                  <strong>{m.name}</strong><br />
                  {m.type} — {m.status}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Safe Zone Circles */}
          {showSafeZones && finalSafeZones.map((zone, index) => (
            <Circle 
              key={`safe-zone-${index}`}
              center={zone.center} 
              radius={zone.radius}
              pathOptions={{ 
                color: zone.color, 
                fillColor: zone.fillColor, 
                fillOpacity: zone.fillOpacity 
              }}
            />
          ))}
          
          {/* Alert Zone Circles */}
          {showAlertZones && finalAlertZones.map((zone, index) => (
            <Circle 
              key={`alert-zone-${index}`}
              center={zone.center} 
              radius={zone.radius}
              pathOptions={{ 
                color: zone.color, 
                fillColor: zone.fillColor, 
                fillOpacity: zone.fillOpacity 
              }}
            />
          ))}
        </MapContainer>
      </div>
    </ClientSideOnly>
  );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;