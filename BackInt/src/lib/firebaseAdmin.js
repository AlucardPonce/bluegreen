import admin from 'firebase-admin';

if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    );
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Usa Application Default Credentials (respeta GOOGLE_APPLICATION_CREDENTIALS)
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
  });
}

const db = admin.firestore();

export { admin, db };
