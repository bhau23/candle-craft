import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, Product } from '../types/auth';

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  recentSales: Order[];
  topProducts: { productId: string; productName: string; totalSold: number; revenue: number }[];
}

interface AdminContextType {
  orders: Order[];
  products: Product[];
  stats: AdminStats;
  loading: boolean;
  updateOrderStatus: (orderId: string, status: string, estimatedDelivery?: Date) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    recentSales: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  // Real-time orders subscription
  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryDate: data.estimatedDeliveryDate?.toDate(),
        } as Order;
      });
      
      setOrders(ordersData);
      updateStats(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Real-time products subscription
  useEffect(() => {
    const productsQuery = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Product;
      });
      
      setProducts(productsData);
    });

    return unsubscribe;
  }, []);

  const updateStats = async (ordersData: Order[]) => {
    // Calculate basic stats
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData
      .filter(order => order.paymentStatus === 'completed')
      .reduce((sum, order) => sum + order.orderTotal, 0);
    
    const recentSales = ordersData.slice(0, 10);

    // Get unique users count
    const uniqueUsers = new Set(ordersData.map(order => order.userId));
    const activeUsers = uniqueUsers.size;

    // Calculate top products
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    ordersData.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.total;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        totalSold: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    setStats({
      totalOrders,
      totalRevenue,
      activeUsers,
      recentSales,
      topProducts
    });
  };

  const updateOrderStatus = async (orderId: string, status: string, estimatedDelivery?: Date): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    const updates: any = {
      status,
      updatedAt: new Date()
    };
    
    if (estimatedDelivery) {
      updates.estimatedDeliveryDate = estimatedDelivery;
    }
    
    // Update payment status if order is delivered
    if (status === 'delivered') {
      updates.paymentStatus = 'completed';
    }
    
    await updateDoc(orderRef, updates);
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<void> => {
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date()
    });
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { ...updates, updatedAt: new Date() });
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  };

  const value: AdminContextType = {
    orders,
    products,
    stats,
    loading,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};