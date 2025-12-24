/**
 * Daily Mini-Missions
 * Ordered by quit day progression - accompanies the quit journey logically
 *
 * Day 1-3: Environment cleanup, remove triggers
 * Day 4-7: First week survival, hydration, movement
 * Day 8-14: Building new routines
 * Day 15-30: Establishing long-term habits
 * Day 31+: Cycles back
 */

export const dailyMissions = [
    // Day 1-3: Environment cleanup and first steps
    { id: 'cleanAshtray', icon: '🧹', day: 1 },      // Day 1: Remove all smoking items
    { id: 'freshAir', icon: '🪟', day: 2 },          // Day 2: Air out everything
    { id: 'water8', icon: '💧', day: 3 },            // Day 3: Start hydration habit

    // Day 4-7: First week - focus on basics
    { id: 'walk15', icon: '🚶', day: 4 },            // Day 4: Movement helps with cravings
    { id: 'breathe5', icon: '🫁', day: 5 },          // Day 5: Breathing exercises
    { id: 'reasons3', icon: '💭', day: 6 },          // Day 6: Remember why you quit
    { id: 'treatYourself', icon: '🎁', day: 7 },     // Day 7: Celebrate first week!

    // Day 8-14: Second week - building routines
    { id: 'healthySnack', icon: '🍎', day: 8 },      // Day 8: Healthy eating
    { id: 'newRoute', icon: '🗺️', day: 9 },          // Day 9: Avoid trigger places
    { id: 'stretch10', icon: '🧘', day: 10 },        // Day 10: Stretching routine
    { id: 'herbalTea', icon: '🍵', day: 11 },        // Day 11: Tea instead of smoke break
    { id: 'gratitude3', icon: '🙏', day: 12 },       // Day 12: Gratitude practice
    { id: 'tellSomeone', icon: '💬', day: 13 },      // Day 13: Share your success
    { id: 'checkProgress', icon: '📊', day: 14 },    // Day 14: Two weeks! Check progress

    // Day 15-21: Third week - deepening habits
    { id: 'outdoor', icon: '🌳', day: 15 },          // Day 15: Nature time
    { id: 'noAlcohol', icon: '🚱', day: 16 },        // Day 16: Avoid alcohol trigger
    { id: 'journal', icon: '📝', day: 17 },          // Day 17: Reflect on journey
    { id: 'stairs', icon: '🏃', day: 18 },           // Day 18: More movement
    { id: 'thankSupporter', icon: '❤️', day: 19 },   // Day 19: Thank someone
    { id: 'vitaminC', icon: '🍊', day: 20 },         // Day 20: Nutrition focus
    { id: 'celebrateWin', icon: '🏆', day: 21 },     // Day 21: Three weeks!

    // Day 22-30: Fourth week - maintaining momentum
    { id: 'danceBreak', icon: '💃', day: 22 },       // Day 22: Fun movement
    { id: 'visualize', icon: '🎯', day: 23 },        // Day 23: Visualize success
    { id: 'sleepEarly', icon: '😴', day: 24 },       // Day 24: Good sleep
    { id: 'callFriend', icon: '📞', day: 25 },       // Day 25: Social connection
    { id: 'brushTeeth', icon: '🦷', day: 26 },       // Day 26: Enjoy clean teeth
    { id: 'fruitWater', icon: '🍋', day: 27 },       // Day 27: Hydration variety
    { id: 'helpOther', icon: '🤝', day: 28 },        // Day 28: Help someone else
    { id: 'relaxBath', icon: '🛁', day: 29 },        // Day 29: Self-care
    { id: 'favoriteMusic', icon: '🎵', day: 30 },    // Day 30: One month celebration!

    // Bonus missions for variety after day 30
    { id: 'avoidTrigger', icon: '🚫', day: 31 },
    { id: 'walkInPlace', icon: '🚶', day: 32 },
    { id: 'jogging', icon: '🏃', day: 33 },
    { id: 'officeWalk', icon: '🏢', day: 34 },
    { id: 'calfRaises', icon: '🧍', day: 35 },
    { id: 'neckRolls', icon: '🧘', day: 36 },
    { id: 'shoulderRolls', icon: '🔄', day: 37 },
    { id: 'shakeItOff', icon: '🤸', day: 38 }
];

/**
 * Get today's mission based on days since quit date
 * @param {number} daysSinceQuit - Number of days since quit date
 * @returns {object|null} Mission object or null if all missions completed
 */
export function getTodaysMission(daysSinceQuit) {
    // Day 0 or negative = not yet quit, show day 1 mission
    const day = Math.max(1, Math.floor(daysSinceQuit) + 1);

    // No more missions after all are done
    if (day > dailyMissions.length) {
        return null;
    }

    return dailyMissions[day - 1];
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
