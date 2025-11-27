
import { Product, Store, Order, Category, User } from '../types';

export const STORES: Store[] = [
  {
    id: 'store1',
    name: 'Quill & Coil',
    type: 'quilling',
    themeColor: 'quilling',
    heroImage: 'https://images.unsplash.com/photo-1576527582522-835260e0a516?q=80&w=2940&auto=format&fit=crop',
    tagline: 'Handcrafted Elegance in Paper.',
    address: '123 Paper Lane, Craft City, CA 90210',
    email: 'hello@quillandcoil.com',
    phone: '+1 (555) 123-4567',
    razorpayKey: 'rzp_test_1234567890'
  },
  {
    id: 'store2',
    name: 'Gifty',
    type: 'gifts',
    themeColor: 'gifts',
    heroImage: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2894&auto=format&fit=crop',
    tagline: 'Gifts for Every Occasion.',
    address: '456 Surprise Blvd, Gift Town, NY 10001',
    email: 'support@gifty.com',
    phone: '+1 (555) 987-6543',
    razorpayKey: 'rzp_test_1234567890'
  },
  {
    id: 'store3',
    name: 'Canvas & Hue',
    type: 'art',
    themeColor: 'art',
    heroImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2800&auto=format&fit=crop',
    tagline: 'Original Art & Masterpieces.',
    address: '789 Easel Street, Artville, TX 75001',
    email: 'contact@canvasandhue.com',
    phone: '+1 (555) 456-7890',
    razorpayKey: 'rzp_test_1234567890'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  // Quilling Categories
  { id: 'c1', storeId: 'store1', name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2000&auto=format&fit=crop' },
  { id: 'c2', storeId: 'store1', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2000&auto=format&fit=crop' },
  { id: 'c3', storeId: 'store1', name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000&auto=format&fit=crop' },
  
  // Gift Categories
  { id: 'c4', storeId: 'store2', name: 'Hampers', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop' },
  { id: 'c5', storeId: 'store2', name: 'Personalized', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2000&auto=format&fit=crop' },
  { id: 'c6', storeId: 'store2', name: 'Corporate', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop' },

  // Art Categories
  { id: 'c7', storeId: 'store3', name: 'Paintings', image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?q=80&w=2000&auto=format&fit=crop' },
  { id: 'c8', storeId: 'store3', name: 'Sketches', image: 'https://images.unsplash.com/photo-1628147496739-c70e334a123e?q=80&w=2000&auto=format&fit=crop' },
  { id: 'c9', storeId: 'store3', name: 'Prints', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=2000&auto=format&fit=crop' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Quilling (Store 1)
  { id: 'p1', storeId: 'store1', name: 'Sunrise Mandala Earrings', brand: 'PaperGems', category: 'Earrings', price: 25, stock: 15, rating: 4.8, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=2000&auto=format&fit=crop', description: 'Intricate sunrise mandala design handcrafted with acid-free paper strips.' },
  { id: 'p2', storeId: 'store1', name: 'Blue Teardrop Danglers', brand: 'QuillCraft', category: 'Earrings', price: 18, stock: 30, rating: 4.6, image: 'https://images.unsplash.com/photo-1630019852942-e5e1237d6d49?q=80&w=2000&auto=format&fit=crop', description: 'Elegant blue hues in a classic teardrop shape, waterproof coated.' },
  { id: 'p3', storeId: 'store1', name: 'Floral Stud Set', brand: 'PaperGems', category: 'Earrings', price: 12, stock: 50, rating: 4.9, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2000&auto=format&fit=crop', description: 'Set of 3 bright floral studs perfect for daily wear.' },
  { id: 'p4', storeId: 'store1', name: 'Peacock Feather Pendant', brand: 'QuillArt', category: 'Necklaces', price: 35, stock: 10, rating: 5.0, image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop', description: 'Stunning peacock feather design with gold accents.' },

  // Gifts (Store 2)
  { id: 'p5', storeId: 'store2', name: 'Luxury Spa Box', brand: 'SelfCare Co.', category: 'Hampers', price: 85, stock: 20, rating: 4.8, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2670&auto=format&fit=crop', description: 'Complete spa experience with candles, bath bombs, and lotions.' },
  { id: 'p6', storeId: 'store2', name: 'Custom Star Map', brand: 'NightSky', category: 'Personalized', price: 45, stock: 100, rating: 4.7, image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2000&auto=format&fit=crop', description: 'A print of the night sky on a specific date and location.' },
  { id: 'p7', storeId: 'store2', name: 'Gourmet Chocolate Set', brand: 'CocoaLuxe', category: 'Hampers', price: 30, stock: 40, rating: 4.9, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2670&auto=format&fit=crop', description: 'Artisan chocolates with exotic fillings.' },
  { id: 'p8', storeId: 'store2', name: 'Leather Journal', brand: 'Scribe', category: 'Corporate', price: 28, stock: 35, rating: 4.6, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2670&auto=format&fit=crop', description: 'Hand-bound leather journal with premium paper.' },

  // Art (Store 3)
  { id: 'p9', storeId: 'store3', name: 'Abstract Ocean Acrylic', brand: 'ArtistAnna', category: 'Paintings', price: 150, stock: 1, rating: 5.0, image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?q=80&w=2000&auto=format&fit=crop', description: 'Original acrylic pouring art on canvas, 24x36 inches.' },
  { id: 'p10', storeId: 'store3', name: 'Charcoal Portrait Sketch', brand: 'SketchStudio', category: 'Sketches', price: 80, stock: 5, rating: 4.8, image: 'https://images.unsplash.com/photo-1628147496739-c70e334a123e?q=80&w=2670&auto=format&fit=crop', description: 'Expressive charcoal sketch on archival paper.' },
  { id: 'p11', storeId: 'store3', name: 'Watercolor Landscape', brand: 'NatureArt', category: 'Paintings', price: 120, stock: 1, rating: 4.9, image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=2000&auto=format&fit=crop', description: 'Serene mountain landscape in watercolor.' },
  { id: 'p12', storeId: 'store3', name: 'Digital Art Print', brand: 'NeoVibe', category: 'Prints', price: 25, stock: 50, rating: 4.5, image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=2000&auto=format&fit=crop', description: 'High-quality print of modern digital surrealism.' },
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'o1', customerName: 'Alice Green', total: 43, status: 'Delivered', date: '2023-10-15', storeId: 'store1', items: [], shippingAddress: '123 Fake St, City', paymentMethod: 'Razorpay' },
  { id: 'o2', customerName: 'Mark Twain', total: 85, status: 'Processing', date: '2023-10-20', storeId: 'store2', items: [], shippingAddress: '456 River Rd, Town', paymentMethod: 'COD' },
  { id: 'o3', customerName: 'Sarah Connor', total: 150, status: 'Pending', date: '2023-10-21', storeId: 'store3', items: [], shippingAddress: '789 Sky Net, Future', paymentMethod: 'Razorpay' },
  { id: 'o4', customerName: 'John Wick', total: 25, status: 'Delivered', date: '2023-10-22', storeId: 'store1', items: [], shippingAddress: 'Continental Hotel, NYC', paymentMethod: 'COD' },
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'customer', joinedDate: '2023-10-01', phone: '1234567890', address: '123 Main St, New York, NY', password: 'password123' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joinedDate: '2023-10-15', phone: '9876543210', address: '456 Elm St, Los Angeles, CA', password: 'password123' },
  { id: 'u3', name: 'Admin', email: 'admin@gmail.com', role: 'admin', joinedDate: '2023-01-01', password: 'Dark360@' }
];

// Simple in-memory storage simulation
let products = [...INITIAL_PRODUCTS];
let orders = [...INITIAL_ORDERS];
let categories = [...INITIAL_CATEGORIES];
let users = [...INITIAL_USERS];

export const getProducts = (storeId?: string) => storeId ? products.filter(p => p.storeId === storeId) : products;
export const getProductById = (id: string) => products.find(p => p.id === id);
export const addProduct = (product: Product) => { products.push(product); };
export const updateProduct = (product: Product) => { 
  products = products.map(p => p.id === product.id ? product : p); 
};
export const deleteProduct = (id: string) => { products = products.filter(p => p.id !== id); };

export const getOrders = (storeId?: string) => storeId ? orders.filter(o => o.storeId === storeId) : orders;
export const getOrderById = (id: string) => orders.find(o => o.id === id);
export const addOrder = (order: Order) => { orders.unshift(order); };

export const getUsers = () => users;
export const addUser = (user: User) => { users.push(user); };
export const deleteUser = (id: string) => { users = users.filter(u => u.id !== id); };

export const getStats = (storeId?: string) => {
  const storeOrders = getOrders(storeId);
  const storeProducts = getProducts(storeId);
  
  return {
    totalRevenue: storeOrders.reduce((acc, o) => acc + o.total, 0),
    totalOrders: storeOrders.length,
    activeProducts: storeProducts.length
  };
};
