// User Profile Types
export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  addresses: Address[];
  role: 'user' | 'admin';
  createdAt: Date;
}

// Phone Verification Types
export interface PhoneVerificationData {
  phoneNumber: string;
  verificationCode: string;
  verificationId: string;
}

// Auth Step Types
export type AuthStep = 'phone-input' | 'phone-verify' | 'personal-details' | 'completed';

// Signup Data Types
export interface SignupData {
  phoneNumber: string;
  email?: string;
  username: string;
  fullName: string;
  password: string;
}

// Address Type
export interface Address {
  id: string;
  label: string; // e.g., "Home", "Office"
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  deliveryAddress: Address;
  orderTotal: number;
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

// Product Type
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  createdAt: Date;
}

// Authentication Types
export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileDetails {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}