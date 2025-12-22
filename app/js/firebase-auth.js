// Firebase Authentication Helper Functions
// Diese Datei muss NACH firebase-config.js geladen werden

// ============================================
// Simple in-memory cache to reduce Firebase reads
// ============================================
const _cache = new Map();
const CACHE_TTL = {
    USER_DATA: 10 * 60 * 1000,      // 10 min
    CRAVING_TODAY: 30 * 1000,       // 30 sec
    CRAVING_HISTORY: 2 * 60 * 1000  // 2 min
};

function getCached(key) {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
        _cache.delete(key);
        return null;
    }
    return entry.value;
}

function setCache(key, value, ttl) {
    _cache.set(key, { value, expiry: Date.now() + ttl });
}

function invalidateCache(key) {
    _cache.delete(key);
}

function clearUserCache() {
    _cache.clear();
}

// ============================================
// Write rate limiting to reduce Firebase costs
// ============================================
const WRITE_LIMITS = {
    settings: 5,      // Max 5 settings changes per day
    goals: 5,         // Max 5 goal changes per day
    craving: 30,      // Max 30 cravings per day
    notifications: 5  // Max 5 notification toggles per day
};

function getWriteCountKey(type) {
    const today = new Date().toISOString().split('T')[0];
    return `write_count_${type}_${today}`;
}

function getWriteCount(type) {
    try {
        const key = getWriteCountKey(type);
        const stored = localStorage.getItem(key);
        return stored ? parseInt(stored, 10) : 0;
    } catch (e) {
        return 0;
    }
}

function incrementWriteCount(type) {
    try {
        const key = getWriteCountKey(type);
        const current = getWriteCount(type);
        localStorage.setItem(key, (current + 1).toString());
    } catch (e) {
        // Ignore localStorage errors
    }
}

function checkWriteLimit(type, useToast = false) {
    const current = getWriteCount(type);
    const limit = WRITE_LIMITS[type] || 10;

    // Limit reached
    if (current >= limit) {
        if (useToast) {
            showToast(`Tageslimit erreicht (${limit}x). Versuche es morgen wieder.`, 5000, 'warning');
        } else {
            alert(`Du hast das Tageslimit für diese Aktion erreicht (${limit}x pro Tag).\n\nVersuche es morgen wieder.`);
        }
        return false;
    }

    // Warning at second-to-last attempt
    if (current === limit - 1) {
        if (useToast) {
            showToast('Letzte Änderung für heute - App bleibt so kostenlos!', 4000, 'info');
        } else {
            alert(`Hinweis: Das ist deine letzte Änderung für heute.\n\nUm die App kostenlos zu halten, ist die Anzahl der Speichervorgänge pro Tag begrenzt (${limit}x).`);
        }
    }

    return true;
}

// Track if craving limit toast was shown this session
let _cravingLimitToastShown = false;

// Toast notification types and colors
const TOAST_TYPES = {
    info: { bg: 'rgba(0, 0, 0, 0.85)', icon: 'ℹ️' },
    success: { bg: 'rgba(34, 139, 34, 0.9)', icon: '✓' },
    warning: { bg: 'rgba(255, 165, 0, 0.9)', icon: '⚠️' },
    error: { bg: 'rgba(220, 53, 69, 0.9)', icon: '✕' }
};

// Toast notification for non-blocking messages
function showToast(message, duration = 4000, type = 'info') {
    // Remove existing toast if any
    const existing = document.getElementById('appToast');
    if (existing) existing.remove();

    const config = TOAST_TYPES[type] || TOAST_TYPES.info;

    const toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${config.bg};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        max-width: 90%;
        text-align: center;
        animation: fadeIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    toast.innerHTML = `<span style="font-size: 16px;">${config.icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Show error toast with retry option for network errors
function showErrorToast(message, isNetworkError = false) {
    if (isNetworkError && !navigator.onLine) {
        showToast('Keine Internetverbindung', 5000, 'warning');
    } else {
        showToast(message, 4000, 'error');
    }
}

// Network error detection
function isNetworkError(error) {
    return error.code === 'unavailable' ||
           error.message?.includes('network') ||
           error.message?.includes('Failed to fetch') ||
           !navigator.onLine;
}

// Offline indicator
let offlineIndicator = null;

function updateOnlineStatus() {
    if (!navigator.onLine) {
        if (!offlineIndicator) {
            offlineIndicator = document.createElement('div');
            offlineIndicator.id = 'offlineIndicator';
            offlineIndicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ff6b6b;
                color: white;
                text-align: center;
                padding: 8px;
                font-size: 13px;
                z-index: 10001;
            `;
            offlineIndicator.textContent = 'Offline - Änderungen werden nicht gespeichert';
            document.body.prepend(offlineIndicator);
        }
    } else {
        if (offlineIndicator) {
            offlineIndicator.remove();
            offlineIndicator = null;
            showToast('Wieder online', 2000, 'success');
        }
    }
}

// Listen for online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
// Check initial state
document.addEventListener('DOMContentLoaded', updateOnlineStatus);

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled error:', event.reason);
    if (isNetworkError(event.reason)) {
        showErrorToast('Verbindungsproblem', true);
    }
});

// ============================================
// Demo mode helpers (inline to avoid module issues)
// ============================================
const DEMO_EMAIL = 'demo@byebyesmoke.app';

function isDemoMode() {
  const user = auth.currentUser;
  if (!user) return false;
  return user.email === DEMO_EMAIL;
}

function blockDemoWrite(operation = 'Diese Aktion') {
  if (isDemoMode()) {
    alert(`${operation} ist im Test-Modus nicht möglich.\n\nRegistriere dich kostenlos, um alle Funktionen zu nutzen!`);
    return true;
  }
  return false;
}

function getDemoQuitDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

const DEMO_USER_DATA = {
  quit_date: getDemoQuitDate(),
  cigarettes_per_day: 15,
  price_per_pack: 8,
  cigarettes_per_pack: 20,
  notifications_enabled: false,
  milestones_enabled: false,
  daily_motivation_enabled: false
};

function getDemoCravingEvents() {
  function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  return [
    { date: getDateDaysAgo(1), count: 3 },
    { date: getDateDaysAgo(2), count: 5 },
    { date: getDateDaysAgo(3), count: 2 },
    { date: getDateDaysAgo(5), count: 4 },
    { date: getDateDaysAgo(7), count: 6 },
    { date: getDateDaysAgo(10), count: 3 },
    { date: getDateDaysAgo(14), count: 2 },
    { date: getDateDaysAgo(21), count: 1 }
  ];
}

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
    // Clear cache on logout
    clearUserCache();
    await auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout fehlgeschlagen');
  }
}

// Get current user data from Firestore (with caching)
async function getUserData(forceRefresh = false) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    // Return demo data if in demo mode
    if (isDemoMode()) {
      return DEMO_USER_DATA;
    }

    // Check cache first
    const cacheKey = 'user_data_' + user.uid;
    if (!forceRefresh) {
      const cached = getCached(cacheKey);
      if (cached) {
        console.log('[Cache] User data from cache');
        return cached;
      }
    }

    const doc = await db.collection('users').doc(user.uid).get();

    if (!doc.exists) {
      throw new Error('Benutzerdaten nicht gefunden');
    }

    const data = doc.data();
    setCache(cacheKey, data, CACHE_TTL.USER_DATA);
    console.log('[Firebase] User data loaded');
    return data;
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
}

// Update user data in Firestore (with rate limiting)
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

    // Check write limit
    if (!checkWriteLimit('settings')) {
      return { success: false };
    }

    await db.collection('users').doc(user.uid).update(updates);

    // Track write
    incrementWriteCount('settings');

    // Invalidate cache after update
    invalidateCache('user_data_' + user.uid);

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

// Record craving event (with rate limiting)
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

    // Check write limit (show toast once, timer still works)
    if (getWriteCount('craving') >= WRITE_LIMITS.craving) {
      console.log('[RateLimit] Craving limit reached, not recording');
      if (!_cravingLimitToastShown) {
        showToast('Tageslimit erreicht - Timer funktioniert, wird aber nicht mehr gezählt', 5000);
        _cravingLimitToastShown = true;
      }
      return true;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const docRef = db.collection('craving_events').doc(`${user.uid}_${today}`);

    // Use Firestore transaction to increment count
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        // Initialize hours object with current hour having count 1
        const hours = {};
        hours[currentHour] = 1;

        transaction.set(docRef, {
          user_id: user.uid,
          date: today,
          day_of_week: dayOfWeek,
          count: 1,
          hours: hours,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        return 1;
      } else {
        const data = doc.data();
        const newCount = (data.count || 0) + 1;
        const hours = data.hours || {};
        hours[currentHour] = (hours[currentHour] || 0) + 1;

        transaction.update(docRef, {
          count: newCount,
          hours: hours,
          day_of_week: dayOfWeek // Update in case it wasn't set before
        });
        return newCount;
      }
    });

    // Track write
    incrementWriteCount('craving');

    // Invalidate craving cache after recording
    invalidateCache('craving_today_' + user.uid);
    invalidateCache('craving_history_' + user.uid);

    return true;
  } catch (error) {
    console.error('Record craving error:', error);
    throw error;
  }
}

// Get craving count for today (with caching)
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

    // Check cache first
    const cacheKey = 'craving_today_' + user.uid;
    const cached = getCached(cacheKey);
    if (cached && cached.date === today) {
      console.log('[Cache] Craving count from cache');
      return cached;
    }

    const docRef = db.collection('craving_events').doc(`${user.uid}_${today}`);
    const doc = await docRef.get();

    let result;
    if (!doc.exists) {
      result = { count: 0, date: today };
    } else {
      result = { count: doc.data().count || 0, date: today };
    }

    setCache(cacheKey, result, CACHE_TTL.CRAVING_TODAY);
    console.log('[Firebase] Craving count loaded');
    return result;
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

// Get craving heatmap data (last 30 days)
async function getCravingHeatmapData() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { heatmap: createEmptyHeatmap(), totalCravings: 0 };
    }

    // Check cache
    const cacheKey = 'craving_heatmap_' + user.uid;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log('[Cache] Craving heatmap from cache');
      return cached;
    }

    // Demo mode data
    if (isDemoMode()) {
      const demoData = generateDemoHeatmapData();
      return demoData;
    }

    // Get last 30 days of craving events
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const snapshot = await db.collection('craving_events')
      .where('user_id', '==', user.uid)
      .where('date', '>=', startDate)
      .get();

    // Create heatmap: 7 days x 24 hours
    const heatmap = createEmptyHeatmap();
    let totalCravings = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const dayOfWeek = data.day_of_week !== undefined ? data.day_of_week : new Date(data.date).getDay();
      const hours = data.hours || {};

      Object.keys(hours).forEach(hour => {
        const hourNum = parseInt(hour);
        heatmap[dayOfWeek][hourNum] += hours[hour];
        totalCravings += hours[hour];
      });

      // For old data without hours, distribute the count across typical waking hours
      if (!data.hours && data.count) {
        const typicalHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        const countPerHour = Math.ceil(data.count / typicalHours.length);
        typicalHours.forEach(h => {
          heatmap[dayOfWeek][h] += countPerHour;
        });
        totalCravings += data.count;
      }
    });

    const result = { heatmap, totalCravings };
    setCache(cacheKey, result, CACHE_TTL.CRAVING_TODAY);
    console.log('[Firebase] Craving heatmap loaded');
    return result;
  } catch (error) {
    console.error('Get craving heatmap error:', error);
    return { heatmap: createEmptyHeatmap(), totalCravings: 0 };
  }
}

// Create empty heatmap structure (7 days x 24 hours)
function createEmptyHeatmap() {
  const heatmap = [];
  for (let day = 0; day < 7; day++) {
    heatmap[day] = [];
    for (let hour = 0; hour < 24; hour++) {
      heatmap[day][hour] = 0;
    }
  }
  return heatmap;
}

// Generate demo heatmap data
function generateDemoHeatmapData() {
  const heatmap = createEmptyHeatmap();
  let totalCravings = 0;

  // Simulate realistic craving patterns:
  // - More cravings in the morning (after waking), after meals, and evening
  // - Fewer on weekends
  const patterns = {
    weekday: { 7: 2, 8: 3, 9: 2, 12: 3, 13: 2, 17: 2, 18: 3, 19: 2, 20: 2, 21: 1 },
    weekend: { 9: 1, 10: 2, 12: 2, 14: 1, 18: 2, 20: 2, 21: 1 }
  };

  for (let day = 0; day < 7; day++) {
    const isWeekend = day === 0 || day === 6;
    const pattern = isWeekend ? patterns.weekend : patterns.weekday;

    Object.keys(pattern).forEach(hour => {
      const count = pattern[hour];
      heatmap[day][parseInt(hour)] = count;
      totalCravings += count;
    });
  }

  return { heatmap, totalCravings };
}
