import { userData } from '../config.js';
import { healthMilestones } from '../data/milestones.js';
import { calculateTimeRemaining } from '../utils/calculations.js';


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

    // Update gauge
    const gaugeProgress = document.getElementById('gaugeProgress');
    const gaugeScore = document.getElementById('gaugeScore');

    if (gaugeProgress && gaugeScore) {
        const circumference = 251.2;
        const offset = circumference - (finalScore / 100) * circumference;
        gaugeProgress.style.strokeDashoffset = offset;
        gaugeScore.textContent = finalScore;

        if (finalScore >= 80) {
            gaugeProgress.style.stroke = '#11998e';
        } else if (finalScore >= 50) {
            gaugeProgress.style.stroke = '#ffc107';
        } else {
            gaugeProgress.style.stroke = '#ff6b6b';
        }
    }

    // Update details mit wissenschaftlicher Aufschlüsselung
    const detailsContainer = document.getElementById('healthScoreDetails');
    if (detailsContainer) {
        let rating = '';
        let message = '';

        if (finalScore >= 90) {
            rating = 'Exzellent!';
            message = 'Deine Gesundheit hat sich hervorragend erholt!';
        } else if (finalScore >= 75) {
            rating = 'Sehr gut!';
            message = 'Du machst großartige Fortschritte!';
        } else if (finalScore >= 50) {
            rating = 'Gut!';
            message = 'Dein Körper erholt sich stetig.';
        } else if (finalScore >= 25) {
            rating = 'Fortschritt!';
            message = 'Die Erholung hat begonnen.';
        } else {
            rating = 'Gestartet!';
            message = 'Erste positive Veränderungen laufen.';
        }

        detailsContainer.innerHTML = `
            <div class="health-score-rating">${rating}</div>
            <div class="health-score-message">${message}</div>
            <div class="health-score-explanation">
                Gewichteter Durchschnitt aus 5 Erholungsmetriken, basierend auf WHO, JAMA und PMC-Studien.
            </div>
            <div class="health-score-breakdown">
                <div class="score-component" title="100% nach ca. 15 Jahren (WHO, JAMA)">
                    <span class="component-label">❤️ Herz-Kreislauf</span>
                    <span class="component-bar"><span class="component-fill" style="width: ${cardiovascular}%"></span></span>
                    <span class="component-value">${cardiovascular}%</span>
                    <span class="component-weight">×30%</span>
                </div>
                <div class="score-component" title="100% nach ca. 10 Jahren (PMC)">
                    <span class="component-label">🫁 Lungenfunktion</span>
                    <span class="component-bar"><span class="component-fill" style="width: ${lung}%"></span></span>
                    <span class="component-value">${lung}%</span>
                    <span class="component-weight">×25%</span>
                </div>
                <div class="score-component" title="100% nach ca. 6 Monaten (WHO)">
                    <span class="component-label">🩸 Durchblutung</span>
                    <span class="component-bar"><span class="component-fill" style="width: ${circulation}%"></span></span>
                    <span class="component-value">${circulation}%</span>
                    <span class="component-weight">×20%</span>
                </div>
                <div class="score-component" title="Herzinfarkt, Schlaganfall, Lungenkrebs">
                    <span class="component-label">🎗️ Risikoreduktion</span>
                    <span class="component-bar"><span class="component-fill" style="width: ${Math.round(riskReduction)}%"></span></span>
                    <span class="component-value">${Math.round(riskReduction)}%</span>
                    <span class="component-weight">×15%</span>
                </div>
                <div class="score-component" title="100% nach ca. 9 Monaten (Mailänder Studie)">
                    <span class="component-label">✨ Hautgesundheit</span>
                    <span class="component-bar"><span class="component-fill" style="width: ${skin}%"></span></span>
                    <span class="component-value">${skin}%</span>
                    <span class="component-weight">×10%</span>
                </div>
            </div>
            <div class="health-score-source">
                <a href="quellen.html">Quellen einsehen</a>
            </div>
        `;
    }
}

export function updateDetailedComparison(stats) {
    const container = document.getElementById('detailedComparison');
    if (!container) return;

    const comparisonData = [
        { milestone: '24 Stunden', days: 1, failRate: 85, yourStatus: stats.days >= 1 },
        { milestone: '3 Tage', days: 3, failRate: 90, yourStatus: stats.days >= 3 },
        { milestone: '1 Woche', days: 7, failRate: 95, yourStatus: stats.days >= 7 },
        { milestone: '2 Wochen', days: 14, failRate: 96, yourStatus: stats.days >= 14 },
        { milestone: '1 Monat', days: 30, failRate: 97, yourStatus: stats.days >= 30 },
        { milestone: '3 Monate', days: 90, failRate: 98, yourStatus: stats.days >= 90 },
        { milestone: '6 Monate', days: 180, failRate: 99, yourStatus: stats.days >= 180 },
        { milestone: '1 Jahr', days: 365, failRate: 99.5, yourStatus: stats.days >= 365 }
    ];

    const tableHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Meilenstein</th>
                    <th>Durchschnittlich schaffen es</th>
                    <th>Dein Status</th>
                </tr>
            </thead>
            <tbody>
                ${comparisonData.map(row => `
                    <tr class="${row.yourStatus ? 'achieved' : 'pending'}">
                        <td><strong>${row.milestone}</strong></td>
                        <td>${100 - row.failRate}% der Menschen</td>
                        <td>${row.yourStatus ? '✓ Erreicht' : '⏳ Noch nicht'}</td>
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

    // Assume user is in 25-45 age group (most common age for quitting)
    const ageGroup = '25-45';

    let comparisonHTML = '';

    if (stats.days >= 180) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">🏆</div>
                <div class="age-comparison-text">
                    <h3>Du bist eine absolute Ausnahme!</h3>
                    <p>In der Altersgruppe ${ageGroup} schaffen nur <strong>1% der Menschen</strong> die ersten 6 Monate rauchfrei zu bleiben.</p>
                    <p class="age-highlight">Du gehörst zu den Top 1%! 🌟</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">99%</div>
                    <div class="age-stat-label">geben vorher auf</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">1%</div>
                    <div class="age-stat-label">Du bist hier! 🎯</div>
                </div>
            </div>
        `;
    } else if (stats.days >= 90) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">💪</div>
                <div class="age-comparison-text">
                    <h3>Du bist außergewöhnlich stark!</h3>
                    <p>In der Altersgruppe ${ageGroup} schaffen nur <strong>2% der Menschen</strong> die ersten 3 Monate.</p>
                    <p class="age-highlight">Du gehörst zu den Top 2%! 🌟</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">98%</div>
                    <div class="age-stat-label">scheitern vorher</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">2%</div>
                    <div class="age-stat-label">Du bist hier! 🎯</div>
                </div>
            </div>
        `;
    } else if (stats.days >= 30) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">🎖️</div>
                <div class="age-comparison-text">
                    <h3>Beeindruckende Leistung!</h3>
                    <p>In der Altersgruppe ${ageGroup} schaffen nur <strong>3% der Menschen</strong> den ersten Monat.</p>
                    <p class="age-highlight">Du gehörst zu den Top 3%! 💎</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">97%</div>
                    <div class="age-stat-label">geben auf</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">3%</div>
                    <div class="age-stat-label">Du bist hier! 🎯</div>
                </div>
            </div>
        `;
    } else if (stats.days >= 7) {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">⭐</div>
                <div class="age-comparison-text">
                    <h3>Großartig gemacht!</h3>
                    <p>In der Altersgruppe ${ageGroup} schaffen nur <strong>5% der Menschen</strong> die erste Woche.</p>
                    <p class="age-highlight">Du gehörst zu den Top 5%! 🔥</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">95%</div>
                    <div class="age-stat-label">scheitern in Woche 1</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">5%</div>
                    <div class="age-stat-label">Du bist hier! 🎯</div>
                </div>
            </div>
        `;
    } else {
        comparisonHTML = `
            <div class="age-comparison-hero">
                <div class="age-comparison-icon">🚀</div>
                <div class="age-comparison-text">
                    <h3>Starker Start!</h3>
                    <p>In der Altersgruppe ${ageGroup} versuchen viele aufzuhören, aber die meisten geben in den ersten Tagen auf.</p>
                    <p class="age-highlight">Du hast bereits den wichtigsten Schritt gemacht! 💪</p>
                </div>
            </div>
            <div class="age-stats-grid">
                <div class="age-stat">
                    <div class="age-stat-value">85%</div>
                    <div class="age-stat-label">geben in 24h auf</div>
                </div>
                <div class="age-stat highlight">
                    <div class="age-stat-value">15%</div>
                    <div class="age-stat-label">bleiben dran</div>
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
        { days: 1, icon: '🌱', title: '1 Tag' },
        { days: 3, icon: '🔥', title: '3 Tage' },
        { days: 7, icon: '⭐', title: '1 Woche' },
        { days: 14, icon: '💎', title: '2 Wochen' },
        { days: 30, icon: '🏅', title: '1 Monat' },
        { days: 90, icon: '🎗️', title: '3 Monate' },
        { days: 180, icon: '🎊', title: '6 Monate' },
        { days: 365, icon: '❤️', title: '1 Jahr' },
        { days: 730, icon: '🏆', title: '2 Jahre' },
        { days: 1825, icon: '🥉', title: '5 Jahre' },
        { days: 3650, icon: '👑', title: '10 Jahre' }
    ];

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
                    ${!achieved && isCurrent ? `<div class="timeline-progress">Noch ${Math.ceil(milestone.days - stats.days)} Tage</div>` : ''}
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
        { label: 'In 1 Monat', days: 30 },
        { label: 'In 3 Monaten', days: 90 },
        { label: 'In 6 Monaten', days: 180 },
        { label: 'In 1 Jahr', days: 365 }
    ];

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
                        <span class="projection-label">gespart</span>
                    </div>
                    <div class="projection-stat">
                        <span class="projection-icon">🚬</span>
                        <span class="projection-value">${futureCigarettes}</span>
                        <span class="projection-label">vermieden</span>
                    </div>
                    <div class="projection-stat">
                        <span class="projection-icon">⏳</span>
                        <span class="projection-value">${futureLifeDays}d</span>
                        <span class="projection-label">Leben gewonnen</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = projectionsHTML;
}
