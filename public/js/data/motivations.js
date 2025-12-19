// Motivational quotes and health facts
export const motivations = [
    "Jeder Tag ohne Zigarette ist ein Sieg für deine Gesundheit! 💪",
    "Dein Körper dankt dir für jeden rauchfreien Tag. Du schaffst das! 🌟",
    "Die ersten Tage sind die härtesten - und du meisterst sie! 🏆",
    "Mit jedem Tag wirst du stärker und gesünder. Weiter so! 💚",
    "Deine Lungen reinigen sich jeden Tag ein bisschen mehr. 🫁",
    "Du investierst in dein Leben und deine Zukunft. Fantastisch! ⭐",
    "Jede nicht gerauchte Zigarette ist Zeit, die du deinem Leben hinzufügst. ⏳",
    "Du bist stärker als die Sucht. Beweise es dir selbst! 💎",
    "Dein Geruchs- und Geschmackssinn kehren zurück. Genieße es! 👃",
    "Stolz auf dich! Du gehst deinen Weg konsequent weiter. 🚀",
    "Dein Herz schlägt gesünder mit jedem rauchfreien Tag. ❤️",
    "Die Freiheit von der Sucht ist unbezahlbar. Du erreichst sie! 🎯",
    "Denk daran: Das Verlangen vergeht, aber dein Stolz bleibt! 💪",
    "Du bist ein Vorbild für andere! Bleib stark! 🌈",
    "Jeder rauchfreie Atemzug ist ein Geschenk an dich selbst. 🎁"
];

// Quit statistics (based on research)
export const quitStatistics = {
    1: { failRate: 85, message: "85% geben in den ersten 24 Stunden auf" },
    3: { failRate: 90, message: "90% schaffen nicht die ersten 3 Tage" },
    7: { failRate: 95, message: "95% scheitern in der ersten Woche" },
    30: { failRate: 97, message: "97% geben im ersten Monat auf" },
    90: { failRate: 98, message: "Nur 2% schaffen 3 Monate" },
    180: { failRate: 99, message: "Nur 1% erreichen 6 Monate" },
    365: { failRate: 99.5, message: "Du gehörst zu den Top 0.5%!" }
};

// Get daily motivation (changes each day)
export function getDailyMotivation() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return motivations[dayOfYear % motivations.length];
}
