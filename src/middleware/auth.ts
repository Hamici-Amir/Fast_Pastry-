import { localDb, User, Driver } from '../db/localDb';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'DRIVER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  driverId?: string; // Maps to the driver.id if role is DRIVER
}

/**
 * Authenticates a request by looking at x-user-id and x-role headers.
 * In a real application, this would verify a JWT token in the Authorization header.
 */
export async function authenticate(request: Request): Promise<AuthenticatedUser | null> {
  const userId = request.headers.get('x-user-id') || request.headers.get('X-User-Id');
  
  if (!userId) {
    return null;
  }

  const db = localDb.getData();
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return null;
  }

  if (user.status === 'SUSPENDED') {
    return null; // Suspected / Suspended users are not allowed
  }

  let driverId: string | undefined;
  if (user.role === 'DRIVER') {
    const driver = db.drivers.find(d => d.userId === user.id);
    if (driver) {
      driverId = driver.id;
    }
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    driverId,
  };
}

/**
 * Validates if the authenticated user has the correct role.
 */
export function requireRole(user: AuthenticatedUser | null, allowedRoles: ('CLIENT' | 'DRIVER' | 'ADMIN')[]) {
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }
  if (!allowedRoles.includes(user.role)) {
    return { error: 'Forbidden: Insufficient Permissions', status: 403 };
  }
  return null;
}

/**
 * Blocks PENDING drivers from accessing standard driver dashboard/delivery APIs.
 * Allowing access only if the path includes "/onboarding/".
 */
export function checkDriverStatus(user: AuthenticatedUser, requestUrl: string) {
  if (user.role === 'DRIVER') {
    const db = localDb.getData();
    const driver = db.drivers.find(d => d.userId === user.id);
    
    // If onboarding route, allow PENDING drivers
    const url = new URL(requestUrl);
    if (url.pathname.includes('/onboarding/')) {
      return null;
    }

    if (driver && driver.status === 'PENDING') {
      return { error: 'Application under review', status: 403 };
    }
  }
  return null;
}

/**
 * Standard utility to generate JSON responses from middleware errors.
 */
export function createErrorResponse(error: string, status: number) {
  return Response.json(
    { success: false, error },
    { 
      status, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

/**
 * Extracts a dynamic path parameter from the request context or URL.
 * Works for both direct parameters (e.g. /customers/[id]) and nested action endpoints (e.g. /customers/[id]/suspend).
 */
export function getPathParam(request: Request, paramName: string, ctx?: any): string {
  if (ctx && ctx.params && ctx.params[paramName]) {
    return ctx.params[paramName];
  }
  
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return '';
  
  const lastSegment = segments[segments.length - 1];
  
  // List of standard trailing action keywords in the routes
  const actionKeywords = [
    'approve', 'reject', 'suspend', 'reactivate', 'orders', 
    'cancel', 'picked-up', 'delivered', 'report-issue', 
    'accept', 'payout', 'stats', 'read'
  ];
  
  if (actionKeywords.includes(lastSegment)) {
    // If the path ends with an action keyword, the parameter is the second to last segment
    return segments[segments.length - 2] || '';
  }
  
  return lastSegment;
}

