import { calculateStats } from '../utils/calculations.js';
import { updateCompactCravingStats } from './craving-stats.js';

// Craving tips that rotate during the timer
const cravingTips = [
    { icon: '🫁', text: 'Atme tief ein und langsam aus. Zähle dabei bis 4.' },
    { icon: '💪', text: 'Du bist stärker als jedes Verlangen. Du schaffst das!' },
    { icon: '⏱️', text: 'Nur noch ein paar Minuten. Das Verlangen wird schwächer!' },
    { icon: '🌊', text: 'Lass das Verlangen wie eine Welle über dich hinwegziehen.' },
    { icon: '🎯', text: 'Denk an dein Ziel: Ein gesünderes, freies Leben!' },
    { icon: '💧', text: 'Trink ein großes Glas Wasser - das hilft sofort.' },
    { icon: '🚶', text: 'Bewege dich! Geh ein paar Schritte oder strecke dich.' },
    { icon: '🧘', text: 'Konzentriere dich auf deinen Atem. Ein... Aus... Ein... Aus...' },
    { icon: '💚', text: 'Dein Körper heilt sich gerade. Jede Sekunde zählt!' },
    { icon: '🏆', text: 'Du hast schon so viel geschafft. Gib jetzt nicht auf!' },
    { icon: '⭐', text: 'Jedes überwundene Verlangen macht dich stärker!' },
    { icon: '🌟', text: 'Du bist ein Vorbild für andere. Bleib stark!' }
];

let timerInterval = null;
let breathingInterval = null;
let secondsRemaining = 300; // 5 minutes

export function initializeCravingTimer() {
    const cravingButton = document.getElementById('cravingButton');
    const cravingCloseBtn = document.getElementById('cravingCloseBtn');
    const successCloseBtn = document.getElementById('successCloseBtn');
    const overlay = document.getElementById('cravingOverlay');

    if (cravingButton) {
        cravingButton.addEventListener('click', startCravingTimer);
    }

    if (cravingCloseBtn) {
        cravingCloseBtn.addEventListener('click', closeCravingOverlay);
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeCravingOverlay);
    }

    // Close overlay when clicking outside the content
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCravingOverlay();
            }
        });
    }
}

function startCravingTimer() {
    const overlay = document.getElementById('cravingOverlay');
    const timerDisplay = document.getElementById('timerDisplay');
    const cravingSuccess = document.getElementById('cravingSuccess');
    const cravingTipDisplay = document.getElementById('cravingTipDisplay');

    // Reset state
    secondsRemaining = 300;
    cravingSuccess.classList.add('hidden');
    cravingTipDisplay.classList.remove('hidden');

    // Show overlay
    overlay.classList.remove('hidden');

    // Show random tip immediately
    showRandomTip();

    // Start breathing text animation
    startBreathingAnimation();

    // Start countdown
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        secondsRemaining--;

        // Update timer display
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Change tip every 30 seconds
        if (secondsRemaining % 30 === 0 && secondsRemaining > 0) {
            showRandomTip();
        }

        // Timer finished
        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            showSuccessMessage();
        }
    }, 1000);
}

function showRandomTip() {
    const randomTip = cravingTips[Math.floor(Math.random() * cravingTips.length)];
    const iconElement = document.querySelector('.tip-icon-large');
    const textElement = document.getElementById('cravingTipText');

    if (iconElement && textElement) {
        // Fade out
        iconElement.style.opacity = '0';
        textElement.style.opacity = '0';

        setTimeout(() => {
            iconElement.textContent = randomTip.icon;
            textElement.textContent = randomTip.text;

            // Fade in
            iconElement.style.opacity = '1';
            textElement.style.opacity = '1';
        }, 300);
    }
}

async function showSuccessMessage() {
    const cravingTipDisplay = document.getElementById('cravingTipDisplay');
    const cravingSuccess = document.getElementById('cravingSuccess');
    const successStats = document.getElementById('successStats');
    const countCheckbox = document.getElementById('countCravingCheckbox');

    // Hide tip display
    cravingTipDisplay.classList.add('hidden');

    // Calculate stats
    const stats = calculateStats();

    // Check if user wants to count this craving
    const shouldCount = countCheckbox && countCheckbox.checked;

    let currentCount = 0;

    if (shouldCount) {
        // Increment craving count in Firestore
        await incrementCravingCount();
        // Get updated count
        currentCount = await getCurrentCravingCount();
        // Update compact craving stats in background
        updateCompactCravingStats();
    }

    // Calculate how long they held on (5 minutes - secondsRemaining)
    const secondsHeld = 300 - secondsRemaining;
    const minutesHeld = Math.floor(secondsHeld / 60);
    const secondsRemainder = secondsHeld % 60;
    const timeHeldText = minutesHeld > 0
        ? `${minutesHeld} Minute${minutesHeld > 1 ? 'n' : ''}${secondsRemainder > 0 ? ` und ${secondsRemainder} Sekunden` : ''}`
        : `${secondsHeld} Sekunden`;

    // Create success message with stats
    if (shouldCount) {
        successStats.innerHTML = `
            <p><strong>Das war dein ${currentCount}. überwundenes Verlangen heute!</strong></p>
            <p>Du hast <strong>${timeHeldText}</strong> durchgehalten.</p>
            <p>Gesamt rauchfrei: <strong>${stats.days} Tage</strong></p>
            <p>Gespart: <strong>${stats.money.toFixed(2)}€</strong></p>
        `;
    } else {
        successStats.innerHTML = `
            <p>Du hast <strong>${timeHeldText}</strong> durchgehalten.</p>
            <p>Nicht als Verlangen gezählt (war nur ein Test).</p>
            <p>Gesamt rauchfrei: <strong>${stats.days} Tage</strong></p>
            <p>Gespart: <strong>${stats.money.toFixed(2)}€</strong></p>
        `;
    }

    // Show success message
    cravingSuccess.classList.remove('hidden');
}

function startBreathingAnimation() {
    const breathingText = document.getElementById('breathingText');

    if (!breathingText) return;

    // Clear existing interval
    if (breathingInterval) clearInterval(breathingInterval);

    // Set initial text
    breathingText.textContent = 'Einatmen';

    // Change text every 4 seconds (4s inhale, 4s exhale)
    breathingInterval = setInterval(() => {
        if (breathingText.textContent === 'Einatmen') {
            breathingText.textContent = 'Ausatmen';
        } else {
            breathingText.textContent = 'Einatmen';
        }
    }, 4000);
}

async function closeCravingOverlay() {
    const overlay = document.getElementById('cravingOverlay');
    const countCheckbox = document.getElementById('countCravingCheckbox');
    const cravingSuccess = document.getElementById('cravingSuccess');

    // Check if we should count this
    const timeSpent = 300 - secondsRemaining;
    const isSuccessScreenVisible = !cravingSuccess.classList.contains('hidden');

    // Only count if checkbox is checked, some time was spent (at least 10 seconds), and NOT already counted (success screen not visible)
    if (countCheckbox && countCheckbox.checked && timeSpent >= 10 && !isSuccessScreenVisible) {
        await incrementCravingCount();
        // Update compact craving stats in background
        updateCompactCravingStats();
    }

    // Hide overlay
    overlay.classList.add('hidden');

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }

    secondsRemaining = 300;

    // Reset success screen
    cravingSuccess.classList.add('hidden');
    const cravingTipDisplay = document.getElementById('cravingTipDisplay');
    if (cravingTipDisplay) {
        cravingTipDisplay.classList.remove('hidden');
    }

    // Reset checkbox to checked for next time
    if (countCheckbox) {
        countCheckbox.checked = true;
    }
}

// Helper functions for craving count (stored in Firestore, with caching)
async function getCurrentCravingCount() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return 0;

        const today = new Date().toISOString().split('T')[0];

        // Demo mode: return demo count
        if (typeof isDemoMode === 'function' && isDemoMode()) {
            if (typeof getDemoCravingEvents === 'function') {
                const demoEvents = getDemoCravingEvents();
                const todayEvent = demoEvents.find(e => e.date === today);
                return todayEvent ? todayEvent.count : 3;
            }
            return 3;
        }

        // Check cache first
        const cacheKey = 'craving_today_' + user.uid;
        if (typeof getCached === 'function') {
            const cached = getCached(cacheKey);
            if (cached && cached.date === today) {
                return cached.count;
            }
        }

        const docRef = firebase.firestore().collection('craving_events').doc(`${user.uid}_${today}`);
        const doc = await docRef.get();

        let count = 0;
        if (doc.exists) {
            count = doc.data().count || 0;
        }

        // Cache result (30 sec TTL)
        if (typeof setCache === 'function') {
            setCache(cacheKey, { count, date: today }, 30 * 1000);
        }

        return count;
    } catch (error) {
        console.error('Error getting craving count:', error);
        return 0;
    }
}

async function incrementCravingCount() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            throw new Error('Nicht angemeldet');
        }

        // Skip write in demo mode (silently - timer still works)
        if (typeof isDemoMode === 'function' && isDemoMode()) {
            console.log('[Demo] Craving count not incremented (demo mode)');
            return true;
        }

        // Check write limit (silently - timer still works)
        if (typeof getWriteCount === 'function' && typeof WRITE_LIMITS !== 'undefined') {
            if (getWriteCount('craving') >= WRITE_LIMITS.craving) {
                console.log('[RateLimit] Craving limit reached, not recording');
                return true;
            }
        }

        const today = new Date().toISOString().split('T')[0];
        const docRef = firebase.firestore().collection('craving_events').doc(`${user.uid}_${today}`);

        // Use Firestore transaction to increment count
        await firebase.firestore().runTransaction(async (transaction) => {
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

        // Track write
        if (typeof incrementWriteCount === 'function') {
            incrementWriteCount('craving');
        }

        // Invalidate cache after write
        if (typeof invalidateCache === 'function') {
            invalidateCache('craving_today_' + user.uid);
            invalidateCache('craving_history_' + user.uid + '_7');
            invalidateCache('craving_history_' + user.uid + '_30');
        }

        return true;
    } catch (error) {
        console.error('Error incrementing craving count:', error);
        throw error;
    }
}
