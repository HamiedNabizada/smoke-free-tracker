// Firebase Authentication Helper Functions
// Diese Datei muss NACH firebase-config.js geladen werden

// Import demo mode helpers
import { isDemoMode, DEMO_USER_DATA, blockDemoWrite, getDemoCravingEvents } from './demo-mode.js';

// Check if user is authenticated
async function checkAuth() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        // Not logged in - redirect to login page
        if (!window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('register.html')) {
          window.location.href = 'login.html';
        }
        resolve(null);
      } else {
        resolve(user);
      }
    });
  });
}

// Register new user
async function registerUser(username, password, userData) {
  try {
    // Create user with email-like username (Firebase requires email format)
    const email = `${username}@byebyesmoke.app`;
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update display name
    await user.updateProfile({
      displayName: username
    });

    // Save user data to Firestore
    await db.collection('users').doc(user.uid).set({
      username: username,
      quit_date: userData.quit_date,
      cigarettes_per_day: userData.cigarettes_per_day,
      price_per_pack: userData.price_per_pack,
      cigarettes_per_pack: userData.cigarettes_per_pack,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, user: user };
  } catch (error) {
    console.error('Registration error:', error);
    let message = 'Registrierung fehlgeschlagen';

    if (error.code === 'auth/email-already-in-use') {
      message = 'Benutzername bereits vergeben';
    } else if (error.code === 'auth/weak-password') {
      message = 'Passwort zu schwach (mindestens 6 Zeichen)';
    }

    throw new Error(message);
  }
}

// Login user
async function loginUser(username, password) {
  try {
    const email = `${username}@byebyesmoke.app`;
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    let message = 'Login fehlgeschlagen';

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Ungültiger Benutzername oder Passwort';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Ungültiger Benutzername';
    }

    throw new Error(message);
  }
}

// Logout user
async function logoutUser() {
  try {
    await auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout fehlgeschlagen');
  }
}

// Get current user data from Firestore
async function getUserData() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    // Return demo data if in demo mode
    if (isDemoMode()) {
      return DEMO_USER_DATA;
    }

    const doc = await db.collection('users').doc(user.uid).get();

    if (!doc.exists) {
      throw new Error('Benutzerdaten nicht gefunden');
    }

    return doc.data();
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
}

// Update user data in Firestore
async function updateUserData(updates) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    // Block write in demo mode
    if (blockDemoWrite('Daten speichern')) {
      return { success: false };
    }

    await db.collection('users').doc(user.uid).update(updates);
    return { success: true };
  } catch (error) {
    console.error('Update user data error:', error);
    throw error;
  }
}

// Delete user account
async function deleteAccount() {
  // Block delete in demo mode
  if (blockDemoWrite('Account löschen')) {
    return false;
  }

  if (!confirm('Bist du sicher, dass du deinen Account löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!')) {
    return false;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    // Delete user data from Firestore
    await db.collection('users').doc(user.uid).delete();

    // Delete all craving events
    const cravingsSnapshot = await db.collection('craving_events')
      .where('user_id', '==', user.uid)
      .get();

    const batch = db.batch();
    cravingsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete Firebase Auth user
    await user.delete();

    alert('Account erfolgreich gelöscht');
    window.location.href = 'login.html';
    return true;
  } catch (error) {
    console.error('Delete account error:', error);

    if (error.code === 'auth/requires-recent-login') {
      alert('Bitte melde dich erneut an, um deinen Account zu löschen.');
      await logoutUser();
    } else {
      alert('Fehler beim Löschen des Accounts: ' + error.message);
    }
    return false;
  }
}

// Record craving event
async function recordCraving() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    // Block write in demo mode (silently - craving timer still works)
    if (isDemoMode()) {
      console.log('[Demo] Craving event not recorded (demo mode)');
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    const docRef = db.collection('craving_events').doc(`${user.uid}_${today}`);

    // Use Firestore transaction to increment count
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        transaction.set(docRef, {
          user_id: user.uid,
          date: today,
          count: 1,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        return 1;
      } else {
        const newCount = (doc.data().count || 0) + 1;
        transaction.update(docRef, { count: newCount });
        return newCount;
      }
    });

    return true;
  } catch (error) {
    console.error('Record craving error:', error);
    throw error;
  }
}

// Get craving count for today
async function getCravingCount() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { count: 0, date: new Date().toISOString().split('T')[0] };
    }

    const today = new Date().toISOString().split('T')[0];

    // Return demo data in demo mode
    if (isDemoMode()) {
      const demoEvents = getDemoCravingEvents();
      const todayEvent = demoEvents.find(e => e.date === today);
      return {
        count: todayEvent ? todayEvent.count : 3,
        date: today
      };
    }

    const docRef = db.collection('craving_events').doc(`${user.uid}_${today}`);
    const doc = await docRef.get();

    if (!doc.exists) {
      return { count: 0, date: today };
    }

    return {
      count: doc.data().count || 0,
      date: today
    };
  } catch (error) {
    console.error('Get craving count error:', error);
    return { count: 0, date: new Date().toISOString().split('T')[0] };
  }
}

// Get current username
function getCurrentUsername() {
  const user = auth.currentUser;
  return user ? user.displayName : null;
}

// Get current user ID
function getCurrentUserId() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}
