import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserRole = 'customer' | 'seller' | 'admin';
export type UserStatus = 'active' | 'pending' | 'suspended';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: any;
  photoURL?: string;
  // customer
  isMember?: boolean;
  memberSince?: any;
  // seller
  businessName?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
}

export const registerCustomer = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  const profile: UserProfile = {
    uid: credential.user.uid,
    email,
    displayName,
    role: 'customer',
    status: 'active',
    createdAt: serverTimestamp(),
    isMember: false,
  };

  await setDoc(doc(db, 'users', credential.user.uid), profile);
  return profile;
};

export const loginUser = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, 'users', credential.user.uid));
  if (!snap.exists()) throw new Error('User profile not found.');
  const profile = snap.data() as UserProfile;
  if (profile.status === 'suspended') throw new Error('Account suspended. Contact support.');
  if (profile.status === 'pending') throw new Error('Account pending approval.');
  return profile;
};

export const logoutUser = () => signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, 'users', uid), data);
};

export const submitSellerInquiry = async (data: {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  description: string;
}) => {
  await addDoc(collection(db, 'sellerInquiries'), {
    ...data,
    status: 'pending',
    submittedAt: serverTimestamp(),
  });
};
