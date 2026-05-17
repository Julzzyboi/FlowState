import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Added imports

const firebaseConfig = {
  apiKey: "AIzaSyBPmH8FM_teWvoMHmNaWY1ceBcIVD_DcxE",
  authDomain: "flowstate-app-56167.firebaseapp.com",
  projectId: "flowstate-app-56167",
  storageBucket: "flowstate-app-56167.firebasestorage.app",
  messagingSenderId: "230493859562",
  appId: "1:230493859562:web:8b3ff2f15eb46fe575f193",
  measurementId: "G-8Y244WJ9B9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // Initialize Auth
export const googleProvider = new GoogleAuthProvider(); // Create Google Provider