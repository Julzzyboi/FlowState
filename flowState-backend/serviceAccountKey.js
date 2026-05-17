
require('dotenv').config(); // Loads the variables from your .env file
const admin = require('firebase-admin');

try {
  // 1. Read the raw flattened string from the environment matrix
  const secretJsonString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!secretJsonString) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable.");
  }

  // 2. Parse the text back into a real JavaScript configuration object
  const serviceAccount = JSON.parse(secretJsonString);

  // 3. Initialize the super-user Firebase instance
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("🚀 Firebase Admin SDK initialized seamlessly out of .env configuration!");

} catch (error) {
  console.error("❌ Firebase Admin Initialization Failed:", error.message);
  process.exit(1); // Shuts down backend server if credentials fail
}

// 4. Export the admin database handle for use across your API router endpoints
const adminDb = admin.firestore();
module.exports = { adminDb, admin };