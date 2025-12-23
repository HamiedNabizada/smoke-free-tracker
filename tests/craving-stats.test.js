import { describe, it, expect } from 'vitest';

/**
 * Tests for craving-stats.js
 *
 * Testing the craving statistics calculation logic.
 */

// Weekly average calculation logic
function calculateWeeklyAverage(weekData) {
    if (weekData.length === 0) return 0;
    const total = weekData.reduce((sum, day) => sum + day.count, 0);
    return parseFloat((total / weekData.length).toFixed(1));
}

// Monthly total calculation logic
function calculateMonthlyTotal(monthData) {
    return monthData.reduce((sum, day) => sum + day.count, 0);
}

// Trend calculation logic (from craving-stats.js)
function calculateTrend(weekData) {
    if (weekData.length < 4) {
        return { trend: null, icon: null, text: null };
    }

    const firstHalf = weekData.slice(0, Math.floor(weekData.length / 2));
    const secondHalf = weekData.slice(Math.floor(weekData.length / 2));

    const firstAvg = firstHalf.reduce((sum, d) => sum + d.count, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.count, 0) / secondHalf.length;

    if (secondAvg < firstAvg * 0.8) {
        return { trend: 'decreasing', icon: '📉', text: 'Trend: Abnehmend' };
    } else if (secondAvg > firstAvg * 1.2) {
        return { trend: 'increasing', icon: '📈', text: 'Trend: Zunehmend' };
    } else {
        return { trend: 'stable', icon: '➡️', text: 'Trend: Stabil' };
    }
}

// Date filtering logic
function filterByDateRange(events, days) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    return events.filter(e => e.date >= startDateStr);
}

// Helper to create test data
function createDayData(date, count) {
    return { date, count };
}

describe('Weekly Average Calculation', () => {
    it('should return 0 for empty array', () => {
        expect(calculateWeeklyAverage([])).toBe(0);
    });

    it('should calculate correct average for single day', () => {
        const data = [createDayData('2024-01-15', 3)];
        expect(calculateWeeklyAverage(data)).toBe(3);
    });

    it('should calculate correct average for multiple days', () => {
        const data = [
            createDayData('2024-01-15', 2),
            createDayData('2024-01-16', 4),
            createDayData('2024-01-17', 3)
        ];
        // (2 + 4 + 3) / 3 = 3
        expect(calculateWeeklyAverage(data)).toBe(3);
    });

    it('should round to 1 decimal place', () => {
        const data = [
            createDayData('2024-01-15', 1),
            createDayData('2024-01-16', 2),
            createDayData('2024-01-17', 1)
        ];
        // (1 + 2 + 1) / 3 = 1.333...
        expect(calculateWeeklyAverage(data)).toBe(1.3);
    });

    it('should handle zero counts', () => {
        const data = [
            createDayData('2024-01-15', 0),
            createDayData('2024-01-16', 0),
            createDayData('2024-01-17', 0)
        ];
        expect(calculateWeeklyAverage(data)).toBe(0);
    });

    it('should handle mixed zero and non-zero counts', () => {
        const data = [
            createDayData('2024-01-15', 0),
            createDayData('2024-01-16', 5),
            createDayData('2024-01-17', 0)
        ];
        // (0 + 5 + 0) / 3 = 1.666...
        expect(calculateWeeklyAverage(data)).toBe(1.7);
    });
});

describe('Monthly Total Calculation', () => {
    it('should return 0 for empty array', () => {
        expect(calculateMonthlyTotal([])).toBe(0);
    });

    it('should sum single day correctly', () => {
        const data = [createDayData('2024-01-15', 5)];
        expect(calculateMonthlyTotal(data)).toBe(5);
    });

    it('should sum multiple days correctly', () => {
        const data = [
            createDayData('2024-01-15', 2),
            createDayData('2024-01-16', 3),
            createDayData('2024-01-17', 4),
            createDayData('2024-01-18', 1)
        ];
        expect(calculateMonthlyTotal(data)).toBe(10);
    });

    it('should handle large numbers', () => {
        const data = [
            createDayData('2024-01-15', 50),
            createDayData('2024-01-16', 100),
            createDayData('2024-01-17', 75)
        ];
        expect(calculateMonthlyTotal(data)).toBe(225);
    });

    it('should handle 30 days of data', () => {
        const data = Array(30).fill(null).map((_, i) =>
            createDayData(`2024-01-${String(i + 1).padStart(2, '0')}`, 2)
        );
        expect(calculateMonthlyTotal(data)).toBe(60);
    });
});

describe('Trend Calculation - Insufficient Data', () => {
    it('should return null for empty array', () => {
        const result = calculateTrend([]);
        expect(result.trend).toBe(null);
    });

    it('should return null for 1 day', () => {
        const data = [createDayData('2024-01-15', 3)];
        const result = calculateTrend(data);
        expect(result.trend).toBe(null);
    });

    it('should return null for 2 days', () => {
        const data = [
            createDayData('2024-01-15', 3),
            createDayData('2024-01-16', 2)
        ];
        const result = calculateTrend(data);
        expect(result.trend).toBe(null);
    });

    it('should return null for 3 days', () => {
        const data = [
            createDayData('2024-01-15', 3),
            createDayData('2024-01-16', 2),
            createDayData('2024-01-17', 1)
        ];
        const result = calculateTrend(data);
        expect(result.trend).toBe(null);
    });
});

describe('Trend Calculation - Decreasing', () => {
    it('should detect decreasing trend (< 80% of first half)', () => {
        const data = [
            createDayData('2024-01-15', 10),
            createDayData('2024-01-16', 10),
            createDayData('2024-01-17', 2),
            createDayData('2024-01-18', 2)
        ];
        // First half avg: 10, Second half avg: 2
        // 2 < 10 * 0.8 (8) = true → decreasing
        const result = calculateTrend(data);
        expect(result.trend).toBe('decreasing');
        expect(result.icon).toBe('📉');
        expect(result.text).toBe('Trend: Abnehmend');
    });

    it('should detect decreasing trend with gradual reduction', () => {
        const data = [
            createDayData('2024-01-15', 8),
            createDayData('2024-01-16', 6),
            createDayData('2024-01-17', 2),
            createDayData('2024-01-18', 1)
        ];
        // First half avg: 7, Second half avg: 1.5
        // 1.5 < 7 * 0.8 (5.6) = true → decreasing
        const result = calculateTrend(data);
        expect(result.trend).toBe('decreasing');
    });
});

describe('Trend Calculation - Increasing', () => {
    it('should detect increasing trend (> 120% of first half)', () => {
        const data = [
            createDayData('2024-01-15', 2),
            createDayData('2024-01-16', 2),
            createDayData('2024-01-17', 10),
            createDayData('2024-01-18', 10)
        ];
        // First half avg: 2, Second half avg: 10
        // 10 > 2 * 1.2 (2.4) = true → increasing
        const result = calculateTrend(data);
        expect(result.trend).toBe('increasing');
        expect(result.icon).toBe('📈');
        expect(result.text).toBe('Trend: Zunehmend');
    });

    it('should detect increasing trend with gradual increase', () => {
        const data = [
            createDayData('2024-01-15', 1),
            createDayData('2024-01-16', 2),
            createDayData('2024-01-17', 5),
            createDayData('2024-01-18', 8)
        ];
        // First half avg: 1.5, Second half avg: 6.5
        // 6.5 > 1.5 * 1.2 (1.8) = true → increasing
        const result = calculateTrend(data);
        expect(result.trend).toBe('increasing');
    });
});

describe('Trend Calculation - Stable', () => {
    it('should detect stable trend (within 80-120% range)', () => {
        const data = [
            createDayData('2024-01-15', 5),
            createDayData('2024-01-16', 5),
            createDayData('2024-01-17', 5),
            createDayData('2024-01-18', 5)
        ];
        // Both halves avg: 5
        // 5 is not < 5 * 0.8 (4) and not > 5 * 1.2 (6) → stable
        const result = calculateTrend(data);
        expect(result.trend).toBe('stable');
        expect(result.icon).toBe('➡️');
        expect(result.text).toBe('Trend: Stabil');
    });

    it('should detect stable with slight variation', () => {
        const data = [
            createDayData('2024-01-15', 4),
            createDayData('2024-01-16', 6),
            createDayData('2024-01-17', 5),
            createDayData('2024-01-18', 5)
        ];
        // First half avg: 5, Second half avg: 5
        const result = calculateTrend(data);
        expect(result.trend).toBe('stable');
    });

    it('should be stable at exactly 80% threshold', () => {
        const data = [
            createDayData('2024-01-15', 10),
            createDayData('2024-01-16', 10),
            createDayData('2024-01-17', 8),
            createDayData('2024-01-18', 8)
        ];
        // First half avg: 10, Second half avg: 8
        // 8 is NOT < 10 * 0.8 (8) → stable (not decreasing)
        const result = calculateTrend(data);
        expect(result.trend).toBe('stable');
    });

    it('should be stable at exactly 120% threshold', () => {
        const data = [
            createDayData('2024-01-15', 10),
            createDayData('2024-01-16', 10),
            createDayData('2024-01-17', 12),
            createDayData('2024-01-18', 12)
        ];
        // First half avg: 10, Second half avg: 12
        // 12 is NOT > 10 * 1.2 (12) → stable (not increasing)
        const result = calculateTrend(data);
        expect(result.trend).toBe('stable');
    });
});

describe('Trend Calculation - Edge Cases', () => {
    it('should handle zero counts in first half', () => {
        const data = [
            createDayData('2024-01-15', 0),
            createDayData('2024-01-16', 0),
            createDayData('2024-01-17', 5),
            createDayData('2024-01-18', 5)
        ];
        // First half avg: 0, Second half avg: 5
        // Division issues? 5 > 0 * 1.2 (0) = true → increasing
        const result = calculateTrend(data);
        expect(result.trend).toBe('increasing');
    });

    it('should handle zero counts in second half', () => {
        const data = [
            createDayData('2024-01-15', 5),
            createDayData('2024-01-16', 5),
            createDayData('2024-01-17', 0),
            createDayData('2024-01-18', 0)
        ];
        // First half avg: 5, Second half avg: 0
        // 0 < 5 * 0.8 (4) = true → decreasing
        const result = calculateTrend(data);
        expect(result.trend).toBe('decreasing');
    });

    it('should handle all zeros', () => {
        const data = [
            createDayData('2024-01-15', 0),
            createDayData('2024-01-16', 0),
            createDayData('2024-01-17', 0),
            createDayData('2024-01-18', 0)
        ];
        // Both halves avg: 0
        const result = calculateTrend(data);
        expect(result.trend).toBe('stable');
    });

    it('should work with odd number of days', () => {
        const data = [
            createDayData('2024-01-15', 10),
            createDayData('2024-01-16', 10),
            createDayData('2024-01-17', 5),
            createDayData('2024-01-18', 2),
            createDayData('2024-01-19', 1)
        ];
        // First half (2 days): avg 10
        // Second half (3 days): avg 2.67
        const result = calculateTrend(data);
        expect(result.trend).toBe('decreasing');
    });

    it('should work with 7 days of data', () => {
        const data = [
            createDayData('2024-01-15', 5),
            createDayData('2024-01-16', 4),
            createDayData('2024-01-17', 5),
            createDayData('2024-01-18', 4),
            createDayData('2024-01-19', 5),
            createDayData('2024-01-20', 4),
            createDayData('2024-01-21', 5)
        ];
        const result = calculateTrend(data);
        expect(result.trend).toBe('stable');
    });
});

describe('Date Filtering', () => {
    it('should filter events within date range', () => {
        // Mock current date as 2024-01-20
        const today = new Date('2024-01-20');
        const events = [
            { date: '2024-01-10', count: 1 },  // 10 days ago
            { date: '2024-01-15', count: 2 },  // 5 days ago
            { date: '2024-01-18', count: 3 },  // 2 days ago
            { date: '2024-01-20', count: 4 }   // today
        ];

        // Custom filter for 7 days
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        const startDateStr = startDate.toISOString().split('T')[0];
        const filtered = events.filter(e => e.date >= startDateStr);

        expect(filtered.length).toBe(3);
        expect(filtered.map(e => e.count)).toEqual([2, 3, 4]);
    });
});

describe('Statistics Summary', () => {
    it('should calculate all stats for truly stable week', () => {
        const weekData = [
            createDayData('2024-01-15', 3),
            createDayData('2024-01-16', 3),
            createDayData('2024-01-17', 3),
            createDayData('2024-01-18', 3),
            createDayData('2024-01-19', 3),
            createDayData('2024-01-20', 3),
            createDayData('2024-01-21', 3)
        ];

        const avg = calculateWeeklyAverage(weekData);
        const total = calculateMonthlyTotal(weekData);
        const trend = calculateTrend(weekData);

        expect(avg).toBe(3);
        expect(total).toBe(21);
        expect(trend.trend).toBe('stable');
    });

    it('should show improvement over time', () => {
        const weekData = [
            createDayData('2024-01-15', 8),
            createDayData('2024-01-16', 7),
            createDayData('2024-01-17', 6),
            createDayData('2024-01-18', 3),
            createDayData('2024-01-19', 2),
            createDayData('2024-01-20', 2),
            createDayData('2024-01-21', 1)
        ];

        const trend = calculateTrend(weekData);
        expect(trend.trend).toBe('decreasing');
        expect(trend.text).toContain('Abnehmend');
    });
});
