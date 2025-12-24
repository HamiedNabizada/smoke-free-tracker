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
    // Create dynamic description based on milestone phase
    const descriptions = {
        0.014: 'Deine Herzfrequenz und dein Blutdruck normalisieren sich gerade. Die Durchblutung in Händen und Füßen verbessert sich.',
        0.042: 'Dein Körper baut aktiv Nikotin ab. Die Nikotinrezeptoren beginnen sich zu normalisieren.',
        0.083: 'Dein Kreislauf arbeitet effizienter. Die peripheren Nervenenden erholen sich.',
        0.33: 'Der Sauerstoffgehalt in deinem Blut steigt. Deine Organe werden besser versorgt.',
        0.5: 'Kohlenmonoxid wird aus deinem Blut entfernt. Dein Blut transportiert jetzt optimal Sauerstoff.',
        1: 'Dein Herzinfarktrisiko sinkt bereits. Der Blutdruck stabilisiert sich.',
        2: 'Nervenenden in Nase und Mund regenerieren sich. Gerüche und Geschmack werden intensiver.',
        3: 'Deine Bronchien entspannen sich und öffnen sich. Die Lungenkapazität verbessert sich.',
        5: 'Die Dopamin-Rezeptoren normalisieren sich. Deine Lungen beginnen sich zu reinigen.',
        7: 'Deine Bronchien heilen aktiv. Entzündungen gehen zurück, die Atmung wird tiefer.',
        10: 'Flimmerhärchen in den Atemwegen regenerieren sich und transportieren Schleim ab.',
        14: 'Dein Kreislauf und deine Lungenfunktion verbessern sich merklich. Sport wird angenehmer.',
        21: 'Die körperliche Nikotinabhängigkeit ist überwunden. Dopamin-Produktion normalisiert sich.',
        30: 'Deine Lungenkapazität steigt um bis zu 30%. Flimmerhärchen arbeiten wieder effektiv.',
        60: 'Die Hautdurchblutung normalisiert sich. Dein Teint wird frischer und gesünder.',
        90: 'Die Lungenfunktion verbessert sich kontinuierlich. Husten und Kurzatmigkeit lassen nach.',
        120: 'Dein Immunsystem arbeitet auf höherem Niveau. Weiße Blutkörperchen funktionieren optimal.',
        150: 'Deine körperliche Leistungsfähigkeit steigt. Herz-Kreislauf-System arbeitet effizient.',
        180: 'Die Flimmerhärchen arbeiten wieder normal. Chronischer Husten verschwindet.',
        270: 'Flimmerhärchen sind vollständig regeneriert. Selbstreinigungskraft der Lungen ist wiederhergestellt.',
        365: 'Dein Herzinfarktrisiko hat sich halbiert. Blutgefäße erholen sich, Verkalkungen gehen zurück.',
        548: 'Deine Lungenfunktion normalisiert sich vollständig. Lungenbläschen regenerieren sich.',
        730: 'Gefäßwände werden elastischer. Durchblutung ist optimal. Herz arbeitet effizienter.',
        1095: 'Koronararterien werden gesünder. Gefäßablagerungen werden abgebaut.',
        1825: 'Blutgefäße im Gehirn sind gesund. Risiko für Herzerkrankungen stark reduziert.',
        3650: 'Deine Lungen haben sich maximal regeneriert. Krebsrisiko sinkt deutlich.',
        5475: 'Dein Herz-Kreislauf-System ist vollständig erholt. Schäden sind rückgängig gemacht.',
        7300: 'Gesundheitliche Risiken sind nahezu wie bei Nichtrauchern. Körper vollständig transformiert.'
    };

    return descriptions[milestone.days] || milestone.description;
}

function formatTimeRemaining(days) {
    if (days < 0.042) { // < 1 hour
        const minutes = Math.ceil(days * 24 * 60);
        return `${minutes} Min`;
    } else if (days < 0.5) { // < 12 hours
        const hours = Math.ceil(days * 24);
        return `${hours} Std`;
    } else if (days < 1) { // < 1 day
        return 'weniger als 1 Tag';
    } else if (days < 7) {
        const wholeDays = Math.ceil(days);
        return `${wholeDays} Tag${wholeDays === 1 ? '' : 'en'}`;
    } else if (days < 30) {
        const weeks = Math.ceil(days / 7);
        return `${weeks} Woche${weeks === 1 ? '' : 'n'}`;
    } else if (days < 365) {
        const months = Math.ceil(days / 30);
        return `${months} Monat${months === 1 ? '' : 'en'}`;
    } else {
        const years = Math.floor(days / 365);
        const remainingMonths = Math.ceil((days % 365) / 30);
        if (remainingMonths > 0) {
            return `${years} Jahr${years === 1 ? '' : 'en'} und ${remainingMonths} Monat${remainingMonths === 1 ? '' : 'en'}`;
        }
        return `${years} Jahr${years === 1 ? '' : 'en'}`;
    }
}
