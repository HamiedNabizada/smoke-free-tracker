// Store regeneration values for tooltips
let currentRegenValues = {
    lung: 0,
    heart: 0,
    blood: 0,
    skin: 0
};

export function updateHealthAvatar(stats) {
    if (!stats) return;

    const days = stats.totalDays;

    // Calculate regeneration percentages
    const lungRegen = calculateLungRegeneration(days);
    const heartRegen = calculateHeartRegeneration(days);
    const bloodRegen = calculateBloodRegeneration(days);
    const skinRegen = calculateSkinRegeneration(days);

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

    if (lungValue) lungValue.textContent = `${Math.round(lungRegen)}% regeneriert`;
    if (heartValue) heartValue.textContent = `${Math.round(heartRegen)}% normalisiert`;
    if (bloodValue) bloodValue.textContent = `${Math.round(bloodRegen)}% verbessert`;
    if (skinValue) skinValue.textContent = `${Math.round(skinRegen)}% verjüngt`;

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
            showTooltip(e, `🫁 Lungen: ${Math.round(currentRegenValues.lung)}% regeneriert`);
        });
        lungs.addEventListener('mouseleave', hideTooltip);
        lungs.dataset.tooltipInitialized = 'true';
    }

    // Heart (already defined above for check)
    if (heart) {
        heart.addEventListener('mouseenter', (e) => {
            showTooltip(e, `❤️ Herz: ${Math.round(currentRegenValues.heart)}% normalisiert`);
        });
        heart.addEventListener('mouseleave', hideTooltip);
        heart.dataset.tooltipInitialized = 'true';
    }

    // Blood vessels
    const blood = document.querySelector('.organ-blood');
    if (blood) {
        blood.addEventListener('mouseenter', (e) => {
            showTooltip(e, `🩸 Blutkreislauf: ${Math.round(currentRegenValues.blood)}% verbessert`);
        });
        blood.addEventListener('mouseleave', hideTooltip);
        blood.dataset.tooltipInitialized = 'true';
    }

    // Skin glow
    const skin = document.getElementById('skin-glow');
    if (skin) {
        skin.addEventListener('mouseenter', (e) => {
            showTooltip(e, `✨ Haut: ${Math.round(currentRegenValues.skin)}% verjüngt`);
        });
        skin.addEventListener('mouseleave', hideTooltip);
        skin.dataset.tooltipInitialized = 'true';
        skin.style.cursor = 'pointer';
    }
}

function calculateLungRegeneration(days) {
    // Lung regeneration timeline:
    // 0-90 days: 0-30% (initial recovery)
    // 90-270 days: 30-60% (significant improvement)
    // 270-3650 days (10 years): 60-100% (full recovery)

    if (days < 90) {
        return (days / 90) * 30;
    } else if (days < 270) {
        return 30 + ((days - 90) / 180) * 30;
    } else if (days < 3650) {
        return 60 + ((days - 270) / 3380) * 40;
    } else {
        return 100;
    }
}

function calculateHeartRegeneration(days) {
    // Heart normalization:
    // 0-1 day: Heart rate and blood pressure normalize (0-20%)
    // 1-14 days: Circulation improves (20-50%)
    // 14-90 days: Heart attack risk decreases significantly (50-100%)

    if (days < 1) {
        return (days / 1) * 20;
    } else if (days < 14) {
        return 20 + ((days - 1) / 13) * 30;
    } else if (days < 90) {
        return 50 + ((days - 14) / 76) * 50;
    } else {
        return 100;
    }
}

function calculateBloodRegeneration(days) {
    // Blood circulation improvement:
    // 2-12 weeks (14-84 days): Circulation improves (0-100%)

    if (days < 14) {
        return (days / 14) * 20; // Early improvement
    } else if (days < 84) {
        return 20 + ((days - 14) / 70) * 80;
    } else {
        return 100;
    }
}

function calculateSkinRegeneration(days) {
    // Skin rejuvenation:
    // 2-9 months (60-270 days): Skin improves (0-100%)

    if (days < 60) {
        return (days / 60) * 20; // Minimal improvement
    } else if (days < 270) {
        return 20 + ((days - 60) / 210) * 80;
    } else {
        return 100;
    }
}

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
