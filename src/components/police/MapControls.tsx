import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onLayerToggle: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onLayerToggle
}) => {
  return (
    <motion.div 
      className="absolute top-4 right-4 z-[1000] bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-blue-600/30 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onZoomIn}
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </motion.button>
      
      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-blue-600/30 transition-colors border-t border-gray-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </motion.button>
      
      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-blue-600/30 transition-colors border-t border-gray-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRecenter}
        title="Recenter Map"
      >
        <Compass className="w-4 h-4" />
      </motion.button>
      
      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-blue-600/30 transition-colors border-t border-gray-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLayerToggle}
        title="Toggle Map Layers"
      >
        <Layers className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default MapControls;