/**
 * Lotus Flower Visualization
 *
 * Replaces the health score gauge with a growing lotus flower.
 * Based on research showing digital pets increase app engagement by 20-30%.
 * Source: Boston University School of Public Health, 2024
 * https://www.bu.edu/sph/news/articles/2024/novel-digital-pet-game-within-smoking-cessation-app-increases-user-engagement-with-apps-tools-to-quit-smoking/
 */

// Growth stages with thresholds and descriptions (10 stages for gradual progress)
const LOTUS_STAGES = [
    {
        minScore: 0,
        maxScore: 10,
        name: 'Samen',
        description: 'Ein Samen ruht in der Erde',
        nextStage: 'Bei 10 Punkten beginnt die Keimung'
    },
    {
        minScore: 10,
        maxScore: 20,
        name: 'Keimling',
        description: 'Der Samen beginnt zu keimen',
        nextStage: 'Bei 20 Punkten durchbricht der Spross die Erde'
    },
    {
        minScore: 20,
        maxScore: 30,
        name: 'Junger Spross',
        description: 'Ein zarter Spross wächst empor',
        nextStage: 'Bei 30 Punkten bilden sich die ersten Blätter'
    },
    {
        minScore: 30,
        maxScore: 40,
        name: 'Spross mit Blättern',
        description: 'Kleine Blätter entfalten sich',
        nextStage: 'Bei 40 Punkten erreicht die Pflanze das Wasser'
    },
    {
        minScore: 40,
        maxScore: 50,
        name: 'Schwimmendes Blatt',
        description: 'Das erste Blatt schwimmt auf dem Wasser',
        nextStage: 'Bei 50 Punkten wächst das Blatt weiter'
    },
    {
        minScore: 50,
        maxScore: 60,
        name: 'Großes Lotusblatt',
        description: 'Ein prächtiges Lotusblatt breitet sich aus',
        nextStage: 'Bei 60 Punkten bildet sich eine kleine Knospe'
    },
    {
        minScore: 60,
        maxScore: 70,
        name: 'Kleine Knospe',
        description: 'Eine zarte Knospe formt sich',
        nextStage: 'Bei 70 Punkten wächst die Knospe weiter'
    },
    {
        minScore: 70,
        maxScore: 80,
        name: 'Große Knospe',
        description: 'Die Knospe ist bereit sich zu öffnen',
        nextStage: 'Bei 80 Punkten öffnen sich die ersten Blütenblätter'
    },
    {
        minScore: 80,
        maxScore: 90,
        name: 'Öffnende Blüte',
        description: 'Die Blüte beginnt sich zu entfalten',
        nextStage: 'Bei 90 Punkten erblüht die Lotus vollständig'
    },
    {
        minScore: 90,
        maxScore: 100,
        name: 'Volle Blüte',
        description: 'Deine Lotus erstrahlt in voller Pracht!',
        nextStage: 'Deine Lotus hat ihre volle Schönheit erreicht'
    }
];

/**
 * Get the current lotus stage based on score
 */
export function getLotusStage(score) {
    for (const stage of LOTUS_STAGES) {
        if (score >= stage.minScore && score < stage.maxScore) {
            return stage;
        }
    }
    // Score is 100
    return LOTUS_STAGES[LOTUS_STAGES.length - 1];
}

/**
 * Generate the Lotus SVG based on health score
 */
export function generateLotusSVG(score) {
    const stage = getLotusStage(score);
    const stageIndex = LOTUS_STAGES.indexOf(stage);

    // Water base color
    const waterColor = '#e8f4f8';
    const waterDarkColor = '#b8d4dc';

    // Lotus colors - get more vibrant as it grows
    const stemColor = '#2d5a27';
    const leafColor = '#3a7d32';
    const petalColorLight = '#f8c8d4';
    const petalColorMedium = '#f4a0b8';
    const petalColorDark = '#e87da0';
    const centerColor = '#ffd700';

    let svgContent = '';

    // Base water
    const waterBase = `
        <ellipse cx="100" cy="170" rx="80" ry="20" fill="${waterColor}" />
        <ellipse cx="100" cy="170" rx="60" ry="12" fill="${waterDarkColor}" opacity="0.3" />
    `;

    // Stage 0: Seed (0-10)
    if (stageIndex === 0) {
        const progress = (score - 0) / 10;
        const seedSize = 8 + progress * 2;
        svgContent = `
            ${waterBase}
            <!-- Seed in soil -->
            <ellipse cx="100" cy="168" rx="30" ry="8" fill="#8B4513" opacity="0.3" />
            <ellipse cx="100" cy="165" rx="${seedSize}" ry="${seedSize * 0.7}" fill="#5a3825" />
            <ellipse cx="100" cy="163" rx="${seedSize * 0.6}" ry="${seedSize * 0.4}" fill="#7a5035" opacity="0.5" />
        `;
    }

    // Stage 1: Sprouting seed (10-20)
    else if (stageIndex === 1) {
        const progress = (score - 10) / 10;
        const seedSize = 10;
        const sproutHeight = 5 + progress * 15;
        svgContent = `
            ${waterBase}
            <!-- Soil -->
            <ellipse cx="100" cy="168" rx="30" ry="8" fill="#8B4513" opacity="0.3" />
            <!-- Seed -->
            <ellipse cx="100" cy="165" rx="${seedSize}" ry="${seedSize * 0.7}" fill="#5a3825" />
            <!-- Tiny sprout -->
            <path d="M 100 ${165 - seedSize * 0.7} Q 100 ${160 - sproutHeight * 0.5} 100 ${160 - sproutHeight}"
                  stroke="${stemColor}" stroke-width="2" fill="none" stroke-linecap="round" />
            ${progress > 0.5 ? `
                <ellipse cx="100" cy="${158 - sproutHeight}" rx="3" ry="5" fill="${leafColor}" />
            ` : ''}
        `;
    }

    // Stage 2: Young sprout (20-30)
    else if (stageIndex === 2) {
        const progress = (score - 20) / 10;
        const stemHeight = 25 + progress * 15;
        svgContent = `
            ${waterBase}
            <!-- Stem -->
            <path d="M 100 170 Q 100 ${170 - stemHeight * 0.5} 100 ${170 - stemHeight}"
                  stroke="${stemColor}" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <!-- Small leaf bud at top -->
            <ellipse cx="100" cy="${168 - stemHeight}" rx="${4 + progress * 2}" ry="${7 + progress * 3}" fill="${leafColor}" />
        `;
    }

    // Stage 3: Sprout with leaves (30-40)
    else if (stageIndex === 3) {
        const progress = (score - 30) / 10;
        const stemHeight = 40 + progress * 10;
        svgContent = `
            ${waterBase}
            <!-- Stem -->
            <path d="M 100 170 Q 100 ${170 - stemHeight * 0.5} 100 ${170 - stemHeight}"
                  stroke="${stemColor}" stroke-width="3" fill="none" stroke-linecap="round" />
            <!-- Small leaves -->
            <ellipse cx="${92 - progress * 3}" cy="${170 - stemHeight + 12}"
                     rx="${8 + progress * 4}" ry="${4 + progress * 2}"
                     fill="${leafColor}" transform="rotate(-25 ${92 - progress * 3} ${170 - stemHeight + 12})" />
            <ellipse cx="${108 + progress * 3}" cy="${170 - stemHeight + 15}"
                     rx="${6 + progress * 4}" ry="${3 + progress * 2}"
                     fill="${leafColor}" transform="rotate(25 ${108 + progress * 3} ${170 - stemHeight + 15})" />
        `;
    }

    // Stage 4: Small floating leaf (40-50)
    else if (stageIndex === 4) {
        const progress = (score - 40) / 10;
        const leafSize = 25 + progress * 10;
        svgContent = `
            <!-- Small lotus leaf on water -->
            <ellipse cx="100" cy="162" rx="${leafSize}" ry="${leafSize * 0.55}" fill="${leafColor}" />
            <ellipse cx="100" cy="160" rx="${leafSize * 0.7}" ry="${leafSize * 0.35}" fill="#4a9d42" opacity="0.3" />
            <!-- Water around leaf -->
            <ellipse cx="100" cy="175" rx="85" ry="18" fill="${waterColor}" />
            <ellipse cx="100" cy="175" rx="65" ry="10" fill="${waterDarkColor}" opacity="0.2" />
        `;
    }

    // Stage 5: Large lotus leaf (50-60)
    else if (stageIndex === 5) {
        const progress = (score - 50) / 10;
        const leafSize = 38 + progress * 12;
        svgContent = `
            <!-- Big lotus leaf on water -->
            <ellipse cx="100" cy="160" rx="${leafSize}" ry="${leafSize * 0.6}" fill="${leafColor}" />
            <ellipse cx="100" cy="158" rx="${leafSize * 0.8}" ry="${leafSize * 0.45}" fill="#4a9d42" opacity="0.3" />
            <!-- Leaf veins -->
            <path d="M 100 ${160 - leafSize * 0.5} L 100 ${160 + leafSize * 0.4}" stroke="#2d5a27" stroke-width="1" opacity="0.4" />
            <path d="M ${100 - leafSize * 0.7} 160 Q 100 155 ${100 + leafSize * 0.7} 160" stroke="#2d5a27" stroke-width="1" fill="none" opacity="0.3" />
            <!-- Water around leaf -->
            <ellipse cx="100" cy="175" rx="85" ry="18" fill="${waterColor}" />
            <ellipse cx="100" cy="175" rx="65" ry="10" fill="${waterDarkColor}" opacity="0.2" />
        `;
    }

    // Stage 6: Small bud (60-70)
    else if (stageIndex === 6) {
        const progress = (score - 60) / 10;
        const budHeight = 12 + progress * 6;
        const budWidth = 8 + progress * 4;
        svgContent = `
            <!-- Lotus leaf -->
            <ellipse cx="100" cy="165" rx="45" ry="25" fill="${leafColor}" />
            <ellipse cx="100" cy="163" rx="35" ry="18" fill="#4a9d42" opacity="0.3" />
            <!-- Water -->
            <ellipse cx="100" cy="178" rx="85" ry="18" fill="${waterColor}" />
            <!-- Stem to bud -->
            <path d="M 100 165 Q 100 145 100 ${135 - progress * 5}" stroke="${stemColor}" stroke-width="3" fill="none" />
            <!-- Small bud -->
            <ellipse cx="100" cy="${130 - progress * 8}" rx="${budWidth}" ry="${budHeight}" fill="${petalColorLight}" />
            <ellipse cx="100" cy="${128 - progress * 8}" rx="${budWidth * 0.6}" ry="${budHeight * 0.5}" fill="${petalColorMedium}" opacity="0.5" />
        `;
    }

    // Stage 7: Large bud (70-80)
    else if (stageIndex === 7) {
        const progress = (score - 70) / 10;
        const budHeight = 20 + progress * 8;
        const budWidth = 14 + progress * 6;
        svgContent = `
            <!-- Lotus leaf -->
            <ellipse cx="100" cy="165" rx="45" ry="25" fill="${leafColor}" />
            <ellipse cx="100" cy="163" rx="35" ry="18" fill="#4a9d42" opacity="0.3" />
            <!-- Water -->
            <ellipse cx="100" cy="178" rx="85" ry="18" fill="${waterColor}" />
            <!-- Stem to bud -->
            <path d="M 100 165 Q 100 135 100 ${115 - progress * 10}" stroke="${stemColor}" stroke-width="3" fill="none" />
            <!-- Large bud -->
            <ellipse cx="100" cy="${110 - progress * 12}" rx="${budWidth}" ry="${budHeight}" fill="${petalColorMedium}" />
            <!-- Bud details - petals starting to show -->
            <path d="M ${100 - budWidth * 0.3} ${108 - progress * 12 - budHeight * 0.3}
                     Q 100 ${108 - progress * 12 - budHeight * 0.7}
                     ${100 + budWidth * 0.3} ${108 - progress * 12 - budHeight * 0.3}"
                  fill="${petalColorLight}" />
            ${progress > 0.5 ? `
                <!-- Petals starting to separate -->
                <path d="M ${100 - budWidth * 0.4} ${110 - progress * 12}
                         Q ${100 - budWidth * 0.7} ${110 - progress * 12 - budHeight * 0.4}
                         ${100 - budWidth * 0.15} ${110 - progress * 12 - budHeight * 0.6}"
                      fill="${petalColorDark}" opacity="0.4" />
                <path d="M ${100 + budWidth * 0.4} ${110 - progress * 12}
                         Q ${100 + budWidth * 0.7} ${110 - progress * 12 - budHeight * 0.4}
                         ${100 + budWidth * 0.15} ${110 - progress * 12 - budHeight * 0.6}"
                      fill="${petalColorDark}" opacity="0.4" />
            ` : ''}
        `;
    }

    // Stage 8: Opening flower (80-90)
    else if (stageIndex === 8) {
        const progress = (score - 80) / 10;
        const bloomSize = 0.7 + progress * 0.3;
        const centerY = 90;
        svgContent = `
            <!-- Lotus leaf -->
            <ellipse cx="100" cy="168" rx="48" ry="27" fill="${leafColor}" />
            <ellipse cx="100" cy="166" rx="38" ry="19" fill="#4a9d42" opacity="0.3" />
            <!-- Water -->
            <ellipse cx="100" cy="180" rx="90" ry="20" fill="${waterColor}" />
            <!-- Stem -->
            <path d="M 100 168 Q 100 130 100 ${centerY + 25}" stroke="${stemColor}" stroke-width="4" fill="none" />

            <!-- Outer petals (partially open) -->
            <g transform="translate(100, ${centerY}) scale(${bloomSize})">
                <ellipse cx="-30" cy="8" rx="16" ry="28" fill="${petalColorLight}" transform="rotate(-35)" />
                <ellipse cx="30" cy="8" rx="16" ry="28" fill="${petalColorLight}" transform="rotate(35)" />
                <ellipse cx="-18" cy="-8" rx="14" ry="26" fill="${petalColorLight}" transform="rotate(-20)" />
                <ellipse cx="18" cy="-8" rx="14" ry="26" fill="${petalColorLight}" transform="rotate(20)" />
                <ellipse cx="0" cy="-15" rx="12" ry="24" fill="${petalColorLight}" />
            </g>

            <!-- Inner petals -->
            <g transform="translate(100, ${centerY}) scale(${bloomSize})">
                <ellipse cx="-12" cy="0" rx="10" ry="20" fill="${petalColorMedium}" transform="rotate(-15)" />
                <ellipse cx="12" cy="0" rx="10" ry="20" fill="${petalColorMedium}" transform="rotate(15)" />
                <ellipse cx="0" cy="-8" rx="8" ry="18" fill="${petalColorMedium}" />
            </g>

            <!-- Center (small) -->
            <circle cx="100" cy="${centerY}" r="${8 * bloomSize}" fill="${centerColor}" />
        `;
    }

    // Stage 9: Full bloom (90-100)
    else {
        const progress = (score - 90) / 10;
        const bloomSize = 1 + progress * 0.3;
        const centerY = 85;
        svgContent = `
            <!-- Lotus leaf -->
            <ellipse cx="100" cy="168" rx="50" ry="28" fill="${leafColor}" />
            <ellipse cx="100" cy="166" rx="40" ry="20" fill="#4a9d42" opacity="0.3" />
            <!-- Water -->
            <ellipse cx="100" cy="180" rx="90" ry="20" fill="${waterColor}" />
            <!-- Stem -->
            <path d="M 100 168 Q 100 130 100 ${centerY + 30}" stroke="${stemColor}" stroke-width="4" fill="none" />

            <!-- Outer petals (back layer) -->
            <g transform="translate(100, ${centerY}) scale(${bloomSize})">
                <ellipse cx="-35" cy="5" rx="20" ry="35" fill="${petalColorLight}" transform="rotate(-40)" />
                <ellipse cx="35" cy="5" rx="20" ry="35" fill="${petalColorLight}" transform="rotate(40)" />
                <ellipse cx="-25" cy="-15" rx="18" ry="32" fill="${petalColorLight}" transform="rotate(-25)" />
                <ellipse cx="25" cy="-15" rx="18" ry="32" fill="${petalColorLight}" transform="rotate(25)" />
                <ellipse cx="0" cy="-25" rx="15" ry="30" fill="${petalColorLight}" />
            </g>

            <!-- Middle petals -->
            <g transform="translate(100, ${centerY}) scale(${bloomSize})">
                <ellipse cx="-20" cy="0" rx="15" ry="28" fill="${petalColorMedium}" transform="rotate(-30)" />
                <ellipse cx="20" cy="0" rx="15" ry="28" fill="${petalColorMedium}" transform="rotate(30)" />
                <ellipse cx="-12" cy="-12" rx="13" ry="25" fill="${petalColorMedium}" transform="rotate(-15)" />
                <ellipse cx="12" cy="-12" rx="13" ry="25" fill="${petalColorMedium}" transform="rotate(15)" />
                <ellipse cx="0" cy="-18" rx="12" ry="22" fill="${petalColorMedium}" />
            </g>

            <!-- Inner petals -->
            <g transform="translate(100, ${centerY}) scale(${bloomSize})">
                <ellipse cx="-8" cy="-5" rx="10" ry="20" fill="${petalColorDark}" transform="rotate(-10)" />
                <ellipse cx="8" cy="-5" rx="10" ry="20" fill="${petalColorDark}" transform="rotate(10)" />
                <ellipse cx="0" cy="-10" rx="8" ry="18" fill="${petalColorDark}" />
            </g>

            <!-- Center -->
            <circle cx="100" cy="${centerY}" r="${12 * bloomSize}" fill="${centerColor}" />
            <circle cx="100" cy="${centerY}" r="${8 * bloomSize}" fill="#ffed4a" />

            <!-- Sparkle effect for high scores -->
            ${score >= 95 ? `
                <circle cx="70" cy="60" r="2" fill="#fff" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="130" cy="70" r="1.5" fill="#fff" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="85" cy="45" r="1.5" fill="#fff" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
                </circle>
            ` : ''}
        `;
    }

    return `
        <svg viewBox="0 0 200 200" class="lotus-svg">
            <defs>
                <filter id="lotus-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g filter="url(#lotus-glow)">
                ${svgContent}
            </g>
        </svg>
    `;
}

/**
 * Get stage progress info for display
 */
export function getStageProgressInfo(score) {
    const stage = getLotusStage(score);
    const stageIndex = LOTUS_STAGES.indexOf(stage);

    // Calculate progress within current stage
    const stageRange = stage.maxScore - stage.minScore;
    const progressInStage = ((score - stage.minScore) / stageRange) * 100;

    return {
        stageName: stage.name,
        stageIndex: stageIndex + 1,
        totalStages: LOTUS_STAGES.length,
        description: stage.description,
        nextStage: stage.nextStage,
        progressInStage: Math.round(progressInStage)
    };
}

// Store the current score to restore after preview
let currentScore = 0;
let isPreviewPlaying = false;

/**
 * Set the current score (called from statistics.js)
 */
export function setCurrentScore(score) {
    currentScore = score;
}

/**
 * Update the lotus display with a given score
 */
function updateLotusDisplay(score) {
    const lotusContainer = document.getElementById('lotusContainer');
    const scoreDisplay = document.getElementById('lotusScore');
    const stageNameEl = document.getElementById('lotusStageName');
    const stageProgressEl = document.getElementById('lotusStageProgress');
    const nextStageEl = document.getElementById('lotusNextStage');

    if (lotusContainer) {
        lotusContainer.innerHTML = generateLotusSVG(score);
    }

    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }

    const stageInfo = getStageProgressInfo(score);

    if (stageNameEl) {
        stageNameEl.textContent = `${stageInfo.stageName} (Stufe ${stageInfo.stageIndex}/${stageInfo.totalStages})`;
    }

    if (stageProgressEl) {
        stageProgressEl.textContent = stageInfo.description;
    }

    if (nextStageEl) {
        nextStageEl.textContent = stageInfo.nextStage;
    }
}

/**
 * Play the lotus growth preview animation
 */
export async function playLotusPreview() {
    if (isPreviewPlaying) return;

    const btn = document.getElementById('lotusPreviewBtn');
    if (!btn) return;

    isPreviewPlaying = true;
    btn.disabled = true;
    btn.classList.add('playing');
    btn.innerHTML = '<span class="preview-icon">⏸</span> Läuft...';

    // Preview scores for each stage (10 stages)
    const previewScores = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];

    for (const score of previewScores) {
        updateLotusDisplay(score);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Restore original score
    updateLotusDisplay(currentScore);

    isPreviewPlaying = false;
    btn.disabled = false;
    btn.classList.remove('playing');
    btn.innerHTML = '<span class="preview-icon">▶</span> Wachstum ansehen';
}

/**
 * Initialize the lotus preview button
 */
export function initializeLotusPreview() {
    const btn = document.getElementById('lotusPreviewBtn');
    if (btn) {
        btn.addEventListener('click', playLotusPreview);
    }
}
