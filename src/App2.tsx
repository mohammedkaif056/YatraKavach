
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TouristApp from './components/TouristApp';
import PoliceApp from './components/PoliceApp2';
import RegistrationKiosk from './components/RegistrationKiosk';
import EmergencyInterface from './components/EmergencyInterface';
import LandingPage from './components/LandingPage2';
import PoliceDashboard from './components/police/PoliceDashboard2';
import { MockDataProvider } from './contexts/MockDataContext';

function App() {
  return (
    <MockDataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Main app routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/tourist/*" element={<TouristApp />} />
            
            {/* Police routes with direct dashboard access */}
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/police/dashboard" element={<PoliceDashboard />} />
            
            {/* Special direct routes for troubleshooting */}
            <Route path="/dashboard" element={<PoliceDashboard />} />
            <Route path="/policedashboard" element={<PoliceDashboard />} />
            
            {/* Other police routes through PoliceApp2 */}
            <Route path="/police/*" element={<PoliceApp />} />
            
            {/* Other app sections */}
            <Route path="/registration/*" element={<RegistrationKiosk />} />
            <Route path="/emergency/*" element={<EmergencyInterface />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/police/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </MockDataProvider>
  );
}

export default App;