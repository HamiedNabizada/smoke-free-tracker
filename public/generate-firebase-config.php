#!/usr/bin/env php
<?php
/**
 * Firebase Config Generator
 * Liest .env und generiert js/firebase-config.js
 * Kann im Webhook automatisch ausgeführt werden
 */

// Pfad zur .env Datei
$envFile = __DIR__ . '/.env';
$outputFile = __DIR__ . '/js/firebase-config.js';

// Prüfe ob .env existiert
if (!file_exists($envFile)) {
    die("ERROR: .env file not found! Copy .env.example to .env and fill in your Firebase credentials.\n");
}

// Lade .env Datei
$envVars = parse_ini_file($envFile);

// Prüfe ob alle benötigten Variablen gesetzt sind
$required = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID'
];

foreach ($required as $var) {
    if (empty($envVars[$var]) || $envVars[$var] === 'your_api_key_here' ||
        strpos($envVars[$var], 'your_') === 0) {
        die("ERROR: $var is not set in .env file!\n");
    }
}

// Generiere firebase-config.js
$configContent = <<<JS
// Firebase Configuration (CDN-basiert)
// Diese Datei wird NACH den Firebase CDN Scripts geladen
// ACHTUNG: Diese Datei wurde automatisch generiert von generate-firebase-config.php
// Änderungen hier werden überschrieben! Editiere stattdessen die .env Datei.

const firebaseConfig = {
  apiKey: "{$envVars['FIREBASE_API_KEY']}",
  authDomain: "{$envVars['FIREBASE_AUTH_DOMAIN']}",
  projectId: "{$envVars['FIREBASE_PROJECT_ID']}",
  storageBucket: "{$envVars['FIREBASE_STORAGE_BUCKET']}",
  messagingSenderId: "{$envVars['FIREBASE_MESSAGING_SENDER_ID']}",
  appId: "{$envVars['FIREBASE_APP_ID']}",
  measurementId: "{$envVars['FIREBASE_MEASUREMENT_ID']}"
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

JS;

// Schreibe Datei
if (file_put_contents($outputFile, $configContent) !== false) {
    echo "✅ firebase-config.js successfully generated!\n";
    echo "   Location: $outputFile\n";
    exit(0);
} else {
    die("ERROR: Could not write to $outputFile\n");
}
