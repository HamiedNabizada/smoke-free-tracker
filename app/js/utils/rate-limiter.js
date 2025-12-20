/**
 * Rate Limiter für Login/Register
 * Verhindert Brute-Force-Angriffe
 */

const STORAGE_KEY_PREFIX = 'rate_limit_';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 Minuten in Millisekunden

/**
 * Prüft ob ein Versuch erlaubt ist
 * @param {string} type - 'login' oder 'register'
 * @returns {Object} { allowed: boolean, remainingAttempts: number, lockoutEnd: Date|null }
 */
export function checkRateLimit(type) {
    const key = STORAGE_KEY_PREFIX + type;
    const data = getRateLimitData(key);

    // Prüfe ob Lockout abgelaufen ist
    if (data.lockoutEnd && new Date() > data.lockoutEnd) {
        // Lockout abgelaufen, reset
        resetRateLimit(type);
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockoutEnd: null };
    }

    // Prüfe ob noch im Lockout
    if (data.lockoutEnd && new Date() <= data.lockoutEnd) {
        const remainingTime = Math.ceil((data.lockoutEnd - new Date()) / 1000 / 60);
        return {
            allowed: false,
            remainingAttempts: 0,
            lockoutEnd: data.lockoutEnd,
            remainingMinutes: remainingTime
        };
    }

    // Prüfe Anzahl der Versuche
    if (data.attempts >= MAX_ATTEMPTS) {
        // Max Versuche erreicht, starte Lockout
        const lockoutEnd = new Date(Date.now() + LOCKOUT_DURATION);
        saveRateLimitData(key, { attempts: data.attempts, lockoutEnd });
        const remainingTime = Math.ceil(LOCKOUT_DURATION / 1000 / 60);
        return {
            allowed: false,
            remainingAttempts: 0,
            lockoutEnd,
            remainingMinutes: remainingTime
        };
    }

    return {
        allowed: true,
        remainingAttempts: MAX_ATTEMPTS - data.attempts,
        lockoutEnd: null
    };
}

/**
 * Registriert einen fehlgeschlagenen Versuch
 * @param {string} type - 'login' oder 'register'
 */
export function recordFailedAttempt(type) {
    const key = STORAGE_KEY_PREFIX + type;
    const data = getRateLimitData(key);

    data.attempts++;
    data.lastAttempt = new Date().toISOString();

    // Wenn Max erreicht, setze Lockout
    if (data.attempts >= MAX_ATTEMPTS) {
        data.lockoutEnd = new Date(Date.now() + LOCKOUT_DURATION);
    }

    saveRateLimitData(key, data);
}

/**
 * Registriert einen erfolgreichen Versuch (reset)
 * @param {string} type - 'login' oder 'register'
 */
export function recordSuccessfulAttempt(type) {
    resetRateLimit(type);
}

/**
 * Setzt Rate Limit zurück
 * @param {string} type - 'login' oder 'register'
 */
export function resetRateLimit(type) {
    const key = STORAGE_KEY_PREFIX + type;
    localStorage.removeItem(key);
}

/**
 * Lädt Rate Limit Daten aus localStorage
 * @param {string} key
 * @returns {Object}
 */
function getRateLimitData(key) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) {
            return { attempts: 0, lastAttempt: null, lockoutEnd: null };
        }

        const data = JSON.parse(stored);
        // Parse lockoutEnd zurück zu Date
        if (data.lockoutEnd) {
            data.lockoutEnd = new Date(data.lockoutEnd);
        }
        return data;
    } catch (error) {
        console.error('[RateLimit] Error loading data:', error);
        return { attempts: 0, lastAttempt: null, lockoutEnd: null };
    }
}

/**
 * Speichert Rate Limit Daten in localStorage
 * @param {string} key
 * @param {Object} data
 */
function saveRateLimitData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('[RateLimit] Error saving data:', error);
    }
}

/**
 * Formatiert verbleibende Zeit für Anzeige
 * @param {number} minutes
 * @returns {string}
 */
export function formatRemainingTime(minutes) {
    if (minutes < 1) {
        return 'weniger als 1 Minute';
    } else if (minutes === 1) {
        return '1 Minute';
    } else {
        return `${minutes} Minuten`;
    }
}
