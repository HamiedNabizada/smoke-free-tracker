import { describe, it, expect } from 'vitest';
import { healthMilestones } from '../app/js/data/milestones.js';
import { quitStatistics } from '../app/js/data/motivations.js';

// Find current milestone function from dashboard.js
function findCurrentMilestone(daysPassed) {
    let currentMilestone = null;
    for (let i = 0; i < healthMilestones.length; i++) {
        if (daysPassed >= healthMilestones[i].days) {
            currentMilestone = {
                ...healthMilestones[i],
                id: i
            };
        } else {
            break;
        }
    }
    return currentMilestone;
}

// Find next milestone function
function findNextMilestone(daysPassed) {
    for (const milestone of healthMilestones) {
        if (daysPassed < milestone.days) {
            return milestone;
        }
    }
    return null;
}

// Calculate milestone progress
function calculateMilestoneProgress(daysPassed, nextMilestone) {
    if (!nextMilestone) return 100;
    return (daysPassed / nextMilestone.days) * 100;
}

// Get comparison statistic
function getComparisonStatistic(days) {
    const checkpoints = [365, 180, 90, 30, 7, 3, 1];

    for (const checkpoint of checkpoints) {
        if (days >= checkpoint) {
            return quitStatistics[checkpoint];
        }
    }
    return null;
}

describe('Find Current Milestone', () => {
    it('should return null for 0 days', () => {
        const result = findCurrentMilestone(0);
        expect(result).toBeNull();
    });

    it('should find first milestone after 20 minutes', () => {
        const result = findCurrentMilestone(0.014);
        expect(result).toBeDefined();
        expect(result.title).toBe('20 Minuten');
    });

    it('should find 24 hour milestone after 1 day', () => {
        const result = findCurrentMilestone(1);
        expect(result).toBeDefined();
        expect(result.title).toBe('24 Stunden');
    });

    it('should find 1 week milestone after 7 days', () => {
        const result = findCurrentMilestone(7);
        expect(result).toBeDefined();
        expect(result.title).toBe('1 Woche');
    });

    it('should find 1 month milestone after 30 days', () => {
        const result = findCurrentMilestone(30);
        expect(result).toBeDefined();
        expect(result.title).toBe('1 Monat');
    });

    it('should find 1 year milestone after 365 days', () => {
        const result = findCurrentMilestone(365);
        expect(result).toBeDefined();
        expect(result.title).toBe('1 Jahr');
    });

    it('should include milestone ID', () => {
        const result = findCurrentMilestone(1);
        expect(result.id).toBeDefined();
        expect(typeof result.id).toBe('number');
    });
});

describe('Find Next Milestone', () => {
    it('should find first milestone at day 0', () => {
        const result = findNextMilestone(0);
        expect(result).toBeDefined();
        expect(result.days).toBe(healthMilestones[0].days);
    });

    it('should find 24 hour milestone after 20 minutes', () => {
        const result = findNextMilestone(0.014);
        expect(result).toBeDefined();
        // Next milestone after 20 min (0.014 days)
        expect(result.days).toBeGreaterThan(0.014);
    });

    it('should find milestone after 1 week', () => {
        const result = findNextMilestone(7);
        expect(result).toBeDefined();
        expect(result.days).toBeGreaterThan(7);
    });

    it('should return null after all milestones achieved', () => {
        const result = findNextMilestone(7301); // > 20 years
        expect(result).toBeNull();
    });
});

describe('Calculate Milestone Progress', () => {
    it('should return 0% at start for first milestone', () => {
        const next = findNextMilestone(0);
        const progress = calculateMilestoneProgress(0, next);
        expect(progress).toBe(0);
    });

    it('should return 50% halfway to milestone', () => {
        const next = { days: 10 };
        const progress = calculateMilestoneProgress(5, next);
        expect(progress).toBe(50);
    });

    it('should return 100% when no next milestone', () => {
        const progress = calculateMilestoneProgress(8000, null);
        expect(progress).toBe(100);
    });

    it('should handle fractional progress', () => {
        const next = { days: 30 };
        const progress = calculateMilestoneProgress(10, next);
        expect(progress).toBeCloseTo(33.33, 1);
    });
});

describe('Get Comparison Statistic', () => {
    it('should return null for less than 1 day', () => {
        const result = getComparisonStatistic(0.5);
        expect(result).toBeNull();
    });

    it('should return day 1 statistic after 1 day', () => {
        const result = getComparisonStatistic(1);
        expect(result).toBeDefined();
        expect(result.failRate).toBeDefined();
    });

    it('should return day 3 statistic after 3 days', () => {
        const result = getComparisonStatistic(3);
        expect(result).toBe(quitStatistics[3]);
    });

    it('should return week statistic after 7 days', () => {
        const result = getComparisonStatistic(7);
        expect(result).toBe(quitStatistics[7]);
    });

    it('should return month statistic after 30 days', () => {
        const result = getComparisonStatistic(30);
        expect(result).toBe(quitStatistics[30]);
    });

    it('should return 90 day statistic after 90 days', () => {
        const result = getComparisonStatistic(90);
        expect(result).toBe(quitStatistics[90]);
    });

    it('should return 180 day statistic after 6 months', () => {
        const result = getComparisonStatistic(180);
        expect(result).toBe(quitStatistics[180]);
    });

    it('should return year statistic after 365 days', () => {
        const result = getComparisonStatistic(365);
        expect(result).toBe(quitStatistics[365]);
    });

    it('should return year statistic for values over 365', () => {
        const result = getComparisonStatistic(500);
        expect(result).toBe(quitStatistics[365]);
    });
});

describe('Milestone Progression', () => {
    it('should always have a next milestone until 20 years', () => {
        const testDays = [0, 1, 7, 30, 90, 180, 365, 730, 1825, 3650];

        testDays.forEach(days => {
            const next = findNextMilestone(days);
            expect(next).not.toBeNull();
        });
    });

    it('should have no next milestone after 20 years', () => {
        const result = findNextMilestone(7300);
        expect(result).toBeNull();
    });

    it('should progress through milestones in order', () => {
        let previousDays = -1;

        for (let i = 0; i < 10; i++) {
            const testDays = healthMilestones[i].days;
            const current = findCurrentMilestone(testDays);

            expect(current).toBeDefined();
            expect(current.days).toBeGreaterThan(previousDays);
            previousDays = current.days;
        }
    });
});

describe('Life Gained Display Logic', () => {
    function formatLifeDisplay(lifeGained) {
        if (lifeGained.days > 0) {
            return `${lifeGained.days}d ${lifeGained.hours}h`;
        } else {
            return `${lifeGained.totalHours}h`;
        }
    }

    it('should show hours when less than 1 day', () => {
        const result = formatLifeDisplay({ days: 0, hours: 5, totalHours: 5 });
        expect(result).toBe('5h');
    });

    it('should show days and hours when 1+ days', () => {
        const result = formatLifeDisplay({ days: 2, hours: 12, totalHours: 60 });
        expect(result).toBe('2d 12h');
    });

    it('should handle exactly 1 day', () => {
        const result = formatLifeDisplay({ days: 1, hours: 0, totalHours: 24 });
        expect(result).toBe('1d 0h');
    });
});

describe('Time Saved Display Logic', () => {
    function formatTimeSavedDisplay(timeSaved) {
        if (timeSaved.days > 0) {
            return `${timeSaved.days}d ${timeSaved.hours}h`;
        } else if (timeSaved.totalHours > 0) {
            return `${timeSaved.totalHours}h`;
        } else {
            return `${timeSaved.totalMinutes}m`;
        }
    }

    it('should show minutes when less than 1 hour', () => {
        const result = formatTimeSavedDisplay({ days: 0, hours: 0, totalHours: 0, totalMinutes: 30 });
        expect(result).toBe('30m');
    });

    it('should show hours when less than 1 day', () => {
        const result = formatTimeSavedDisplay({ days: 0, hours: 5, totalHours: 5, totalMinutes: 300 });
        expect(result).toBe('5h');
    });

    it('should show days and hours when 1+ days', () => {
        const result = formatTimeSavedDisplay({ days: 2, hours: 12, totalHours: 60, totalMinutes: 3600 });
        expect(result).toBe('2d 12h');
    });
});
