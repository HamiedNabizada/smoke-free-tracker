import { userData, chart, setChart } from '../config.js';
import { t, isInitialized, getLocale } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

export function updateChart(stats) {
    const ctx = document.getElementById('progressChart');

    if (!ctx) return;

    // Generate data for the last 30 days
    const labels = [];
    const moneyData = [];
    const cigaretteData = [];

    const daysToShow = Math.min(stats.days + 1, 30);
    const quitDate = new Date(userData.quitDate);

    for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        if (date < quitDate) continue;

        const daysDiff = Math.floor((date - quitDate) / (1000 * 60 * 60 * 24));
        const cigarettes = daysDiff * userData.cigarettesPerDay;
        const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
        const money = cigarettes * pricePerCigarette;

        const locale = isInitialized() ? getLocale() : 'de';
        labels.push(date.toLocaleDateString(locale === 'en' ? 'en-US' : 'de-DE', { day: '2-digit', month: '2-digit' }));
        moneyData.push(money.toFixed(2));
        cigaretteData.push(Math.floor(cigarettes));
    }

    if (chart) {
        chart.destroy();
    }

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: tr('charts.moneySaved', 'Geld gespart (€)'),
                    data: moneyData,
                    borderColor: '#11998e',
                    backgroundColor: 'rgba(17, 153, 142, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: tr('charts.cigarettesNotSmoked', 'Zigaretten nicht geraucht'),
                    data: cigaretteData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        boxWidth: window.innerWidth < 768 ? 12 : 40,
                        padding: window.innerWidth < 768 ? 10 : 15,
                        font: {
                            size: window.innerWidth < 768 ? 11 : 12
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    padding: window.innerWidth < 768 ? 8 : 12,
                    titleFont: {
                        size: window.innerWidth < 768 ? 12 : 14
                    },
                    bodyFont: {
                        size: window.innerWidth < 768 ? 11 : 13
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        },
                        maxRotation: window.innerWidth < 768 ? 45 : 0,
                        minRotation: window.innerWidth < 768 ? 45 : 0
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: window.innerWidth > 480,
                        text: tr('charts.euroAxis', 'Euro (€)'),
                        font: {
                            size: window.innerWidth < 768 ? 11 : 12
                        }
                    },
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: window.innerWidth > 480,
                        text: tr('charts.cigarettesAxis', 'Zigaretten'),
                        font: {
                            size: window.innerWidth < 768 ? 11 : 12
                        }
                    },
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });

    setChart(newChart);
}
