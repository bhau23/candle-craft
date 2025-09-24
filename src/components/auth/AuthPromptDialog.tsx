import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { ShoppingCart, User } from 'lucide-react';

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  action?: 'add-to-cart' | 'checkout' | 'view-profile';
}

export const AuthPromptDialog: React.FC<AuthPromptDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  action = 'add-to-cart'
}) => {
  const navigate = useNavigate();

  const getDefaultContent = () => {
    switch (action) {
      case 'add-to-cart':
        return {
          title: 'Login Required',
          description: 'Please login or create an account to add items to your cart and make purchases.',
          icon: <ShoppingCart className="h-6 w-6 text-blue-600" />
        };
      case 'checkout':
        return {
          title: 'Login Required for Checkout',
          description: 'Please login to complete your order and proceed with checkout.',
          icon: <ShoppingCart className="h-6 w-6 text-blue-600" />
        };
      case 'view-profile':
        return {
          title: 'Access Your Account',
          description: 'Please login to view your profile, orders, and account settings.',
          icon: <User className="h-6 w-6 text-blue-600" />
        };
      default:
        return {
          title: 'Login Required',
          description: 'Please login to continue with this action.',
          icon: <User className="h-6 w-6 text-blue-600" />
        };
    }
  };

  const defaultContent = getDefaultContent();

  const handleLoginRedirect = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {defaultContent.icon}
            <AlertDialogTitle>
              {title || defaultContent.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {description || defaultContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>Continue Browsing</AlertDialogCancel>
          <AlertDialogAction onClick={handleLoginRedirect}>
            Login / Sign Up
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};