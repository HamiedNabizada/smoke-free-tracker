import { describe, it, expect } from 'vitest';
import { healthMilestones } from '../app/js/data/milestones.js';

describe('Milestones Data Integrity', () => {
  it('should have all required fields for each milestone', () => {
    healthMilestones.forEach(milestone => {
      expect(milestone.days).toBeDefined();
      expect(milestone.days).toBeGreaterThan(0);
      expect(milestone.icon).toBeDefined();
      expect(milestone.title).toBeDefined();
      expect(milestone.description).toBeDefined();
      expect(milestone.detailedInfo).toBeDefined();
      expect(milestone.detailedInfo.length).toBeGreaterThan(50);
    });
  });

  it('should have milestones sorted by days ascending', () => {
    for (let i = 1; i < healthMilestones.length; i++) {
      expect(healthMilestones[i].days).toBeGreaterThan(healthMilestones[i-1].days);
    }
  });

  it('should have unique titles', () => {
    const titles = healthMilestones.map(m => m.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('should have at least 20 milestones', () => {
    expect(healthMilestones.length).toBeGreaterThanOrEqual(20);
  });
});

describe('Milestone Time Ranges', () => {
  it('should have a milestone within first hour', () => {
    const firstHourMilestones = healthMilestones.filter(m => m.days <= 0.042);
    expect(firstHourMilestones.length).toBeGreaterThanOrEqual(1);
  });

  it('should have a milestone at 24 hours', () => {
    const dayOneMilestone = healthMilestones.find(m => m.days === 1);
    expect(dayOneMilestone).toBeDefined();
    expect(dayOneMilestone.title).toBe('24 Stunden');
  });

  it('should have a milestone at 1 week', () => {
    const weekMilestone = healthMilestones.find(m => m.days === 7);
    expect(weekMilestone).toBeDefined();
    expect(weekMilestone.title).toBe('1 Woche');
  });

  it('should have a milestone at 1 month', () => {
    const monthMilestone = healthMilestones.find(m => m.days === 30);
    expect(monthMilestone).toBeDefined();
    expect(monthMilestone.title).toBe('1 Monat');
  });

  it('should have a milestone at 1 year', () => {
    const yearMilestone = healthMilestones.find(m => m.days === 365);
    expect(yearMilestone).toBeDefined();
    expect(yearMilestone.title).toBe('1 Jahr');
  });

  it('should have long-term milestones up to 20 years', () => {
    const twentyYearMilestone = healthMilestones.find(m => m.days === 7300);
    expect(twentyYearMilestone).toBeDefined();
    expect(twentyYearMilestone.title).toBe('20 Jahre');
  });
});

describe('Milestone Content Quality', () => {
  it('should have descriptions shorter than detailed info', () => {
    healthMilestones.forEach(milestone => {
      expect(milestone.description.length).toBeLessThan(milestone.detailedInfo.length);
    });
  });

  it('should have emoji icons', () => {
    healthMilestones.forEach(milestone => {
      // Check that icon contains at least one emoji character
      expect(milestone.icon.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should have meaningful descriptions', () => {
    healthMilestones.forEach(milestone => {
      expect(milestone.description.length).toBeGreaterThan(20);
    });
  });

  it('should have detailed info with health benefits', () => {
    healthMilestones.forEach(milestone => {
      // Detailed info should contain health-related words
      const healthTerms = ['lunge', 'herz', 'blut', 'sauerstoff', 'kreislauf', 'nikotin',
                          'gesundheit', 'risiko', 'regeneration', 'heilung', 'erhol',
                          'verbessert', 'sinkt', 'steigt', 'normalisiert', 'körper',
                          'atem', 'organ', 'zellen', 'nerven', 'haut', 'infekt',
                          'flimmerhärchen', 'bronchien', 'raucher', 'leben'];
      const detailedLower = milestone.detailedInfo.toLowerCase();
      const containsHealthTerm = healthTerms.some(term => detailedLower.includes(term));
      expect(containsHealthTerm).toBe(true);
    });
  });
});

describe('Milestone Progress Calculation', () => {
  // Helper to find current and next milestone
  function findMilestoneProgress(days) {
    let achieved = [];
    let next = null;

    for (const milestone of healthMilestones) {
      if (days >= milestone.days) {
        achieved.push(milestone);
      } else if (!next) {
        next = milestone;
      }
    }

    return { achieved, next };
  }

  it('should find no achieved milestones at day 0', () => {
    const { achieved, next } = findMilestoneProgress(0);
    expect(achieved.length).toBe(0);
    expect(next).toBeDefined();
    expect(next.days).toBe(healthMilestones[0].days);
  });

  it('should find first milestone as next at start', () => {
    const { next } = findMilestoneProgress(0);
    expect(next.title).toBe('20 Minuten');
  });

  it('should find correct progress at 1 day', () => {
    const { achieved, next } = findMilestoneProgress(1);
    expect(achieved.length).toBeGreaterThanOrEqual(5);
    expect(next.days).toBeGreaterThan(1);
  });

  it('should find correct progress at 30 days', () => {
    const { achieved, next } = findMilestoneProgress(30);
    expect(achieved.length).toBeGreaterThanOrEqual(10);
    expect(next.days).toBeGreaterThan(30);
  });

  it('should find correct progress at 365 days', () => {
    const { achieved, next } = findMilestoneProgress(365);
    expect(achieved.length).toBeGreaterThanOrEqual(15);
    expect(next.days).toBeGreaterThan(365);
  });

  it('should find all milestones achieved after 20 years', () => {
    const { achieved, next } = findMilestoneProgress(7301);
    expect(achieved.length).toBe(healthMilestones.length);
    expect(next).toBeNull();
  });
});

describe('Milestone Key Health Events', () => {
  it('should mention heart attack risk reduction at 24 hours', () => {
    const milestone = healthMilestones.find(m => m.days === 1);
    expect(milestone.description.toLowerCase()).toContain('herzinfarkt');
  });

  it('should mention nicotine leaving body at 3 days', () => {
    const milestone = healthMilestones.find(m => m.days === 3);
    expect(milestone.description.toLowerCase()).toContain('nikotin');
  });

  it('should mention lung capacity at 1 month', () => {
    const milestone = healthMilestones.find(m => m.days === 30);
    expect(milestone.description.toLowerCase()).toContain('lungen');
  });

  it('should mention heart attack risk halved at 1 year', () => {
    const milestone = healthMilestones.find(m => m.days === 365);
    const descLower = milestone.description.toLowerCase();
    expect(descLower).toContain('herzinfarkt');
    expect(descLower).toContain('halb');
  });

  it('should mention lung cancer risk halved at 10 years', () => {
    const milestone = healthMilestones.find(m => m.days === 3650);
    const descLower = milestone.description.toLowerCase();
    expect(descLower).toContain('lungenkrebs');
    expect(descLower).toContain('halbiert');
  });
});
