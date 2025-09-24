import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile, Address, SignupData } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (signupData: SignupData) => Promise<User>;
  login: (identifier: string, password: string, loginType: 'email' | 'phone' | 'username') => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (signupData: SignupData): Promise<User> => {
    // Create email account or use phone-verified account
    let userCredential;
    
    if (signupData.email) {
      // Create with email and password
      userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
    } else {
      // For phone-only signup, we need to create a temporary email
      const tempEmail = `${signupData.phoneNumber.replace('+', '')}@temp.candle-craft.com`;
      userCredential = await createUserWithEmailAndPassword(auth, tempEmail, signupData.password);
    }

    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: signupData.email || '',
      username: signupData.username,
      fullName: signupData.fullName,
      phoneNumber: signupData.phoneNumber,
      phoneVerified: true, // Already verified during signup
      emailVerified: !!signupData.email,
      addresses: [],
      role: 'user',
      createdAt: new Date()
    };

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userProfile);

    return user;
  };

  const findUserByIdentifier = async (identifier: string, loginType: 'email' | 'phone' | 'username'): Promise<UserProfile | null> => {
    try {
      let queryConstraint;
      
      switch (loginType) {
        case 'email':
          queryConstraint = where('email', '==', identifier);
          break;
        case 'phone':
          const formattedPhone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
          queryConstraint = where('phoneNumber', '==', formattedPhone);
          break;
        case 'username':
          queryConstraint = where('username', '==', identifier);
          break;
        default:
          return null;
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, queryConstraint);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { ...userDoc.data(), uid: userDoc.id } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  };

  const login = async (identifier: string, password: string, loginType: 'email' | 'phone' | 'username'): Promise<User> => {
    if (loginType === 'email') {
      // Direct email login
      const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
      return userCredential.user;
    } else {
      // Find user by phone or username, then login with their email
      const userProfile = await findUserByIdentifier(identifier, loginType);
      
      if (!userProfile) {
        throw new Error(`No account found with this ${loginType}`);
      }

      let loginEmail = userProfile.email;
      
      // If no email, use the temp email format
      if (!loginEmail) {
        loginEmail = `${userProfile.phoneNumber.replace('+', '')}@temp.candle-craft.com`;
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      return userCredential.user;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, { ...profileData, updatedAt: new Date() }, { merge: true });
    
    // Update local state
    setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
  };

  const fetchUserProfile = async (user: User): Promise<void> => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        // Convert Firestore timestamps to Date objects
        const profileData: UserProfile = {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as UserProfile;
        setUserProfile(profileData);
      } else {
        // If profile doesn't exist, this might be a new user
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
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

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};