import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const handleScan = () => {
    // Placeholder for barcode scanning logic
    // In a real implementation, you would use a library like QuaggaJS or ZXing
    const mockBarcode = '1234567890123';
    onScan(mockBarcode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Barcode Scanner</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-100 rounded-lg"
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary-500 rounded-lg w-48 h-32 animate-pulse" />
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Position the barcode within the frame to scan
            </p>
            <button
              onClick={handleScan}
              disabled={!isScanning}
              className="btn btn-primary"
            >
              Scan Barcode
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Note: This is a placeholder component.</p>
            <p>In production, integrate with a barcode scanning library.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
