// Motivational quotes and health facts (texts from i18n with fallback)
import { t, isInitialized } from '../i18n/i18n.js';

// Static motivations for fallback and tests
const staticMotivations = [
    "Jeder Tag ohne Zigarette ist ein Sieg für deine Gesundheit!",
    "Dein Körper dankt dir für jeden rauchfreien Tag. Du schaffst das!",
    "Die ersten Tage sind die härtesten - und du meisterst sie!",
    "Mit jedem Tag wirst du stärker und gesünder. Weiter so!",
    "Deine Lungen reinigen sich jeden Tag ein bisschen mehr.",
    "Du investierst in dein Leben und deine Zukunft. Fantastisch!",
    "Jede nicht gerauchte Zigarette ist Zeit, die du deinem Leben hinzufügst.",
    "Du bist stärker als die Sucht. Beweise es dir selbst!",
    "Dein Geruchs- und Geschmackssinn kehren zurück. Genieße es!",
    "Stolz auf dich! Du gehst deinen Weg konsequent weiter.",
    "Dein Herz schlägt gesünder mit jedem rauchfreien Tag.",
    "Die Freiheit von der Sucht ist unbezahlbar. Du erreichst sie!",
    "Denk daran: Das Verlangen vergeht, aber dein Stolz bleibt!",
    "Du bist ein Vorbild für andere! Bleib stark!",
    "Jeder rauchfreie Atemzug ist ein Geschenk an dich selbst."
];

// Static quit statistics for fallback and tests
const staticQuitStatistics = {
    1: { failRate: 85, message: "85% geben in den ersten 24 Stunden auf" },
    3: { failRate: 90, message: "90% schaffen nicht die ersten 3 Tage" },
    7: { failRate: 95, message: "95% scheitern in der ersten Woche" },
    30: { failRate: 97, message: "97% geben im ersten Monat auf" },
    90: { failRate: 98, message: "Nur 2% schaffen 3 Monate" },
    180: { failRate: 99, message: "Nur 1% erreichen 6 Monate" },
    365: { failRate: 99.5, message: "Du gehörst zu den Top 0.5%!" }
};

// Export static arrays for backwards compatibility
export const motivations = staticMotivations;
export const quitStatistics = staticQuitStatistics;

// Get motivations array (uses i18n if initialized, otherwise fallback)
export function getMotivations() {
    if (isInitialized()) {
        const translated = t('motivations');
        if (Array.isArray(translated) && translated.length > 0) {
            return translated;
        }
    }
    return staticMotivations;
}

// Get quit statistics (uses i18n if initialized, otherwise fallback)
export function getQuitStatistics() {
    if (isInitialized()) {
        return {
            1: { failRate: 85, message: t('quitStatistics.day1') || staticQuitStatistics[1].message },
            3: { failRate: 90, message: t('quitStatistics.day3') || staticQuitStatistics[3].message },
            7: { failRate: 95, message: t('quitStatistics.week1') || staticQuitStatistics[7].message },
            30: { failRate: 97, message: t('quitStatistics.month1') || staticQuitStatistics[30].message },
            90: { failRate: 98, message: t('quitStatistics.month3') || staticQuitStatistics[90].message },
            180: { failRate: 99, message: t('quitStatistics.month6') || staticQuitStatistics[180].message },
            365: { failRate: 99.5, message: t('quitStatistics.year1') || staticQuitStatistics[365].message }
        };
    }
    return staticQuitStatistics;
}

// Get daily motivation (changes each day)
export function getDailyMotivation() {
    const motivationsList = getMotivations();
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return motivationsList[dayOfYear % motivationsList.length];
}
