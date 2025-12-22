/**
 * Offline Queue Module
 * Stores changes when offline and syncs when back online
 */

const QUEUE_KEY = 'byebyesmoke_offline_queue';
let isOnline = navigator.onLine;
let isSyncing = false;

/**
 * Initialize offline queue
 */
export function initializeOfflineQueue() {
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    isOnline = navigator.onLine;

    // Try to sync any pending items on load
    if (isOnline) {
        setTimeout(syncQueue, 2000); // Delay to ensure Firebase is ready
    }

    console.log('[OfflineQueue] Initialized, online:', isOnline);
}

/**
 * Handle coming online
 */
async function handleOnline() {
    console.log('[OfflineQueue] Back online, syncing queue...');
    isOnline = true;
    showSyncToast('Online - Synchronisiere Änderungen...');
    await syncQueue();
}

/**
 * Handle going offline
 */
function handleOffline() {
    console.log('[OfflineQueue] Gone offline');
    isOnline = false;
    showSyncToast('Offline - Änderungen werden lokal gespeichert');
}

/**
 * Add item to offline queue
 */
export function addToQueue(operation) {
    const queue = getQueue();
    const item = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...operation
    };
    queue.push(item);
    saveQueue(queue);
    console.log('[OfflineQueue] Added item:', item.type);
    return item.id;
}

/**
 * Get current queue
 */
function getQueue() {
    try {
        const data = localStorage.getItem(QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('[OfflineQueue] Error reading queue:', error);
        return [];
    }
}

/**
 * Save queue to localStorage
 */
function saveQueue(queue) {
    try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
        console.error('[OfflineQueue] Error saving queue:', error);
    }
}

/**
 * Remove item from queue
 */
function removeFromQueue(id) {
    const queue = getQueue();
    const filtered = queue.filter(item => item.id !== id);
    saveQueue(filtered);
}

/**
 * Sync all pending items in queue
 */
async function syncQueue() {
    if (isSyncing) {
        console.log('[OfflineQueue] Sync already in progress');
        return;
    }

    const queue = getQueue();
    if (queue.length === 0) {
        console.log('[OfflineQueue] Queue is empty');
        return;
    }

    isSyncing = true;
    console.log('[OfflineQueue] Syncing', queue.length, 'items...');

    let successCount = 0;
    let failCount = 0;

    for (const item of queue) {
        try {
            await processQueueItem(item);
            removeFromQueue(item.id);
            successCount++;
        } catch (error) {
            console.error('[OfflineQueue] Error processing item:', item.id, error);
            failCount++;

            // If item is too old (> 7 days), remove it
            const itemDate = new Date(item.timestamp);
            const daysDiff = (Date.now() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff > 7) {
                removeFromQueue(item.id);
                console.log('[OfflineQueue] Removed old item:', item.id);
            }
        }
    }

    isSyncing = false;

    if (successCount > 0) {
        showSyncToast(`${successCount} Änderungen synchronisiert!`);
    }
    if (failCount > 0) {
        console.warn('[OfflineQueue]', failCount, 'items failed to sync');
    }
}

/**
 * Process a single queue item
 */
async function processQueueItem(item) {
    const user = firebase.auth().currentUser;
    if (!user) {
        throw new Error('Not authenticated');
    }

    const db = firebase.firestore();

    switch (item.type) {
        case 'update_goals':
            await db.collection('users').doc(user.uid).update({
                progress_goals: item.data
            });
            break;

        case 'record_craving':
            // Craving recording logic from firebase-auth.js
            const docRef = db.collection('craving_events').doc(`${user.uid}_${item.data.date}`);
            const doc = await docRef.get();

            if (!doc.exists) {
                await docRef.set({
                    user_id: user.uid,
                    date: item.data.date,
                    day_of_week: item.data.dayOfWeek,
                    count: 1,
                    hours: { [item.data.hour]: 1 },
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                const data = doc.data();
                const hours = data.hours || {};
                hours[item.data.hour] = (hours[item.data.hour] || 0) + 1;
                await docRef.update({
                    count: firebase.firestore.FieldValue.increment(1),
                    hours: hours
                });
            }
            break;

        case 'update_settings':
            await db.collection('users').doc(user.uid).update(item.data);
            break;

        default:
            console.warn('[OfflineQueue] Unknown item type:', item.type);
    }
}

/**
 * Show sync toast notification
 */
function showSyncToast(message) {
    // Check if showToast exists (from firebase-auth.js)
    if (typeof showToast === 'function') {
        showToast(message, 3000);
    } else {
        // Fallback: create our own toast
        const existingToast = document.querySelector('.sync-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'sync-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            animation: fadeIn 0.3s;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

/**
 * Get queue length
 */
export function getQueueLength() {
    return getQueue().length;
}

/**
 * Check if we're online
 */
export function isNetworkOnline() {
    return isOnline;
}

/**
 * Queue a goal update
 */
export function queueGoalUpdate(goals) {
    if (isOnline) {
        return false; // Don't queue, perform directly
    }

    addToQueue({
        type: 'update_goals',
        data: goals
    });
    return true;
}

/**
 * Queue a craving record
 */
export function queueCravingRecord() {
    const now = new Date();
    addToQueue({
        type: 'record_craving',
        data: {
            date: now.toISOString().split('T')[0],
            hour: now.getHours(),
            dayOfWeek: now.getDay()
        }
    });
    return true;
}

/**
 * Queue a settings update
 */
export function queueSettingsUpdate(settings) {
    if (isOnline) {
        return false;
    }

    addToQueue({
        type: 'update_settings',
        data: settings
    });
    return true;
}
