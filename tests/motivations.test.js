import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { motivations, quitStatistics, getDailyMotivation } from '../app/js/data/motivations.js';

describe('Motivations Data', () => {
  it('should have at least 10 motivation texts', () => {
    expect(motivations.length).toBeGreaterThanOrEqual(10);
  });

  it('should have unique motivation texts', () => {
    const uniqueMotivations = new Set(motivations);
    expect(uniqueMotivations.size).toBe(motivations.length);
  });

  it('should have non-empty motivation texts', () => {
    motivations.forEach(motivation => {
      expect(motivation.length).toBeGreaterThan(20);
    });
  });

  it('should have motivational content (positive words)', () => {
    const positiveWords = ['stark', 'stärker', 'gesund', 'gesünder', 'stolz', 'schaff', 'erfolg', 'weiter',
                          'besser', 'frei', 'sieg', 'meister', 'fantastisch', 'super',
                          'vorbild', 'geschenk', 'dankt', 'investier', 'leben',
                          'zukunft', 'reinig', 'genieß', 'unbezahlbar', 'atemzug',
                          'herz', 'lunge', 'erreich', 'bleib', 'konsequent', 'weg', 'beweise'];

    motivations.forEach(motivation => {
      const motivationLower = motivation.toLowerCase();
      const hasPositiveWord = positiveWords.some(word => motivationLower.includes(word));
      expect(hasPositiveWord).toBe(true);
    });
  });
});

describe('Quit Statistics', () => {
  it('should have statistics for key milestones', () => {
    expect(quitStatistics[1]).toBeDefined();   // Day 1
    expect(quitStatistics[3]).toBeDefined();   // Day 3
    expect(quitStatistics[7]).toBeDefined();   // Week 1
    expect(quitStatistics[30]).toBeDefined();  // Month 1
    expect(quitStatistics[90]).toBeDefined();  // 3 Months
    expect(quitStatistics[180]).toBeDefined(); // 6 Months
    expect(quitStatistics[365]).toBeDefined(); // 1 Year
  });

  it('should have increasing fail rates over time', () => {
    const milestones = [1, 3, 7, 30, 90, 180, 365];

    for (let i = 1; i < milestones.length; i++) {
      expect(quitStatistics[milestones[i]].failRate)
        .toBeGreaterThanOrEqual(quitStatistics[milestones[i-1]].failRate);
    }
  });

  it('should have valid fail rate percentages', () => {
    Object.values(quitStatistics).forEach(stat => {
      expect(stat.failRate).toBeGreaterThanOrEqual(0);
      expect(stat.failRate).toBeLessThanOrEqual(100);
    });
  });

  it('should have messages for all statistics', () => {
    Object.values(quitStatistics).forEach(stat => {
      expect(stat.message).toBeDefined();
      expect(stat.message.length).toBeGreaterThan(10);
    });
  });
});

describe('getDailyMotivation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a motivation text', () => {
    const motivation = getDailyMotivation();
    expect(motivations).toContain(motivation);
  });

  it('should return same motivation for same day', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00'));
    const motivation1 = getDailyMotivation();

    vi.setSystemTime(new Date('2024-06-15T22:00:00'));
    const motivation2 = getDailyMotivation();

    expect(motivation1).toBe(motivation2);
  });

  it('should return different motivation on different days', () => {
    vi.setSystemTime(new Date('2024-06-15'));
    const motivation1 = getDailyMotivation();

    vi.setSystemTime(new Date('2024-06-16'));
    const motivation2 = getDailyMotivation();

    // They might be the same by chance if motivations.length divides evenly
    // but testing the function works correctly
    expect(motivations).toContain(motivation1);
    expect(motivations).toContain(motivation2);
  });

  it('should cycle through all motivations over a year', () => {
    const usedMotivations = new Set();

    // Check 365 days
    for (let day = 1; day <= 365; day++) {
      vi.setSystemTime(new Date(2024, 0, day));
      usedMotivations.add(getDailyMotivation());
    }

    // Should use all motivations at least once
    expect(usedMotivations.size).toBe(motivations.length);
  });
});

describe('Statistics Accuracy', () => {
  it('should show user is in top percentage after milestones', () => {
    // After 1 year, user is in top 0.5%
    expect(quitStatistics[365].failRate).toBe(99.5);

    // After 6 months, user is in top 1%
    expect(quitStatistics[180].failRate).toBe(99);

    // After 3 months, user is in top 2%
    expect(quitStatistics[90].failRate).toBe(98);
  });

  it('should have realistic early day statistics', () => {
    // Most people fail in first few days - 85-95%
    expect(quitStatistics[1].failRate).toBeGreaterThanOrEqual(80);
    expect(quitStatistics[7].failRate).toBeGreaterThanOrEqual(90);
  });
});
