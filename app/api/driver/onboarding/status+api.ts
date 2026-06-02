import { authenticate, requireRole, createErrorResponse } from '../../../../src/middleware/auth';
import { DriverOnboardingService } from '../../../../src/services/driver.onboarding.service';

export async function GET(request: Request) {
  const user = await authenticate(request);
  const authError = requireRole(user, ['DRIVER']);
  if (authError) return createErrorResponse(authError.error, authError.status);

  if (!user.driverId) {
    return createErrorResponse('Driver profile not found for this user', 404);
  }

  try {
    const data = DriverOnboardingService.getApplicationStatus(user.driverId);
    return Response.json({ success: true, ...data });
  } catch (err: any) {
    return createErrorResponse(err.message, 400);
  }
}
