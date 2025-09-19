import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Shield, Map, Menu, X, Bell, 
  Settings, LogOut, ChevronDown 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';

interface NavigationProps {
  variant?: 'tourist' | 'police' | 'emergency';
}

const Navigation: React.FC<NavigationProps> = ({ variant = 'tourist' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  const navItems = {
    tourist: [
      { path: '/tourist/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/tourist/map', icon: Map, label: 'Live Map' },
      { path: '/tourist/safety', icon: Shield, label: 'Safety' },
      { path: '/tourist/profile', icon: User, label: 'Profile' },
    ],
    police: [
      { path: '/police/dashboard', icon: Home, label: 'Command Center' },
      { path: '/police/monitoring', icon: Map, label: 'Live Monitoring' },
      { path: '/police/alerts', icon: Bell, label: 'Alerts' },
      { path: '/police/analytics', icon: Shield, label: 'Analytics' },
    ],
    emergency: [
      { path: '/emergency/response', icon: Home, label: 'Response Hub' },
      { path: '/emergency/incidents', icon: Shield, label: 'Incidents' },
      { path: '/emergency/resources', icon: Map, label: 'Resources' },
    ],
  };

  const currentItems = navItems[variant];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-emerald p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-primary-900">
                YatraKavach
              </span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {currentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative',
                      isActive(item.path)
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-emerald rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-gray-200 py-2"
                  >
                    <Link
                      to={`/${variant}/profile`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to={`/${variant}/settings`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span>Settings</span>
                    </Link>
                    <hr className="my-2" />
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-crimson-600">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-emerald p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-primary-900">
                YatraKavach
              </span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {currentItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                        isActive(item.path)
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {currentItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200',
                  isActive(item.path)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600'
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;