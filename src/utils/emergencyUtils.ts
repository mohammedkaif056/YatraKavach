/**
 * Emergency Response Utility Functions
 * Production-grade utilities for emergency response operations
 */

import { IncidentSeverity, IncidentStatus, EvidenceType } from '../types/emergency';

// Utility functions for prioritization and formatting
export const getSeverityColor = (severity: IncidentSeverity): string => {
  const colors = {
    CRITICAL: 'bg-red-600 text-white border-red-700',
    HIGH: 'bg-orange-500 text-white border-orange-600',
    MODERATE: 'bg-yellow-500 text-black border-yellow-600',
    LOW: 'bg-blue-500 text-white border-blue-600',
    RESOLVED: 'bg-green-500 text-white border-green-600'
  };
  return colors[severity] || colors.LOW;
};

export const getStatusColor = (status: IncidentStatus): string => {
  const colors = {
    PENDING: 'bg-gray-500',
    ACKNOWLEDGED: 'bg-blue-500',
    DISPATCHED: 'bg-purple-500',
    EN_ROUTE: 'bg-indigo-500',
    ON_SCENE: 'bg-green-500',
    RESOLVED: 'bg-emerald-500',
    CANCELLED: 'bg-gray-400'
  };
  return colors[status] || colors.PENDING;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Evidence type utilities
export const getEvidenceIcon = (type: EvidenceType): string => {
  const icons = {
    PHOTO: 'Image',
    VIDEO: 'Video', 
    AUDIO: 'Mic',
    DOCUMENT: 'FileText',
    TELEMETRY: 'FileText',
    COMMUNICATION: 'FileText'
  };
  return icons[type] || 'FileText';
};

export const getEvidenceColor = (type: EvidenceType): string => {
  const colors = {
    PHOTO: 'text-blue-600',
    VIDEO: 'text-purple-600',
    AUDIO: 'text-green-600',
    DOCUMENT: 'text-gray-600',
    TELEMETRY: 'text-orange-600',
    COMMUNICATION: 'text-indigo-600'
  };
  return colors[type] || 'text-gray-600';
};

// Encryption utilities placeholder
export class CryptoUtils {
  static async generateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async generateEncryptionKey(): Promise<string> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exported = await crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exported)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async encryptFile(file: File, key: CryptoKey): Promise<ArrayBuffer> {
    const fileBuffer = await file.arrayBuffer();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      fileBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return combined.buffer;
  }

  static async createDigitalSignature(data: string, privateKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, dataBuffer);
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Priority scoring algorithms
export const calculateAIPriority = (factors: {
  severity: number;
  distance: number;
  responseTime: number;
  touristMovement: number;
  historicalData: number;
  weatherConditions: number;
}): number => {
  const weights = {
    severity: 0.3,
    distance: 0.2,
    responseTime: 0.2,
    touristMovement: 0.15,
    historicalData: 0.1,
    weatherConditions: 0.05
  };
  
  return Object.entries(factors).reduce((total, [key, value]) => {
    const weight = weights[key as keyof typeof weights];
    return total + (value * weight);
  }, 0);
};

// Voice command processing
export const processVoiceCommand = (transcript: string): { 
  action: string; 
  parameters: Record<string, string> 
} => {
  const command = transcript.toLowerCase().trim();
  
  if (command.includes('acknowledge')) {
    return { action: 'acknowledge', parameters: {} };
  } else if (command.includes('dispatch')) {
    return { action: 'dispatch', parameters: {} };
  } else if (command.includes('call')) {
    return { action: 'call', parameters: {} };
  } else if (command.includes('escalate')) {
    return { action: 'escalate', parameters: {} };
  } else if (command.includes('search')) {
    const searchTerm = command.replace('search', '').trim();
    return { action: 'search', parameters: { query: searchTerm } };
  } else if (command.includes('filter')) {
    return { action: 'filter', parameters: {} };
  } else if (command.includes('export')) {
    return { action: 'export', parameters: {} };
  }
  
  return { action: 'unknown', parameters: {} };
};

// Data validation
export const validateIncident = (incident: unknown): boolean => {
  if (!incident || typeof incident !== 'object') return false;
  
  const required = ['id', 'severity', 'status', 'title', 'location', 'tourist'];
  return required.every(field => field in incident);
};

export const validateEvidence = (evidence: unknown): boolean => {
  if (!evidence || typeof evidence !== 'object') return false;
  
  const required = ['id', 'incidentId', 'type', 'filename', 'hash'];
  return required.every(field => field in evidence);
};

// Time utilities
export const formatTimestamp = (date: Date, options?: {
  includeTime?: boolean;
  relative?: boolean;
}): string => {
  const { includeTime = true, relative = false } = options || {};
  
  if (relative) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }
  
  const options_: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options_.hour = '2-digit';
    options_.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options_);
};

// Emergency contact utilities
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format based on country code
  if (digits.startsWith('91') && digits.length === 12) {
    // Indian number
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // US number
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return phone; // Return original if format unknown
};

// Accessibility utilities
export const generateAriaLabel = (incident: { 
  id: string; 
  title: string; 
  severity: IncidentSeverity; 
  status: IncidentStatus;
  estimatedETA: number;
}): string => {
  return `Incident ${incident.id}: ${incident.title}. Priority: ${incident.severity}. Status: ${incident.status.replace('_', ' ')}. ETA: ${formatDuration(incident.estimatedETA)}.`;
};

export const announceUpdate = (message: string, priority: 'low' | 'medium' | 'high' = 'medium'): void => {
  // This would integrate with screen reader announcements
  console.log(`[${priority.toUpperCase()}] ${message}`);
  
  // Could also trigger browser notification for high priority
  if (priority === 'high' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification('Emergency Update', { body: message });
  }
};

// Export configuration helpers
export const generateExportFilename = (config: {
  type: string;
  incidentId?: string;
  timestamp: Date;
  format: string;
}): string => {
  const { type, incidentId, timestamp, format } = config;
  const dateStr = timestamp.toISOString().split('T')[0];
  const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '');
  
  if (incidentId) {
    return `${type}_${incidentId}_${dateStr}_${timeStr}.${format.toLowerCase()}`;
  }
  
  return `${type}_export_${dateStr}_${timeStr}.${format.toLowerCase()}`;
};