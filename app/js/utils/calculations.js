import { userData } from '../config.js';

/**
 * Wissenschaftliche Quellen für alle Berechnungen:
 *
 * Lebenszeit:
 *   - Shaw et al. (2000): 11 Min/Zigarette - BMJ 320(53)
 *   - Jackson (2025): 17 Min (Männer), 22 Min (Frauen) - Addiction Journal
 *
 * Herz-Kreislauf:
 *   - WHO: https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation
 *   - JAMA (2019): https://jamanetwork.com/journals/jama/fullarticle/2748507
 *
 * Lungenfunktion:
 *   - PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC10697086/
 *   - American Cancer Society
 *
 * Haut:
 *   - Mailänder Studie (2010): https://pubmed.ncbi.nlm.nih.gov/20839421/
 *   - Koreanische Studie (2012): https://pmc.ncbi.nlm.nih.gov/articles/PMC3383505/
 */

// ============================================
// ZEIT-BERECHNUNGEN
// ============================================

function getTimeSinceQuit() {
    const quitDate = new Date(userData.quitDate);
    const now = new Date();
    const millisecondsDiff = now - quitDate;

    return {
        totalMinutes: millisecondsDiff / (1000 * 60),
        totalHours: millisecondsDiff / (1000 * 60 * 60),
        totalDays: millisecondsDiff / (1000 * 60 * 60 * 24)
    };
}

// ============================================
// LEBENSZEIT GEWONNEN
// Quelle: Jackson (2025) - Addiction Journal
// Männer: 17 Min/Zigarette, Frauen: 22 Min/Zigarette
// Durchschnitt: 20 Min (wenn Geschlecht unbekannt)
// ============================================

function calculateLifeGained(cigarettesNotSmoked, gender = 'unknown') {
    let minutesPerCigarette;

    switch (gender) {
        case 'male':
            minutesPerCigarette = 17;
            break;
        case 'female':
            minutesPerCigarette = 22;
            break;
        default:
            minutesPerCigarette = 20; // Durchschnitt
    }

    const minutesGained = cigarettesNotSmoked * minutesPerCigarette;
    const hoursGained = Math.floor(minutesGained / 60);
    const daysGained = Math.floor(hoursGained / 24);

    return {
        days: daysGained,
        hours: hoursGained % 24,
        totalHours: hoursGained,
        totalMinutes: minutesGained,
        minutesPerCigarette: minutesPerCigarette,
        source: 'Jackson (2025), Addiction Journal'
    };
}

// ============================================
// HERZ-KREISLAUF ERHOLUNG
// Quellen: WHO, JAMA (2019)
//
// Timeline:
// - 20 Min: Herzfrequenz/Blutdruck normalisiert
// - 1 Jahr: 50% Risikoreduktion (Herzinfarkt)
// - 2 Jahre: 33% des Zusatzrisikos eliminiert
// - 5-10 Jahre: 70-80% Erholung
// - 15 Jahre: ~100% (Nichtraucher-Niveau)
// ============================================

export function calculateCardiovascularRecovery(days) {
    if (days <= 0) return 0;
    if (days < 0.014) return Math.min(5, (days / 0.014) * 5);  // 0-5% in ersten 20 Min
    if (days < 1) return 5 + ((days - 0.014) / 0.986) * 5;      // 5-10% Tag 1
    if (days < 365) return 10 + ((days - 1) / 364) * 40;        // 10-50% Jahr 1
    if (days < 730) return 50 + ((days - 365) / 365) * 17;      // 50-67% Jahr 2
    if (days < 1825) return 67 + ((days - 730) / 1095) * 13;    // 67-80% Jahre 3-5
    if (days < 5475) return 80 + ((days - 1825) / 3650) * 20;   // 80-100% Jahre 5-15
    return 100;
}

// ============================================
// LUNGENFUNKTION ERHOLUNG
// Quellen: PMC, WHO, American Cancer Society
//
// Timeline:
// - 12 Stunden: CO-Spiegel normalisiert
// - 2-3 Tage: Flimmerhärchen (Zilien) reaktivieren
// - 2-12 Wochen: +30% Lungenfunktion (FEV1)
// - 1-9 Monate: Zilien vollständig regeneriert
// - 1 Jahr: Nahezu normale Funktion
// - 10 Jahre: Lungenkrebsrisiko halbiert
//
// Hinweis: Emphysem-Schäden sind NICHT reversibel
// ============================================

export function calculateLungRecovery(days) {
    if (days <= 0) return 0;
    if (days < 0.5) return (days / 0.5) * 10;                   // 0-10% erste 12h (CO normalisiert)
    if (days < 3) return 10 + ((days - 0.5) / 2.5) * 10;        // 10-20% Tage 1-3 (Zilien starten)
    if (days < 14) return 20 + ((days - 3) / 11) * 10;          // 20-30% Wochen 1-2
    if (days < 84) return 30 + ((days - 14) / 70) * 30;         // 30-60% Monate 1-3 (+30% FEV1)
    if (days < 270) return 60 + ((days - 84) / 186) * 25;       // 60-85% Monate 3-9 (Zilien komplett)
    if (days < 365) return 85 + ((days - 270) / 95) * 10;       // 85-95% bis Jahr 1
    if (days < 3650) return 95 + ((days - 365) / 3285) * 5;     // 95-100% bis Jahr 10
    return 100;
}

// ============================================
// HAUTGESUNDHEIT ERHOLUNG
// Quellen: Mailänder Studie (2010), Koreanische Studie (2012)
//
// Mailänder Studie:
// - Messungen bei 3, 6 und 9 Monaten
// - Erste SIGNIFIKANTE Verbesserung erst nach 6 Monaten
// - Nach 9 Monaten: Bis zu 13 Jahre biologische Verjüngung möglich
//
// Timeline (basierend auf Studienergebnissen):
// - 0-3 Monate: Kaum messbare Verbesserung (0-10%)
// - 3-6 Monate: Erste signifikante Verbesserung (10-40%)
// - 6-9 Monate: Hauptverbesserung (40-100%)
// ============================================

export function calculateSkinRecovery(days) {
    if (days <= 0) return 0;

    // 0-90 Tage (3 Monate): Langsamer Start, kaum messbar (0-10%)
    if (days < 90) {
        return (days / 90) * 10;
    }

    // 90-180 Tage (3-6 Monate): Erste signifikante Verbesserung (10-40%)
    if (days < 180) {
        return 10 + ((days - 90) / 90) * 30;
    }

    // 180-270 Tage (6-9 Monate): Hauptverbesserung (40-100%)
    if (days < 270) {
        return 40 + ((days - 180) / 90) * 60;
    }

    return 100;
}

// ============================================
// DURCHBLUTUNG ERHOLUNG
// Quelle: WHO
//
// Timeline:
// - 20 Minuten: Periphere Durchblutung startet sich zu verbessern
// - 2-12 Wochen: Signifikante Verbesserung
// - 3 Monate: Nahezu normal
// ============================================

export function calculateCirculationRecovery(days) {
    if (days <= 0) return 0;
    if (days < 0.014) return (days / 0.014) * 20;               // 0-20% in ersten 20 Min
    if (days < 14) return 20 + ((days - 0.014) / 13.986) * 30;  // 20-50% Wochen 1-2
    if (days < 84) return 50 + ((days - 14) / 70) * 40;         // 50-90% Monate 1-3
    if (days < 180) return 90 + ((days - 84) / 96) * 10;        // 90-100% Monate 3-6
    return 100;
}

// ============================================
// KREBSRISIKO-REDUKTION
// Quellen: WHO, NCBI
//
// Lungenkrebs:
// - 10 Jahre: 50% Risikoreduktion
// - 15-20 Jahre: Nahezu Nichtraucher-Niveau
//
// Herzinfarkt:
// - 1 Jahr: 50% Risikoreduktion
// - 15 Jahre: Nichtraucher-Niveau
// ============================================

export function calculateLungCancerRiskReduction(days) {
    if (days <= 0) return 0;
    if (days < 365) return (days / 365) * 10;                   // 0-10% Jahr 1
    if (days < 1825) return 10 + ((days - 365) / 1460) * 20;    // 10-30% Jahre 1-5
    if (days < 3650) return 30 + ((days - 1825) / 1825) * 20;   // 30-50% Jahre 5-10
    if (days < 7300) return 50 + ((days - 3650) / 3650) * 40;   // 50-90% Jahre 10-20
    return 90; // Nie ganz 100% - bleibt leicht erhöhtes Restrisiko
}

export function calculateHeartAttackRiskReduction(days) {
    if (days <= 0) return 0;
    if (days < 365) return (days / 365) * 50;                   // 0-50% Jahr 1
    if (days < 730) return 50 + ((days - 365) / 365) * 17;      // 50-67% Jahr 2
    if (days < 5475) return 67 + ((days - 730) / 4745) * 33;    // 67-100% Jahre 2-15
    return 100;
}

export function calculateStrokeRiskReduction(days) {
    if (days <= 0) return 0;
    if (days < 1825) return (days / 1825) * 50;                 // 0-50% Jahre 1-5
    if (days < 5475) return 50 + ((days - 1825) / 3650) * 50;   // 50-100% Jahre 5-15
    return 100;
}

// ============================================
// TOXINE / SCHADSTOFFE VERMIEDEN
// Durchschnittswerte pro Zigarette:
// - Nikotin: 0.5-2mg (Durchschnitt 1mg)
// - Teer: 7-15mg (Durchschnitt 10mg)
// ============================================

function calculateToxinsAvoided(cigarettesNotSmoked) {
    const nicotinePerCigarette = 1;  // mg
    const tarPerCigarette = 10;      // mg

    return {
        nicotine: cigarettesNotSmoked * nicotinePerCigarette,      // mg
        tar: cigarettesNotSmoked * tarPerCigarette,                // mg
        totalGrams: (cigarettesNotSmoked * (nicotinePerCigarette + tarPerCigarette)) / 1000
    };
}

// ============================================
// ZEIT GESPART
// Schätzung: 5-7 Minuten pro Zigarette
// (Rauchen selbst + Weg zum Rauchen + Beschaffung)
// ============================================

function calculateTimeSaved(cigarettesNotSmoked) {
    const minutesPerCigarette = 6; // Konservativer Durchschnitt
    const totalMinutes = cigarettesNotSmoked * minutesPerCigarette;
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    return {
        days: totalDays,
        hours: totalHours % 24,
        totalHours: totalHours,
        totalMinutes: totalMinutes
    };
}

// ============================================
// UMWELT-STATISTIKEN
// Quellen: Verschiedene Umweltstudien
//
// CO2: ~14g pro Zigarette (Produktion + Transport + Verbrennung)
// Wasser: ~3.7L pro Zigarette (Tabakanbau)
// Bäume: 1 Baum pro ~300 Zigaretten (Papier + Trocknung)
// ============================================

function calculateEnvironmentalImpact(cigarettesNotSmoked) {
    return {
        co2Avoided: (cigarettesNotSmoked * 14) / 1000,     // kg
        waterSaved: cigarettesNotSmoked * 3.7,              // Liter
        treesSaved: cigarettesNotSmoked / 300               // Bäume
    };
}

// ============================================
// HAUPT-FUNKTION: calculateStats()
// ============================================

export function calculateStats() {
    const time = getTimeSinceQuit();
    const totalDays = time.totalDays;

    // Vermiedene Zigaretten
    const cigarettesNotSmoked = Math.floor(totalDays * userData.cigarettesPerDay);

    // Geld gespart
    const pricePerCigarette = userData.pricePerPack / userData.cigarettesPerPack;
    const moneySaved = cigarettesNotSmoked * pricePerCigarette;

    // Lebenszeit gewonnen (mit optionalem Geschlecht)
    const gender = userData.gender || 'unknown';
    const lifeGained = calculateLifeGained(cigarettesNotSmoked, gender);

    // Gesundheits-Erholung (wissenschaftlich fundiert)
    const cardiovascularRecovery = Math.round(calculateCardiovascularRecovery(totalDays));
    const lungRecovery = Math.round(calculateLungRecovery(totalDays));
    const skinRecovery = Math.round(calculateSkinRecovery(totalDays));
    const circulationRecovery = Math.round(calculateCirculationRecovery(totalDays));

    // Risikoreduktion
    const heartAttackRiskReduction = Math.round(calculateHeartAttackRiskReduction(totalDays));
    const strokeRiskReduction = Math.round(calculateStrokeRiskReduction(totalDays));
    const lungCancerRiskReduction = Math.round(calculateLungCancerRiskReduction(totalDays));

    // Schadstoffe
    const toxins = calculateToxinsAvoided(cigarettesNotSmoked);

    // Zeit gespart
    const timeSaved = calculateTimeSaved(cigarettesNotSmoked);

    // Umwelt
    const environment = calculateEnvironmentalImpact(cigarettesNotSmoked);

    return {
        // Zeit rauchfrei
        totalDays: totalDays,
        days: Math.floor(totalDays),
        hours: Math.floor(time.totalHours % 24),
        minutes: Math.floor(time.totalMinutes % 60),

        // Basis-Statistiken
        cigarettes: cigarettesNotSmoked,
        money: moneySaved,

        // Lebenszeit (wissenschaftlich: 17-22 Min/Zigarette)
        lifeGained: lifeGained,

        // Gesundheits-Erholung (0-100%)
        health: {
            cardiovascular: cardiovascularRecovery,
            lung: lungRecovery,
            skin: skinRecovery,
            circulation: circulationRecovery
        },

        // Risikoreduktion (0-100%)
        riskReduction: {
            heartAttack: heartAttackRiskReduction,
            stroke: strokeRiskReduction,
            lungCancer: lungCancerRiskReduction
        },

        // Schadstoffe vermieden
        toxins: toxins.totalGrams,
        toxinsDetailed: toxins,

        // Zeit gespart
        timeSaved: timeSaved,

        // Umwelt
        co2Avoided: environment.co2Avoided,
        waterSaved: environment.waterSaved,
        treesSaved: environment.treesSaved,

        // Legacy-Felder (für Rückwärtskompatibilität)
        lungHealth: lungRecovery,
        skinImprovement: skinRecovery  // Prozent (0-100), nicht Jahre
    };
}

// ============================================
// HILFSFUNKTION: Zeit formatieren
// ============================================

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

// ============================================
// QUELLENANGABEN (für Info-Seite)
// ============================================

export const scientificSources = {
    lifeExpectancy: {
        title: 'Lebenszeit pro Zigarette',
        original: {
            authors: 'Shaw M, Mitchell R, Dorling D',
            year: 2000,
            title: 'Time for a smoke? One cigarette reduces your life by 11 minutes',
            journal: 'BMJ 320(53)',
            url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1117323/'
        },
        updated: {
            authors: 'Jackson SE et al.',
            year: 2025,
            title: 'The price of a cigarette: 20 minutes of life?',
            journal: 'Addiction',
            url: 'https://onlinelibrary.wiley.com/doi/10.1111/add.16757'
        }
    },
    cardiovascular: {
        title: 'Herz-Kreislauf-Erholung',
        sources: [
            {
                organization: 'WHO',
                title: 'Tobacco: Health benefits of smoking cessation',
                url: 'https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation'
            },
            {
                authors: 'Duncan MS et al.',
                year: 2019,
                title: 'Association of Smoking Cessation With Subsequent Risk of Cardiovascular Disease',
                journal: 'JAMA',
                url: 'https://jamanetwork.com/journals/jama/fullarticle/2748507'
            }
        ]
    },
    lung: {
        title: 'Lungenfunktion',
        sources: [
            {
                authors: 'Jiménez-Ruiz CA et al.',
                year: 2023,
                title: 'Short-Term Benefits of Smoking Cessation Improve Respiratory Function',
                journal: 'PMC',
                url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10697086/'
            }
        ]
    },
    skin: {
        title: 'Hautgesundheit',
        sources: [
            {
                authors: 'Serri R et al.',
                year: 2010,
                title: 'Quitting smoking rejuvenates the skin - Milan pilot study',
                journal: 'Skinmed',
                url: 'https://pubmed.ncbi.nlm.nih.gov/20839421/'
            },
            {
                year: 2012,
                title: 'Changes in Skin Color after Smoking Cessation',
                journal: 'PMC',
                url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3383505/'
            }
        ]
    }
};
