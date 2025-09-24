import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Phone, Mail, User, Check } from 'lucide-react';
import { PhoneAuthService } from '../../services/phoneAuth';
import { ConfirmationResult } from 'firebase/auth';
import { AuthStep, SignupData } from '../../types/auth';

interface EnhancedSignupProps {
  onSignupComplete: (signupData: SignupData) => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
}

export const EnhancedSignup: React.FC<EnhancedSignupProps> = ({
  onSignupComplete,
  onSwitchToLogin,
  loading
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone-input');
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [canResendAt, setCanResendAt] = useState<number>(0);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  // Countdown timer effect
  useEffect(() => {
    if (canResendAt > 0) {
      const updateCountdown = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((canResendAt - now) / 1000));
        setResendCountdown(remaining);
        
        if (remaining > 0) {
          setTimeout(updateCountdown, 1000);
        }
      };
      updateCountdown();
    }
  }, [canResendAt]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.phoneNumber) return;

    if (!PhoneAuthService.isValidPhoneNumber(signupData.phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const formattedPhone = PhoneAuthService.formatPhoneNumber(signupData.phoneNumber);
      const result = await PhoneAuthService.sendOTP(formattedPhone);
      setConfirmationResult(result.confirmationResult);
      setCanResendAt(result.canResendAt);
      setCurrentStep('phone-verify');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !verificationCode) return;

    setVerifyLoading(true);
    setError('');

    try {
      await PhoneAuthService.verifyOTP(confirmationResult, verificationCode);
      setCurrentStep('personal-details');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePersonalDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.username || !signupData.fullName || !signupData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const completeSignupData: SignupData = {
      phoneNumber: signupData.phoneNumber!,
      email: signupData.email || '',
      username: signupData.username!,
      fullName: signupData.fullName!,
      password: signupData.password!
    };

    try {
      await onSignupComplete(completeSignupData);
      setCurrentStep('completed');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const resendOTP = async () => {
    if (!signupData.phoneNumber) return;
    
    setOtpLoading(true);
    setError('');
    setVerificationCode(''); // Clear previous code
    
    try {
      PhoneAuthService.resetRecaptcha();
      const formattedPhone = PhoneAuthService.formatPhoneNumber(signupData.phoneNumber);
      const result = await PhoneAuthService.resendOTP(formattedPhone);
      setConfirmationResult(result.confirmationResult);
      setCanResendAt(result.canResendAt);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const renderPhoneInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Enter Mobile Number
        </CardTitle>
        <CardDescription>
          We'll send you a verification code to confirm your number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={signupData.phoneNumber || ''}
                onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                className="rounded-l-none"
                maxLength={10}
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={otpLoading}>
            {otpLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </CardContent>
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </Card>
  );

  const renderOTPVerification = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Verify Mobile Number
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to +91{signupData.phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOTPVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={verifyLoading}>
            {verifyLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              {resendCountdown > 0 ? (
                <span className="text-gray-500">
                  Resend in {resendCountdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-blue-600 hover:underline"
                  disabled={otpLoading}
                >
                  {otpLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentStep('phone-input');
                setVerificationCode('');
                setCanResendAt(0);
                setResendCountdown(0);
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              Change mobile number
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderPersonalDetails = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Complete Your Profile
        </CardTitle>
        <CardDescription>
          Fill in your details to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePersonalDetailsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a unique username"
              value={signupData.username || ''}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={signupData.fullName || ''}
              onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={signupData.email || ''}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={signupData.password || ''}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderCompleted = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <Check className="h-5 w-5" />
          Account Created Successfully!
        </CardTitle>
        <CardDescription>
          Your account has been created. Please login to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onSwitchToLogin} className="w-full">
          Continue to Login
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {currentStep === 'phone-input' && renderPhoneInput()}
      {currentStep === 'phone-verify' && renderOTPVerification()}
      {currentStep === 'personal-details' && renderPersonalDetails()}
      {currentStep === 'completed' && renderCompleted()}
    </div>
  );
};