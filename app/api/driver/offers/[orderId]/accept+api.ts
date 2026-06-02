import { authenticate, requireRole, checkDriverStatus, createErrorResponse, getPathParam } from '../../../../src/middleware/auth';
import { DriverService } from '../../../../src/services/driver.service';

export async function POST(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const pendingError = checkDriverStatus(user, request.url);
  if (pendingError) return createErrorResponse(pendingError.error, pendingError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  const orderId = getPathParam(request, 'orderId', ctx);

  try {
    const order = DriverService.acceptOffer(user.driverId, orderId);
    return Response.json({ success: true, message: 'Offer accepted successfully', order });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
