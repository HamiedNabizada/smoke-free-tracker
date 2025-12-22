import { calculateStats } from '../utils/calculations.js';
import { getDailyMotivation } from '../data/motivations.js';
import { quitStatistics } from '../data/motivations.js';
import { healthMilestones } from '../data/milestones.js';
import { updateHealthMilestones } from './milestones.js';
import { updateAchievements } from './achievements.js';
import { updateChart } from './charts.js';
import { updateHealthScore, updateMilestoneTimeline, updateFutureProjection, updateDetailedComparison, updateAgeGroupComparison } from './statistics.js';
import { updateHealthAvatar } from './health-avatar.js';
import { updateProgressVisuals } from './progress-visuals.js';
import { updateHappeningNow } from './happening-now.js';
import { checkMilestoneNotifications } from './notifications.js';

export function updateDashboard() {
    const stats = calculateStats();

    // Update daily motivation
    document.getElementById('dailyMotivation').textContent = getDailyMotivation();

    // Update health avatar
    updateHealthAvatar(stats);

    // Update stats - show hours and minutes if less than 1 day, otherwise show days
    let timeDisplay;
    if (stats.totalDays < 1) {
        if (stats.totalDays < (1/24)) {
            // Less than 1 hour - show minutes
            timeDisplay = `${stats.minutes} Min`;
        } else {
            // Less than 1 day - show hours and minutes
            timeDisplay = `${stats.hours}h ${stats.minutes}m`;
        }
    } else {
        // More than 1 day - show days, hours, minutes
        timeDisplay = `${stats.days}d ${stats.hours}h ${stats.minutes}m`;
    }

    document.getElementById('daysSmokeFree').textContent = timeDisplay;
    document.getElementById('moneySaved').textContent = stats.money.toFixed(2) + ' €';
    document.getElementById('cigarettesNotSmoked').textContent = stats.cigarettes;

    // Update lifetime gained
    let lifeDisplay;
    if (stats.lifeGained.days > 0) {
        lifeDisplay = `${stats.lifeGained.days}d ${stats.lifeGained.hours}h`;
    } else {
        lifeDisplay = `${stats.lifeGained.totalHours}h`;
    }
    document.getElementById('lifeGained').textContent = lifeDisplay;

    // Update toxins avoided
    document.getElementById('toxinsAvoided').textContent = stats.toxins.toFixed(1) + ' g';

    // Update lung health
    document.getElementById('lungHealth').textContent = stats.lungHealth + '%';
    const lungCard = document.getElementById('lungHealth').closest('.stat-card');
    if (stats.lungHealth > 10) {
        lungCard.classList.add('improving');
    }

    // Update time saved
    let timeSavedDisplay;
    if (stats.timeSaved.days > 0) {
        timeSavedDisplay = `${stats.timeSaved.days}d ${stats.timeSaved.hours}h`;
    } else if (stats.timeSaved.totalHours > 0) {
        timeSavedDisplay = `${stats.timeSaved.totalHours}h`;
    } else {
        timeSavedDisplay = `${stats.timeSaved.totalMinutes}m`;
    }
    document.getElementById('timeSaved').textContent = timeSavedDisplay;

    // Update CO2 avoided
    document.getElementById('co2Avoided').textContent = stats.co2Avoided.toFixed(2) + ' kg';

    // Update skin age improvement (Mailänder Studie: max 13 Jahre Verjüngung)
    const skinAgeEl = document.getElementById('skinAge');
    if (skinAgeEl) {
        if (stats.skinAge >= 1) {
            skinAgeEl.textContent = stats.skinAge.toFixed(1) + ' Jahre';
        } else if (stats.skinAge >= 0.1) {
            // Unter 1 Jahr: in Monaten anzeigen
            const months = Math.round(stats.skinAge * 12);
            skinAgeEl.textContent = months + ' Monate';
        } else {
            skinAgeEl.textContent = '< 1 Monat';
        }
    }

    // Update environmental stats
    document.getElementById('waterSaved').textContent = Math.floor(stats.waterSaved).toLocaleString('de-DE');
    document.getElementById('treesSaved').textContent = stats.treesSaved.toFixed(2);

    // Update next milestone progress
    updateNextMilestoneProgress(stats);

    // Update progress visualizations
    updateProgressVisuals(stats);

    // Update comparison stats
    updateComparisonStats(stats);

    // Update health milestones
    updateHealthMilestones(stats.totalDays);

    // Check for milestone notifications
    const currentMilestone = findCurrentMilestone(stats.totalDays);
    if (currentMilestone) {
        checkMilestoneNotifications(currentMilestone);
    }

    // Update achievements
    updateAchievements(stats);

    // Update chart
    updateChart(stats);

    // Update milestone timeline (only if statistics tab, to save performance)
    if (document.querySelector('[data-tab="statistics"]').classList.contains('active')) {
        updateHealthScore(stats);
        updateMilestoneTimeline(stats);
        updateFutureProjection(stats);
        updateDetailedComparison(stats);
        updateAgeGroupComparison(stats);
    }

    // Update "What's Happening NOW" (only if milestones tab)
    if (document.querySelector('[data-tab="milestones"]').classList.contains('active')) {
        updateHappeningNow(stats);
    }
}

export function updateNextMilestoneProgress(stats) {
    const container = document.getElementById('nextMilestoneProgress');
    if (!container) return;

    // Find next unachieved milestone
    let nextMilestone = null;
    for (const milestone of healthMilestones) {
        if (stats.totalDays < milestone.days) {
            nextMilestone = milestone;
            break;
        }
    }

    if (!nextMilestone) {
        // All milestones achieved
        container.innerHTML = `
            <div class="next-milestone-content">
                <div class="next-milestone-icon">🎉</div>
                <div>
                    <div class="next-milestone-title">Alle Meilensteine erreicht!</div>
                    <div class="next-milestone-desc">Du hast alle Gesundheitsmeilensteine gemeistert!</div>
                </div>
            </div>
        `;
        return;
    }

    // Calculate progress to next milestone
    const progress = (stats.totalDays / nextMilestone.days) * 100;
    const daysRemaining = nextMilestone.days - stats.totalDays;

    let timeRemaining;
    if (daysRemaining < 1) {
        const hoursRemaining = Math.ceil(daysRemaining * 24);
        timeRemaining = `${hoursRemaining} Std.`;
    } else if (daysRemaining < 7) {
        timeRemaining = `${Math.ceil(daysRemaining)} Tag${Math.ceil(daysRemaining) === 1 ? '' : 'en'}`;
    } else if (daysRemaining < 30) {
        const weeks = Math.ceil(daysRemaining / 7);
        timeRemaining = `${weeks} Woche${weeks === 1 ? '' : 'n'}`;
    } else if (daysRemaining < 365) {
        const months = Math.ceil(daysRemaining / 30);
        timeRemaining = `${months} Monat${months === 1 ? '' : 'en'}`;
    } else {
        const years = Math.floor(daysRemaining / 365);
        timeRemaining = `${years} Jahr${years === 1 ? '' : 'en'}`;
    }

    container.innerHTML = `
        <div class="next-milestone-content">
            <div class="next-milestone-icon">${nextMilestone.icon}</div>
            <div class="next-milestone-info">
                <div class="next-milestone-title">${nextMilestone.title}</div>
                <div class="next-milestone-desc">${nextMilestone.description}</div>
                <div class="next-milestone-time">Noch ${timeRemaining}</div>
            </div>
        </div>
        <div class="next-milestone-progress-bar">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
        </div>
    `;
}

export function updateComparisonStats(stats) {
    const container = document.getElementById('comparisonStats');
    if (!container) return;

    // Find the appropriate statistic based on days passed
    let comparisonStat = null;
    const checkpoints = [365, 180, 90, 30, 7, 3, 1];

    for (const checkpoint of checkpoints) {
        if (stats.days >= checkpoint) {
            comparisonStat = quitStatistics[checkpoint];
            break;
        }
    }

    if (comparisonStat) {
        const statDiv = document.createElement('div');
        statDiv.className = 'comparison-stat';
        statDiv.innerHTML = `
            <h3>🏆 Du bist außergewöhnlich!</h3>
            <p>${comparisonStat.message}</p>
            <p style="margin-top: 10px; font-weight: 600;">Du gehörst zu den stärksten ${100 - comparisonStat.failRate}%!</p>
        `;
        container.appendChild(statDiv);
    } else {
        const statDiv = document.createElement('div');
        statDiv.className = 'comparison-stat';
        statDiv.innerHTML = `
            <h3>💪 Jede Minute zählt!</h3>
            <p>Du bist bereits stärker als viele, die es gar nicht erst versuchen.</p>
            <p style="margin-top: 10px;">Die ersten Stunden sind entscheidend - du schaffst das!</p>
        `;
        container.appendChild(statDiv);
    }
}

/**
 * Find the most recent achieved milestone
 */
function findCurrentMilestone(daysPassed) {
    let currentMilestone = null;
    for (let i = 0; i < healthMilestones.length; i++) {
        if (daysPassed >= healthMilestones[i].days) {
            currentMilestone = {
                ...healthMilestones[i],
                id: i
            };
        } else {
            break;
        }
    }
    return currentMilestone;
}
