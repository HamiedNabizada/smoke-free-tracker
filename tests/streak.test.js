import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests for streak.js
 *
 * Testing the streak tracking logic for consecutive app visits.
 */

// Mock date helper
function getDateString(date) {
    return date.toISOString().split('T')[0];
}

// Streak calculation logic (extracted from streak.js)
function calculateStreak(today, lastVisit, currentStreak) {
    if (!lastVisit) {
        // First visit ever
        return 1;
    }

    if (lastVisit === today) {
        // Already visited today, keep streak
        return currentStreak;
    }

    const lastDate = new Date(lastVisit);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Consecutive day - increase streak
        return currentStreak + 1;
    } else if (diffDays > 1) {
        // Missed days - reset streak
        return 1;
    }

    return currentStreak;
}

// Display visibility logic (extracted from streak.js)
function shouldShowStreak(streak) {
    return streak > 1;
}

// Fire effect logic (extracted from streak.js)
function getFireEffects(streak) {
    return {
        hot: streak >= 7,
        blazing: streak >= 30
    };
}

describe('Streak - First Visit', () => {
    it('should return streak of 1 on first visit', () => {
        const today = '2024-01-15';
        const streak = calculateStreak(today, null, 0);
        expect(streak).toBe(1);
    });

    it('should return streak of 1 when lastVisit is undefined', () => {
        const today = '2024-01-15';
        const streak = calculateStreak(today, undefined, 0);
        expect(streak).toBe(1);
    });
});

describe('Streak - Same Day Visit', () => {
    it('should keep streak when visiting same day', () => {
        const today = '2024-01-15';
        const streak = calculateStreak(today, today, 5);
        expect(streak).toBe(5);
    });

    it('should not increase streak on same day', () => {
        const today = '2024-01-15';
        const streak = calculateStreak(today, today, 10);
        expect(streak).toBe(10);
    });

    it('should keep streak of 1 on same day', () => {
        const today = '2024-01-15';
        const streak = calculateStreak(today, today, 1);
        expect(streak).toBe(1);
    });
});

describe('Streak - Consecutive Days', () => {
    it('should increase streak by 1 for consecutive day', () => {
        const today = '2024-01-16';
        const yesterday = '2024-01-15';
        const streak = calculateStreak(today, yesterday, 5);
        expect(streak).toBe(6);
    });

    it('should work across month boundary', () => {
        const today = '2024-02-01';
        const yesterday = '2024-01-31';
        const streak = calculateStreak(today, yesterday, 10);
        expect(streak).toBe(11);
    });

    it('should work across year boundary', () => {
        const today = '2024-01-01';
        const yesterday = '2023-12-31';
        const streak = calculateStreak(today, yesterday, 100);
        expect(streak).toBe(101);
    });

    it('should increment streak from 1 to 2', () => {
        const today = '2024-01-16';
        const yesterday = '2024-01-15';
        const streak = calculateStreak(today, yesterday, 1);
        expect(streak).toBe(2);
    });
});

describe('Streak - Missed Days (Reset)', () => {
    it('should reset to 1 when missing 1 day', () => {
        const today = '2024-01-17';
        const twoDaysAgo = '2024-01-15';
        const streak = calculateStreak(today, twoDaysAgo, 10);
        expect(streak).toBe(1);
    });

    it('should reset to 1 when missing multiple days', () => {
        const today = '2024-01-20';
        const weekAgo = '2024-01-13';
        const streak = calculateStreak(today, weekAgo, 50);
        expect(streak).toBe(1);
    });

    it('should reset to 1 when missing months', () => {
        const today = '2024-06-15';
        const monthsAgo = '2024-01-15';
        const streak = calculateStreak(today, monthsAgo, 200);
        expect(streak).toBe(1);
    });

    it('should reset streak of 1 to 1 (no change)', () => {
        const today = '2024-01-20';
        const weekAgo = '2024-01-13';
        const streak = calculateStreak(today, weekAgo, 1);
        expect(streak).toBe(1);
    });
});

describe('Streak - Edge Cases', () => {
    it('should handle streak count of 0 as first visit', () => {
        const today = '2024-01-16';
        const yesterday = '2024-01-15';
        const streak = calculateStreak(today, yesterday, 0);
        // 0 + 1 = 1
        expect(streak).toBe(1);
    });

    it('should handle leap year correctly', () => {
        const today = '2024-02-29';
        const yesterday = '2024-02-28';
        const streak = calculateStreak(today, yesterday, 5);
        expect(streak).toBe(6);
    });

    it('should handle day after leap day', () => {
        const today = '2024-03-01';
        const yesterday = '2024-02-29';
        const streak = calculateStreak(today, yesterday, 6);
        expect(streak).toBe(7);
    });
});

describe('Streak Display - Visibility', () => {
    it('should hide streak when count is 1', () => {
        expect(shouldShowStreak(1)).toBe(false);
    });

    it('should hide streak when count is 0', () => {
        expect(shouldShowStreak(0)).toBe(false);
    });

    it('should show streak when count is 2', () => {
        expect(shouldShowStreak(2)).toBe(true);
    });

    it('should show streak for higher counts', () => {
        expect(shouldShowStreak(5)).toBe(true);
        expect(shouldShowStreak(10)).toBe(true);
        expect(shouldShowStreak(100)).toBe(true);
    });
});

describe('Streak Fire Effects', () => {
    it('should have no effects for low streaks', () => {
        expect(getFireEffects(1)).toEqual({ hot: false, blazing: false });
        expect(getFireEffects(5)).toEqual({ hot: false, blazing: false });
        expect(getFireEffects(6)).toEqual({ hot: false, blazing: false });
    });

    it('should have hot effect at streak 7', () => {
        expect(getFireEffects(7)).toEqual({ hot: true, blazing: false });
    });

    it('should have hot effect for streaks 7-29', () => {
        expect(getFireEffects(10).hot).toBe(true);
        expect(getFireEffects(20).hot).toBe(true);
        expect(getFireEffects(29).hot).toBe(true);
        expect(getFireEffects(29).blazing).toBe(false);
    });

    it('should have blazing effect at streak 30', () => {
        expect(getFireEffects(30)).toEqual({ hot: true, blazing: true });
    });

    it('should have both effects for high streaks', () => {
        expect(getFireEffects(50).hot).toBe(true);
        expect(getFireEffects(50).blazing).toBe(true);
        expect(getFireEffects(100).hot).toBe(true);
        expect(getFireEffects(100).blazing).toBe(true);
    });
});

describe('Date Difference Calculation', () => {
    it('should correctly calculate 1 day difference', () => {
        const date1 = new Date('2024-01-15');
        const date2 = new Date('2024-01-16');
        const diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        expect(diff).toBe(1);
    });

    it('should correctly calculate multi-day difference', () => {
        const date1 = new Date('2024-01-15');
        const date2 = new Date('2024-01-20');
        const diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        expect(diff).toBe(5);
    });

    it('should handle same day as 0 difference', () => {
        const date1 = new Date('2024-01-15');
        const date2 = new Date('2024-01-15');
        const diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        expect(diff).toBe(0);
    });
});

describe('Streak Milestones', () => {
    it('should reach first fire effect at 7 days', () => {
        let streak = 1;
        for (let day = 1; day < 7; day++) {
            streak++;
        }
        expect(getFireEffects(streak).hot).toBe(true);
    });

    it('should reach blazing effect at 30 days', () => {
        let streak = 1;
        for (let day = 1; day < 30; day++) {
            streak++;
        }
        expect(getFireEffects(streak).blazing).toBe(true);
    });
});
