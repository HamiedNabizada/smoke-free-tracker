import { t } from '../i18n/i18n.js';

// Store regeneration values for tooltips
let currentRegenValues = {
    lung: 0,
    heart: 0,
    blood: 0,
    skin: 0
};

/**
 * Aktualisiert Health Avatar mit wissenschaftlich fundierten Werten
 *
 * Verwendet jetzt die zentralen Berechnungen aus calculations.js:
 * - Lunge: PMC-Studie, FEV1-Verbesserung (10 Jahre bis 100%)
 * - Herz-Kreislauf: WHO, JAMA (15 Jahre bis 100%)
 * - Durchblutung: WHO (6 Monate bis 100%)
 * - Haut: Mailänder Studie 2010 (2 Jahre bis 100%)
 */
export function updateHealthAvatar(stats) {
    if (!stats || !stats.health) return;

    // Verwende wissenschaftlich fundierte Werte aus calculations.js
    const lungRegen = stats.health.lung;
    const heartRegen = stats.health.cardiovascular;
    const bloodRegen = stats.health.circulation;
    const skinRegen = stats.health.skin;

    // Update progress bars
    updateProgressBar('lungRegenBar', lungRegen);
    updateProgressBar('heartRegenBar', heartRegen);
    updateProgressBar('bloodRegenBar', bloodRegen);
    updateProgressBar('skinRegenBar', skinRegen);

    // Update text values
    const lungValue = document.getElementById('lungRegenValue');
    const heartValue = document.getElementById('heartRegenValue');
    const bloodValue = document.getElementById('bloodRegenValue');
    const skinValue = document.getElementById('skinRegenValue');

    if (lungValue) lungValue.textContent = t('healthAvatar.lung.status', { percent: lungRegen });
    if (heartValue) heartValue.textContent = t('healthAvatar.heart.status', { percent: heartRegen });
    if (bloodValue) bloodValue.textContent = t('healthAvatar.blood.status', { percent: bloodRegen });
    if (skinValue) skinValue.textContent = t('healthAvatar.skin.status', { percent: skinRegen });

    // Store values for tooltips
    currentRegenValues = {
        lung: lungRegen,
        heart: heartRegen,
        blood: bloodRegen,
        skin: skinRegen
    };

    // Update SVG organ colors
    updateOrganColors(lungRegen, heartRegen, bloodRegen, skinRegen);

    // Initialize tooltips (only once)
    initializeTooltips();
}

function initializeTooltips() {
    const tooltip = document.getElementById('healthTooltip');
    if (!tooltip) return;

    // Check if already initialized
    const heart = document.querySelector('.organ-heart');
    if (!heart || heart.dataset.tooltipInitialized) return;

    // Helper to show tooltip
    const showTooltip = (e, text) => {
        tooltip.textContent = text;
        tooltip.classList.remove('hidden');

        const rect = e.target.getBoundingClientRect();
        const containerRect = tooltip.parentElement.getBoundingClientRect();

        tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - containerRect.top - 40}px`;
        tooltip.style.transform = 'translateX(-50%)';
    };

    const hideTooltip = () => {
        tooltip.classList.add('hidden');
    };

    // Lungs
    const lungs = document.querySelector('.organ-lungs');
    if (lungs) {
        lungs.addEventListener('mouseenter', (e) => {
            showTooltip(e, t('healthAvatar.lung.tooltip', { percent: Math.round(currentRegenValues.lung) }));
        });
        lungs.addEventListener('mouseleave', hideTooltip);
        lungs.dataset.tooltipInitialized = 'true';
    }

    // Heart (already defined above for check)
    if (heart) {
        heart.addEventListener('mouseenter', (e) => {
            showTooltip(e, t('healthAvatar.heart.tooltip', { percent: Math.round(currentRegenValues.heart) }));
        });
        heart.addEventListener('mouseleave', hideTooltip);
        heart.dataset.tooltipInitialized = 'true';
    }

    // Blood vessels
    const blood = document.querySelector('.organ-blood');
    if (blood) {
        blood.addEventListener('mouseenter', (e) => {
            showTooltip(e, t('healthAvatar.blood.tooltip', { percent: Math.round(currentRegenValues.blood) }));
        });
        blood.addEventListener('mouseleave', hideTooltip);
        blood.dataset.tooltipInitialized = 'true';
    }

    // Skin glow
    const skin = document.getElementById('skin-glow');
    if (skin) {
        skin.addEventListener('mouseenter', (e) => {
            showTooltip(e, t('healthAvatar.skin.tooltip', { percent: Math.round(currentRegenValues.skin) }));
        });
        skin.addEventListener('mouseleave', hideTooltip);
        skin.dataset.tooltipInitialized = 'true';
        skin.style.cursor = 'pointer';
    }
}

// Alte Berechnungsfunktionen entfernt - jetzt zentral in calculations.js
// mit wissenschaftlichen Quellen (WHO, PMC, JAMA, Mailänder Studie)

function updateProgressBar(barId, percentage) {
    const bar = document.getElementById(barId);
    if (bar) {
        bar.style.width = `${Math.min(percentage, 100)}%`;
    }
}

function updateOrganColors(lungRegen, heartRegen, bloodRegen, skinRegen) {
    // Update lung colors (gray → pink)
    const lungLeft = document.querySelector('.lung-left');
    const lungRight = document.querySelector('.lung-right');

    if (lungLeft && lungRight) {
        const lungColor = interpolateColor('#95a5a6', '#ffc0cb', lungRegen / 100);
        lungLeft.setAttribute('fill', lungColor);
        lungRight.setAttribute('fill', lungColor);
    }

    // Update heart color intensity (darker red → bright red)
    const heart = document.querySelector('.organ-heart .organ-fill');
    if (heart) {
        const heartColor = interpolateColor('#c0392b', '#ff6b6b', heartRegen / 100);
        heart.setAttribute('fill', heartColor);
    }

    // Update blood vessel opacity
    const vessels = document.querySelectorAll('.vessel');
    vessels.forEach(vessel => {
        const opacity = 0.4 + (bloodRegen / 100) * 0.4;
        vessel.setAttribute('opacity', opacity.toString());

        // Also change color from dark to bright red
        const vesselColor = interpolateColor('#c0392b', '#e74c3c', bloodRegen / 100);
        vessel.setAttribute('stroke', vesselColor);
    });

    // Update skin glow
    const skinGlow = document.getElementById('skin-glow');
    if (skinGlow) {
        const glowOpacity = 0.2 + (skinRegen / 100) * 0.4;
        skinGlow.setAttribute('opacity', glowOpacity.toString());

        // Change color from orange to gold
        const glowColor = interpolateColor('#e67e22', '#f1c40f', skinRegen / 100);
        skinGlow.setAttribute('stroke', glowColor);
    }
}

// Helper function to interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
