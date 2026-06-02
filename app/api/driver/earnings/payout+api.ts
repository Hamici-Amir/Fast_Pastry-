import { authenticate, requireRole, checkDriverStatus, createErrorResponse } from '../../../../src/middleware/auth';
import { DriverService } from '../../../../src/services/driver.service';

export async function POST(request: Request) {
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
    if (!body || typeof body.amount !== 'number') {
      return createErrorResponse('Missing or invalid amount in request body', 400);
    }

    const payout = DriverService.requestPayout(user.driverId, body.amount);
    return Response.json({ success: true, message: 'Payout requested successfully', payout });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
