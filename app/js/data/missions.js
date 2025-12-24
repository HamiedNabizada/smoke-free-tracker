/**
 * Daily Mini-Missions
 * Evidence-based tasks that help with smoking cessation
 *
 * Categories:
 * - hydration: Water intake helps reduce cravings
 * - movement: Exercise reduces cravings for up to 50 minutes
 * - mindfulness: Awareness and reflection support quitting
 * - environment: Removing triggers helps avoid relapse
 * - social: Support from others increases success rate
 * - health: Focus on health benefits of quitting
 */

export const dailyMissions = [
    // Hydration (water helps with cravings and detox)
    { id: 'water8', category: 'hydration', icon: '💧' },
    { id: 'herbalTea', category: 'hydration', icon: '🍵' },
    { id: 'fruitWater', category: 'hydration', icon: '🍋' },

    // Movement (exercise reduces cravings - strong evidence)
    { id: 'walk15', category: 'movement', icon: '🚶' },
    { id: 'stairs', category: 'movement', icon: '🏃' },
    { id: 'stretch10', category: 'movement', icon: '🧘' },
    { id: 'danceBreak', category: 'movement', icon: '💃' },
    { id: 'outdoor', category: 'movement', icon: '🌳' },

    // Mindfulness (awareness helps identify and manage triggers)
    { id: 'breathe5', category: 'mindfulness', icon: '🫁' },
    { id: 'gratitude3', category: 'mindfulness', icon: '🙏' },
    { id: 'journal', category: 'mindfulness', icon: '📝' },
    { id: 'reasons3', category: 'mindfulness', icon: '💭' },
    { id: 'visualize', category: 'mindfulness', icon: '🎯' },

    // Environment (removing triggers)
    { id: 'cleanAshtray', category: 'environment', icon: '🧹' },
    { id: 'freshAir', category: 'environment', icon: '🪟' },
    { id: 'avoidTrigger', category: 'environment', icon: '🚫' },
    { id: 'newRoute', category: 'environment', icon: '🗺️' },

    // Social (support increases success)
    { id: 'tellSomeone', category: 'social', icon: '💬' },
    { id: 'thankSupporter', category: 'social', icon: '❤️' },
    { id: 'helpOther', category: 'social', icon: '🤝' },

    // Health focus
    { id: 'healthySnack', category: 'health', icon: '🍎' },
    { id: 'noAlcohol', category: 'health', icon: '🚱' },
    { id: 'sleepEarly', category: 'health', icon: '😴' },
    { id: 'vitaminC', category: 'health', icon: '🍊' },
    { id: 'brushTeeth', category: 'health', icon: '🦷' },

    // Rewards and self-care
    { id: 'treatYourself', category: 'reward', icon: '🎁' },
    { id: 'relaxBath', category: 'reward', icon: '🛁' },
    { id: 'favoriteMusic', category: 'reward', icon: '🎵' },
    { id: 'callFriend', category: 'social', icon: '📞' },

    // Progress awareness
    { id: 'checkProgress', category: 'mindfulness', icon: '📊' },
    { id: 'celebrateWin', category: 'reward', icon: '🏆' }
];

/**
 * Get today's mission based on the current date
 * Uses a deterministic algorithm so all users see the same mission on the same day
 */
export function getTodaysMission() {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const missionIndex = dayOfYear % dailyMissions.length;
    return dailyMissions[missionIndex];
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Check if today's mission is completed
 */
export function isMissionCompleted() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const completedDate = localStorage.getItem('missionCompletedDate');
    return completedDate === today;
}

/**
 * Mark today's mission as completed
 */
export function completeMission() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('missionCompletedDate', today);

    // Track completion count
    const count = parseInt(localStorage.getItem('missionsCompletedTotal') || '0', 10);
    localStorage.setItem('missionsCompletedTotal', (count + 1).toString());

    return count + 1;
}

/**
 * Get total missions completed
 */
export function getMissionsCompletedTotal() {
    return parseInt(localStorage.getItem('missionsCompletedTotal') || '0', 10);
}
