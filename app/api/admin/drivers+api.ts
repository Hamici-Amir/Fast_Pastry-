import { authenticate, requireRole, createErrorResponse } from '../../../src/middleware/auth';
import { AdminDriverService } from '../../../src/services/admin.driver.service';

export async function GET(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const url = new URL(request.url);
  const status = (url.searchParams.get('status') as any) || undefined;
  const search = url.searchParams.get('search') || undefined;
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const data = AdminDriverService.getDrivers({ status, search, page, limit });
    return Response.json({ success: true, ...data });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
