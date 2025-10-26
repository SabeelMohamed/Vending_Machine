const admin = require('firebase-admin');
require('dotenv').config(); // Ensure environment variables are loaded

// Initialize Firebase Admin SDK
let firebaseApp;
let db = null;

try {
  // Try to initialize with service account key file
  const serviceAccount = require('./serviceAccountKey.json');
  
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  
  if (!databaseURL) {
    console.error('FIREBASE_DATABASE_URL is not set in .env file');
    throw new Error('FIREBASE_DATABASE_URL is required');
  }
  
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
  });
  
  db = admin.database();
  console.log('Firebase initialized successfully');
  
} catch (error) {
  console.log('Service account key file not found, trying environment variable...');
  
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;
    
    if (!databaseURL) {
      console.error('FIREBASE_DATABASE_URL is not set in .env file');
      throw new Error('FIREBASE_DATABASE_URL is required');
    }
    
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: databaseURL
      });
      
      db = admin.database();
      console.log('Firebase initialized successfully with environment variable');
    } else {
      console.error('Firebase credentials not configured. Please set up Firebase service account key.');
    }
  } catch (envError) {
    console.error('Failed to initialize Firebase:', envError.message);
  }
}

module.exports = { admin, db };
