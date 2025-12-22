import { calculateStats } from '../utils/calculations.js';
import { updateChart } from './charts.js';
import { updateHealthScore, updateMilestoneTimeline, updateFutureProjection, updateDetailedComparison, updateAgeGroupComparison } from './statistics.js';
import { updateHappeningNow } from './happening-now.js';
import { updateCompactCravingStats, updateCravingChart } from './craving-stats.js';
import { updateCravingHeatmap } from './craving-heatmap.js';

// Debounce timers for tab content loading
let statisticsTimer = null;
let milestonesTimer = null;
let helpTimer = null;
const DEBOUNCE_DELAY = 200; // ms

// Swipe detection variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const SWIPE_THRESHOLD = 80; // Minimum horizontal distance for swipe
const SWIPE_VERTICAL_LIMIT = 100; // Max vertical movement allowed
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

            // Remove active class and update aria-selected for all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class and aria-selected to clicked button
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Lazy load tab content - only load on first view or when needed
            loadTabContent(targetTab);
        });

        // Keyboard navigation for tabs
        button.addEventListener('keydown', (e) => {
            let newIndex;
            const currentIndex = TAB_ORDER.indexOf(button.dataset.tab);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (currentIndex + 1) % TAB_ORDER.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
            } else if (e.key === 'Home') {
                e.preventDefault();
                newIndex = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                newIndex = TAB_ORDER.length - 1;
            }

            if (newIndex !== undefined) {
                const newButton = document.querySelector(`.tab-button[data-tab="${TAB_ORDER[newIndex]}"]`);
                if (newButton) {
                    newButton.focus();
                    newButton.click();
                }
            }
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
                updateCravingHeatmap();
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
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;

    dashboard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    dashboard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

/**
 * Handle swipe gesture and navigate tabs
 */
function handleSwipe() {
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = Math.abs(touchEndY - touchStartY);

    // Ignore if vertical movement is too large (user is scrolling)
    if (swipeDistanceY > SWIPE_VERTICAL_LIMIT) return;

    // Ignore if horizontal movement is too small
    if (Math.abs(swipeDistanceX) < SWIPE_THRESHOLD) return;

    // Find current active tab
    const activeButton = document.querySelector('.tab-button.active');
    if (!activeButton) return;

    const currentTab = activeButton.dataset.tab;
    const currentIndex = TAB_ORDER.indexOf(currentTab);

    let newIndex;
    if (swipeDistanceX > 0) {
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
