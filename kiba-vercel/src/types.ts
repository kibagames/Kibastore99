export interface Order {
  id: string;
  packageName: string;
  price: string;
  uid: string;
  serverId: string;
  whatsAppNumber: string;
  paymentUtr: string;
  status: 'pending' | 'completed';
  userId: string;
  userEmail: string;
  createdAt: any;
  updatedAt: any;
}

export interface AdminUser {
  email: string;
  createdAt: any;
}

export interface DiamondPackage {
  diamonds: number;
  price: number;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}
