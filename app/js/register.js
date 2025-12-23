/**
 * Register Page Script
 */

import { checkRateLimit, recordFailedAttempt, recordSuccessfulAttempt, formatRemainingTime } from './utils/rate-limiter.js';
import { registerUser } from './firebase-auth.js';

const form = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const registerBtn = document.getElementById('registerBtn');

// Set default quit date to now
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById('quit_date').value = now.toISOString().slice(0, 16);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Rate Limiting prüfen
    const rateLimitCheck = checkRateLimit('register');
    if (!rateLimitCheck.allowed) {
        const timeRemaining = formatRemainingTime(rateLimitCheck.remainingMinutes);
        errorMessage.textContent = `Zu viele Registrierungsversuche. Bitte warte ${timeRemaining}.`;
        errorMessage.style.display = 'block';
        return;
    }

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const quit_date = document.getElementById('quit_date').value;
    const cigarettes_per_day = parseInt(document.getElementById('cigarettes_per_day').value);
    const price_per_pack = parseFloat(document.getElementById('price_per_pack').value);
    const cigarettes_per_pack = parseInt(document.getElementById('cigarettes_per_pack').value);

    // Validation
    if (username.length < 3 || username.length > 50) {
        errorMessage.textContent = 'Benutzername muss zwischen 3 und 50 Zeichen lang sein';
        errorMessage.style.display = 'block';
        return;
    }

    // Username: nur Buchstaben, Zahlen, Unterstrich und Bindestrich
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        errorMessage.textContent = 'Benutzername darf nur Buchstaben, Zahlen, _ und - enthalten';
        errorMessage.style.display = 'block';
        return;
    }

    // Quit date: darf nicht in der Zukunft liegen
    const quitDate = new Date(quit_date);
    const nowCheck = new Date();
    if (quitDate > nowCheck) {
        errorMessage.textContent = 'Rauchstopp-Datum darf nicht in der Zukunft liegen';
        errorMessage.style.display = 'block';
        return;
    }

    // Cigarettes per day: 1-200
    if (isNaN(cigarettes_per_day) || cigarettes_per_day < 1 || cigarettes_per_day > 200) {
        errorMessage.textContent = 'Zigaretten pro Tag muss zwischen 1 und 200 liegen';
        errorMessage.style.display = 'block';
        return;
    }

    // Price: >= 0
    if (isNaN(price_per_pack) || price_per_pack < 0) {
        errorMessage.textContent = 'Preis pro Packung muss mindestens 0 sein';
        errorMessage.style.display = 'block';
        return;
    }

    // Cigarettes per pack: 1-100
    if (isNaN(cigarettes_per_pack) || cigarettes_per_pack < 1 || cigarettes_per_pack > 100) {
        errorMessage.textContent = 'Zigaretten pro Packung muss zwischen 1 und 100 liegen';
        errorMessage.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Passwort muss mindestens 6 Zeichen lang sein';
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';
    registerBtn.disabled = true;
    registerBtn.textContent = 'Registriere...';

    try {
        await registerUser(username, password, {
            quit_date,
            cigarettes_per_day,
            price_per_pack,
            cigarettes_per_pack
        });

        recordSuccessfulAttempt('register');
        window.location.href = 'index.html';
    } catch (error) {
        recordFailedAttempt('register');

        // Prüfe erneut ob jetzt locked out
        const newCheck = checkRateLimit('register');
        if (!newCheck.allowed) {
            const timeRemaining = formatRemainingTime(newCheck.remainingMinutes);
            errorMessage.textContent = `Zu viele fehlgeschlagene Versuche. Bitte warte ${timeRemaining}.`;
        } else {
            errorMessage.textContent = error.message + ` (${newCheck.remainingAttempts} Versuche übrig)`;
        }

        errorMessage.style.display = 'block';
        registerBtn.disabled = false;
        registerBtn.textContent = 'Registrieren';
    }
});
