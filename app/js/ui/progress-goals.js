/**
 * Progress Goals - Editable goal management
 * Allows users to customize their progress goals
 */

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
    const user = firebase.auth().currentUser;
    if (!user) return;

    // Demo mode: use default goals
    if (typeof isDemoMode === 'function' && isDemoMode()) {
        console.log('[ProgressGoals] Demo mode - using default goals');
        return;
    }

    try {
        const docRef = firebase.firestore().collection('users').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists && doc.data().progress_goals) {
            currentGoals = { ...DEFAULT_GOALS, ...doc.data().progress_goals };
        }
    } catch (error) {
        console.error('[ProgressGoals] Error loading goals:', error);
    }
}

/**
 * Save goals to Firestore (with rate limiting)
 */
async function saveGoals() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    // Block write in demo mode
    if (typeof blockDemoWrite === 'function' && blockDemoWrite('Ziele speichern')) {
        return;
    }

    // Check write limit
    if (typeof checkWriteLimit === 'function' && !checkWriteLimit('goals')) {
        return;
    }

    try {
        await firebase.firestore().collection('users').doc(user.uid).update({
            progress_goals: currentGoals
        });

        // Track write
        if (typeof incrementWriteCount === 'function') {
            incrementWriteCount('goals');
        }

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

    if (daysGoal) daysGoal.textContent = `Ziel: ${currentGoals.days} Tage`;
    if (moneyGoal) moneyGoal.textContent = `Ziel: ${currentGoals.money}€`;
    if (cigarettesGoal) cigarettesGoal.textContent = `Ziel: ${currentGoals.cigarettes}`;
}

/**
 * Setup click listeners for goal editing
 */
function setupGoalEditListeners() {
    // Days goal
    const daysGoal = document.getElementById('daysGoalText');
    if (daysGoal) {
        daysGoal.style.cursor = 'pointer';
        daysGoal.title = 'Klicken zum Bearbeiten';
        daysGoal.addEventListener('click', () => editGoal('days', 'Tage-Ziel bearbeiten', 'Tage'));
    }

    // Money goal
    const moneyGoal = document.getElementById('moneyGoalText');
    if (moneyGoal) {
        moneyGoal.style.cursor = 'pointer';
        moneyGoal.title = 'Klicken zum Bearbeiten';
        moneyGoal.addEventListener('click', () => editGoal('money', 'Geld-Ziel bearbeiten', '€'));
    }

    // Cigarettes goal
    const cigarettesGoal = document.getElementById('cigarettesGoalText');
    if (cigarettesGoal) {
        cigarettesGoal.style.cursor = 'pointer';
        cigarettesGoal.title = 'Klicken zum Bearbeiten';
        cigarettesGoal.addEventListener('click', () => editGoal('cigarettes', 'Zigaretten-Ziel bearbeiten', 'Zigaretten'));
    }
}

/**
 * Show edit modal for a goal
 */
function editGoal(goalType, title, unit) {
    const currentValue = currentGoals[goalType];

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'goal-edit-modal';
    modal.innerHTML = `
        <div class="goal-edit-content">
            <h3>${title}</h3>
            <div class="goal-edit-form">
                <label for="goalInput">Neues Ziel:</label>
                <div class="goal-input-group">
                    <input type="number" id="goalInput" value="${currentValue}" min="1" max="100000" step="1">
                    <span class="goal-unit">${unit}</span>
                </div>
                <div class="goal-edit-buttons">
                    <button class="goal-btn goal-btn-cancel" id="cancelGoalEdit">Abbrechen</button>
                    <button class="goal-btn goal-btn-save" id="saveGoalEdit">Speichern</button>
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
            alert('Bitte gib einen gültigen Wert zwischen 1 und 100.000 ein.');
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
