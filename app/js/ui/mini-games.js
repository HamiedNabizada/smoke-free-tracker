/**
 * Mini-Games for Craving Distraction
 */

// Exported games list for SOS hub
export const MINI_GAMES = [
    { id: 'tap', name: 'Tap Challenge', icon: '👆', description: 'Tippe auf die Ziele!' },
    { id: 'breathe', name: 'Atem-Trainer', icon: '🫁', description: 'Folge dem Atemrhythmus.' },
    { id: 'memory', name: 'Memory', icon: '🧠', description: 'Finde die Paare!' }
];

let gameActive = false;
let gameScore = 0;
let gameTimer = null;
let targetTimer = null;
let timeRemaining = 30;

/**
 * Initialize mini-games
 */
export function initializeMiniGames() {
    const playBtn = document.getElementById('playMiniGameBtn');
    if (playBtn) {
        playBtn.addEventListener('click', showGameSelection);
    }
}

/**
 * Show game selection modal
 */
function showGameSelection() {
    const modal = document.createElement('div');
    modal.className = 'mini-game-modal';
    modal.id = 'miniGameModal';
    modal.innerHTML = `
        <div class="mini-game-content">
            <button class="mini-game-close" id="closeGameModal">✕</button>
            <h2>🎮 Ablenkungsspiele</h2>
            <p class="game-intro">Lenke dich für ein paar Minuten ab!</p>

            <div class="game-selection">
                <button class="game-option" data-game="tap">
                    <span class="game-icon">👆</span>
                    <span class="game-name">Tap Challenge</span>
                    <span class="game-desc">Tippe auf die Ziele so schnell wie möglich!</span>
                </button>

                <button class="game-option" data-game="breathe">
                    <span class="game-icon">🫁</span>
                    <span class="game-name">Atem-Trainer</span>
                    <span class="game-desc">Folge dem Rhythmus und atme tief durch.</span>
                </button>

                <button class="game-option" data-game="memory">
                    <span class="game-icon">🧠</span>
                    <span class="game-name">Memory</span>
                    <span class="game-desc">Finde die passenden Paare!</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGameModal();
    });

    // Game selection
    modal.querySelectorAll('.game-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const game = btn.dataset.game;
            startGame(game);
        });
    });
}

/**
 * Close game modal
 */
function closeGameModal() {
    const modal = document.getElementById('miniGameModal');
    if (modal) {
        if (gameTimer) clearInterval(gameTimer);
        if (targetTimer) clearTimeout(targetTimer);
        gameActive = false;
        document.body.removeChild(modal);
    }
}

/**
 * Start selected game (exported for SOS hub)
 */
export function startGame(gameType) {
    // Create modal if it doesn't exist (when called from SOS hub)
    let modal = document.getElementById('miniGameModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'mini-game-modal';
        modal.id = 'miniGameModal';
        modal.innerHTML = `<div class="mini-game-content"></div>`;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeGameModal();
        });
    }

    const content = modal.querySelector('.mini-game-content');

    switch (gameType) {
        case 'tap':
            startTapGame(content);
            break;
        case 'breathe':
            startBreatheGame(content);
            break;
        case 'memory':
            startMemoryGame(content);
            break;
    }
}

/**
 * Tap Challenge Game
 */
function startTapGame(container) {
    gameScore = 0;
    timeRemaining = 30;
    gameActive = true;

    container.innerHTML = `
        <button class="mini-game-close" id="closeGameModal">✕</button>
        <h2>👆 Tap Challenge</h2>
        <div class="game-stats">
            <div class="game-stat">
                <span class="stat-label">Punkte</span>
                <span class="stat-value" id="tapScore">0</span>
            </div>
            <div class="game-stat">
                <span class="stat-label">Zeit</span>
                <span class="stat-value" id="tapTime">30s</span>
            </div>
        </div>
        <div class="tap-arena" id="tapArena">
            <div class="tap-target" id="tapTarget"></div>
        </div>
        <p class="game-hint">Tippe auf die Kreise!</p>
    `;

    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);

    const arena = document.getElementById('tapArena');
    const target = document.getElementById('tapTarget');

    // Target click handler
    target.addEventListener('click', () => {
        if (!gameActive) return;
        gameScore++;
        document.getElementById('tapScore').textContent = gameScore;
        moveTarget(arena, target);
    });

    // Start timer
    gameTimer = setInterval(() => {
        timeRemaining--;
        document.getElementById('tapTime').textContent = timeRemaining + 's';

        if (timeRemaining <= 0) {
            endTapGame(container);
        }
    }, 1000);

    // Initial target position
    moveTarget(arena, target);
}

/**
 * Move target to random position
 */
function moveTarget(arena, target) {
    const arenaRect = arena.getBoundingClientRect();
    const targetSize = 60;
    const maxX = arenaRect.width - targetSize - 10;
    const maxY = arenaRect.height - targetSize - 10;

    const x = Math.random() * maxX + 5;
    const y = Math.random() * maxY + 5;

    target.style.left = x + 'px';
    target.style.top = y + 'px';
    target.style.opacity = '1';
    target.style.transform = 'scale(1)';

    // Auto-move if not clicked (shrink and move after 2s)
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

/**
 * End tap game and show results
 */
function endTapGame(container) {
    gameActive = false;
    if (gameTimer) clearInterval(gameTimer);
    if (targetTimer) clearTimeout(targetTimer);

    let message = '';
    if (gameScore >= 30) {
        message = '🏆 Unglaublich! Du bist ein Profi!';
    } else if (gameScore >= 20) {
        message = '🌟 Sehr gut gemacht!';
    } else if (gameScore >= 10) {
        message = '👍 Gute Arbeit!';
    } else {
        message = '💪 Weiter üben!';
    }

    container.innerHTML = `
        <button class="mini-game-close" id="closeGameModal">✕</button>
        <h2>🎉 Geschafft!</h2>
        <div class="game-result">
            <div class="result-score">${gameScore}</div>
            <div class="result-label">Punkte</div>
            <p class="result-message">${message}</p>
        </div>
        <div class="game-actions">
            <button class="game-btn game-btn-primary" id="playAgainBtn">Nochmal spielen</button>
            <button class="game-btn game-btn-secondary" id="backToGamesBtn">Andere Spiele</button>
        </div>
    `;

    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);
    document.getElementById('playAgainBtn').addEventListener('click', () => startTapGame(container));
    document.getElementById('backToGamesBtn').addEventListener('click', () => {
        closeGameModal();
        showGameSelection();
    });
}

/**
 * Breathing Game
 */
function startBreatheGame(container) {
    let breathCount = 0;
    const totalBreaths = 5;
    let phase = 'inhale';

    container.innerHTML = `
        <button class="mini-game-close" id="closeGameModal">✕</button>
        <h2>🫁 Atem-Trainer</h2>
        <p class="breathe-instruction" id="breatheInstruction">Atme ein...</p>
        <div class="breathe-circle-container">
            <div class="breathe-circle" id="breatheCircle"></div>
        </div>
        <div class="breathe-progress">
            <span id="breatheCount">0</span> / ${totalBreaths} Atemzüge
        </div>
    `;

    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);

    const circle = document.getElementById('breatheCircle');
    const instruction = document.getElementById('breatheInstruction');
    gameActive = true;

    function breatheCycle() {
        if (!gameActive) return;

        if (phase === 'inhale') {
            instruction.textContent = 'Atme ein...';
            circle.classList.add('inhale');
            circle.classList.remove('exhale');

            setTimeout(() => {
                if (!gameActive) return;
                phase = 'exhale';
                instruction.textContent = 'Atme aus...';
                circle.classList.add('exhale');
                circle.classList.remove('inhale');

                setTimeout(() => {
                    if (!gameActive) return;
                    breathCount++;
                    document.getElementById('breatheCount').textContent = breathCount;
                    phase = 'inhale';

                    if (breathCount >= totalBreaths) {
                        endBreatheGame(container);
                    } else {
                        breatheCycle();
                    }
                }, 4000);
            }, 4000);
        }
    }

    breatheCycle();
}

/**
 * End breathing game
 */
function endBreatheGame(container) {
    gameActive = false;

    container.innerHTML = `
        <button class="mini-game-close" id="closeGameModal">✕</button>
        <h2>🧘 Entspannt!</h2>
        <div class="game-result">
            <div class="result-icon">✨</div>
            <p class="result-message">Du hast 5 tiefe Atemzüge gemacht. Fühlst du dich besser?</p>
        </div>
        <div class="game-actions">
            <button class="game-btn game-btn-primary" id="playAgainBtn">Nochmal</button>
            <button class="game-btn game-btn-secondary" id="backToGamesBtn">Andere Spiele</button>
        </div>
    `;

    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);
    document.getElementById('playAgainBtn').addEventListener('click', () => startBreatheGame(container));
    document.getElementById('backToGamesBtn').addEventListener('click', () => {
        closeGameModal();
        showGameSelection();
    });
}

/**
 * Memory Game
 */
function startMemoryGame(container) {
    const emojis = ['🫁', '❤️', '💪', '🏆', '⭐', '🌟', '🎯', '🌈'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let moves = 0;

    container.innerHTML = `
        <button class="mini-game-close" id="closeGameModal">✕</button>
        <h2>🧠 Memory</h2>
        <div class="game-stats">
            <div class="game-stat">
                <span class="stat-label">Züge</span>
                <span class="stat-value" id="memoryMoves">0</span>
            </div>
            <div class="game-stat">
                <span class="stat-label">Gefunden</span>
                <span class="stat-value" id="memoryMatched">0/8</span>
            </div>
        </div>
        <div class="memory-grid" id="memoryGrid">
            ${cards.map((emoji, i) => `
                <div class="memory-card" data-index="${i}" data-emoji="${emoji}">
                    <div class="card-front">?</div>
                    <div class="card-back">${emoji}</div>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);
    gameActive = true;

    const grid = document.getElementById('memoryGrid');
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.memory-card');
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
                document.getElementById('memoryMatched').textContent = matched + '/8';
                flipped = [];

                if (matched === 8) {
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

/**
 * End memory game
 */
function endMemoryGame(container, moves) {
    gameActive = false;

    let message = '';
    if (moves <= 12) {
        message = '🏆 Perfekt! Unglaubliches Gedächtnis!';
    } else if (moves <= 16) {
        message = '🌟 Sehr gut gemacht!';
    } else if (moves <= 24) {
        message = '👍 Gute Arbeit!';
    } else {
        message = '💪 Übung macht den Meister!';
    }

    container.innerHTML = `
        <button class="mini-game-close" id="closeGameModal">✕</button>
        <h2>🎉 Geschafft!</h2>
        <div class="game-result">
            <div class="result-score">${moves}</div>
            <div class="result-label">Züge</div>
            <p class="result-message">${message}</p>
        </div>
        <div class="game-actions">
            <button class="game-btn game-btn-primary" id="playAgainBtn">Nochmal spielen</button>
            <button class="game-btn game-btn-secondary" id="backToGamesBtn">Andere Spiele</button>
        </div>
    `;

    document.getElementById('closeGameModal').addEventListener('click', closeGameModal);
    document.getElementById('playAgainBtn').addEventListener('click', () => startMemoryGame(container));
    document.getElementById('backToGamesBtn').addEventListener('click', () => {
        closeGameModal();
        showGameSelection();
    });
}
