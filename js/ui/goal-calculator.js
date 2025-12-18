import { userData } from '../config.js';
import { calculateStats } from '../utils/calculations.js';

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
            alert('Bitte gib eine gültige Anzahl an Tagen ein!');
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
            alert('Bitte gib einen gültigen Geldbetrag ein!');
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
    progressText.textContent = `${data.progress.toFixed(1)}% erreicht`;

    // Format target date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = data.targetDate.toLocaleDateString('de-DE', dateOptions);

    // Build stats grid
    let statsHTML = '';

    if (data.mode === 'days') {
        statsHTML = `
            <div class="goal-stat-box">
                <div class="goal-stat-icon">📅</div>
                <div class="goal-stat-value">${Math.floor(data.targetDays)} Tage</div>
                <div class="goal-stat-label">Dein Ziel</div>
                <div class="goal-stat-date">Erreicht am: ${formattedDate}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">💰</div>
                <div class="goal-stat-value">${data.money.toFixed(2)}€</div>
                <div class="goal-stat-label">Geld gespart</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">🚬</div>
                <div class="goal-stat-value">${data.cigarettes.toLocaleString('de-DE')}</div>
                <div class="goal-stat-label">Zigaretten vermieden</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">⏳</div>
                <div class="goal-stat-value">${data.lifeDays.toFixed(1)} Tage</div>
                <div class="goal-stat-label">Leben gewonnen</div>
            </div>
        `;
    } else {
        statsHTML = `
            <div class="goal-stat-box">
                <div class="goal-stat-icon">💰</div>
                <div class="goal-stat-value">${data.targetMoney.toFixed(2)}€</div>
                <div class="goal-stat-label">Dein Sparziel</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">📅</div>
                <div class="goal-stat-value">${Math.ceil(data.daysNeeded)} Tage</div>
                <div class="goal-stat-label">Benötigte Zeit</div>
                <div class="goal-stat-date">Erreicht am: ${formattedDate}</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">🚬</div>
                <div class="goal-stat-value">${data.cigarettes.toLocaleString('de-DE')}</div>
                <div class="goal-stat-label">Zigaretten vermieden</div>
            </div>
            <div class="goal-stat-box">
                <div class="goal-stat-icon">⏳</div>
                <div class="goal-stat-value">${data.lifeDays.toFixed(1)} Tage</div>
                <div class="goal-stat-label">Leben gewonnen</div>
            </div>
        `;
    }

    statsGrid.innerHTML = statsHTML;
}
