// Achievement definitions (ID-based with fallback texts for tests)
export const achievements = [
    // Time-based Achievements (days)
    { id: 'first_hour', icon: '⏰', title: 'Erste Stunde', description: '60 Minuten stark!', days: 0.042 },
    { id: 'first_day', icon: '🌱', title: 'Erster Tag', description: '24 Stunden rauchfrei', days: 1 },
    { id: 'two_days', icon: '🌿', title: 'Zwei Tage', description: '48 Stunden geschafft', days: 2 },
    { id: 'three_days', icon: '🔥', title: 'Durchbruch', description: '3 Tage geschafft', days: 3 },
    { id: 'five_days', icon: '🌟', title: 'Fünf Tage', description: 'Fast eine Woche!', days: 5 },
    { id: 'one_week', icon: '⭐', title: 'Eine Woche', description: '7 Tage stark', days: 7 },
    { id: 'ten_days', icon: '✨', title: 'Zehn Tage', description: 'Zweistellig!', days: 10 },
    { id: 'two_weeks', icon: '💎', title: 'Zweite Woche', description: '14 Tage frei', days: 14 },
    { id: 'three_weeks', icon: '💪', title: 'Drei Wochen', description: '21 Tage Power', days: 21 },
    { id: 'one_month', icon: '🏅', title: 'Ein Monat', description: '30 Tage Erfolg', days: 30 },
    { id: 'forty_days', icon: '🌈', title: 'Vierzig Tage', description: 'Fantastisch!', days: 40 },
    { id: 'fifty_days', icon: '👑', title: 'Champion', description: '50 Tage durch', days: 50 },
    { id: 'two_months', icon: '🎖️', title: 'Zwei Monate', description: '60 Tage stark', days: 60 },
    { id: 'seventy_days', icon: '🌺', title: 'Siebzig Tage', description: 'Unaufhaltbar!', days: 70 },
    { id: 'three_months', icon: '🎗️', title: 'Drei Monate', description: '90 Tage Freiheit', days: 90 },
    { id: 'hundred_days', icon: '💯', title: 'Hundert Tage', description: '100 Tage Freiheit', days: 100 },
    { id: 'four_months', icon: '🏵️', title: 'Vier Monate', description: '120 Tage stark', days: 120 },
    { id: 'five_months', icon: '🎪', title: 'Fünf Monate', description: '150 Tage durch', days: 150 },
    { id: 'six_months', icon: '🎊', title: 'Halbjahr', description: '6 Monate stark', days: 180 },
    { id: 'seven_months', icon: '🎭', title: 'Sieben Monate', description: '210 Tage Erfolg', days: 210 },
    { id: 'nine_months', icon: '🎨', title: 'Neun Monate', description: '270 Tage frei', days: 270 },
    { id: 'ten_months', icon: '🎬', title: 'Zehn Monate', description: '300 Tage Power', days: 300 },
    { id: 'one_year', icon: '🏆', title: 'Ein Jahr', description: '365 Tage Erfolg', days: 365 },
    { id: 'five_hundred', icon: '🎯', title: 'Fünfhundert', description: '500 Tage Legende', days: 500 },
    { id: 'two_years', icon: '🥇', title: 'Zwei Jahre', description: '730 Tage frei', days: 730 },
    { id: 'thousand', icon: '🌟', title: 'Tausend Tage', description: 'Absolute Legende!', days: 1000 },
    { id: 'three_years', icon: '🥈', title: 'Drei Jahre', description: '1095 Tage stark', days: 1095 },
    { id: 'five_years', icon: '🥉', title: 'Fünf Jahre', description: '1825 Tage Meister', days: 1825 },
    { id: 'ten_years', icon: '👑', title: 'Zehn Jahre', description: 'Absolute Ikone!', days: 3650 },

    // Money-based Achievements
    { id: 'save_50', icon: '🪙', title: 'Erste 50€', description: '50€ gespart', threshold: 50, type: 'money' },
    { id: 'save_100', icon: '💵', title: 'Hundert Euro', description: '100€ gespart', threshold: 100, type: 'money' },
    { id: 'save_250', icon: '💶', title: 'Vierteljahresgehalt', description: '250€ gespart', threshold: 250, type: 'money' },
    { id: 'save_500', icon: '💰', title: 'Sparer', description: '500€ gespart', threshold: 500, type: 'money' },
    { id: 'save_750', icon: '💸', title: 'Dreiviertel', description: '750€ gespart', threshold: 750, type: 'money' },
    { id: 'save_1000', icon: '💎', title: 'Geldmagnet', description: '1000€ gespart', threshold: 1000, type: 'money' },
    { id: 'save_1500', icon: '🏦', title: 'Sparschwein', description: '1500€ gespart', threshold: 1500, type: 'money' },
    { id: 'save_2000', icon: '💳', title: 'Zweitausend', description: '2000€ gespart', threshold: 2000, type: 'money' },
    { id: 'save_3000', icon: '💼', title: 'Vermögensaufbau', description: '3000€ gespart', threshold: 3000, type: 'money' },
    { id: 'save_5000', icon: '🏆', title: 'Fünftausend', description: '5000€ gespart', threshold: 5000, type: 'money' },
    { id: 'save_10000', icon: '👑', title: 'Zehntausend', description: '10000€ gespart!', threshold: 10000, type: 'money' },

    // Cigarettes-based Achievements
    { id: 'cigs_10', icon: '🚫', title: 'Erste Zehn', description: '10 nicht geraucht', threshold: 10, type: 'cigarettes' },
    { id: 'cigs_50', icon: '⛔', title: 'Fünfzig weg', description: '50 nicht geraucht', threshold: 50, type: 'cigarettes' },
    { id: 'cigs_100', icon: '🚭', title: 'Zähler', description: '100 nicht geraucht', threshold: 100, type: 'cigarettes' },
    { id: 'cigs_250', icon: '🎯', title: 'Viertelpack', description: '250 nicht geraucht', threshold: 250, type: 'cigarettes' },
    { id: 'cigs_500', icon: '🔕', title: 'Fünfhundert', description: '500 nicht geraucht', threshold: 500, type: 'cigarettes' },
    { id: 'cigs_1000', icon: '🎖️', title: 'Meister', description: '1000 nicht geraucht', threshold: 1000, type: 'cigarettes' },
    { id: 'cigs_2000', icon: '🏅', title: 'Zweitausend', description: '2000 nicht geraucht', threshold: 2000, type: 'cigarettes' },
    { id: 'cigs_5000', icon: '🥇', title: 'Fünftausend', description: '5000 nicht geraucht', threshold: 5000, type: 'cigarettes' },
    { id: 'cigs_10000', icon: '👑', title: 'Zehntausend', description: '10000 nicht geraucht!', threshold: 10000, type: 'cigarettes' },

    // Life time Achievements (hours gained)
    { id: 'life_1h', icon: '❤️', title: 'Erste Stunde', description: '1 Stunde Leben gewonnen', threshold: 1, type: 'lifeHours' },
    { id: 'life_12h', icon: '💓', title: 'Halber Tag', description: '12 Stunden Leben gewonnen', threshold: 12, type: 'lifeHours' },
    { id: 'life_24h', icon: '💗', title: 'Ein Tag Leben', description: '24 Stunden Leben gewonnen', threshold: 24, type: 'lifeHours' },
    { id: 'life_48h', icon: '💖', title: 'Zwei Tage Leben', description: '48 Stunden Leben gewonnen', threshold: 48, type: 'lifeHours' },
    { id: 'life_100h', icon: '💝', title: 'Hundert Stunden', description: '100 Stunden Leben gewonnen', threshold: 100, type: 'lifeHours' },
    { id: 'life_1w', icon: '💕', title: 'Eine Woche Leben', description: '168 Stunden Leben gewonnen', threshold: 168, type: 'lifeHours' },
    { id: 'life_500h', icon: '💞', title: 'Fünfhundert Stunden', description: '500 Stunden Leben gewonnen', threshold: 500, type: 'lifeHours' },
    { id: 'life_1000h', icon: '💟', title: 'Tausend Stunden', description: '1000 Stunden Leben gewonnen', threshold: 1000, type: 'lifeHours' },

    // Lung health Achievements
    { id: 'lung_5', icon: '🫁', title: 'Erste Erholung', description: '5% Lungengesundheit', threshold: 5, type: 'lungHealth' },
    { id: 'lung_10', icon: '🌬️', title: 'Atme auf', description: '10% Lungengesundheit', threshold: 10, type: 'lungHealth' },
    { id: 'lung_25', icon: '🍃', title: 'Viertel Weg', description: '25% Lungengesundheit', threshold: 25, type: 'lungHealth' },
    { id: 'lung_50', icon: '🌿', title: 'Halbzeit', description: '50% Lungengesundheit', threshold: 50, type: 'lungHealth' },
    { id: 'lung_75', icon: '🌲', title: 'Fast da', description: '75% Lungengesundheit', threshold: 75, type: 'lungHealth' },
    { id: 'lung_90', icon: '🏔️', title: 'Bergluft', description: '90% Lungengesundheit', threshold: 90, type: 'lungHealth' },

    // Water saved Achievements (liters)
    { id: 'water_100', icon: '💧', title: 'Erste Tropfen', description: '100 Liter Wasser gespart', threshold: 100, type: 'water' },
    { id: 'water_500', icon: '🚿', title: 'Dusche gespart', description: '500 Liter Wasser gespart', threshold: 500, type: 'water' },
    { id: 'water_1000', icon: '🛁', title: 'Badewanne voll', description: '1000 Liter Wasser gespart', threshold: 1000, type: 'water' },
    { id: 'water_5000', icon: '🏊', title: 'Kleiner Pool', description: '5000 Liter Wasser gespart', threshold: 5000, type: 'water' },
    { id: 'water_10000', icon: '🌊', title: 'Wasserheld', description: '10000 Liter Wasser gespart', threshold: 10000, type: 'water' },

    // CO2 Achievements (kg avoided)
    { id: 'co2_1', icon: '🌱', title: 'Grüner Start', description: '1 kg CO₂ vermieden', threshold: 1, type: 'co2' },
    { id: 'co2_5', icon: '🌳', title: 'Baumpfleger', description: '5 kg CO₂ vermieden', threshold: 5, type: 'co2' },
    { id: 'co2_10', icon: '🌲', title: 'Waldfreund', description: '10 kg CO₂ vermieden', threshold: 10, type: 'co2' },
    { id: 'co2_25', icon: '🏞️', title: 'Naturschützer', description: '25 kg CO₂ vermieden', threshold: 25, type: 'co2' },
    { id: 'co2_50', icon: '🌍', title: 'Klimaheld', description: '50 kg CO₂ vermieden', threshold: 50, type: 'co2' },
    { id: 'co2_100', icon: '🌏', title: 'Erdbewahrer', description: '100 kg CO₂ vermieden', threshold: 100, type: 'co2' },

    // Time saved Achievements (hours)
    { id: 'time_10h', icon: '⏱️', title: 'Zehn Stunden', description: '10 Stunden Zeit gespart', threshold: 10, type: 'timeSaved' },
    { id: 'time_24h', icon: '📅', title: 'Ein Tag Zeit', description: '24 Stunden Zeit gespart', threshold: 24, type: 'timeSaved' },
    { id: 'time_50h', icon: '⏳', title: 'Fünfzig Stunden', description: '50 Stunden Zeit gespart', threshold: 50, type: 'timeSaved' },
    { id: 'time_100h', icon: '🕐', title: 'Hundert Stunden', description: '100 Stunden Zeit gespart', threshold: 100, type: 'timeSaved' },
    { id: 'time_168h', icon: '📆', title: 'Eine Woche Zeit', description: '168 Stunden Zeit gespart', threshold: 168, type: 'timeSaved' },
    { id: 'time_500h', icon: '🗓️', title: 'Fünfhundert Stunden', description: '500 Stunden Zeit gespart', threshold: 500, type: 'timeSaved' }
];
