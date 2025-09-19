import React from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Test Page - Dashboard Route Tester</h1>
      
      <div className="bg-white text-black p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">If you can see this page, routing is working!</h2>
        <p className="mb-4">This is a simple test page to diagnose routing issues.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Link to="/" className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center">
          Go to Landing Page
        </Link>
        <Link to="/police" className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center">
          Go to Police Root
        </Link>
      </div>
    </div>
  );
};

export default TestPage;