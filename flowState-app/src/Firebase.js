import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: Import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: Import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: Import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: Import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: Import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: Import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider(); 