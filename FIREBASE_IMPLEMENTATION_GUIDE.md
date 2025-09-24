# Firebase Implementation Guide for Candle Craft E-commerce

## Table of Contents
1. [Firebase Setup & Configuration](#1-firebase-setup--configuration)
2. [User Authentication System](#2-user-authentication-system)
3. [User Profile & Dashboard](#3-user-profile--dashboard)
4. [Checkout Flow Implementation](#4-checkout-flow-implementation)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Responsive Design Considerations](#6-responsive-design-considerations)
7. [Security Rules](#7-security-rules)
8. [Testing & Deployment](#8-testing--deployment)

---

## 1. Firebase Setup & Configuration

### Step 1.1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `candle-craft-ecommerce`
4. Enable Google Analytics (optional)
5. Choose your analytics account
6. Click "Create project"

### Step 1.2: Enable Required Services
1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Email link (passwordless sign-in)" if needed

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in "Test mode" (we'll configure rules later)
   - Choose location closest to your users

3. **Storage** (for product images):
   - Go to Storage
   - Click "Get started"
   - Start in test mode

### Step 1.3: Add Web App to Firebase Project
1. Click the web icon (`</>`) in project overview
2. Register app name: `candle-craft-web`
3. Enable Firebase Hosting (optional)
4. Copy the configuration object

### Step 1.4: Install Firebase Dependencies
```bash
npm install firebase
npm install @types/firebase # if using TypeScript
```

### Step 1.5: Create Firebase Configuration File
Create `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

---

## 2. User Authentication System

### Step 2.1: Create Authentication Context
Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  addresses: Address[];
  role: 'user' | 'admin';
  createdAt: Date;
}

interface Address {
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

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, profileData, { merge: true });
    
    // Update local state
    setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
  };

  const fetchUserProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      setUserProfile(userSnap.data() as UserProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

### Step 2.2: Create Authentication Components

#### Signup Component (`src/components/auth/SignupForm.tsx`):
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const SignupForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.password !== credentials.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (credentials.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    setStep(2);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create user account
      const user = await signup(credentials.email, credentials.password);
      
      // Save profile to Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email!,
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        addresses: [{
          id: 'default',
          label: 'Home',
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          addressLine1: profile.addressLine1,
          addressLine2: profile.addressLine2,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          isDefault: true
        }],
        role: 'user' as const,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      alert('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to create account. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account - Step {step} of 2</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
              required
            />
            <Button type="submit" className="w-full">
              Next: Personal Details
            </Button>
          </form>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              required
            />
            <Input
              placeholder="Phone Number"
              value={profile.phoneNumber}
              onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
              required
            />
            <Input
              placeholder="Address Line 1"
              value={profile.addressLine1}
              onChange={(e) => setProfile({...profile, addressLine1: e.target.value})}
              required
            />
            <Input
              placeholder="Address Line 2 (Optional)"
              value={profile.addressLine2}
              onChange={(e) => setProfile({...profile, addressLine2: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="City"
                value={profile.city}
                onChange={(e) => setProfile({...profile, city: e.target.value})}
                required
              />
              <Input
                placeholder="State"
                value={profile.state}
                onChange={(e) => setProfile({...profile, state: e.target.value})}
                required
              />
            </div>
            <Input
              placeholder="Pincode"
              value={profile.pincode}
              onChange={(e) => setProfile({...profile, pincode: e.target.value})}
              required
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
```

#### Login Component (`src/components/auth/LoginForm.tsx`):
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirect will be handled by the auth state change
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

---

## 3. User Profile & Dashboard

### Step 3.1: Create Profile Page (`src/pages/Profile.tsx`)
```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export const Profile: React.FC = () => {
  const { currentUser, userProfile, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: userProfile?.fullName || '',
    phoneNumber: userProfile?.phoneNumber || '',
  });

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert('Failed to logout');
    }
  };

  if (!currentUser || !userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  onClick={() => setEditMode(!editMode)}
                  variant="outline"
                  size="sm"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={userProfile.email} disabled />
              </div>
              
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  disabled={!editMode}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                  disabled={!editMode}
                />
              </div>

              {editMode && (
                <Button onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <AddressManager />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### Step 3.2: Create Address Management Component
```typescript
// Add to Profile.tsx or create separate file
const AddressManager: React.FC = () => {
  const { userProfile, updateProfile } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const addAddress = async () => {
    if (!userProfile) return;
    
    const addressWithId = {
      ...newAddress,
      id: Date.now().toString(),
      isDefault: userProfile.addresses.length === 0
    };

    const updatedAddresses = [...userProfile.addresses, addressWithId];
    await updateProfile({ addresses: updatedAddresses });
    
    setNewAddress({
      label: '',
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    });
    setShowAddForm(false);
  };

  const removeAddress = async (addressId: string) => {
    if (!userProfile) return;
    
    const updatedAddresses = userProfile.addresses.filter(addr => addr.id !== addressId);
    await updateProfile({ addresses: updatedAddresses });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Delivery Addresses</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          Add New Address
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Address Label (e.g., Home, Office)"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
              />
              <Input
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
              />
              <Input
                placeholder="Phone Number"
                value={newAddress.phoneNumber}
                onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
              />
              <Input
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
              />
              <Input
                placeholder="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
              />
              <Input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
              />
              <Input
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
              />
              <Input
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addAddress}>Save Address</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {userProfile?.addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{address.label}</h4>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p>{address.fullName}</p>
                  <p>{address.phoneNumber}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeAddress(address.id)}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

---

## 4. Checkout Flow Implementation

### Step 4.1: Create Order Types (`src/types/order.ts`)
```typescript
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
```

### Step 4.2: Update Cart Context for Checkout
Add to `src/contexts/CartContext.tsx`:

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

// Add to CartContext
const { currentUser, userProfile } = useAuth();

const checkout = async (selectedAddressId: string) => {
  if (!currentUser || !userProfile) {
    throw new Error('User must be logged in to checkout');
  }

  const selectedAddress = userProfile.addresses.find(addr => addr.id === selectedAddressId);
  if (!selectedAddress) {
    throw new Error('Selected address not found');
  }

  const orderItems: OrderItem[] = cartItems.map(item => ({
    productId: item.id,
    productName: item.name,
    productImage: item.image,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity
  }));

  const order: Omit<Order, 'id'> = {
    userId: currentUser.uid,
    items: orderItems,
    deliveryAddress: selectedAddress,
    orderTotal: totalAmount,
    status: 'pending_payment',
    paymentStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), order);
    
    // Clear cart after successful order
    setCartItems([]);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

### Step 4.3: Update Cart Page with Auth Check
Update `src/pages/Cart.tsx`:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

// Add to Cart component
const { currentUser, userProfile } = useAuth();
const [showLoginDialog, setShowLoginDialog] = useState(false);
const [selectedAddressId, setSelectedAddressId] = useState('');
const [isCheckingOut, setIsCheckingOut] = useState(false);

const handleCheckout = async () => {
  if (!currentUser) {
    setShowLoginDialog(true);
    return;
  }

  if (!selectedAddressId) {
    alert('Please select a delivery address');
    return;
  }

  setIsCheckingOut(true);
  try {
    const orderId = await checkout(selectedAddressId);
    alert(`Order placed successfully! Order ID: ${orderId}`);
    // Redirect to order confirmation or profile page
  } catch (error) {
    alert('Failed to place order. Please try again.');
  }
  setIsCheckingOut(false);
};

// Add address selection before checkout button
{currentUser && userProfile && (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">
      Select Delivery Address:
    </label>
    <select
      value={selectedAddressId}
      onChange={(e) => setSelectedAddressId(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="">Choose an address...</option>
      {userProfile.addresses.map((address) => (
        <option key={address.id} value={address.id}>
          {address.label} - {address.addressLine1}, {address.city}
        </option>
      ))}
    </select>
  </div>
)}

// Update checkout button
<Button 
  onClick={handleCheckout}
  disabled={isCheckingOut}
  className="w-full"
>
  {isCheckingOut ? 'Placing Order...' : 'Checkout'}
</Button>

// Add login dialog
<Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Login Required</DialogTitle>
    </DialogHeader>
    <LoginForm />
  </DialogContent>
</Dialog>
```

---

## 5. Admin Dashboard

### Step 5.1: Create Admin Context (`src/contexts/AdminContext.tsx`)
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  createdAt: Date;
}

interface AdminContextType {
  orders: Order[];
  products: Product[];
  analytics: {
    totalOrders: number;
    totalRevenue: number;
    activeUsers: number;
    recentSales: Order[];
  };
  updateOrderStatus: (orderId: string, status: string, estimatedDelivery?: Date) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    recentSales: [] as Order[]
  });

  // Real-time orders subscription
  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
      
      // Update analytics
      const totalRevenue = ordersData
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + order.orderTotal, 0);
      
      setAnalytics(prev => ({
        ...prev,
        totalOrders: ordersData.length,
        totalRevenue,
        recentSales: ordersData.slice(0, 10)
      }));
    });

    return unsubscribe;
  }, []);

  // Real-time products subscription
  useEffect(() => {
    const productsQuery = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setProducts(productsData);
    });

    return unsubscribe;
  }, []);

  const updateOrderStatus = async (orderId: string, status: string, estimatedDelivery?: Date) => {
    const orderRef = doc(db, 'orders', orderId);
    const updates: any = {
      status,
      updatedAt: new Date()
    };
    
    if (estimatedDelivery) {
      updates.estimatedDeliveryDate = estimatedDelivery;
    }
    
    await updateDoc(orderRef, updates);
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date()
    });
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updates);
  };

  const deleteProduct = async (productId: string) => {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  };

  const value = {
    orders,
    products,
    analytics,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
```

### Step 5.2: Create Admin Dashboard (`src/pages/AdminDashboard.tsx`)
```typescript
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const AdminDashboard: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { orders, products, analytics, updateOrderStatus, addProduct } = useAdmin();

  if (userProfile?.role !== 'admin') {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsPanel analytics={analytics} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement orders={orders} updateOrderStatus={updateOrderStatus} />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement products={products} addProduct={addProduct} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AnalyticsPanel: React.FC<{ analytics: any }> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analytics.totalOrders}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analytics.activeUsers}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.recentSales.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center p-2 border rounded">
                <span>Order #{order.id.slice(-6)}</span>
                <span>₹{order.orderTotal}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt.toDate()).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OrderManagement: React.FC<{ orders: any[], updateOrderStatus: any }> = ({ 
  orders, 
  updateOrderStatus 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully');
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Management</h2>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                  <p>Customer: {order.deliveryAddress.fullName}</p>
                  <p>Total: ₹{order.orderTotal}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt.toDate()).toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-2">
                  <Select 
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusUpdate(order.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_payment">Pending Payment</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProductManagement: React.FC<{ products: any[], addProduct: any }> = ({ 
  products, 
  addProduct 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    images: [],
    inStock: true
  });

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        category: '',
        images: [],
        inStock: true
      });
      setShowAddForm(false);
      alert('Product added successfully');
    } catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          Add New Product
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
              />
              <Input
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="col-span-2 p-2 border rounded"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddProduct}>Add Product</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="pt-6">
              <h3 className="font-semibold">{product.name}</h3>
              <p>₹{product.price}</p>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

---

## 6. Responsive Design Considerations

### Step 6.1: Mobile-First Design Principles
- Use Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Implement touch-friendly button sizes (minimum 44px)
- Ensure proper spacing for mobile interactions
- Use collapsible navigation for mobile

### Step 6.2: Key Responsive Components
```css
/* Add to src/index.css */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .profile-tabs {
    flex-direction: column;
  }
  
  .checkout-form {
    grid-template-columns: 1fr;
  }
}

/* Touch targets for mobile */
.btn-mobile {
  min-height: 44px;
  min-width: 44px;
}
```

---

## 7. Security Rules

### Step 7.1: Firestore Security Rules
```javascript
// Firestore Rules (add in Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - users can read their own orders, admins can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products - anyone can read, only admins can write
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 7.2: Storage Security Rules
```javascript
// Storage Rules (add in Firebase Console)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 8. Testing & Deployment

### Step 8.1: Testing Checklist
- [ ] User registration with email validation
- [ ] User login with error handling
- [ ] Profile updates save correctly
- [ ] Address management works
- [ ] Cart checkout requires authentication
- [ ] Orders are created in Firestore
- [ ] Admin dashboard shows real-time data
- [ ] Order status updates reflect immediately
- [ ] Product management functions work
- [ ] Security rules prevent unauthorized access
- [ ] Mobile responsiveness on all pages

### Step 8.2: Environment Variables
Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

Update `firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### Step 8.3: Deployment
```bash
# Build for production
npm run build

# Deploy to Firebase Hosting (optional)
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Next Steps & Future Enhancements

1. **Payment Integration**: Add Razorpay/Stripe for actual payments
2. **Email Notifications**: Send order confirmations and updates
3. **Push Notifications**: Real-time order status updates
4. **Product Reviews**: Allow customers to review products
5. **Inventory Management**: Track stock levels automatically
6. **Analytics Integration**: Google Analytics for better insights
7. **SEO Optimization**: Meta tags and structured data
8. **Performance Optimization**: Lazy loading and caching

This guide provides a complete foundation for your Firebase-integrated e-commerce platform. Each step builds upon the previous one, ensuring a robust and scalable solution.