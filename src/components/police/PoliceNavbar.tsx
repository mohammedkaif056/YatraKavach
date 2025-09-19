import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Bell, 
  BarChart3, 
  Users, 
  Menu, 
  X, 
  UserCircle, 
  LogOut,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  Search,
  Shield
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useLocalization } from '../../contexts/LocalizationContext';

// Define the navigation items
interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  permission?: string;
}

const PoliceNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, setMode, isDark } = useTheme();
  const { alerts } = useWebSocket();
  const { t } = useLocalization();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle scroll events to adjust navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Get unread alerts count
  const unreadAlertCount = alerts.filter(alert => alert.status === 'new').length;
  
  // Define navigation items
  const navItems: NavItem[] = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: t('dashboard')
    },
    { 
      path: '/alerts', 
      icon: Bell, 
      label: t('alerts'),
      badge: unreadAlertCount
    },
    { 
      path: '/analytics', 
      icon: BarChart3, 
      label: t('analytics'),
      permission: 'view_analytics'
    },
    { 
      path: '/tourists', 
      icon: Users, 
      label: t('tourists'),
      permission: 'view_tourists'
    }
  ];
  
  // Check if a path is active
  const isActive = (path: string) => location.pathname === path;
  
  // Get the current route title
  const getCurrentTitle = (): string => {
    const currentItem = navItems.find(item => isActive(item.path));
    if (currentItem) return currentItem.label;
    
    // Extract route name from path if no match
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length > 2) {
      return pathSegments[2].charAt(0).toUpperCase() + pathSegments[2].slice(1);
    }
    
    return 'Command Center';
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <>
      {/* Large title header for top of page - Apple style */}
      <header 
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          isScrolled 
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
            : "bg-white dark:bg-gray-900"
        )}
      >
        {/* Large title when not scrolled */}
        <div className={cn(
          "px-4 pt-4 pb-2 transition-all duration-200",
          isScrolled ? "hidden" : "block"
        )}>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {getCurrentTitle()}
          </h1>
        </div>
        
        {/* Navbar content */}
        <div className={cn(
          "px-4 flex items-center justify-between",
          isScrolled ? "h-16" : "h-14"
        )}>
          {/* Left: Logo + Title on scroll */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Logo - shown when scrolled */}
            <Link to="/dashboard" className={cn(
              "items-center space-x-2",
              isScrolled ? "flex" : "hidden"
            )}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Shield size={18} className="text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                YatraKavach
              </span>
            </Link>
            
            {/* Compact title when scrolled */}
            <h2 className={cn(
              "font-medium text-lg text-gray-900 dark:text-white",
              isScrolled ? "block" : "hidden"
            )}>
              {getCurrentTitle()}
            </h2>
          </div>
          
          {/* Center: Navigation links (desktop only) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors",
                  isActive(item.path)
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    layoutId="activeNavIndicator"
                  />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Right: Search, Theme, Profile */}
          <div className="flex items-center space-x-2">
            {/* Search button */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-40 lg:w-56 h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-700 focus:ring-0 text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            {/* Theme toggle */}
            <button
              onClick={() => setMode(isDark ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun size={20} className="text-amber-300" />
              ) : (
                <Moon size={20} className="text-gray-500" />
              )}
            </button>
            
            {/* Notification bell */}
            <Link
              to="/alerts"
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell size={20} />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                </span>
              )}
            </Link>
            
            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {user?.role}
                        </span>
                        {user?.badgeNumber && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            #{user.badgeNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="px-4 py-2 flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <UserCircle size={18} />
                        <span>{t('profile')}</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="px-4 py-2 flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings size={18} />
                        <span>{t('settings')}</span>
                      </Link>
                    </div>
                    
                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="px-4 py-2 flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <LogOut size={18} />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile slide-over menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/80 z-50"
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl flex flex-col"
            >
              {/* Menu header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Shield size={20} className="text-white" />
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    YatraKavach
                  </span>
                </div>
                <button
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* User info */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
                  </div>
                </div>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-700 focus:ring-0 text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </form>
              </div>
              
              {/* Navigation links */}
              <div className="flex-1 overflow-y-auto p-2">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors",
                        isActive(item.path)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      )}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <item.icon size={22} />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white ml-auto">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Bottom actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMode(isDark ? 'light' : 'dark');
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {isDark ? (
                      <>
                        <Sun size={20} className="text-amber-300" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={20} />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PoliceNavbar;