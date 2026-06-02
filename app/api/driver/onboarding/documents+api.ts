import { authenticate, requireRole, createErrorResponse } from '../../../../src/middleware/auth';
import { DriverOnboardingService } from '../../../../src/services/driver.onboarding.service';

export async function POST(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  let type: any = null;
  let file: any = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      type = formData.get('type');
      file = formData.get('file');
    } else {
      // Fallback to JSON body for easy testing / manual REST queries
      const body = await request.json();
      type = body.type;
      file = body.file;
    }

    if (!type || !file) {
      return createErrorResponse('Missing type or file parameters', 400);
    }

    const data = await DriverOnboardingService.uploadDocument(user.driverId, type, file);
    return Response.json({ success: true, message: 'Document uploaded successfully', ...data });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
