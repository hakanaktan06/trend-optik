import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';

export async function GET() {
  try {
    const apps = getApps();
    const app = apps.length
      ? apps[0]
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });

    const source = `
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            // Herkes okuyabilir
            allow read: if true;
            // Sadece giris yapmis (admin) kullanicilar yazabilir
            allow write: if request.auth != null;
          }
        }
      }
    `;

    const securityRules = getSecurityRules(app);
    await securityRules.releaseFirestoreRulesetFromSource(source);

    return NextResponse.json({ success: true, message: "Firestore kuralları başarıyla güncellendi!" });
  } catch (error: any) {
    console.error("Rules update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
