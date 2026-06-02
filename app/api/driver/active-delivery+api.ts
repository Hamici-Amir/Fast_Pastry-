import { authenticate, requireRole, checkDriverStatus, createErrorResponse } from '../../../src/middleware/auth';
import { DriverService } from '../../../src/services/driver.service';

export async function GET(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const pendingError = checkDriverStatus(user, request.url);
  if (pendingError) return createErrorResponse(pendingError.error, pendingError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  try {
    const activeDelivery = DriverService.getActiveDelivery(user.driverId);
    return Response.json({ success: true, activeDelivery });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
