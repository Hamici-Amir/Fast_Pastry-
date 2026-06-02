import { authenticate, requireRole, createErrorResponse } from '../../../src/middleware/auth';
import { AdminNotificationService } from '../../../src/services/admin.notification.service';

export async function GET(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const data = AdminNotificationService.getNotificationHistory({ page, limit });
    return Response.json({ success: true, ...data });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}

export async function POST(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['ADMIN']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  try {
    const body = await request.json();
    if (!body || !body.title || !body.body || !body.type || !body.targetAudience) {
      return createErrorResponse('Missing required fields: title, body, type, targetAudience', 400);
    }

    const notification = await AdminNotificationService.sendNotification({
      title: body.title,
      body: body.body,
      type: body.type,
      targetAudience: body.targetAudience,
      isBoosted: !!body.isBoosted,
      scheduledAt: body.scheduledAt || undefined,
    });

    return Response.json({ success: true, message: 'Notification processed', notification });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
