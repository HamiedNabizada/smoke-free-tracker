import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the config module
vi.mock('../app/js/config.js', () => ({
  userData: {
    quitDate: '2024-01-01T10:00:00',
    cigarettesPerDay: 20,
    pricePerPack: 10,
    cigarettesPerPack: 20,
    gender: 'unknown'
  }
}));

// Import after mocking
import {
    calculateStats,
    calculateTimeRemaining,
    calculateCardiovascularRecovery,
    calculateLungRecovery,
    calculateSkinRecovery,
    calculateCirculationRecovery,
    calculateLungCancerRiskReduction,
    calculateHeartAttackRiskReduction,
    calculateStrokeRiskReduction,
    calculateSkinAgeImprovement
} from '../app/js/utils/calculations.js';

// ============================================
// ZEIT-FORMATIERUNG
// ============================================

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

// ============================================
// HAUPT-STATISTIKEN (calculateStats)
// ============================================

describe('calculateStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate cigarettes not smoked correctly', () => {
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

  it('should calculate life gained correctly (20 min/cigarette for unknown gender)', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));
    const stats = calculateStats();
    // 200 cigarettes * 20 minutes = 4000 minutes = 66.67 hours
    expect(stats.lifeGained.totalHours).toBe(66);
    expect(stats.lifeGained.minutesPerCigarette).toBe(20);
  });

  it('should calculate toxins avoided correctly', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));
    const stats = calculateStats();
    // 200 cigarettes * (1mg nicotine + 10mg tar) = 2200mg = 2.2g
    expect(stats.toxins).toBe(2.2);
  });

  it('should calculate time saved correctly (6 min/cigarette)', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));
    const stats = calculateStats();
    // 200 cigarettes * 6 minutes = 1200 minutes = 20 hours
    expect(stats.timeSaved.totalHours).toBe(20);
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

  it('should return correct time breakdown', () => {
    vi.setSystemTime(new Date('2024-01-03T13:30:00'));
    const stats = calculateStats();
    expect(stats.days).toBe(2);
    expect(stats.hours).toBe(3);
    expect(stats.minutes).toBe(30);
  });

  it('should include health recovery metrics', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));
    const stats = calculateStats();

    expect(stats.health).toBeDefined();
    expect(stats.health.cardiovascular).toBeDefined();
    expect(stats.health.lung).toBeDefined();
    expect(stats.health.skin).toBeDefined();
    expect(stats.health.circulation).toBeDefined();
  });

  it('should include risk reduction metrics', () => {
    vi.setSystemTime(new Date('2024-01-11T10:00:00'));
    const stats = calculateStats();

    expect(stats.riskReduction).toBeDefined();
    expect(stats.riskReduction.heartAttack).toBeDefined();
    expect(stats.riskReduction.stroke).toBeDefined();
    expect(stats.riskReduction.lungCancer).toBeDefined();
  });
});

// ============================================
// HERZ-KREISLAUF ERHOLUNG
// Quellen: WHO, JAMA (2019)
// ============================================

describe('Cardiovascular Recovery (WHO, JAMA)', () => {
  it('should return 0% at day 0', () => {
    expect(calculateCardiovascularRecovery(0)).toBe(0);
  });

  it('should show improvement within 20 minutes', () => {
    const recovery = calculateCardiovascularRecovery(0.014);
    expect(recovery).toBeGreaterThan(0);
    expect(recovery).toBeLessThanOrEqual(5);
  });

  it('should be ~10% after 1 day', () => {
    const recovery = calculateCardiovascularRecovery(1);
    expect(recovery).toBeCloseTo(10, 0);
  });

  it('should be ~50% after 1 year (WHO: Herzinfarktrisiko halbiert)', () => {
    const recovery = calculateCardiovascularRecovery(365);
    expect(recovery).toBeCloseTo(50, 1);
  });

  it('should be ~80% after 5 years', () => {
    const recovery = calculateCardiovascularRecovery(1825);
    expect(recovery).toBeCloseTo(80, 1);
  });

  it('should be 100% after 15 years', () => {
    expect(calculateCardiovascularRecovery(5475)).toBe(100);
  });
});

// ============================================
// LUNGENFUNKTION ERHOLUNG
// Quellen: PMC, WHO
// ============================================

describe('Lung Recovery (PMC, WHO)', () => {
  it('should return 0% at day 0', () => {
    expect(calculateLungRecovery(0)).toBe(0);
  });

  it('should be ~10% after 12 hours (CO normalisiert)', () => {
    expect(calculateLungRecovery(0.5)).toBeCloseTo(10, 1);
  });

  it('should be ~20% after 3 days (Zilien reaktivieren)', () => {
    expect(calculateLungRecovery(3)).toBeCloseTo(20, 1);
  });

  it('should be ~60% after 3 months (+30% FEV1)', () => {
    expect(calculateLungRecovery(84)).toBeCloseTo(60, 1);
  });

  it('should be ~95% after 1 year', () => {
    expect(calculateLungRecovery(365)).toBeCloseTo(95, 1);
  });

  it('should be 100% after 10 years', () => {
    expect(calculateLungRecovery(3650)).toBe(100);
  });
});

// ============================================
// HAUTGESUNDHEIT ERHOLUNG
// Quellen: Mailänder Studie (2010)
// ============================================

describe('Skin Recovery (Milan Study 2010)', () => {
  it('should return 0% at day 0', () => {
    expect(calculateSkinRecovery(0)).toBe(0);
  });

  it('should be minimal in first 2 weeks', () => {
    expect(calculateSkinRecovery(14)).toBeLessThanOrEqual(5);
  });

  it('should be ~45% after 3 months', () => {
    expect(calculateSkinRecovery(84)).toBeCloseTo(45, 1);
  });

  it('should be ~95% after 1 year', () => {
    expect(calculateSkinRecovery(365)).toBeCloseTo(95, 1);
  });

  it('should be 100% after 2 years', () => {
    expect(calculateSkinRecovery(730)).toBe(100);
  });
});

describe('Skin Age Improvement (Milan Study: max 13 years)', () => {
  it('should return 0 years at day 0', () => {
    expect(calculateSkinAgeImprovement(0)).toBe(0);
  });

  it('should show minimal improvement in first month (max 0.5 years)', () => {
    expect(calculateSkinAgeImprovement(7)).toBeLessThanOrEqual(0.2);
    expect(calculateSkinAgeImprovement(23)).toBeLessThanOrEqual(0.5);
    expect(calculateSkinAgeImprovement(30)).toBeCloseTo(0.5, 1);
  });

  it('should show ~2 years at 3 months', () => {
    expect(calculateSkinAgeImprovement(90)).toBeCloseTo(2, 0);
  });

  it('should show ~10 years at 9 months (main improvement period)', () => {
    expect(calculateSkinAgeImprovement(270)).toBeCloseTo(10, 0);
  });

  it('should reach 13 years after 2 years', () => {
    expect(calculateSkinAgeImprovement(730)).toBe(13);
  });
});

// ============================================
// DURCHBLUTUNG ERHOLUNG
// Quelle: WHO
// ============================================

describe('Circulation Recovery (WHO)', () => {
  it('should return 0% at day 0', () => {
    expect(calculateCirculationRecovery(0)).toBe(0);
  });

  it('should be ~20% after 20 minutes', () => {
    expect(calculateCirculationRecovery(0.014)).toBeCloseTo(20, 1);
  });

  it('should be ~90% after 3 months', () => {
    expect(calculateCirculationRecovery(84)).toBeCloseTo(90, 1);
  });

  it('should be 100% after 6 months', () => {
    expect(calculateCirculationRecovery(180)).toBe(100);
  });
});

// ============================================
// KREBSRISIKO-REDUKTION
// Quellen: WHO, NCBI
// ============================================

describe('Cancer & Heart Risk Reduction (WHO, NCBI)', () => {
  it('should have lung cancer risk capped at 90% (Restrisiko)', () => {
    expect(calculateLungCancerRiskReduction(10000)).toBe(90);
  });

  it('should have heart attack risk at 50% after 1 year', () => {
    expect(calculateHeartAttackRiskReduction(365)).toBeCloseTo(50, 1);
  });

  it('should have stroke risk at 100% after 15 years', () => {
    expect(calculateStrokeRiskReduction(5475)).toBe(100);
  });
});

// ============================================
// WISSENSCHAFTLICHE KONSISTENZ
// ============================================

describe('Scientific Consistency', () => {
  it('all recovery functions should be monotonically increasing', () => {
    const testDays = [0, 1, 7, 30, 90, 180, 365, 730, 1825];
    let prev = { cardio: -1, lung: -1, skin: -1, circ: -1 };

    testDays.forEach(days => {
      const cardio = calculateCardiovascularRecovery(days);
      const lung = calculateLungRecovery(days);
      const skin = calculateSkinRecovery(days);
      const circ = calculateCirculationRecovery(days);

      expect(cardio).toBeGreaterThanOrEqual(prev.cardio);
      expect(lung).toBeGreaterThanOrEqual(prev.lung);
      expect(skin).toBeGreaterThanOrEqual(prev.skin);
      expect(circ).toBeGreaterThanOrEqual(prev.circ);

      prev = { cardio, lung, skin, circ };
    });
  });

  it('circulation should recover fastest initially', () => {
    // Nach 20 Minuten: Durchblutung startet sofort (WHO)
    const circ = calculateCirculationRecovery(0.014);
    const cardio = calculateCardiovascularRecovery(0.014);
    expect(circ).toBeGreaterThan(cardio);
  });
});
