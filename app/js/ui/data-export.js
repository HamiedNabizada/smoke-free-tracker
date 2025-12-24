/**
 * Data Export, Share & Badge Generation Module
 */

import { calculateStats } from '../utils/calculations.js';
import { auth, db, getUserData, isDemoMode, getDemoCravingEvents } from '../firebase-auth.js';
import { collection, query, where, getDocs, orderBy } from '../firebase-init.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

/**
 * Initialize data export features
 */
export function initializeDataExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    const shareBtn = document.getElementById('shareSuccessBtn');
    const badgeBtn = document.getElementById('generateBadgeBtn');
    const shareImageBtn = document.getElementById('shareImageBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserDataToFile);
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', shareSuccess);
    }

    if (badgeBtn) {
        badgeBtn.addEventListener('click', generateBadge);
    }

    if (shareImageBtn) {
        shareImageBtn.addEventListener('click', shareAsImage);
    }

    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportPdf);
    }
}

/**
 * Export all user data as JSON file (DSGVO Art. 15)
 */
async function exportUserDataToFile() {
    const user = auth.currentUser;
    if (!user) {
        alert(tr('dataExport.notLoggedIn', 'Du musst eingeloggt sein um Daten zu exportieren.'));
        return;
    }

    try {
        // Sammle alle Daten
        const userData = await getUserData();
        const cravingEvents = await getCravingEventsForExport();
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
        alert(tr('dataExport.exportSuccess', 'Deine Daten wurden erfolgreich heruntergeladen!'));
    } catch (error) {
        console.error('[DataExport] Error exporting data:', error);
        alert(tr('dataExport.exportError', 'Fehler beim Exportieren der Daten: {message}', { message: error.message }));
    }
}

/**
 * Get craving events from Firestore for export
 */
async function getCravingEventsForExport() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        // Return demo data in demo mode
        if (isDemoMode()) {
            return getDemoCravingEvents();
        }

        const cravingsQuery = query(
            collection(db, 'craving_events'),
            where('user_id', '==', user.uid),
            orderBy('date', 'desc')
        );
        const snapshot = await getDocs(cravingsQuery);

        const events = [];
        snapshot.forEach(docSnap => {
            events.push({
                date: docSnap.data().date,
                count: docSnap.data().count
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

    const shareText = tr('share.successText', '🎉 Ich bin seit {days} Tagen rauchfrei!\n\n💰 Gespart: {money}€\n🚭 Zigaretten vermieden: {cigarettes}\n❤️ Lebenszeit gewonnen: {hours} Stunden\n\n#rauchfrei #byebyesmoke', {
        days: stats.days,
        money: stats.money.toFixed(2),
        cigarettes: stats.cigarettes,
        hours: stats.lifeGained.totalHours
    });

    // Check if Web Share API is supported
    if (navigator.share) {
        try {
            await navigator.share({
                title: tr('share.title', 'Mein rauchfreier Erfolg'),
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
                alert(tr('share.copiedToClipboard', '📋 Text wurde in die Zwischenablage kopiert!\n\nDu kannst ihn jetzt in WhatsApp, Facebook oder wo du möchtest einfügen.'));
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
        <h3 style="margin-top:0;">${tr('share.modalTitle', 'Teile deinen Erfolg')}</h3>
        <textarea readonly style="width:100%;height:200px;padding:10px;border:2px solid #ddd;border-radius:5px;font-family:monospace;font-size:14px;">${text}</textarea>
        <button id="closeShareModal" style="margin-top:15px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;width:100%;">${tr('common.close', 'Schließen')}</button>
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
    const user = auth.currentUser;

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
        🎉 ${tr('badge.smokeFree', 'Rauchfrei!')}
    </text>

    <!-- Username -->
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        ${user.displayName || tr('badge.anonymousHero', 'Anonymer Held')}
    </text>

    <!-- Stats Box -->
    <rect x="50" y="130" width="700" height="220" fill="rgba(255,255,255,0.2)" rx="15"/>

    <!-- Days -->
    <text x="400" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
        ${stats.days} ${tr('badge.days', 'Tage')}
    </text>
    <text x="400" y="210" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        ${tr('badge.smokeFreeSub', 'rauchfrei')}
    </text>

    <!-- Money & Cigarettes -->
    <text x="200" y="270" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
        ${stats.money.toFixed(0)}€
    </text>
    <text x="200" y="295" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        ${tr('badge.saved', 'gespart')}
    </text>

    <text x="600" y="270" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
        ${stats.cigarettes}
    </text>
    <text x="600" y="295" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        ${tr('badge.cigarettesAvoided', 'Zigaretten vermieden')}
    </text>

    <!-- Life Gained -->
    <text x="400" y="335" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.95)" text-anchor="middle">
        ❤️ ${stats.lifeGained.totalHours}h ${tr('badge.lifeGained', 'Lebenszeit gewonnen')}
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
    alert(tr('badge.downloadSuccess', '🏆 Dein Erfolgs-Badge wurde heruntergeladen!\n\nDu kannst es jetzt als Profilbild, Wallpaper oder zum Teilen verwenden.'));
}

/**
 * Generate shareable PNG image
 */
export async function generateShareImage() {
    const stats = calculateStats();
    const user = auth.currentUser;
    const username = user?.displayName || tr('badge.anonymousHero', 'Anonymer Held');

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, 1080, 1080, 40);
    ctx.fill();

    // Draw inner card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.roundRect(40, 40, 1000, 1000, 30);
    ctx.fill();

    // Text settings
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';

    // Title with emoji
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.fillText(`🎉 ${tr('badge.smokeFree', 'Rauchfrei!')}`, 540, 140);

    // Username
    ctx.font = '36px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(username, 540, 200);

    // Main stat - Days
    ctx.fillStyle = 'white';
    ctx.font = 'bold 180px Arial, sans-serif';
    ctx.fillText(stats.days.toString(), 540, 420);

    ctx.font = '48px Arial, sans-serif';
    ctx.fillText(tr('badge.daysSmokeFree', 'Tage rauchfrei'), 540, 490);

    // Stats row
    const statsY = 620;

    // Money saved
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillText(`${stats.money.toFixed(0)}€`, 270, statsY);
    ctx.font = '28px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(tr('badge.saved', 'gespart'), 270, statsY + 40);

    // Cigarettes avoided
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillText(stats.cigarettes.toString(), 810, statsY);
    ctx.font = '28px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(tr('badge.cigarettesAvoided', 'Zigaretten vermieden'), 810, statsY + 40);

    // Life gained
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText(`❤️ ${stats.lifeGained.totalHours}h ${tr('badge.lifeGained', 'Lebenszeit gewonnen')}`, 540, 780);

    // Lung health
    ctx.font = '36px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`🫁 ${tr('badge.lungHealth', 'Lungengesundheit')}: ${stats.lungHealth}%`, 540, 850);

    // Footer
    ctx.font = '28px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(tr('badge.createdWith', 'Erstellt mit ByeByeSmoke'), 540, 960);
    ctx.fillText('byebyesmoke.de', 540, 1000);

    return canvas;
}

/**
 * Share image via Web Share API or download
 */
export async function shareAsImage() {
    try {
        // Show loading state
        const badgeBtn = document.getElementById('generateBadgeBtn');
        if (badgeBtn) {
            badgeBtn.disabled = true;
            badgeBtn.innerHTML = `<span class="btn-icon">⏳</span><div class="btn-content"><div class="btn-title">${tr('share.creatingImage', 'Erstelle Bild...')}</div></div>`;
        }

        const canvas = await generateShareImage();

        // Convert to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'byebyesmoke-erfolg.png', { type: 'image/png' });

        // Try Web Share API with files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: tr('share.title', 'Mein rauchfreier Erfolg'),
                    text: tr('share.imageText', '🎉 Schau dir meinen Fortschritt an! #rauchfrei #byebyesmoke')
                });
                console.log('[Share] Image shared via Web Share API');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    // Fallback to download
                    downloadCanvas(canvas);
                }
            }
        } else {
            // No file sharing support - download instead
            downloadCanvas(canvas);
        }
    } catch (error) {
        console.error('[Share] Error creating share image:', error);
        alert(tr('share.imageError', 'Fehler beim Erstellen des Bildes: {message}', { message: error.message }));
    } finally {
        // Reset button
        const badgeBtn = document.getElementById('generateBadgeBtn');
        if (badgeBtn) {
            badgeBtn.disabled = false;
            badgeBtn.innerHTML = `<span class="btn-icon">🏆</span><div class="btn-content"><div class="btn-title">${tr('badge.createTitle', 'Erfolgs-Badge erstellen')}</div><div class="btn-description">${tr('badge.createDesc', 'Erstelle ein Badge mit deinen Statistiken')}</div></div>`;
        }
    }
}

/**
 * Download canvas as PNG
 */
function downloadCanvas(canvas) {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'byebyesmoke-erfolg.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log('[Share] Image downloaded as PNG');
    alert(tr('share.imageDownloaded', '📸 Dein Erfolgs-Bild wurde heruntergeladen!\n\nDu kannst es jetzt auf Instagram, WhatsApp, Facebook oder wo du möchtest teilen.'));
}

/**
 * Export statistics as PDF report
 */
async function exportPdf() {
    const stats = calculateStats();
    const user = auth.currentUser;
    const username = user?.displayName || tr('pdf.user', 'Benutzer');

    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        alert(tr('pdf.libraryLoading', 'PDF-Bibliothek wird geladen, bitte versuche es erneut.'));
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Colors
    const primaryColor = [102, 126, 234]; // #667eea
    const darkColor = [51, 51, 51];
    const grayColor = [102, 102, 102];

    // Header with gradient-like effect
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 50, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ByeByeSmoke', 105, 25, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(tr('pdf.subtitle', 'Dein Rauchfrei-Report'), 105, 35, { align: 'center' });

    // User info
    doc.setTextColor(...darkColor);
    doc.setFontSize(12);
    doc.text(`${tr('pdf.createdFor', 'Erstellt für')}: ${username}`, 20, 65);
    doc.text(`${tr('pdf.date', 'Datum')}: ${new Date().toLocaleDateString('de-DE')}`, 20, 72);

    // Main Statistics Box
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 85, 180, 60, 5, 5);

    // Days smoke-free (big number)
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(stats.days.toString(), 105, 115, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(...grayColor);
    doc.text(tr('pdf.daysSmokeFree', 'Tage rauchfrei'), 105, 130, { align: 'center' });

    // Statistics Grid
    const startY = 160;
    const colWidth = 60;

    // Row 1
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(tr('pdf.moneySaved', 'Geld gespart'), 20 + colWidth/2, startY, { align: 'center' });
    doc.text(tr('pdf.cigarettesAvoided', 'Zigaretten vermieden'), 80 + colWidth/2, startY, { align: 'center' });
    doc.text(tr('pdf.lifeGained', 'Lebenszeit gewonnen'), 140 + colWidth/2, startY, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${stats.money.toFixed(0)}€`, 20 + colWidth/2, startY + 10, { align: 'center' });
    doc.text(stats.cigarettes.toString(), 80 + colWidth/2, startY + 10, { align: 'center' });
    doc.text(`${stats.lifeGained.totalHours}h`, 140 + colWidth/2, startY + 10, { align: 'center' });

    // Row 2
    const row2Y = startY + 35;
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text(tr('pdf.lungHealth', 'Lungengesundheit'), 20 + colWidth/2, row2Y, { align: 'center' });
    doc.text(tr('pdf.timeSaved', 'Zeit gespart'), 80 + colWidth/2, row2Y, { align: 'center' });
    doc.text(tr('pdf.co2Avoided', 'CO2 vermieden'), 140 + colWidth/2, row2Y, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${stats.lungHealth}%`, 20 + colWidth/2, row2Y + 10, { align: 'center' });
    doc.text(`${stats.timeSaved.totalHours}h`, 80 + colWidth/2, row2Y + 10, { align: 'center' });
    doc.text(`${stats.co2Avoided.toFixed(1)}kg`, 140 + colWidth/2, row2Y + 10, { align: 'center' });

    // Environment Section
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(tr('pdf.environmentImpact', 'Umwelt-Impact'), 20, 230);

    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`${tr('pdf.waterSaved', 'Wasser gespart')}: ${stats.waterSaved.toLocaleString('de-DE')} ${tr('pdf.liters', 'Liter')}`, 25, 240);
    doc.text(`${tr('pdf.treesSaved', 'Bäume gerettet')}: ${(stats.cigarettes / 300).toFixed(1)}`, 25, 248);
    doc.text(`${tr('pdf.co2Avoided', 'CO2 vermieden')}: ${stats.co2Avoided.toFixed(2)} kg`, 25, 256);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(tr('pdf.footer', 'Erstellt mit ByeByeSmoke - byebyesmoke.de'), 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`byebyesmoke-report-${new Date().toISOString().split('T')[0]}.pdf`);

    console.log('[PDF] Report generated');
    alert(tr('pdf.downloadSuccess', '📄 Dein PDF-Report wurde erstellt und heruntergeladen!'));
}

