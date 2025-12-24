/**
 * Daily Mission UI Module
 * Displays and manages daily mini-missions based on quit journey
 */

import { getTodaysMission, isMissionCompleted, completeMission, getMissionsCompletedTotal } from '../data/missions.js';
import { t, isInitialized } from '../i18n/i18n.js';
import { userData } from '../config.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

/**
 * Calculate days since quit date
 */
function getDaysSinceQuit() {
    if (!userData || !userData.quitDate) return 0;

    const quitDate = new Date(userData.quitDate);
    const now = new Date();
    const diffMs = now - quitDate;
    return diffMs / (1000 * 60 * 60 * 24);
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
    const daysSinceQuit = getDaysSinceQuit();
    const mission = getTodaysMission(daysSinceQuit);
    const cardEl = document.getElementById('missionCard');

    // No more missions - hide the card
    if (!mission) {
        if (cardEl) cardEl.classList.add('hidden');
        return;
    }

    // Show card if hidden
    if (cardEl) cardEl.classList.remove('hidden');

    const isCompleted = isMissionCompleted();
    const totalCompleted = getMissionsCompletedTotal();

    const iconEl = document.getElementById('missionIcon');
    const textEl = document.getElementById('missionText');
    const streakEl = document.getElementById('missionStreak');
    const completeBtn = document.getElementById('missionCompleteBtn');
    const completedEl = document.getElementById('missionCompleted');

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
        // Day 1-3: Environment cleanup
        cleanAshtray: 'Räume alle Aschenbecher und Raucherutensilien weg',
        freshAir: 'Lüfte alle Räume gründlich durch',
        water8: 'Trink heute 8 Gläser Wasser',

        // Day 4-7: First week
        walk15: 'Mach einen 15-minütigen Spaziergang',
        breathe5: 'Mach 5 Minuten bewusste Atemübungen',
        reasons3: 'Erinnere dich an 3 Gründe, warum du aufgehört hast',
        treatYourself: 'Gönn dir etwas Schönes mit dem gesparten Geld',

        // Day 8-14: Second week
        healthySnack: 'Iss heute nur gesunde Snacks (Obst, Gemüse, Nüsse)',
        newRoute: 'Nimm einen anderen Weg zur Arbeit oder zum Einkaufen',
        stretch10: 'Dehne dich 10 Minuten lang',
        herbalTea: 'Genieße eine Tasse Kräutertee',
        gratitude3: 'Schreibe 3 Dinge auf, für die du dankbar bist',
        tellSomeone: 'Erzähle jemandem von deinem Rauchstopp-Erfolg',
        checkProgress: 'Schau dir deine Fortschritte in der App an',

        // Day 15-21: Third week
        outdoor: 'Verbringe 20 Minuten draußen in der Natur',
        noAlcohol: 'Verzichte heute auf Alkohol',
        journal: 'Schreibe kurz auf, wie du dich heute fühlst',
        stairs: 'Nimm heute immer die Treppe statt den Aufzug',
        thankSupporter: 'Bedanke dich bei jemandem, der dich unterstützt',
        vitaminC: 'Iss etwas Vitamin-C-reiches (Orange, Paprika, Kiwi)',
        celebrateWin: 'Feiere deinen bisherigen Erfolg - du machst das großartig!',

        // Day 22-30: Fourth week
        danceBreak: 'Tanz 5 Minuten zu deinem Lieblingslied',
        visualize: 'Stell dir 5 Min. dein gesünderes Leben als Nichtraucher vor',
        sleepEarly: 'Geh heute eine Stunde früher ins Bett',
        callFriend: 'Ruf einen Freund oder Familienmitglied an',
        brushTeeth: 'Putz dir nach jeder Mahlzeit die Zähne',
        fruitWater: 'Mach dir Wasser mit Zitrone oder Früchten',
        helpOther: 'Ermutige jemand anderen, der aufhören will',
        relaxBath: 'Nimm ein entspannendes Bad oder eine lange Dusche',
        favoriteMusic: 'Höre eine Stunde lang deine Lieblingsmusik',

        // Day 31+: Bonus
        avoidTrigger: 'Meide heute bewusst einen Ort, an dem du früher geraucht hast',
        walkInPlace: 'Geh 5 Minuten auf der Stelle',
        jogging: 'Jogge 10 Minuten - drinnen oder draußen',
        officeWalk: 'Steh auf und geh 5 Minuten durch den Raum',
        calfRaises: 'Mach 20 Wadenheben',
        neckRolls: 'Kreise deinen Kopf langsam - Nacken lockern',
        shoulderRolls: 'Kreise deine Schultern 10x nach hinten',
        shakeItOff: 'Schüttel dich 30 Sekunden komplett aus'
    };

    return fallbacks[id] || 'Bleib stark - du schaffst das!';
}
