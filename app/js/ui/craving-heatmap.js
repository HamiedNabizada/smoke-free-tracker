/**
 * Craving Heatmap Visualization
 * Shows when cravings typically occur (day of week x hour of day)
 */

import { t, isInitialized, getLocale } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

// Day names are loaded dynamically based on locale
function getDayNames() {
    return [
        tr('time.dayNamesShort.sunday', 'So'),
        tr('time.dayNamesShort.monday', 'Mo'),
        tr('time.dayNamesShort.tuesday', 'Di'),
        tr('time.dayNamesShort.wednesday', 'Mi'),
        tr('time.dayNamesShort.thursday', 'Do'),
        tr('time.dayNamesShort.friday', 'Fr'),
        tr('time.dayNamesShort.saturday', 'Sa')
    ];
}

const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']; // Fallback
const HOUR_LABELS = ['00', '03', '06', '09', '12', '15', '18', '21'];

/**
 * Initialize and render the craving heatmap
 */
export async function updateCravingHeatmap() {
    const container = document.getElementById('cravingHeatmap');
    if (!container) return;

    // Show loading state
    container.innerHTML = `<p class="heatmap-loading">${tr('heatmap.loading', 'Lade Heatmap...')}</p>`;

    try {
        // Get heatmap data from Firebase
        if (typeof getCravingHeatmapData !== 'function') {
            container.innerHTML = `<p class="heatmap-error">${tr('heatmap.dataUnavailable', 'Heatmap-Daten nicht verfügbar')}</p>`;
            return;
        }

        const { heatmap, totalCravings } = await getCravingHeatmapData();

        if (totalCravings === 0) {
            container.innerHTML = `
                <div class="heatmap-empty">
                    <p>${tr('heatmap.noData', 'Noch keine Verlangen-Daten vorhanden.')}</p>
                    <p class="heatmap-hint">${tr('heatmap.hint', 'Nutze den Craving-Timer, um deine Verlangen zu tracken.')}</p>
                </div>
            `;
            return;
        }

        // Find max value for color scaling
        let maxValue = 0;
        heatmap.forEach(day => {
            day.forEach(hour => {
                if (hour > maxValue) maxValue = hour;
            });
        });

        // Render heatmap
        renderHeatmap(container, heatmap, maxValue, totalCravings);

    } catch (error) {
        console.error('[CravingHeatmap] Error:', error);
        container.innerHTML = `<p class="heatmap-error">${tr('heatmap.loadError', 'Fehler beim Laden der Heatmap')}</p>`;
    }
}

/**
 * Render the heatmap grid
 */
function renderHeatmap(container, heatmap, maxValue, totalCravings) {
    // Find peak times
    const peakTimes = findPeakTimes(heatmap);
    const dayNames = getDayNames();
    const cravingsText = tr('heatmap.cravings', 'Verlangen');

    let html = `
        <div class="heatmap-wrapper">
            <div class="heatmap-grid">
                <!-- Hour labels row -->
                <div class="heatmap-row heatmap-header">
                    <div class="heatmap-day-label"></div>
                    ${HOUR_LABELS.map(h => `<div class="heatmap-hour-label">${h}</div>`).join('')}
                </div>
    `;

    // Render each day row
    for (let day = 1; day <= 7; day++) {
        const dayIndex = day % 7; // Convert to 0=Sunday format but start with Monday
        const adjustedDay = day === 7 ? 0 : day; // Sunday at end

        html += `
            <div class="heatmap-row">
                <div class="heatmap-day-label">${dayNames[adjustedDay]}</div>
        `;

        // Render each 3-hour block (8 blocks per day)
        for (let block = 0; block < 8; block++) {
            const startHour = block * 3;
            let blockTotal = 0;

            // Sum 3 hours for this block
            for (let h = 0; h < 3; h++) {
                blockTotal += heatmap[adjustedDay][startHour + h] || 0;
            }

            const intensity = maxValue > 0 ? blockTotal / (maxValue * 3) : 0;
            const colorClass = getColorClass(intensity);

            html += `
                <div class="heatmap-cell ${colorClass}"
                     title="${dayNames[adjustedDay]} ${startHour}:00-${startHour + 3}:00: ${blockTotal} ${cravingsText}"
                     data-count="${blockTotal}">
                </div>
            `;
        }

        html += '</div>';
    }

    html += `
            </div>
            <div class="heatmap-legend">
                <span class="legend-label">${tr('heatmap.less', 'Weniger')}</span>
                <div class="legend-scale">
                    <div class="legend-cell level-0"></div>
                    <div class="legend-cell level-1"></div>
                    <div class="legend-cell level-2"></div>
                    <div class="legend-cell level-3"></div>
                    <div class="legend-cell level-4"></div>
                </div>
                <span class="legend-label">${tr('heatmap.more', 'Mehr')}</span>
            </div>
        </div>
        <div class="heatmap-insights">
            <h4>${tr('heatmap.insights', 'Erkenntnisse')}</h4>
            <ul>
                ${peakTimes.map(p => `<li>${p}</li>`).join('')}
            </ul>
            <p class="heatmap-total">${tr('heatmap.total', 'Gesamt')}: <strong>${totalCravings}</strong> ${tr('heatmap.cravingsLast30Days', 'Verlangen in den letzten 30 Tagen')}</p>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Get color class based on intensity (0-1)
 */
function getColorClass(intensity) {
    if (intensity === 0) return 'level-0';
    if (intensity < 0.25) return 'level-1';
    if (intensity < 0.5) return 'level-2';
    if (intensity < 0.75) return 'level-3';
    return 'level-4';
}

/**
 * Find peak times from heatmap data
 */
function findPeakTimes(heatmap) {
    const insights = [];
    const dayNames = getDayNames();

    // Find peak day
    const dayTotals = heatmap.map((day, i) => ({
        day: i,
        total: day.reduce((a, b) => a + b, 0)
    }));
    dayTotals.sort((a, b) => b.total - a.total);

    if (dayTotals[0].total > 0) {
        insights.push(tr('heatmap.peakDay', 'Höchstes Verlangen am <strong>{day}</strong>', { day: dayNames[dayTotals[0].day] }));
    }

    // Find peak time blocks
    const hourTotals = [];
    for (let h = 0; h < 24; h++) {
        let total = 0;
        for (let d = 0; d < 7; d++) {
            total += heatmap[d][h] || 0;
        }
        hourTotals.push({ hour: h, total });
    }
    hourTotals.sort((a, b) => b.total - a.total);

    if (hourTotals[0].total > 0) {
        const peakHour = hourTotals[0].hour;
        const timeRange = `${peakHour}:00 - ${peakHour + 1}:00`;
        insights.push(tr('heatmap.peakTime', 'Kritischste Uhrzeit: <strong>{time}</strong>', { time: timeRange }));
    }

    // Find low activity periods
    if (dayTotals[dayTotals.length - 1].total === 0) {
        const lowDay = dayNames[dayTotals[dayTotals.length - 1].day];
        insights.push(tr('heatmap.noCravings', 'Kein Verlangen am <strong>{day}</strong> - gut gemacht!', { day: lowDay }));
    }

    if (insights.length === 0) {
        insights.push(tr('heatmap.notEnoughData', 'Noch nicht genug Daten für Erkenntnisse'));
    }

    return insights;
}
