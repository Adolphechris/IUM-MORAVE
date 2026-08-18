import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let db: Firestore;

export function getFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'iumorave';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@iumorave.iam.gserviceaccount.com';
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      adminApp = initializeApp({
        projectId: projectId || 'iumorave',
      });
    }
  } else {
    adminApp = getApps()[0];
  }

  db = getFirestore(adminApp);

  let adminAuth = null;
  try {
    const { getAuth } = require('firebase-admin/auth');
    adminAuth = getAuth(adminApp);
  } catch (e) {
    // Auth subpackage optional fallback
  }

  return { adminApp, adminAuth, db };
}
