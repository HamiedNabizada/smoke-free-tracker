import { calculateStats } from '../utils/calculations.js';
import { updateChart } from './charts.js';
import { updateHealthScore, updateMilestoneTimeline, updateFutureProjection, updateDetailedComparison, updateAgeGroupComparison } from './statistics.js';
import { updateHappeningNow } from './happening-now.js';
import { updateCompactCravingStats, updateCravingChart } from './craving-stats.js';

// Debounce timers for tab content loading
let statisticsTimer = null;
let milestonesTimer = null;
let helpTimer = null;
const DEBOUNCE_DELAY = 200; // ms

// Swipe detection variables
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
const TAB_ORDER = ['overview', 'milestones', 'achievements', 'statistics', 'help'];

// Lazy loading: Track which tabs have been initialized
const initializedTabs = new Set(['overview']); // Overview loads on startup

// Tab switching functionality with debounce to reduce Firebase reads
export function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Lazy load tab content - only load on first view or when needed
            loadTabContent(targetTab);
        });
    });

    // Swipe navigation for mobile
    initializeSwipeNavigation(tabButtons, tabPanels);
}

/**
 * Lazy load tab content - loads content on first view, updates on subsequent views
 */
function loadTabContent(tabName) {
    const isFirstLoad = !initializedTabs.has(tabName);

    switch (tabName) {
        case 'statistics':
            if (statisticsTimer) clearTimeout(statisticsTimer);
            statisticsTimer = setTimeout(() => {
                const stats = calculateStats();
                updateChart(stats);
                updateHealthScore(stats);
                updateMilestoneTimeline(stats);
                updateFutureProjection(stats);
                updateDetailedComparison(stats);
                updateAgeGroupComparison(stats);
                updateCravingChart();
                if (isFirstLoad) {
                    console.log('[LazyLoad] Statistics tab initialized');
                    initializedTabs.add(tabName);
                }
            }, DEBOUNCE_DELAY);
            break;

        case 'milestones':
            if (milestonesTimer) clearTimeout(milestonesTimer);
            milestonesTimer = setTimeout(() => {
                const stats = calculateStats();
                updateHappeningNow(stats);
                if (isFirstLoad) {
                    console.log('[LazyLoad] Milestones tab initialized');
                    initializedTabs.add(tabName);
                }
            }, DEBOUNCE_DELAY);
            break;

        case 'help':
            if (helpTimer) clearTimeout(helpTimer);
            helpTimer = setTimeout(() => {
                updateCompactCravingStats();
                if (isFirstLoad) {
                    console.log('[LazyLoad] Help tab initialized');
                    initializedTabs.add(tabName);
                }
            }, DEBOUNCE_DELAY);
            break;

        case 'achievements':
            // Achievements are loaded with dashboard, just mark as initialized
            if (isFirstLoad) {
                console.log('[LazyLoad] Achievements tab initialized');
                initializedTabs.add(tabName);
            }
            break;
    }
}

/**
 * Initialize swipe navigation for tab panels
 */
function initializeSwipeNavigation(tabButtons, tabPanels) {
    const tabContent = document.querySelector('.tab-content');
    if (!tabContent) return;

    tabContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    tabContent.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(tabButtons, tabPanels);
    }, { passive: true });
}

/**
 * Handle swipe gesture and navigate tabs
 */
function handleSwipe(tabButtons, tabPanels) {
    const swipeDistance = touchEndX - touchStartX;

    // Not a valid swipe
    if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) return;

    // Find current active tab
    const activeButton = document.querySelector('.tab-button.active');
    if (!activeButton) return;

    const currentTab = activeButton.dataset.tab;
    const currentIndex = TAB_ORDER.indexOf(currentTab);

    let newIndex;
    if (swipeDistance > 0) {
        // Swipe right = previous tab
        newIndex = currentIndex - 1;
    } else {
        // Swipe left = next tab
        newIndex = currentIndex + 1;
    }

    // Check bounds
    if (newIndex < 0 || newIndex >= TAB_ORDER.length) return;

    // Trigger tab change
    const newTabName = TAB_ORDER[newIndex];
    const newButton = document.querySelector(`.tab-button[data-tab="${newTabName}"]`);
    if (newButton) {
        newButton.click();
    }
}
