import { describe, it, expect } from 'vitest';

// Constants from progress-visuals.js
const ARC_LENGTH = 251.2; // π * 80

// Pure calculation functions extracted from progress-visuals.js
function calculateGaugeOffset(current, target) {
    const progress = Math.min(current / target, 1);
    return ARC_LENGTH * (1 - progress);
}

function calculateProgressPercent(current, target) {
    const progress = Math.min(current / target, 1);
    return Math.round(progress * 100);
}

// Time remaining formatting from dashboard.js
function formatTimeRemaining(daysRemaining) {
    if (daysRemaining < 1) {
        const hoursRemaining = Math.ceil(daysRemaining * 24);
        return `${hoursRemaining} Std.`;
    } else if (daysRemaining < 7) {
        return `${Math.ceil(daysRemaining)} Tag${Math.ceil(daysRemaining) === 1 ? '' : 'en'}`;
    } else if (daysRemaining < 30) {
        const weeks = Math.ceil(daysRemaining / 7);
        return `${weeks} Woche${weeks === 1 ? '' : 'n'}`;
    } else if (daysRemaining < 365) {
        const months = Math.ceil(daysRemaining / 30);
        return `${months} Monat${months === 1 ? '' : 'en'}`;
    } else {
        const years = Math.floor(daysRemaining / 365);
        return `${years} Jahr${years === 1 ? '' : 'en'}`;
    }
}

// Time display formatting from dashboard.js
function formatTimeDisplay(stats) {
    if (stats.totalDays < 1) {
        if (stats.totalDays < (1/24)) {
            return `${stats.minutes} Min`;
        } else {
            return `${stats.hours}h ${stats.minutes}m`;
        }
    } else {
        return `${stats.days}d ${stats.hours}h ${stats.minutes}m`;
    }
}

describe('Progress Gauges - Offset Calculation', () => {
    it('should return full arc length at 0% progress', () => {
        const offset = calculateGaugeOffset(0, 100);
        expect(offset).toBe(ARC_LENGTH);
    });

    it('should return half arc length at 50% progress', () => {
        const offset = calculateGaugeOffset(50, 100);
        expect(offset).toBeCloseTo(ARC_LENGTH * 0.5, 1);
    });

    it('should return 0 at 100% progress', () => {
        const offset = calculateGaugeOffset(100, 100);
        expect(offset).toBe(0);
    });

    it('should cap at 0 for values over target', () => {
        const offset = calculateGaugeOffset(150, 100);
        expect(offset).toBe(0);
    });

    it('should handle decimal progress', () => {
        const offset = calculateGaugeOffset(25, 100);
        expect(offset).toBeCloseTo(ARC_LENGTH * 0.75, 1);
    });
});

describe('Progress Gauges - Percent Calculation', () => {
    it('should return 0% at start', () => {
        expect(calculateProgressPercent(0, 100)).toBe(0);
    });

    it('should return 50% at halfway', () => {
        expect(calculateProgressPercent(50, 100)).toBe(50);
    });

    it('should return 100% at target', () => {
        expect(calculateProgressPercent(100, 100)).toBe(100);
    });

    it('should cap at 100% for values over target', () => {
        expect(calculateProgressPercent(150, 100)).toBe(100);
    });

    it('should round to whole numbers', () => {
        expect(calculateProgressPercent(33, 100)).toBe(33);
        expect(calculateProgressPercent(33.4, 100)).toBe(33);
        expect(calculateProgressPercent(33.6, 100)).toBe(34);
    });
});

describe('Progress Gauges - Days Goal', () => {
    const TARGET_DAYS = 30;

    it('should calculate correct offset for 10 days', () => {
        const offset = calculateGaugeOffset(10, TARGET_DAYS);
        expect(offset).toBeCloseTo(ARC_LENGTH * (1 - 10/30), 1);
    });

    it('should calculate 33% for 10 of 30 days', () => {
        expect(calculateProgressPercent(10, TARGET_DAYS)).toBe(33);
    });

    it('should handle fractional days', () => {
        expect(calculateProgressPercent(0.5, TARGET_DAYS)).toBe(2);
    });
});

describe('Progress Gauges - Money Goal', () => {
    const TARGET_MONEY = 100;

    it('should calculate correct percent for 25€', () => {
        expect(calculateProgressPercent(25, TARGET_MONEY)).toBe(25);
    });

    it('should calculate correct percent for 75€', () => {
        expect(calculateProgressPercent(75, TARGET_MONEY)).toBe(75);
    });

    it('should handle decimals like 33.33€', () => {
        expect(calculateProgressPercent(33.33, TARGET_MONEY)).toBe(33);
    });
});

describe('Progress Gauges - Cigarettes Goal', () => {
    const TARGET_CIGS = 500;

    it('should calculate correct percent for 100 cigarettes', () => {
        expect(calculateProgressPercent(100, TARGET_CIGS)).toBe(20);
    });

    it('should calculate correct percent for 250 cigarettes', () => {
        expect(calculateProgressPercent(250, TARGET_CIGS)).toBe(50);
    });
});

describe('Time Remaining Format', () => {
    it('should format hours for less than 1 day', () => {
        expect(formatTimeRemaining(0.5)).toBe('12 Std.');
        expect(formatTimeRemaining(0.25)).toBe('6 Std.');
    });

    it('should format 1 day (singular)', () => {
        expect(formatTimeRemaining(1)).toBe('1 Tag');
    });

    it('should format multiple days (plural)', () => {
        expect(formatTimeRemaining(3)).toBe('3 Tagen');
        expect(formatTimeRemaining(6)).toBe('6 Tagen');
    });

    it('should format 1 week (singular)', () => {
        expect(formatTimeRemaining(7)).toBe('1 Woche');
    });

    it('should format multiple weeks (plural)', () => {
        expect(formatTimeRemaining(14)).toBe('2 Wochen');
        expect(formatTimeRemaining(21)).toBe('3 Wochen');
    });

    it('should format 1 month (singular)', () => {
        expect(formatTimeRemaining(30)).toBe('1 Monat');
    });

    it('should format multiple months (plural)', () => {
        expect(formatTimeRemaining(60)).toBe('2 Monaten');
        expect(formatTimeRemaining(180)).toBe('6 Monaten');
    });

    it('should format 1 year (singular)', () => {
        expect(formatTimeRemaining(365)).toBe('1 Jahr');
    });

    it('should format multiple years (plural)', () => {
        expect(formatTimeRemaining(730)).toBe('2 Jahren');
        expect(formatTimeRemaining(1825)).toBe('5 Jahren');
    });
});

describe('Time Display Format', () => {
    it('should show minutes for less than 1 hour', () => {
        const stats = { totalDays: 0.02, days: 0, hours: 0, minutes: 30 };
        expect(formatTimeDisplay(stats)).toBe('30 Min');
    });

    it('should show hours and minutes for less than 1 day', () => {
        const stats = { totalDays: 0.5, days: 0, hours: 12, minutes: 0 };
        expect(formatTimeDisplay(stats)).toBe('12h 0m');
    });

    it('should show days, hours and minutes for 1+ days', () => {
        const stats = { totalDays: 2.5, days: 2, hours: 12, minutes: 30 };
        expect(formatTimeDisplay(stats)).toBe('2d 12h 30m');
    });

    it('should handle exactly 1 day', () => {
        const stats = { totalDays: 1, days: 1, hours: 0, minutes: 0 };
        expect(formatTimeDisplay(stats)).toBe('1d 0h 0m');
    });

    it('should handle large values', () => {
        const stats = { totalDays: 365, days: 365, hours: 5, minutes: 30 };
        expect(formatTimeDisplay(stats)).toBe('365d 5h 30m');
    });
});
