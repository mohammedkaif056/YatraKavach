export interface Tourist {
  id: string;
  name: string;
  age: number;
  nationality: string;
  avatar: string;
  currentLocation: string;
  destination: string;
  safetyScore: number;
  status: 'active' | 'inactive' | 'emergency';
  lastSeen: string;
  emergencyContact: string;
  tripProgress: number;
  currentDay: number;
  totalDays: number;
  distanceTraveled: number;
}

export interface Alert {
  id: string;
  touristId: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved' | 'investigating';
  time: string;
  location: string;
}

export interface Stats {
  totalTourists: number;
  activeTourists: number;
  safetyScore: number;
  incidentsResolved: number;
  averageResponseTime: number;
}

export interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export const mockData = {
  currentUser: {
    id: '1',
    name: 'Rohit Sharma',
    age: 28,
    nationality: 'Indian',
    avatar: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=150',
    currentLocation: 'Shillong, Meghalaya',
    destination: 'Northeast India Circuit',
    safetyScore: 87,
    status: 'active' as const,
    lastSeen: '2 minutes ago',
    emergencyContact: '+91-9876543210',
    tripProgress: 65,
    currentDay: 4,
    totalDays: 7,
    distanceTraveled: 23
  },

  tourists: [
    {
      id: '1',
      name: 'Rohit Sharma',
      age: 28,
      nationality: 'Indian',
      avatar: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=150',
      currentLocation: 'Shillong, Meghalaya',
      destination: 'Northeast India Circuit',
      safetyScore: 87,
      status: 'active' as const,
      lastSeen: '2 minutes ago',
      emergencyContact: '+91-9876543210',
      tripProgress: 65,
      currentDay: 4,
      totalDays: 7,
      distanceTraveled: 23
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      age: 35,
      nationality: 'Indian',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      currentLocation: 'Gangtok, Sikkim',
      destination: 'Sikkim Adventure',
      safetyScore: 92,
      status: 'active' as const,
      lastSeen: '5 minutes ago',
      emergencyContact: '+91-9876543211',
      tripProgress: 80,
      currentDay: 6,
      totalDays: 8,
      distanceTraveled: 45
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      age: 24,
      nationality: 'American',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      currentLocation: 'Guwahati, Assam',
      destination: 'Cultural Exploration',
      safetyScore: 75,
      status: 'active' as const,
      lastSeen: '1 minute ago',
      emergencyContact: '+1-555-0123',
      tripProgress: 40,
      currentDay: 2,
      totalDays: 10,
      distanceTraveled: 12
    },
    {
      id: '4',
      name: 'Amit Patel',
      age: 31,
      nationality: 'Indian',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      currentLocation: 'Imphal, Manipur',
      destination: 'Heritage Tour',
      safetyScore: 95,
      status: 'active' as const,
      lastSeen: '8 minutes ago',
      emergencyContact: '+91-9876543212',
      tripProgress: 90,
      currentDay: 8,
      totalDays: 9,
      distanceTraveled: 67
    }
  ],

  alerts: [
    {
      id: '1',
      touristId: '3',
      type: 'Geo-fence Breach',
      message: 'Tourist has moved outside designated safe zone near Kaziranga National Park',
      severity: 'high' as const,
      status: 'active' as const,
      time: '2 minutes ago',
      location: 'Kaziranga National Park'
    },
    {
      id: '2',
      touristId: '1',
      type: 'Weather Alert',
      message: 'Heavy rainfall warning issued for Shillong area. Tourists advised to seek shelter',
      severity: 'medium' as const,
      status: 'active' as const,
      time: '15 minutes ago',
      location: 'Shillong, Meghalaya'
    },
    {
      id: '6',
      touristId: '2',
      type: 'SOS Signal',
      message: 'Tourist triggered SOS button. Last location: Tawang Monastery area with poor connectivity',
      severity: 'high' as const,
      status: 'active' as const,
      time: '4 minutes ago',
      location: 'Tawang, Arunachal Pradesh'
    },
    {
      id: '7',
      touristId: '4',
      type: 'Medical Emergency',
      message: 'Tourist reported symptoms of altitude sickness and requires immediate assistance',
      severity: 'high' as const,
      status: 'active' as const,
      time: '7 minutes ago',
      location: 'Nathu La, Sikkim'
    },
    {
      id: '3',
      touristId: '2',
      type: 'Check-in Reminder',
      message: 'Tourist has not checked in for 6 hours. Last location: Gangtok city center',
      severity: 'medium' as const,
      status: 'investigating' as const,
      time: '1 hour ago',
      location: 'Gangtok, Sikkim'
    },
    {
      id: '4',
      touristId: '4',
      type: 'Safety Update',
      message: 'All safety protocols successfully followed. Tourist reached planned destination',
      severity: 'low' as const,
      status: 'resolved' as const,
      time: '2 hours ago',
      location: 'Imphal, Manipur'
    },
    {
      id: '5',
      touristId: '1',
      type: 'Cultural Alert',
      message: 'Local festival activity detected. Increased crowd density in tourist area',
      severity: 'low' as const,
      status: 'active' as const,
      time: '3 hours ago',
      location: 'Shillong, Meghalaya'
    }
  ],

  stats: {
    totalTourists: 2847,
    activeTourists: 1523,
    safetyScore: 96,
    incidentsResolved: 342,
    averageResponseTime: 1.8
  },

  weather: {
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 8
  },

  locations: [
    { name: 'Shillong', state: 'Meghalaya', touristCount: 89, riskLevel: 'low' },
    { name: 'Gangtok', state: 'Sikkim', touristCount: 156, riskLevel: 'low' },
    { name: 'Guwahati', state: 'Assam', touristCount: 234, riskLevel: 'medium' },
    { name: 'Imphal', state: 'Manipur', touristCount: 67, riskLevel: 'low' },
    { name: 'Kohima', state: 'Nagaland', touristCount: 43, riskLevel: 'low' },
    { name: 'Itanagar', state: 'Arunachal Pradesh', touristCount: 78, riskLevel: 'medium' }
  ]
};