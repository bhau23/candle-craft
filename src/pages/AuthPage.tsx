import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EnhancedLogin } from '../components/auth/EnhancedLogin';
import { EnhancedSignup } from '../components/auth/EnhancedSignup';
import { SignupData } from '../types/auth';
import { toast } from '../hooks/use-toast';

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (signupData: SignupData) => {
    setLoading(true);
    try {
      await signup(signupData);
      toast({
        title: "Account Created Successfully!",
        description: "Your account has been created. Please log in to continue.",
        variant: "default",
      });
      setAuthMode('login');
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (identifier: string, password: string, loginType: 'email' | 'phone' | 'username') => {
    setLoading(true);
    try {
      await login(identifier, password, loginType);
      
      toast({
        title: "Welcome Back!",
        description: "You have been successfully logged in.",
        variant: "default",
      });
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with these credentials.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {authMode === 'login' ? (
        <EnhancedLogin
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthMode('signup')}
          loading={loading}
        />
      ) : (
        <EnhancedSignup
          onSignupComplete={handleSignup}
          onSwitchToLogin={() => setAuthMode('login')}
          loading={loading}
        />
      )}
    </>
  );
};