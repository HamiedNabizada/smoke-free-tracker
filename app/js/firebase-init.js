// Firebase Initialization (Modular API)
// This module initializes Firebase with the new persistence API

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy, getDocs, writeBatch, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyA7YFHuP7yxjJMIpE3TnLYiqw9soP8oVG8",
  authDomain: "byebyesmoke.firebaseapp.com",
  projectId: "byebyesmoke",
  storageBucket: "byebyesmoke.firebasestorage.app",
  messagingSenderId: "329976315250",
  appId: "1:329976315250:web:2397ed6edd4914003571eb",
  measurementId: "G-XDMJDXGY8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with persistent cache (new API - no deprecation warning)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

console.log('[Firebase] Initialized successfully');

// Export for ES modules
export {
  app,
  auth,
  db,
  // Auth functions
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  // Firestore functions
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
  runTransaction,
  serverTimestamp
};

// Also expose globally for non-module scripts
window.firebaseAuth = auth;
window.firebaseDb = db;
