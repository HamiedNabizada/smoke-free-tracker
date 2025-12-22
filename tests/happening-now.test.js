import { describe, it, expect } from 'vitest';

// Pure function extracted from happening-now.js for testing
function formatTimeRemaining(days) {
    if (days < 0.042) { // < 1 hour
        const minutes = Math.ceil(days * 24 * 60);
        return `${minutes} Min`;
    } else if (days < 0.5) { // < 12 hours
        const hours = Math.ceil(days * 24);
        return `${hours} Std`;
    } else if (days < 1) { // < 1 day
        return 'weniger als 1 Tag';
    } else if (days < 7) {
        const wholeDays = Math.ceil(days);
        return `${wholeDays} Tag${wholeDays === 1 ? '' : 'en'}`;
    } else if (days < 30) {
        const weeks = Math.ceil(days / 7);
        return `${weeks} Woche${weeks === 1 ? '' : 'n'}`;
    } else if (days < 365) {
        const months = Math.ceil(days / 30);
        return `${months} Monat${months === 1 ? '' : 'en'}`;
    } else {
        const years = Math.floor(days / 365);
        const remainingMonths = Math.ceil((days % 365) / 30);
        if (remainingMonths > 0) {
            return `${years} Jahr${years === 1 ? '' : 'en'} und ${remainingMonths} Monat${remainingMonths === 1 ? '' : 'en'}`;
        }
        return `${years} Jahr${years === 1 ? '' : 'en'}`;
    }
}

describe('formatTimeRemaining', () => {
    describe('Minutes (< 1 hour)', () => {
        it('should format 10 minutes correctly', () => {
            const days = 10 / (24 * 60); // 10 minutes in days
            expect(formatTimeRemaining(days)).toBe('10 Min');
        });

        it('should format 30 minutes correctly', () => {
            const days = 30 / (24 * 60);
            expect(formatTimeRemaining(days)).toBe('30 Min');
        });

        it('should format 59 minutes correctly', () => {
            const days = 59 / (24 * 60);
            expect(formatTimeRemaining(days)).toBe('59 Min');
        });

        it('should round up partial minutes', () => {
            const days = 10.5 / (24 * 60);
            expect(formatTimeRemaining(days)).toBe('11 Min');
        });
    });

    describe('Hours (1-12 hours)', () => {
        it('should format 2 hours correctly', () => {
            const days = 2 / 24; // 0.083 days
            expect(formatTimeRemaining(days)).toBe('2 Std');
        });

        it('should format 6 hours correctly', () => {
            const days = 6 / 24;
            expect(formatTimeRemaining(days)).toBe('6 Std');
        });

        it('should format 11 hours correctly', () => {
            const days = 11 / 24;
            expect(formatTimeRemaining(days)).toBe('11 Std');
        });

        it('should round up partial hours', () => {
            const days = 5.5 / 24;
            expect(formatTimeRemaining(days)).toBe('6 Std');
        });
    });

    describe('Less than 1 day (12-24 hours)', () => {
        it('should return "weniger als 1 Tag" for 12 hours', () => {
            expect(formatTimeRemaining(0.5)).toBe('weniger als 1 Tag');
        });

        it('should return "weniger als 1 Tag" for 20 hours', () => {
            expect(formatTimeRemaining(20 / 24)).toBe('weniger als 1 Tag');
        });

        it('should return "weniger als 1 Tag" for 23 hours', () => {
            expect(formatTimeRemaining(23 / 24)).toBe('weniger als 1 Tag');
        });
    });

    describe('Days (1-7 days)', () => {
        it('should format 1 day correctly (singular)', () => {
            expect(formatTimeRemaining(1)).toBe('1 Tag');
        });

        it('should format 2 days correctly (plural)', () => {
            expect(formatTimeRemaining(2)).toBe('2 Tagen');
        });

        it('should format 6 days correctly', () => {
            expect(formatTimeRemaining(6)).toBe('6 Tagen');
        });

        it('should round up partial days', () => {
            expect(formatTimeRemaining(1.5)).toBe('2 Tagen');
        });
    });

    describe('Weeks (1-4 weeks)', () => {
        it('should format 1 week correctly (singular)', () => {
            expect(formatTimeRemaining(7)).toBe('1 Woche');
        });

        it('should format 2 weeks correctly (plural)', () => {
            expect(formatTimeRemaining(14)).toBe('2 Wochen');
        });

        it('should format 3 weeks correctly', () => {
            expect(formatTimeRemaining(21)).toBe('3 Wochen');
        });

        it('should round up partial weeks', () => {
            expect(formatTimeRemaining(10)).toBe('2 Wochen');
        });
    });

    describe('Months (1-12 months)', () => {
        it('should format 1 month correctly (singular)', () => {
            expect(formatTimeRemaining(30)).toBe('1 Monat');
        });

        it('should format 2 months correctly (plural)', () => {
            expect(formatTimeRemaining(60)).toBe('2 Monaten');
        });

        it('should format 6 months correctly', () => {
            expect(formatTimeRemaining(180)).toBe('6 Monaten');
        });

        it('should format 11 months correctly', () => {
            expect(formatTimeRemaining(330)).toBe('11 Monaten');
        });

        it('should round up partial months', () => {
            expect(formatTimeRemaining(45)).toBe('2 Monaten');
        });
    });

    describe('Years (1+ years)', () => {
        it('should format 1 year correctly (singular)', () => {
            expect(formatTimeRemaining(365)).toContain('1 Jahr');
        });

        it('should format 2 years correctly (plural)', () => {
            expect(formatTimeRemaining(730)).toContain('2 Jahren');
        });

        it('should format 5 years correctly', () => {
            expect(formatTimeRemaining(1825)).toContain('5 Jahren');
        });

        it('should include remaining months for 1 year and 6 months', () => {
            const result = formatTimeRemaining(365 + 180);
            expect(result).toContain('1 Jahr');
            expect(result).toContain('6 Monaten');
        });

        it('should include remaining months for 2 years and 3 months', () => {
            const result = formatTimeRemaining(730 + 90);
            expect(result).toContain('2 Jahren');
            expect(result).toContain('3 Monaten');
        });
    });

    describe('Edge Cases', () => {
        it('should handle 0 days', () => {
            expect(formatTimeRemaining(0)).toBe('0 Min');
        });

        it('should handle very small values', () => {
            expect(formatTimeRemaining(0.001)).toBe('2 Min');
        });

        it('should handle 20 years', () => {
            expect(formatTimeRemaining(7300)).toContain('20 Jahren');
        });
    });
});
