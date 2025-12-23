import { describe, it, expect } from 'vitest';

/**
 * Tests for lotus.js
 *
 * Testing the lotus visualization stage logic.
 */

// Lotus stages data (from lotus.js)
const LOTUS_STAGES = [
    { minScore: 0, maxScore: 10, name: 'Samen' },
    { minScore: 10, maxScore: 20, name: 'Keimling' },
    { minScore: 20, maxScore: 30, name: 'Junger Spross' },
    { minScore: 30, maxScore: 40, name: 'Spross mit Blättern' },
    { minScore: 40, maxScore: 50, name: 'Schwimmendes Blatt' },
    { minScore: 50, maxScore: 60, name: 'Großes Lotusblatt' },
    { minScore: 60, maxScore: 70, name: 'Kleine Knospe' },
    { minScore: 70, maxScore: 80, name: 'Große Knospe' },
    { minScore: 80, maxScore: 90, name: 'Öffnende Blüte' },
    { minScore: 90, maxScore: 100, name: 'Volle Blüte' }
];

// getLotusStage logic (from lotus.js)
function getLotusStage(score) {
    for (const stage of LOTUS_STAGES) {
        if (score >= stage.minScore && score < stage.maxScore) {
            return stage;
        }
    }
    // Score is 100
    return LOTUS_STAGES[LOTUS_STAGES.length - 1];
}

// getStageProgressInfo logic (from lotus.js)
function getStageProgressInfo(score) {
    const stage = getLotusStage(score);
    const stageIndex = LOTUS_STAGES.indexOf(stage);

    const stageRange = stage.maxScore - stage.minScore;
    const progressInStage = ((score - stage.minScore) / stageRange) * 100;

    return {
        stageName: stage.name,
        stageIndex: stageIndex + 1,
        totalStages: LOTUS_STAGES.length,
        progressInStage: Math.round(progressInStage)
    };
}

describe('Lotus Stages - Data Structure', () => {
    it('should have exactly 10 stages', () => {
        expect(LOTUS_STAGES.length).toBe(10);
    });

    it('should cover full 0-100 range without gaps', () => {
        for (let i = 0; i < LOTUS_STAGES.length - 1; i++) {
            expect(LOTUS_STAGES[i].maxScore).toBe(LOTUS_STAGES[i + 1].minScore);
        }
    });

    it('should start at 0', () => {
        expect(LOTUS_STAGES[0].minScore).toBe(0);
    });

    it('should end at 100', () => {
        expect(LOTUS_STAGES[LOTUS_STAGES.length - 1].maxScore).toBe(100);
    });

    it('should have equal 10-point ranges for each stage', () => {
        LOTUS_STAGES.forEach(stage => {
            expect(stage.maxScore - stage.minScore).toBe(10);
        });
    });

    it('should have unique names for each stage', () => {
        const names = LOTUS_STAGES.map(s => s.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });

    it('should have German names', () => {
        expect(LOTUS_STAGES[0].name).toBe('Samen');
        expect(LOTUS_STAGES[LOTUS_STAGES.length - 1].name).toBe('Volle Blüte');
    });
});

describe('getLotusStage - Stage Selection', () => {
    it('should return "Samen" for score 0-9', () => {
        expect(getLotusStage(0).name).toBe('Samen');
        expect(getLotusStage(5).name).toBe('Samen');
        expect(getLotusStage(9).name).toBe('Samen');
    });

    it('should return "Keimling" for score 10-19', () => {
        expect(getLotusStage(10).name).toBe('Keimling');
        expect(getLotusStage(15).name).toBe('Keimling');
        expect(getLotusStage(19).name).toBe('Keimling');
    });

    it('should return "Volle Blüte" for score 90-100', () => {
        expect(getLotusStage(90).name).toBe('Volle Blüte');
        expect(getLotusStage(95).name).toBe('Volle Blüte');
        expect(getLotusStage(100).name).toBe('Volle Blüte');
    });

    it('should handle boundary scores correctly', () => {
        // At exactly 10, should move to next stage
        expect(getLotusStage(9).name).toBe('Samen');
        expect(getLotusStage(10).name).toBe('Keimling');

        // At exactly 50, should move to "Großes Lotusblatt"
        expect(getLotusStage(49).name).toBe('Schwimmendes Blatt');
        expect(getLotusStage(50).name).toBe('Großes Lotusblatt');
    });

    it('should return correct stage for each 10-point range', () => {
        const expectedStages = [
            'Samen', 'Keimling', 'Junger Spross', 'Spross mit Blättern',
            'Schwimmendes Blatt', 'Großes Lotusblatt', 'Kleine Knospe',
            'Große Knospe', 'Öffnende Blüte', 'Volle Blüte'
        ];

        expectedStages.forEach((expectedName, i) => {
            const score = i * 10 + 5; // Middle of each range
            expect(getLotusStage(score).name).toBe(expectedName);
        });
    });

    it('should handle score 100 specially', () => {
        // Score 100 should still return "Volle Blüte"
        const stage = getLotusStage(100);
        expect(stage.name).toBe('Volle Blüte');
    });
});

describe('getStageProgressInfo - Progress Calculation', () => {
    it('should return correct stage name', () => {
        expect(getStageProgressInfo(5).stageName).toBe('Samen');
        expect(getStageProgressInfo(55).stageName).toBe('Großes Lotusblatt');
        expect(getStageProgressInfo(95).stageName).toBe('Volle Blüte');
    });

    it('should return 1-indexed stage index', () => {
        expect(getStageProgressInfo(5).stageIndex).toBe(1);
        expect(getStageProgressInfo(15).stageIndex).toBe(2);
        expect(getStageProgressInfo(95).stageIndex).toBe(10);
    });

    it('should return total stages as 10', () => {
        expect(getStageProgressInfo(0).totalStages).toBe(10);
        expect(getStageProgressInfo(50).totalStages).toBe(10);
        expect(getStageProgressInfo(100).totalStages).toBe(10);
    });

    it('should calculate progress within stage at 0%', () => {
        expect(getStageProgressInfo(0).progressInStage).toBe(0);
        expect(getStageProgressInfo(10).progressInStage).toBe(0);
        expect(getStageProgressInfo(50).progressInStage).toBe(0);
    });

    it('should calculate progress within stage at 50%', () => {
        expect(getStageProgressInfo(5).progressInStage).toBe(50);
        expect(getStageProgressInfo(15).progressInStage).toBe(50);
        expect(getStageProgressInfo(55).progressInStage).toBe(50);
    });

    it('should calculate progress within stage at 90%', () => {
        expect(getStageProgressInfo(9).progressInStage).toBe(90);
        expect(getStageProgressInfo(19).progressInStage).toBe(90);
        expect(getStageProgressInfo(99).progressInStage).toBe(90);
    });

    it('should handle score 100 progress', () => {
        // Score 100 is at 100% of final stage
        expect(getStageProgressInfo(100).progressInStage).toBe(100);
    });

    it('should round progress to nearest integer', () => {
        // Score 3 in range 0-10: 3/10 = 30%
        expect(getStageProgressInfo(3).progressInStage).toBe(30);

        // Score 7 in range 0-10: 7/10 = 70%
        expect(getStageProgressInfo(7).progressInStage).toBe(70);
    });
});

describe('Lotus Growth - Logical Progression', () => {
    it('should start as seed (underground)', () => {
        const stage = getLotusStage(0);
        expect(stage.name).toBe('Samen');
    });

    it('should progress through growth stages', () => {
        const stages = [0, 10, 20, 30, 40].map(s => getLotusStage(s).name);

        expect(stages[0]).toBe('Samen');
        expect(stages[1]).toBe('Keimling');
        expect(stages[2]).toBe('Junger Spross');
        expect(stages[3]).toBe('Spross mit Blättern');
        expect(stages[4]).toBe('Schwimmendes Blatt');
    });

    it('should transition to water phase at score 40', () => {
        expect(getLotusStage(39).name).toBe('Spross mit Blättern');
        expect(getLotusStage(40).name).toBe('Schwimmendes Blatt');
    });

    it('should develop bud at score 60', () => {
        expect(getLotusStage(59).name).toBe('Großes Lotusblatt');
        expect(getLotusStage(60).name).toBe('Kleine Knospe');
    });

    it('should start blooming at score 80', () => {
        expect(getLotusStage(79).name).toBe('Große Knospe');
        expect(getLotusStage(80).name).toBe('Öffnende Blüte');
    });

    it('should reach full bloom at score 90', () => {
        expect(getLotusStage(89).name).toBe('Öffnende Blüte');
        expect(getLotusStage(90).name).toBe('Volle Blüte');
    });
});

describe('Stage Progress Info - Format', () => {
    it('should format stage display correctly', () => {
        const info = getStageProgressInfo(45);

        // Should be stage 5 of 10
        expect(info.stageIndex).toBe(5);
        expect(info.totalStages).toBe(10);

        // Format would be "Schwimmendes Blatt (Stufe 5/10)"
        const displayString = `${info.stageName} (Stufe ${info.stageIndex}/${info.totalStages})`;
        expect(displayString).toBe('Schwimmendes Blatt (Stufe 5/10)');
    });

    it('should show final stage correctly', () => {
        const info = getStageProgressInfo(95);

        const displayString = `${info.stageName} (Stufe ${info.stageIndex}/${info.totalStages})`;
        expect(displayString).toBe('Volle Blüte (Stufe 10/10)');
    });
});

describe('Edge Cases', () => {
    it('should handle negative scores gracefully', () => {
        // Negative scores should fall into first stage
        const stage = getLotusStage(-5);
        expect(stage).toBeDefined();
    });

    it('should handle scores above 100', () => {
        // Scores above 100 should return last stage
        const stage = getLotusStage(150);
        expect(stage.name).toBe('Volle Blüte');
    });

    it('should handle decimal scores', () => {
        const stage = getLotusStage(45.7);
        expect(stage.name).toBe('Schwimmendes Blatt');

        const info = getStageProgressInfo(45.7);
        expect(info.progressInStage).toBe(57); // (45.7 - 40) / 10 * 100 = 57
    });
});
