import { describe, it, expect } from 'vitest';

// Pure calculation functions extracted from goal-calculator.js logic
// These mirror the calculations done in the UI

function calculateGoalByDays(targetDays, userData) {
  const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
  const cigarettesAvoided = Math.floor(targetDays * userData.cigarettesPerDay);
  const moneySaved = cigarettesAvoided * pricePerCigarette;
  const lifeGainedMinutes = cigarettesAvoided * 11;
  const lifeGainedDays = lifeGainedMinutes / (60 * 24);

  return {
    cigarettes: cigarettesAvoided,
    money: moneySaved,
    lifeDays: lifeGainedDays
  };
}

function calculateGoalByMoney(targetMoney, userData) {
  const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
  const cigarettesNeeded = targetMoney / pricePerCigarette;
  const daysNeeded = cigarettesNeeded / userData.cigarettesPerDay;
  const lifeGainedMinutes = cigarettesNeeded * 11;
  const lifeGainedDays = lifeGainedMinutes / (60 * 24);

  return {
    cigarettes: Math.floor(cigarettesNeeded),
    daysNeeded: daysNeeded,
    lifeDays: lifeGainedDays
  };
}

function calculateProgress(currentValue, targetValue) {
  return Math.min((currentValue / targetValue) * 100, 100);
}

describe('Goal Calculator - Days Mode', () => {
  const userData = {
    cigarettesPerDay: 20,
    pricePerPack: 10,
    cigarettesPerPack: 20
  };

  it('should calculate cigarettes avoided correctly', () => {
    const result = calculateGoalByDays(10, userData);
    // 10 days * 20 cigarettes/day = 200
    expect(result.cigarettes).toBe(200);
  });

  it('should calculate money saved correctly', () => {
    const result = calculateGoalByDays(10, userData);
    // 200 cigarettes * (10€/20) = 100€
    expect(result.money).toBe(100);
  });

  it('should calculate life gained correctly', () => {
    const result = calculateGoalByDays(10, userData);
    // 200 cigarettes * 11 min = 2200 min = 1.527 days
    expect(result.lifeDays).toBeCloseTo(1.527, 2);
  });

  it('should handle 30 days goal', () => {
    const result = calculateGoalByDays(30, userData);
    expect(result.cigarettes).toBe(600);
    expect(result.money).toBe(300);
  });

  it('should handle 365 days goal (1 year)', () => {
    const result = calculateGoalByDays(365, userData);
    expect(result.cigarettes).toBe(7300);
    expect(result.money).toBe(3650);
  });

  it('should handle different user data', () => {
    const heavySmoker = {
      cigarettesPerDay: 40,
      pricePerPack: 12,
      cigarettesPerPack: 20
    };
    const result = calculateGoalByDays(30, heavySmoker);
    // 30 days * 40 cigs = 1200 cigs
    // 1200 * (12/20) = 720€
    expect(result.cigarettes).toBe(1200);
    expect(result.money).toBe(720);
  });
});

describe('Goal Calculator - Money Mode', () => {
  const userData = {
    cigarettesPerDay: 20,
    pricePerPack: 10,
    cigarettesPerPack: 20
  };

  it('should calculate days needed correctly', () => {
    const result = calculateGoalByMoney(100, userData);
    // 100€ / 0.50€ per cig = 200 cigs
    // 200 cigs / 20 per day = 10 days
    expect(result.daysNeeded).toBe(10);
  });

  it('should calculate cigarettes correctly', () => {
    const result = calculateGoalByMoney(100, userData);
    expect(result.cigarettes).toBe(200);
  });

  it('should calculate life gained correctly', () => {
    const result = calculateGoalByMoney(100, userData);
    // 200 * 11 min = 2200 min = 1.527 days
    expect(result.lifeDays).toBeCloseTo(1.527, 2);
  });

  it('should handle 1000€ goal', () => {
    const result = calculateGoalByMoney(1000, userData);
    expect(result.daysNeeded).toBe(100);
    expect(result.cigarettes).toBe(2000);
  });

  it('should handle different price per pack', () => {
    const expensiveSmoker = {
      cigarettesPerDay: 20,
      pricePerPack: 15,
      cigarettesPerPack: 20
    };
    const result = calculateGoalByMoney(150, expensiveSmoker);
    // 150€ / 0.75€ per cig = 200 cigs
    // 200 / 20 = 10 days
    expect(result.daysNeeded).toBe(10);
    expect(result.cigarettes).toBe(200);
  });
});

describe('Progress Calculation', () => {
  it('should calculate 0% when just started', () => {
    expect(calculateProgress(0, 100)).toBe(0);
  });

  it('should calculate 50% at halfway', () => {
    expect(calculateProgress(50, 100)).toBe(50);
  });

  it('should cap at 100%', () => {
    expect(calculateProgress(150, 100)).toBe(100);
  });

  it('should handle decimal values', () => {
    expect(calculateProgress(25.5, 100)).toBe(25.5);
  });

  it('should work for money goals', () => {
    expect(calculateProgress(250, 1000)).toBe(25);
  });

  it('should work for day goals', () => {
    expect(calculateProgress(30, 365)).toBeCloseTo(8.22, 1);
  });
});

describe('Goal Consistency', () => {
  const userData = {
    cigarettesPerDay: 20,
    pricePerPack: 10,
    cigarettesPerPack: 20
  };

  it('should have consistent results between days and money modes', () => {
    // If I save 100€ in 10 days...
    const byDays = calculateGoalByDays(10, userData);
    const byMoney = calculateGoalByMoney(100, userData);

    // Both should show same cigarettes
    expect(byDays.cigarettes).toBe(byMoney.cigarettes);

    // Both should show same life gained
    expect(byDays.lifeDays).toBeCloseTo(byMoney.lifeDays, 5);
  });

  it('should scale linearly', () => {
    const days10 = calculateGoalByDays(10, userData);
    const days20 = calculateGoalByDays(20, userData);

    // Double the days = double the savings
    expect(days20.cigarettes).toBe(days10.cigarettes * 2);
    expect(days20.money).toBe(days10.money * 2);
  });
});
