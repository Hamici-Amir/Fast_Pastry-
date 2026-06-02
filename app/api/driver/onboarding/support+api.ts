import { authenticate, requireRole, createErrorResponse } from '../../../../src/middleware/auth';
import { DriverOnboardingService } from '../../../../src/services/driver.onboarding.service';

export async function POST(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  try {
    const body = await request.json();
    if (!body || !body.message) {
      return createErrorResponse('Missing message in request body', 400);
    }

    const res = DriverOnboardingService.contactSupport(user.driverId, body.message);
    return Response.json({ success: true, ...res });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
