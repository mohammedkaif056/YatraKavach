/**
 * Emergency Response System Types
 * Production-grade interfaces for mission-critical emergency response
 * 
 * Security: All data assumes AES-256 encryption at rest, TLS in transit
 * Compliance: Follows chain-of-custody and audit requirements
 * Accessibility: Supports screen readers and keyboard navigation
 */

export type UserRole = 'operator' | 'dispatcher' | 'field_responder' | 'unit_lead' | 'investigator' | 'legal' | 'supervisor' | 'auditor';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'RESOLVED';

export type IncidentStatus = 'PENDING' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESOLVED' | 'CANCELLED';

export type ResponderStatus = 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'OFF_DUTY' | 'EMERGENCY' | 'OFFLINE';

export type EvidenceType = 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'TELEMETRY' | 'COMMUNICATION';

export type SystemStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';

// Core Incident Interface
export interface Incident {
  id: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    accuracy: number;
  };
  tourist: {
    id: string;
    name: string;
    phone: string;
    emergencyContact: string;
    language: string;
    digitalId: string;
  };
  assignedUnits: string[];
  createdAt: Date;
  updatedAt: Date;
  estimatedETA: number; // minutes
  distance: number; // kilometers
  safetyScore: number; // 0-100
  aiConfidence: number; // 0-100
  aiReasoning: string;
  tags: string[];
  metadata: {
    source: string;
    verified: boolean;
    priority: number;
    geoFenceBreached: boolean;
    lastCommunication: Date;
  };
}

// AI Priority Scoring
export interface AIPriority {
  score: number; // 0-100
  factors: {
    severity: number;
    distance: number;
    responseTime: number;
    touristMovement: number;
    historicalData: number;
    weatherConditions: number;
  };
  reasoning: string;
  confidence: number;
  lastUpdated: Date;
}

// Responder/Unit Interface
export interface ResponderUnit {
  id: string;
  callSign: string;
  type: 'POLICE' | 'MEDICAL' | 'RESCUE' | 'FIRE' | 'COORDINATOR';
  status: ResponderStatus;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
    lastUpdate: Date;
  };
  crew: {
    lead: string;
    members: string[];
    specializations: string[];
  };
  equipment: string[];
  availability: {
    available: boolean;
    eta: number; // minutes to any location
    currentIncidentId?: string;
  };
  lastCheckIn: Date;
  communicationMethod: 'RADIO' | 'PHONE' | 'SMS' | 'APP';
}

// Evidence Management
export interface Evidence {
  id: string;
  incidentId: string;
  type: EvidenceType;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  hash: string; // SHA-256 for integrity
  ipfsHash?: string; // Distributed storage
  encryptionKey: string; // AES-256 key reference
  metadata: {
    timestamp: Date;
    location?: { lat: number; lng: number };
    uploadedBy: string;
    uploadedAt: Date;
    deviceInfo: string;
    chain: ChainOfCustodyEntry[];
  };
  tags: string[];
  redacted: boolean;
  legal: {
    admissible: boolean;
    consentObtained: boolean;
    retentionPolicy: string;
    accessLog: AccessLogEntry[];
  };
}

// Chain of Custody
export interface ChainOfCustodyEntry {
  id: string;
  action: 'CREATED' | 'ACCESSED' | 'MODIFIED' | 'TRANSFERRED' | 'EXPORTED' | 'DELETED';
  userId: string;
  userRole: UserRole;
  timestamp: Date;
  description: string;
  signature: string; // Digital signature
  ipAddress: string;
  location?: string;
}

// Access Control
export interface AccessLogEntry {
  userId: string;
  userRole: UserRole;
  action: 'VIEW' | 'DOWNLOAD' | 'EXPORT' | 'REDACT' | 'LOCK';
  timestamp: Date;
  ipAddress: string;
  purpose: string;
  authorized: boolean;
}

// Real-time Communication
export interface CommunicationLog {
  id: string;
  incidentId: string;
  type: 'VOICE' | 'SMS' | 'RADIO' | 'APP_MESSAGE' | 'EMAIL' | 'SYSTEM';
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  delivered: boolean;
  read: boolean;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  attachments: string[]; // Evidence IDs
  translation?: {
    originalLanguage: string;
    translatedText: string;
    confidence: number;
  };
}

// System Health & Status
export interface SystemHealth {
  overall: SystemStatus;
  components: {
    database: SystemStatus;
    websocket: SystemStatus;
    gps: SystemStatus;
    mapTiles: SystemStatus;
    voiceService: SystemStatus;
    aiEngine: SystemStatus;
  };
  lastChecked: Date;
  alerts: SystemAlert[];
}

export interface SystemAlert {
  id: string;
  type: 'ERROR' | 'WARNING' | 'INFO';
  component: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  actionRequired: boolean;
}

// Offline Queue Management
export interface OfflineAction {
  id: string;
  type: 'CREATE_INCIDENT' | 'UPDATE_STATUS' | 'UPLOAD_EVIDENCE' | 'SEND_MESSAGE';
  payload: Record<string, unknown>;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  priority: number;
}

// Role-Based Access Control
export interface RBACPermission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'export' | 'redact')[];
  conditions?: {
    ownRecordsOnly?: boolean;
    timeWindow?: number; // hours
    locationRestriction?: boolean;
  };
}

export interface UserPermissions {
  role: UserRole;
  permissions: RBACPermission[];
  temporaryAccess?: {
    resource: string;
    expiresAt: Date;
    grantedBy: string;
  }[];
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: Date;
  };
}

// Filter & Search
export interface TriageFilters {
  severity?: IncidentSeverity[];
  status?: IncidentStatus[];
  unassigned?: boolean;
  language?: string[];
  geoRadius?: {
    center: { lat: number; lng: number };
    radius: number; // kilometers
  };
  timeRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

// Analytics & KPIs
export interface KPIMetrics {
  responseTime: {
    average: number; // minutes
    p95: number;
    p99: number;
  };
  resolutionRate: number; // percentage
  falseAlarmRate: number; // percentage
  activeIncidents: number;
  availableUnits: number;
  totalUnits: number;
}

// Export Configuration
export interface ExportConfig {
  format: 'PDF' | 'ZIP' | 'JSON' | 'CSV';
  includeEvidence: boolean;
  redactSensitive: boolean;
  digitalSignature: boolean;
  encryptOutput: boolean;
  purpose: string;
  authorizedBy: string;
}