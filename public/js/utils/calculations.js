import { userData } from '../config.js';

export function calculateStats() {
    const quitDate = new Date(userData.quitDate);
    const now = new Date();

    // Calculate time smoke-free
    const millisecondsDiff = now - quitDate;
    const totalMinutes = millisecondsDiff / (1000 * 60);
    const totalHours = millisecondsDiff / (1000 * 60 * 60);
    const totalDays = millisecondsDiff / (1000 * 60 * 60 * 24);

    // Calculate cigarettes not smoked
    const cigarettesNotSmoked = Math.floor(totalDays * userData.cigarettesPerDay);

    // Calculate money saved
    const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
    const moneySaved = cigarettesNotSmoked * pricePerCigarette;

    // Calculate lifetime gained (each cigarette reduces life by ~11 minutes)
    const minutesGained = cigarettesNotSmoked * 11;
    const hoursGained = Math.floor(minutesGained / 60);
    const daysGained = Math.floor(hoursGained / 24);

    // Calculate toxins avoided
    const nicotineAvoided = cigarettesNotSmoked * 1; // mg
    const tarAvoided = cigarettesNotSmoked * 10; // mg
    const totalToxins = (nicotineAvoided + tarAvoided) / 1000; // convert to grams

    // Calculate lung health (0-100%, improves over time)
    let lungHealth = 0;
    if (totalDays >= 365) {
        lungHealth = Math.min(95, 50 + (totalDays - 365) / 36.5);
    } else if (totalDays >= 90) {
        lungHealth = 30 + ((totalDays - 90) / 275) * 20;
    } else if (totalDays >= 14) {
        lungHealth = 10 + ((totalDays - 14) / 76) * 20;
    } else if (totalDays >= 1) {
        lungHealth = (totalDays / 14) * 10;
    }

    // Calculate time saved (5 minutes per cigarette for smoking + preparation)
    const minutesSaved = cigarettesNotSmoked * 5;
    const hoursSaved = Math.floor(minutesSaved / 60);
    const daysSaved = Math.floor(hoursSaved / 24);

    // Calculate CO2 avoided
    const co2AvoidedGrams = cigarettesNotSmoked * 14;
    const co2AvoidedKg = co2AvoidedGrams / 1000;

    // Calculate skin age improvement
    let skinAgeDays = 0;
    if (totalDays >= 14) {
        const maxImprovement = 30;
        const daysToMaxImprovement = 270;
        const progress = Math.min(1, (totalDays - 14) / (daysToMaxImprovement - 14));
        skinAgeDays = progress * maxImprovement;
    }

    // Calculate water saved
    const waterSaved = cigarettesNotSmoked * 3.7;

    // Calculate trees saved
    const treesSaved = cigarettesNotSmoked / 300;

    return {
        totalDays: totalDays,
        days: Math.floor(totalDays),
        hours: Math.floor(totalHours % 24),
        minutes: Math.floor(totalMinutes % 60),
        cigarettes: cigarettesNotSmoked,
        money: moneySaved,
        lifeGained: { days: daysGained, hours: hoursGained % 24, totalHours: hoursGained },
        toxins: totalToxins,
        lungHealth: Math.round(lungHealth),
        timeSaved: { days: daysSaved, hours: hoursSaved % 24, totalHours: hoursSaved, totalMinutes: minutesSaved },
        co2Avoided: co2AvoidedKg,
        skinAge: Math.round(skinAgeDays),
        waterSaved: waterSaved,
        treesSaved: treesSaved
    };
}

export function calculateTimeRemaining(days) {
    if (days < 1) {
        const hours = Math.ceil(days * 24);
        return `${hours} Std.`;
    } else if (days < 7) {
        return `${Math.ceil(days)} Tag${Math.ceil(days) === 1 ? '' : 'en'}`;
    } else if (days < 30) {
        const weeks = Math.ceil(days / 7);
        return `${weeks} Woche${weeks === 1 ? '' : 'n'}`;
    } else if (days < 365) {
        const months = Math.ceil(days / 30);
        return `${months} Monat${months === 1 ? '' : 'en'}`;
    } else {
        const years = Math.floor(days / 365);
        return `${years} Jahr${years === 1 ? '' : 'en'}`;
    }
}
