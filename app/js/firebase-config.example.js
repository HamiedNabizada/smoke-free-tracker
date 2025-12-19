// Firebase Configuration (CDN-basiert)
// Diese Datei wird NACH den Firebase CDN Scripts geladen
// WICHTIG: Kopiere diese Datei zu 'firebase-config.js' und füge deine echten Firebase Credentials ein!

const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJECT.firebaseapp.com",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_PROJECT.firebasestorage.app",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID",
  measurementId: "DEINE_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Firestore settings (optional - für bessere Performance)
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Offline persistence not available (multiple tabs open)');
    } else if (err.code === 'unimplemented') {
      console.warn('Offline persistence not available (browser not supported)');
    }
  });

console.log('Firebase initialized successfully');
