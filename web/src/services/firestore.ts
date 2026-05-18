import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../utils/collections';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  videoUrl?: string;
  category: string;
  sizes: Record<string, number>;
  sellerId: string;
  sellerName: string;
  isLimitedDrop: boolean;
  dropDate?: Timestamp;
  isActive: boolean;
  createdAt?: any;
  tags: string[];
  totalStock?: number;
}

export const getProducts = async (filterCategory?: string): Promise<Product[]> => {
  let q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  if (filterCategory) {
    q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('isActive', '==', true),
      where('category', '==', filterCategory),
      orderBy('createdAt', 'desc')
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getLimitedDrops = async (): Promise<Product[]> => {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('isLimitedDrop', '==', true),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getSellerProducts = async (sellerId: string): Promise<Product[]> => {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, COLLECTIONS.PRODUCTS), { ...product, createdAt: serverTimestamp() });
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), data);
};

export const deleteProduct = async (id: string) => deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));

export interface Order {
  id?: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: { productId: string; name: string; size: string; qty: number; price: number; image: string }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  sellerId: string;
  createdAt?: any;
  updatedAt?: any;
}

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, COLLECTIONS.ORDERS), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

export const getSellerOrders = async (sellerId: string): Promise<Order[]> => {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  await updateDoc(doc(db, COLLECTIONS.ORDERS, id), { status, updatedAt: serverTimestamp() });
};

export interface SubscriptionPlan {
  id?: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  productLimit: number;
  orderCommission: number;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  isActive: boolean;
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const q = query(collection(db, COLLECTIONS.SUBSCRIPTIONS), where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SubscriptionPlan));
};

export const getAllSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const snap = await getDocs(collection(db, COLLECTIONS.SUBSCRIPTIONS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SubscriptionPlan));
};

export const addSubscriptionPlan = async (plan: Omit<SubscriptionPlan, 'id'>) => {
  return addDoc(collection(db, COLLECTIONS.SUBSCRIPTIONS), plan);
};

export const updateSubscriptionPlan = async (id: string, data: Partial<SubscriptionPlan>) => {
  await updateDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, id), data);
};

export interface SellerInquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: any;
  reviewedAt?: any;
  reviewedBy?: string;
}

export const getSellerInquiries = async (): Promise<SellerInquiry[]> => {
  const q = query(collection(db, COLLECTIONS.SELLER_INQUIRIES), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SellerInquiry));
};

export const updateInquiryStatus = async (
  id: string,
  status: SellerInquiry['status'],
  reviewedBy: string
) => {
  await updateDoc(doc(db, COLLECTIONS.SELLER_INQUIRIES, id), {
    status,
    reviewedBy,
    reviewedAt: serverTimestamp(),
  });
};

export interface Review {
  id?: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt?: any;
}

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
};

export const addProductReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<void> => {
  await addDoc(collection(db, 'reviews'), { ...review, createdAt: serverTimestamp() });
};

export const getSellersByIds = async (sellerIds: string[]) => {
  if (sellerIds.length === 0) return [];
  const snap = await getDocs(query(collection(db, COLLECTIONS.USERS), where('role', '==', 'seller')));
  return snap.docs
    .map(d => d.data())
    .filter(u => sellerIds.includes(u.uid));
};

export const getPlatformStats = async () => {
  const [customersSnap, sellersSnap, ordersSnap, productsSnap, inquiriesSnap] = await Promise.all([
    getDocs(query(collection(db, COLLECTIONS.USERS), where('role', '==', 'customer'), limit(1000))),
    getDocs(query(collection(db, COLLECTIONS.USERS), where('role', '==', 'seller'), limit(500))),
    getDocs(query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'), limit(500))),
    getDocs(query(collection(db, COLLECTIONS.PRODUCTS), limit(1000))),
    getDocs(query(collection(db, COLLECTIONS.SELLER_INQUIRIES), where('status', '==', 'pending'))),
  ]);

  const orders = ordersSnap.docs.map(d => d.data() as Order);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return {
    totalUsers: customersSnap.size,
    totalSellers: sellersSnap.size,
    totalProducts: productsSnap.size,
    totalOrders: ordersSnap.size,
    totalRevenue,
    pendingInquiries: inquiriesSnap.size,
  };
};
