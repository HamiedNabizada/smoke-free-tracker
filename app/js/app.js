// Main application entry point
import { initializeDarkMode } from './ui/dark-mode.js';
import { initializeTabs } from './ui/tabs.js';
import { updateDashboard } from './ui/dashboard.js';
import { initializeCravingTimer } from './ui/craving-timer.js';
import { initializeGoalCalculator } from './ui/goal-calculator.js';
import { setUserData } from './config.js';

// Register Service Worker for PWA functionality
// DEAKTIVIERT - Service Worker hatte falsche Cache-Pfade
/*
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
*/

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication (redirects to login if not authenticated)
    const user = await checkAuth();
    if (!user) return;

    // Load user data from Firestore
    const userData = await getUserData();
    setUserData(userData);

    // Initialize app components
    initializeDarkMode();
    initializeTabs();
    initializeCravingTimer();
    initializeGoalCalculator();
    updateDashboard();

    // Add logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await logoutUser();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout Fehler:', error);
                alert('Logout fehlgeschlagen. Bitte versuche es erneut.');
            }
        });
    }

    // Add settings button handler
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.getElementById('settingsCloseBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (settingsBtn && settingsModal) {
        // Show settings modal
        settingsBtn.addEventListener('click', () => {
            if (usernameDisplay && user.displayName) {
                usernameDisplay.textContent = user.displayName;
            }
            settingsModal.classList.remove('hidden');
        });

        // Close settings modal
        if (settingsCloseBtn) {
            settingsCloseBtn.addEventListener('click', () => {
                settingsModal.classList.add('hidden');
            });
        }

        // Close modal when clicking outside
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });

        // Delete account button
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', async () => {
                const result = await deleteAccount();
                if (result) {
                    settingsModal.classList.add('hidden');
                }
            });
        }
    }
});

// Update dashboard every minute
setInterval(() => {
    updateDashboard();
}, 60000);
