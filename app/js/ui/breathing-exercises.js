/**
 * Breathing Exercises Module
 *
 * Provides guided breathing exercises beyond the craving timer:
 * - 4-7-8 Technique (calming, for sleep/anxiety)
 * - Box Breathing (balance, focus)
 */

const BREATHING_EXERCISES = {
    'box': {
        name: 'Box Breathing',
        description: 'Gleichmäßige Atmung für Balance und Fokus',
        phases: [
            { action: 'Einatmen', duration: 4 },
            { action: 'Halten', duration: 4 },
            { action: 'Ausatmen', duration: 4 },
            { action: 'Halten', duration: 4 }
        ],
        cycles: 4,
        totalTime: '~2 Minuten',
        benefits: 'Reduziert Stress, verbessert Konzentration'
    },
    '478': {
        name: '4-7-8 Technik',
        description: 'Beruhigende Atmung für Entspannung',
        phases: [
            { action: 'Einatmen', duration: 4 },
            { action: 'Halten', duration: 7 },
            { action: 'Ausatmen', duration: 8 }
        ],
        cycles: 4,
        totalTime: '~2.5 Minuten',
        benefits: 'Hilft beim Einschlafen, reduziert Angst'
    }
};

let currentExercise = null;
let exerciseInterval = null;
let phaseTimeout = null;
let currentPhaseIndex = 0;
let currentCycle = 1;
let isRunning = false;

export function initializeBreathingExercises() {
    const overlay = document.getElementById('breathingExerciseOverlay');
    const closeBtn = document.getElementById('breathingExerciseCloseBtn');
    const boxBtn = document.getElementById('startBoxBreathing');
    const btn478 = document.getElementById('start478Breathing');

    if (boxBtn) {
        boxBtn.addEventListener('click', () => startExercise('box'));
    }

    if (btn478) {
        btn478.addEventListener('click', () => startExercise('478'));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeExercise);
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeExercise();
            }
        });
    }
}

function startExercise(type) {
    currentExercise = BREATHING_EXERCISES[type];
    if (!currentExercise) return;

    const overlay = document.getElementById('breathingExerciseOverlay');
    const title = document.getElementById('breathingExerciseTitle');
    const instruction = document.getElementById('breathingInstruction');
    const progress = document.getElementById('breathingCycleProgress');
    const circle = document.querySelector('.breathing-exercise-circle');

    // Reset state
    currentPhaseIndex = 0;
    currentCycle = 1;
    isRunning = true;

    // Update UI
    title.textContent = currentExercise.name;
    progress.textContent = `Zyklus ${currentCycle} von ${currentExercise.cycles}`;

    // Show overlay
    overlay.classList.remove('hidden');

    // Start first phase
    runPhase();
}

function runPhase() {
    if (!isRunning || !currentExercise) return;

    const phase = currentExercise.phases[currentPhaseIndex];
    const instruction = document.getElementById('breathingInstruction');
    const timer = document.getElementById('breathingPhaseTimer');
    const circle = document.querySelector('.breathing-exercise-circle');
    const progress = document.getElementById('breathingCycleProgress');

    // Update instruction
    instruction.textContent = phase.action;
    instruction.className = 'breathing-instruction ' + getPhaseClass(phase.action);

    // Update circle animation
    circle.className = 'breathing-exercise-circle ' + getPhaseClass(phase.action);
    circle.style.animationDuration = phase.duration + 's';

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
                showCompletion();
                return;
            }

            progress.textContent = `Zyklus ${currentCycle} von ${currentExercise.cycles}`;
        }

        runPhase();
    }, phase.duration * 1000);
}

function getPhaseClass(action) {
    switch (action) {
        case 'Einatmen': return 'inhale';
        case 'Ausatmen': return 'exhale';
        case 'Halten': return 'hold';
        default: return '';
    }
}

function showCompletion() {
    const instruction = document.getElementById('breathingInstruction');
    const timer = document.getElementById('breathingPhaseTimer');
    const progress = document.getElementById('breathingCycleProgress');
    const circle = document.querySelector('.breathing-exercise-circle');

    isRunning = false;

    instruction.textContent = 'Geschafft!';
    instruction.className = 'breathing-instruction complete';
    timer.textContent = '';
    progress.textContent = 'Du hast die Übung abgeschlossen';
    circle.className = 'breathing-exercise-circle complete';
}

function closeExercise() {
    const overlay = document.getElementById('breathingExerciseOverlay');

    isRunning = false;

    if (exerciseInterval) {
        clearInterval(exerciseInterval);
        exerciseInterval = null;
    }

    if (phaseTimeout) {
        clearTimeout(phaseTimeout);
        phaseTimeout = null;
    }

    overlay.classList.add('hidden');

    // Reset state
    currentExercise = null;
    currentPhaseIndex = 0;
    currentCycle = 1;
}
