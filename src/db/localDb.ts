import fs from 'fs';
import path from 'path';

// Define DB File Path (located in project root for easy viewing/manipulation)
const DB_FILE_PATH = path.join(process.cwd(), 'fast_pastry_db.json');

export type UserRole = 'CLIENT' | 'DRIVER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type CustomerTier = 'NEW' | 'REGULAR' | 'VIP';
export type DriverStatus = 'PENDING' | 'ONLINE' | 'OFFLINE';
export type DriverDocumentType = 'IDENTITY_CARD' | 'DRIVING_LICENSE' | 'VEHICLE_REG' | 'INSURANCE_PROOF';
export type DriverDocumentStatus = 'PENDING' | 'REVIEWING' | 'VERIFIED' | 'REJECTED';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'IN_ROUTE' | 'DELIVERED';
export type NotificationStatus = 'SENT' | 'SCHEDULED';
export type NotificationAudience = 'ALL' | 'VIP_CUSTOMERS' | 'DRIVERS' | 'NEW_REGISTERED';
export type NotificationType = 'PROMO' | 'SYSTEM' | 'SUPPORT' | 'ALERT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  tier: CustomerTier;
  avatar: string;
  lastActive: string;
  createdAt: string;
}

export interface Driver {
  id: string; // DRV-XXX
  userId: string; // USR-XXX
  status: DriverStatus;
  rating: number;
  totalEarnings: number;
  deliveriesCount: number;
  performanceTier: string;
  bonusPercent: number;
  activeOrderId: string | null;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  type: DriverDocumentType;
  status: DriverDocumentStatus;
  url: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  driverId: string | null;
  status: OrderStatus;
  grandTotal: number;
  cakeName: string;
  cakeImage: string;
  customerName: string;
  customerPhone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  targetAudience: NotificationAudience;
  isBoosted: boolean;
  status: NotificationStatus;
  reachCount: number;
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

export interface OrderIssue {
  id: string;
  orderId: string;
  driverId: string;
  description: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  driverId: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  drivers: Driver[];
  driverDocuments: DriverDocument[];
  orders: Order[];
  notifications: Notification[];
  userNotifications: UserNotification[];
  orderIssues: OrderIssue[];
  payouts: Payout[];
}

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'USR-000',
      name: 'Platform Administrator',
      email: 'admin@fastpastry.com',
      phone: '+1000000000',
      role: 'ADMIN',
      status: 'ACTIVE',
      tier: 'VIP',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      lastActive: 'Just now',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-001',
      name: 'Eleanor Fant',
      email: 'eleanor.f@luxury.com',
      phone: '+15550101',
      role: 'CLIENT',
      status: 'ACTIVE',
      tier: 'VIP',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      lastActive: '2h ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    },
    {
      id: 'USR-002',
      name: 'Marcus Aurelius',
      email: 'marcus.a@stoic.it',
      phone: '+15550102',
      role: 'CLIENT',
      status: 'ACTIVE',
      tier: 'REGULAR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      lastActive: '5h ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
    },
    {
      id: 'USR-003',
      name: 'Isabella Rossellini',
      email: 'isabella@cine.fr',
      phone: '+15550103',
      role: 'CLIENT',
      status: 'ACTIVE',
      tier: 'VIP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      lastActive: '1d ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    },
    {
      id: 'USR-004',
      name: 'John Wick',
      email: 'baba.yaga@continental.com',
      phone: '+15550104',
      role: 'CLIENT',
      status: 'ACTIVE',
      tier: 'NEW',
      avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop',
      lastActive: '2d ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: 'USR-102',
      name: 'Sarah Miller',
      email: 'sarah.m@fleet.com',
      phone: '+15550202',
      role: 'DRIVER',
      status: 'ACTIVE',
      tier: 'NEW',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      lastActive: '3m ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 40).toISOString(),
    },
    {
      id: 'USR-105',
      name: 'James Rodriguez',
      email: 'james.r@fleet.com',
      phone: '+15550205',
      role: 'DRIVER',
      status: 'ACTIVE',
      tier: 'NEW',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      lastActive: '10m ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
    },
    {
      id: 'USR-133',
      name: 'Elena Gilbert',
      email: 'elena.g@fleet.com',
      phone: '+15550233',
      role: 'DRIVER',
      status: 'ACTIVE', // User is active, but driver profile status is PENDING review
      tier: 'NEW',
      avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop',
      lastActive: '1h ago',
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    },
    {
      id: 'USR-098',
      name: 'Michael Chen',
      email: 'michael.c@fleet.com',
      phone: '+15550298',
      role: 'DRIVER',
      status: 'ACTIVE',
      tier: 'NEW',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      lastActive: 'Yesterday',
      createdAt: new Date(Date.now() - 3600000 * 24 * 90).toISOString(),
    }
  ],
  drivers: [
    {
      id: 'DRV-102',
      userId: 'USR-102',
      status: 'ONLINE',
      rating: 4.9,
      totalEarnings: 2840.00,
      deliveriesCount: 412,
      performanceTier: 'Gold',
      bonusPercent: 5,
      activeOrderId: null,
    },
    {
      id: 'DRV-105',
      userId: 'USR-105',
      status: 'ONLINE',
      rating: 4.7,
      totalEarnings: 1920.50,
      deliveriesCount: 284,
      performanceTier: 'Silver',
      bonusPercent: 2,
      activeOrderId: null,
    },
    {
      id: 'DRV-133',
      userId: 'USR-133',
      status: 'PENDING',
      rating: 0,
      totalEarnings: 0,
      deliveriesCount: 0,
      performanceTier: 'New',
      bonusPercent: 0,
      activeOrderId: null,
    },
    {
      id: 'DRV-098',
      userId: 'USR-098',
      status: 'OFFLINE',
      rating: 4.8,
      totalEarnings: 3150.00,
      deliveriesCount: 520,
      performanceTier: 'Platinum',
      bonusPercent: 8,
      activeOrderId: null,
    }
  ],
  driverDocuments: [
    // Elena's documents - partial verified, partial reviewing
    {
      id: 'DOC-133-1',
      driverId: 'DRV-133',
      type: 'IDENTITY_CARD',
      status: 'VERIFIED',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
    {
      id: 'DOC-133-2',
      driverId: 'DRV-133',
      type: 'DRIVING_LICENSE',
      status: 'VERIFIED',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
    {
      id: 'DOC-133-3',
      driverId: 'DRV-133',
      type: 'VEHICLE_REG',
      status: 'REVIEWING',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
    {
      id: 'DOC-133-4',
      driverId: 'DRV-133',
      type: 'INSURANCE_PROOF',
      status: 'REVIEWING',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
    // Sarah's documents - all verified
    {
      id: 'DOC-102-1',
      driverId: 'DRV-102',
      type: 'IDENTITY_CARD',
      status: 'VERIFIED',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 35).toISOString(),
    },
    {
      id: 'DOC-102-2',
      driverId: 'DRV-102',
      type: 'DRIVING_LICENSE',
      status: 'VERIFIED',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 35).toISOString(),
    },
    {
      id: 'DOC-102-3',
      driverId: 'DRV-102',
      type: 'VEHICLE_REG',
      status: 'VERIFIED',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 35).toISOString(),
    },
    {
      id: 'DOC-102-4',
      driverId: 'DRV-102',
      type: 'INSURANCE_PROOF',
      status: 'VERIFIED',
      url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600',
      createdAt: new Date(Date.now() - 3600000 * 24 * 35).toISOString(),
    }
  ],
  orders: [
    {
      id: 'ORD-1201',
      customerId: 'USR-001',
      driverId: 'DRV-102',
      status: 'IN_ROUTE',
      grandTotal: 180.50,
      cakeName: 'Luxury Velvet Pearl',
      cakeImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
      customerName: 'Eleanor Fant',
      customerPhone: '+15550101',
      address: '123 Penthouse Suite, Highrose Boulevard',
      notes: 'Deliver before 5 PM, ring bell.',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    {
      id: 'ORD-1202',
      customerId: 'USR-002',
      driverId: null,
      status: 'PENDING',
      grandTotal: 95.00,
      cakeName: 'Golden Opulence Chocolate',
      cakeImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
      customerName: 'Marcus Aurelius',
      customerPhone: '+15550102',
      address: 'Stoic Retreat, Villa 4',
      notes: 'Leave at gate.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ORD-1203',
      customerId: 'USR-003',
      driverId: null,
      status: 'PENDING',
      grandTotal: 250.00,
      cakeName: 'Imperial Royal Wedding Cake',
      cakeImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
      customerName: 'Isabella Rossellini',
      customerPhone: '+15550103',
      address: 'Chateau de Lafayette',
      notes: 'Keep refrigerated.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ORD-1100',
      customerId: 'USR-001',
      driverId: 'DRV-102',
      status: 'DELIVERED',
      grandTotal: 340.00,
      cakeName: 'Luxury Bouquet Cake',
      cakeImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
      customerName: 'Eleanor Fant',
      customerPhone: '+15550101',
      address: '123 Penthouse Suite, Highrose Boulevard',
      notes: 'Deliver before 5 PM, ring bell.',
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    },
    {
      id: 'ORD-1101',
      customerId: 'USR-001',
      driverId: 'DRV-105',
      status: 'DELIVERED',
      grandTotal: 120.00,
      cakeName: 'Vanilla Bean Meringue',
      cakeImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
      customerName: 'Eleanor Fant',
      customerPhone: '+15550101',
      address: '123 Penthouse Suite, Highrose Boulevard',
      notes: 'Ring phone on arrival.',
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), // 7 days ago
    }
  ],
  notifications: [
    {
      id: 'NOTIF-001',
      title: 'Spring Macaron Festival',
      body: 'Get 20% off all macarons this weekend with code SPRING20!',
      type: 'PROMO',
      targetAudience: 'ALL',
      isBoosted: true,
      status: 'SENT',
      reachCount: 4,
      sentAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    }
  ],
  userNotifications: [
    {
      id: 'UNOTIF-001',
      userId: 'USR-001',
      notificationId: 'NOTIF-001',
      isRead: false,
      isDismissed: false,
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: 'UNOTIF-002',
      userId: 'USR-102',
      notificationId: 'NOTIF-001',
      isRead: true,
      isDismissed: false,
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    }
  ],
  orderIssues: [],
  payouts: [
    {
      id: 'PAY-001',
      driverId: 'DRV-102',
      amount: 450.00,
      status: 'PAID',
      createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    }
  ]
};

class LocalDB {
  private db: DatabaseSchema | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.db = JSON.parse(data);
      } else {
        this.db = INITIAL_DB;
        this.save();
      }
    } catch (error) {
      console.error('Error initializing LocalDB, falling back to in-memory', error);
      this.db = INITIAL_DB;
    }
  }

  public save() {
    if (!this.db) return;
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save LocalDB to file', error);
    }
  }

  public getData(): DatabaseSchema {
    if (!this.db) {
      this.init();
    }
    return this.db!;
  }

  public reset() {
    this.db = JSON.parse(JSON.stringify(INITIAL_DB));
    this.save();
  }
}

export const localDb = new LocalDB();
