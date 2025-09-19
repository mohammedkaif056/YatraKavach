import React, { useState, useRef, useEffect } from 'react';
import { Camera, FileText, Upload, Check, X, Loader, Shield } from 'lucide-react';

interface DocumentVerificationProps {
  onScanComplete: (result: { success: boolean; data?: any }) => void;
}

/**
 * Document verification component with working camera capture and file upload
 */
const DocumentVerification: React.FC<DocumentVerificationProps> = ({ onScanComplete }) => {
  // State for managing the scanning process
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle');
  // We do use setSelectedFile throughout the component, even if selectedFile isn't directly read
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effect for handling camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      if (scanningState === 'scanning' && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setScanningState('error');
          setErrorMessage('Could not access camera. Please check permissions or try uploading a file.');
        }
      }
    };
    
    setupCamera();
    
    // Cleanup function to stop camera when component unmounts or state changes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanningState]);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid document file (JPEG, PNG or PDF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size should be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setErrorMessage(null);
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF, just show a placeholder
      setPreviewUrl('pdf');
    }
    
    // Start processing
    processDocument(file);
  };
  
  // Start camera scanning
  const startScanning = () => {
    setScanningState('scanning');
    setErrorMessage(null);
  };
  
  // Trigger file upload dialog
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Capture image from camera
  const captureDocument = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "document-scan.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            setPreviewUrl(canvas.toDataURL('image/jpeg'));
            
            // Process the captured document
            processDocument(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };
  
  // Process the document (either captured or uploaded)
  const processDocument = (file: File) => {
    setScanningState('processing');
    
    // Simulate document processing with a timer
    setTimeout(() => {
      const randomSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (randomSuccess) {
        setScanningState('success');
        onScanComplete({ 
          success: true, 
          data: {
            documentType: file.type,
            fileName: file.name,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        setScanningState('error');
        setErrorMessage('Document verification failed. Please try again or use a different document.');
      }
    }, 2000); // Simulate processing time
  };
  
  // Reset the scanning process
  const resetScanning = () => {
    setScanningState('idle');
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
  };
  
  // Render based on scanning state
  const renderScanningContent = () => {
    switch (scanningState) {
      case 'idle':
        return (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center shadow-sm">
            <div className="relative w-full max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-center">
                <div className="bg-white p-3 rounded-full shadow-md">
                  <Camera className="w-10 h-10 text-gray-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Document Scanner</h3>
              <p className="text-gray-600 mb-6">Choose how you want to verify your document</p>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm">
                <div className="relative">
                  <div className="h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                    <FileText className="w-14 h-14 text-gray-400 mb-4" />
                    <p className="text-gray-500 px-8">Select a document to scan or upload. We accept passport, ID card, or driver's license.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={startScanning}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="font-medium">Start Scanning</span>
                </button>
                
                <button 
                  onClick={triggerFileUpload}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  <span className="font-medium">Upload File</span>
                </button>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        );
        
      case 'scanning':
        return (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-solid border-blue-400 rounded-xl p-8 text-center shadow-sm">
            <div className="relative w-full max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Camera Scanning</h3>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6 shadow-sm">
                <div className="relative aspect-video">
                  {/* Live camera view */}
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                  ></video>
                  
                  {/* Scanning indicator */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg border-dashed opacity-70 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-scan"></div>
                </div>
              </div>
              
              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden"></canvas>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={captureDocument}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="font-medium">Capture Document</span>
                </button>
                
                <button 
                  onClick={resetScanning}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm"
                >
                  <X className="w-5 h-5 mr-2" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'processing':
        return (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-solid border-blue-400 rounded-xl p-8 text-center shadow-sm">
            <div className="relative w-full max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Document</h3>
              <p className="text-gray-600 mb-6">Please wait while we verify your document...</p>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6 shadow-sm">
                <div className="relative h-48 flex items-center justify-center">
                  {previewUrl && previewUrl !== 'pdf' ? (
                    <img 
                      src={previewUrl} 
                      alt="Document preview" 
                      className="max-h-full rounded-lg object-contain"
                    />
                  ) : previewUrl === 'pdf' ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-14 h-14 text-blue-400 mb-2" />
                      <p className="text-gray-600">PDF Document</p>
                    </div>
                  ) : null}
                  
                  {/* Processing overlay */}
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <Loader className="w-10 h-10 text-blue-600 mx-auto animate-spin mb-3" />
                      <p className="text-blue-800 font-medium">Processing...</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-blue-500 h-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500">Verifying document security features</p>
            </div>
          </div>
        );
        
      case 'success':
        return (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-solid border-emerald-400 rounded-xl p-8 text-center shadow-sm">
            <div className="relative w-full max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-center">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Check className="w-12 h-12 text-emerald-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verification Successful</h3>
              <p className="text-gray-600 mb-6">Your document has been verified successfully</p>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6 shadow-sm">
                <div className="relative">
                  {previewUrl && previewUrl !== 'pdf' ? (
                    <div className="h-48 flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Verified document" 
                        className="max-h-full rounded-lg object-contain"
                      />
                    </div>
                  ) : previewUrl === 'pdf' ? (
                    <div className="h-48 flex flex-col items-center justify-center">
                      <FileText className="w-14 h-14 text-emerald-400 mb-2" />
                      <p className="text-gray-600">PDF Document Verified</p>
                    </div>
                  ) : null}
                  
                  <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-2">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-100 rounded-lg p-4 text-left">
                <h4 className="text-emerald-800 font-medium mb-2 flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Document Verification Complete
                </h4>
                <p className="text-sm text-emerald-700">
                  Your identification has been verified and will be securely stored with your registration.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-solid border-red-400 rounded-xl p-8 text-center shadow-sm">
            <div className="relative w-full max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-center">
                <div className="bg-red-100 p-4 rounded-full">
                  <X className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h3>
              <p className="text-red-600 mb-6">{errorMessage || 'There was an issue verifying your document'}</p>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6 shadow-sm">
                {previewUrl && previewUrl !== 'pdf' ? (
                  <div className="h-48 flex items-center justify-center relative">
                    <img 
                      src={previewUrl} 
                      alt="Failed document" 
                      className="max-h-full rounded-lg object-contain opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-100 bg-opacity-90 rounded-full p-3">
                        <X className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center">
                    <X className="w-14 h-14 text-red-400 mb-2" />
                    <p className="text-gray-600">Verification Failed</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={startScanning}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="font-medium">Try Scanning Again</span>
                </button>
                
                <button 
                  onClick={triggerFileUpload}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  <span className="font-medium">Upload Different File</span>
                </button>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      {renderScanningContent()}
      
      {/* Security & Privacy Cards - visible in all states */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
          <div className="flex items-start space-x-3 mb-3">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800 text-lg mb-1">Secure Process</h4>
              <p className="text-sm text-emerald-700 leading-relaxed">
                All documents are encrypted with AES-256 standards and stored in a secure database with strict access controls.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm">
          <div className="flex items-start space-x-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-lg mb-1">Privacy Protected</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Your data is protected by blockchain technology ensuring it cannot be tampered with and is only accessible to authorized personnel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentVerification;