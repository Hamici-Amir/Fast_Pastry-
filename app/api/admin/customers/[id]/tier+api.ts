import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../../src/middleware/auth';
import { AdminCustomerService } from '../../../../src/services/admin.customer.service';

export async function PATCH(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const customerId = getPathParam(request, 'id', ctx);
  
  try {
    const body = await request.json();
    if (!body || !body.tier) {
      return createErrorResponse('Missing tier in request body', 400);
    }
    const updated = AdminCustomerService.updateCustomerTier(customerId, body.tier);
    return Response.json({ success: true, user: updated });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
