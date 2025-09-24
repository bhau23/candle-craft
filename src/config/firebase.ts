import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ0VXMluOa7A2oc4_1VtFVx7NmCbcS-BU",
  authDomain: "candlecraft-b515f.firebaseapp.com",
  projectId: "candlecraft-b515f",
  storageBucket: "candlecraft-b515f.firebasestorage.app",
  messagingSenderId: "919701956900",
  appId: "1:919701956900:web:d4e2d238bbef4fb5a42bb1",
  measurementId: "G-VWMJGBVT1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;