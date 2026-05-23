// ============================================
// TREND OPTİK — Firebase Client SDK (Güvenli Init)
// ============================================
// Tüm key'ler .env.local'den okunur.
// Bu dosya SADECE client-side Firebase SDK'yı başlatır.
// Server-side işlemler app/api/ route'larında yapılır.
// ============================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Next.js build-time protection: use mock credentials if variables are not provided.
const isConfigValid = !!firebaseConfig.apiKey;

const app = !getApps().length 
  ? initializeApp(
      isConfigValid
        ? firebaseConfig
        : {
            apiKey: "mock-api-key-for-build-time-only",
            authDomain: "mock-project.firebaseapp.com",
            projectId: "mock-project",
            storageBucket: "mock-project.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:1234567890",
          }
    ) 
  : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
