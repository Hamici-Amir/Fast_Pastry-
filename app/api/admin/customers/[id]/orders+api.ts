import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../../src/middleware/auth';
import { AdminCustomerService } from '../../../../src/services/admin.customer.service';

export async function GET(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const customerId = getPathParam(request, 'id', ctx);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const data = AdminCustomerService.getCustomerOrderHistory(customerId, { page, limit });
    return Response.json({ success: true, ...data });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
