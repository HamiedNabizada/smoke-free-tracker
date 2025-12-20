/**
 * Data Export, Share & Badge Generation Module
 */

import { calculateStats } from '../utils/calculations.js';

/**
 * Initialize data export features
 */
export function initializeDataExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    const shareBtn = document.getElementById('shareSuccessBtn');
    const badgeBtn = document.getElementById('generateBadgeBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', shareSuccess);
    }

    if (badgeBtn) {
        badgeBtn.addEventListener('click', generateBadge);
    }
}

/**
 * Export all user data as JSON file (DSGVO Art. 15)
 */
async function exportUserData() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Du musst eingeloggt sein um Daten zu exportieren.');
        return;
    }

    try {
        // Sammle alle Daten
        const userData = await getUserData();
        const cravingEvents = await getCravingEvents();
        const stats = calculateStats();

        const exportData = {
            export_date: new Date().toISOString(),
            account: {
                user_id: user.uid,
                username: user.displayName,
                email: user.email,
                created: user.metadata.creationTime
            },
            user_data: userData,
            craving_events: cravingEvents,
            current_statistics: {
                days_smoke_free: stats.totalDays,
                money_saved: stats.money,
                cigarettes_not_smoked: stats.cigarettes,
                life_gained_hours: stats.lifeGained.totalHours,
                lung_health_percent: stats.lungHealth
            }
        };

        // JSON erstellen und downloaden
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `byebyesmoke-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('[DataExport] User data exported successfully');
        alert('Deine Daten wurden erfolgreich heruntergeladen!');
    } catch (error) {
        console.error('[DataExport] Error exporting data:', error);
        alert('Fehler beim Exportieren der Daten: ' + error.message);
    }
}

/**
 * Get craving events from Firestore
 */
async function getCravingEvents() {
    const user = firebase.auth().currentUser;
    if (!user) return [];

    try {
        // Return demo data in demo mode (getDemoCravingEvents is in firebase-auth.js)
        if (user.email === 'demo@byebyesmoke.app' && typeof getDemoCravingEvents === 'function') {
            return getDemoCravingEvents();
        }

        const snapshot = await firebase.firestore()
            .collection('craving_events')
            .where('user_id', '==', user.uid)
            .orderBy('date', 'desc')
            .get();

        const events = [];
        snapshot.forEach(doc => {
            events.push({
                date: doc.data().date,
                count: doc.data().count
            });
        });

        return events;
    } catch (error) {
        console.error('[DataExport] Error loading craving events:', error);
        return [];
    }
}

/**
 * Share success using Web Share API
 */
async function shareSuccess() {
    const stats = calculateStats();

    const shareText = `🎉 Ich bin seit ${stats.days} Tagen rauchfrei!\n\n` +
        `💰 Gespart: ${stats.money.toFixed(2)}€\n` +
        `🚭 Zigaretten vermieden: ${stats.cigarettes}\n` +
        `❤️ Lebenszeit gewonnen: ${stats.lifeGained.totalHours} Stunden\n\n` +
        `#rauchfrei #byebyesmoke`;

    // Check if Web Share API is supported
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Mein rauchfreier Erfolg',
                text: shareText,
                url: 'https://byebyesmoke.de'
            });
            console.log('[Share] Success shared via Web Share API');
        } catch (error) {
            // User cancelled or error occurred
            if (error.name !== 'AbortError') {
                console.error('[Share] Error sharing:', error);
                fallbackShare(shareText);
            }
        }
    } else {
        // Fallback: Copy to clipboard
        fallbackShare(shareText);
    }
}

/**
 * Fallback share: Copy to clipboard
 */
function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('📋 Text wurde in die Zwischenablage kopiert!\n\nDu kannst ihn jetzt in WhatsApp, Facebook oder wo du möchtest einfügen.');
            })
            .catch(err => {
                console.error('[Share] Error copying to clipboard:', err);
                showTextModal(text);
            });
    } else {
        showTextModal(text);
    }
}

/**
 * Show text in modal for manual copy
 */
function showTextModal(text) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;';

    const content = document.createElement('div');
    content.style.cssText = 'background:white;padding:30px;border-radius:15px;max-width:500px;width:90%;';

    content.innerHTML = `
        <h3 style="margin-top:0;">Teile deinen Erfolg</h3>
        <textarea readonly style="width:100%;height:200px;padding:10px;border:2px solid #ddd;border-radius:5px;font-family:monospace;font-size:14px;">${text}</textarea>
        <button id="closeShareModal" style="margin-top:15px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;width:100%;">Schließen</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('closeShareModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * Generate success badge as downloadable SVG
 */
function generateBadge() {
    const stats = calculateStats();
    const user = firebase.auth().currentUser;

    // SVG Badge erstellen
    const svg = `
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="800" height="400" fill="url(#grad1)" rx="20"/>

    <!-- Title -->
    <text x="400" y="60" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">
        🎉 Rauchfrei!
    </text>

    <!-- Username -->
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        ${user.displayName || 'Anonymer Held'}
    </text>

    <!-- Stats Box -->
    <rect x="50" y="130" width="700" height="220" fill="rgba(255,255,255,0.2)" rx="15"/>

    <!-- Days -->
    <text x="400" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
        ${stats.days} Tage
    </text>
    <text x="400" y="210" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        rauchfrei
    </text>

    <!-- Money & Cigarettes -->
    <text x="200" y="270" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
        ${stats.money.toFixed(0)}€
    </text>
    <text x="200" y="295" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        gespart
    </text>

    <text x="600" y="270" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
        ${stats.cigarettes}
    </text>
    <text x="600" y="295" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        Zigaretten vermieden
    </text>

    <!-- Life Gained -->
    <text x="400" y="335" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.95)" text-anchor="middle">
        ❤️ ${stats.lifeGained.totalHours}h Lebenszeit gewonnen
    </text>

    <!-- Footer -->
    <text x="400" y="375" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.7)" text-anchor="middle">
        byebyesmoke.de
    </text>
</svg>`;

    // Download SVG
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `byebyesmoke-badge-${stats.days}-tage.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[Badge] Badge generated and downloaded');
    alert('🏆 Dein Erfolgs-Badge wurde heruntergeladen!\n\nDu kannst es jetzt als Profilbild, Wallpaper oder zum Teilen verwenden.');
}
