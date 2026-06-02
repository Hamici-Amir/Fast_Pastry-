import { authenticate, requireRole, checkDriverStatus, createErrorResponse } from '../../../src/middleware/auth';
import { DriverService } from '../../../src/services/driver.service';

export async function PATCH(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const pendingError = checkDriverStatus(user, request.url);
  if (pendingError) return createErrorResponse(pendingError.error, pendingError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  try {
    const body = await request.json();
    if (!body || typeof body.isOnline !== 'boolean') {
      return createErrorResponse('Missing or invalid isOnline parameter in request body', 400);
    }

    const driver = DriverService.setOnlineStatus(user.driverId, body.isOnline);
    return Response.json({ success: true, message: 'Driver status updated', driver });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
