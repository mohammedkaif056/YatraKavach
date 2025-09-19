import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmergencyResponse from './emergency/EmergencyResponse';
import EmergencyActive from './emergency/EmergencyActive';
import EmergencyMap from './emergency/EmergencyMap';
import TriageQueue from './emergency/TriageQueue';
import EvidenceVault from './emergency/EvidenceVault';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const EmergencyInterface: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/response" element={<EmergencyResponse />} />
        <Route path="/active" element={<EmergencyActive />} />
        <Route path="/map" element={
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Command Center</h1>
              <p className="text-gray-600">Real-time emergency response coordination</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
              {/* Map takes 2/3 width on large screens */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <EmergencyMap
                  userRole="operator"
                  userId="current_user"
                  height="100%"
                  initialCenter={[25.5788, 91.8933]}
                  initialZoom={13}
                  showControls={true}
                  onIncidentSelect={(incident) => console.log('Selected incident:', incident)}
                  onResponderSelect={(responder) => console.log('Selected responder:', responder)}
                />
              </div>
              
              {/* Triage Queue takes 1/3 width */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <TriageQueue
                  userRole="operator"
                  userId="current_user"
                  className="h-full"
                />
              </div>
            </div>
          </div>
        } />
        <Route path="/evidence/:incidentId?" element={
          <div className="p-6 bg-gray-50 min-h-screen">
            <EvidenceVault
              incidentId="default"
              userRole="operator"
              userId="current_user"
              className="h-[calc(100vh-120px)]"
            />
          </div>
        } />
        <Route path="*" element={<Navigate to="/emergency/response" replace />} />
      </Routes>
    </div>
  );
};

export default EmergencyInterface;