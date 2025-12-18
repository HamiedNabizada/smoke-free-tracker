import { calculateStats } from '../utils/calculations.js';
import { updateChart } from './charts.js';
import { updateHealthScore, updateMilestoneTimeline, updateFutureProjection, updateDetailedComparison, updateAgeGroupComparison } from './statistics.js';

// Tab switching functionality
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

            // If switching to statistics tab, redraw chart and update timeline/projection
            if (targetTab === 'statistics') {
                setTimeout(() => {
                    const stats = calculateStats();
                    updateChart(stats);
                    updateHealthScore(stats);
                    updateMilestoneTimeline(stats);
                    updateFutureProjection(stats);
                    updateDetailedComparison(stats);
                    updateAgeGroupComparison(stats);
                }, 100);
            }
        });
    });
}
