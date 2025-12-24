/**
 * Daily Mission UI Module
 * Displays and manages daily mini-missions
 */

import { getTodaysMission, isMissionCompleted, completeMission, getMissionsCompletedTotal } from '../data/missions.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

/**
 * Initialize the daily mission display
 */
export function initializeDailyMission() {
    const completeBtn = document.getElementById('missionCompleteBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', handleMissionComplete);
    }

    updateMissionDisplay();
}

/**
 * Update the mission display with today's mission
 */
export function updateMissionDisplay() {
    const mission = getTodaysMission();
    const isCompleted = isMissionCompleted();
    const totalCompleted = getMissionsCompletedTotal();

    const iconEl = document.getElementById('missionIcon');
    const textEl = document.getElementById('missionText');
    const streakEl = document.getElementById('missionStreak');
    const completeBtn = document.getElementById('missionCompleteBtn');
    const completedEl = document.getElementById('missionCompleted');
    const cardEl = document.getElementById('missionCard');

    if (!iconEl || !textEl) return;

    // Set mission content
    iconEl.textContent = mission.icon;
    textEl.textContent = tr(`mission.tasks.${mission.id}`, getMissionFallback(mission.id));

    // Show streak if any missions completed
    if (streakEl && totalCompleted > 0) {
        streakEl.textContent = tr('mission.streak', '{count}x erledigt', { count: totalCompleted });
        streakEl.classList.remove('hidden');
    }

    // Update completion state
    if (isCompleted) {
        if (completeBtn) completeBtn.classList.add('hidden');
        if (completedEl) completedEl.classList.remove('hidden');
        if (cardEl) cardEl.classList.add('completed');
    } else {
        if (completeBtn) completeBtn.classList.remove('hidden');
        if (completedEl) completedEl.classList.add('hidden');
        if (cardEl) cardEl.classList.remove('completed');
    }
}

/**
 * Handle mission completion
 */
function handleMissionComplete() {
    const totalCompleted = completeMission();

    const completeBtn = document.getElementById('missionCompleteBtn');
    const completedEl = document.getElementById('missionCompleted');
    const cardEl = document.getElementById('missionCard');
    const streakEl = document.getElementById('missionStreak');

    // Animate completion
    if (completeBtn) {
        completeBtn.classList.add('completing');
        setTimeout(() => {
            completeBtn.classList.add('hidden');
            completeBtn.classList.remove('completing');
        }, 300);
    }

    if (completedEl) {
        completedEl.classList.remove('hidden');
        completedEl.classList.add('celebrating');
        setTimeout(() => {
            completedEl.classList.remove('celebrating');
        }, 1000);
    }

    if (cardEl) {
        cardEl.classList.add('completed');
    }

    // Update streak
    if (streakEl) {
        streakEl.textContent = tr('mission.streak', '{count}x erledigt', { count: totalCompleted });
        streakEl.classList.remove('hidden');
    }
}

/**
 * Get fallback text for mission (in case i18n not loaded)
 */
function getMissionFallback(id) {
    const fallbacks = {
        // Hydration
        water8: 'Trink heute 8 Gläser Wasser',
        herbalTea: 'Genieße eine Tasse Kräutertee',
        fruitWater: 'Mach dir Wasser mit Zitrone oder Früchten',

        // Movement
        walk15: 'Mach einen 15-minütigen Spaziergang',
        stairs: 'Nimm heute immer die Treppe statt den Aufzug',
        stretch10: 'Dehne dich 10 Minuten lang',
        danceBreak: 'Tanz 5 Minuten zu deinem Lieblingslied',
        outdoor: 'Verbringe 20 Minuten draußen in der Natur',

        // Mindfulness
        breathe5: 'Mach 5 Minuten bewusste Atemübungen',
        gratitude3: 'Schreibe 3 Dinge auf, für die du dankbar bist',
        journal: 'Schreibe kurz auf, wie du dich heute fühlst',
        reasons3: 'Erinnere dich an 3 Gründe, warum du aufgehört hast',
        visualize: 'Stell dir 5 Min. dein gesünderes Leben als Nichtraucher vor',

        // Environment
        cleanAshtray: 'Räume alle Aschenbecher und Raucherutensilien weg',
        freshAir: 'Lüfte alle Räume gründlich durch',
        avoidTrigger: 'Meide heute bewusst einen Ort, an dem du früher geraucht hast',
        newRoute: 'Nimm einen anderen Weg zur Arbeit oder zum Einkaufen',

        // Social
        tellSomeone: 'Erzähle jemandem von deinem Rauchstopp-Erfolg',
        thankSupporter: 'Bedanke dich bei jemandem, der dich unterstützt',
        helpOther: 'Ermutige jemand anderen, der aufhören will',
        callFriend: 'Ruf einen Freund oder Familienmitglied an',

        // Health
        healthySnack: 'Iss heute nur gesunde Snacks (Obst, Gemüse, Nüsse)',
        noAlcohol: 'Verzichte heute auf Alkohol',
        sleepEarly: 'Geh heute eine Stunde früher ins Bett',
        vitaminC: 'Iss etwas Vitamin-C-reiches (Orange, Paprika, Kiwi)',
        brushTeeth: 'Putz dir nach jeder Mahlzeit die Zähne',

        // Rewards
        treatYourself: 'Gönn dir etwas Schönes mit dem gesparten Geld',
        relaxBath: 'Nimm ein entspannendes Bad oder eine lange Dusche',
        favoriteMusic: 'Höre eine Stunde lang deine Lieblingsmusik',

        // Progress
        checkProgress: 'Schau dir deine Fortschritte in der App an',
        celebrateWin: 'Feiere deinen bisherigen Erfolg - du machst das großartig!'
    };

    return fallbacks[id] || 'Bleib stark - du schaffst das!';
}
