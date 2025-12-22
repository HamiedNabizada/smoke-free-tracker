import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the config module
vi.mock('../app/js/config.js', () => ({
  userData: {
    quitDate: '2024-01-01T10:00:00',
    cigarettesPerDay: 20,
    pricePerPack: 10,
    cigarettesPerPack: 20
  }
}));

// Import after mocking
import { calculateStats, calculateTimeRemaining } from '../app/js/utils/calculations.js';

describe('calculateTimeRemaining', () => {
  it('should return hours for less than 1 day', () => {
    expect(calculateTimeRemaining(0.5)).toBe('12 Std.');
    expect(calculateTimeRemaining(0.1)).toBe('3 Std.');
  });

  it('should return days for 1-7 days', () => {
    expect(calculateTimeRemaining(1)).toBe('1 Tag');
    expect(calculateTimeRemaining(3)).toBe('3 Tagen');
    expect(calculateTimeRemaining(6.5)).toBe('7 Tagen');
  });

  it('should return weeks for 7-30 days', () => {
    expect(calculateTimeRemaining(7)).toBe('1 Woche');
    expect(calculateTimeRemaining(14)).toBe('2 Wochen');
    expect(calculateTimeRemaining(21)).toBe('3 Wochen');
  });

  it('should return months for 30-365 days', () => {
    expect(calculateTimeRemaining(30)).toBe('1 Monat');
    expect(calculateTimeRemaining(60)).toBe('2 Monaten');
    expect(calculateTimeRemaining(180)).toBe('6 Monaten');
  });

  it('should return years for 365+ days', () => {
    expect(calculateTimeRemaining(365)).toBe('1 Jahr');
    expect(calculateTimeRemaining(730)).toBe('2 Jahren');
    expect(calculateTimeRemaining(1095)).toBe('3 Jahren');
  });
});

describe('calculateStats', () => {
  beforeEach(() => {
    // Reset date mock before each test
    vi.useFakeTimers();
  });

  it('should calculate cigarettes not smoked correctly', () => {
    // Set current time to 10 days after quit date
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 10 days * 20 cigarettes/day = 200 cigarettes
    expect(stats.cigarettes).toBe(200);
  });

  it('should calculate money saved correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes * (10€/20 cigarettes) = 100€
    expect(stats.money).toBe(100);
  });

  it('should calculate life gained correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes * 11 minutes = 2200 minutes = 36.67 hours
    expect(stats.lifeGained.totalHours).toBe(36);
  });

  it('should calculate toxins avoided correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes * (1mg nicotine + 10mg tar) = 2200mg = 2.2g
    expect(stats.toxins).toBe(2.2);
  });

  it('should calculate lung health for first 2 weeks', () => {
    // Day 7 - should be between 0-10%
    vi.setSystemTime(new Date('2024-01-08T10:00:00'));
    let stats = calculateStats();
    expect(stats.lungHealth).toBeGreaterThanOrEqual(0);
    expect(stats.lungHealth).toBeLessThanOrEqual(10);
  });

  it('should calculate lung health for 2 weeks to 3 months', () => {
    // Day 30 - should be between 10-30%
    vi.setSystemTime(new Date('2024-01-31T10:00:00'));
    let stats = calculateStats();
    expect(stats.lungHealth).toBeGreaterThanOrEqual(10);
    expect(stats.lungHealth).toBeLessThanOrEqual(30);
  });

  it('should calculate lung health for 3 months to 1 year', () => {
    // Day 180 - should be between 30-50%
    vi.setSystemTime(new Date('2024-06-28T10:00:00'));
    let stats = calculateStats();
    expect(stats.lungHealth).toBeGreaterThanOrEqual(30);
    expect(stats.lungHealth).toBeLessThanOrEqual(50);
  });

  it('should calculate lung health after 1 year', () => {
    // Day 400 - should be above 50%
    vi.setSystemTime(new Date('2025-02-05T10:00:00'));
    let stats = calculateStats();
    expect(stats.lungHealth).toBeGreaterThan(50);
    expect(stats.lungHealth).toBeLessThanOrEqual(95);
  });

  it('should calculate time saved correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes * 5 minutes = 1000 minutes = 16.67 hours
    expect(stats.timeSaved.totalHours).toBe(16);
  });

  it('should calculate CO2 avoided correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes * 14g = 2800g = 2.8kg
    expect(stats.co2Avoided).toBe(2.8);
  });

  it('should calculate water saved correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes * 3.7L = 740L
    expect(stats.waterSaved).toBe(740);
  });

  it('should calculate trees saved correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));

    const stats = calculateStats();

    // 200 cigarettes / 300 = 0.667 trees
    expect(stats.treesSaved).toBeCloseTo(0.667, 2);
  });

  it('should calculate skin age improvement after 2 weeks', () => {
    // Day 14 - should start improving
    vi.setSystemTime(new Date('2024-01-15T10:00:00'));
    let stats = calculateStats();
    expect(stats.skinAge).toBeGreaterThanOrEqual(0);

    // Day 284 (270 days after start) - should be close to max 30 days
    vi.setSystemTime(new Date('2024-10-11T10:00:00'));
    stats = calculateStats();
    expect(stats.skinAge).toBeGreaterThanOrEqual(25);
    expect(stats.skinAge).toBeLessThanOrEqual(30);
  });

  it('should return correct time breakdown', () => {
    // Set to exactly 2 days, 3 hours, 30 minutes after quit
    vi.setSystemTime(new Date('2024-01-03T13:30:00'));

    const stats = calculateStats();

    expect(stats.days).toBe(2);
    expect(stats.hours).toBe(3);
    expect(stats.minutes).toBe(30);
  });
});
