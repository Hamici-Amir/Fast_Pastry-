import { authenticate, requireRole, createErrorResponse } from '../../../src/middleware/auth';
import { AdminDriverService } from '../../../src/services/admin.driver.service';

export async function GET(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  try {
    const drivers = AdminDriverService.getAvailableDrivers();
    return Response.json({ success: true, drivers });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
