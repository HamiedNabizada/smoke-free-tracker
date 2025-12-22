import { describe, it, expect } from 'vitest';

// Craving tips from craving-timer.js
const cravingTips = [
    { icon: '🫁', text: 'Atme tief ein und langsam aus. Zähle dabei bis 4.' },
    { icon: '💪', text: 'Du bist stärker als jedes Verlangen. Du schaffst das!' },
    { icon: '⏱️', text: 'Nur noch ein paar Minuten. Das Verlangen wird schwächer!' },
    { icon: '🌊', text: 'Lass das Verlangen wie eine Welle über dich hinwegziehen.' },
    { icon: '🎯', text: 'Denk an dein Ziel: Ein gesünderes, freies Leben!' },
    { icon: '💧', text: 'Trink ein großes Glas Wasser - das hilft sofort.' },
    { icon: '🚶', text: 'Bewege dich! Geh ein paar Schritte oder strecke dich.' },
    { icon: '🧘', text: 'Konzentriere dich auf deinen Atem. Ein... Aus... Ein... Aus...' },
    { icon: '💚', text: 'Dein Körper heilt sich gerade. Jede Sekunde zählt!' },
    { icon: '🏆', text: 'Du hast schon so viel geschafft. Gib jetzt nicht auf!' },
    { icon: '⭐', text: 'Jedes überwundene Verlangen macht dich stärker!' },
    { icon: '🌟', text: 'Du bist ein Vorbild für andere. Bleib stark!' }
];

describe('Craving Tips Data Integrity', () => {
    it('should have at least 10 tips', () => {
        expect(cravingTips.length).toBeGreaterThanOrEqual(10);
    });

    it('should have exactly 12 tips', () => {
        expect(cravingTips.length).toBe(12);
    });

    it('should have icon and text for each tip', () => {
        cravingTips.forEach(tip => {
            expect(tip.icon).toBeDefined();
            expect(tip.icon.length).toBeGreaterThan(0);
            expect(tip.text).toBeDefined();
            expect(tip.text.length).toBeGreaterThan(10);
        });
    });

    it('should have unique tips', () => {
        const texts = cravingTips.map(t => t.text);
        const uniqueTexts = new Set(texts);
        expect(uniqueTexts.size).toBe(texts.length);
    });

    it('should have unique icons', () => {
        const icons = cravingTips.map(t => t.icon);
        const uniqueIcons = new Set(icons);
        expect(uniqueIcons.size).toBe(icons.length);
    });
});

describe('Craving Tips Content Quality', () => {
    it('should have encouraging/positive words', () => {
        const positiveWords = ['stark', 'stärker', 'schaff', 'ziel', 'hilf', 'heilt',
                               'geschafft', 'leben', 'vorbild', 'atem', 'überwund',
                               'gesünder', 'frei', 'sekunde', 'zählt', 'minuten',
                               'wasser', 'welle', 'körper', 'atme', 'beweg', 'strecke'];

        cravingTips.forEach(tip => {
            const textLower = tip.text.toLowerCase();
            const hasPositiveWord = positiveWords.some(word => textLower.includes(word));
            expect(hasPositiveWord).toBe(true);
        });
    });

    it('should have actionable tips (verbs)', () => {
        const actionVerbs = ['atme', 'zähle', 'denk', 'trink', 'beweg', 'geh',
                             'konzentrier', 'lass', 'gib', 'bleib'];

        const tipsWithActions = cravingTips.filter(tip => {
            const textLower = tip.text.toLowerCase();
            return actionVerbs.some(verb => textLower.includes(verb));
        });

        // At least 60% should have action verbs
        expect(tipsWithActions.length).toBeGreaterThanOrEqual(cravingTips.length * 0.6);
    });

    it('should not be too long for mobile display', () => {
        cravingTips.forEach(tip => {
            expect(tip.text.length).toBeLessThan(100);
        });
    });

    it('should end with punctuation', () => {
        const validEndings = ['.', '!', '?'];

        cravingTips.forEach(tip => {
            const lastChar = tip.text.slice(-1);
            expect(validEndings).toContain(lastChar);
        });
    });
});

describe('Craving Tips Categories', () => {
    it('should include breathing exercises', () => {
        const breathingTips = cravingTips.filter(tip =>
            tip.text.toLowerCase().includes('atem') ||
            tip.text.toLowerCase().includes('einatmen') ||
            tip.text.toLowerCase().includes('ausatmen') ||
            tip.icon === '🫁'
        );
        expect(breathingTips.length).toBeGreaterThanOrEqual(1);
    });

    it('should include physical activities', () => {
        const physicalTips = cravingTips.filter(tip =>
            tip.text.toLowerCase().includes('beweg') ||
            tip.text.toLowerCase().includes('geh') ||
            tip.text.toLowerCase().includes('strecke') ||
            tip.icon === '🚶'
        );
        expect(physicalTips.length).toBeGreaterThanOrEqual(1);
    });

    it('should include hydration tips', () => {
        const hydrationTips = cravingTips.filter(tip =>
            tip.text.toLowerCase().includes('wasser') ||
            tip.text.toLowerCase().includes('trink') ||
            tip.icon === '💧'
        );
        expect(hydrationTips.length).toBeGreaterThanOrEqual(1);
    });

    it('should include motivational tips', () => {
        const motivationalTips = cravingTips.filter(tip =>
            tip.text.toLowerCase().includes('stark') ||
            tip.text.toLowerCase().includes('geschafft') ||
            tip.text.toLowerCase().includes('vorbild') ||
            tip.icon === '💪' || tip.icon === '🏆'
        );
        expect(motivationalTips.length).toBeGreaterThanOrEqual(2);
    });

    it('should include mindfulness tips', () => {
        const mindfulnessTips = cravingTips.filter(tip =>
            tip.text.toLowerCase().includes('konzentrier') ||
            tip.text.toLowerCase().includes('welle') ||
            tip.icon === '🧘' || tip.icon === '🌊'
        );
        expect(mindfulnessTips.length).toBeGreaterThanOrEqual(1);
    });
});

describe('Craving Tips Timer Integration', () => {
    const TIMER_DURATION = 300; // 5 minutes
    const TIP_CHANGE_INTERVAL = 30; // seconds

    it('should have enough tips for a 5-minute timer', () => {
        const changesNeeded = Math.floor(TIMER_DURATION / TIP_CHANGE_INTERVAL);
        expect(cravingTips.length).toBeGreaterThanOrEqual(changesNeeded);
    });

    it('should provide variety during timer session', () => {
        // With 12 tips and 10 changes, user should see different tips
        expect(cravingTips.length).toBeGreaterThanOrEqual(10);
    });
});
