// Main application entry point
import { initializeDarkMode } from './ui/dark-mode.js';
import { initializeTabs } from './ui/tabs.js';
import { updateDashboard } from './ui/dashboard.js';
import { initializeCravingTimer } from './ui/craving-timer.js';
import { initializeGoalCalculator } from './ui/goal-calculator.js';

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registriert:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker Registrierung fehlgeschlagen:', error);
            });
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    initializeTabs();
    initializeCravingTimer();
    initializeGoalCalculator();
    updateDashboard();
});

// Update dashboard every minute
setInterval(() => {
    updateDashboard();
}, 60000);
