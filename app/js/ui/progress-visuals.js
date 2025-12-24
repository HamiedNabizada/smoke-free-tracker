// Progress Gauges Visualization

import { getCurrentGoals } from './progress-goals.js';
import { t } from '../i18n/i18n.js';

// Arc length for half-circle gauge (π * radius = π * 80 ≈ 251.2)
const ARC_LENGTH = 251.2;

export function updateProgressVisuals(stats) {
    const goals = getCurrentGoals();

    updateDaysGauge(stats, goals);
    updateMoneyGauge(stats, goals);
    updateCigarettesGauge(stats, goals);
    updateGoalTexts(goals);
}

function updateDaysGauge(stats, goals) {
    const days = Math.floor(stats.totalDays);
    const targetDays = goals.days;
    const progress = Math.min(days / targetDays, 1);
    const percent = Math.round(progress * 100);

    const gauge = document.getElementById('daysGauge');
    if (gauge) {
        const offset = ARC_LENGTH * (1 - progress);
        gauge.style.strokeDashoffset = offset;
    }

    const valueEl = document.getElementById('daysGaugeValue');
    if (valueEl) {
        valueEl.textContent = days;
    }

    const percentEl = document.getElementById('daysGaugePercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateMoneyGauge(stats, goals) {
    const money = stats.money;
    const targetMoney = goals.money;
    const progress = Math.min(money / targetMoney, 1);
    const percent = Math.round(progress * 100);

    const gauge = document.getElementById('moneyGauge');
    if (gauge) {
        const offset = ARC_LENGTH * (1 - progress);
        gauge.style.strokeDashoffset = offset;
    }

    const valueEl = document.getElementById('moneyGaugeValue');
    if (valueEl) {
        valueEl.textContent = Math.floor(money) + '€';
    }

    const percentEl = document.getElementById('moneyGaugePercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateCigarettesGauge(stats, goals) {
    const cigarettes = stats.cigarettes;
    const targetCigarettes = goals.cigarettes;
    const progress = Math.min(cigarettes / targetCigarettes, 1);
    const percent = Math.round(progress * 100);

    const gauge = document.getElementById('cigarettesGauge');
    if (gauge) {
        const offset = ARC_LENGTH * (1 - progress);
        gauge.style.strokeDashoffset = offset;
    }

    const valueEl = document.getElementById('cigarettesGaugeValue');
    if (valueEl) {
        valueEl.textContent = cigarettes;
    }

    const percentEl = document.getElementById('cigarettesGaugePercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateGoalTexts(goals) {
    const daysGoal = document.getElementById('daysGoalText');
    if (daysGoal) {
        daysGoal.textContent = t('dashboard.progress.goalDays', { count: goals.days });
    }

    const moneyGoal = document.getElementById('moneyGoalText');
    if (moneyGoal) {
        moneyGoal.textContent = t('dashboard.progress.goalMoney', { amount: goals.money });
    }

    const cigarettesGoal = document.getElementById('cigarettesGoalText');
    if (cigarettesGoal) {
        cigarettesGoal.textContent = t('dashboard.progress.goalCigarettes', { count: goals.cigarettes });
    }
}
