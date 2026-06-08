import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _adminDb: Firestore | null = null;

const handler: ProxyHandler<Firestore> = {
  get(target, prop) {
    if (!_adminDb) {
      const apps = getApps();
      const adminApp = apps.length
        ? apps[0]
        : initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
          });
      _adminDb = getFirestore(adminApp);
    }
    const value = Reflect.get(_adminDb, prop);
    if (typeof value === "function") {
      return value.bind(_adminDb);
    }
    return value;
  }
};

export const adminDb = new Proxy({} as Firestore, handler);
