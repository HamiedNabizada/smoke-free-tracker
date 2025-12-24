/**
 * Internationalized Formatters
 *
 * Uses Intl API for locale-aware formatting of:
 * - Numbers
 * - Currency
 * - Dates
 * - Relative time
 */

import { getLocale } from './i18n.js';

/**
 * Format a number according to locale
 */
export function formatNumber(num, options = {}) {
    const locale = getLocale();
    return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Format currency (EUR)
 */
export function formatCurrency(amount, currency = 'EUR') {
    const locale = getLocale();
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Format as percentage
 */
export function formatPercent(value, decimals = 0) {
    const locale = getLocale();
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

/**
 * Format a date
 */
export function formatDate(date, options = {}) {
    const locale = getLocale();
    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
}

/**
 * Format date short (DD.MM.YYYY or MM/DD/YYYY)
 */
export function formatDateShort(date) {
    const locale = getLocale();
    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

/**
 * Format time (HH:MM)
 */
export function formatTime(date) {
    const locale = getLocale();
    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

/**
 * Format relative time (e.g., "in 3 days", "2 hours ago")
 */
export function formatRelativeTime(value, unit) {
    const locale = getLocale();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return rtf.format(value, unit);
}

/**
 * Format duration in days to human readable
 * Automatically selects best unit (hours, days, weeks, months, years)
 */
export function formatDuration(days) {
    const locale = getLocale();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'long' });

    if (days < 1) {
        const hours = Math.round(days * 24);
        // Remove "in" prefix by using format parts
        return formatDurationUnit(hours, 'hour', locale);
    } else if (days < 7) {
        return formatDurationUnit(Math.round(days), 'day', locale);
    } else if (days < 30) {
        return formatDurationUnit(Math.round(days / 7), 'week', locale);
    } else if (days < 365) {
        return formatDurationUnit(Math.round(days / 30), 'month', locale);
    } else {
        const years = days / 365;
        if (years >= 10) {
            return formatDurationUnit(Math.round(years), 'year', locale);
        }
        return formatDurationUnit(Math.round(years * 10) / 10, 'year', locale);
    }
}

/**
 * Helper: Format a duration unit without relative prefix
 */
function formatDurationUnit(value, unit, locale) {
    // Use DisplayNames for unit, or simple plural logic
    const pluralRules = new Intl.PluralRules(locale);
    const plural = pluralRules.select(value);

    const units = {
        de: {
            hour: { one: 'Stunde', other: 'Stunden' },
            day: { one: 'Tag', other: 'Tage' },
            week: { one: 'Woche', other: 'Wochen' },
            month: { one: 'Monat', other: 'Monate' },
            year: { one: 'Jahr', other: 'Jahre' }
        },
        en: {
            hour: { one: 'hour', other: 'hours' },
            day: { one: 'day', other: 'days' },
            week: { one: 'week', other: 'weeks' },
            month: { one: 'month', other: 'months' },
            year: { one: 'year', other: 'years' }
        }
    };

    const unitTranslations = units[locale] || units.en;
    const unitName = unitTranslations[unit]?.[plural] || unitTranslations[unit]?.other || unit;

    return `${formatNumber(value)} ${unitName}`;
}

/**
 * Format large numbers with abbreviation (1.2K, 3.5M)
 */
export function formatCompactNumber(num) {
    const locale = getLocale();
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
}

/**
 * Format a list (e.g., "A, B, and C")
 */
export function formatList(items, type = 'conjunction') {
    const locale = getLocale();
    return new Intl.ListFormat(locale, { type }).format(items);
}
