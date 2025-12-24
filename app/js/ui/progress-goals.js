/**
 * Progress Goals - Editable goal management
 * Allows users to customize their progress goals
 */

import { auth, db, isDemoMode, blockDemoWrite, checkWriteLimit, incrementWriteCount } from '../firebase-auth.js';
import { doc, getDoc, updateDoc } from '../firebase-init.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

// Default goals
const DEFAULT_GOALS = {
    days: 365,
    money: 1000,
    cigarettes: 1000
};

// Current goals (loaded from Firestore or defaults)
let currentGoals = { ...DEFAULT_GOALS };

/**
 * Initialize progress goals
 */
export async function initializeProgressGoals() {
    await loadGoals();
    updateGoalDisplays();
    setupGoalEditListeners();
}

/**
 * Get current goals
 */
export function getCurrentGoals() {
    return currentGoals;
}

/**
 * Load goals from Firestore
 */
async function loadGoals() {
    const user = auth.currentUser;
    if (!user) return;

    // Demo mode: use default goals
    if (isDemoMode()) {
        console.log('[ProgressGoals] Demo mode - using default goals');
        return;
    }

    try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().progress_goals) {
            currentGoals = { ...DEFAULT_GOALS, ...docSnap.data().progress_goals };
        }
    } catch (error) {
        console.error('[ProgressGoals] Error loading goals:', error);
    }
}

/**
 * Save goals to Firestore (with rate limiting)
 */
async function saveGoals() {
    const user = auth.currentUser;
    if (!user) return;

    // Block write in demo mode
    if (blockDemoWrite(tr('progressGoals.saveGoals', 'Ziele speichern'))) {
        return;
    }

    // Check write limit
    if (!checkWriteLimit('goals')) {
        return;
    }

    try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
            progress_goals: currentGoals
        });

        // Track write
        incrementWriteCount('goals');

        console.log('[ProgressGoals] Goals saved:', currentGoals);
    } catch (error) {
        console.error('[ProgressGoals] Error saving goals:', error);
    }
}

/**
 * Update goal displays
 */
function updateGoalDisplays() {
    const daysGoal = document.getElementById('daysGoalText');
    const moneyGoal = document.getElementById('moneyGoalText');
    const cigarettesGoal = document.getElementById('cigarettesGoalText');

    if (daysGoal) daysGoal.textContent = tr('dashboard.progress.goalDays', 'Ziel: {count} Tage', { count: currentGoals.days });
    if (moneyGoal) moneyGoal.textContent = tr('dashboard.progress.goalMoney', 'Ziel: {amount}€', { amount: currentGoals.money });
    if (cigarettesGoal) cigarettesGoal.textContent = tr('dashboard.progress.goalCigarettes', 'Ziel: {count}', { count: currentGoals.cigarettes });
}

/**
 * Setup click listeners for goal editing
 */
function setupGoalEditListeners() {
    const clickToEdit = tr('progressGoals.clickToEdit', 'Klicken zum Bearbeiten');
    const daysLabel = tr('progressGoals.days', 'Tage');
    const moneyLabel = '€';
    const cigarettesLabel = tr('progressGoals.cigarettes', 'Zigaretten');

    // Days goal
    const daysGoal = document.getElementById('daysGoalText');
    if (daysGoal) {
        daysGoal.style.cursor = 'pointer';
        daysGoal.title = clickToEdit;
        daysGoal.addEventListener('click', () => editGoal('days', tr('progressGoals.editDaysGoal', 'Tage-Ziel bearbeiten'), daysLabel));
    }

    // Money goal
    const moneyGoal = document.getElementById('moneyGoalText');
    if (moneyGoal) {
        moneyGoal.style.cursor = 'pointer';
        moneyGoal.title = clickToEdit;
        moneyGoal.addEventListener('click', () => editGoal('money', tr('progressGoals.editMoneyGoal', 'Geld-Ziel bearbeiten'), moneyLabel));
    }

    // Cigarettes goal
    const cigarettesGoal = document.getElementById('cigarettesGoalText');
    if (cigarettesGoal) {
        cigarettesGoal.style.cursor = 'pointer';
        cigarettesGoal.title = clickToEdit;
        cigarettesGoal.addEventListener('click', () => editGoal('cigarettes', tr('progressGoals.editCigarettesGoal', 'Zigaretten-Ziel bearbeiten'), cigarettesLabel));
    }
}

/**
 * Show edit modal for a goal
 */
function editGoal(goalType, title, unit) {
    const currentValue = currentGoals[goalType];
    const newGoalLabel = tr('progressGoals.newGoal', 'Neues Ziel:');
    const cancelText = tr('progressGoals.cancel', 'Abbrechen');
    const saveText = tr('progressGoals.save', 'Speichern');

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'goal-edit-modal';
    modal.innerHTML = `
        <div class="goal-edit-content">
            <h3>${title}</h3>
            <div class="goal-edit-form">
                <label for="goalInput">${newGoalLabel}</label>
                <div class="goal-input-group">
                    <input type="number" id="goalInput" value="${currentValue}" min="1" max="100000" step="1">
                    <span class="goal-unit">${unit}</span>
                </div>
                <div class="goal-edit-buttons">
                    <button class="goal-btn goal-btn-cancel" id="cancelGoalEdit">${cancelText}</button>
                    <button class="goal-btn goal-btn-save" id="saveGoalEdit">${saveText}</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Focus input and select text
    const input = document.getElementById('goalInput');
    setTimeout(() => {
        input.focus();
        input.select();
    }, 100);

    // Cancel button
    document.getElementById('cancelGoalEdit').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Save button
    document.getElementById('saveGoalEdit').addEventListener('click', async () => {
        const newValue = parseInt(input.value);

        if (isNaN(newValue) || newValue < 1 || newValue > 100000) {
            alert(tr('progressGoals.invalidValue', 'Bitte gib einen gültigen Wert zwischen 1 und 100.000 ein.'));
            return;
        }

        // Update goal
        currentGoals[goalType] = newValue;
        await saveGoals();
        updateGoalDisplays();

        // Trigger dashboard update to refresh visualizations
        if (window.updateDashboard) {
            window.updateDashboard();
        }

        document.body.removeChild(modal);
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Save on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('saveGoalEdit').click();
        }
    });

    // Cancel on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            const existingModal = document.querySelector('.goal-edit-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
            }
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}
