# Firebase Security Rules Configuration

## Firestore Security Rules

Copy these rules to your Firebase Console under Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow admins to read all user profiles for order management
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders - users can read their own orders, admins can read/write all
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Users can create orders for themselves
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      
      // Only admins can update orders (status changes)
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Only admins can delete orders
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products - anyone can read, only admins can write
    match /products/{productId} {
      // Allow everyone to read products (for browsing)
      allow read: if true;
      
      // Only admins can create, update, or delete products
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Analytics or other admin-only collections
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Phone verification collection (temporary storage for OTP verification)
    match /phoneVerifications/{verificationId} {
      allow create: if true; // Allow anonymous creation for OTP process
      allow read, update: if request.auth != null;
      allow delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Storage Security Rules

Copy these rules to your Firebase Console under Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - anyone can read, only admins can write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User profile images - users can manage their own, admins can manage all
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // General uploads - authenticated users only
    match /uploads/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Setting up the Rules

### Step 1: Configure Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. Click on the "Rules" tab
5. Replace the existing rules with the Firestore rules above
6. Click "Publish"

### Step 2: Configure Storage Rules
1. In the same Firebase project
2. Go to Storage
3. Click on the "Rules" tab
4. Replace the existing rules with the Storage rules above
5. Click "Publish"

## Creating Your First Admin User

Since the security rules require an admin role, you need to create your first admin user manually:

### Method 1: Using Firebase Console (Recommended)
1. Create a regular account through your app
2. Go to Firebase Console > Firestore Database
3. Find the user document in the `users` collection
4. Edit the document and change `role` from `"user"` to `"admin"`
5. Save the changes

### Method 2: Using a temporary script
You can create a temporary admin creation function in your development environment:

```typescript
// temporary-admin-setup.ts (Run this once, then delete)
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './src/config/firebase';

const makeUserAdmin = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin'
    });
    console.log('User promoted to admin successfully');
  } catch (error) {
    console.error('Error promoting user to admin:', error);
  }
};

// Replace with the actual user ID from Firebase Auth
makeUserAdmin('your-user-id-here');
```

## Security Rules Explanation

### User Access Control
- Users can only read and write their own profile data
- Admins can read all user profiles (needed for order management)
- This prevents users from seeing other users' personal information

### Order Management
- Users can only see their own orders
- Users can create orders for themselves
- Only admins can update order status and delivery information
- This ensures order data integrity and proper access control

### Product Management
- Everyone can read products (for browsing the store)
- Only admins can add, edit, or delete products
- This allows public access to the catalog while protecting product data

### Storage Access
- Product images are publicly readable but only admin-writable
- User uploads are restricted to the uploading user and admins
- This ensures proper content control and user privacy

## Testing the Security Rules

### Test User Operations:
1. Sign up for a new account
2. Try to access the profile page ✅
3. Try to place an order ✅
4. Try to access another user's data ❌ (Should fail)

### Test Admin Operations:
1. Make a user admin using the console method above
2. Login with the admin account
3. Access the admin dashboard ✅
4. Try to update order status ✅
5. Try to add/edit products ✅

### Test Security:
1. Try to access admin routes as a regular user ❌ (Should redirect)
2. Try to modify orders as a regular user ❌ (Should fail)
3. Try to add products as a regular user ❌ (Should fail)

## Important Notes

1. **Test Mode vs Production**: Start with test mode rules for development, then apply production rules
2. **Admin Creation**: Always create your first admin user manually in the Firebase Console
3. **Rule Testing**: Use the Firebase Console Rules Playground to test your rules
4. **Error Handling**: Implement proper error handling in your app for permission denied errors
5. **Backup**: Always backup your rules before making changes

## Troubleshooting

### Common Issues:

1. **Permission Denied Errors**: 
   - Check if the user is properly authenticated
   - Verify the user's role in the database
   - Ensure the rules are published correctly

2. **Admin Access Issues**:
   - Verify the user document has `role: "admin"`
   - Check if the user is logged in properly
   - Ensure the admin context is properly loaded

3. **Order Creation Failures**:
   - Verify the user has addresses set up
   - Check if the cart context is working properly
   - Ensure the order data structure matches the rules

## Next Steps

After implementing these security rules:

1. **Test thoroughly** in development
2. **Create your admin user**
3. **Test all user flows**
4. **Monitor Firebase Console for any rule violations**
5. **Consider adding additional logging for security events**