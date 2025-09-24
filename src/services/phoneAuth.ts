import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider,
  linkWithCredential,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export class PhoneAuthService {
  private static recaptchaVerifier: RecaptchaVerifier | null = null;
  private static readonly RESEND_COOLDOWN = 120000; // 2 minutes in milliseconds

  // Track OTP sessions to prevent abuse
  private static otpSessions: Map<string, { 
    lastSent: number, 
    confirmationResult: ConfirmationResult | null 
  }> = new Map();

  static initializeRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
    if (!this.recaptchaVerifier) {
      // First check if the container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`reCAPTCHA container with ID '${containerId}' not found`);
        throw new Error('reCAPTCHA container not found');
      }

      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.resetRecaptcha();
        },
        'error-callback': (error: any) => {
          console.error('reCAPTCHA error:', error);
          this.resetRecaptcha();
        }
      });
      window.recaptchaVerifier = this.recaptchaVerifier;
    }
    return this.recaptchaVerifier;
  }

  static resetRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
      delete window.recaptchaVerifier;
    }
  }

  static async sendOTP(phoneNumber: string): Promise<{ 
    confirmationResult: ConfirmationResult, 
    canResendAt: number 
  }> {
    try {
      // Format phone number to international format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      console.log('Attempting to send OTP to:', formattedPhone);
      
      // Check if we need to wait before sending another OTP
      const session = this.otpSessions.get(formattedPhone);
      const now = Date.now();
      
      if (session && (now - session.lastSent) < this.RESEND_COOLDOWN) {
        const remainingTime = this.RESEND_COOLDOWN - (now - session.lastSent);
        throw new Error(`Please wait ${Math.ceil(remainingTime / 1000)} seconds before requesting another OTP.`);
      }
      
      // Invalidate old OTP in database
      await this.invalidateOldOTP(formattedPhone);
      
      // Reset any existing recaptcha
      this.resetRecaptcha();
      
      const recaptcha = this.initializeRecaptcha();
      console.log('reCAPTCHA initialized');
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      console.log('OTP sent successfully');
      
      // Store OTP session data
      const canResendAt = now + this.RESEND_COOLDOWN;
      this.otpSessions.set(formattedPhone, {
        lastSent: now,
        confirmationResult
      });
      
      // Store OTP tracking in database
      await this.trackOTPInDatabase(formattedPhone, now);
      
      return { confirmationResult, canResendAt };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      this.resetRecaptcha();
      
      // Provide more specific error messages
      if (error.message.includes('wait')) {
        throw error; // Re-throw cooldown errors as-is
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async verifyOTP(confirmationResult: ConfirmationResult, code: string): Promise<User> {
    try {
      const result = await confirmationResult.confirm(code);
      
      // Clean up the session after successful verification
      const phoneNumber = result.user.phoneNumber;
      if (phoneNumber) {
        this.otpSessions.delete(phoneNumber);
        await this.invalidateOldOTP(phoneNumber);
      }
      
      return result.user;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async resendOTP(phoneNumber: string): Promise<{ 
    confirmationResult: ConfirmationResult, 
    canResendAt: number 
  }> {
    console.log('Resending OTP for:', phoneNumber);
    return await this.sendOTP(phoneNumber);
  }

  static async invalidateOldOTP(phoneNumber: string): Promise<void> {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const otpDoc = doc(db, 'phoneVerifications', formattedPhone);
      await deleteDoc(otpDoc);
      console.log('Old OTP invalidated for:', formattedPhone);
    } catch (error) {
      console.log('No old OTP to invalidate or error deleting:', error);
    }
  }

  static async trackOTPInDatabase(phoneNumber: string, timestamp: number): Promise<void> {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const otpDoc = doc(db, 'phoneVerifications', formattedPhone);
      
      await setDoc(otpDoc, {
        phoneNumber: formattedPhone,
        sentAt: serverTimestamp(),
        timestamp: timestamp,
        status: 'pending',
        attempts: 0
      });
      
      console.log('OTP tracked in database for:', formattedPhone);
    } catch (error) {
      console.error('Error tracking OTP in database:', error);
    }
  }

  static getResendCooldown(): number {
    return this.RESEND_COOLDOWN;
  }

  static canResendOTP(phoneNumber: string): { canResend: boolean, waitTime: number } {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const session = this.otpSessions.get(formattedPhone);
    
    if (!session) {
      return { canResend: true, waitTime: 0 };
    }
    
    const now = Date.now();
    const timeSinceLastSent = now - session.lastSent;
    const canResend = timeSinceLastSent >= this.RESEND_COOLDOWN;
    const waitTime = canResend ? 0 : this.RESEND_COOLDOWN - timeSinceLastSent;
    
    return { canResend, waitTime };
  }

  static async linkPhoneToEmail(emailUser: User, phoneNumber: string, verificationCode: string): Promise<User> {
    try {
      const credential = PhoneAuthProvider.credential(verificationCode, phoneNumber);
      const result = await linkWithCredential(emailUser, credential);
      return result.user;
    } catch (error: any) {
      console.error('Error linking phone to email:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format. Please enter a valid Indian mobile number.';
      case 'auth/too-many-requests':
        return 'Too many OTP requests. Please try again after some time.';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code. Please check and try again.';
      case 'auth/code-expired':
        return 'Verification code has expired. Please request a new code.';
      case 'auth/missing-phone-number':
        return 'Phone number is required.';
      case 'auth/quota-exceeded':
        return 'Daily SMS quota exceeded. Please try again tomorrow.';
      case 'auth/captcha-check-failed':
        return 'Security verification failed. Please refresh and try again.';
      case 'auth/invalid-app-credential':
        return 'App configuration error. Please contact support.';
      case 'auth/app-not-authorized':
        return 'This app is not authorized to use phone authentication.';
      case 'auth/operation-not-allowed':
        return 'Phone authentication is not enabled. Please contact support.';
      default:
        return `Phone verification failed (${errorCode}). Please check your internet connection and try again.`;
    }
  }

  static formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle Indian phone numbers
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('+91')) {
      return cleaned;
    }
    
    return phone; // Return as-is if format not recognized
  }

  static isValidPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    // Valid Indian mobile numbers: 10 digits starting with 6-9
    return /^[6-9]\d{9}$/.test(cleaned);
  }
}