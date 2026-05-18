import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCsJWX5JkytdS_0mli1U4HilIu4HSvu0ug',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tom-peters-64157.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tom-peters-64157',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tom-peters-64157.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '276822857428',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:276822857428:web:72c34a769855e2b7c68d41',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
