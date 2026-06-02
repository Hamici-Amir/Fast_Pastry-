/**
 * Integrations Layer for Fast Pastry.
 * Provides mock implementations for:
 * 1. Cloudinary (document uploads)
 * 2. Firebase Cloud Messaging (push notifications)
 * 3. Socket.io (real-time order status updates)
 */

export const integrations = {
  /**
   * Mock Cloudinary Upload
   * Simulates uploading a file (license, registration, etc.) to Cloudinary.
   */
  async cloudinaryUpload(file: any, driverId: string, docType: string): Promise<string> {
    console.log(`[Cloudinary] Uploading document for ${driverId} (Type: ${docType})...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Return a mocked premium image URL
    const mockUrls: Record<string, string> = {
      IDENTITY_CARD: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      DRIVING_LICENSE: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      VEHICLE_REG: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      INSURANCE_PROOF: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
    };
    
    const url = mockUrls[docType] || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600';
    console.log(`[Cloudinary] Upload successful! URL: ${url}`);
    return url;
  },

  /**
   * Mock Firebase Cloud Messaging
   * Simulates sending push notifications to device tokens.
   */
  async sendPushNotification(tokens: string[], title: string, body: string, payload?: any): Promise<number> {
    console.log(`[FCM Push] Sending notification to ${tokens.length} tokens...`);
    console.log(`[FCM Push] Title: "${title}"`);
    console.log(`[FCM Push] Body: "${body}"`);
    if (payload) {
      console.log(`[FCM Push] Payload:`, payload);
    }
    
    // Return the number of successful deliveries (multicast reach)
    return tokens.length;
  },

  /**
   * Mock Socket.io Emission
   * Simulates emitting real-time updates to client websocket rooms.
   */
  socketEmit(room: string, event: string, data: any): void {
    console.log(`[Socket.io] EMIT to room [${room}] - Event: [${event}]`);
    console.log(`[Socket.io] Data:`, data);
  }
};
