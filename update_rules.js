const { initializeApp, cert } = require('firebase-admin/app');
const { getSecurityRules } = require('firebase-admin/security-rules');
require('dotenv').config({ path: '.env.local' }); // Assuming Vercel envs or local envs are here

async function updateRules() {
  try {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    });

    const source = `
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            // Allow anyone to read
            allow read: if true;
            // Allow only authenticated users to write
            allow write: if request.auth != null;
          }
        }
      }
    `;

    const securityRules = getSecurityRules(app);
    const ruleset = await securityRules.createRuleset({
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: source
          }
        ]
      }
    });

    await securityRules.releaseFirestoreRuleset(ruleset.name);
    console.log("Successfully updated Firestore rules!");
  } catch (error) {
    console.error("Error updating rules:", error);
  }
}

updateRules();
