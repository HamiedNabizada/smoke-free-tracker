import { calculateStats } from '../utils/calculations.js';

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

    if (cravingButton) {
        cravingButton.addEventListener('click', startCravingTimer);
    }

    if (cravingCloseBtn) {
        cravingCloseBtn.addEventListener('click', closeCravingOverlay);
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeCravingOverlay);
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

    // Hide tip display
    cravingTipDisplay.classList.add('hidden');

    // Calculate stats
    const stats = calculateStats();

    // Increment craving count in Firestore first
    await incrementCravingCount();

    // Get updated count
    const currentCount = await getCurrentCravingCount();

    // Create success message with stats
    successStats.innerHTML = `
        <p><strong>Das war dein ${currentCount}. überwundenes Verlangen heute!</strong></p>
        <p>Du hast bereits <strong>${stats.days} Tage</strong> durchgehalten.</p>
        <p>Gespart: <strong>${stats.money.toFixed(2)}€</strong></p>
        <p>Nicht geraucht: <strong>${stats.cigarettes} Zigaretten</strong></p>
    `;

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

function closeCravingOverlay() {
    const overlay = document.getElementById('cravingOverlay');
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
}

// Helper functions for craving count (stored in Firestore)
async function getCurrentCravingCount() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return 0;

        const today = new Date().toISOString().split('T')[0];
        const docRef = firebase.firestore().collection('craving_events').doc(`${user.uid}_${today}`);
        const doc = await docRef.get();

        if (doc.exists) {
            return doc.data().count || 0;
        }

        return 0;
    } catch (error) {
        console.error('Error getting craving count:', error);
        return 0;
    }
}

async function incrementCravingCount() {
    try {
        await recordCraving();
    } catch (error) {
        console.error('Error incrementing craving count:', error);
    }
}
