/**
 * Weekly Summary Module
 * Shows a summary of the past week on first visit of the week
 */

import { calculateStats } from '../utils/calculations.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

const STORAGE_KEY = 'weekly_summary_last_shown';

/**
 * Initialize weekly summary check
 */
export function initializeWeeklySummary() {
    if (shouldShowSummary()) {
        showWeeklySummary();
    }
}

/**
 * Check if we should show the summary
 */
function shouldShowSummary() {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (!lastShown) return true;

    const lastShownDate = new Date(lastShown);
    const now = new Date();

    // Get Monday of current week
    const currentMonday = getMonday(now);
    const lastMonday = getMonday(lastShownDate);

    // Show if we're in a new week
    return currentMonday > lastMonday;
}

/**
 * Get Monday of a given week
 */
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Show the weekly summary modal
 */
function showWeeklySummary() {
    const stats = calculateStats();

    // Calculate last week's stats (approximation based on current progress)
    const daysSmokeFree = stats.totalDays;
    const weekDays = Math.min(7, daysSmokeFree);
    const weekMoney = (stats.money / daysSmokeFree * weekDays).toFixed(2);
    const weekCigarettes = Math.round(stats.cigarettes / daysSmokeFree * weekDays);

    // Get craving count from last week (from localStorage if available)
    const lastWeekCravings = getLastWeekCravings();

    // Translations
    const titleText = tr('weeklySummary.title', 'Dein Wochenrückblick');
    const savedText = tr('weeklySummary.saved', 'gespart');
    const avoidedText = tr('weeklySummary.avoided', 'Zigaretten vermieden');
    const cravingsText = tr('weeklySummary.cravingsOvercome', 'Cravings überwunden');
    const totalDaysText = tr('weeklySummary.totalDays', 'Tage rauchfrei insgesamt');
    const messageText = tr('weeklySummary.message', 'Weiter so - du machst das großartig!');
    const buttonText = tr('weeklySummary.button', 'Alles klar!');

    const modal = document.createElement('div');
    modal.className = 'weekly-summary-overlay';
    modal.innerHTML = `
        <div class="weekly-summary-modal">
            <div class="weekly-summary-header">
                <span class="weekly-summary-icon">📊</span>
                <h2>${titleText}</h2>
            </div>
            <div class="weekly-summary-content">
                <div class="weekly-stat">
                    <span class="weekly-stat-icon">💰</span>
                    <span class="weekly-stat-value">${weekMoney}€</span>
                    <span class="weekly-stat-label">${savedText}</span>
                </div>
                <div class="weekly-stat">
                    <span class="weekly-stat-icon">🚭</span>
                    <span class="weekly-stat-value">${weekCigarettes}</span>
                    <span class="weekly-stat-label">${avoidedText}</span>
                </div>
                ${lastWeekCravings > 0 ? `
                <div class="weekly-stat">
                    <span class="weekly-stat-icon">💪</span>
                    <span class="weekly-stat-value">${lastWeekCravings}</span>
                    <span class="weekly-stat-label">${cravingsText}</span>
                </div>
                ` : ''}
                <div class="weekly-stat highlight">
                    <span class="weekly-stat-icon">📅</span>
                    <span class="weekly-stat-value">${daysSmokeFree}</span>
                    <span class="weekly-stat-label">${totalDaysText}</span>
                </div>
            </div>
            <p class="weekly-summary-message">${messageText}</p>
            <button class="weekly-summary-close">${buttonText}</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Close button handler
    modal.querySelector('.weekly-summary-close').addEventListener('click', () => {
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 300);
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.querySelector('.weekly-summary-close').click();
        }
    });
}

/**
 * Get craving count from last week (sum of localStorage entries)
 */
function getLastWeekCravings() {
    // This would require tracking daily craving counts locally
    // For now, return 0 as we don't have this data in localStorage
    // The craving data is in Firestore, but we want to avoid reads
    return 0;
}
