import { describe, it, expect } from 'vitest';
import { achievements } from '../app/js/data/achievements.js';

// Helper function that mirrors the unlock logic from ui/achievements.js
function isAchievementUnlocked(achievement, stats) {
  switch (achievement.type) {
    case 'money':
      return stats.money >= achievement.threshold;
    case 'cigarettes':
      return stats.cigarettes >= achievement.threshold;
    case 'lifeHours':
      return stats.lifeGained.totalHours >= achievement.threshold;
    case 'lungHealth':
      return stats.lungHealth >= achievement.threshold;
    case 'water':
      return stats.waterSaved >= achievement.threshold;
    case 'co2':
      return stats.co2Avoided >= achievement.threshold;
    case 'timeSaved':
      return stats.timeSaved.totalHours >= achievement.threshold;
    default:
      return stats.days >= achievement.days;
  }
}

describe('Achievements Data Integrity', () => {
  it('should have all required fields for day-based achievements', () => {
    const dayAchievements = achievements.filter(a => !a.type);

    dayAchievements.forEach(achievement => {
      expect(achievement.id).toBeDefined();
      expect(achievement.icon).toBeDefined();
      expect(achievement.title).toBeDefined();
      expect(achievement.description).toBeDefined();
      expect(achievement.days).toBeDefined();
      expect(achievement.days).toBeGreaterThan(0);
    });
  });

  it('should have all required fields for threshold-based achievements', () => {
    const thresholdAchievements = achievements.filter(a => a.type);

    thresholdAchievements.forEach(achievement => {
      expect(achievement.id).toBeDefined();
      expect(achievement.icon).toBeDefined();
      expect(achievement.title).toBeDefined();
      expect(achievement.description).toBeDefined();
      expect(achievement.threshold).toBeDefined();
      expect(achievement.threshold).toBeGreaterThan(0);
      expect(achievement.type).toBeDefined();
    });
  });

  it('should have unique IDs for all achievements', () => {
    const ids = achievements.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid achievement types', () => {
    const validTypes = ['money', 'cigarettes', 'lifeHours', 'lungHealth', 'water', 'co2', 'timeSaved', undefined];

    achievements.forEach(achievement => {
      expect(validTypes).toContain(achievement.type);
    });
  });

  it('should have day-based achievements sorted by days', () => {
    const dayAchievements = achievements.filter(a => !a.type);

    for (let i = 1; i < dayAchievements.length; i++) {
      expect(dayAchievements[i].days).toBeGreaterThanOrEqual(dayAchievements[i-1].days);
    }
  });

  it('should have money achievements sorted by threshold', () => {
    const moneyAchievements = achievements.filter(a => a.type === 'money');

    for (let i = 1; i < moneyAchievements.length; i++) {
      expect(moneyAchievements[i].threshold).toBeGreaterThan(moneyAchievements[i-1].threshold);
    }
  });

  it('should have cigarette achievements sorted by threshold', () => {
    const cigAchievements = achievements.filter(a => a.type === 'cigarettes');

    for (let i = 1; i < cigAchievements.length; i++) {
      expect(cigAchievements[i].threshold).toBeGreaterThan(cigAchievements[i-1].threshold);
    }
  });
});

describe('Achievement Unlock Logic', () => {
  const baseStats = {
    days: 0,
    money: 0,
    cigarettes: 0,
    lifeGained: { totalHours: 0 },
    lungHealth: 0,
    waterSaved: 0,
    co2Avoided: 0,
    timeSaved: { totalHours: 0 }
  };

  describe('Day-based achievements', () => {
    it('should unlock first_hour after 1 hour', () => {
      const achievement = achievements.find(a => a.id === 'first_hour');

      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 0.01 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 0.05 })).toBe(true);
    });

    it('should unlock first_day after 1 day', () => {
      const achievement = achievements.find(a => a.id === 'first_day');

      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 0.5 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 1 })).toBe(true);
    });

    it('should unlock one_week after 7 days', () => {
      const achievement = achievements.find(a => a.id === 'one_week');

      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 6 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 7 })).toBe(true);
    });

    it('should unlock one_month after 30 days', () => {
      const achievement = achievements.find(a => a.id === 'one_month');

      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 29 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 30 })).toBe(true);
    });

    it('should unlock one_year after 365 days', () => {
      const achievement = achievements.find(a => a.id === 'one_year');

      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 364 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, days: 365 })).toBe(true);
    });
  });

  describe('Money-based achievements', () => {
    it('should unlock save_50 after saving 50€', () => {
      const achievement = achievements.find(a => a.id === 'save_50');

      expect(isAchievementUnlocked(achievement, { ...baseStats, money: 49 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, money: 50 })).toBe(true);
    });

    it('should unlock save_1000 after saving 1000€', () => {
      const achievement = achievements.find(a => a.id === 'save_1000');

      expect(isAchievementUnlocked(achievement, { ...baseStats, money: 999 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, money: 1000 })).toBe(true);
    });
  });

  describe('Cigarette-based achievements', () => {
    it('should unlock cigs_100 after not smoking 100 cigarettes', () => {
      const achievement = achievements.find(a => a.id === 'cigs_100');

      expect(isAchievementUnlocked(achievement, { ...baseStats, cigarettes: 99 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, cigarettes: 100 })).toBe(true);
    });

    it('should unlock cigs_1000 after not smoking 1000 cigarettes', () => {
      const achievement = achievements.find(a => a.id === 'cigs_1000');

      expect(isAchievementUnlocked(achievement, { ...baseStats, cigarettes: 999 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, cigarettes: 1000 })).toBe(true);
    });
  });

  describe('Life hours achievements', () => {
    it('should unlock life_24h after gaining 24 hours of life', () => {
      const achievement = achievements.find(a => a.id === 'life_24h');

      expect(isAchievementUnlocked(achievement, { ...baseStats, lifeGained: { totalHours: 23 } })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, lifeGained: { totalHours: 24 } })).toBe(true);
    });
  });

  describe('Lung health achievements', () => {
    it('should unlock lung_25 at 25% lung health', () => {
      const achievement = achievements.find(a => a.id === 'lung_25');

      expect(isAchievementUnlocked(achievement, { ...baseStats, lungHealth: 24 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, lungHealth: 25 })).toBe(true);
    });

    it('should unlock lung_50 at 50% lung health', () => {
      const achievement = achievements.find(a => a.id === 'lung_50');

      expect(isAchievementUnlocked(achievement, { ...baseStats, lungHealth: 49 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, lungHealth: 50 })).toBe(true);
    });
  });

  describe('Water saved achievements', () => {
    it('should unlock water_1000 after saving 1000 liters', () => {
      const achievement = achievements.find(a => a.id === 'water_1000');

      expect(isAchievementUnlocked(achievement, { ...baseStats, waterSaved: 999 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, waterSaved: 1000 })).toBe(true);
    });
  });

  describe('CO2 avoided achievements', () => {
    it('should unlock co2_10 after avoiding 10kg CO2', () => {
      const achievement = achievements.find(a => a.id === 'co2_10');

      expect(isAchievementUnlocked(achievement, { ...baseStats, co2Avoided: 9 })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, co2Avoided: 10 })).toBe(true);
    });
  });

  describe('Time saved achievements', () => {
    it('should unlock time_24h after saving 24 hours', () => {
      const achievement = achievements.find(a => a.id === 'time_24h');

      expect(isAchievementUnlocked(achievement, { ...baseStats, timeSaved: { totalHours: 23 } })).toBe(false);
      expect(isAchievementUnlocked(achievement, { ...baseStats, timeSaved: { totalHours: 24 } })).toBe(true);
    });
  });
});

describe('Achievement Count', () => {
  it('should have expected number of achievements per category', () => {
    const dayAchievements = achievements.filter(a => !a.type);
    const moneyAchievements = achievements.filter(a => a.type === 'money');
    const cigAchievements = achievements.filter(a => a.type === 'cigarettes');
    const lifeAchievements = achievements.filter(a => a.type === 'lifeHours');
    const lungAchievements = achievements.filter(a => a.type === 'lungHealth');
    const waterAchievements = achievements.filter(a => a.type === 'water');
    const co2Achievements = achievements.filter(a => a.type === 'co2');
    const timeAchievements = achievements.filter(a => a.type === 'timeSaved');

    expect(dayAchievements.length).toBeGreaterThanOrEqual(20);
    expect(moneyAchievements.length).toBeGreaterThanOrEqual(10);
    expect(cigAchievements.length).toBeGreaterThanOrEqual(8);
    expect(lifeAchievements.length).toBeGreaterThanOrEqual(5);
    expect(lungAchievements.length).toBeGreaterThanOrEqual(5);
    expect(waterAchievements.length).toBeGreaterThanOrEqual(4);
    expect(co2Achievements.length).toBeGreaterThanOrEqual(5);
    expect(timeAchievements.length).toBeGreaterThanOrEqual(5);
  });

  it('should have a total of at least 70 achievements', () => {
    expect(achievements.length).toBeGreaterThanOrEqual(70);
  });
});
