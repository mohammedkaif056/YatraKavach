import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Smartphone, QrCode, Download, ArrowRight, Sparkles } from 'lucide-react';

const KioskComplete: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsGenerating(false);
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    navigate('/tourist/onboarding');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="mb-8">
              <div className="bg-blue-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Generating Your Digital ID</h1>
              <p className="text-gray-600 mb-8">Creating your secure blockchain-based tourist identity...</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-lg font-semibold text-gray-700">{progress}% Complete</p>
            </div>

            {/* Generation Steps */}
            <div className="space-y-4 text-left">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${progress >= 20 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                <CheckCircle className={`w-5 h-5 ${progress >= 20 ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Verifying personal information</span>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${progress >= 40 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                <CheckCircle className={`w-5 h-5 ${progress >= 40 ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Processing document verification</span>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${progress >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                <CheckCircle className={`w-5 h-5 ${progress >= 60 ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Creating blockchain identity</span>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${progress >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                <CheckCircle className={`w-5 h-5 ${progress >= 80 ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Generating QR code</span>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${progress >= 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                <CheckCircle className={`w-5 h-5 ${progress >= 100 ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Finalizing registration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-white p-6 rounded-full shadow-xl inline-block mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Registration Complete!</h1>
          <p className="text-xl text-blue-100 mb-6">
            Your digital tourist ID has been successfully created
          </p>
          <div className="flex justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Digital ID Card */}
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-blue-50 to-emerald-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Digital Tourist ID</h2>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Rohit Sharma</h3>
                    <p className="text-gray-600">Indian Tourist</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <QrCode className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">ID Number</p>
                    <p className="font-semibold">TSI-000001</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold text-emerald-600">Active</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Destination</p>
                    <p className="font-semibold">Northeast India</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valid Until</p>
                    <p className="font-semibold">30 Days</p>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 text-sm font-medium">Blockchain Verified</span>
                  </div>
                  <p className="text-emerald-600 text-xs mt-1">Secure • Private • Tamper-proof</p>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="bg-gray-100 w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-16 h-16 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Scan this QR code with the mobile app</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Next Steps</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Download Mobile App</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Install the Tourist Safety app on your smartphone for real-time monitoring and emergency features.
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download App</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <QrCode className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Scan QR Code</h3>
                    <p className="text-gray-600 text-sm">
                      Use your phone camera or the app to scan the QR code and activate your digital ID.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Stay Safe</h3>
                    <p className="text-gray-600 text-sm">
                      Your safety is now monitored 24/7. Emergency services can locate and assist you instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Features */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-blue-800 mb-4">Your Safety Features</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">Real-time GPS tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">Emergency panic button</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">Geo-fence safety alerts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">24/7 emergency response</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue to Mobile App</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Welcome to the future of tourist safety in India!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskComplete;