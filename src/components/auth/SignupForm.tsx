import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SignupCredentials, ProfileDetails, SignupData } from '../../types/auth';

export const SignupForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [profile, setProfile] = useState<ProfileDetails>({
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
    setError('');
    
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setStep(2);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create SignupData object for the new auth system
      const signupData: SignupData = {
        phoneNumber: profile.phoneNumber,
        email: credentials.email,
        username: credentials.email.split('@')[0], // Generate username from email
        fullName: profile.fullName,
        password: credentials.password
      };
      
      // Create user account
      const user = await signup(signupData);
      
      // Profile is automatically created by the signup function
      console.log('User created successfully:', user.uid);
      
      alert('Account created successfully! Welcome to Candle Craft!');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account - Step {step} of 2</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
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
              value={profile.addressLine2 || ''}
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