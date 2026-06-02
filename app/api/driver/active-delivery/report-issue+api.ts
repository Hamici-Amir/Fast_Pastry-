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

  const active = DriverService.getActiveDelivery(user.driverId);
  if (!active) {
    return createErrorResponse('No active delivery order to report issue on', 400);
  }

  try {
    const body = await request.json();
    if (!body || !body.description) {
      return createErrorResponse('Missing description in request body', 400);
    }

    const issue = DriverService.reportIssue(user.driverId, active.id, body.description);
    return Response.json({ success: true, message: 'Issue reported successfully', issue });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
