/**
 * Session management service for the kiosk application
 * Handles session creation, clearing, and timeout management
 */

interface Session {
  id: string;
  deviceId: string;
  startedAt: number;
  lastActive: number;
  expiresAt: number;
  userLanguage?: string;
}

// Keep session data for 2 hours max (in milliseconds)
const SESSION_MAX_AGE = 2 * 60 * 60 * 1000;

/**
 * Initialize a new session for the kiosk
 * @param deviceId Unique identifier for this kiosk device
 * @returns The session object
 */
export function initializeSession(deviceId: string): Session {
  // Generate a unique session ID
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  
  // Create timestamp for session start
  const now = Date.now();
  
  // Create session object with expiry time
  const session: Session = {
    id: sessionId,
    deviceId,
    startedAt: now,
    lastActive: now,
    expiresAt: now + SESSION_MAX_AGE
  };
  
  // Store in sessionStorage
  sessionStorage.setItem('kioskSession', JSON.stringify(session));
  
  // Log session creation (no PII)
  console.info(`Session initialized: ${sessionId.substring(0, 10)}... on device ${deviceId.substring(0, 8)}...`);
  
  return session;
}

/**
 * Get the current session if it exists and is valid
 * @returns The session object or null if no valid session exists
 */
export function getSession(): Session | null {
  const sessionJson = sessionStorage.getItem('kioskSession');
  
  if (!sessionJson) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionJson) as Session;
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error parsing session:', error);
    clearSession();
    return null;
  }
}

/**
 * Update the user's language preference in the session
 * @param language Language code (e.g. 'en', 'hi')
 */
export function updateSessionLanguage(language: string): void {
  const session = getSession();
  
  if (session) {
    session.userLanguage = language;
    session.lastActive = Date.now();
    sessionStorage.setItem('kioskSession', JSON.stringify(session));
  }
}

/**
 * Update the session's last active timestamp
 */
export function refreshSession(): void {
  const session = getSession();
  
  if (session) {
    session.lastActive = Date.now();
    sessionStorage.setItem('kioskSession', JSON.stringify(session));
  }
}

/**
 * Clear the current session
 */
export function clearSession(): void {
  // Get the session before clearing for logging
  const sessionJson = sessionStorage.getItem('kioskSession');
  
  // Remove from sessionStorage
  sessionStorage.removeItem('kioskSession');
  
  // Log session termination (no PII)
  if (sessionJson) {
    try {
      const session = JSON.parse(sessionJson) as Session;
      const duration = Math.floor((Date.now() - session.startedAt) / 1000);
      console.info(`Session terminated: ${session.id.substring(0, 10)}... (duration: ${duration}s)`);
    } catch (error) {
      console.error('Error parsing session during clearSession:', error);
    }
  }
}

/**
 * Check if the session is expired and needs to be renewed
 * @returns True if the session is expired, false otherwise
 */
export function isSessionExpired(): boolean {
  const session = getSession();
  return session === null;
}