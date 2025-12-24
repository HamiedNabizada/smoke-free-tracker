import { userData } from '../config.js';
import { healthMilestones } from '../data/milestones.js';
import { calculateTimeRemaining } from '../utils/calculations.js';
import { generateLotusSVG, getStageProgressInfo, setCurrentScore, initializeLotusPreview } from './lotus.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    // Replace params in fallback
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}


/**
 * Wissenschaftlich fundierter Health Score
 *
 * Gewichtung basiert auf Mortalitätsrelevanz:
 * - Herz-Kreislauf: 30% (führende Todesursache bei Rauchern)
 * - Lunge: 25% (COPD, Lungenkrebs)
 * - Durchblutung: 20% (periphere Gefäßerkrankungen)
 * - Risikoreduktion: 15% (Herzinfarkt, Schlaganfall, Krebs)
 * - Haut: 10% (Indikator für Geweberegeneration)
 *
 * Quellen: WHO, JAMA, PMC - siehe quellen.html
 */
export function updateHealthScore(stats) {
    if (!stats.health) return;

    // Komponenten aus wissenschaftlichen Berechnungen
    const cardiovascular = stats.health.cardiovascular;  // 0-100%
    const lung = stats.health.lung;                      // 0-100%
    const circulation = stats.health.circulation;        // 0-100%
    const skin = stats.health.skin;                      // 0-100%

    // Risikoreduktion (Durchschnitt)
    const riskReduction = stats.riskReduction ?
        (stats.riskReduction.heartAttack + stats.riskReduction.stroke + stats.riskReduction.lungCancer) / 3
        : 0;

    // Gewichteter Health Score
    const weights = {
        cardiovascular: 0.30,  // 30%
        lung: 0.25,            // 25%
        circulation: 0.20,     // 20%
        riskReduction: 0.15,   // 15%
        skin: 0.10             // 10%
    };

    const finalScore = Math.round(
        cardiovascular * weights.cardiovascular +
        lung * weights.lung +
        circulation * weights.circulation +
        riskReduction * weights.riskReduction +
        skin * weights.skin
    );

    // Store current score for preview restoration
    setCurrentScore(finalScore);

    // Update lotus visualization
    const lotusContainer = document.getElementById('lotusContainer');
    const scoreDisplay = document.getElementById('lotusScore');

    if (lotusContainer) {
        lotusContainer.innerHTML = generateLotusSVG(finalScore);
    }

    if (scoreDisplay) {
        scoreDisplay.textContent = finalScore;
    }

    // Update stage info
    const stageInfo = getStageProgressInfo(finalScore);
    const stageNameEl = document.getElementById('lotusStageName');
    const stageProgressEl = document.getElementById('lotusStageProgress');
    const nextStageEl = document.getElementById('lotusNextStage');

    if (stageNameEl) {
        stageNameEl.textContent = `${stageInfo.stageName} (Stufe ${stageInfo.stageIndex}/${stageInfo.totalStages})`;
    }

    if (stageProgressEl) {
        stageProgressEl.textContent = stageInfo.description;
    }

    if (nextStageEl) {
        nextStageEl.textContent = stageInfo.nextStage;
    }

    // Update details mit wissenschaftlicher Aufschlüsselung
    const detailsContainer = document.getElementById('healthScoreDetails');
    if (detailsContainer) {
        let rating = '';
        let message = '';

        if (finalScore >= 90) {
            rating = tr('statistics.healthScore.rating.excellent', 'Exzellent!');
            message = tr('statistics.healthScore.message.excellent', 'Deine Gesundheit hat sich hervorragend erholt!');
        } else if (finalScore >= 75) {
            rating = tr('statistics.healthScore.rating.veryGood', 'Sehr gut!');
            message = tr('statistics.healthScore.message.veryGood', 'Du machst großartige Fortschritte!');
        } else if (finalScore >= 50) {
            rating = tr('statistics.healthScore.rating.good', 'Gut!');
            message = tr('statistics.healthScore.message.good', 'Dein Körper erholt sich stetig.');
        } else if (finalScore >= 25) {
            rating = tr('statistics.healthScore.rating.progress', 'Fortschritt!');
            message = tr('statistics.healthScore.message.progress', 'Die Erholung hat begonnen.');
        } else {
            rating = tr('statistics.healthScore.rating.started', 'Gestartet!');
            message = tr('statistics.healthScore.message.started', 'Erste positive Veränderungen laufen.');
        }

        const explanation = tr('statistics.healthScore.explanation', 'Gewichteter Durchschnitt aus 5 Erholungsmetriken, basierend auf WHO, JAMA und PMC-Studien.');
        const viewSources = tr('statistics.healthScore.viewSources', 'Quellen einsehen');

        const cardioLabel = tr('statistics.healthScore.components.cardiovascular.label', 'Herz-Kreislauf');
        const cardioDesc = tr('statistics.healthScore.components.cardiovascular.desc', 'Häufigste Todesursache bei Rauchern. 15 Jahre bis Nichtraucher-Niveau.');
        const lungLabel = tr('statistics.healthScore.components.lung.label', 'Lungenfunktion');
        const lungDesc = tr('statistics.healthScore.components.lung.desc', 'COPD, Lungenkrebs. 10 Jahre bis volle Erholung.');
        const circulationLabel = tr('statistics.healthScore.components.circulation.label', 'Durchblutung');
        const circulationDesc = tr('statistics.healthScore.components.circulation.desc', 'Periphere Gefäße. Schnelle Erholung in 6 Monaten.');
        const riskLabel = tr('statistics.healthScore.components.risk.label', 'Risikoreduktion');
        const riskDesc = tr('statistics.healthScore.components.risk.desc', 'Herzinfarkt, Schlaganfall, Krebs. Langfristiger Schutz.');
        const skinLabel = tr('statistics.healthScore.components.skin.label', 'Hautgesundheit');
        const skinDesc = tr('statistics.healthScore.components.skin.desc', 'Sichtbarer Indikator für Regeneration. 9 Monate.');

        detailsContainer.innerHTML = `
            <div class="health-score-rating">${rating}</div>
            <div class="health-score-message">${message}</div>
            <div class="health-score-explanation">${explanation}</div>
            <div class="health-score-breakdown">
                <div class="score-component">
                    <div class="component-header">
                        <span class="component-label">❤️ ${cardioLabel}</span>
                        <span class="component-value">${cardiovascular}%</span>
                        <span class="component-weight">×30%</span>
                    </div>
                    <span class="component-bar"><span class="component-fill" style="width: ${cardiovascular}%"></span></span>
                    <span class="component-desc">${cardioDesc}</span>
                </div>
                <div class="score-component">
                    <div class="component-header">
                        <span class="component-label">🫁 ${lungLabel}</span>
                        <span class="component-value">${lung}%</span>
                        <span class="component-weight">×25%</span>
                    </div>
                    <span class="component-bar"><span class="component-fill" style="width: ${lung}%"></span></span>
                    <span class="component-desc">${lungDesc}</span>
                </div>
                <div class="score-component">
                    <div class="component-header">
                        <span class="component-label">🩸 ${circulationLabel}</span>
                        <span class="component-value">${circulation}%</span>
                        <span class="component-weight">×20%</span>
                    </div>
                    <span class="component-bar"><span class="component-fill" style="width: ${circulation}%"></span></span>
                    <span class="component-desc">${circulationDesc}</span>
                </div>
                <div class="score-component">
                    <div class="component-header">
                        <span class="component-label">🎗️ ${riskLabel}</span>
                        <span class="component-value">${Math.round(riskReduction)}%</span>
                        <span class="component-weight">×15%</span>
                    </div>
                    <span class="component-bar"><span class="component-fill" style="width: ${Math.round(riskReduction)}%"></span></span>
                    <span class="component-desc">${riskDesc}</span>
                </div>
                <div class="score-component">
                    <div class="component-header">
                        <span class="component-label">✨ ${skinLabel}</span>
                        <span class="component-value">${skin}%</span>
                        <span class="component-weight">×10%</span>
                    </div>
                    <span class="component-bar"><span class="component-fill" style="width: ${skin}%"></span></span>
                    <span class="component-desc">${skinDesc}</span>
                </div>
            </div>
            <div class="health-score-source">
                <a href="quellen.html">${viewSources}</a>
            </div>
        `;
    }
}

export function updateDetailedComparison(stats) {
    const container = document.getElementById('detailedComparison');
    if (!container) return;

    const comparisonData = [
        { milestone: tr('statistics.comparison.milestones.24h', '24 Stunden'), days: 1, failRate: 85, yourStatus: stats.days >= 1 },
        { milestone: tr('statistics.comparison.milestones.3d', '3 Tage'), days: 3, failRate: 90, yourStatus: stats.days >= 3 },
        { milestone: tr('statistics.comparison.milestones.1w', '1 Woche'), days: 7, failRate: 95, yourStatus: stats.days >= 7 },
        { milestone: tr('statistics.comparison.milestones.2w', '2 Wochen'), days: 14, failRate: 96, yourStatus: stats.days >= 14 },
        { milestone: tr('statistics.comparison.milestones.1m', '1 Monat'), days: 30, failRate: 97, yourStatus: stats.days >= 30 },
        { milestone: tr('statistics.comparison.milestones.3m', '3 Monate'), days: 90, failRate: 98, yourStatus: stats.days >= 90 },
        { milestone: tr('statistics.comparison.milestones.6m', '6 Monate'), days: 180, failRate: 99, yourStatus: stats.days >= 180 },
        { milestone: tr('statistics.comparison.milestones.1y', '1 Jahr'), days: 365, failRate: 99.5, yourStatus: stats.days >= 365 }
    ];

    const headerMilestone = tr('statistics.comparison.header.milestone', 'Meilenstein');
    const headerAverage = tr('statistics.comparison.header.average', 'Durchschnittlich schaffen es');
    const headerStatus = tr('statistics.comparison.header.status', 'Dein Status');
    const ofPeople = tr('statistics.comparison.ofPeople', '% der Menschen');
    const achieved = tr('statistics.comparison.achieved', 'Erreicht');
    const notYet = tr('statistics.comparison.notYet', 'Noch nicht');

    const tableHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>${headerMilestone}</th>
                    <th>${headerAverage}</th>
                    <th>${headerStatus}</th>
                </tr>
            </thead>
            <tbody>
                ${comparisonData.map(row => `
                    <tr class="${row.yourStatus ? 'achieved' : 'pending'}">
                        <td><strong>${row.milestone}</strong></td>
                        <td>${100 - row.failRate}${ofPeople}</td>
                        <td>${row.yourStatus ? `✓ ${achieved}` : `⏳ ${notYet}`}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

export function updateAgeGroupComparison(stats) {
    const container = document.getElementById('ageGroupComparison');
    if (!container) return;

    const ageGroup = '25-45';
    const youAreHere = tr('statistics.ageGroup.youAreHere', 'Du bist hier!');

    let comparisonHTML = '';

    if (stats.days >= 180) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">🏆</div>
                <div class="age-comparison-text">
                    <h3>${tr('statistics.ageGroup.6m.title', 'Du bist eine absolute Ausnahme!')}</h3>
                    <p>${tr('statistics.ageGroup.6m.text', 'In der Altersgruppe {ageGroup} schaffen nur <strong>1% der Menschen</strong> die ersten 6 Monate rauchfrei zu bleiben.', { ageGroup })}</p>
                    <p class="age-highlight">${tr('statistics.ageGroup.6m.highlight', 'Du gehörst zu den Top 1%!')}</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">99%</div>
                    <div class="age-stat-label">${tr('statistics.ageGroup.giveUpBefore', 'geben vorher auf')}</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">1%</div>
                    <div class="age-stat-label">${youAreHere}</div>
                </div>
            </div>
        `;
    } else if (stats.days >= 90) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">💪</div>
                <div class="age-comparison-text">
                    <h3>${tr('statistics.ageGroup.3m.title', 'Du bist außergewöhnlich stark!')}</h3>
                    <p>${tr('statistics.ageGroup.3m.text', 'In der Altersgruppe {ageGroup} schaffen nur <strong>2% der Menschen</strong> die ersten 3 Monate.', { ageGroup })}</p>
                    <p class="age-highlight">${tr('statistics.ageGroup.3m.highlight', 'Du gehörst zu den Top 2%!')}</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">98%</div>
                    <div class="age-stat-label">${tr('statistics.ageGroup.failBefore', 'scheitern vorher')}</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">2%</div>
                    <div class="age-stat-label">${youAreHere}</div>
                </div>
            </div>
        `;
    } else if (stats.days >= 30) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">🎖️</div>
                <div class="age-comparison-text">
                    <h3>${tr('statistics.ageGroup.1m.title', 'Beeindruckende Leistung!')}</h3>
                    <p>${tr('statistics.ageGroup.1m.text', 'In der Altersgruppe {ageGroup} schaffen nur <strong>3% der Menschen</strong> den ersten Monat.', { ageGroup })}</p>
                    <p class="age-highlight">${tr('statistics.ageGroup.1m.highlight', 'Du gehörst zu den Top 3%!')}</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">97%</div>
                    <div class="age-stat-label">${tr('statistics.ageGroup.giveUp', 'geben auf')}</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">3%</div>
                    <div class="age-stat-label">${youAreHere}</div>
                </div>
            </div>
        `;
    } else if (stats.days >= 7) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">⭐</div>
                <div class="age-comparison-text">
                    <h3>${tr('statistics.ageGroup.1w.title', 'Großartig gemacht!')}</h3>
                    <p>${tr('statistics.ageGroup.1w.text', 'In der Altersgruppe {ageGroup} schaffen nur <strong>5% der Menschen</strong> die erste Woche.', { ageGroup })}</p>
                    <p class="age-highlight">${tr('statistics.ageGroup.1w.highlight', 'Du gehörst zu den Top 5%!')}</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">95%</div>
                    <div class="age-stat-label">${tr('statistics.ageGroup.failWeek1', 'scheitern in Woche 1')}</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">5%</div>
                    <div class="age-stat-label">${youAreHere}</div>
                </div>
            </div>
        `;
    } else {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">🚀</div>
                <div class="age-comparison-text">
                    <h3>${tr('statistics.ageGroup.start.title', 'Starker Start!')}</h3>
                    <p>${tr('statistics.ageGroup.start.text', 'In der Altersgruppe {ageGroup} versuchen viele aufzuhören, aber die meisten geben in den ersten Tagen auf.', { ageGroup })}</p>
                    <p class="age-highlight">${tr('statistics.ageGroup.start.highlight', 'Du hast bereits den wichtigsten Schritt gemacht!')}</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">85%</div>
                    <div class="age-stat-label">${tr('statistics.ageGroup.giveUp24h', 'geben in 24h auf')}</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">15%</div>
                    <div class="age-stat-label">${tr('statistics.ageGroup.stayStrong', 'bleiben dran')}</div>
                </div>
            </div>
        `;
    }

    container.innerHTML = comparisonHTML;
}

export function updateMilestoneTimeline(stats) {
    const container = document.getElementById('milestoneTimeline');
    if (!container) return;

    container.innerHTML = '';

    // Select key milestones for timeline
    const keyMilestones = [
        { days: 1, icon: '🌱', title: tr('statistics.timeline.1d', '1 Tag') },
        { days: 3, icon: '🔥', title: tr('statistics.timeline.3d', '3 Tage') },
        { days: 7, icon: '⭐', title: tr('statistics.timeline.1w', '1 Woche') },
        { days: 14, icon: '💎', title: tr('statistics.timeline.2w', '2 Wochen') },
        { days: 30, icon: '🏅', title: tr('statistics.timeline.1m', '1 Monat') },
        { days: 90, icon: '🎗️', title: tr('statistics.timeline.3m', '3 Monate') },
        { days: 180, icon: '🎊', title: tr('statistics.timeline.6m', '6 Monate') },
        { days: 365, icon: '❤️', title: tr('statistics.timeline.1y', '1 Jahr') },
        { days: 730, icon: '🏆', title: tr('statistics.timeline.2y', '2 Jahre') },
        { days: 1825, icon: '🥉', title: tr('statistics.timeline.5y', '5 Jahre') },
        { days: 3650, icon: '👑', title: tr('statistics.timeline.10y', '10 Jahre') }
    ];

    const stillText = tr('statistics.timeline.still', 'Noch');
    const daysText = tr('statistics.timeline.days', 'Tage');

    const timelineHTML = keyMilestones.map((milestone, index) => {
        const achieved = stats.days >= milestone.days;
        const isCurrent = !achieved && (index === 0 || stats.days >= keyMilestones[index - 1].days);

        let statusClass = achieved ? 'achieved' : isCurrent ? 'current' : 'future';
        let statusIcon = achieved ? '✓' : isCurrent ? '→' : '';

        return `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-marker">
                    <div class="timeline-icon">${milestone.icon}</div>
                    <div class="timeline-status">${statusIcon}</div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-title">${milestone.title}</div>
                    ${!achieved && isCurrent ? `<div class="timeline-progress">${stillText} ${Math.ceil(milestone.days - stats.days)} ${daysText}</div>` : ''}
                </div>
                ${index < keyMilestones.length - 1 ? '<div class="timeline-connector"></div>' : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = timelineHTML;
}

export function updateFutureProjection(stats) {
    const container = document.getElementById('futureProjection');
    if (!container) return;

    container.innerHTML = '';

    // Calculate projections for different time periods
    const projections = [
        { label: tr('statistics.projection.in1m', 'In 1 Monat'), days: 30 },
        { label: tr('statistics.projection.in3m', 'In 3 Monaten'), days: 90 },
        { label: tr('statistics.projection.in6m', 'In 6 Monaten'), days: 180 },
        { label: tr('statistics.projection.in1y', 'In 1 Jahr'), days: 365 }
    ];

    const savedLabel = tr('statistics.projection.saved', 'gespart');
    const avoidedLabel = tr('statistics.projection.avoided', 'vermieden');
    const lifeGainedLabel = tr('statistics.projection.lifeGained', 'Leben gewonnen');

    const projectionsHTML = projections.map(projection => {
        const futureDays = stats.days + projection.days;
        const futureCigarettes = Math.floor(futureDays * userData.cigarettesPerDay);
        const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
        const futureMoney = futureCigarettes * pricePerCigarette;
        const futureLifeHours = Math.floor((futureCigarettes * 11) / 60);
        const futureLifeDays = Math.floor(futureLifeHours / 24);

        return `
            <div class="projection-item">
                <div class="projection-header">${projection.label}</div>
                <div class="projection-stats">
                    <div class="projection-stat">
                        <span class="projection-icon">💰</span>
                        <span class="projection-value">${futureMoney.toFixed(0)}€</span>
                        <span class="projection-label">${savedLabel}</span>
                    </div>
                    <div class="projection-stat">
                        <span class="projection-icon">🚬</span>
                        <span class="projection-value">${futureCigarettes}</span>
                        <span class="projection-label">${avoidedLabel}</span>
                    </div>
                    <div class="projection-stat">
                        <span class="projection-icon">⏳</span>
                        <span class="projection-value">${futureLifeDays}d</span>
                        <span class="projection-label">${lifeGainedLabel}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = projectionsHTML;
}
