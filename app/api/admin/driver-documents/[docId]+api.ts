import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../src/middleware/auth';
import { AdminDriverService } from '../../../src/services/admin.driver.service';

export async function PATCH(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const docId = getPathParam(request, 'docId', ctx);

  try {
    const body = await request.json();
    if (!body || !body.status) {
      return createErrorResponse('Missing status in request body', 400);
    }

    const document = await AdminDriverService.reviewDocument(docId, body.status);
    return Response.json({ success: true, message: 'Document status updated', document });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
