/**
 * Internationalization (i18n) Module
 *
 * Lightweight i18n system for ByeByeSmoke
 * - Automatic language detection from browser
 * - Manual override via localStorage
 * - Dynamic locale loading
 * - Parameter interpolation
 */

// State
let currentLocale = 'de';
let translations = {};
let initialized = false;
const SUPPORTED_LOCALES = ['de', 'en'];
const STORAGE_KEY = 'locale';

/**
 * Initialize i18n system
 * Priority: localStorage > browser language > 'de'
 */
export async function initializeI18n() {
    // 1. Check localStorage
    const saved = localStorage.getItem(STORAGE_KEY);

    // 2. Detect browser language
    const browserLang = navigator.language?.split('-')[0] || 'de';

    // 3. Determine locale (saved > browser > default)
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
        currentLocale = saved;
    } else if (SUPPORTED_LOCALES.includes(browserLang)) {
        currentLocale = browserLang;
    } else {
        currentLocale = 'de';
    }

    // 4. Load locale file
    await loadLocale(currentLocale);

    // 5. Set HTML lang attribute
    document.documentElement.lang = currentLocale;

    // 6. Translate static elements
    translatePage();

    // 7. Mark as initialized
    initialized = true;

    console.log(`[i18n] Initialized with locale: ${currentLocale}`);
}

/**
 * Load locale file dynamically
 */
async function loadLocale(locale) {
    try {
        const module = await import(`./locales/${locale}.js`);
        translations = module.default;
    } catch (error) {
        console.error(`[i18n] Failed to load locale: ${locale}`, error);
        // Fallback to German
        if (locale !== 'de') {
            const fallback = await import('./locales/de.js');
            translations = fallback.default;
        }
    }
}

/**
 * Change locale
 */
export async function setLocale(locale) {
    if (!SUPPORTED_LOCALES.includes(locale)) {
        console.warn(`[i18n] Unsupported locale: ${locale}`);
        return;
    }

    currentLocale = locale;
    localStorage.setItem(STORAGE_KEY, locale);

    await loadLocale(locale);

    document.documentElement.lang = locale;
    translatePage();

    // Fire event for dynamic components
    window.dispatchEvent(new CustomEvent('localeChanged', {
        detail: { locale }
    }));

    console.log(`[i18n] Locale changed to: ${locale}`);
}

/**
 * Get current locale
 */
export function getLocale() {
    return currentLocale;
}

/**
 * Get list of supported locales
 */
export function getSupportedLocales() {
    return [...SUPPORTED_LOCALES];
}

/**
 * Check if i18n is initialized
 */
export function isInitialized() {
    return initialized;
}

/**
 * Translate a key
 * @param {string} key - Dot-notation key (e.g., 'nav.overview')
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} Translated string or key if not found
 */
export function t(key, params = {}) {
    // Navigate through nested object
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
    }

    // Handle missing translation
    if (value === undefined) {
        console.warn(`[i18n] Missing translation: ${key}`);
        return key;
    }

    // Handle arrays (e.g., motivations)
    if (Array.isArray(value)) {
        return value;
    }

    // Interpolate parameters: {name} -> params.name
    if (typeof value === 'string' && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    return value;
}

/**
 * Translate all elements with data-i18n attributes
 */
export function translatePage() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translated = t(key);
        if (translated !== key) {
            el.textContent = translated;
        }
    });

    // HTML content (for links etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        const translated = t(key);
        if (translated !== key) {
            el.innerHTML = translated;
        }
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const translated = t(key);
        if (translated !== key) {
            el.placeholder = translated;
        }
    });

    // Aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.dataset.i18nAria;
        const translated = t(key);
        if (translated !== key) {
            el.setAttribute('aria-label', translated);
        }
    });

    // Title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        const translated = t(key);
        if (translated !== key) {
            el.setAttribute('title', translated);
        }
    });
}

/**
 * Get translation object for a section (useful for data files)
 */
export function getTranslations(section) {
    return translations[section] || {};
}
