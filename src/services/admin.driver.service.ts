import { localDb, Driver, User, DriverDocument, Order, DriverStatus, DriverDocumentStatus } from '../db/localDb';
import { integrations } from './integrations';

export class AdminDriverService {
  /**
   * Helper to enrich a driver with their corresponding user profile and active order ID
   */
  private static enrichDriver(driver: Driver, users: User[], orders: Order[], documents: DriverDocument[]) {
    const user = users.find(u => u.id === driver.userId);
    const driverDocs = documents.filter(d => d.driverId === driver.id);
    const activeOrder = driver.activeOrderId ? orders.find(o => o.id === driver.activeOrderId) : null;

    return {
      ...driver,
      user: user || null,
      documents: driverDocs,
      activeOrder: activeOrder || null,
    };
  }

  /**
   * Get list of drivers with pagination, filter by status, and search query
   */
  static getDrivers(params: {
    status?: DriverStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const db = localDb.getData();
    const page = params.page || 1;
    const limit = params.limit || 10;

    let driversList = db.drivers;

    // Filter by status
    if (params.status) {
      driversList = driversList.filter(d => d.status === params.status);
    }

    // Filter by search query (joined name or driver ID)
    if (params.search) {
      const q = params.search.toLowerCase();
      driversList = driversList.filter(d => {
        const user = db.users.find(u => u.id === d.userId);
        return d.id.toLowerCase().includes(q) || (user && user.name.toLowerCase().includes(q));
      });
    }

    const enriched = driversList.map(d => this.enrichDriver(d, db.users, db.orders, db.driverDocuments));

    const total = enriched.length;
    const startIndex = (page - 1) * limit;
    const paginatedDrivers = enriched.slice(startIndex, startIndex + limit);

    return {
      drivers: paginatedDrivers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get single driver profile with full documents and active order details
   */
  static getDriverDetails(driverId: string) {
    const db = localDb.getData();
    const driver = db.drivers.find(d => d.id === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    return this.enrichDriver(driver, db.users, db.orders, db.driverDocuments);
  }

  /**
   * Approve driver application:
   * 1. Set driver.status = ONLINE
   * 2. Set user.status = ACTIVE
   * 3. Send FCM push: "Your application has been approved!"
   */
  static async approveDriver(driverId: string) {
    const db = localDb.getData();
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    const driver = db.drivers[driverIndex];
    const userIndex = db.users.findIndex(u => u.id === driver.userId);
    if (userIndex === -1) {
      throw new Error('Associated user not found');
    }

    // Update statuses
    db.drivers[driverIndex].status = 'ONLINE';
    db.users[userIndex].status = 'ACTIVE';

    localDb.save();

    // Mock sending FCM push
    // In a real app we'd retrieve device tokens from user record
    const mockTokens = [`token-${driver.id}`];
    await integrations.sendPushNotification(
      mockTokens,
      'Application Approved!',
      'Your Fast Pastry logistics application has been approved! Welcome to the elite fleet.'
    );

    return this.enrichDriver(db.drivers[driverIndex], db.users, db.orders, db.driverDocuments);
  }

  /**
   * Reject driver application:
   * 1. Set user.status = SUSPENDED
   * 2. Send FCM push with reason
   */
  static async rejectDriver(driverId: string, reason: string) {
    const db = localDb.getData();
    const driver = db.drivers.find(d => d.id === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    const userIndex = db.users.findIndex(u => u.id === driver.userId);
    if (userIndex === -1) {
      throw new Error('Associated user not found');
    }

    // Set user to suspended and driver to OFFLINE (or keep PENDING/rejected in DB, but prompt says suspend user)
    db.users[userIndex].status = 'SUSPENDED';
    
    // Also update driver status
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    db.drivers[driverIndex].status = 'OFFLINE';

    localDb.save();

    // Send FCM push with rejection reason
    const mockTokens = [`token-${driver.id}`];
    await integrations.sendPushNotification(
      mockTokens,
      'Application Status Update',
      `Your application was not approved. Reason: ${reason}`
    );

    return this.enrichDriver(db.drivers[driverIndex], db.users, db.orders, db.driverDocuments);
  }

  /**
   * Suspend active driver
   * Sets user.status = SUSPENDED, driver.status = OFFLINE
   */
  static suspendDriver(driverId: string) {
    const db = localDb.getData();
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    const driver = db.drivers[driverIndex];
    const userIndex = db.users.findIndex(u => u.id === driver.userId);
    if (userIndex === -1) {
      throw new Error('Associated user not found');
    }

    db.users[userIndex].status = 'SUSPENDED';
    db.drivers[driverIndex].status = 'OFFLINE';
    db.drivers[driverIndex].activeOrderId = null; // Clear active delivery if suspended

    localDb.save();

    return this.enrichDriver(db.drivers[driverIndex], db.users, db.orders, db.driverDocuments);
  }

  /**
   * Get available drivers (ONLINE and no activeOrder)
   */
  static getAvailableDrivers() {
    const db = localDb.getData();
    const available = db.drivers.filter(d => d.status === 'ONLINE' && !d.activeOrderId);
    return available.map(d => this.enrichDriver(d, db.users, db.orders, db.driverDocuments));
  }

  /**
   * Review document status (VERIFIED or REJECTED)
   * If all 4 documents exist and are verified, call approveDriver automatically.
   */
  static async reviewDocument(docId: string, status: DriverDocumentStatus) {
    const db = localDb.getData();
    const docIndex = db.driverDocuments.findIndex(d => d.id === docId);
    if (docIndex === -1) {
      throw new Error('Document not found');
    }

    // Update document status
    db.driverDocuments[docIndex].status = status;
    localDb.save();

    const updatedDoc = db.driverDocuments[docIndex];
    const driverId = updatedDoc.driverId;

    // Check if we need to auto-approve the driver
    if (status === 'VERIFIED') {
      const driverDocs = db.driverDocuments.filter(d => d.driverId === driverId);
      
      const requiredTypes = ['IDENTITY_CARD', 'DRIVING_LICENSE', 'VEHICLE_REG', 'INSURANCE_PROOF'];
      const verifiedTypesCount = driverDocs.filter(
        d => requiredTypes.includes(d.type) && d.status === 'VERIFIED'
      ).length;

      // If all 4 required document types are VERIFIED, approve driver
      if (verifiedTypesCount === 4) {
        console.log(`[Auto-Approve] All 4 documents verified for driver ${driverId}. Promoting to active status...`);
        await this.approveDriver(driverId);
      }
    }

    return updatedDoc;
  }
}
