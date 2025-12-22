// Progress Bars Visualization

import { getCurrentGoals } from './progress-goals.js';

export function updateProgressVisuals(stats) {
    const goals = getCurrentGoals();

    updateDaysBar(stats, goals);
    updateMoneyBar(stats, goals);
    updateCigarettesBar(stats, goals);
    updateGoalTexts(goals);
}

function updateDaysBar(stats, goals) {
    const days = Math.floor(stats.totalDays);
    const targetDays = goals.days;
    const progress = Math.min(days / targetDays, 1) * 100;
    const percent = Math.round(progress);

    const bar = document.getElementById('daysBar');
    if (bar) {
        bar.style.width = progress + '%';
    }

    const valueEl = document.getElementById('daysBarValue');
    if (valueEl) {
        valueEl.textContent = days;
    }

    const percentEl = document.getElementById('daysBarPercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateMoneyBar(stats, goals) {
    const money = stats.money;
    const targetMoney = goals.money;
    const progress = Math.min(money / targetMoney, 1) * 100;
    const percent = Math.round(progress);

    const bar = document.getElementById('moneyBar');
    if (bar) {
        bar.style.width = progress + '%';
    }

    const valueEl = document.getElementById('moneyBarValue');
    if (valueEl) {
        valueEl.textContent = Math.floor(money) + '€';
    }

    const percentEl = document.getElementById('moneyBarPercent');
    if (percentEl) {
        percentEl.textContent = percent + '%';
    }
}

function updateCigarettesBar(stats, goals) {
    const cigarettes = stats.cigarettes;
    const targetCigarettes = goals.cigarettes;
    const progress = Math.min(cigarettes / targetCigarettes, 1) * 100;
    const percent = Math.round(progress);

    const bar = document.getElementById('cigarettesBar');
    if (bar) {
        bar.style.width = progress + '%';
    }

    const valueEl = document.getElementById('cigarettesBarValue');
    if (valueEl) {
        valueEl.textContent = cigarettes;
    }

    const percentEl = document.getElementById('cigarettesBarPercent');
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
