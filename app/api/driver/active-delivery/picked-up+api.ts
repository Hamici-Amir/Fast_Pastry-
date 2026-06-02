import { authenticate, requireRole, checkDriverStatus, createErrorResponse } from '../../../../src/middleware/auth';
import { DriverService } from '../../../../src/services/driver.service';

export async function PATCH(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const pendingError = checkDriverStatus(user, request.url);
  if (pendingError) return createErrorResponse(pendingError.error, pendingError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  const active = DriverService.getActiveDelivery(user.driverId);
  if (!active) {
    return createErrorResponse('No active delivery order to mark as picked up', 400);
  }

  try {
    const order = DriverService.markPickedUp(user.driverId, active.id);
    return Response.json({ success: true, message: 'Order marked as picked up', order });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
