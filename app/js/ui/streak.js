/**
 * Streak Counter Module
 * Tracks consecutive days the user opened the app
 * Stored in localStorage (no Firebase costs)
 */

const STREAK_KEYS = {
    LAST_VISIT: 'streak_last_visit',
    COUNT: 'streak_count'
};

/**
 * Initialize streak tracking on app load
 * Returns current streak count
 */
export function initializeStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = localStorage.getItem(STREAK_KEYS.LAST_VISIT);
    let streak = parseInt(localStorage.getItem(STREAK_KEYS.COUNT) || '0', 10);

    if (!lastVisit) {
        // First visit ever
        streak = 1;
    } else if (lastVisit === today) {
        // Already visited today, keep streak
    } else {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day - increase streak
            streak++;
        } else if (diffDays > 1) {
            // Missed days - reset streak
            streak = 1;
        }
    }

    // Save updated values
    localStorage.setItem(STREAK_KEYS.LAST_VISIT, today);
    localStorage.setItem(STREAK_KEYS.COUNT, streak.toString());

    // Update UI
    updateStreakDisplay(streak);

    return streak;
}

/**
 * Get current streak without updating
 */
export function getStreak() {
    return parseInt(localStorage.getItem(STREAK_KEYS.COUNT) || '0', 10);
}

/**
 * Update streak display in the UI
 */
function updateStreakDisplay(streak) {
    const container = document.getElementById('streakContainer');
    if (!container) return;

    // Only show if streak > 1
    if (streak <= 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';

    const countEl = document.getElementById('streakCount');
    if (countEl) {
        countEl.textContent = streak;
    }

    // Add fire effect for high streaks
    const fireEl = document.getElementById('streakFire');
    if (fireEl) {
        if (streak >= 7) {
            fireEl.classList.add('hot');
        }
        if (streak >= 30) {
            fireEl.classList.add('blazing');
        }
    }
}
