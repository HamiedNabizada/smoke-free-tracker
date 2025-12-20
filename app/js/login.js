/**
 * Login Page Script
 */

import { checkRateLimit, recordFailedAttempt, recordSuccessfulAttempt, formatRemainingTime } from './utils/rate-limiter.js';

const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const loginBtn = document.getElementById('loginBtn');

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
