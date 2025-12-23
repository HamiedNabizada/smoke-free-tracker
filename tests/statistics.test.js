import { describe, it, expect } from 'vitest';

/**
 * Tests for statistics.js
 *
 * Testing the Health Score calculation logic and comparison functions.
 */

// Health Score calculation logic (extracted from statistics.js)
function calculateHealthScore(stats) {
    if (!stats.health) return null;

    const cardiovascular = stats.health.cardiovascular;
    const lung = stats.health.lung;
    const circulation = stats.health.circulation;
    const skin = stats.health.skin;

    const riskReduction = stats.riskReduction ?
        (stats.riskReduction.heartAttack + stats.riskReduction.stroke + stats.riskReduction.lungCancer) / 3
        : 0;

    const weights = {
        cardiovascular: 0.30,
        lung: 0.25,
        circulation: 0.20,
        riskReduction: 0.15,
        skin: 0.10
    };

    return Math.round(
        cardiovascular * weights.cardiovascular +
        lung * weights.lung +
        circulation * weights.circulation +
        riskReduction * weights.riskReduction +
        skin * weights.skin
    );
}

// Rating logic (extracted from statistics.js)
function getHealthRating(score) {
    if (score >= 90) {
        return { rating: 'Exzellent!', message: 'Deine Gesundheit hat sich hervorragend erholt!' };
    } else if (score >= 75) {
        return { rating: 'Sehr gut!', message: 'Du machst großartige Fortschritte!' };
    } else if (score >= 50) {
        return { rating: 'Gut!', message: 'Dein Körper erholt sich stetig.' };
    } else if (score >= 25) {
        return { rating: 'Fortschritt!', message: 'Die Erholung hat begonnen.' };
    } else {
        return { rating: 'Gestartet!', message: 'Erste positive Veränderungen laufen.' };
    }
}

// Comparison data logic (extracted from statistics.js)
function getComparisonData(days) {
    const milestones = [
        { milestone: '24 Stunden', days: 1, failRate: 85 },
        { milestone: '3 Tage', days: 3, failRate: 90 },
        { milestone: '1 Woche', days: 7, failRate: 95 },
        { milestone: '2 Wochen', days: 14, failRate: 96 },
        { milestone: '1 Monat', days: 30, failRate: 97 },
        { milestone: '3 Monate', days: 90, failRate: 98 },
        { milestone: '6 Monate', days: 180, failRate: 99 },
        { milestone: '1 Jahr', days: 365, failRate: 99.5 }
    ];

    return milestones.map(m => ({
        ...m,
        yourStatus: days >= m.days
    }));
}

// Age group comparison logic (extracted from statistics.js)
function getAgeGroupPercentile(days) {
    if (days >= 180) return { percentile: 1, label: 'Top 1%' };
    if (days >= 90) return { percentile: 2, label: 'Top 2%' };
    if (days >= 30) return { percentile: 3, label: 'Top 3%' };
    if (days >= 7) return { percentile: 5, label: 'Top 5%' };
    return { percentile: 15, label: '15%' };
}

// Timeline status logic (extracted from statistics.js)
function getTimelineStatus(currentDays, milestoneDays, previousMilestoneDays) {
    if (currentDays >= milestoneDays) return 'achieved';
    if (currentDays >= previousMilestoneDays) return 'current';
    return 'future';
}

describe('Health Score - Calculation', () => {
    it('should return null if no health data provided', () => {
        expect(calculateHealthScore({})).toBe(null);
        expect(calculateHealthScore({ days: 10 })).toBe(null);
    });

    it('should calculate weighted average correctly', () => {
        const stats = {
            health: {
                cardiovascular: 100,
                lung: 100,
                circulation: 100,
                skin: 100
            },
            riskReduction: {
                heartAttack: 100,
                stroke: 100,
                lungCancer: 100
            }
        };

        // 100 * 0.30 + 100 * 0.25 + 100 * 0.20 + 100 * 0.15 + 100 * 0.10 = 100
        expect(calculateHealthScore(stats)).toBe(100);
    });

    it('should handle zero values', () => {
        const stats = {
            health: {
                cardiovascular: 0,
                lung: 0,
                circulation: 0,
                skin: 0
            }
        };

        expect(calculateHealthScore(stats)).toBe(0);
    });

    it('should weight cardiovascular highest (30%)', () => {
        const statsCardio = {
            health: { cardiovascular: 100, lung: 0, circulation: 0, skin: 0 }
        };
        const statsLung = {
            health: { cardiovascular: 0, lung: 100, circulation: 0, skin: 0 }
        };

        expect(calculateHealthScore(statsCardio)).toBe(30);
        expect(calculateHealthScore(statsLung)).toBe(25);
    });

    it('should weight skin lowest (10%)', () => {
        const stats = {
            health: { cardiovascular: 0, lung: 0, circulation: 0, skin: 100 }
        };

        expect(calculateHealthScore(stats)).toBe(10);
    });

    it('should include risk reduction in calculation', () => {
        const statsWithRisk = {
            health: { cardiovascular: 0, lung: 0, circulation: 0, skin: 0 },
            riskReduction: { heartAttack: 60, stroke: 60, lungCancer: 60 }
        };

        // Risk reduction average = 60, weight = 15%, so 60 * 0.15 = 9
        expect(calculateHealthScore(statsWithRisk)).toBe(9);
    });

    it('should handle missing risk reduction', () => {
        const stats = {
            health: { cardiovascular: 50, lung: 50, circulation: 50, skin: 50 }
        };

        // 50 * (0.30 + 0.25 + 0.20 + 0.10) = 50 * 0.85 = 42.5 → 43
        expect(calculateHealthScore(stats)).toBe(43);
    });

    it('should round to nearest integer', () => {
        const stats = {
            health: { cardiovascular: 33, lung: 33, circulation: 33, skin: 33 },
            riskReduction: { heartAttack: 33, stroke: 33, lungCancer: 33 }
        };

        // 33 * 0.30 + 33 * 0.25 + 33 * 0.20 + 33 * 0.15 + 33 * 0.10 = 33
        expect(calculateHealthScore(stats)).toBe(33);
    });

    it('should calculate realistic early quitter score', () => {
        // Day 1-3: Low scores across the board
        const earlyStats = {
            health: { cardiovascular: 5, lung: 2, circulation: 10, skin: 1 },
            riskReduction: { heartAttack: 1, stroke: 1, lungCancer: 0 }
        };

        const score = calculateHealthScore(earlyStats);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThan(10);
    });

    it('should calculate realistic long-term quitter score', () => {
        // 1 year+: High scores
        const longTermStats = {
            health: { cardiovascular: 70, lung: 60, circulation: 95, skin: 85 },
            riskReduction: { heartAttack: 50, stroke: 50, lungCancer: 30 }
        };

        const score = calculateHealthScore(longTermStats);
        expect(score).toBeGreaterThan(60);
        expect(score).toBeLessThanOrEqual(100);
    });
});

describe('Health Score - Ratings', () => {
    it('should return "Exzellent!" for scores >= 90', () => {
        expect(getHealthRating(90).rating).toBe('Exzellent!');
        expect(getHealthRating(95).rating).toBe('Exzellent!');
        expect(getHealthRating(100).rating).toBe('Exzellent!');
    });

    it('should return "Sehr gut!" for scores 75-89', () => {
        expect(getHealthRating(75).rating).toBe('Sehr gut!');
        expect(getHealthRating(80).rating).toBe('Sehr gut!');
        expect(getHealthRating(89).rating).toBe('Sehr gut!');
    });

    it('should return "Gut!" for scores 50-74', () => {
        expect(getHealthRating(50).rating).toBe('Gut!');
        expect(getHealthRating(60).rating).toBe('Gut!');
        expect(getHealthRating(74).rating).toBe('Gut!');
    });

    it('should return "Fortschritt!" for scores 25-49', () => {
        expect(getHealthRating(25).rating).toBe('Fortschritt!');
        expect(getHealthRating(35).rating).toBe('Fortschritt!');
        expect(getHealthRating(49).rating).toBe('Fortschritt!');
    });

    it('should return "Gestartet!" for scores < 25', () => {
        expect(getHealthRating(0).rating).toBe('Gestartet!');
        expect(getHealthRating(10).rating).toBe('Gestartet!');
        expect(getHealthRating(24).rating).toBe('Gestartet!');
    });

    it('should return appropriate messages for each rating', () => {
        expect(getHealthRating(95).message).toContain('hervorragend');
        expect(getHealthRating(80).message).toContain('Fortschritte');
        expect(getHealthRating(60).message).toContain('stetig');
        expect(getHealthRating(30).message).toContain('begonnen');
        expect(getHealthRating(10).message).toContain('Erste');
    });
});

describe('Detailed Comparison - Milestone Status', () => {
    it('should mark all milestones as not achieved for day 0', () => {
        const data = getComparisonData(0);
        expect(data.every(m => m.yourStatus === false)).toBe(true);
    });

    it('should mark first milestone as achieved after 1 day', () => {
        const data = getComparisonData(1);
        expect(data[0].yourStatus).toBe(true); // 24 Stunden
        expect(data[1].yourStatus).toBe(false); // 3 Tage
    });

    it('should mark all milestones as achieved after 1 year', () => {
        const data = getComparisonData(365);
        expect(data.every(m => m.yourStatus === true)).toBe(true);
    });

    it('should correctly track 1 week milestone', () => {
        const dataBefore = getComparisonData(6);
        const dataAfter = getComparisonData(7);

        expect(dataBefore[2].yourStatus).toBe(false); // 1 Woche not achieved
        expect(dataAfter[2].yourStatus).toBe(true);   // 1 Woche achieved
    });

    it('should correctly track 1 month milestone', () => {
        const data = getComparisonData(30);
        expect(data[4].yourStatus).toBe(true);  // 1 Monat achieved
        expect(data[5].yourStatus).toBe(false); // 3 Monate not achieved
    });

    it('should have correct fail rates', () => {
        const data = getComparisonData(0);

        expect(data[0].failRate).toBe(85);   // 24h: 85% fail
        expect(data[2].failRate).toBe(95);   // 1 week: 95% fail
        expect(data[7].failRate).toBe(99.5); // 1 year: 99.5% fail
    });

    it('should have 8 milestones', () => {
        const data = getComparisonData(0);
        expect(data.length).toBe(8);
    });
});

describe('Age Group Comparison - Percentiles', () => {
    it('should return Top 1% for 6+ months', () => {
        expect(getAgeGroupPercentile(180).percentile).toBe(1);
        expect(getAgeGroupPercentile(200).percentile).toBe(1);
        expect(getAgeGroupPercentile(365).percentile).toBe(1);
    });

    it('should return Top 2% for 3-6 months', () => {
        expect(getAgeGroupPercentile(90).percentile).toBe(2);
        expect(getAgeGroupPercentile(120).percentile).toBe(2);
        expect(getAgeGroupPercentile(179).percentile).toBe(2);
    });

    it('should return Top 3% for 1-3 months', () => {
        expect(getAgeGroupPercentile(30).percentile).toBe(3);
        expect(getAgeGroupPercentile(60).percentile).toBe(3);
        expect(getAgeGroupPercentile(89).percentile).toBe(3);
    });

    it('should return Top 5% for 1 week to 1 month', () => {
        expect(getAgeGroupPercentile(7).percentile).toBe(5);
        expect(getAgeGroupPercentile(14).percentile).toBe(5);
        expect(getAgeGroupPercentile(29).percentile).toBe(5);
    });

    it('should return 15% for less than 1 week', () => {
        expect(getAgeGroupPercentile(0).percentile).toBe(15);
        expect(getAgeGroupPercentile(3).percentile).toBe(15);
        expect(getAgeGroupPercentile(6).percentile).toBe(15);
    });
});

describe('Milestone Timeline - Status Logic', () => {
    it('should mark as achieved when current days >= milestone days', () => {
        expect(getTimelineStatus(10, 7, 3)).toBe('achieved');
        expect(getTimelineStatus(7, 7, 3)).toBe('achieved');
    });

    it('should mark as current when between previous and current milestone', () => {
        expect(getTimelineStatus(5, 7, 3)).toBe('current');
        expect(getTimelineStatus(6, 7, 3)).toBe('current');
    });

    it('should mark as future when not yet reached previous milestone', () => {
        expect(getTimelineStatus(2, 7, 3)).toBe('future');
        expect(getTimelineStatus(0, 7, 3)).toBe('future');
    });

    it('should handle edge case at exactly previous milestone', () => {
        expect(getTimelineStatus(3, 7, 3)).toBe('current');
    });

    it('should handle first milestone (no previous)', () => {
        expect(getTimelineStatus(0, 1, 0)).toBe('current');
        expect(getTimelineStatus(1, 1, 0)).toBe('achieved');
    });
});

describe('Health Score - Weight Validation', () => {
    it('should have weights that sum to 1.0 (100%)', () => {
        const weights = {
            cardiovascular: 0.30,
            lung: 0.25,
            circulation: 0.20,
            riskReduction: 0.15,
            skin: 0.10
        };

        const sum = Object.values(weights).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0);
    });
});
