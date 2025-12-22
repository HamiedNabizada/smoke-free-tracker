import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Constants from rate-limiter.js
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

// Mock localStorage
let mockStore = {};

const localStorageMock = {
    getItem: (key) => mockStore[key] || null,
    setItem: (key, value) => { mockStore[key] = value; },
    removeItem: (key) => { delete mockStore[key]; },
    clear: () => { mockStore = {}; }
};

// Pure functions extracted from rate-limiter.js
const STORAGE_KEY_PREFIX = 'rate_limit_';

function getRateLimitData(key) {
    try {
        const stored = localStorageMock.getItem(key);
        if (!stored) {
            return { attempts: 0, lastAttempt: null, lockoutEnd: null };
        }

        const data = JSON.parse(stored);
        if (data.lockoutEnd) {
            data.lockoutEnd = new Date(data.lockoutEnd);
        }
        return data;
    } catch (error) {
        return { attempts: 0, lastAttempt: null, lockoutEnd: null };
    }
}

function saveRateLimitData(key, data) {
    try {
        localStorageMock.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function resetRateLimit(type) {
    const key = STORAGE_KEY_PREFIX + type;
    localStorageMock.removeItem(key);
}

function checkRateLimit(type) {
    const key = STORAGE_KEY_PREFIX + type;
    const data = getRateLimitData(key);

    if (data.lockoutEnd && new Date() > data.lockoutEnd) {
        resetRateLimit(type);
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockoutEnd: null };
    }

    if (data.lockoutEnd && new Date() <= data.lockoutEnd) {
        const remainingTime = Math.ceil((data.lockoutEnd - new Date()) / 1000 / 60);
        return {
            allowed: false,
            remainingAttempts: 0,
            lockoutEnd: data.lockoutEnd,
            remainingMinutes: remainingTime
        };
    }

    if (data.attempts >= MAX_ATTEMPTS) {
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

function recordFailedAttempt(type) {
    const key = STORAGE_KEY_PREFIX + type;
    const data = getRateLimitData(key);

    data.attempts++;
    data.lastAttempt = new Date().toISOString();

    if (data.attempts >= MAX_ATTEMPTS) {
        data.lockoutEnd = new Date(Date.now() + LOCKOUT_DURATION);
    }

    saveRateLimitData(key, data);
}

function formatRemainingTime(minutes) {
    if (minutes < 1) {
        return 'weniger als 1 Minute';
    } else if (minutes === 1) {
        return '1 Minute';
    } else {
        return `${minutes} Minuten`;
    }
}

describe('Rate Limiter - Format Remaining Time', () => {
    it('should format less than 1 minute', () => {
        expect(formatRemainingTime(0)).toBe('weniger als 1 Minute');
        expect(formatRemainingTime(0.5)).toBe('weniger als 1 Minute');
    });

    it('should format exactly 1 minute (singular)', () => {
        expect(formatRemainingTime(1)).toBe('1 Minute');
    });

    it('should format multiple minutes (plural)', () => {
        expect(formatRemainingTime(2)).toBe('2 Minuten');
        expect(formatRemainingTime(5)).toBe('5 Minuten');
        expect(formatRemainingTime(10)).toBe('10 Minuten');
    });
});

describe('Rate Limiter - Initial State', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should allow first attempt', () => {
        const result = checkRateLimit('login');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS);
        expect(result.lockoutEnd).toBeNull();
    });

    it('should have 5 max attempts', () => {
        expect(MAX_ATTEMPTS).toBe(5);
    });

    it('should have 5 minute lockout duration', () => {
        expect(LOCKOUT_DURATION).toBe(5 * 60 * 1000);
    });
});

describe('Rate Limiter - Failed Attempts', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should decrease remaining attempts after failure', () => {
        recordFailedAttempt('login');

        const result = checkRateLimit('login');
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS - 1);
    });

    it('should track multiple failed attempts', () => {
        recordFailedAttempt('login');
        recordFailedAttempt('login');
        recordFailedAttempt('login');

        const result = checkRateLimit('login');
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS - 3);
    });

    it('should still allow attempts before max reached', () => {
        for (let i = 0; i < MAX_ATTEMPTS - 1; i++) {
            recordFailedAttempt('login');
        }

        const result = checkRateLimit('login');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBe(1);
    });
});

describe('Rate Limiter - Lockout', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should trigger lockout after max attempts', () => {
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            recordFailedAttempt('login');
        }

        const result = checkRateLimit('login');
        expect(result.allowed).toBe(false);
        expect(result.remainingAttempts).toBe(0);
        expect(result.lockoutEnd).toBeDefined();
    });

    it('should show 5 minutes remaining at start of lockout', () => {
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            recordFailedAttempt('login');
        }

        const result = checkRateLimit('login');
        expect(result.remainingMinutes).toBe(5);
    });

    it('should remain locked during lockout period', () => {
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            recordFailedAttempt('login');
        }

        // Advance 2 minutes
        vi.advanceTimersByTime(2 * 60 * 1000);

        const result = checkRateLimit('login');
        expect(result.allowed).toBe(false);
        expect(result.remainingMinutes).toBe(3);
    });

    it('should unlock after lockout expires', () => {
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            recordFailedAttempt('login');
        }

        // Advance past lockout duration
        vi.advanceTimersByTime(LOCKOUT_DURATION + 1000);

        const result = checkRateLimit('login');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS);
    });
});

describe('Rate Limiter - Reset', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should reset attempts on success', () => {
        recordFailedAttempt('login');
        recordFailedAttempt('login');

        resetRateLimit('login');

        const result = checkRateLimit('login');
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS);
    });

    it('should reset lockout on success', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));

        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            recordFailedAttempt('login');
        }

        resetRateLimit('login');

        const result = checkRateLimit('login');
        expect(result.allowed).toBe(true);
        expect(result.lockoutEnd).toBeNull();

        vi.useRealTimers();
    });
});

describe('Rate Limiter - Separate Types', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should track login and register separately', () => {
        recordFailedAttempt('login');
        recordFailedAttempt('login');
        recordFailedAttempt('register');

        const loginResult = checkRateLimit('login');
        const registerResult = checkRateLimit('register');

        expect(loginResult.remainingAttempts).toBe(MAX_ATTEMPTS - 2);
        expect(registerResult.remainingAttempts).toBe(MAX_ATTEMPTS - 1);
    });

    it('should reset only specified type', () => {
        recordFailedAttempt('login');
        recordFailedAttempt('register');

        resetRateLimit('login');

        const loginResult = checkRateLimit('login');
        const registerResult = checkRateLimit('register');

        expect(loginResult.remainingAttempts).toBe(MAX_ATTEMPTS);
        expect(registerResult.remainingAttempts).toBe(MAX_ATTEMPTS - 1);
    });
});

describe('Rate Limiter - Error Handling', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should handle corrupted data gracefully', () => {
        mockStore['rate_limit_login'] = 'invalid json{{{';

        const result = checkRateLimit('login');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS);
    });

    it('should handle missing data gracefully', () => {
        const result = checkRateLimit('nonexistent');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBe(MAX_ATTEMPTS);
    });
});
