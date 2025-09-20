export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
}

export interface CartItem {
  id: string; // Unique cart item ID (product.id + timestamp)
  product: Product;
  quantity: number;
  isGift: boolean;
  addedAt: Date;
}

export interface CartSummary {
  subtotal: number;
  totalDiscount: number;
  giftCharges: number;
  platformFee: number;
  total: number;
  totalItems: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, isGift?: boolean, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: () => CartSummary;
  isInCart: (productId: number | string) => boolean;
}