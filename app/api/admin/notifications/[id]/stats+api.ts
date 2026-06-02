import { authenticate, requireRole, createErrorResponse, getPathParam } from '../../../../src/middleware/auth';
import { AdminNotificationService } from '../../../../src/services/admin.notification.service';

export async function GET(request: Request, ctx: any) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const notificationId = getPathParam(request, 'id', ctx);

  try {
    const stats = AdminNotificationService.getNotificationStats(notificationId);
    return Response.json({ success: true, stats });
  } catch (err: any) {
    return createErrorResponse(err.message, 404);
  }
}
