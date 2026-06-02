import { localDb, User, Order, CustomerTier } from '../db/localDb';

export class AdminCustomerService {
  /**
   * Helper to enrich a client user with totalSpent, ordersCount, and lastActive
   */
  private static enrichCustomer(user: User, orders: Order[]) {
    const customerOrders = orders.filter(o => o.customerId === user.id);
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    
    return {
      ...user,
      ordersCount: customerOrders.length,
      totalSpent: `$${totalSpent.toFixed(2)}`,
    };
  }

  /**
   * Retrieve list of customer users (role=CLIENT) with filters and pagination
   */
  static getCustomers(params: {
    tier?: CustomerTier;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const db = localDb.getData();
    const page = params.page || 1;
    const limit = params.limit || 10;
    
    // Filter by CLIENT role
    let clients = db.users.filter(u => u.role === 'CLIENT');

    // Filter by tier
    if (params.tier) {
      clients = clients.filter(c => c.tier === params.tier);
    }

    // Filter by search query (name or email)
    if (params.search) {
      const q = params.search.toLowerCase();
      clients = clients.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }

    // Enrich clients with order summary data
    const enrichedClients = clients.map(c => this.enrichCustomer(c, db.orders));

    // Paginate
    const total = enrichedClients.length;
    const startIndex = (page - 1) * limit;
    const paginatedClients = enrichedClients.slice(startIndex, startIndex + limit);

    return {
      customers: paginatedClients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get single customer details including order totals
   */
  static getCustomerDetails(customerId: string) {
    const db = localDb.getData();
    const user = db.users.find(u => u.id === customerId && u.role === 'CLIENT');
    if (!user) {
      throw new Error('Customer not found');
    }

    return this.enrichCustomer(user, db.orders);
  }

  /**
   * Get order history of a specific customer
   */
  static getCustomerOrderHistory(customerId: string, params: { page?: number; limit?: number }) {
    const db = localDb.getData();
    const page = params.page || 1;
    const limit = params.limit || 10;

    const customerOrders = db.orders
      .filter(o => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = customerOrders.length;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = customerOrders.slice(startIndex, startIndex + limit);

    return {
      orders: paginatedOrders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Update customer tier (NEW | REGULAR | VIP)
   */
  static updateCustomerTier(customerId: string, tier: CustomerTier) {
    const db = localDb.getData();
    const userIndex = db.users.findIndex(u => u.id === customerId && u.role === 'CLIENT');
    
    if (userIndex === -1) {
      throw new Error('Customer not found');
    }

    db.users[userIndex].tier = tier;
    localDb.save();

    return db.users[userIndex];
  }

  /**
   * Suspend a customer's access
   */
  static suspendCustomer(customerId: string) {
    const db = localDb.getData();
    const userIndex = db.users.findIndex(u => u.id === customerId && u.role === 'CLIENT');

    if (userIndex === -1) {
      throw new Error('Customer not found');
    }

    db.users[userIndex].status = 'SUSPENDED';
    localDb.save();

    return db.users[userIndex];
  }

  /**
   * Reactivate suspended customer
   */
  static reactivateCustomer(customerId: string) {
    const db = localDb.getData();
    const userIndex = db.users.findIndex(u => u.id === customerId && u.role === 'CLIENT');

    if (userIndex === -1) {
      throw new Error('Customer not found');
    }

    db.users[userIndex].status = 'ACTIVE';
    localDb.save();

    return db.users[userIndex];
  }

  /**
   * Hard delete customer (checks for active orders first)
   */
  static deleteCustomer(customerId: string) {
    const db = localDb.getData();
    const userIndex = db.users.findIndex(u => u.id === customerId && u.role === 'CLIENT');

    if (userIndex === -1) {
      throw new Error('Customer not found');
    }

    // Check if there are active orders
    const hasActiveOrders = db.orders.some(
      o => o.customerId === customerId && ['PENDING', 'PREPARING', 'IN_ROUTE'].includes(o.status)
    );

    if (hasActiveOrders) {
      throw new Error('Cannot delete customer with active orders');
    }

    // Perform hard delete
    const deletedUser = db.users[userIndex];
    db.users.splice(userIndex, 1);
    
    // Clean up past completed orders for this customer as well
    db.orders = db.orders.filter(o => o.customerId !== customerId);
    
    localDb.save();
    return deletedUser;
  }
}
