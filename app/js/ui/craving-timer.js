import { calculateStats } from '../utils/calculations.js';
import { updateCompactCravingStats } from './craving-stats.js';
import { recordCraving, getCravingCount } from '../firebase-auth.js';
import { MINI_GAMES } from './mini-games.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

// Craving tips that rotate during the timer (with fallbacks)
function getCravingTips() {
    return [
        { icon: '🫁', text: tr('cravingTimer.tips.breathe', 'Atme tief ein und langsam aus. Zähle dabei bis 4.') },
        { icon: '💪', text: tr('cravingTimer.tips.strong', 'Du bist stärker als jedes Verlangen. Du schaffst das!') },
        { icon: '⏱️', text: tr('cravingTimer.tips.fewMinutes', 'Nur noch ein paar Minuten. Das Verlangen wird schwächer!') },
        { icon: '🌊', text: tr('cravingTimer.tips.wave', 'Lass das Verlangen wie eine Welle über dich hinwegziehen.') },
        { icon: '🎯', text: tr('cravingTimer.tips.goal', 'Denk an dein Ziel: Ein gesünderes, freies Leben!') },
        { icon: '💧', text: tr('cravingTimer.tips.water', 'Trink ein großes Glas Wasser - das hilft sofort.') },
        { icon: '🚶', text: tr('cravingTimer.tips.move', 'Bewege dich! Geh ein paar Schritte oder strecke dich.') },
        { icon: '🧘', text: tr('cravingTimer.tips.focus', 'Konzentriere dich auf deinen Atem. Ein... Aus... Ein... Aus...') },
        { icon: '💚', text: tr('cravingTimer.tips.healing', 'Dein Körper heilt sich gerade. Jede Sekunde zählt!') },
        { icon: '🏆', text: tr('cravingTimer.tips.achieved', 'Du hast schon so viel geschafft. Gib jetzt nicht auf!') },
        { icon: '⭐', text: tr('cravingTimer.tips.stronger', 'Jedes überwundene Verlangen macht dich stärker!') },
        { icon: '🌟', text: tr('cravingTimer.tips.roleModel', 'Du bist ein Vorbild für andere. Bleib stark!') }
    ];
}

// Breathing exercises
function getBreathingExercises() {
    const inhale = tr('cravingTimer.breathing.inhale', 'Einatmen');
    const exhale = tr('cravingTimer.breathing.exhale', 'Ausatmen');
    const hold = tr('cravingTimer.breathing.hold', 'Halten');

    return {
        'box': {
            name: 'Box Breathing',
            phases: [
                { action: inhale, duration: 4 },
                { action: hold, duration: 4 },
                { action: exhale, duration: 4 },
                { action: hold, duration: 4 }
            ],
            cycles: 4
        },
        '478': {
            name: '4-7-8 Technik',
            phases: [
                { action: inhale, duration: 4 },
                { action: hold, duration: 7 },
                { action: exhale, duration: 8 }
            ],
            cycles: 4
        }
    };
}

let timerInterval = null;
let breathingInterval = null;
let secondsRemaining = 300; // 5 minutes

// Breathing exercise state
let currentExercise = null;
let exerciseInterval = null;
let phaseTimeout = null;
let currentPhaseIndex = 0;
let currentCycle = 1;
let exerciseRunning = false;

export function initializeCravingTimer() {
    const cravingButton = document.getElementById('cravingButton');
    const cravingCloseBtn = document.getElementById('cravingCloseBtn');
    const successCloseBtn = document.getElementById('successCloseBtn');
    const overlay = document.getElementById('cravingOverlay');

    if (cravingButton) {
        cravingButton.addEventListener('click', openSosHub);
    }

    if (cravingCloseBtn) {
        cravingCloseBtn.addEventListener('click', closeCravingOverlay);
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeCravingOverlay);
    }

    // Close overlay when clicking outside the content
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCravingOverlay();
            }
        });
    }

    // Initialize tabs
    initializeTabs();

    // Initialize breathing exercises
    initializeBreathingExercises();

    // Populate games list
    populateGamesList();
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.sos-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const contentId = tab.dataset.content;
            switchTab(contentId);
        });
    });
}

function switchTab(contentId) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.sos-tab');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.content === contentId);
    });

    // Update content areas
    const areas = document.querySelectorAll('.sos-content-area');
    areas.forEach(area => {
        const areaId = area.id.replace('sosContent', '').toLowerCase();
        area.classList.toggle('hidden', areaId !== contentId);
    });
}

function initializeBreathingExercises() {
    const boxBtn = document.getElementById('startBoxBreathing');
    const btn478 = document.getElementById('start478Breathing');

    if (boxBtn) {
        boxBtn.addEventListener('click', () => startBreathingExercise('box'));
    }

    if (btn478) {
        btn478.addEventListener('click', () => startBreathingExercise('478'));
    }
}

function startBreathingExercise(type) {
    const exercises = getBreathingExercises();
    currentExercise = exercises[type];
    if (!currentExercise) return;

    const optionsContainer = document.querySelector('.sos-breathing-options');
    const activeContainer = document.getElementById('sosBreathingActive');

    // Reset state
    currentPhaseIndex = 0;
    currentCycle = 1;
    exerciseRunning = true;

    // Show active exercise, hide options
    optionsContainer.classList.add('hidden');
    activeContainer.classList.remove('hidden');

    // Add stop button listener
    const stopBtn = document.getElementById('sosBreathingStop');
    if (stopBtn) {
        // Remove old listener and add new one
        stopBtn.onclick = stopBreathingExercise;
    }

    // Start first phase
    runBreathingPhase();
}

function runBreathingPhase() {
    if (!exerciseRunning || !currentExercise) return;

    const phase = currentExercise.phases[currentPhaseIndex];
    const instruction = document.getElementById('sosBreathingInstruction');
    const timer = document.getElementById('sosBreathingTimer');
    const progress = document.getElementById('sosBreathingProgress');
    const circle = document.querySelector('#sosBreathingActive .breathing-exercise-circle');

    // Update instruction
    instruction.textContent = phase.action;
    instruction.className = 'breathing-instruction ' + getPhaseClass(phase.action);

    // Update circle animation
    circle.className = 'breathing-exercise-circle ' + getPhaseClass(phase.action);
    circle.style.animationDuration = phase.duration + 's';

    // Update progress
    const cycleText = tr('cravingTimer.breathing.cycle', 'Zyklus {current} von {total}',
        { current: currentCycle, total: currentExercise.cycles });
    progress.textContent = cycleText;

    // Countdown timer
    let secondsLeft = phase.duration;
    timer.textContent = secondsLeft;

    if (exerciseInterval) clearInterval(exerciseInterval);

    exerciseInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            timer.textContent = secondsLeft;
        } else {
            timer.textContent = '';
        }
    }, 1000);

    // Move to next phase after duration
    if (phaseTimeout) clearTimeout(phaseTimeout);

    phaseTimeout = setTimeout(() => {
        clearInterval(exerciseInterval);

        currentPhaseIndex++;

        // Check if cycle complete
        if (currentPhaseIndex >= currentExercise.phases.length) {
            currentPhaseIndex = 0;
            currentCycle++;

            // Check if all cycles complete
            if (currentCycle > currentExercise.cycles) {
                showBreathingCompletion();
                return;
            }
        }

        runBreathingPhase();
    }, phase.duration * 1000);
}

function getPhaseClass(action) {
    // Support both German and English action names
    const inhaleTerms = ['Einatmen', 'Breathe in', 'Inhale'];
    const exhaleTerms = ['Ausatmen', 'Breathe out', 'Exhale'];
    const holdTerms = ['Halten', 'Hold'];

    if (inhaleTerms.includes(action)) return 'inhale';
    if (exhaleTerms.includes(action)) return 'exhale';
    if (holdTerms.includes(action)) return 'hold';
    return '';
}

function showBreathingCompletion() {
    const instruction = document.getElementById('sosBreathingInstruction');
    const timer = document.getElementById('sosBreathingTimer');
    const progress = document.getElementById('sosBreathingProgress');
    const circle = document.querySelector('#sosBreathingActive .breathing-exercise-circle');

    exerciseRunning = false;

    instruction.textContent = tr('cravingTimer.breathing.done', 'Geschafft!');
    instruction.className = 'breathing-instruction complete';
    timer.textContent = '';
    progress.textContent = tr('cravingTimer.breathing.completed', 'Übung abgeschlossen');
    circle.className = 'breathing-exercise-circle complete';

    // Auto-close after 2 seconds
    setTimeout(() => {
        stopBreathingExercise();
    }, 2000);
}

function stopBreathingExercise() {
    exerciseRunning = false;

    if (exerciseInterval) {
        clearInterval(exerciseInterval);
        exerciseInterval = null;
    }

    if (phaseTimeout) {
        clearTimeout(phaseTimeout);
        phaseTimeout = null;
    }

    // Show options, hide active (with null checks)
    const optionsContainer = document.querySelector('.sos-breathing-options');
    const activeContainer = document.getElementById('sosBreathingActive');

    if (optionsContainer) optionsContainer.classList.remove('hidden');
    if (activeContainer) activeContainer.classList.add('hidden');

    // Reset state
    currentExercise = null;
    currentPhaseIndex = 0;
    currentCycle = 1;
}

function populateGamesList() {
    const gamesList = document.getElementById('sosGamesList');
    if (!gamesList || !MINI_GAMES) return;

    gamesList.innerHTML = MINI_GAMES.map(game => `
        <button class="sos-game-btn" data-game="${game.id}">
            <span class="game-icon">${game.icon}</span>
            <span class="game-info">
                <span class="game-name">${game.name}</span>
                <span class="game-desc">${game.description}</span>
            </span>
        </button>
    `).join('');

    // Add click handlers
    gamesList.querySelectorAll('.sos-game-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.game;
            startGameInline(gameId);
        });
    });
}

function startGameInline(gameType) {
    const gamesList = document.getElementById('sosGamesList');
    const gameActive = document.getElementById('sosGameActive');

    // Hide list, show game container
    gamesList.classList.add('hidden');
    gameActive.classList.remove('hidden');

    // Render game based on type
    switch (gameType) {
        case 'tap':
            renderTapGame(gameActive);
            break;
        case 'breathe':
            renderBreatheGame(gameActive);
            break;
        case 'memory':
            renderMemoryGame(gameActive);
            break;
    }
}

function closeGameInline() {
    // Clear all breathe game timeouts
    breatheGameTimeouts.forEach(t => clearTimeout(t));
    breatheGameTimeouts = [];

    const gamesList = document.getElementById('sosGamesList');
    const gameActiveEl = document.getElementById('sosGameActive');

    // Clear game
    if (gameActiveEl) gameActiveEl.innerHTML = '';

    // Show list, hide game container
    if (gamesList) gamesList.classList.remove('hidden');
    if (gameActiveEl) gameActiveEl.classList.add('hidden');
}

// ========== INLINE GAMES ==========

let gameActive = false;
let gameScore = 0;
let gameTimer = null;
let targetTimer = null;
let timeRemaining = 30;
let breatheGameTimeouts = []; // Track all breathe game timeouts

function renderTapGame(container) {
    gameScore = 0;
    timeRemaining = 30;
    gameActive = true;

    const pointsLabel = tr('cravingTimer.games.points', 'Punkte');
    const timeLabel = tr('cravingTimer.games.time', 'Zeit');
    const backLabel = tr('cravingTimer.games.back', 'Zurück');

    container.innerHTML = `
        <div class="inline-game tap-game">
            <div class="game-header">
                <span class="game-score">${pointsLabel}: <strong id="tapScore">0</strong></span>
                <span class="game-time">${timeLabel}: <strong id="tapTime">30s</strong></span>
            </div>
            <div class="tap-arena" id="tapArena">
                <div class="tap-target" id="tapTarget"></div>
            </div>
            <button class="game-back-btn" id="gameBackBtn">${backLabel}</button>
        </div>
    `;

    document.getElementById('gameBackBtn').addEventListener('click', () => {
        if (gameTimer) clearInterval(gameTimer);
        if (targetTimer) clearTimeout(targetTimer);
        gameActive = false;
        closeGameInline();
    });

    const arena = document.getElementById('tapArena');
    const target = document.getElementById('tapTarget');

    target.addEventListener('click', () => {
        if (!gameActive) return;
        gameScore++;
        document.getElementById('tapScore').textContent = gameScore;
        moveTarget(arena, target);
    });

    gameTimer = setInterval(() => {
        timeRemaining--;
        document.getElementById('tapTime').textContent = timeRemaining + 's';

        if (timeRemaining <= 0) {
            endTapGame(container);
        }
    }, 1000);

    moveTarget(arena, target);
}

function moveTarget(arena, target) {
    const arenaRect = arena.getBoundingClientRect();
    const targetSize = 50;
    const maxX = arenaRect.width - targetSize - 10;
    const maxY = arenaRect.height - targetSize - 10;

    const x = Math.random() * maxX + 5;
    const y = Math.random() * maxY + 5;

    target.style.left = x + 'px';
    target.style.top = y + 'px';
    target.style.opacity = '1';
    target.style.transform = 'scale(1)';

    if (targetTimer) clearTimeout(targetTimer);
    targetTimer = setTimeout(() => {
        if (gameActive) {
            target.style.opacity = '0.3';
            target.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (gameActive) moveTarget(arena, target);
            }, 300);
        }
    }, 1500);
}

function endTapGame(container) {
    gameActive = false;
    if (gameTimer) clearInterval(gameTimer);
    if (targetTimer) clearTimeout(targetTimer);

    const superText = tr('cravingTimer.games.super', 'Super!');
    const goodText = tr('cravingTimer.games.good', 'Gut!');
    const keepPracticingText = tr('cravingTimer.games.keepPracticing', 'Weiter üben!');
    let message = gameScore >= 25 ? superText : gameScore >= 15 ? goodText : keepPracticingText;

    const pointsLabel = tr('cravingTimer.games.points', 'Punkte');
    const playAgainLabel = tr('cravingTimer.games.playAgain', 'Nochmal');
    const backLabel = tr('cravingTimer.games.back', 'Zurück');

    container.innerHTML = `
        <div class="inline-game game-result">
            <div class="result-score">${gameScore}</div>
            <div class="result-label">${pointsLabel}</div>
            <p class="result-message">${message}</p>
            <div class="game-actions">
                <button class="game-btn-primary" id="playAgainBtn">${playAgainLabel}</button>
                <button class="game-btn-secondary" id="gameBackBtn">${backLabel}</button>
            </div>
        </div>
    `;

    document.getElementById('playAgainBtn').addEventListener('click', () => renderTapGame(container));
    document.getElementById('gameBackBtn').addEventListener('click', closeGameInline);
}

function renderBreatheGame(container) {
    let breathCount = 0;
    const totalBreaths = 5;
    let phase = 'inhale';
    gameActive = true;
    breatheGameTimeouts = []; // Clear previous timeouts

    const breatheInText = tr('cravingTimer.games.breatheIn', 'Atme ein...');
    const breatheOutText = tr('cravingTimer.games.breatheOut', 'Atme aus...');
    const breathsLabel = tr('cravingTimer.games.breaths', 'Atemzüge');
    const backLabel = tr('cravingTimer.games.back', 'Zurück');

    container.innerHTML = `
        <div class="inline-game breathe-game">
            <p class="breathe-instruction" id="breatheInstruction">${breatheInText}</p>
            <div class="breathe-circle-container">
                <div class="breathe-circle" id="breatheCircle"></div>
            </div>
            <div class="breathe-progress">
                <span id="breatheCount">0</span> / ${totalBreaths} ${breathsLabel}
            </div>
            <button class="game-back-btn" id="gameBackBtn">${backLabel}</button>
        </div>
    `;

    document.getElementById('gameBackBtn').addEventListener('click', () => {
        gameActive = false;
        closeGameInline();
    });

    const circle = document.getElementById('breatheCircle');
    const instruction = document.getElementById('breatheInstruction');

    function breatheCycle() {
        if (!gameActive) return;

        if (phase === 'inhale') {
            instruction.textContent = breatheInText;
            circle.classList.add('inhale');
            circle.classList.remove('exhale');

            const t1 = setTimeout(() => {
                if (!gameActive) return;
                phase = 'exhale';
                instruction.textContent = breatheOutText;
                circle.classList.add('exhale');
                circle.classList.remove('inhale');

                const t2 = setTimeout(() => {
                    if (!gameActive) return;
                    breathCount++;
                    const countEl = document.getElementById('breatheCount');
                    if (countEl) countEl.textContent = breathCount;
                    phase = 'inhale';

                    if (breathCount >= totalBreaths) {
                        endBreatheGame(container);
                    } else {
                        breatheCycle();
                    }
                }, 4000);
                breatheGameTimeouts.push(t2);
            }, 4000);
            breatheGameTimeouts.push(t1);
        }
    }

    breatheCycle();
}

function endBreatheGame(container) {
    gameActive = false;

    const resultMessage = tr('cravingTimer.games.breatheResult', '5 tiefe Atemzüge - gut gemacht!');
    const playAgainLabel = tr('cravingTimer.games.playAgain', 'Nochmal');
    const backLabel = tr('cravingTimer.games.back', 'Zurück');

    container.innerHTML = `
        <div class="inline-game game-result">
            <div class="result-icon">✨</div>
            <p class="result-message">${resultMessage}</p>
            <div class="game-actions">
                <button class="game-btn-primary" id="playAgainBtn">${playAgainLabel}</button>
                <button class="game-btn-secondary" id="gameBackBtn">${backLabel}</button>
            </div>
        </div>
    `;

    document.getElementById('playAgainBtn').addEventListener('click', () => renderBreatheGame(container));
    document.getElementById('gameBackBtn').addEventListener('click', closeGameInline);
}

function renderMemoryGame(container) {
    const emojis = ['🫁', '❤️', '💪', '🏆', '⭐', '🌟'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let moves = 0;
    gameActive = true;

    const movesLabel = tr('cravingTimer.games.moves', 'Züge');
    const foundLabel = tr('cravingTimer.games.found', 'Gefunden');
    const backLabel = tr('cravingTimer.games.back', 'Zurück');

    container.innerHTML = `
        <div class="inline-game memory-game">
            <div class="game-header">
                <span>${movesLabel}: <strong id="memoryMoves">0</strong></span>
                <span>${foundLabel}: <strong id="memoryMatched">0/6</strong></span>
            </div>
            <div class="memory-grid-inline" id="memoryGrid">
                ${cards.map((emoji, i) => `
                    <div class="memory-card-inline" data-index="${i}" data-emoji="${emoji}">
                        <div class="card-front">?</div>
                        <div class="card-back">${emoji}</div>
                    </div>
                `).join('')}
            </div>
            <button class="game-back-btn" id="gameBackBtn">${backLabel}</button>
        </div>
    `;

    document.getElementById('gameBackBtn').addEventListener('click', () => {
        gameActive = false;
        closeGameInline();
    });

    const grid = document.getElementById('memoryGrid');
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.memory-card-inline');
        if (!card || !gameActive) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (flipped.length >= 2) return;

        card.classList.add('flipped');
        flipped.push(card);

        if (flipped.length === 2) {
            moves++;
            document.getElementById('memoryMoves').textContent = moves;

            const [card1, card2] = flipped;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matched++;
                document.getElementById('memoryMatched').textContent = matched + '/6';
                flipped = [];

                if (matched === 6) {
                    setTimeout(() => endMemoryGame(container, moves), 500);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flipped = [];
                }, 1000);
            }
        }
    });
}

function endMemoryGame(container, moves) {
    gameActive = false;

    const perfectText = tr('cravingTimer.games.perfect', 'Perfekt!');
    const veryGoodText = tr('cravingTimer.games.veryGood', 'Sehr gut!');
    const wellDoneText = tr('cravingTimer.games.wellDone', 'Gut gemacht!');
    let message = moves <= 10 ? perfectText : moves <= 15 ? veryGoodText : wellDoneText;

    const movesLabel = tr('cravingTimer.games.moves', 'Züge');
    const playAgainLabel = tr('cravingTimer.games.playAgain', 'Nochmal');
    const backLabel = tr('cravingTimer.games.back', 'Zurück');

    container.innerHTML = `
        <div class="inline-game game-result">
            <div class="result-score">${moves}</div>
            <div class="result-label">${movesLabel}</div>
            <p class="result-message">${message}</p>
            <div class="game-actions">
                <button class="game-btn-primary" id="playAgainBtn">${playAgainLabel}</button>
                <button class="game-btn-secondary" id="gameBackBtn">${backLabel}</button>
            </div>
        </div>
    `;

    document.getElementById('playAgainBtn').addEventListener('click', () => renderMemoryGame(container));
    document.getElementById('gameBackBtn').addEventListener('click', closeGameInline);
}

// ========== MAIN TIMER FUNCTIONS ==========

function openSosHub() {
    const overlay = document.getElementById('cravingOverlay');
    overlay.classList.remove('hidden');

    // Start timer immediately
    startCravingTimer();

    // Reset to tips tab
    switchTab('tips');
}

function startCravingTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const cravingSuccess = document.getElementById('cravingSuccess');
    const sosContent = document.querySelector('.sos-content');
    const sosTabs = document.querySelector('.sos-tabs');

    // Reset state
    secondsRemaining = 300;
    if (cravingSuccess) cravingSuccess.classList.add('hidden');
    if (sosContent) sosContent.classList.remove('hidden');
    if (sosTabs) sosTabs.classList.remove('hidden');

    // Show random tip immediately
    showRandomTip();

    // Start breathing text animation
    startBreathingAnimation();

    // Start countdown
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        secondsRemaining--;

        // Update timer display
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Change tip every 30 seconds
        if (secondsRemaining % 30 === 0 && secondsRemaining > 0) {
            showRandomTip();
        }

        // Timer finished
        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            showSuccessMessage();
        }
    }, 1000);
}

function showRandomTip() {
    const tips = getCravingTips();
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const iconElement = document.querySelector('.tip-icon-large');
    const textElement = document.getElementById('cravingTipText');

    if (iconElement && textElement) {
        // Fade out
        iconElement.style.opacity = '0';
        textElement.style.opacity = '0';

        setTimeout(() => {
            iconElement.textContent = randomTip.icon;
            textElement.textContent = randomTip.text;

            // Fade in
            iconElement.style.opacity = '1';
            textElement.style.opacity = '1';
        }, 300);
    }
}

async function showSuccessMessage() {
    const cravingSuccess = document.getElementById('cravingSuccess');
    const successStats = document.getElementById('successStats');
    const countCheckbox = document.getElementById('countCravingCheckbox');
    const sosContent = document.querySelector('.sos-content');
    const sosTabs = document.querySelector('.sos-tabs');

    // Hide content
    if (sosContent) sosContent.classList.add('hidden');
    if (sosTabs) sosTabs.classList.add('hidden');

    // Calculate stats
    const stats = calculateStats();

    // Check if user wants to count this craving
    const shouldCount = countCheckbox && countCheckbox.checked;

    let currentCount = 0;

    if (shouldCount) {
        await recordCraving();
        const result = await getCravingCount();
        currentCount = result.count;
        updateCompactCravingStats();
    }

    // Calculate time held
    const secondsHeld = 300 - secondsRemaining;
    const minutesHeld = Math.floor(secondsHeld / 60);
    const secondsRemainder = secondsHeld % 60;

    const minuteText = tr('cravingTimer.success.minute', 'Minute');
    const minutesText = tr('cravingTimer.success.minutes', 'Minuten');
    const secondsText = tr('cravingTimer.success.seconds', 'Sekunden');
    const andText = tr('cravingTimer.success.and', 'und');

    const timeHeldText = minutesHeld > 0
        ? `${minutesHeld} ${minutesHeld > 1 ? minutesText : minuteText}${secondsRemainder > 0 ? ` ${andText} ${secondsRemainder} ${secondsText}` : ''}`
        : `${secondsHeld} ${secondsText}`;

    const cravingCountText = tr('cravingTimer.success.cravingCount', 'Das war dein {count}. überwundenes Verlangen heute!', { count: currentCount });
    const heldOnText = tr('cravingTimer.success.heldOn', 'Du hast <strong>{time}</strong> durchgehalten.', { time: timeHeldText });
    const notCountedText = tr('cravingTimer.success.notCounted', 'Nicht als Verlangen gezählt.');
    const totalSmokeFreeDaysText = tr('cravingTimer.success.totalDays', 'Gesamt rauchfrei: <strong>{days} Tage</strong>', { days: stats.days });
    const savedText = tr('cravingTimer.success.saved', 'Gespart: <strong>{amount}€</strong>', { amount: stats.money.toFixed(2) });

    // Create success message with stats
    if (shouldCount) {
        successStats.innerHTML = `
            <p><strong>${cravingCountText}</strong></p>
            <p>${heldOnText}</p>
            <p>${totalSmokeFreeDaysText}</p>
            <p>${savedText}</p>
        `;
    } else {
        successStats.innerHTML = `
            <p>${heldOnText}</p>
            <p>${notCountedText}</p>
            <p>${totalSmokeFreeDaysText}</p>
            <p>${savedText}</p>
        `;
    }

    // Show success message
    cravingSuccess.classList.remove('hidden');
}

function startBreathingAnimation() {
    const breathingText = document.getElementById('breathingText');

    if (!breathingText) return;

    if (breathingInterval) clearInterval(breathingInterval);

    const inhaleText = tr('cravingTimer.breathing.inhale', 'Einatmen');
    const exhaleText = tr('cravingTimer.breathing.exhale', 'Ausatmen');

    breathingText.textContent = inhaleText;

    breathingInterval = setInterval(() => {
        if (breathingText.textContent === inhaleText) {
            breathingText.textContent = exhaleText;
        } else {
            breathingText.textContent = inhaleText;
        }
    }, 4000);
}

async function closeCravingOverlay() {
    const overlay = document.getElementById('cravingOverlay');
    const countCheckbox = document.getElementById('countCravingCheckbox');
    const cravingSuccess = document.getElementById('cravingSuccess');

    // Check if we should count this
    const timeSpent = 300 - secondsRemaining;
    const isSuccessScreenVisible = !cravingSuccess.classList.contains('hidden');

    // Only count if checkbox is checked, some time was spent, and NOT already counted
    if (countCheckbox && countCheckbox.checked && timeSpent >= 10 && !isSuccessScreenVisible) {
        await recordCraving();
        updateCompactCravingStats();
    }

    // Hide overlay
    overlay.classList.add('hidden');

    // Clear timers
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }

    // Stop any active breathing exercise
    stopBreathingExercise();

    // Stop any active game
    gameActive = false;
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    if (targetTimer) {
        clearTimeout(targetTimer);
        targetTimer = null;
    }
    // Clear breathe game timeouts
    breatheGameTimeouts.forEach(t => clearTimeout(t));
    breatheGameTimeouts = [];

    closeGameInline();

    // Reset state
    secondsRemaining = 300;

    // Reset success screen
    cravingSuccess.classList.add('hidden');
    const sosContent = document.querySelector('.sos-content');
    const sosTabs = document.querySelector('.sos-tabs');
    if (sosContent) sosContent.classList.remove('hidden');
    if (sosTabs) sosTabs.classList.remove('hidden');

    // Reset timer display
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.textContent = '5:00';

    // Reset checkbox to checked for next time
    if (countCheckbox) {
        countCheckbox.checked = true;
    }

    // Reset to tips tab
    switchTab('tips');
}
