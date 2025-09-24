import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem, Product, CartSummary, CartContextType } from '@/types/cart';
import { Order, OrderItem } from '@/types/auth';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'candle-craft-cart';
const PLATFORM_FEE = 7;
const GIFT_CHARGE = 30;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { currentUser, userProfile } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Convert date strings back to Date objects
        const cartItems = parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setItems(cartItems);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = (product: Product, isGift: boolean = false, quantity: number = 1) => {
    // Check if user is authenticated
    if (!currentUser) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    const timestamp = Date.now();
    const itemId = `${product.id}-${timestamp}`;
    
    const newItem: CartItem = {
      id: itemId,
      product,
      quantity,
      isGift,
      addedAt: new Date()
    };

    setItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartSummary = (): CartSummary => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.product.originalPrice - item.product.price;
      return sum + (discount * item.quantity);
    }, 0);

    const giftCharges = items.reduce((sum, item) => {
      return sum + (item.isGift ? GIFT_CHARGE * item.quantity : 0);
    }, 0);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const total = subtotal + giftCharges + PLATFORM_FEE;

    return {
      subtotal,
      totalDiscount,
      giftCharges,
      platformFee: PLATFORM_FEE,
      total,
      totalItems
    };
  };

  const isInCart = (productId: number | string): boolean => {
    return items.some(item => item.product.id === productId);
  };

  const checkout = async (selectedAddressId: string): Promise<string> => {
    if (!currentUser || !userProfile) {
      throw new Error('User must be logged in to checkout');
    }

    const selectedAddress = userProfile.addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      throw new Error('Selected address not found');
    }

    const orderItems: OrderItem[] = items.map(item => ({
      productId: item.product.id.toString(),
      productName: item.product.name,
      productImage: item.product.images[0] || '',
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    }));

    const summary = getCartSummary();
    
    const order: Omit<Order, 'id'> = {
      userId: currentUser.uid,
      items: orderItems,
      deliveryAddress: selectedAddress,
      orderTotal: summary.total,
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      
      // Clear cart after successful order
      clearCart();
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    isInCart,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};