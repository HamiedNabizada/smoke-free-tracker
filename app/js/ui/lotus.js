/**
 * Lotus Flower Visualization
 *
 * Replaces the health score gauge with a growing lotus flower.
 * Based on research showing digital pets increase app engagement by 20-30%.
 * Source: Boston University School of Public Health, 2024
 * https://www.bu.edu/sph/news/articles/2024/novel-digital-pet-game-within-smoking-cessation-app-increases-user-engagement-with-apps-tools-to-quit-smoking/
 */

// Growth stages with thresholds and descriptions
const LOTUS_STAGES = [
    {
        minScore: 0,
        maxScore: 20,
        name: 'Samen',
        description: 'Deine Lotus beginnt zu keimen',
        nextStage: 'Bei 20 Punkten erscheint der erste Spross'
    },
    {
        minScore: 20,
        maxScore: 40,
        name: 'Spross',
        description: 'Ein zartes Pflänzchen wächst',
        nextStage: 'Bei 40 Punkten entfaltet sich das erste Blatt'
    },
    {
        minScore: 40,
        maxScore: 60,
        name: 'Blatt',
        description: 'Das Lotusblatt schwimmt auf dem Wasser',
        nextStage: 'Bei 60 Punkten bildet sich die Knospe'
    },
    {
        minScore: 60,
        maxScore: 80,
        name: 'Knospe',
        description: 'Die Blütenknospe bereitet sich vor',
        nextStage: 'Bei 80 Punkten beginnt die Blüte sich zu öffnen'
    },
    {
        minScore: 80,
        maxScore: 100,
        name: 'Blüte',
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

    // Stage 0: Seed (0-20)
    if (stageIndex === 0) {
        const progress = (score - 0) / 20;
        const seedSize = 8 + progress * 4;
        svgContent = `
            ${waterBase}
            <!-- Seed -->
            <ellipse cx="100" cy="165" rx="${seedSize}" ry="${seedSize * 0.7}" fill="#5a3825" />
            <ellipse cx="100" cy="163" rx="${seedSize * 0.6}" ry="${seedSize * 0.4}" fill="#7a5035" opacity="0.5" />
            ${progress > 0.5 ? `
                <!-- Tiny sprout emerging -->
                <path d="M 100 ${165 - seedSize * 0.7} Q 100 ${155 - progress * 10} 100 ${155 - progress * 15}"
                      stroke="${stemColor}" stroke-width="2" fill="none" stroke-linecap="round" />
            ` : ''}
        `;
    }

    // Stage 1: Sprout (20-40)
    else if (stageIndex === 1) {
        const progress = (score - 20) / 20;
        const stemHeight = 30 + progress * 20;
        svgContent = `
            ${waterBase}
            <!-- Stem -->
            <path d="M 100 170 Q 100 ${170 - stemHeight * 0.5} 100 ${170 - stemHeight}"
                  stroke="${stemColor}" stroke-width="3" fill="none" stroke-linecap="round" />
            <!-- Small leaves -->
            <ellipse cx="${95 - progress * 5}" cy="${170 - stemHeight + 10}"
                     rx="${8 + progress * 4}" ry="${4 + progress * 2}"
                     fill="${leafColor}" transform="rotate(-20 ${95 - progress * 5} ${170 - stemHeight + 10})" />
            ${progress > 0.5 ? `
                <ellipse cx="${105 + progress * 5}" cy="${170 - stemHeight + 15}"
                         rx="${6 + progress * 3}" ry="${3 + progress * 1.5}"
                         fill="${leafColor}" transform="rotate(25 ${105 + progress * 5} ${170 - stemHeight + 15})" />
            ` : ''}
        `;
    }

    // Stage 2: Leaf on water (40-60)
    else if (stageIndex === 2) {
        const progress = (score - 40) / 20;
        const leafSize = 35 + progress * 15;
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
            ${progress > 0.5 ? `
                <!-- Small bud starting -->
                <ellipse cx="100" cy="${145 - progress * 10}" rx="6" ry="10" fill="${petalColorLight}" />
            ` : ''}
        `;
    }

    // Stage 3: Bud forming (60-80)
    else if (stageIndex === 3) {
        const progress = (score - 60) / 20;
        const budHeight = 15 + progress * 10;
        const budWidth = 10 + progress * 8;
        svgContent = `
            <!-- Lotus leaf -->
            <ellipse cx="100" cy="165" rx="45" ry="25" fill="${leafColor}" />
            <ellipse cx="100" cy="163" rx="35" ry="18" fill="#4a9d42" opacity="0.3" />
            <!-- Water -->
            <ellipse cx="100" cy="178" rx="85" ry="18" fill="${waterColor}" />
            <!-- Stem to bud -->
            <path d="M 100 165 Q 100 140 100 ${130 - progress * 10}" stroke="${stemColor}" stroke-width="3" fill="none" />
            <!-- Bud -->
            <ellipse cx="100" cy="${125 - progress * 15}" rx="${budWidth}" ry="${budHeight}" fill="${petalColorMedium}" />
            <!-- Bud details - petals starting to show -->
            <path d="M ${100 - budWidth * 0.3} ${125 - progress * 15 - budHeight * 0.3}
                     Q 100 ${125 - progress * 15 - budHeight * 0.8}
                     ${100 + budWidth * 0.3} ${125 - progress * 15 - budHeight * 0.3}"
                  fill="${petalColorLight}" />
            ${progress > 0.6 ? `
                <!-- Petals starting to separate -->
                <path d="M ${100 - budWidth * 0.5} ${125 - progress * 15}
                         Q ${100 - budWidth * 0.8} ${125 - progress * 15 - budHeight * 0.5}
                         ${100 - budWidth * 0.2} ${125 - progress * 15 - budHeight * 0.7}"
                      fill="${petalColorDark}" opacity="0.5" />
                <path d="M ${100 + budWidth * 0.5} ${125 - progress * 15}
                         Q ${100 + budWidth * 0.8} ${125 - progress * 15 - budHeight * 0.5}
                         ${100 + budWidth * 0.2} ${125 - progress * 15 - budHeight * 0.7}"
                      fill="${petalColorDark}" opacity="0.5" />
            ` : ''}
        `;
    }

    // Stage 4: Full bloom (80-100)
    else {
        const progress = (score - 80) / 20;
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

    // Preview scores for each stage
    const previewScores = [10, 30, 50, 70, 95];

    for (const score of previewScores) {
        updateLotusDisplay(score);
        await new Promise(resolve => setTimeout(resolve, 1500));
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
