// Mock tourist data with Guwahati, India coordinates
export const touristData = [
  { 
    id: 'T001', 
    name: 'Emma Wilson', 
    location: [26.156, 91.731], 
    status: 'normal', 
    nationality: '🇺🇸 USA', 
    checkInDate: '15 Sep', 
    hotel: 'Grand Residency', 
    lastActive: '5m ago' 
  },
  { 
    id: 'T002', 
    name: 'Liu Wei', 
    location: [26.158, 91.769], 
    status: 'alert', 
    nationality: '🇨🇳 China', 
    checkInDate: '12 Sep', 
    hotel: 'Hotel Himalaya', 
    lastActive: '2m ago' 
  },
  { 
    id: 'T003', 
    name: 'Sophie Martin', 
    location: [26.142, 91.744], 
    status: 'normal', 
    nationality: '🇫🇷 France', 
    checkInDate: '14 Sep', 
    hotel: 'Taj Vivanta', 
    lastActive: '18m ago' 
  },
  { 
    id: 'T004', 
    name: 'Raj Mehta', 
    location: [26.160, 91.758], 
    status: 'warning', 
    nationality: '🇬🇧 UK', 
    checkInDate: '10 Sep', 
    hotel: 'The Lily Hotel', 
    lastActive: '1h ago' 
  },
  { 
    id: 'T005', 
    name: 'Yuki Tanaka', 
    location: [26.153, 91.762], 
    status: 'normal', 
    nationality: '🇯🇵 Japan', 
    checkInDate: '16 Sep', 
    hotel: 'Radisson Blu', 
    lastActive: '30m ago' 
  }
];

// Mock alert data
export interface Alert {
  id: string;
  type: string;
  message: string;
  touristId: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'investigating' | 'resolved';
}

export const alertsData: Alert[] = [
  { 
    id: 'A001', 
    type: 'Harassment Report', 
    message: 'Tourist reported harassment from local vendor near Central Market. Requires immediate assistance.',
    touristId: 'T002', 
    location: 'Central Market', 
    time: '10:15 AM', 
    severity: 'high', 
    status: 'active' 
  },
  { 
    id: 'A002', 
    type: 'Lost Tourist', 
    message: 'Tourist separated from group in Old Town area. Unable to find way back to hotel.',
    touristId: 'T004', 
    location: 'Old Town', 
    time: '09:22 AM', 
    severity: 'medium', 
    status: 'active' 
  },
  { 
    id: 'A003', 
    type: 'Theft Report', 
    message: 'Tourist reports stolen wallet and passport in City Square. Last seen near food stalls.',
    touristId: 'T006', 
    location: 'City Square', 
    time: '08:45 AM', 
    severity: 'high', 
    status: 'investigating' 
  },
  { 
    id: 'A004', 
    type: 'Medical Assistance', 
    message: 'Tourist experiencing symptoms of heat stroke. Local clinic providing initial care.',
    touristId: 'T008', 
    location: 'Temple Road', 
    time: 'Yesterday', 
    severity: 'medium', 
    status: 'resolved' 
  },
];

// Stats data
export const statsData = [
  { 
    title: 'Active Tourists', 
    value: 267, 
    change: '+15%', 
    icon: 'Users',
    color: 'blue' 
  },
  { 
    title: 'Safety Score', 
    value: '96.4%', 
    change: '+2.3%', 
    icon: 'Shield',
    color: 'emerald' 
  },
  { 
    title: 'Active Alerts', 
    value: 13, 
    change: '-4', 
    icon: 'AlertTriangle',
    color: 'amber' 
  },
  { 
    title: 'Avg Response', 
    value: '1.8m', 
    change: '-14%', 
    icon: 'Clock',
    color: 'purple' 
  },
];

// Tourism data
export const tourismData = {
  dailyArrivals: [42, 56, 78, 65, 89, 74, 102],
  countriesOfOrigin: [
    { country: 'USA', count: 56, percentage: 20.8 },
    { country: 'UK', count: 43, percentage: 16.0 },
    { country: 'Japan', count: 38, percentage: 14.1 },
    { country: 'Germany', count: 32, percentage: 11.9 },
    { country: 'France', count: 29, percentage: 10.8 },
    { country: 'Australia', count: 25, percentage: 9.3 },
    { country: 'Others', count: 46, percentage: 17.1 }
  ],
  popularDestinations: [
    { name: 'Kamakhya Temple', visits: 189 },
    { name: 'Umananda Temple', visits: 145 },
    { name: 'Brahmaputra River Cruise', visits: 132 },
    { name: 'Assam State Museum', visits: 98 },
    { name: 'Srimanta Sankardeva Kalakshetra', visits: 87 }
  ],
  incidentTypes: [
    { type: 'Lost Items', count: 24 },
    { type: 'Harassment', count: 13 },
    { type: 'Medical Issues', count: 18 },
    { type: 'Transport Problems', count: 21 },
    { type: 'Theft', count: 8 }
  ]
};