// What's Happening NOW - Shows current regeneration phase
import { healthMilestones } from '../data/milestones.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Get milestone text with i18n fallback
function getMilestoneText(milestone, field) {
    if (isInitialized()) {
        const translated = t(`milestones.${milestone.id}.${field}`);
        if (translated !== `milestones.${milestone.id}.${field}`) {
            return translated;
        }
    }
    return milestone[field] || '';
}

export function updateHappeningNow(stats) {
    const container = document.getElementById('happeningNowContent');
    if (!container) return;

    const totalDays = stats.totalDays;

    // Find current phase (last achieved milestone)
    let currentMilestone = healthMilestones[0];
    let nextMilestone = null;

    for (let i = 0; i < healthMilestones.length; i++) {
        if (totalDays >= healthMilestones[i].days) {
            currentMilestone = healthMilestones[i];
        } else {
            nextMilestone = healthMilestones[i];
            break;
        }
    }

    // If no next milestone (all achieved)
    if (!nextMilestone) {
        nextMilestone = healthMilestones[healthMilestones.length - 1];
    }

    // Update icon
    document.getElementById('happeningIcon').textContent = currentMilestone.icon;

    // Update title based on time since last milestone
    const timeSinceMilestone = totalDays - currentMilestone.days;
    const milestoneTitle = getMilestoneText(currentMilestone, 'title');
    let title = '';

    if (timeSinceMilestone < 0.1) {
        // Just achieved
        const justReached = t('happeningNow.justReached') !== 'happeningNow.justReached'
            ? t('happeningNow.justReached')
            : 'Gerade erreicht!';
        title = `${milestoneTitle} - ${justReached}`;
    } else {
        // In progress
        const activePhase = t('happeningNow.activePhase') !== 'happeningNow.activePhase'
            ? t('happeningNow.activePhase')
            : 'Aktive Phase';
        title = `${milestoneTitle} - ${activePhase}`;
    }

    document.getElementById('happeningTitle').textContent = title;

    // Update description - extract key processes from detailedInfo
    const description = extractCurrentProcess(currentMilestone, totalDays);
    document.getElementById('happeningDescription').textContent = description;

    // Update progress bar to next milestone
    if (nextMilestone && totalDays < nextMilestone.days) {
        const progressToNext = ((totalDays - currentMilestone.days) / (nextMilestone.days - currentMilestone.days)) * 100;
        document.getElementById('happeningBar').style.width = Math.min(progressToNext, 100) + '%';

        // Calculate time to next milestone
        const daysRemaining = nextMilestone.days - totalDays;
        const timeText = formatTimeRemaining(daysRemaining);
        const nextMilestoneTitle = getMilestoneText(nextMilestone, 'title');
        const nextPhaseText = t('happeningNow.nextPhase', { title: nextMilestoneTitle, time: timeText }) !== 'happeningNow.nextPhase'
            ? t('happeningNow.nextPhase', { title: nextMilestoneTitle, time: timeText })
            : `Nächste Phase (${nextMilestoneTitle}) in ${timeText}`;
        document.getElementById('happeningNext').textContent = nextPhaseText;
    } else {
        // All milestones achieved
        document.getElementById('happeningBar').style.width = '100%';
        const allAchieved = t('happeningNow.allAchieved') !== 'happeningNow.allAchieved'
            ? t('happeningNow.allAchieved')
            : 'Alle Gesundheitsmeilensteine erreicht!';
        document.getElementById('happeningNext').textContent = allAchieved;
    }
}

function extractCurrentProcess(milestone, totalDays) {
    // Try i18n first, fallback to milestone description
    const key = `happeningNow.descriptions.${milestone.id}`;
    const translated = t(key);
    if (translated !== key) {
        return translated;
    }
    return getMilestoneText(milestone, 'description');
}

function formatTimeRemaining(days) {
    if (days < 0.042) { // < 1 hour
        const minutes = Math.ceil(days * 24 * 60);
        return `${minutes} ${t('time.minutes')}`;
    } else if (days < 0.5) { // < 12 hours
        const hours = Math.ceil(days * 24);
        return `${hours} ${t('time.hours')}`;
    } else if (days < 1) { // < 1 day
        return t('happeningNow.lessThanOneDay');
    } else if (days < 7) {
        const wholeDays = Math.ceil(days);
        return t('time.days', { count: wholeDays });
    } else if (days < 30) {
        const weeks = Math.ceil(days / 7);
        return t('time.weeks', { count: weeks });
    } else if (days < 365) {
        const months = Math.ceil(days / 30);
        return t('time.months', { count: months });
    } else {
        const years = Math.floor(days / 365);
        const remainingMonths = Math.ceil((days % 365) / 30);
        if (remainingMonths > 0) {
            return t('happeningNow.yearsAndMonths', { years, months: remainingMonths });
        }
        return t('time.years', { count: years });
    }
}
