// Craving Statistics Module
// Fetches and displays craving data from Firestore
// Uses global cache functions from firebase-auth.js

// Get craving events for last N days (with caching)
export async function getCravingHistory(days = 30) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return [];

        // Demo mode: return demo craving events
        if (typeof isDemoMode === 'function' && isDemoMode()) {
            if (typeof getDemoCravingEvents === 'function') {
                const demoEvents = getDemoCravingEvents();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - days);
                const startDateStr = startDate.toISOString().split('T')[0];
                return demoEvents.filter(e => e.date >= startDateStr);
            }
            return [];
        }

        // Check cache first
        const cacheKey = 'craving_history_' + user.uid + '_' + days;
        if (typeof getCached === 'function') {
            const cached = getCached(cacheKey);
            if (cached) {
                console.log('[Cache] Craving history from cache');
                return cached;
            }
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Use db from global scope (firebase-config.js) for consistent access
        const db = firebase.firestore();

        // Query craving events - use simpler query to avoid index requirements
        const snapshot = await db.collection('craving_events')
            .where('user_id', '==', user.uid)
            .get();

        const cravingData = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Filter by date range client-side to avoid compound index requirement
            if (data.date >= startDateStr && data.date <= endDateStr) {
                cravingData.push({
                    date: data.date,
                    count: data.count || 0
                });
            }
        });

        // Sort client-side
        cravingData.sort((a, b) => a.date.localeCompare(b.date));

        // Cache result (2 min TTL)
        if (typeof setCache === 'function') {
            setCache(cacheKey, cravingData, 2 * 60 * 1000);
            console.log('[Firebase] Craving history loaded');
        }

        return cravingData;
    } catch (error) {
        console.error('Error fetching craving history:', error);
        return [];
    }
}

// Get today's craving count (uses global getCravingCount from firebase-auth.js)
export async function getTodayCravingCount() {
    try {
        // Use global getCravingCount function from firebase-auth.js
        if (typeof getCravingCount === 'function') {
            const result = await getCravingCount();
            return result.count || 0;
        }
        return 0;
    } catch (error) {
        console.error('Error getting today craving count:', error);
        return 0;
    }
}

// Update compact craving stats in SOS tab
export async function updateCompactCravingStats() {
    const container = document.getElementById('compactCravingStats');
    if (!container) return;

    try {
        const todayCount = await getTodayCravingCount();
        const last7Days = await getCravingHistory(7);
        const last30Days = await getCravingHistory(30);

        // Calculate weekly average
        const weekTotal = last7Days.reduce((sum, day) => sum + day.count, 0);
        const weekAvg = last7Days.length > 0 ? (weekTotal / last7Days.length).toFixed(1) : 0;

        // Calculate monthly total
        const monthTotal = last30Days.reduce((sum, day) => sum + day.count, 0);

        // Calculate trend (comparing first half vs second half of last 7 days)
        let trendText = '';
        let trendIcon = '';
        if (last7Days.length >= 4) {
            const firstHalf = last7Days.slice(0, Math.floor(last7Days.length / 2));
            const secondHalf = last7Days.slice(Math.floor(last7Days.length / 2));

            const firstAvg = firstHalf.reduce((sum, d) => sum + d.count, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, d) => sum + d.count, 0) / secondHalf.length;

            if (secondAvg < firstAvg * 0.8) {
                trendText = 'Trend: Abnehmend';
                trendIcon = '📉';
            } else if (secondAvg > firstAvg * 1.2) {
                trendText = 'Trend: Zunehmend';
                trendIcon = '📈';
            } else {
                trendText = 'Trend: Stabil';
                trendIcon = '➡️';
            }
        }

        container.innerHTML = `
            <div class="compact-craving-stat">
                <div class="compact-stat-number">${todayCount}</div>
                <div class="compact-stat-label">Heute überwunden</div>
            </div>
            <div class="compact-craving-stat">
                <div class="compact-stat-number">${weekAvg}</div>
                <div class="compact-stat-label">Ø pro Tag (7 Tage)</div>
            </div>
            <div class="compact-craving-stat">
                <div class="compact-stat-number">${monthTotal}</div>
                <div class="compact-stat-label">Gesamt (30 Tage)</div>
            </div>
            ${trendText ? `
            <div class="compact-craving-trend">
                <span class="trend-icon">${trendIcon}</span>
                <span class="trend-text">${trendText}</span>
            </div>
            ` : ''}
        `;
    } catch (error) {
        console.error('Error updating compact craving stats:', error);
        container.innerHTML = '<p class="error-message">Statistiken konnten nicht geladen werden.</p>';
    }
}

// Update craving chart in statistics tab
export async function updateCravingChart() {
    const canvas = document.getElementById('cravingChart');
    if (!canvas) return;

    try {
        const last30Days = await getCravingHistory(30);

        // Fill missing days with 0
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29);

        const labels = [];
        const data = [];
        const dataMap = {};

        // Create map for quick lookup
        last30Days.forEach(item => {
            dataMap[item.date] = item.count;
        });

        // Generate all dates in range
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

            labels.push(displayDate);
            data.push(dataMap[dateStr] || 0);
        }

        // Destroy existing chart if exists
        if (window.cravingChartInstance) {
            window.cravingChartInstance.destroy();
        }

        // Create chart
        const ctx = canvas.getContext('2d');
        window.cravingChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Überwundene Cravings',
                    data: data,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // Calculate and display summary
        const total = data.reduce((sum, val) => sum + val, 0);
        const avg = (total / 30).toFixed(1);
        const max = Math.max(...data);

        const summaryContainer = document.getElementById('cravingSummary');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div class="craving-summary-item">
                    <div class="summary-value">${total}</div>
                    <div class="summary-label">Gesamt überwunden</div>
                </div>
                <div class="craving-summary-item">
                    <div class="summary-value">${avg}</div>
                    <div class="summary-label">Ø pro Tag</div>
                </div>
                <div class="craving-summary-item">
                    <div class="summary-value">${max}</div>
                    <div class="summary-label">Maximum an einem Tag</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error updating craving chart:', error);
    }
}
