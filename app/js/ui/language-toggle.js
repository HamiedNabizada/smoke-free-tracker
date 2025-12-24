/**
 * Language Toggle functionality
 *
 * Language selection in Settings modal
 * Stores preference in localStorage
 */

import { getLocale } from '../i18n/i18n.js';

/**
 * Initialize language buttons in settings
 */
export function initializeLanguageToggle() {
    const langDe = document.getElementById('langDe');
    const langEn = document.getElementById('langEn');

    if (!langDe || !langEn) return;

    const currentLocale = getLocale();

    // Mark current language as active
    updateActiveButton(currentLocale);

    // Add click handlers
    langDe.addEventListener('click', () => switchLanguage('de'));
    langEn.addEventListener('click', () => switchLanguage('en'));
}

/**
 * Switch language and reload
 */
function switchLanguage(locale) {
    const currentLocale = getLocale();
    if (locale === currentLocale) return;

    localStorage.setItem('locale', locale);
    window.location.reload();
}

/**
 * Update active button styling
 */
function updateActiveButton(locale) {
    const langDe = document.getElementById('langDe');
    const langEn = document.getElementById('langEn');

    if (langDe) langDe.classList.toggle('active', locale === 'de');
    if (langEn) langEn.classList.toggle('active', locale === 'en');
}
