import { describe, it, expect } from 'vitest';

/**
 * Tests for craving-heatmap.js
 *
 * Testing the heatmap visualization logic.
 */

// Constants from craving-heatmap.js
const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const HOUR_LABELS = ['00', '03', '06', '09', '12', '15', '18', '21'];

// getColorClass logic (from craving-heatmap.js)
function getColorClass(intensity) {
    if (intensity === 0) return 'level-0';
    if (intensity < 0.25) return 'level-1';
    if (intensity < 0.5) return 'level-2';
    if (intensity < 0.75) return 'level-3';
    return 'level-4';
}

// findPeakTimes logic (from craving-heatmap.js)
function findPeakTimes(heatmap) {
    const insights = [];

    // Find peak day
    const dayTotals = heatmap.map((day, i) => ({
        day: i,
        total: day.reduce((a, b) => a + b, 0)
    }));
    dayTotals.sort((a, b) => b.total - a.total);

    if (dayTotals[0].total > 0) {
        insights.push(`Höchstes Verlangen am <strong>${DAY_NAMES[dayTotals[0].day]}</strong>`);
    }

    // Find peak time blocks
    const hourTotals = [];
    for (let h = 0; h < 24; h++) {
        let total = 0;
        for (let d = 0; d < 7; d++) {
            total += heatmap[d][h] || 0;
        }
        hourTotals.push({ hour: h, total });
    }
    hourTotals.sort((a, b) => b.total - a.total);

    if (hourTotals[0].total > 0) {
        const peakHour = hourTotals[0].hour;
        const timeRange = `${peakHour}:00 - ${peakHour + 1}:00`;
        insights.push(`Kritischste Uhrzeit: <strong>${timeRange} Uhr</strong>`);
    }

    // Find low activity periods
    if (dayTotals[dayTotals.length - 1].total === 0) {
        const lowDay = DAY_NAMES[dayTotals[dayTotals.length - 1].day];
        insights.push(`Kein Verlangen am <strong>${lowDay}</strong> - gut gemacht!`);
    }

    if (insights.length === 0) {
        insights.push('Noch nicht genug Daten für Erkenntnisse');
    }

    return insights;
}

// Helper to create empty heatmap
function createEmptyHeatmap() {
    return Array(7).fill(null).map(() => Array(24).fill(0));
}

describe('Heatmap Constants', () => {
    it('should have 7 day names', () => {
        expect(DAY_NAMES.length).toBe(7);
    });

    it('should start with Sunday (German format)', () => {
        expect(DAY_NAMES[0]).toBe('So');
    });

    it('should have correct German day abbreviations', () => {
        expect(DAY_NAMES).toEqual(['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']);
    });

    it('should have 8 hour labels (3-hour blocks)', () => {
        expect(HOUR_LABELS.length).toBe(8);
    });

    it('should have correct hour labels', () => {
        expect(HOUR_LABELS).toEqual(['00', '03', '06', '09', '12', '15', '18', '21']);
    });
});

describe('getColorClass - Intensity Levels', () => {
    it('should return level-0 for intensity 0', () => {
        expect(getColorClass(0)).toBe('level-0');
    });

    it('should return level-1 for intensity < 0.25', () => {
        expect(getColorClass(0.1)).toBe('level-1');
        expect(getColorClass(0.24)).toBe('level-1');
    });

    it('should return level-2 for intensity 0.25 - 0.49', () => {
        expect(getColorClass(0.25)).toBe('level-2');
        expect(getColorClass(0.4)).toBe('level-2');
        expect(getColorClass(0.49)).toBe('level-2');
    });

    it('should return level-3 for intensity 0.5 - 0.74', () => {
        expect(getColorClass(0.5)).toBe('level-3');
        expect(getColorClass(0.6)).toBe('level-3');
        expect(getColorClass(0.74)).toBe('level-3');
    });

    it('should return level-4 for intensity >= 0.75', () => {
        expect(getColorClass(0.75)).toBe('level-4');
        expect(getColorClass(0.9)).toBe('level-4');
        expect(getColorClass(1.0)).toBe('level-4');
    });

    it('should handle edge cases', () => {
        expect(getColorClass(0.001)).toBe('level-1');
        expect(getColorClass(0.999)).toBe('level-4');
    });
});

describe('findPeakTimes - Empty Data', () => {
    it('should return zero-craving message for empty heatmap', () => {
        const heatmap = createEmptyHeatmap();
        const insights = findPeakTimes(heatmap);

        // When all days have 0 cravings, the "lowest" day still has 0
        // so it returns "Kein Verlangen am X - gut gemacht!"
        expect(insights.length).toBe(1);
        expect(insights[0]).toContain('Kein Verlangen');
        expect(insights[0]).toContain('gut gemacht');
    });
});

describe('findPeakTimes - Peak Day Detection', () => {
    it('should identify peak day correctly', () => {
        const heatmap = createEmptyHeatmap();
        // Monday (index 1) has most cravings
        heatmap[1][12] = 5;
        heatmap[1][13] = 3;

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('Mo'))).toBe(true);
    });

    it('should identify Sunday as peak day', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[0][10] = 10; // Sunday at 10:00

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('So'))).toBe(true);
    });

    it('should identify Saturday as peak day', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[6][20] = 8; // Saturday at 20:00

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('Sa'))).toBe(true);
    });
});

describe('findPeakTimes - Peak Hour Detection', () => {
    it('should identify peak hour correctly', () => {
        const heatmap = createEmptyHeatmap();
        // 14:00 has most cravings across all days
        heatmap[0][14] = 2;
        heatmap[1][14] = 3;
        heatmap[2][14] = 2;

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('14:00'))).toBe(true);
    });

    it('should identify morning peak', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[1][8] = 5;
        heatmap[2][8] = 5;

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('8:00'))).toBe(true);
    });

    it('should identify evening peak', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[3][20] = 4;
        heatmap[4][20] = 6;

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('20:00'))).toBe(true);
    });
});

describe('findPeakTimes - Low Activity Detection', () => {
    it('should identify day with no cravings', () => {
        const heatmap = createEmptyHeatmap();
        // Add cravings to all days except Wednesday (index 3)
        heatmap[0][10] = 1;
        heatmap[1][10] = 1;
        heatmap[2][10] = 1;
        // Wednesday (index 3) stays empty
        heatmap[4][10] = 1;
        heatmap[5][10] = 1;
        heatmap[6][10] = 1;

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('Mi') && i.includes('Kein Verlangen'))).toBe(true);
    });

    it('should show "gut gemacht" for zero-craving day', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[1][12] = 3;
        // Sunday (index 0) has no cravings

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('gut gemacht'))).toBe(true);
    });
});

describe('findPeakTimes - Multiple Insights', () => {
    it('should return multiple insights for varied data', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[1][14] = 5;  // Monday at 14:00
        heatmap[2][14] = 3;  // Tuesday at 14:00
        // Other days empty (will have zero-craving insight)

        const insights = findPeakTimes(heatmap);

        expect(insights.length).toBeGreaterThanOrEqual(2);
    });

    it('should include both day and hour insights', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[5][18] = 10; // Friday at 18:00

        const insights = findPeakTimes(heatmap);

        const hasDayInsight = insights.some(i => i.includes('Fr'));
        const hasHourInsight = insights.some(i => i.includes('18:00'));

        expect(hasDayInsight).toBe(true);
        expect(hasHourInsight).toBe(true);
    });
});

describe('Heatmap Data Structure', () => {
    it('should work with 7x24 heatmap array', () => {
        const heatmap = createEmptyHeatmap();

        expect(heatmap.length).toBe(7);
        expect(heatmap[0].length).toBe(24);
    });

    it('should allow setting values at any hour', () => {
        const heatmap = createEmptyHeatmap();

        // Set values at different hours
        heatmap[0][0] = 1;   // Midnight
        heatmap[0][12] = 2;  // Noon
        heatmap[0][23] = 3;  // 11 PM

        expect(heatmap[0][0]).toBe(1);
        expect(heatmap[0][12]).toBe(2);
        expect(heatmap[0][23]).toBe(3);
    });

    it('should calculate day totals correctly', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[1][10] = 2;
        heatmap[1][14] = 3;
        heatmap[1][18] = 1;

        const dayTotal = heatmap[1].reduce((a, b) => a + b, 0);
        expect(dayTotal).toBe(6);
    });
});

describe('Edge Cases', () => {
    it('should handle single craving in heatmap', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[3][15] = 1;

        const insights = findPeakTimes(heatmap);

        expect(insights.length).toBeGreaterThanOrEqual(1);
        expect(insights.some(i => i.includes('Mi'))).toBe(true);
    });

    it('should handle high craving counts', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[4][12] = 100;

        const insights = findPeakTimes(heatmap);

        expect(insights.some(i => i.includes('Do'))).toBe(true);
    });

    it('should handle equal cravings on multiple days', () => {
        const heatmap = createEmptyHeatmap();
        heatmap[1][12] = 5;
        heatmap[2][12] = 5;
        heatmap[3][12] = 5;

        // Should still work without error
        const insights = findPeakTimes(heatmap);
        expect(insights.length).toBeGreaterThanOrEqual(1);
    });
});
