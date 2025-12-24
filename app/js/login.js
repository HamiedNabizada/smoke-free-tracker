/**
 * Login Page Script
 */

import { checkRateLimit, recordFailedAttempt, recordSuccessfulAttempt, formatRemainingTime } from './utils/rate-limiter.js';
import { loginUser, auth, signInWithEmailAndPassword } from './firebase-auth.js';
import { t, isInitialized } from './i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

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
            alert(tr('login.demoNotSetup', 'Demo-Account ist noch nicht eingerichtet. Bitte kontaktiere den Support.'));
        } else {
            alert(tr('login.demoError', 'Fehler beim Demo-Login: {message}', { message: error.message }));
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
        errorMessage.textContent = tr('login.tooManyAttempts', 'Zu viele Login-Versuche. Bitte warte {time}.', { time: timeRemaining });
        errorMessage.style.display = 'block';
        return;
    }

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    errorMessage.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.textContent = tr('login.loggingIn', 'Anmelden...');

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
            errorMessage.textContent = tr('login.tooManyFailed', 'Zu viele fehlgeschlagene Versuche. Bitte warte {time}.', { time: timeRemaining });
        } else {
            errorMessage.textContent = error.message + ` (${tr('login.attemptsRemaining', '{count} Versuche übrig', { count: newCheck.remainingAttempts })})`;
        }

        errorMessage.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = tr('login.button', 'Anmelden');
    }
});

// Demo button handler
demoBtn.addEventListener('click', async () => {
    demoBtn.disabled = true;
    demoBtn.textContent = tr('login.loadingDemo', 'Lade Demo...');

    const success = await loginDemo();
    if (success) {
        window.location.href = 'index.html';
    } else {
        demoBtn.disabled = false;
        demoBtn.innerHTML = `<span class="demo-btn-icon">👀</span><span>${tr('login.tryDemo', 'Erst mal ausprobieren')}</span>`;
    }
});
