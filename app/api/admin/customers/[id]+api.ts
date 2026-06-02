import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../src/middleware/auth';
import { AdminCustomerService } from '../../../src/services/admin.customer.service';

export async function GET(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const customerId = getPathParam(request, 'id', ctx);

  try {
    const customer = AdminCustomerService.getCustomerDetails(customerId);
    return Response.json({ success: true, customer });
  } catch (err: any) {
    return createErrorResponse(err.message, 404);
  }
}

export async function DELETE(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const customerId = getPathParam(request, 'id', ctx);

  try {
    const deletedCustomer = AdminCustomerService.deleteCustomer(customerId);
    return Response.json({ success: true, message: 'Customer deleted successfully', customer: deletedCustomer });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
