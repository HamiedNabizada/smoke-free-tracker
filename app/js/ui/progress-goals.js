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
 * Save goals to Firestore
 */
async function saveGoals() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        await firebase.firestore().collection('users').doc(user.uid).update({
            progress_goals: currentGoals
        });
        console.log('[ProgressGoals] Goals saved:', currentGoals);
    } catch (error) {
        console.error('[ProgressGoals] Error saving goals:', error);
    }
}

/**
 * Update goal displays
 */
function updateGoalDisplays() {
    document.getElementById('treeGoalText').textContent = `Ziel: ${currentGoals.days} Tage`;
    document.getElementById('piggyGoalText').textContent = `Ziel: ${currentGoals.money}€`;
    document.getElementById('cemeteryGoalText').textContent = `Ziel: ${currentGoals.cigarettes}`;
}

/**
 * Setup click listeners for goal editing
 */
function setupGoalEditListeners() {
    // Tree goal (Days)
    const treeGoal = document.getElementById('treeGoalText');
    treeGoal.style.cursor = 'pointer';
    treeGoal.title = 'Klicken zum Bearbeiten';
    treeGoal.addEventListener('click', () => editGoal('days', 'Tage-Ziel bearbeiten', 'Tage'));

    // Piggy goal (Money)
    const piggyGoal = document.getElementById('piggyGoalText');
    piggyGoal.style.cursor = 'pointer';
    piggyGoal.title = 'Klicken zum Bearbeiten';
    piggyGoal.addEventListener('click', () => editGoal('money', 'Geld-Ziel bearbeiten', '€'));

    // Cemetery goal (Cigarettes)
    const cemeteryGoal = document.getElementById('cemeteryGoalText');
    cemeteryGoal.style.cursor = 'pointer';
    cemeteryGoal.title = 'Klicken zum Bearbeiten';
    cemeteryGoal.addEventListener('click', () => editGoal('cigarettes', 'Zigaretten-Ziel bearbeiten', 'Zigaretten'));
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
