/**
 * Breathing Exercises Module
 *
 * Provides guided breathing exercises beyond the craving timer:
 * - 4-7-8 Technique (calming, for sleep/anxiety)
 * - Box Breathing (balance, focus)
 */

import { t, isInitialized } from '../i18n/i18n.js';

// Helper for translation with fallback
function tr(key, fallback, params = {}) {
    if (isInitialized()) {
        const translated = t(key, params);
        if (translated !== key) return translated;
    }
    return fallback.replace(/\{(\w+)\}/g, (match, p) => params[p] !== undefined ? params[p] : match);
}

// Get localized breathing exercises
function getBreathingExercises() {
    const inhale = tr('breathingExercises.inhale', 'Einatmen');
    const exhale = tr('breathingExercises.exhale', 'Ausatmen');
    const hold = tr('breathingExercises.hold', 'Halten');

    return {
        'box': {
            name: 'Box Breathing',
            description: tr('breathingExercises.box.description', 'Gleichmäßige Atmung für Balance und Fokus'),
            phases: [
                { action: inhale, duration: 4 },
                { action: hold, duration: 4 },
                { action: exhale, duration: 4 },
                { action: hold, duration: 4 }
            ],
            cycles: 4,
            totalTime: tr('breathingExercises.box.totalTime', '~2 Minuten'),
            benefits: tr('breathingExercises.box.benefits', 'Reduziert Stress, verbessert Konzentration')
        },
        '478': {
            name: tr('breathingExercises.478.name', '4-7-8 Technik'),
            description: tr('breathingExercises.478.description', 'Beruhigende Atmung für Entspannung'),
            phases: [
                { action: inhale, duration: 4 },
                { action: hold, duration: 7 },
                { action: exhale, duration: 8 }
            ],
            cycles: 4,
            totalTime: tr('breathingExercises.478.totalTime', '~2.5 Minuten'),
            benefits: tr('breathingExercises.478.benefits', 'Hilft beim Einschlafen, reduziert Angst')
        }
    };
}

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

export function startExercise(type) {
    const exercises = getBreathingExercises();
    currentExercise = exercises[type];
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
    progress.textContent = tr('breathingExercises.cycle', 'Zyklus {current} von {total}', { current: currentCycle, total: currentExercise.cycles });

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

            progress.textContent = tr('breathingExercises.cycle', 'Zyklus {current} von {total}', { current: currentCycle, total: currentExercise.cycles });
        }

        runPhase();
    }, phase.duration * 1000);
}

function getPhaseClass(action) {
    const inhale = tr('breathingExercises.inhale', 'Einatmen');
    const exhale = tr('breathingExercises.exhale', 'Ausatmen');
    const hold = tr('breathingExercises.hold', 'Halten');

    if (action === inhale) return 'inhale';
    if (action === exhale) return 'exhale';
    if (action === hold) return 'hold';
    return '';
}

function showCompletion() {
    const instruction = document.getElementById('breathingInstruction');
    const timer = document.getElementById('breathingPhaseTimer');
    const progress = document.getElementById('breathingCycleProgress');
    const circle = document.querySelector('.breathing-exercise-circle');

    isRunning = false;

    instruction.textContent = tr('breathingExercises.done', 'Geschafft!');
    instruction.className = 'breathing-instruction complete';
    timer.textContent = '';
    progress.textContent = tr('breathingExercises.completed', 'Du hast die Übung abgeschlossen');
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
