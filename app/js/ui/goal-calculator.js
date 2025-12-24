import { userData } from '../config.js';
import { calculateStats } from '../utils/calculations.js';
import { t, isInitialized, getLocale } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

let currentMode = 'days'; // 'days' or 'money'

export function initializeGoalCalculator() {
    const toggleButtons = document.querySelectorAll('.goal-toggle-btn');
    const calculateBtn = document.getElementById('calculateGoalBtn');

    // Toggle mode
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            toggleInputFields();
        });
    });

    // Calculate button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateGoal);
    }

    // Enter key support
    const daysInput = document.getElementById('goalDaysInput');
    const moneyInput = document.getElementById('goalMoneyInput');

    if (daysInput) {
        daysInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateGoal();
        });
    }

    if (moneyInput) {
        moneyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateGoal();
        });
    }
}

function toggleInputFields() {
    const daysInputGroup = document.getElementById('daysInputGroup');
    const moneyInputGroup = document.getElementById('moneyInputGroup');

    if (currentMode === 'days') {
        daysInputGroup.classList.remove('hidden');
        moneyInputGroup.classList.add('hidden');
    } else {
        daysInputGroup.classList.add('hidden');
        moneyInputGroup.classList.remove('hidden');
    }
}

function calculateGoal() {
    const currentStats = calculateStats();
    const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;

    let goalData = {};

    if (currentMode === 'days') {
        const daysInput = document.getElementById('goalDaysInput');
        const targetDays = parseFloat(daysInput.value);

        if (!targetDays || targetDays <= 0) {
            alert(tr('statistics.goalCalculator.alerts.invalidDays', 'Bitte gib eine gültige Anzahl an Tagen ein!'));
            return;
        }

        // Calculate what will be achieved in X days
        const cigarettesAvoided = Math.floor(targetDays * userData.cigarettesPerDay);
        const moneySaved = cigarettesAvoided * pricePerCigarette;
        const lifeGainedMinutes = cigarettesAvoided * 11;
        const lifeGainedDays = lifeGainedMinutes / (60 * 24);

        // Calculate target date
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + targetDays);

        // Calculate progress
        const progress = Math.min((currentStats.totalDays / targetDays) * 100, 100);

        goalData = {
            mode: 'days',
            targetDays: targetDays,
            targetDate: targetDate,
            cigarettes: cigarettesAvoided,
            money: moneySaved,
            lifeDays: lifeGainedDays,
            progress: progress
        };

    } else {
        const moneyInput = document.getElementById('goalMoneyInput');
        const targetMoney = parseFloat(moneyInput.value);

        if (!targetMoney || targetMoney <= 0) {
            alert(tr('statistics.goalCalculator.alerts.invalidMoney', 'Bitte gib einen gültigen Geldbetrag ein!'));
            return;
        }

        // Calculate how many days needed for X money
        const cigarettesNeeded = targetMoney / pricePerCigarette;
        const daysNeeded = cigarettesNeeded / userData.cigarettesPerDay;
        const lifeGainedMinutes = cigarettesNeeded * 11;
        const lifeGainedDays = lifeGainedMinutes / (60 * 24);

        // Calculate target date
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysNeeded);

        // Calculate progress
        const progress = Math.min((currentStats.money / targetMoney) * 100, 100);

        goalData = {
            mode: 'money',
            targetMoney: targetMoney,
            targetDate: targetDate,
            daysNeeded: daysNeeded,
            cigarettes: Math.floor(cigarettesNeeded),
            lifeDays: lifeGainedDays,
            progress: progress
        };
    }

    displayGoalResults(goalData);
}

function displayGoalResults(data) {
    const resultsContainer = document.getElementById('goalResults');
    const progressFill = document.getElementById('goalProgressFill');
    const progressText = document.getElementById('goalProgressText');
    const statsGrid = document.getElementById('goalStatsGrid');

    // Show results
    resultsContainer.classList.remove('hidden');

    // Update progress bar
    progressFill.style.width = `${data.progress}%`;
    const achievedText = tr('statistics.goalCalculator.achieved', '{percent}% erreicht', { percent: data.progress.toFixed(1) });
    progressText.textContent = achievedText;

    // Format target date using locale
    const locale = isInitialized() ? getLocale() : 'de';
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = data.targetDate.toLocaleDateString(locale === 'en' ? 'en-US' : 'de-DE', dateOptions);

    // Translations
    const daysLabel = tr('statistics.goalCalculator.days', 'Tage');
    const yourGoalLabel = tr('statistics.goalCalculator.yourGoal', 'Dein Ziel');
    const reachedOnLabel = tr('statistics.goalCalculator.reachedOn', 'Erreicht am: {date}', { date: formattedDate });
    const moneySavedLabel = tr('statistics.goalCalculator.moneySaved', 'Geld gespart');
    const cigarettesAvoidedLabel = tr('statistics.goalCalculator.cigarettesAvoided', 'Zigaretten vermieden');
    const lifeGainedLabel = tr('statistics.goalCalculator.lifeGained', 'Leben gewonnen');
    const savingsGoalLabel = tr('statistics.goalCalculator.savingsGoal', 'Dein Sparziel');
    const timeNeededLabel = tr('statistics.goalCalculator.timeNeeded', 'Benötigte Zeit');

    // Number formatting based on locale
    const numberLocale = locale === 'en' ? 'en-US' : 'de-DE';

    // Build stats grid
    let statsHTML = '';

    if (data.mode === 'days') {
        statsHTML = `
            <div class="goal-stat-box">
                <div class="goal-stat-icon">📅</div>
                <div class="goal-stat-value">${Math.floor(data.targetDays)} ${daysLabel}</div>
                <div class="goal-stat-label">${yourGoalLabel}</div>
                <div class="goal-stat-date">${reachedOnLabel}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">💰</div>
                <div class="goal-stat-value">${data.money.toFixed(2)}€</div>
                <div class="goal-stat-label">${moneySavedLabel}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">🚬</div>
                <div class="goal-stat-value">${data.cigarettes.toLocaleString(numberLocale)}</div>
                <div class="goal-stat-label">${cigarettesAvoidedLabel}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">⏳</div>
                <div class="goal-stat-value">${data.lifeDays.toFixed(1)} ${daysLabel}</div>
                <div class="goal-stat-label">${lifeGainedLabel}</div>
            </div>
        `;
    } else {
        statsHTML = `
            <div class="goal-stat-box">
                <div class="goal-stat-icon">💰</div>
                <div class="goal-stat-value">${data.targetMoney.toFixed(2)}€</div>
                <div class="goal-stat-label">${savingsGoalLabel}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">📅</div>
                <div class="goal-stat-value">${Math.ceil(data.daysNeeded)} ${daysLabel}</div>
                <div class="goal-stat-label">${timeNeededLabel}</div>
                <div class="goal-stat-date">${reachedOnLabel}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">🚬</div>
                <div class="goal-stat-value">${data.cigarettes.toLocaleString(numberLocale)}</div>
                <div class="goal-stat-label">${cigarettesAvoidedLabel}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">⏳</div>
                <div class="goal-stat-value">${data.lifeDays.toFixed(1)} ${daysLabel}</div>
                <div class="goal-stat-label">${lifeGainedLabel}</div>
            </div>
        `;
    }

    statsGrid.innerHTML = statsHTML;
}
