import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../../src/middleware/auth';
import { AdminDriverService } from '../../../../src/services/admin.driver.service';

export async function PATCH(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const driverId = getPathParam(request, 'id', ctx);

  try {
    const body = await request.json();
    if (!body || !body.reason) {
      return createErrorResponse('Missing reason in request body', 400);
    }

    const driver = await AdminDriverService.rejectDriver(driverId, body.reason);
    return Response.json({ success: true, message: 'Driver rejected successfully', driver });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
