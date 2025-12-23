/**
 * Login Page Script
 */

import { checkRateLimit, recordFailedAttempt, recordSuccessfulAttempt, formatRemainingTime } from './utils/rate-limiter.js';
import { loginUser, auth, signInWithEmailAndPassword } from './firebase-auth.js';

const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const loginBtn = document.getElementById('loginBtn');
const demoBtn = document.getElementById('demoBtn');

// Demo login function
async function loginDemo() {
    const DEMO_EMAIL = 'demo@byebyesmoke.app';
    const DEMO_PASSWORD = 'demo123456';

    try {
        await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
        console.log('[Demo] Demo account logged in');
        return true;
    } catch (error) {
        console.error('[Demo] Login failed:', error);
        if (error.code === 'auth/user-not-found') {
            alert('Demo-Account ist noch nicht eingerichtet. Bitte kontaktiere den Support.');
        } else {
            alert('Fehler beim Demo-Login: ' + error.message);
        }
        return false;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Rate Limiting prüfen
    const rateLimitCheck = checkRateLimit('login');
    if (!rateLimitCheck.allowed) {
        const timeRemaining = formatRemainingTime(rateLimitCheck.remainingMinutes);
        errorMessage.textContent = `Zu viele Login-Versuche. Bitte warte ${timeRemaining}.`;
        errorMessage.style.display = 'block';
        return;
    }

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    errorMessage.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Anmelden...';

    try {
        await loginUser(username, password);
        recordSuccessfulAttempt('login');
        window.location.href = 'index.html';
    } catch (error) {
        recordFailedAttempt('login');

        // Prüfe erneut ob jetzt locked out
        const newCheck = checkRateLimit('login');
        if (!newCheck.allowed) {
            const timeRemaining = formatRemainingTime(newCheck.remainingMinutes);
            errorMessage.textContent = `Zu viele fehlgeschlagene Versuche. Bitte warte ${timeRemaining}.`;
        } else {
            errorMessage.textContent = error.message + ` (${newCheck.remainingAttempts} Versuche übrig)`;
        }

        errorMessage.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Anmelden';
    }
});

// Demo button handler
demoBtn.addEventListener('click', async () => {
    demoBtn.disabled = true;
    demoBtn.textContent = 'Lade Demo...';

    const success = await loginDemo();
    if (success) {
        window.location.href = 'index.html';
    } else {
        demoBtn.disabled = false;
        demoBtn.innerHTML = '<span class="demo-btn-icon">👀</span><span>Erst mal ausprobieren</span>';
    }
});
