
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Store, Category, Order, User } from '../types';
import { STORES, INITIAL_CATEGORIES, addOrder, INITIAL_USERS, addUser as addMockUser, deleteUser as deleteMockUser } from '../services/mockData';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  stores: Store[];
  currentStore: Store | null;
  setCurrentStoreId: (id: string) => void;
  updateStoreSettings: (store: Store) => void;
  
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  // Admin Auth
  isAdmin: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  adminStoreId: string | null;
  setAdminStoreId: (id: string | null) => void;
  
  // Customer Auth
  customerUser: User | null;
  customerLogin: (email: string, pass: string) => boolean;
  customerSignup: (user: Partial<User>) => void;
  customerLogout: () => void;
  
  // User Management
  users: User[];
  adminAddUser: (user: User) => void;
  adminDeleteUser: (id: string) => void;
  
  processOrder: (shippingDetails: any, paymentMethod: 'COD' | 'Razorpay') => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stores, setStores] = useState<Store[]>(STORES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [currentStoreId, setCurrentStoreIdState] = useState<string>('store1');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminStoreId, setAdminStoreId] = useState<string | null>(null);
  
  const [customerUser, setCustomerUser] = useState<User | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const setCurrentStoreId = (id: string) => {
    setCurrentStoreIdState(id);
  };

  const updateStoreSettings = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  // Category CRUD
  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Admin Auth
  const login = (email: string, pass: string) => {
    if (email === 'admin@gmail.com' && pass === 'Dark360@') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminStoreId(null);
  };

  // Customer Auth
  const customerLogin = (email: string, pass: string) => {
    // In real app, verify hash. Here we check plain text against mock users
    const user = users.find(u => u.email === email && u.password === pass && u.role === 'customer');
    if (user) {
      setCustomerUser(user);
      return true;
    }
    return false;
  };

  const customerSignup = (userData: Partial<User>) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || '',
      role: 'customer',
      joinedDate: new Date().toISOString().split('T')[0],
      phone: userData.phone,
      address: userData.address
    };
    addMockUser(newUser);
    setUsers(prev => [...prev, newUser]);
    setCustomerUser(newUser);
  };

  const customerLogout = () => {
    setCustomerUser(null);
  };

  // Admin User Management
  const adminAddUser = (user: User) => {
    addMockUser(user);
    setUsers(prev => [...prev, user]);
  };

  const adminDeleteUser = (id: string) => {
    deleteMockUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const processOrder = async (shippingDetails: any, paymentMethod: 'COD' | 'Razorpay') => {
    return new Promise<string>((resolve) => {
      const newOrderId = `o${Date.now()}`;
      const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      const newOrder: Order = {
        id: newOrderId,
        customerName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        email: shippingDetails.email,
        storeId: currentStoreId,
        total: total,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...cart],
        shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}`,
        paymentMethod: paymentMethod
      };

      addOrder(newOrder);
      clearCart();
      
      // Simulate network delay
      setTimeout(() => {
        resolve(newOrderId);
      }, 1000);
    });
  };

  const currentStore = stores.find(s => s.id === currentStoreId) || stores[0];

  return (
    <AppContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      stores, currentStore, setCurrentStoreId, updateStoreSettings,
      categories, addCategory, updateCategory, deleteCategory,
      isAdmin, login, logout,
      adminStoreId, setAdminStoreId,
      customerUser, customerLogin, customerSignup, customerLogout,
      users, adminAddUser, adminDeleteUser,
      processOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
