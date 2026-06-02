import { authenticate, requireRole, checkDriverStatus, createErrorResponse, getPathParam } from '../../../../../src/middleware/auth';
import { DriverService } from '../../../../../src/services/driver.service';

export async function PATCH(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const pendingError = checkDriverStatus(user, request.url);
  if (pendingError) return createErrorResponse(pendingError.error, pendingError.status);

  if (!user.driverId) return createErrorResponse('Driver profile not found', 404);

  const notificationId = getPathParam(request, 'id', ctx);

  try {
    const updated = DriverService.markRead(user.driverId, notificationId);
    return Response.json({ success: true, notification: updated });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
