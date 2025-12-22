// Progress Rings Visualization

import { getCurrentGoals } from './progress-goals.js';

// Circle circumference (2 * PI * r, where r = 52)
const CIRCUMFERENCE = 326.73;

export function updateProgressVisuals(stats) {
    const goals = getCurrentGoals();

    updateDaysRing(stats, goals);
    updateMoneyRing(stats, goals);
    updateCigarettesRing(stats, goals);
    updateGoalTexts(goals);
}

function updateDaysRing(stats, goals) {
    const days = Math.floor(stats.totalDays);
    const targetDays = goals.days;
    const progress = Math.min(days / targetDays, 1);
    const percent = Math.round(progress * 100);

    // Update ring
    const ring = document.getElementById('daysRing');
    if (ring) {
        const offset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);
        ring.style.strokeDashoffset = offset;
    }

    // Update values
    const valueEl = document.getElementById('daysRingValue');
    if (valueEl) {
        valueEl.textContent = days;
    }

    const percentEl = document.getElementById('daysRingPercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateMoneyRing(stats, goals) {
    const money = stats.money;
    const targetMoney = goals.money;
    const progress = Math.min(money / targetMoney, 1);
    const percent = Math.round(progress * 100);

    // Update ring
    const ring = document.getElementById('moneyRing');
    if (ring) {
        const offset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);
        ring.style.strokeDashoffset = offset;
    }

    // Update values
    const valueEl = document.getElementById('moneyRingValue');
    if (valueEl) {
        valueEl.textContent = Math.floor(money) + '€';
    }

    const percentEl = document.getElementById('moneyRingPercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateCigarettesRing(stats, goals) {
    const cigarettes = stats.cigarettes;
    const targetCigarettes = goals.cigarettes;
    const progress = Math.min(cigarettes / targetCigarettes, 1);
    const percent = Math.round(progress * 100);

    // Update ring
    const ring = document.getElementById('cigarettesRing');
    if (ring) {
        const offset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);
        ring.style.strokeDashoffset = offset;
    }

    // Update values
    const valueEl = document.getElementById('cigarettesRingValue');
    if (valueEl) {
        valueEl.textContent = cigarettes;
    }

    const percentEl = document.getElementById('cigarettesRingPercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateGoalTexts(goals) {
    const daysGoal = document.getElementById('daysGoalText');
    if (daysGoal) {
        daysGoal.textContent = `Ziel: ${goals.days} Tage`;
    }

    const moneyGoal = document.getElementById('moneyGoalText');
    if (moneyGoal) {
        moneyGoal.textContent = `Ziel: ${goals.money}€`;
    }

    const cigarettesGoal = document.getElementById('cigarettesGoalText');
    if (cigarettesGoal) {
        cigarettesGoal.textContent = `Ziel: ${goals.cigarettes}`;
    }
}
