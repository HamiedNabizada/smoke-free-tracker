/**
 * Tutorial Module
 * Handles the tutorial modal with slides
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

let currentSlide = 1;
const totalSlides = 5;

/**
 * Initialize tutorial
 */
export function initializeTutorial() {
    const tutorialBtn = document.getElementById('tutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const tutorialCloseBtn = document.getElementById('tutorialCloseBtn');
    const prevBtn = document.getElementById('tutorialPrevBtn');
    const nextBtn = document.getElementById('tutorialNextBtn');
    const dots = document.querySelectorAll('.tutorial-dot');

    if (!tutorialBtn || !tutorialModal) return;

    // Open tutorial
    tutorialBtn.addEventListener('click', () => {
        tutorialModal.classList.remove('hidden');
        currentSlide = 1;
        showSlide(1);
    });

    // Close tutorial
    tutorialCloseBtn.addEventListener('click', () => {
        tutorialModal.classList.add('hidden');
    });

    // Close when clicking outside
    tutorialModal.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.classList.add('hidden');
        }
    });

    // Previous button
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 1) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides) {
            currentSlide++;
            showSlide(currentSlide);
        } else {
            // Close on last slide
            tutorialModal.classList.add('hidden');
        }
    });

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideNum = parseInt(dot.getAttribute('data-slide'));
            currentSlide = slideNum;
            showSlide(currentSlide);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!tutorialModal.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft' && currentSlide > 1) {
                currentSlide--;
                showSlide(currentSlide);
            } else if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
                currentSlide++;
                showSlide(currentSlide);
            } else if (e.key === 'Escape') {
                tutorialModal.classList.add('hidden');
            }
        }
    });
}

/**
 * Show specific slide
 */
function showSlide(slideNum) {
    // Hide all slides
    const slides = document.querySelectorAll('.tutorial-slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Show current slide
    const currentSlideEl = document.querySelector(`.tutorial-slide[data-slide="${slideNum}"]`);
    if (currentSlideEl) {
        currentSlideEl.classList.add('active');
    }

    // Update dots
    const dots = document.querySelectorAll('.tutorial-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.getAttribute('data-slide')) === slideNum) {
            dot.classList.add('active');
        }
    });

    // Update buttons
    const prevBtn = document.getElementById('tutorialPrevBtn');
    const nextBtn = document.getElementById('tutorialNextBtn');

    prevBtn.disabled = slideNum === 1;

    if (slideNum === totalSlides) {
        nextBtn.textContent = tr('tutorial.finish', 'Fertig') + ' ✓';
    } else {
        nextBtn.textContent = tr('tutorial.next', 'Weiter') + ' →';
    }
}
