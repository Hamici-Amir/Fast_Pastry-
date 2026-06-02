import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../../src/middleware/auth';
import { AdminDriverService } from '../../../../src/services/admin.driver.service';

export async function PATCH(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const driverId = getPathParam(request, 'id', ctx);

  try {
    const driver = await AdminDriverService.approveDriver(driverId);
    return Response.json({ success: true, message: 'Driver approved successfully', driver });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
