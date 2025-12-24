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
import { t } from '../i18n/i18n.js';
import { formatNumber } from '../i18n/formatters.js';

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

    // Update skin improvement (Mailänder Studie: Messungen bei 3, 6, 9 Monaten)
    const skinEl = document.getElementById('skinImprovement');
    if (skinEl) {
        skinEl.textContent = Math.round(stats.skinImprovement) + '%';
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
                    <div class="next-milestone-title">${t('dashboard.nextMilestone.allComplete')}</div>
                    <div class="next-milestone-desc">${t('dashboard.nextMilestone.allCompleteDesc')}</div>
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
        timeRemaining = t('time.hoursShort', { count: hoursRemaining });
    } else if (daysRemaining < 7) {
        const days = Math.ceil(daysRemaining);
        timeRemaining = days === 1 ? t('time.day') : t('time.days', { count: days });
    } else if (daysRemaining < 30) {
        const weeks = Math.ceil(daysRemaining / 7);
        timeRemaining = weeks === 1 ? t('time.week') : t('time.weeks', { count: weeks });
    } else if (daysRemaining < 365) {
        const months = Math.ceil(daysRemaining / 30);
        timeRemaining = months === 1 ? t('time.month') : t('time.months', { count: months });
    } else {
        const years = Math.floor(daysRemaining / 365);
        timeRemaining = years === 1 ? t('time.year') : t('time.years', { count: years });
    }

    // Get milestone text from translations (using ID)
    const milestoneId = nextMilestone.id || nextMilestone.title.toLowerCase().replace(/\s+/g, '_');
    const milestoneTitle = t(`milestones.${milestoneId}.title`) !== `milestones.${milestoneId}.title`
        ? t(`milestones.${milestoneId}.title`)
        : nextMilestone.title;
    const milestoneDesc = t(`milestones.${milestoneId}.description`) !== `milestones.${milestoneId}.description`
        ? t(`milestones.${milestoneId}.description`)
        : nextMilestone.description;

    container.innerHTML = `
        <div class="next-milestone-content">
            <div class="next-milestone-icon">${nextMilestone.icon}</div>
            <div class="next-milestone-info">
                <div class="next-milestone-title">${milestoneTitle}</div>
                <div class="next-milestone-desc">${milestoneDesc}</div>
                <div class="next-milestone-time">${t('time.remaining', { time: timeRemaining })}</div>
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
            <h3>${t('dashboard.comparison.exceptional')}</h3>
            <p>${comparisonStat.message}</p>
            <p style="margin-top: 10px; font-weight: 600;">${t('dashboard.comparison.topPercent', { percent: 100 - comparisonStat.failRate })}</p>
        `;
        container.appendChild(statDiv);
    } else {
        const statDiv = document.createElement('div');
        statDiv.className = 'comparison-stat';
        statDiv.innerHTML = `
            <h3>${t('dashboard.comparison.everyMinuteCounts')}</h3>
            <p>${t('dashboard.comparison.strongerThanMany')}</p>
            <p style="margin-top: 10px;">${t('dashboard.comparison.firstHoursCritical')}</p>
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
