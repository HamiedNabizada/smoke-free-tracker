/**
 * Language Toggle functionality
 *
 * Toggles between supported languages (de/en)
 * Stores preference in localStorage
 */

import { getLocale, setLocale, getSupportedLocales } from '../i18n/i18n.js';

// Flag emojis for each locale
const FLAGS = {
    de: '🇩🇪',
    en: '🇬🇧'
};

/**
 * Initialize language toggle button
 */
export function initializeLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    if (!languageToggle) return;

    const currentLocale = getLocale();
    languageToggle.textContent = FLAGS[currentLocale] || FLAGS.de;
    languageToggle.setAttribute('aria-label', getAriaLabel(currentLocale));

    languageToggle.addEventListener('click', async () => {
        const locales = getSupportedLocales();
        const currentIndex = locales.indexOf(getLocale());
        const nextIndex = (currentIndex + 1) % locales.length;
        const nextLocale = locales[nextIndex];

        await setLocale(nextLocale);

        languageToggle.textContent = FLAGS[nextLocale] || FLAGS.de;
        languageToggle.setAttribute('aria-label', getAriaLabel(nextLocale));
    });
}

/**
 * Get aria-label for current language
 */
function getAriaLabel(locale) {
    const labels = {
        de: 'Sprache wechseln (aktuell: Deutsch)',
        en: 'Change language (current: English)'
    };
    return labels[locale] || labels.de;
}
