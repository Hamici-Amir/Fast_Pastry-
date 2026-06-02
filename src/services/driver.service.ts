import { localDb, Driver, Order, OrderIssue, Payout, UserNotification, Notification } from '../db/localDb';
import { integrations } from './integrations';

export class DriverService {
  /**
   * Helper to fetch driver profile by driverId or userId
   */
  private static getDriver(driverId: string): Driver {
    const db = localDb.getData();
    const driver = db.drivers.find(d => d.id === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver;
  }

  /**
   * Get driver dashboard metrics and active delivery
   */
  static getDriverDashboard(driverId: string) {
    const db = localDb.getData();
    const driver = this.getDriver(driverId);

    // Calculate today's deliveries and earnings
    const today = new Date().toDateString();
    const todayDeliveriesList = db.orders.filter(
      o => o.driverId === driverId && 
      o.status === 'DELIVERED' && 
      new Date(o.createdAt).toDateString() === today
    );

    const todayEarnings = todayDeliveriesList.reduce((sum, o) => {
      const fee = o.grandTotal * 0.18 + driver.bonusPercent;
      return sum + fee;
    }, 0);

    // Find active order
    const activeOrder = db.orders.find(
      o => o.driverId === driverId && ['PREPARING', 'IN_ROUTE'].includes(o.status)
    );

    return {
      driver: {
        rating: driver.rating,
        totalEarnings: driver.totalEarnings,
        deliveriesCount: driver.deliveriesCount,
        performanceTier: driver.performanceTier,
        bonusPercent: driver.bonusPercent,
        status: driver.status,
      },
      todayDeliveries: todayDeliveriesList.length,
      todayEarnings,
      activeOrder: activeOrder || null,
    };
  }

  /**
   * Toggle driver online status
   */
  static setOnlineStatus(driverId: string, isOnline: boolean) {
    const db = localDb.getData();
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    db.drivers[driverIndex].status = isOnline ? 'ONLINE' : 'OFFLINE';
    localDb.save();

    return db.drivers[driverIndex];
  }

  /**
   * Get completed delivery history for driver
   */
  static getDeliveryHistory(driverId: string, params: { page?: number; limit?: number }) {
    const db = localDb.getData();
    const page = params.page || 1;
    const limit = params.limit || 10;

    const history = db.orders
      .filter(o => o.driverId === driverId && o.status === 'DELIVERED')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = history.length;
    const startIndex = (page - 1) * limit;
    const paginated = history.slice(startIndex, startIndex + limit);

    return {
      deliveries: paginated,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get pending offers (orders in PENDING status with no driver assigned)
   */
  static getPendingOffers(driverId: string) {
    const db = localDb.getData();
    
    // Ensure driver is ONLINE to see offers
    const driver = this.getDriver(driverId);
    if (driver.status !== 'ONLINE') {
      return [];
    }

    return db.orders.filter(o => o.status === 'PENDING' && !o.driverId);
  }

  /**
   * Accept a delivery offer:
   * 1. Validate driver doesn't have an active order
   * 2. Set order.driverId = driverId, status = PREPARING
   * 3. Set driver.activeOrderId = orderId
   * 4. Emit socket event "order:assigned" to client room
   */
  static acceptOffer(driverId: string, orderId: string) {
    const db = localDb.getData();
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    const driver = db.drivers[driverIndex];
    if (driver.activeOrderId) {
      throw new Error('Driver already has an active order');
    }

    const orderIndex = db.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = db.orders[orderIndex];
    if (order.driverId || order.status !== 'PENDING') {
      throw new Error('Offer no longer available');
    }

    // Update statuses
    db.orders[orderIndex].driverId = driverId;
    db.orders[orderIndex].status = 'PREPARING';
    db.drivers[driverIndex].activeOrderId = orderId;

    localDb.save();

    // Emit Socket.io event
    integrations.socketEmit(`client:${order.customerId}`, 'order:assigned', {
      orderId,
      driverId,
      status: 'PREPARING',
    });

    return db.orders[orderIndex];
  }

  /**
   * Reject a delivery offer (driver simply won't take it, no DB changes)
   */
  static rejectOffer(driverId: string, orderId: string) {
    // Check existence
    this.getDriver(driverId);
    const db = localDb.getData();
    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    console.log(`[Offers] Driver ${driverId} rejected offer ${orderId}`);
    return { success: true, message: 'Offer rejected' };
  }

  /**
   * Get current active delivery details
   */
  static getActiveDelivery(driverId: string) {
    const db = localDb.getData();
    const order = db.orders.find(
      o => o.driverId === driverId && ['PREPARING', 'IN_ROUTE'].includes(o.status)
    );

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      cake: {
        name: order.cakeName,
        image: order.cakeImage,
      },
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
      },
      address: order.address,
      notes: order.notes,
      status: order.status,
      grandTotal: order.grandTotal,
    };
  }

  /**
   * Mark active order as picked up: status = IN_ROUTE, emit "order:updated" socket event
   */
  static markPickedUp(driverId: string, orderId: string) {
    const db = localDb.getData();
    const orderIndex = db.orders.findIndex(o => o.id === orderId && o.driverId === driverId);
    if (orderIndex === -1) {
      throw new Error('Active delivery order not found');
    }

    db.orders[orderIndex].status = 'IN_ROUTE';
    localDb.save();

    const order = db.orders[orderIndex];
    // Emit Socket.io event
    integrations.socketEmit(`client:${order.customerId}`, 'order:updated', {
      orderId,
      status: 'IN_ROUTE',
    });

    return order;
  }

  /**
   * Mark active order as delivered:
   * 1. Set status = DELIVERED
   * 2. Increment driver.deliveriesCount
   * 3. Calculate driver fee: grandTotal * 0.18 + bonusPercent
   * 4. Add to driver.totalEarnings
   * 5. Clear driver.activeOrderId
   * 6. Emit "order:delivered" socket event
   */
  static markDelivered(driverId: string, orderId: string) {
    const db = localDb.getData();
    const orderIndex = db.orders.findIndex(o => o.id === orderId && o.driverId === driverId);
    if (orderIndex === -1) {
      throw new Error('Active delivery order not found');
    }

    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    const order = db.orders[orderIndex];
    const driver = db.drivers[driverIndex];

    // Calculate fee
    const fee = order.grandTotal * 0.18 + driver.bonusPercent;

    // Update statuses & driver aggregates
    db.orders[orderIndex].status = 'DELIVERED';
    db.drivers[driverIndex].deliveriesCount += 1;
    db.drivers[driverIndex].totalEarnings += fee;
    db.drivers[driverIndex].activeOrderId = null;

    localDb.save();

    // Emit Socket.io event
    integrations.socketEmit(`client:${order.customerId}`, 'order:delivered', {
      orderId,
      status: 'DELIVERED',
      fee,
    });

    return db.orders[orderIndex];
  }

  /**
   * Report delivery issue
   */
  static reportIssue(driverId: string, orderId: string, description: string) {
    const db = localDb.getData();
    const order = db.orders.find(o => o.id === orderId && o.driverId === driverId);
    if (!order) {
      throw new Error('Assigned order not found');
    }

    const newIssue: OrderIssue = {
      id: `ISSUE-${Date.now()}`,
      orderId,
      driverId,
      description,
      createdAt: new Date().toISOString(),
    };

    db.orderIssues.push(newIssue);
    localDb.save();

    console.log(`[Delivery Issue] Driver ${driverId} reported issue on ${orderId}: "${description}"`);
    return newIssue;
  }

  /**
   * Get earnings summary for driver
   */
  static getEarningsSummary(driverId: string, period?: 'week' | 'month') {
    const db = localDb.getData();
    const driver = this.getDriver(driverId);

    // Filter completed deliveries for the driver
    const deliveries = db.orders.filter(o => o.driverId === driverId && o.status === 'DELIVERED');
    
    // Sum calculations
    let total = 0;
    let bonuses = 0;
    const breakdown = deliveries.map(o => {
      const orderFee = o.grandTotal * 0.18;
      const orderBonus = driver.bonusPercent;
      const totalFee = orderFee + orderBonus;
      
      total += totalFee;
      bonuses += orderBonus;

      return {
        orderId: o.id,
        date: o.createdAt,
        amount: totalFee,
        baseFee: orderFee,
        bonus: orderBonus,
        cakeName: o.cakeName,
      };
    });

    return {
      total,
      deliveries: deliveries.length,
      bonuses,
      breakdown,
    };
  }

  /**
   * Request driver earnings payout
   */
  static requestPayout(driverId: string, amount: number) {
    const db = localDb.getData();
    const driverIndex = db.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }

    const driver = db.drivers[driverIndex];
    if (amount <= 0) {
      throw new Error('Payout amount must be greater than 0');
    }
    if (amount > driver.totalEarnings) {
      throw new Error('Insufficient earnings balance');
    }

    // Deduct from earnings balance
    db.drivers[driverIndex].totalEarnings -= amount;

    // Create payout record
    const payout: Payout = {
      id: `PAY-${Date.now()}`,
      driverId,
      amount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    db.payouts.push(payout);
    localDb.save();

    console.log(`[Payout Request] Driver ${driverId} requested payout of $${amount}. Payout ID: ${payout.id}`);
    return payout;
  }

  /**
   * Get payout history for driver
   */
  static getPayoutHistory(driverId: string) {
    const db = localDb.getData();
    return db.payouts
      .filter(p => p.driverId === driverId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get notifications assigned to driver
   */
  static getNotifications(driverId: string, type?: string) {
    const db = localDb.getData();
    const driver = this.getDriver(driverId);
    
    // Find all UserNotifications for driver's userId
    let userNotifs = db.userNotifications.filter(
      un => un.userId === driver.userId && !un.isDismissed
    );

    // Map to include notification details
    let list = userNotifs.map(un => {
      const notif = db.notifications.find(n => n.id === un.notificationId);
      return {
        id: un.id,
        notificationId: un.notificationId,
        title: notif?.title || 'Notification',
        body: notif?.body || '',
        type: notif?.type || 'SYSTEM',
        isRead: un.isRead,
        createdAt: un.createdAt,
      };
    });

    if (type) {
      list = list.filter(item => item.type === type);
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Mark notification as read
   */
  static markRead(driverId: string, userNotificationId: string) {
    const db = localDb.getData();
    const driver = this.getDriver(driverId);
    
    const unIndex = db.userNotifications.findIndex(
      un => un.id === userNotificationId && un.userId === driver.userId
    );

    if (unIndex === -1) {
      throw new Error('Notification not found');
    }

    db.userNotifications[unIndex].isRead = true;
    localDb.save();

    return db.userNotifications[unIndex];
  }

  /**
   * Mark all notifications for driver as read
   */
  static markAllRead(driverId: string) {
    const db = localDb.getData();
    const driver = this.getDriver(driverId);

    db.userNotifications.forEach((un, idx) => {
      if (un.userId === driver.userId) {
        db.userNotifications[idx].isRead = true;
      }
    });

    localDb.save();
    return { success: true, message: 'All notifications marked as read' };
  }

  /**
   * Dismiss notification (delete UserNotification mapping)
   */
  static dismiss(driverId: string, userNotificationId: string) {
    const db = localDb.getData();
    const driver = this.getDriver(driverId);

    const unIndex = db.userNotifications.findIndex(
      un => un.id === userNotificationId && un.userId === driver.userId
    );

    if (unIndex === -1) {
      throw new Error('Notification not found');
    }

    const dismissed = db.userNotifications[unIndex];
    db.userNotifications.splice(unIndex, 1);
    localDb.save();

    return dismissed;
  }
}
