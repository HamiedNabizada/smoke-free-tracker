/**
 * Notifications Module
 * Handles push notifications permission, settings, and scheduling
 */

import { db } from '../firebase-config.js';

// Notification state
let notificationSettings = {
    enabled: false,
    milestones: false,
    dailyMotivation: false
};

/**
 * Initialize notification settings
 */
export async function initializeNotifications() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    // Load settings from Firestore
    await loadNotificationSettings();

    // Setup event listeners
    setupNotificationToggles();

    // Check if notifications are already granted
    if (Notification.permission === 'granted') {
        document.getElementById('notificationsEnabled').checked = notificationSettings.enabled;
        enableNotificationOptions(notificationSettings.enabled);
    }
}

/**
 * Load notification settings from Firestore
 */
async function loadNotificationSettings() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        const docRef = db.collection('users').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists) {
            const userData = doc.data();
            notificationSettings = {
                enabled: userData.notifications_enabled || false,
                milestones: userData.milestones_enabled || false,
                dailyMotivation: userData.daily_motivation_enabled || false
            };

            // Update UI
            document.getElementById('notificationsEnabled').checked = notificationSettings.enabled;
            document.getElementById('milestonesEnabled').checked = notificationSettings.milestones;
            document.getElementById('dailyMotivationEnabled').checked = notificationSettings.dailyMotivation;

            if (notificationSettings.enabled && Notification.permission === 'granted') {
                enableNotificationOptions(true);
            }
        }
    } catch (error) {
        console.error('[Notifications] Error loading settings:', error);
    }
}

/**
 * Save notification settings to Firestore
 */
async function saveNotificationSettings() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        await db.collection('users').doc(user.uid).update({
            notifications_enabled: notificationSettings.enabled,
            milestones_enabled: notificationSettings.milestones,
            daily_motivation_enabled: notificationSettings.dailyMotivation
        });

        console.log('[Notifications] Settings saved');
    } catch (error) {
        console.error('[Notifications] Error saving settings:', error);
    }
}

/**
 * Setup event listeners for notification toggles
 */
function setupNotificationToggles() {
    const enabledToggle = document.getElementById('notificationsEnabled');
    const milestonesToggle = document.getElementById('milestonesEnabled');
    const dailyToggle = document.getElementById('dailyMotivationEnabled');

    // Main toggle - request permission
    enabledToggle.addEventListener('change', async (e) => {
        if (e.target.checked) {
            const granted = await requestNotificationPermission();
            if (granted) {
                notificationSettings.enabled = true;
                enableNotificationOptions(true);
                await saveNotificationSettings();

                // Schedule notifications
                scheduleNotifications();
            } else {
                e.target.checked = false;
                notificationSettings.enabled = false;
            }
        } else {
            notificationSettings.enabled = false;
            enableNotificationOptions(false);
            await saveNotificationSettings();

            // Cancel scheduled notifications
            cancelScheduledNotifications();
        }
    });

    // Milestone toggle
    milestonesToggle.addEventListener('change', async (e) => {
        notificationSettings.milestones = e.target.checked;
        await saveNotificationSettings();
        if (e.target.checked) {
            scheduleMilestoneNotifications();
        }
    });

    // Daily motivation toggle
    dailyToggle.addEventListener('change', async (e) => {
        notificationSettings.dailyMotivation = e.target.checked;
        await saveNotificationSettings();
        if (e.target.checked) {
            scheduleDailyMotivation();
        } else {
            cancelDailyMotivation();
        }
    });
}

/**
 * Request notification permission from user
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('Dein Browser unterstützt keine Push-Benachrichtigungen.');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        alert('Du hast Benachrichtigungen blockiert. Bitte aktiviere sie in deinen Browser-Einstellungen.');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * Enable/disable notification option checkboxes
 */
function enableNotificationOptions(enabled) {
    document.getElementById('milestonesEnabled').disabled = !enabled;
    document.getElementById('dailyMotivationEnabled').disabled = !enabled;

    const milestoneOption = document.getElementById('milestoneNotificationOption');
    const dailyOption = document.getElementById('dailyMotivationOption');

    if (enabled) {
        milestoneOption.classList.remove('disabled');
        dailyOption.classList.remove('disabled');
    } else {
        milestoneOption.classList.add('disabled');
        dailyOption.classList.add('disabled');
    }
}

/**
 * Schedule all active notifications
 */
function scheduleNotifications() {
    if (notificationSettings.milestones) {
        scheduleMilestoneNotifications();
    }
    if (notificationSettings.dailyMotivation) {
        scheduleDailyMotivation();
    }
}

/**
 * Cancel all scheduled notifications
 */
function cancelScheduledNotifications() {
    cancelDailyMotivation();
    // Milestone notifications are checked dynamically, no need to cancel
}

/**
 * Schedule milestone notifications
 * These are checked every time the dashboard updates
 */
function scheduleMilestoneNotifications() {
    console.log('[Notifications] Milestone notifications activated');
    // Milestone checks happen in checkMilestoneNotifications() called from dashboard
}

/**
 * Check if user reached a new milestone and send notification
 */
export async function checkMilestoneNotifications(currentMilestone) {
    if (!notificationSettings.enabled || !notificationSettings.milestones) return;
    if (Notification.permission !== 'granted') return;

    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        // Get last notified milestone
        const docRef = db.collection('users').doc(user.uid);
        const doc = await docRef.get();
        const lastMilestone = doc.data()?.last_milestone_notification || -1;

        // Check if this is a new milestone
        if (currentMilestone && currentMilestone.id > lastMilestone) {
            // Send notification
            new Notification('🎉 Meilenstein erreicht!', {
                body: `${currentMilestone.title}\n${currentMilestone.description}`,
                icon: '/icon.png',
                badge: '/icon.png',
                tag: `milestone-${currentMilestone.id}`,
                requireInteraction: false
            });

            // Update last notified milestone
            await docRef.update({
                last_milestone_notification: currentMilestone.id
            });

            console.log('[Notifications] Milestone notification sent:', currentMilestone.title);
        }
    } catch (error) {
        console.error('[Notifications] Error checking milestone:', error);
    }
}

/**
 * Schedule daily motivation notification (10:00 AM)
 */
function scheduleDailyMotivation() {
    console.log('[Notifications] Daily motivation activated');

    // Check every minute if it's time to send
    const intervalId = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Send at 10:00 AM
        if (hours === 10 && minutes === 0) {
            sendDailyMotivation();
        }
    }, 60000); // Check every minute

    // Store interval ID for cancellation
    window.dailyMotivationInterval = intervalId;

    // Also check immediately if we're past 10 AM today and haven't sent yet
    checkTodaysMotivation();
}

/**
 * Check if we already sent today's motivation
 */
async function checkTodaysMotivation() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        const docRef = db.collection('users').doc(user.uid);
        const doc = await docRef.get();
        const lastSent = doc.data()?.last_daily_motivation;

        const today = new Date().toISOString().split('T')[0];
        const now = new Date();

        // If we haven't sent today and it's past 10 AM, send now
        if ((!lastSent || lastSent !== today) && now.getHours() >= 10) {
            sendDailyMotivation();
        }
    } catch (error) {
        console.error('[Notifications] Error checking daily motivation:', error);
    }
}

/**
 * Send daily motivation notification
 */
async function sendDailyMotivation() {
    if (!notificationSettings.enabled || !notificationSettings.dailyMotivation) return;
    if (Notification.permission !== 'granted') return;

    const user = firebase.auth().currentUser;
    if (!user) return;

    const motivations = [
        'Jeder rauchfreie Tag ist ein Erfolg!',
        'Du bist stärker als dein Verlangen!',
        'Deine Gesundheit dankt es dir!',
        'Bleib dran - es wird jeden Tag leichter!',
        'Du investierst in deine Zukunft!',
        'Stolz auf dich - weiter so!',
        'Deine Lunge regeneriert sich jeden Tag mehr!',
        'Du bist ein Vorbild für andere!',
        'Freiheit statt Abhängigkeit - du schaffst das!'
    ];

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

    new Notification('💪 Tägliche Motivation', {
        body: randomMotivation,
        icon: '/icon.png',
        badge: '/icon.png',
        tag: 'daily-motivation',
        requireInteraction: false
    });

    // Update last sent date
    try {
        const today = new Date().toISOString().split('T')[0];
        await db.collection('users').doc(user.uid).update({
            last_daily_motivation: today
        });
        console.log('[Notifications] Daily motivation sent');
    } catch (error) {
        console.error('[Notifications] Error updating daily motivation date:', error);
    }
}

/**
 * Cancel daily motivation notifications
 */
function cancelDailyMotivation() {
    if (window.dailyMotivationInterval) {
        clearInterval(window.dailyMotivationInterval);
        window.dailyMotivationInterval = null;
        console.log('[Notifications] Daily motivation cancelled');
    }
}

/**
 * Send test notification
 */
export function sendTestNotification() {
    if (Notification.permission !== 'granted') {
        console.warn('[Notifications] Permission not granted');
        return;
    }

    new Notification('🎉 ByeByeSmoke', {
        body: 'Benachrichtigungen funktionieren!',
        icon: '/icon.png',
        badge: '/icon.png',
        tag: 'test-notification'
    });
}
