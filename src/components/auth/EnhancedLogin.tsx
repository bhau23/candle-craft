import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, LogIn, Mail, Phone, User } from 'lucide-react';

interface EnhancedLoginProps {
  onLogin: (identifier: string, password: string, loginType: 'email' | 'phone' | 'username') => Promise<void>;
  onSwitchToSignup: () => void;
  loading: boolean;
}

export const EnhancedLogin: React.FC<EnhancedLoginProps> = ({
  onLogin,
  onSwitchToSignup,
  loading
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const detectLoginType = (input: string): 'email' | 'phone' | 'username' => {
    // Check if it's an email
    if (input.includes('@') && input.includes('.')) {
      return 'email';
    }
    
    // Check if it's a phone number (10 digits or starts with +91)
    const cleanedInput = input.replace(/\D/g, '');
    if (cleanedInput.length === 10 || (cleanedInput.length === 12 && cleanedInput.startsWith('91'))) {
      return 'phone';
    }
    
    // Otherwise treat as username
    return 'username';
  };

  const getInputIcon = () => {
    const loginType = detectLoginType(identifier);
    switch (loginType) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getPlaceholderText = () => {
    if (!identifier) {
      return 'Email, username, or mobile number';
    }
    
    const loginType = detectLoginType(identifier);
    switch (loginType) {
      case 'email':
        return 'Enter your email address';
      case 'phone':
        return 'Enter your mobile number';
      default:
        return 'Enter your username';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    const loginType = detectLoginType(identifier);
    
    try {
      await onLogin(identifier, password, loginType);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your account using email, username, or mobile number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email / Username / Mobile</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {getInputIcon()}
                </div>
                <Input
                  id="identifier"
                  type="text"
                  placeholder={getPlaceholderText()}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {identifier && (
                <p className="text-xs text-gray-500">
                  Login as: {detectLoginType(identifier)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 hover:underline"
                >
                  Sign up here
                </button>
              </p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>You can login using:</p>
                <div className="flex justify-center gap-4">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> Username
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Mobile
                  </span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};