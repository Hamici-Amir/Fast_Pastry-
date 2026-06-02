import { localDb, Driver, DriverDocument, DriverDocumentType, Notification } from '../db/localDb';
import { integrations } from './integrations';

export class DriverOnboardingService {
  /**
   * Get onboarding status for a driver, including all document statuses
   */
  static getApplicationStatus(driverId: string) {
    const db = localDb.getData();
    const driver = db.drivers.find(d => d.id === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    const documents = db.driverDocuments.filter(doc => doc.driverId === driverId);

    return {
      driver,
      documents,
    };
  }

  /**
   * Upload an onboarding document (simulated via mock Cloudinary upload)
   * If all 4 required documents exist after upload:
   * 1. Set all documents' statuses to REVIEWING
   * 2. Notify the platform admin via FCM
   */
  static async uploadDocument(driverId: string, type: DriverDocumentType, file: any) {
    const db = localDb.getData();
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    // Perform simulated Cloudinary upload
    const url = await integrations.cloudinaryUpload(file, driverId, type);

    // Upsert document (by driverId + type)
    const docIndex = db.driverDocuments.findIndex(
      doc => doc.driverId === driverId && doc.type === type
    );

    if (docIndex !== -1) {
      // Update existing document
      db.driverDocuments[docIndex].url = url;
      db.driverDocuments[docIndex].status = 'REVIEWING'; // Reset status for re-upload
      db.driverDocuments[docIndex].createdAt = new Date().toISOString();
    } else {
      // Create new document record
      const newDoc: DriverDocument = {
        id: `DOC-${driverId}-${type}`,
        driverId,
        type,
        status: 'REVIEWING',
        url,
        createdAt: new Date().toISOString(),
      };
      db.driverDocuments.push(newDoc);
    }

    localDb.save();

    // Check if all 4 required document types are present
    const driverDocs = db.driverDocuments.filter(doc => doc.driverId === driverId);
    const requiredTypes: DriverDocumentType[] = ['IDENTITY_CARD', 'DRIVING_LICENSE', 'VEHICLE_REG', 'INSURANCE_PROOF'];
    const uploadedTypes = driverDocs.map(doc => doc.type);
    const hasAllFour = requiredTypes.every(t => uploadedTypes.includes(t));

    if (hasAllFour) {
      console.log(`[Onboarding] All 4 documents exist for driver ${driverId}. Transitioning all to REVIEWING...`);
      
      // Update all documents to REVIEWING status (except already verified ones, or set all as requested)
      db.driverDocuments.forEach((doc, idx) => {
        if (doc.driverId === driverId && doc.status !== 'VERIFIED') {
          db.driverDocuments[idx].status = 'REVIEWING';
        }
      });
      
      // Update driver status to PENDING review if it was previously offline or fresh
      if (db.drivers[driverIndex].status !== 'ONLINE') {
        db.drivers[driverIndex].status = 'PENDING';
      }

      localDb.save();

      // Notify platform administrator via FCM
      const adminUsers = db.users.filter(u => u.role === 'ADMIN');
      const adminTokens = adminUsers.map(u => `token-${u.id}`);
      
      if (adminTokens.length > 0) {
        await integrations.sendPushNotification(
          adminTokens,
          'New Driver Onboarding',
          `Driver application ${driverId} has uploaded all 4 documents and is ready for review.`
        );
      }
    }

    return this.getApplicationStatus(driverId);
  }

  /**
   * Log driver support ticket and create a support notification in the DB
   */
  static contactSupport(driverId: string, message: string) {
    const db = localDb.getData();
    console.log(`[Support Request] Driver ${driverId}: "${message}"`);

    // Register a support notification
    const supportNotification: Notification = {
      id: `NOTIF-SUPPORT-${Date.now()}`,
      title: `Fleet Support Request from ${driverId}`,
      body: message,
      type: 'SUPPORT',
      targetAudience: 'ALL', // Visible to admins
      isBoosted: false,
      status: 'SENT',
      reachCount: 1,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    db.notifications.push(supportNotification);
    localDb.save();

    return { success: true, message: 'Support team notified' };
  }
}
