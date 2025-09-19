import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, Sun, Cloud, CloudSnow, Wind,
  Droplets, Eye, Gauge, AlertTriangle, CheckCircle,
  ChevronRight, Calendar, Clock, MapPin
} from 'lucide-react';

interface WeatherData {
  id: number;
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  uvIndex: number;
  precipitation: number;
  safetyLevel: 'safe' | 'caution' | 'danger';
  recommendations: string[];
}

interface WeatherForecastProps {
  isVisible: boolean;
  onClose: () => void;
  location: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ isVisible, onClose, location }) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');
  
  // Mock weather data for demonstration
  const weeklyForecast = [
    {
      date: 'Today',
      high: 24,
      low: 18,
      condition: 'Light Rain',
      icon: 'rain',
      precipitation: 70,
      safetyLevel: 'caution' as const
    },
    {
      date: 'Tomorrow',
      high: 27,
      low: 20,
      condition: 'Partly Cloudy',
      icon: 'cloud',
      precipitation: 20,
      safetyLevel: 'safe' as const
    },
    {
      date: 'Thu',
      high: 29,
      low: 22,
      condition: 'Sunny',
      icon: 'sun',
      precipitation: 5,
      safetyLevel: 'safe' as const
    },
    {
      date: 'Fri',
      high: 25,
      low: 19,
      condition: 'Heavy Rain',
      icon: 'rain',
      precipitation: 90,
      safetyLevel: 'danger' as const
    },
    {
      date: 'Sat',
      high: 23,
      low: 17,
      condition: 'Thunderstorm',
      icon: 'storm',
      precipitation: 85,
      safetyLevel: 'danger' as const
    }
  ];

  const hourlyForecast: WeatherData[] = [
    {
      id: 1,
      time: 'Now',
      temperature: 22,
      condition: 'Light Rain',
      icon: 'rain',
      humidity: 78,
      windSpeed: 12,
      windDirection: 'SW',
      visibility: 8,
      pressure: 1013,
      uvIndex: 2,
      precipitation: 65,
      safetyLevel: 'caution',
      recommendations: ['Carry umbrella', 'Wear waterproof shoes', 'Check road conditions']
    },
    {
      id: 2,
      time: '2 PM',
      temperature: 23,
      condition: 'Moderate Rain',
      icon: 'rain',
      humidity: 82,
      windSpeed: 15,
      windDirection: 'SW',
      visibility: 6,
      pressure: 1012,
      uvIndex: 1,
      precipitation: 80,
      safetyLevel: 'caution',
      recommendations: ['Avoid outdoor activities', 'Stay in safe areas', 'Monitor flash flood warnings']
    },
    {
      id: 3,
      time: '4 PM',
      temperature: 21,
      condition: 'Heavy Rain',
      icon: 'rain',
      humidity: 88,
      windSpeed: 18,
      windDirection: 'W',
      visibility: 4,
      pressure: 1011,
      uvIndex: 0,
      precipitation: 95,
      safetyLevel: 'danger',
      recommendations: ['Seek indoor shelter immediately', 'Avoid travel if possible', 'Emergency contacts ready']
    },
    {
      id: 4,
      time: '6 PM',
      temperature: 20,
      condition: 'Light Rain',
      icon: 'rain',
      humidity: 85,
      windSpeed: 14,
      windDirection: 'W',
      visibility: 7,
      pressure: 1012,
      uvIndex: 0,
      precipitation: 70,
      safetyLevel: 'caution',
      recommendations: ['Continue indoor activities', 'Prepare for evening travel', 'Check transportation status']
    },
    {
      id: 5,
      time: '8 PM',
      temperature: 19,
      condition: 'Cloudy',
      icon: 'cloud',
      humidity: 75,
      windSpeed: 10,
      windDirection: 'NW',
      visibility: 10,
      pressure: 1014,
      uvIndex: 0,
      precipitation: 30,
      safetyLevel: 'safe',
      recommendations: ['Safe for short trips', 'Light jacket recommended', 'Good visibility for travel']
    }
  ];

  const currentWeather = hourlyForecast[0];

  const getWeatherIcon = (icon: string, size: string = 'w-6 h-6') => {
    switch (icon) {
      case 'sun':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'cloud':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'rain':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${size} text-blue-300`} />;
      case 'storm':
        return <CloudRain className={`${size} text-purple-600`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'emerald';
      case 'caution':
        return 'yellow';
      case 'danger':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  {getWeatherIcon(currentWeather.icon, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Weather Forecast</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Current Weather Card */}
            <motion.div
              className={`p-6 rounded-2xl mb-6 bg-gradient-to-br ${
                currentWeather.safetyLevel === 'safe' ? 'from-emerald-50 to-green-100 border-emerald-200' :
                currentWeather.safetyLevel === 'caution' ? 'from-yellow-50 to-orange-100 border-yellow-200' :
                'from-red-50 to-pink-100 border-red-200'
              } border-2`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getWeatherIcon(currentWeather.icon, 'w-12 h-12')}
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{currentWeather.temperature}°C</p>
                    <p className="text-gray-600 font-medium">{currentWeather.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {getSafetyIcon(currentWeather.safetyLevel)}
                    <span className={`font-bold text-${getSafetyColor(currentWeather.safetyLevel)}-700 capitalize`}>
                      {currentWeather.safetyLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{currentWeather.precipitation}% rain</p>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Humidity</p>
                  <p className="font-bold text-gray-900">{currentWeather.humidity}%</p>
                </div>
                <div className="text-center">
                  <Wind className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Wind</p>
                  <p className="font-bold text-gray-900">{currentWeather.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                  <Eye className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Visibility</p>
                  <p className="font-bold text-gray-900">{currentWeather.visibility} km</p>
                </div>
              </div>

              {/* Safety Recommendations */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Safety Recommendations:</span>
                </p>
                {currentWeather.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span>{rec}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* View Mode Toggle */}
            <div className="flex space-x-2 mb-4">
              <motion.button
                onClick={() => setViewMode('hourly')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'hourly' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Hourly
              </motion.button>
              <motion.button
                onClick={() => setViewMode('daily')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                5-Day
              </motion.button>
            </div>

            {/* Forecast Display */}
            <div className="space-y-3">
              {viewMode === 'hourly' ? (
                // Hourly Forecast
                hourlyForecast.slice(1).map((hour, index) => (
                  <motion.div
                    key={hour.id}
                    className="flex items-center justify-between p-3 bg-gray-50/70 rounded-xl border border-gray-100/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 0.9)' }}
                  >
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(hour.icon, 'w-5 h-5')}
                      <div>
                        <p className="font-semibold text-gray-900">{hour.time}</p>
                        <p className="text-sm text-gray-600">{hour.condition}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{hour.temperature}°</p>
                        <p className="text-xs text-blue-600">{hour.precipitation}%</p>
                      </div>
                      {getSafetyIcon(hour.safetyLevel)}
                    </div>
                  </motion.div>
                ))
              ) : (
                // Daily Forecast
                weeklyForecast.slice(1).map((day, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50/70 rounded-xl border border-gray-100/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 0.9)' }}
                  >
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(day.icon, 'w-5 h-5')}
                      <div>
                        <p className="font-semibold text-gray-900">{day.date}</p>
                        <p className="text-sm text-gray-600">{day.condition}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{day.high}° / {day.low}°</p>
                        <p className="text-xs text-blue-600">{day.precipitation}%</p>
                      </div>
                      {getSafetyIcon(day.safetyLevel)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Weather Radar Button */}
            <motion.button
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gauge className="w-5 h-5" />
              <span>View Weather Radar</span>
            </motion.button>

            <motion.button
              onClick={onClose}
              className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WeatherForecast;