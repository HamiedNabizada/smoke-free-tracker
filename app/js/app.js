// Main application entry point
import { initializeDarkMode } from './ui/dark-mode.js';
import { initializeTabs } from './ui/tabs.js';
import { updateDashboard } from './ui/dashboard.js';
import { initializeCravingTimer } from './ui/craving-timer.js';
import { initializeGoalCalculator } from './ui/goal-calculator.js';
import { initializeNotifications } from './ui/notifications.js';
import { initializeTutorial } from './ui/tutorial.js';
import { initializeDataExport } from './ui/data-export.js';
import { initializeProgressGoals } from './ui/progress-goals.js';
import { initializeStreak } from './ui/streak.js';
import { initializeWeeklySummary } from './ui/weekly-summary.js';
import { initializeMiniGames } from './ui/mini-games.js';
import { initializeLotusPreview } from './ui/lotus.js';
import { initializeBreathingExercises } from './ui/breathing-exercises.js';
import { initializeOfflineQueue } from './utils/offline-queue.js';
import { initializePerformanceMonitoring } from './utils/performance.js';
import { setUserData } from './config.js';
import { checkAuth, getUserData, logoutUser, isDemoMode } from './firebase-auth.js';

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('[PWA] Service Worker registriert:', registration.scope);
            })
            .catch(error => {
                console.error('[PWA] Service Worker Registrierung fehlgeschlagen:', error);
            });
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication (redirects to login if not authenticated)
    const user = await checkAuth();
    if (!user) return;

    // Load user data from Firestore
    const userData = await getUserData();
    setUserData(userData);

    // Show demo banner if in demo mode
    if (isDemoMode()) {
        const banner = document.createElement('div');
        banner.className = 'demo-banner';
        banner.innerHTML = `
            <div class="demo-banner-content">
                <span class="demo-banner-icon">👀</span>
                <span class="demo-banner-text">Du siehst die App im Test-Modus. <a href="register.html" class="demo-banner-link">Jetzt kostenlos registrieren</a> um deine eigenen Daten zu tracken!</span>
            </div>
        `;
        document.body.prepend(banner);
    }

    // Initialize app components
    initializeDarkMode();
    initializeTabs();
    initializeCravingTimer();
    initializeGoalCalculator();
    initializeNotifications();
    initializeTutorial();
    initializeDataExport();
    initializeStreak();
    await initializeProgressGoals();
    updateDashboard();
    initializeWeeklySummary();
    initializeMiniGames();
    initializeLotusPreview();
    initializeBreathingExercises();
    initializeOfflineQueue();
    initializePerformanceMonitoring();

    // Make updateDashboard globally accessible for goal edits
    window.updateDashboard = updateDashboard;

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
        settingsBtn.addEventListener('click', async () => {
            if (usernameDisplay && user.displayName) {
                usernameDisplay.textContent = user.displayName;
            }

            // Load current user data and populate form
            try {
                const currentUserData = await getUserData();
                document.getElementById('settingsQuitDate').value = currentUserData.quit_date;
                document.getElementById('settingsCigarettesPerDay').value = currentUserData.cigarettes_per_day;
                document.getElementById('settingsPricePerPack').value = currentUserData.price_per_pack;
                document.getElementById('settingsCigarettesPerPack').value = currentUserData.cigarettes_per_pack;
            } catch (error) {
                console.error('Error loading user data:', error);
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

        // Settings form submit handler
        const settingsDataForm = document.getElementById('settingsDataForm');
        if (settingsDataForm) {
            settingsDataForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = settingsDataForm.querySelector('.save-settings-btn');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Speichern...';

                try {
                    const updates = {
                        quit_date: document.getElementById('settingsQuitDate').value,
                        cigarettes_per_day: parseInt(document.getElementById('settingsCigarettesPerDay').value),
                        price_per_pack: parseFloat(document.getElementById('settingsPricePerPack').value),
                        cigarettes_per_pack: parseInt(document.getElementById('settingsCigarettesPerPack').value)
                    };

                    await updateUserData(updates);

                    // Update local config
                    setUserData(updates);

                    // Reload page to update all statistics
                    alert('Daten erfolgreich gespeichert! Die Seite wird neu geladen.');
                    window.location.reload();
                } catch (error) {
                    console.error('Error updating user data:', error);
                    alert('Fehler beim Speichern der Daten: ' + error.message);
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Speichern';
                }
            });
        }

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
