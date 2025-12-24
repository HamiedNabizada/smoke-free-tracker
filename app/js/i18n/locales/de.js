/**
 * German (Deutsch) Locale
 * Default language for ByeByeSmoke
 */

export default {
    // App-wide
    app: {
        name: 'ByeByeSmoke',
        tagline: 'Dein Weg in ein rauchfreies Leben'
    },

    // Common
    common: {
        loading: 'Lade...',
        close: 'Schließen'
    },

    // Accessibility
    accessibility: {
        skipToContent: 'Zum Hauptinhalt springen',
        skipToNav: 'Zur Navigation springen'
    },

    // Navigation tabs
    nav: {
        overview: 'Übersicht',
        milestones: 'Meilensteine',
        achievements: 'Erfolge',
        statistics: 'Statistiken',
        help: 'Hilfe',
        mainNavigation: 'Hauptnavigation'
    },

    // Header
    header: {
        skipToContent: 'Zum Inhalt springen',
        language: 'Sprache wechseln',
        share: 'Teilen',
        darkMode: 'Dark Mode umschalten',
        tutorial: 'Hilfe & Anleitung',
        settings: 'Einstellungen',
        logout: 'Abmelden'
    },

    // Demo mode
    demo: {
        banner: 'Demo-Modus aktiv',
        hint: 'Alle Daten sind Beispieldaten.',
        register: 'Jetzt registrieren',
        login: 'Anmelden',
        actionBlocked: '{operation} ist im Test-Modus nicht möglich.\n\nRegistriere dich kostenlos, um alle Funktionen zu nutzen!'
    },

    // Authentication
    auth: {
        notLoggedIn: 'Nicht angemeldet',
        registerFailed: 'Registrierung fehlgeschlagen',
        usernameTaken: 'Benutzername bereits vergeben',
        passwordWeak: 'Passwort zu schwach (mindestens 6 Zeichen)',
        loginFailed: 'Login fehlgeschlagen',
        invalidCredentials: 'Ungültiger Benutzername oder Passwort',
        invalidUsername: 'Ungültiger Benutzername',
        logoutFailed: 'Logout fehlgeschlagen',
        userDataNotFound: 'Benutzerdaten nicht gefunden',
        saveDataAction: 'Daten speichern',
        deleteAccountAction: 'Account löschen',
        deleteConfirm: 'Bist du sicher, dass du deinen Account löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!',
        deleteSuccess: 'Account erfolgreich gelöscht',
        deleteReloginRequired: 'Bitte melde dich erneut an, um deinen Account zu löschen.',
        deleteError: 'Fehler beim Löschen des Accounts: {message}'
    },

    // Rate limiting
    rateLimit: {
        limitReachedToast: 'Tageslimit erreicht ({limit}x). Versuche es morgen wieder.',
        limitReachedAlert: 'Du hast das Tageslimit für diese Aktion erreicht ({limit}x pro Tag).\n\nVersuche es morgen wieder.',
        lastChangeToast: 'Letzte Änderung für heute - App bleibt so kostenlos!',
        lastChangeAlert: 'Hinweis: Das ist deine letzte Änderung für heute.\n\nUm die App kostenlos zu halten, ist die Anzahl der Speichervorgänge pro Tag begrenzt ({limit}x).',
        cravingLimitReached: 'Tageslimit erreicht - Timer funktioniert, wird aber nicht mehr gezählt'
    },

    // Network status
    network: {
        noConnection: 'Keine Internetverbindung',
        offlineWarning: 'Offline - Änderungen werden nicht gespeichert',
        backOnline: 'Wieder online',
        connectionProblem: 'Verbindungsproblem'
    },

    // Login
    login: {
        button: 'Anmelden',
        loggingIn: 'Anmelden...',
        tooManyAttempts: 'Zu viele Login-Versuche. Bitte warte {time}.',
        tooManyFailed: 'Zu viele fehlgeschlagene Versuche. Bitte warte {time}.',
        attemptsRemaining: '{count} Versuche übrig',
        loadingDemo: 'Lade Demo...',
        tryDemo: 'Erst mal ausprobieren',
        demoNotSetup: 'Demo-Account ist noch nicht eingerichtet. Bitte kontaktiere den Support.',
        demoError: 'Fehler beim Demo-Login: {message}'
    },

    // Register
    register: {
        button: 'Registrieren',
        registering: 'Registriere...',
        tooManyAttempts: 'Zu viele Registrierungsversuche. Bitte warte {time}.',
        tooManyFailed: 'Zu viele fehlgeschlagene Versuche. Bitte warte {time}.',
        attemptsRemaining: '{count} Versuche übrig',
        validation: {
            usernameLength: 'Benutzername muss zwischen 3 und 50 Zeichen lang sein',
            usernameChars: 'Benutzername darf nur Buchstaben, Zahlen, _ und - enthalten',
            quitDateFuture: 'Rauchstopp-Datum darf nicht in der Zukunft liegen',
            cigarettesPerDay: 'Zigaretten pro Tag muss zwischen 1 und 200 liegen',
            pricePerPack: 'Preis pro Packung muss mindestens 0 sein',
            cigarettesPerPack: 'Zigaretten pro Packung muss zwischen 1 und 100 liegen',
            passwordLength: 'Passwort muss mindestens 6 Zeichen lang sein'
        }
    },

    // Dashboard / Overview
    dashboard: {
        motivation: {
            title: 'Tägliche Motivation'
        },
        bodyRecovery: {
            title: 'Dein Körper erholt sich',
            subtitle: 'Sieh live, wie sich dein Körper regeneriert!'
        },
        // Health Avatar section (HTML data-i18n keys)
        healthAvatar: {
            title: '🫁 Dein Körper erholt sich',
            subtitle: 'Sieh live, wie sich dein Körper regeneriert!',
            lungs: 'Lungen',
            heart: 'Herz',
            blood: 'Blutkreislauf',
            skin: 'Haut'
        },
        progress: {
            title: 'Dein Fortschritt',
            days: 'Tage',
            money: 'Geld',
            cigarettes: 'Zigaretten',
            goalDays: 'Ziel: {count} Tage',
            goalMoney: 'Ziel: {amount}€',
            goalCigarettes: 'Ziel: {count}',
            // Gauge titles (HTML data-i18n keys)
            daysSmokeFree: 'Tage rauchfrei',
            moneySaved: 'Geld gespart',
            cigarettesAvoided: 'Zigaretten vermieden'
        },
        stats: {
            daysSmokeFree: 'Zeit rauchfrei',
            daysSmokeFreeInfo: 'Seit deinem Rauchstopp',
            sinceStopped: 'Seit deinem Rauchstopp',
            moneySaved: 'Geld gespart',
            basedOn: 'Basierend auf {cigs} Zig./Tag à {price}',
            cigarettesNotSmoked: 'Nicht geraucht',
            cigarettesAvoided: '{count} Zigaretten pro Tag vermieden',
            lifeGained: 'Lebenszeit gewonnen',
            lifeGainedInfo: '17-22 Min pro Zigarette (Jackson 2025)',
            toxinsAvoided: 'Schadstoffe vermieden',
            toxinsAvoidedInfo: 'Nikotin, Teer & Co.',
            toxinsInfo: 'Nikotin, Teer & Co.',
            lungHealth: 'Lungengesundheit',
            lungHealthInfo: 'Regeneration über 10 Jahre',
            timeSaved: 'Zeit gespart',
            timeSavedInfo: '~5 Min. pro Zigarette (inkl. Vorbereitung)',
            co2Avoided: 'CO₂ vermieden',
            co2Info: '~14g CO₂ pro Zigarette',
            skinImprovement: 'Hautverbesserung',
            skinImprovementInfo: 'Signifikante Verbesserung ab 6 Monaten (Mailänder Studie)',
            skinInfo: 'Signifikante Verbesserung ab 6 Monaten'
        },
        environment: {
            title: '🌱 Dein Beitrag für die Umwelt',
            // Keys for HTML data-i18n
            water: 'Liter Wasser gespart',
            waterInfo: 'Zigarettenproduktion verbraucht ~3.7L pro Zigarette',
            trees: 'Bäume geschützt',
            treesInfo: 'Pro 300 Zigaretten wird ~1 Baum für Trocknung benötigt',
            co2: 'CO₂ vermieden',
            co2Info: '~14g CO₂ pro Zigarette (Produktion + Transport)',
            // Legacy keys
            waterSaved: 'Liter Wasser gespart',
            treesProtected: 'Bäume geschützt',
            co2Avoided: 'CO₂ vermieden'
        },
        streak: {
            title: 'App-Streak',
            days: 'Tage in Folge',
            text: 'Du nutzt die App bereits {count} Tage in Folge. Weiter so!'
        },
        nextMilestone: {
            title: 'Nächstes Ziel',
            allComplete: 'Alle Meilensteine erreicht!',
            allCompleteDesc: 'Du hast alle Gesundheitsmeilensteine gemeistert!'
        },
        comparison: {
            exceptional: 'Du bist außergewöhnlich!',
            topPercent: 'Du gehörst zu den stärksten {percent}%!',
            everyMinuteCounts: 'Jede Minute zählt!',
            strongerThanMany: 'Du bist bereits stärker als viele, die es gar nicht erst versuchen.',
            firstHoursCritical: 'Die ersten Stunden sind entscheidend - du schaffst das!'
        }
    },

    // Health Avatar
    avatar: {
        heart: 'Herz',
        lungs: 'Lungen',
        blood: 'Blutgefäße',
        brain: 'Gehirn',
        skin: 'Haut'
    },

    // Health Avatar Status & Tooltips
    healthAvatar: {
        lung: {
            status: '{percent}% regeneriert',
            tooltip: '🫁 Lungen: {percent}% regeneriert'
        },
        heart: {
            status: '{percent}% normalisiert',
            tooltip: '❤️ Herz: {percent}% normalisiert'
        },
        blood: {
            status: '{percent}% verbessert',
            tooltip: '🩸 Blutkreislauf: {percent}% verbessert'
        },
        skin: {
            status: '{percent}% verjüngt',
            tooltip: '✨ Haut: {percent}% verjüngt'
        }
    },

    // Milestones (HTML data-i18n keys)
    milestones: {
        happeningNow: {
            title: '⏰ Was passiert gerade JETZT in deinem Körper?'
        },
        healthMilestones: {
            title: 'Gesundheits-Meilensteine'
        }
    },

    // Legacy milestones data removed - now in milestonesData below
    _removed_legacy_milestones: {
        '20min': {
            title: '20 Minuten',
            description: 'Herzfrequenz und Blutdruck normalisieren sich',
            detailedInfo: 'Bereits nach 20 Minuten beginnt dein Körper mit der Regeneration. Deine Herzfrequenz und dein Blutdruck sinken auf ein normaleres Niveau. Die Durchblutung in Händen und Füßen verbessert sich spürbar - sie werden wärmer. Dies ist der Beginn eines langen Heilungsprozesses, den du erfolgreich gestartet hast.'
        },
        '1hour': {
            title: '1 Stunde',
            description: 'Körper beginnt, Nikotin abzubauen',
            detailedInfo: 'Nach einer Stunde hat dein Körper bereits begonnen, das Nikotin aktiv abzubauen. Die Nikotinrezeptoren in deinem Gehirn beginnen sich zu normalisieren. Dein Körper startet den Entgiftungsprozess und die ersten positiven Veränderungen sind bereits in Gang gesetzt.'
        },
        '2hours': {
            title: '2 Stunden',
            description: 'Nikotinentzug kann beginnen, aber Körper erholt sich',
            detailedInfo: 'Jetzt können erste Entzugserscheinungen auftreten - das ist ein gutes Zeichen! Es zeigt, dass dein Körper das Nikotin nicht mehr hat und sich daran gewöhnen muss. Gleichzeitig arbeitet dein Kreislaufsystem bereits effizienter. Deine peripheren Nervenenden beginnen, sich zu erholen.'
        },
        '8hours': {
            title: '8 Stunden',
            description: 'Sauerstoffgehalt im Blut normalisiert sich',
            detailedInfo: 'Ein wichtiger Meilenstein! Der Sauerstoffgehalt in deinem Blut hat sich normalisiert und das gefährliche Kohlenmonoxid wird weiter abgebaut. Deine Organe werden jetzt besser mit Sauerstoff versorgt. Du wirst merken, dass Anstrengungen bereits etwas leichter fallen. Das Risiko für Herzprobleme beginnt zu sinken.'
        },
        '12hours': {
            title: '12 Stunden',
            description: 'Kohlenmonoxid-Spiegel im Blut sinkt auf normal',
            detailedInfo: 'Großartig! Das giftige Kohlenmonoxid ist nun fast vollständig aus deinem Blut verschwunden. Dein Blut kann jetzt wieder optimal Sauerstoff transportieren. Deine Organe, besonders Herz und Gehirn, profitieren von der verbesserten Sauerstoffversorgung. Du atmest buchstäblich auf!'
        },
        '24hours': {
            title: '24 Stunden',
            description: 'Herzinfarktrisiko beginnt zu sinken',
            detailedInfo: 'Ein ganzer Tag geschafft - dein Herzinfarktrisiko beginnt bereits zu sinken! Dein Herz-Kreislauf-System erholt sich merklich. Der Blutdruck stabilisiert sich weiter und dein Herz arbeitet effizienter. Die akute Belastung durch Rauchen ist vorbei. Dies ist ein bedeutender Schritt für deine langfristige Herzgesundheit.'
        },
        '2days': {
            title: '2 Tage',
            description: 'Geruchs- und Geschmackssinn verbessern sich stark',
            detailedInfo: 'Die Nervenenden in Nase und Mund beginnen sich zu regenerieren. Du wirst Gerüche und Geschmäcker wieder intensiver wahrnehmen - Essen schmeckt besser, Düfte werden klarer. Die durch Rauchen abgestumpften Sinne erwachen wieder zum Leben. Viele Ex-Raucher berichten, dass dies einer der motivierendsten Effekte ist!'
        },
        '3days': {
            title: '3 Tage',
            description: 'Nikotin vollständig aus dem Körper, Atmung wird leichter',
            detailedInfo: 'Meilenstein erreicht! Das Nikotin ist nun vollständig aus deinem Körper verschwunden. Die Bronchien beginnen sich zu entspannen und zu öffnen - das Atmen fällt merklich leichter. Deine Lungenkapazität verbessert sich bereits. Die körperliche Abhängigkeit ist auf ihrem Höhepunkt, aber ab jetzt wird es kontinuierlich besser. Du hast das Schlimmste geschafft!'
        },
        '5days': {
            title: '5 Tage',
            description: 'Körperliche Nikotinentzugssymptome lassen nach',
            detailedInfo: 'Die intensivsten Entzugserscheinungen lassen nach. Dein Körper gewöhnt sich an das Leben ohne Nikotin. Die Dopamin-Rezeptoren in deinem Gehirn beginnen sich zu normalisieren. Viele berichten von einem Gefühl der Klarheit und mehr Energie. Der Hustenreiz kann zunehmen - das ist positiv, denn deine Lungen beginnen, sich zu reinigen.'
        },
        '1week': {
            title: '1 Woche',
            description: 'Bronchien beginnen sich zu erholen',
            detailedInfo: 'Eine Woche rauchfrei - ein großer Erfolg! Deine Bronchien beginnen aktiv mit der Heilung. Die durch Rauchen verursachten Entzündungen gehen zurück. Du kannst tiefer durchatmen und hustest möglicherweise mehr - ein Zeichen dafür, dass deine Lungen den angesammelten Schleim abtransportieren. Dein Energielevel steigt merklich.'
        },
        '10days': {
            title: '10 Tage',
            description: 'Flimmerhärchen in der Lunge regenerieren sich',
            detailedInfo: 'Die Flimmerhärchen (Zilien) in deinen Atemwegen, die durch Rauchen gelähmt waren, beginnen sich zu regenerieren. Sie können nun wieder ihre wichtige Funktion erfüllen: Schleim und Schadstoffe aus der Lunge zu transportieren. Dies ist ein entscheidender Schritt für deine Lungengesundheit und Infektabwehr.'
        },
        '2weeks': {
            title: '2 Wochen',
            description: 'Kreislauf und Lungenfunktion verbessern sich merklich',
            detailedInfo: 'Zwei Wochen - dein Körper hat bereits enorme Fortschritte gemacht! Dein Kreislauf funktioniert deutlich besser, Treppen steigen fällt leichter. Die Lungenfunktion verbessert sich kontinuierlich. Sport wird zunehmend angenehmer. Viele Ex-Raucher berichten von besserem Schlaf und mehr Ausdauer im Alltag. Die psychische Abhängigkeit wird schwächer.'
        },
        '3weeks': {
            title: '3 Wochen',
            description: 'Körperliche Abhängigkeit ist überwunden',
            detailedInfo: 'Ein wichtiger psychologischer und physischer Meilenstein! Die körperliche Nikotinabhängigkeit ist weitgehend überwunden. Dein Körper verlangt nicht mehr nach Nikotin. Die Herausforderung ist nun primär psychisch - Gewohnheiten und Trigger. Aber dein Körper ist frei! Die Dopamin-Produktion normalisiert sich. Du spürst mehr echte Lebensfreude.'
        },
        '1month': {
            title: '1 Monat',
            description: 'Lungenkapazität steigt um bis zu 30%',
            detailedInfo: 'Ein ganzer Monat - fantastisch! Deine Lungenkapazität hat sich um bis zu 30% erhöht. Du kannst deutlich tiefer atmen und hast mehr Ausdauer. Die Flimmerhärchen in der Lunge arbeiten wieder effektiv und schützen dich besser vor Infektionen. Husten und Kurzatmigkeit haben merklich nachgelassen. Dein Immunsystem ist bereits stärker.'
        },
        '2months': {
            title: '2 Monate',
            description: 'Hautbild verbessert sich deutlich',
            detailedInfo: 'Deine Haut erholt sich! Die Durchblutung der Haut hat sich normalisiert, was zu einem frischeren, gesünderen Aussehen führt. Falten können sich etwas glätten, der Teint wird ebenmäßiger. Die Hautalterung verlangsamt sich. Viele berichten von einem jugendlicheren Aussehen. Die Wundheilung verbessert sich ebenfalls deutlich.'
        },
        '3months': {
            title: '3 Monate',
            description: 'Lungenfunktion verbessert sich um bis zu 10%',
            detailedInfo: 'Drei Monate rauchfrei - ein enormer Erfolg! Die Lungenfunktion hat sich um bis zu 10% verbessert und verbessert sich weiter. Husten und Kurzatmigkeit gehören zunehmend der Vergangenheit an. Das Infektionsrisiko ist gesunken. Körperliche Aktivitäten fallen deutlich leichter. Die psychische Abhängigkeit ist stark zurückgegangen. Du hast es wirklich geschafft!'
        },
        '4months': {
            title: '4 Monate',
            description: 'Immunsystem ist deutlich gestärkt',
            detailedInfo: 'Dein Immunsystem arbeitet wieder auf einem höheren Niveau. Du wirst seltener krank und erholst dich schneller von Infektionen. Die weißen Blutkörperchen funktionieren wieder optimal. Deine allgemeine Widerstandskraft gegen Krankheiten ist deutlich gestiegen. Die Energieversorgung deiner Zellen hat sich normalisiert.'
        },
        '5months': {
            title: '5 Monate',
            description: 'Ausdauer und Belastbarkeit stark verbessert',
            detailedInfo: 'Deine körperliche Leistungsfähigkeit ist auf einem neuen Level! Ausdauer und Belastbarkeit haben sich massiv verbessert. Sport macht wieder Spaß. Treppen sind kein Problem mehr. Dein Herz-Kreislauf-System arbeitet effizient. Die Sauerstoffaufnahme ist deutlich besser. Du fühlst dich fitter und vitaler als seit langem.'
        },
        '6months': {
            title: '6 Monate',
            description: 'Husten und Kurzatmigkeit lassen stark nach',
            detailedInfo: 'Ein halbes Jahr rauchfrei - unglaublich! Der chronische Raucherhusten ist weitgehend verschwunden. Kurzatmigkeit gehört der Vergangenheit an. Deine Lungen haben einen Großteil ihrer Funktion zurückgewonnen. Die Flimmerhärchen arbeiten wieder normal und schützen dich effektiv. Das Infektionsrisiko für Atemwegserkrankungen ist deutlich gesunken. Du atmest frei!'
        },
        '9months': {
            title: '9 Monate',
            description: 'Flimmerhärchen vollständig regeneriert',
            detailedInfo: 'Die Flimmerhärchen in deinen Atemwegen sind vollständig regeneriert! Sie können jetzt wieder ihre volle Schutzfunktion ausüben. Die Lunge kann Schleim und Partikel effektiv abtransportieren. Deine Anfälligkeit für Atemwegsinfekte ist auf dem Niveau von Nichtrauchern. Die Selbstreinigungskraft deiner Lungen ist wiederhergestellt. Ein medizinischer Meilenstein!'
        },
        '1year': {
            title: '1 Jahr',
            description: 'Herzinfarktrisiko ist halb so hoch wie bei Rauchern',
            detailedInfo: 'Ein ganzes Jahr rauchfrei - du bist ein Champion! Dein Herzinfarktrisiko hat sich halbiert im Vergleich zu einem Raucher. Die Blutgefäße haben sich erholt, Verkalkungen gehen zurück. Dein Herz arbeitet effizienter und ist weniger belastet. Das Schlaganfallrisiko sinkt ebenfalls deutlich. Dies ist ein gewaltiger Schritt für deine langfristige Gesundheit und Lebenserwartung!'
        },
        '18months': {
            title: '18 Monate',
            description: 'Lungenfunktion nahezu normalisiert',
            detailedInfo: 'Deine Lungenfunktion hat sich nahezu vollständig normalisiert! Die Leistungsfähigkeit deiner Lungen entspricht fast der eines Nichtrauchers. Strukturelle Schäden heilen weiter. Die Lungenbläschen (Alveolen) haben sich teilweise regeneriert. Deine Atemkapazität ist deutlich gestiegen. Sportliche Höchstleistungen sind wieder möglich.'
        },
        '2years': {
            title: '2 Jahre',
            description: 'Herz-Kreislauf-System erheblich erholt',
            detailedInfo: 'Zwei Jahre rauchfrei - beeindruckend! Dein Herz-Kreislauf-System hat sich erheblich erholt. Die Gefäßwände sind elastischer, die Durchblutung ist optimal. Das Risiko für koronare Herzkrankheit sinkt kontinuierlich. Blutdruck und Puls haben sich dauerhaft normalisiert. Die Belastbarkeit deines Herzens hat sich deutlich verbessert. Deine Lebensqualität und -erwartung sind erheblich gestiegen.'
        },
        '3years': {
            title: '3 Jahre',
            description: 'Herzkrankheitsrisiko deutlich reduziert',
            detailedInfo: 'Drei Jahre - ein großartiger Meilenstein! Dein Risiko für Herzkrankheiten hat sich dem eines Nichtrauchers stark angenähert. Die Koronararterien sind deutlich gesünder. Gefäßablagerungen (Arteriosklerose) werden abgebaut. Die Herzmuskelversorgung ist optimal. Das Risiko für Herzrhythmusstörungen ist gesunken. Dein Herz ist deutlich jünger geworden!'
        },
        '5years': {
            title: '5 Jahre',
            description: 'Schlaganfallrisiko wie bei Nichtrauchern',
            detailedInfo: 'Fünf Jahre rauchfrei - eine unglaubliche Leistung! Dein Schlaganfallrisiko ist jetzt auf dem gleichen Niveau wie bei Menschen, die nie geraucht haben. Die Blutgefäße im Gehirn sind gesund. Das Risiko für Herzerkrankungen hat sich weiter deutlich reduziert. Auch das Risiko für verschiedene Krebsarten ist erheblich gesunken. Du hast dir Jahre zusätzliches Leben geschenkt!'
        },
        '10years': {
            title: '10 Jahre',
            description: 'Lungenkrebsrisiko halbiert sich',
            detailedInfo: 'Zehn Jahre rauchfrei - du bist eine absolute Legende! Dein Lungenkrebsrisiko hat sich halbiert im Vergleich zu jemandem, der weitergeraucht hätte. Das Risiko für andere Krebsarten (Mund, Rachen, Speiseröhre, Bauchspeicheldrüse, Blase) ist ebenfalls deutlich gesunken. Deine Lungen haben sich maximal regeneriert. Die Lebenserwartung hat sich erheblich erhöht. Du hast eine beispiellose gesundheitliche Transformation vollzogen!'
        },
        '15years': {
            title: '15 Jahre',
            description: 'Herzerkrankungsrisiko wie bei Nichtrauchern',
            detailedInfo: 'Fünfzehn Jahre rauchfrei - unvorstellbar großartig! Dein Risiko für koronare Herzkrankheiten entspricht nun dem eines lebenslangen Nichtrauchers. Dein Herz-Kreislauf-System ist vollständig erholt. Die durch Rauchen verursachten Schäden sind weitgehend rückgängig gemacht. Deine Gesundheit und Lebenserwartung haben sich dramatisch verbessert. Du bist ein leuchtendes Beispiel für die Kraft der Entscheidung!'
        },
        '20years': {
            title: '20 Jahre',
            description: 'Gesundheitsrisiken fast wie bei lebenslangen Nichtrauchern',
            detailedInfo: 'Zwanzig Jahre rauchfrei - du hast Geschichte geschrieben! Deine gesundheitlichen Risiken sind jetzt nahezu identisch mit denen von Menschen, die niemals geraucht haben. Die meisten durch Rauchen verursachten Schäden sind vollständig geheilt. Dein Körper hat eine komplette Transformation durchlaufen. Du hast dir Jahrzehnte zusätzliches, gesundes Leben geschenkt. Dies ist der ultimative Triumph über die Sucht und ein Testament an menschliche Willenskraft und Regenerationsfähigkeit!'
        }
    },

    // Milestones Section
    milestonesSection: {
        title: 'Gesundheitsmeilensteine',
        subtitle: 'Dein Körper erholt sich mit jedem Tag',
        happeningNow: 'Was passiert JETZT in deinem Körper',
        reached: 'Erreicht',
        inProgress: 'In Bearbeitung',
        upcoming: 'Kommend',
        timeRemaining: 'Noch {time}'
    },

    // Happening Now
    happeningNow: {
        justReached: 'Gerade erreicht!',
        activePhase: 'Aktive Phase',
        nextPhase: 'Nächste Phase ({title}) in {time}',
        allAchieved: 'Alle Gesundheitsmeilensteine erreicht!',
        lessThanOneDay: 'weniger als 1 Tag',
        yearsAndMonths: '{years} Jahr(e) und {months} Monat(e)'
    },

    // Achievements (HTML data-i18n key)
    achievements: {
        title: 'Erfolge'
    },

    // Achievements Section
    achievementsSection: {
        title: 'Deine Erfolge',
        subtitle: 'Feiere deine Meilensteine',
        unlocked: 'Freigeschaltet',
        locked: 'Noch nicht erreicht',
        progress: '{current} von {total}',
        categories: {
            time: 'Zeit',
            money: 'Geld',
            cigarettes: 'Zigaretten',
            life: 'Lebenszeit',
            lung: 'Lungengesundheit',
            water: 'Wasser',
            co2: 'CO₂',
            timeSaved: 'Zeit gespart'
        }
    },

    // Statistics
    statistics: {
        title: 'Deine Statistiken',
        healthScore: {
            title: 'Health Score',
            subtitle: 'Gewichteter Durchschnitt aus 5 Erholungsmetriken',
            rating: {
                excellent: 'Exzellent!',
                veryGood: 'Sehr gut!',
                good: 'Gut!',
                progress: 'Fortschritt!',
                started: 'Gestartet!'
            },
            message: {
                excellent: 'Deine Gesundheit hat sich hervorragend erholt!',
                veryGood: 'Du machst großartige Fortschritte!',
                good: 'Dein Körper erholt sich stetig.',
                progress: 'Die Erholung hat begonnen.',
                started: 'Erste positive Veränderungen laufen.'
            },
            explanation: 'Gewichteter Durchschnitt aus 5 Erholungsmetriken, basierend auf WHO, JAMA und PMC-Studien.',
            viewSources: 'Quellen einsehen',
            components: {
                cardiovascular: {
                    label: 'Herz-Kreislauf',
                    desc: 'Häufigste Todesursache bei Rauchern. 15 Jahre bis Nichtraucher-Niveau.'
                },
                lung: {
                    label: 'Lungenfunktion',
                    desc: 'COPD, Lungenkrebs. 10 Jahre bis volle Erholung.'
                },
                circulation: {
                    label: 'Durchblutung',
                    desc: 'Periphere Gefäße. Schnelle Erholung in 6 Monaten.'
                },
                risk: {
                    label: 'Risikoreduktion',
                    desc: 'Herzinfarkt, Schlaganfall, Krebs. Langfristiger Schutz.'
                },
                skin: {
                    label: 'Hautgesundheit',
                    desc: 'Sichtbarer Indikator für Regeneration. 9 Monate.'
                }
            }
        },
        lotus: {
            title: '🪷 Deine Lotus',
            subtitle: '– Gesundheitsscore',
            outOf: 'von 100',
            preview: 'Wachstum ansehen',
            previewPlaying: 'Läuft...',
            stageFormat: '{name} (Stufe {current}/{total})',
            nextStageAt: 'Bei {points} Punkten: {stage}',
            fullBloomReached: 'Deine Lotus hat ihre volle Schönheit erreicht',
            stages: {
                seed: 'Samen',
                seedDesc: 'Ein Samen ruht in der Erde',
                sprout: 'Keimling',
                sproutDesc: 'Der Samen beginnt zu keimen',
                youngSprout: 'Junger Spross',
                youngSproutDesc: 'Ein zarter Spross wächst empor',
                sproutLeaves: 'Spross mit Blättern',
                sproutLeavesDesc: 'Kleine Blätter entfalten sich',
                floatingLeaf: 'Schwimmendes Blatt',
                floatingLeafDesc: 'Das erste Blatt schwimmt auf dem Wasser',
                largeLeaf: 'Großes Lotusblatt',
                largeLeafDesc: 'Ein prächtiges Lotusblatt breitet sich aus',
                smallBud: 'Kleine Knospe',
                smallBudDesc: 'Eine zarte Knospe formt sich',
                largeBud: 'Große Knospe',
                largeBudDesc: 'Die Knospe ist bereit sich zu öffnen',
                openingFlower: 'Öffnende Blüte',
                openingFlowerDesc: 'Die Blüte beginnt sich zu entfalten',
                fullBloom: 'Volle Blüte',
                fullBloomDesc: 'Deine Lotus erstrahlt in voller Pracht!'
            },
            nextStage: 'Bei {points} Punkten: {stage}'
        },
        comparison: {
            title: 'Vergleich',
            header: {
                milestone: 'Meilenstein',
                average: 'Durchschnittlich schaffen es',
                status: 'Dein Status'
            },
            milestones: {
                '24h': '24 Stunden',
                '3d': '3 Tage',
                '1w': '1 Woche',
                '2w': '2 Wochen',
                '1m': '1 Monat',
                '3m': '3 Monate',
                '6m': '6 Monate',
                '1y': '1 Jahr'
            },
            ofPeople: '% der Menschen',
            achieved: 'Erreicht',
            notYet: 'Noch nicht'
        },
        ageGroup: {
            title: 'Altersgruppen-Vergleich',
            youAreHere: 'Du bist hier!',
            giveUpBefore: 'geben vorher auf',
            failBefore: 'scheitern vorher',
            giveUp: 'geben auf',
            failWeek1: 'scheitern in Woche 1',
            giveUp24h: 'geben in 24h auf',
            stayStrong: 'bleiben dran',
            '6m': {
                title: 'Du bist eine absolute Ausnahme!',
                text: 'In der Altersgruppe {ageGroup} schaffen nur <strong>1% der Menschen</strong> die ersten 6 Monate rauchfrei zu bleiben.',
                highlight: 'Du gehörst zu den Top 1%!'
            },
            '3m': {
                title: 'Du bist außergewöhnlich stark!',
                text: 'In der Altersgruppe {ageGroup} schaffen nur <strong>2% der Menschen</strong> die ersten 3 Monate.',
                highlight: 'Du gehörst zu den Top 2%!'
            },
            '1m': {
                title: 'Beeindruckende Leistung!',
                text: 'In der Altersgruppe {ageGroup} schaffen nur <strong>3% der Menschen</strong> den ersten Monat.',
                highlight: 'Du gehörst zu den Top 3%!'
            },
            '1w': {
                title: 'Großartig gemacht!',
                text: 'In der Altersgruppe {ageGroup} schaffen nur <strong>5% der Menschen</strong> die erste Woche.',
                highlight: 'Du gehörst zu den Top 5%!'
            },
            start: {
                title: 'Starker Start!',
                text: 'In der Altersgruppe {ageGroup} versuchen viele aufzuhören, aber die meisten geben in den ersten Tagen auf.',
                highlight: 'Du hast bereits den wichtigsten Schritt gemacht!'
            }
        },
        timeline: {
            title: 'Meilenstein-Timeline',
            '1d': '1 Tag',
            '3d': '3 Tage',
            '1w': '1 Woche',
            '2w': '2 Wochen',
            '1m': '1 Monat',
            '3m': '3 Monate',
            '6m': '6 Monate',
            '1y': '1 Jahr',
            '2y': '2 Jahre',
            '5y': '5 Jahre',
            '10y': '10 Jahre',
            still: 'Noch',
            days: 'Tage'
        },
        projection: {
            title: 'Zukunftsprojektion',
            in1m: 'In 1 Monat',
            in3m: 'In 3 Monaten',
            in6m: 'In 6 Monaten',
            in1y: 'In 1 Jahr',
            saved: 'gespart',
            avoided: 'vermieden',
            lifeGained: 'Leben gewonnen'
        },
        goalCalculator: {
            title: '🎯 Dein persönliches Ziel',
            intro: 'Berechne, wie lange es dauert oder was du erreichen wirst!',
            byDays: 'Nach Tagen',
            byMoney: 'Nach Geld',
            howManyDays: 'Wie viele Tage?',
            howMuchMoney: 'Wie viel Geld (€)?',
            daysPlaceholder: 'z.B. 100',
            moneyPlaceholder: 'z.B. 2000',
            daysLabel: 'In wie vielen Tagen?',
            moneyLabel: 'Wie viel Geld sparen?',
            calculate: 'Berechnen',
            result: 'Ergebnis',
            inDays: 'In {days} Tagen wirst du:',
            toSave: 'Um {amount} zu sparen:',
            needDays: 'brauchst du {days} Tage',
            willSave: '{amount} gespart haben',
            willAvoid: '{count} Zigaretten vermieden haben',
            willGain: '{time} Lebenszeit gewonnen haben',
            alerts: {
                invalidDays: 'Bitte gib eine gültige Anzahl an Tagen ein!',
                invalidMoney: 'Bitte gib einen gültigen Geldbetrag ein!'
            },
            achieved: '{percent}% erreicht',
            days: 'Tage',
            yourGoal: 'Dein Ziel',
            reachedOn: 'Erreicht am: {date}',
            moneySaved: 'Geld gespart',
            cigarettesAvoided: 'Zigaretten vermieden',
            lifeGained: 'Leben gewonnen',
            savingsGoal: 'Dein Sparziel',
            timeNeeded: 'Benötigte Zeit'
        },
        // Chart titles (HTML data-i18n keys)
        progressChart: {
            title: 'Fortschritt'
        },
        cravingChart: {
            title: '📊 Deine überwundenen Verlangen',
            subtitle: 'Verlauf der letzten 30 Tage'
        },
        heatmap: {
            title: '🔥 Wann tritt Verlangen auf?',
            subtitle: 'Muster der letzten 30 Tage nach Wochentag und Uhrzeit'
        },
        // Age comparison (HTML uses ageComparison, locale has ageGroup)
        ageComparison: {
            title: '👥 Vergleich mit deiner Altersgruppe'
        }
    },

    // SOS / Help
    sos: {
        button: 'Akutes Verlangen',
        buttonHint: 'Klicke hier für sofortige Unterstützung mit einem 5-Minuten-Timer',
        hint: 'Klicke hier für sofortige Unterstützung',
        timer: {
            title: 'Craving-Timer',
            remaining: 'verbleibend',
            breatheIn: 'Einatmen',
            breatheOut: 'Ausatmen',
            hold: 'Halten',
            tip: 'Tipp'
        },
        tabs: {
            tips: 'Tipps',
            breathing: 'Atmen',
            games: 'Spiele'
        },
        // Tips section (HTML data-i18n keys)
        tips: {
            title: '💡 Tipps gegen akutes Verlangen',
            fiveMinRule: {
                title: '5-Minuten-Regel',
                text: 'Warte 5 Minuten. Das Verlangen wird von selbst schwächer!'
            },
            water: {
                title: 'Wasser trinken',
                text: 'Ein großes Glas Wasser trinken lenkt ab und hilft.'
            },
            walk: {
                title: 'Kurzer Spaziergang',
                text: 'Bewege dich 5-10 Minuten. Frische Luft hilft!'
            },
            breathe: {
                title: 'Tief durchatmen',
                text: '10x tief ein- und ausatmen. Beruhigt sofort.'
            },
            call: {
                title: 'Jemanden anrufen',
                text: 'Ruf eine unterstützende Person an und rede.'
            },
            snack: {
                title: 'Gesunder Snack',
                text: 'Obst, Gemüse oder Kaugummi lenken den Mund ab.'
            }
        },
        // Shocking facts (HTML data-i18n keys)
        shockingFacts: {
            title: '⚠️ Warum du aufgehört hast',
            intro: 'Diese Fakten erinnern dich daran, warum jede Zigarette ein Fehler wäre:',
            fact1: {
                number: '170.000',
                label: 'Tote pro Jahr in Deutschland',
                detail: 'Jeder 7. Todesfall durch Rauchen'
            },
            fact2: {
                number: '8 Mio.',
                label: 'Tote weltweit pro Jahr',
                detail: 'Mehr als Alkohol, AIDS & Drogen zusammen'
            },
            fact3: {
                number: '-10 Jahre',
                label: 'Lebenserwartung',
                detail: 'Raucher sterben im Schnitt 10 Jahre früher'
            },
            fact4: {
                number: '90%',
                label: 'Lungenkrebs durch Rauchen',
                detail: '7x höheres Risiko als Nichtraucher'
            },
            fact5: {
                number: '3x',
                label: 'Herzinfarktrisiko',
                detail: 'Schlaganfallrisiko 2-3x höher'
            },
            fact6: {
                number: '88.000',
                label: 'Neue Krebsfälle/Jahr (DE)',
                detail: 'Nur durch Rauchen verursacht'
            },
            fact7: {
                number: '90%',
                label: 'COPD-Patienten',
                detail: 'Sind oder waren Raucher'
            },
            fact8: {
                number: '17-22 Min',
                label: 'Lebenszeit pro Zigarette',
                detail: 'Jede Zigarette verkürzt dein Leben (Jackson 2025)'
            },
            fact9: {
                number: 'Raucherbein',
                label: 'Amputation droht',
                detail: 'Durchblutungsstörungen in Beinen'
            },
            fact10: {
                number: 'Erblindung',
                label: 'Netzhautdegeneration',
                detail: 'Rauchen schädigt die Augen'
            },
            fact11: {
                number: 'Unfruchtbarkeit',
                label: 'Potenzstörungen',
                detail: 'Schlechte Spermienqualität'
            },
            fact12: {
                number: 'Zahnverlust',
                label: 'Zahnfleischerkrankungen',
                detail: '2x höheres Risiko für Zahnausfall'
            },
            reminder: '<strong>Jedes Verlangen geht vorbei.</strong> Du bist stärker als die Sucht. Denk daran, warum du aufgehört hast!'
        },
        // Overlay (HTML data-i18n keys)
        overlay: {
            close: 'Schließen',
            title: 'SOS Hilfe',
            remaining: 'verbleibend',
            countAsCraving: 'Als Verlangen zählen',
            tabs: {
                tips: '💡 Tipps',
                breathing: '🧘 Atmen',
                games: '🎮 Spiele'
            }
        },
        // Breathing exercises (HTML data-i18n keys)
        breathing: {
            title: 'Atemübungen',
            exerciseTitle: 'Atemübung',
            boxBreathing: 'Box Breathing',
            boxBreathingDesc: '4 Sekunden ein, 4 halten, 4 aus, 4 halten',
            technique478: '4-7-8 Technik',
            technique478Desc: '4 Sekunden ein, 7 halten, 8 aus',
            stop: 'Übung beenden',
            box: {
                name: 'Box Breathing',
                detail: '4-4-4-4 | ~2 Min | Fokus'
            },
            '478': {
                name: '4-7-8 Technik',
                detail: '4-7-8 | ~2.5 Min | Entspannung'
            }
        },
        games: {
            title: 'Ablenkungsspiele',
            tapChallenge: 'Tap Challenge',
            tapChallengeDesc: 'Tippe so schnell du kannst',
            memory: 'Memory',
            memoryDesc: 'Finde die Paare',
            breathTrainer: 'Atem-Trainer',
            breathTrainerDesc: 'Folge dem Atemrhythmus'
        },
        success: {
            title: 'Geschafft!',
            message: 'Du hast das Verlangen überwunden!',
            timeHeld: 'Du hast {time} durchgehalten.',
            cravingCount: 'Das war dein {count}. überwundenes Verlangen heute!',
            notCounted: 'Nicht als Verlangen gezählt.'
        },
        countAsCraving: 'Als Verlangen zählen',
        dontCount: 'Nicht zählen',
        stop: 'Beenden',
        cravingStats: {
            title: '💪 Deine Erfolge gegen Verlangen',
            today: 'Heute überwunden',
            weekAvg: 'Ø pro Tag (7 Tage)',
            monthTotal: 'Gesamt (30 Tage)',
            trendDecreasing: 'Trend: Abnehmend',
            trendIncreasing: 'Trend: Zunehmend',
            trendStable: 'Trend: Stabil'
        },
        heatmap: {
            title: 'Verlangen-Heatmap',
            loading: 'Lade Heatmap...',
            noData: 'Noch keine Verlangen-Daten vorhanden.',
            hint: 'Nutze den Craving-Timer, um deine Verlangen zu tracken.',
            insights: 'Erkenntnisse',
            peakDay: 'Höchstes Verlangen am {day}',
            peakTime: 'Kritischste Uhrzeit: {time} Uhr',
            noCravingDay: 'Kein Verlangen am {day} - gut gemacht!',
            notEnoughData: 'Noch nicht genug Daten für Erkenntnisse',
            total: 'Gesamt: {count} Verlangen in den letzten 30 Tagen',
            less: 'Weniger',
            more: 'Mehr'
        }
    },

    // Craving Timer (inline game/breathing translations)
    cravingTimer: {
        tips: {
            breathe: 'Atme tief ein und langsam aus. Zähle dabei bis 4.',
            strong: 'Du bist stärker als jedes Verlangen. Du schaffst das!',
            fewMinutes: 'Nur noch ein paar Minuten. Das Verlangen wird schwächer!',
            wave: 'Lass das Verlangen wie eine Welle über dich hinwegziehen.',
            goal: 'Denk an dein Ziel: Ein gesünderes, freies Leben!',
            water: 'Trink ein großes Glas Wasser - das hilft sofort.',
            move: 'Bewege dich! Geh ein paar Schritte oder strecke dich.',
            focus: 'Konzentriere dich auf deinen Atem. Ein... Aus... Ein... Aus...',
            healing: 'Dein Körper heilt sich gerade. Jede Sekunde zählt!',
            achieved: 'Du hast schon so viel geschafft. Gib jetzt nicht auf!',
            stronger: 'Jedes überwundene Verlangen macht dich stärker!',
            roleModel: 'Du bist ein Vorbild für andere. Bleib stark!'
        },
        breathing: {
            inhale: 'Einatmen',
            exhale: 'Ausatmen',
            hold: 'Halten',
            cycle: 'Zyklus {current} von {total}',
            done: 'Geschafft!',
            completed: 'Übung abgeschlossen'
        },
        games: {
            points: 'Punkte',
            time: 'Zeit',
            back: 'Zurück',
            playAgain: 'Nochmal',
            super: 'Super!',
            good: 'Gut!',
            keepPracticing: 'Weiter üben!',
            breatheIn: 'Atme ein...',
            breatheOut: 'Atme aus...',
            breaths: 'Atemzüge',
            breatheResult: '5 tiefe Atemzüge - gut gemacht!',
            moves: 'Züge',
            found: 'Gefunden',
            perfect: 'Perfekt!',
            veryGood: 'Sehr gut!',
            wellDone: 'Gut gemacht!'
        },
        success: {
            minute: 'Minute',
            minutes: 'Minuten',
            seconds: 'Sekunden',
            and: 'und',
            cravingCount: 'Das war dein {count}. überwundenes Verlangen heute!',
            heldOn: 'Du hast <strong>{time}</strong> durchgehalten.',
            notCounted: 'Nicht als Verlangen gezählt.',
            totalDays: 'Gesamt rauchfrei: <strong>{days} Tage</strong>',
            saved: 'Gespart: <strong>{amount}€</strong>'
        }
    },

    // Craving tips
    cravingTips: [
        'Atme tief ein und langsam aus. Zähle dabei bis 4.',
        'Trinke ein großes Glas kaltes Wasser.',
        'Geh kurz an die frische Luft.',
        'Kaue einen Kaugummi oder lutsche einen Bonbon.',
        'Lenke dich mit einem kurzen Spiel ab.',
        'Erinnere dich an deine Gründe aufzuhören.',
        'Das Verlangen vergeht in wenigen Minuten!',
        'Du bist stärker als jedes Verlangen. Du schaffst das!',
        'Denk an das Geld, das du sparst.',
        'Stell dir vor, wie gut sich freies Atmen anfühlt.',
        'Ruf einen Freund an oder schreib eine Nachricht.',
        'Mach 10 Kniebeugen oder Liegestütze.'
    ],

    // Shocking facts
    shockingFacts: {
        title: 'Wusstest du?',
        facts: [
            'Eine Zigarette enthält über 7.000 Chemikalien, davon mindestens 70 krebserregend.',
            'Rauchen verkürzt das Leben im Schnitt um 10 Jahre.',
            'Alle 6 Sekunden stirbt weltweit jemand an den Folgen des Rauchens.',
            'Passivrauchen tötet jährlich über 600.000 Menschen weltweit.',
            'Zigarettenfilter brauchen bis zu 15 Jahre, um sich zu zersetzen.',
            'Raucher haben ein 25x höheres Lungenkrebsrisiko als Nichtraucher.',
            'Eine Schachtel Zigaretten reduziert dein Leben um ca. 5 Stunden.',
            'Tabakanbau verbraucht 22 Milliarden Tonnen Wasser pro Jahr.',
            'Rauchen verursacht 90% aller Lungenkrebsfälle.',
            'Ex-Raucher leben im Schnitt 10 Jahre länger als aktive Raucher.',
            'Dein Herzinfarktrisiko sinkt bereits 24 Stunden nach der letzten Zigarette.',
            'Nach 15 Jahren ist dein Risiko für Herzkrankheiten wie bei Nichtrauchern.'
        ]
    },

    // Settings
    settings: {
        title: '⚙️ Einstellungen',
        close: 'Einstellungen schließen',
        // Language section (HTML data-i18n keys)
        language: {
            title: '🌐 Sprache'
        },
        // Account section (HTML data-i18n keys)
        account: {
            title: 'Account',
            loggedInAs: 'Eingeloggt als:'
        },
        // Data section (HTML data-i18n keys)
        data: {
            title: '📊 Meine Daten bearbeiten',
            quitDate: 'Rauchstopp-Datum & Uhrzeit',
            cigarettesPerDay: 'Zigaretten pro Tag (vorher)',
            pricePerPack: 'Preis pro Packung (€)',
            cigarettesPerPack: 'Zigaretten pro Packung',
            save: 'Speichern'
        },
        // Notifications section (HTML data-i18n keys)
        notifications: {
            title: '🔔 Benachrichtigungen',
            description: 'Erhalte Benachrichtigungen während die App geöffnet ist.',
            push: {
                label: 'Benachrichtigungen aktivieren',
                description: 'Erlaube der App, dir Benachrichtigungen zu senden'
            },
            milestones: {
                label: 'Meilenstein-Benachrichtigungen',
                description: 'Bei Erreichen eines Gesundheitsmeilensteins'
            },
            daily: {
                label: 'Tägliche Motivation',
                description: 'Einmal täglich um 10:00 Uhr (wenn App geöffnet)'
            }
        },
        // Export section (HTML data-i18n keys)
        export: {
            title: '📦 Deine Daten',
            description: 'Exportiere deine Daten oder teile deine Erfolge.',
            exportData: {
                title: 'Daten exportieren',
                description: 'Lade alle deine Daten als JSON-Datei herunter'
            },
            shareSuccess: {
                title: 'Erfolg teilen',
                description: 'Teile deine rauchfreie Zeit mit anderen'
            },
            badge: {
                title: 'Erfolgs-Badge erstellen',
                description: 'Erstelle ein Badge mit deinen Statistiken'
            },
            shareImage: {
                title: 'Als Bild teilen',
                description: 'Erstelle ein Bild für Instagram, WhatsApp & Co.'
            },
            pdf: {
                title: 'PDF-Report erstellen',
                description: 'Exportiere deine Statistiken als PDF-Dokument'
            }
        },
        // Danger zone (HTML data-i18n keys)
        danger: {
            title: '⚠️ Gefahrenzone',
            warning: 'Diese Aktion kann nicht rückgängig gemacht werden!',
            deleteAccount: 'Account löschen'
        },
        // Legacy keys
        accountInfo: 'Account-Info',
        username: 'Benutzername',
        email: 'E-Mail',
        memberSince: 'Mitglied seit',
        quitSettings: 'Rauchstopp-Einstellungen',
        quitDate: 'Aufhördatum',
        cigarettesPerDay: 'Zigaretten pro Tag',
        pricePerPack: 'Preis pro Packung (€)',
        cigarettesPerPack: 'Zigaretten pro Packung',
        save: 'Speichern',
        saving: 'Speichern...',
        saveSuccess: 'Daten erfolgreich gespeichert! Die Seite wird neu geladen.',
        saveError: 'Fehler beim Speichern der Daten: {message}',
        logoutError: 'Logout fehlgeschlagen. Bitte versuche es erneut.',
        cancel: 'Abbrechen',
        dataManagement: 'Datenverwaltung',
        exportData: 'Daten exportieren',
        exportDataDesc: 'Lade alle deine Daten als JSON-Datei herunter',
        shareSuccess: 'Erfolg teilen',
        shareSuccessDesc: 'Teile deinen Fortschritt mit anderen',
        shareImage: 'Als Bild teilen',
        shareImageDesc: 'Erstelle ein Bild deines Fortschritts',
        deleteAccount: 'Account löschen',
        deleteAccountDesc: 'Lösche deinen Account und alle Daten',
        deleteConfirm: 'Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden.'
    },

    // Data Export
    dataExport: {
        notLoggedIn: 'Du musst eingeloggt sein um Daten zu exportieren.',
        exportSuccess: 'Deine Daten wurden erfolgreich heruntergeladen!',
        exportError: 'Fehler beim Exportieren der Daten: {message}'
    },

    // Share
    share: {
        title: '📤 Erfolge teilen',
        close: 'Schließen',
        successText: '🎉 Ich bin seit {days} Tagen rauchfrei!\n\n💰 Gespart: {money}€\n🚭 Zigaretten vermieden: {cigarettes}\n❤️ Lebenszeit gewonnen: {hours} Stunden\n\n#rauchfrei #byebyesmoke',
        copiedToClipboard: '📋 Text wurde in die Zwischenablage kopiert!\n\nDu kannst ihn jetzt in WhatsApp, Facebook oder wo du möchtest einfügen.',
        modalTitle: 'Teile deinen Erfolg',
        creatingImage: 'Erstelle Bild...',
        imageText: '🎉 Schau dir meinen Fortschritt an! #rauchfrei #byebyesmoke',
        imageError: 'Fehler beim Erstellen des Bildes: {message}',
        imageDownloaded: '📸 Dein Erfolgs-Bild wurde heruntergeladen!\n\nDu kannst es jetzt auf Instagram, WhatsApp, Facebook oder wo du möchtest teilen.',
        // Share modal buttons
        shareSuccess: {
            title: 'Erfolg teilen',
            description: 'Teile deine rauchfreie Zeit mit anderen'
        },
        badge: {
            title: 'Erfolgs-Badge erstellen',
            description: 'Erstelle ein Badge mit deinen Statistiken'
        },
        shareImage: {
            title: 'Als Bild teilen',
            description: 'Erstelle ein Bild für Instagram, WhatsApp & Co.'
        },
        pdf: {
            title: 'PDF-Report erstellen',
            description: 'Exportiere deine Statistiken als PDF-Dokument'
        }
    },

    // Badge
    badge: {
        smokeFree: 'Rauchfrei!',
        anonymousHero: 'Anonymer Held',
        days: 'Tage',
        smokeFreeSub: 'rauchfrei',
        daysSmokeFree: 'Tage rauchfrei',
        saved: 'gespart',
        cigarettesAvoided: 'Zigaretten vermieden',
        lifeGained: 'Lebenszeit gewonnen',
        lungHealth: 'Lungengesundheit',
        createdWith: 'Erstellt mit ByeByeSmoke',
        downloadSuccess: '🏆 Dein Erfolgs-Badge wurde heruntergeladen!\n\nDu kannst es jetzt als Profilbild, Wallpaper oder zum Teilen verwenden.',
        createTitle: 'Erfolgs-Badge erstellen',
        createDesc: 'Erstelle ein Badge mit deinen Statistiken'
    },

    // PDF Report
    pdf: {
        user: 'Benutzer',
        libraryLoading: 'PDF-Bibliothek wird geladen, bitte versuche es erneut.',
        subtitle: 'Dein Rauchfrei-Report',
        createdFor: 'Erstellt für',
        date: 'Datum',
        daysSmokeFree: 'Tage rauchfrei',
        moneySaved: 'Geld gespart',
        cigarettesAvoided: 'Zigaretten vermieden',
        lifeGained: 'Lebenszeit gewonnen',
        lungHealth: 'Lungengesundheit',
        timeSaved: 'Zeit gespart',
        co2Avoided: 'CO2 vermieden',
        environmentImpact: 'Umwelt-Impact',
        waterSaved: 'Wasser gespart',
        liters: 'Liter',
        treesSaved: 'Bäume gerettet',
        footer: 'Erstellt mit ByeByeSmoke - byebyesmoke.de',
        downloadSuccess: '📄 Dein PDF-Report wurde erstellt und heruntergeladen!'
    },

    // Heatmap
    heatmap: {
        loading: 'Lade Heatmap...',
        dataUnavailable: 'Heatmap-Daten nicht verfügbar',
        noData: 'Noch keine Verlangen-Daten vorhanden.',
        hint: 'Nutze den Craving-Timer, um deine Verlangen zu tracken.',
        loadError: 'Fehler beim Laden der Heatmap',
        cravings: 'Verlangen',
        less: 'Weniger',
        more: 'Mehr',
        insights: 'Erkenntnisse',
        total: 'Gesamt',
        cravingsLast30Days: 'Verlangen in den letzten 30 Tagen',
        peakDay: 'Höchstes Verlangen am <strong>{day}</strong>',
        peakTime: 'Kritischste Uhrzeit: <strong>{time}</strong>',
        noCravings: 'Kein Verlangen am <strong>{day}</strong> - gut gemacht!',
        notEnoughData: 'Noch nicht genug Daten für Erkenntnisse'
    },

    // Tutorial
    tutorial: {
        title: 'Willkommen bei ByeByeSmoke!',
        close: 'Tutorial schließen',
        srTitle: 'Tutorial',
        skip: 'Überspringen',
        next: 'Weiter',
        prev: 'Zurück',
        finish: 'Fertig',
        // Navigation (HTML data-i18n keys)
        nav: {
            next: 'Weiter',
            prev: 'Zurück'
        },
        // Slide 1: Willkommen
        slide1: {
            title: 'Willkommen bei ByeByeSmoke!',
            text: 'Lass uns dir die wichtigsten Features zeigen und wie du die App als PWA installieren kannst.',
            feature1: '📊 Verfolge deinen Fortschritt',
            feature2: '🏥 Gesundheitsmeilensteine',
            feature3: '🆘 Hilfe bei Verlangen',
            feature4: '🔔 Push-Benachrichtigungen',
            feature5: '📱 Als App installieren'
        },
        // Slide 2: Features
        slide2: {
            title: 'Die 4 Hauptbereiche',
            stats: {
                title: '📊 Dashboard',
                text: 'Deine Statistiken auf einen Blick'
            },
            milestones: {
                title: '🏥 Meilensteine',
                text: 'Verfolge deine Gesundheitsfortschritte'
            },
            craving: {
                title: '🆘 SOS-Hilfe',
                text: '5-Minuten-Timer bei Verlangen'
            },
            notifications: {
                title: '🔔 Benachrichtigungen',
                text: 'Motivierende Push-Nachrichten'
            }
        },
        // Slide 3: App installieren
        slide3: {
            title: 'Als App installieren',
            step1: {
                title: 'iOS (Safari)',
                text: 'Tippe auf "Teilen" → "Zum Home-Bildschirm"'
            },
            step2: {
                title: 'Android (Chrome)',
                text: 'Tippe auf ⋮ → "App installieren"'
            },
            step3: {
                title: 'Desktop',
                text: 'Klicke auf das Installations-Symbol in der Adressleiste'
            },
            note: 'Nach der Installation verhält sich die App wie eine native App!'
        },
        // Slide 4: Tipps
        slide4: {
            title: 'Tipps für deinen Erfolg',
            warning: '💡 Diese Tipps helfen dir durch schwierige Momente:',
            step1: {
                title: '5-Minuten-Regel',
                text: 'Warte 5 Minuten - das Verlangen vergeht!'
            },
            step2: {
                title: 'Wasser trinken',
                text: 'Ein großes Glas Wasser hilft sofort.'
            },
            step3: {
                title: 'Bewegung',
                text: 'Kurzer Spaziergang oder Stretching.'
            },
            step4: {
                title: 'Atemübungen',
                text: 'Nutze die integrierten Atemübungen.'
            }
        },
        // Slide 5: Los geht's
        slide5: {
            title: 'Du bist bereit!',
            text: 'Jeder Tag ohne Zigarette ist ein Erfolg. Wir glauben an dich!',
            tipsTitle: 'Denk daran:',
            tip1: '💪 Du bist stärker als jedes Verlangen',
            tip2: '📊 Nutze die App täglich für Motivation',
            tip3: '🆘 Bei Verlangen: SOS-Button drücken',
            tip4: '🎉 Feiere jeden Meilenstein!',
            finalMessage: 'Los geht\'s - du schaffst das!'
        },
        // Legacy slides array
        slides: [
            {
                title: 'Dein Begleiter',
                content: 'Diese App begleitet dich auf deinem Weg in ein rauchfreies Leben. Verfolge deinen Fortschritt und bleib motiviert!'
            },
            {
                title: 'Dashboard',
                content: 'Im Dashboard siehst du alle wichtigen Statistiken auf einen Blick: gesparte Zeit, Geld und deine Gesundheitsfortschritte.'
            },
            {
                title: 'Meilensteine',
                content: 'Feiere jeden Erfolg! Dein Körper erholt sich kontinuierlich - hier siehst du genau, was passiert.'
            },
            {
                title: 'SOS-Hilfe',
                content: 'Bei akutem Verlangen hilft dir der Craving-Timer mit Atemübungen und Ablenkungsspielen.'
            },
            {
                title: 'Los geht\'s!',
                content: 'Du bist bereit! Jeder Tag ohne Zigarette ist ein Erfolg. Wir glauben an dich!'
            }
        ]
    },

    // Weekly summary
    weeklySummary: {
        title: 'Wochenrückblick',
        thisWeek: 'Diese Woche',
        daysSmokeFree: 'Tage rauchfrei',
        moneySaved: 'gespart',
        cigarettesAvoided: 'Zigaretten vermieden',
        cravingsOvercome: 'Verlangen überwunden',
        keepGoing: 'Weiter so!'
    },

    // Footer
    footer: {
        madeWith: 'Mit Herz für deine Gesundheit',
        about: 'Über ByeByeSmoke',
        privacy: 'Datenschutz',
        imprint: 'Impressum',
        sources: 'Quellen',
        disclaimer: 'Kein Ersatz für medizinische Beratung.'
    },

    // Time units
    time: {
        second: 'Sekunde',
        seconds: 'Sekunden',
        minute: 'Minute',
        minutes: 'Minuten',
        hour: 'Stunde',
        hours: 'Stunden',
        hoursShort: '{count} Std.',
        day: 'Tag',
        days: '{count} Tage',
        week: 'Woche',
        weeks: '{count} Wochen',
        month: 'Monat',
        months: '{count} Monate',
        year: 'Jahr',
        years: '{count} Jahre',
        remaining: 'Noch {time}',
        ago: 'vor {time}',
        in: 'in {time}',
        dayNamesShort: {
            sunday: 'So',
            monday: 'Mo',
            tuesday: 'Di',
            wednesday: 'Mi',
            thursday: 'Do',
            friday: 'Fr',
            saturday: 'Sa'
        }
    },

    // Common
    common: {
        yes: 'Ja',
        no: 'Nein',
        ok: 'OK',
        cancel: 'Abbrechen',
        save: 'Speichern',
        close: 'Schließen',
        loading: 'Laden...',
        error: 'Fehler',
        success: 'Erfolg',
        confirm: 'Bestätigen',
        back: 'Zurück',
        next: 'Weiter',
        of: 'von'
    },

    // Auth
    auth: {
        login: 'Anmelden',
        register: 'Registrieren',
        logout: 'Abmelden',
        email: 'E-Mail',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        forgotPassword: 'Passwort vergessen?',
        noAccount: 'Noch kein Account?',
        hasAccount: 'Schon registriert?',
        loginError: 'Anmeldung fehlgeschlagen',
        registerError: 'Registrierung fehlgeschlagen',
        tryDemo: 'Demo testen'
    },

    // Milestones data
    milestonesData: {
        '20min': {
            title: '20 Minuten',
            description: 'Herzfrequenz und Blutdruck normalisieren sich',
            detailedInfo: 'Bereits nach 20 Minuten beginnt dein Körper mit der Regeneration. Deine Herzfrequenz und dein Blutdruck sinken auf ein normaleres Niveau. Die Durchblutung in Händen und Füßen verbessert sich spürbar - sie werden wärmer. Dies ist der Beginn eines langen Heilungsprozesses, den du erfolgreich gestartet hast.'
        },
        '1hour': {
            title: '1 Stunde',
            description: 'Körper beginnt, Nikotin abzubauen',
            detailedInfo: 'Nach einer Stunde hat dein Körper bereits begonnen, das Nikotin aktiv abzubauen. Die Nikotinrezeptoren in deinem Gehirn beginnen sich zu normalisieren. Dein Körper startet den Entgiftungsprozess und die ersten positiven Veränderungen sind bereits in Gang gesetzt.'
        },
        '2hours': {
            title: '2 Stunden',
            description: 'Nikotinentzug kann beginnen, aber Körper erholt sich',
            detailedInfo: 'Jetzt können erste Entzugserscheinungen auftreten - das ist ein gutes Zeichen! Es zeigt, dass dein Körper das Nikotin nicht mehr hat und sich daran gewöhnen muss. Gleichzeitig arbeitet dein Kreislaufsystem bereits effizienter. Deine peripheren Nervenenden beginnen, sich zu erholen.'
        },
        '8hours': {
            title: '8 Stunden',
            description: 'Sauerstoffgehalt im Blut normalisiert sich',
            detailedInfo: 'Ein wichtiger Meilenstein! Der Sauerstoffgehalt in deinem Blut hat sich normalisiert und das gefährliche Kohlenmonoxid wird weiter abgebaut. Deine Organe werden jetzt besser mit Sauerstoff versorgt. Du wirst merken, dass Anstrengungen bereits etwas leichter fallen. Das Risiko für Herzprobleme beginnt zu sinken.'
        },
        '12hours': {
            title: '12 Stunden',
            description: 'Kohlenmonoxid-Spiegel im Blut sinkt auf normal',
            detailedInfo: 'Großartig! Das giftige Kohlenmonoxid ist nun fast vollständig aus deinem Blut verschwunden. Dein Blut kann jetzt wieder optimal Sauerstoff transportieren. Deine Organe, besonders Herz und Gehirn, profitieren von der verbesserten Sauerstoffversorgung. Du atmest buchstäblich auf!'
        },
        '24hours': {
            title: '24 Stunden',
            description: 'Herzinfarktrisiko beginnt zu sinken',
            detailedInfo: 'Ein ganzer Tag geschafft - dein Herzinfarktrisiko beginnt bereits zu sinken! Dein Herz-Kreislauf-System erholt sich merklich. Der Blutdruck stabilisiert sich weiter und dein Herz arbeitet effizienter. Die akute Belastung durch Rauchen ist vorbei. Dies ist ein bedeutender Schritt für deine langfristige Herzgesundheit.'
        },
        '2days': {
            title: '2 Tage',
            description: 'Geruchs- und Geschmackssinn verbessern sich stark',
            detailedInfo: 'Die Nervenenden in Nase und Mund beginnen sich zu regenerieren. Du wirst Gerüche und Geschmäcker wieder intensiver wahrnehmen - Essen schmeckt besser, Düfte werden klarer. Die durch Rauchen abgestumpften Sinne erwachen wieder zum Leben. Viele Ex-Raucher berichten, dass dies einer der motivierendsten Effekte ist!'
        },
        '3days': {
            title: '3 Tage',
            description: 'Nikotin vollständig aus dem Körper, Atmung wird leichter',
            detailedInfo: 'Meilenstein erreicht! Das Nikotin ist nun vollständig aus deinem Körper verschwunden. Die Bronchien beginnen sich zu entspannen und zu öffnen - das Atmen fällt merklich leichter. Deine Lungenkapazität verbessert sich bereits. Die körperliche Abhängigkeit ist auf ihrem Höhepunkt, aber ab jetzt wird es kontinuierlich besser. Du hast das Schlimmste geschafft!'
        },
        '5days': {
            title: '5 Tage',
            description: 'Körperliche Nikotinentzugssymptome lassen nach',
            detailedInfo: 'Die intensivsten Entzugserscheinungen lassen nach. Dein Körper gewöhnt sich an das Leben ohne Nikotin. Die Dopamin-Rezeptoren in deinem Gehirn beginnen sich zu normalisieren. Viele berichten von einem Gefühl der Klarheit und mehr Energie. Der Hustenreiz kann zunehmen - das ist positiv, denn deine Lungen beginnen, sich zu reinigen.'
        },
        '1week': {
            title: '1 Woche',
            description: 'Bronchien beginnen sich zu erholen',
            detailedInfo: 'Eine Woche rauchfrei - ein großer Erfolg! Deine Bronchien beginnen aktiv mit der Heilung. Die durch Rauchen verursachten Entzündungen gehen zurück. Du kannst tiefer durchatmen und hustest möglicherweise mehr - ein Zeichen dafür, dass deine Lungen den angesammelten Schleim abtransportieren. Dein Energielevel steigt merklich.'
        },
        '10days': {
            title: '10 Tage',
            description: 'Flimmerhärchen in der Lunge regenerieren sich',
            detailedInfo: 'Die Flimmerhärchen (Zilien) in deinen Atemwegen, die durch Rauchen gelähmt waren, beginnen sich zu regenerieren. Sie können nun wieder ihre wichtige Funktion erfüllen: Schleim und Schadstoffe aus der Lunge zu transportieren. Dies ist ein entscheidender Schritt für deine Lungengesundheit und Infektabwehr.'
        },
        '2weeks': {
            title: '2 Wochen',
            description: 'Kreislauf und Lungenfunktion verbessern sich merklich',
            detailedInfo: 'Zwei Wochen - dein Körper hat bereits enorme Fortschritte gemacht! Dein Kreislauf funktioniert deutlich besser, Treppen steigen fällt leichter. Die Lungenfunktion verbessert sich kontinuierlich. Sport wird zunehmend angenehmer. Viele Ex-Raucher berichten von besserem Schlaf und mehr Ausdauer im Alltag. Die psychische Abhängigkeit wird schwächer.'
        },
        '3weeks': {
            title: '3 Wochen',
            description: 'Körperliche Abhängigkeit ist überwunden',
            detailedInfo: 'Ein wichtiger psychologischer und physischer Meilenstein! Die körperliche Nikotinabhängigkeit ist weitgehend überwunden. Dein Körper verlangt nicht mehr nach Nikotin. Die Herausforderung ist nun primär psychisch - Gewohnheiten und Trigger. Aber dein Körper ist frei! Die Dopamin-Produktion normalisiert sich. Du spürst mehr echte Lebensfreude.'
        },
        '1month': {
            title: '1 Monat',
            description: 'Lungenkapazität steigt um bis zu 30%',
            detailedInfo: 'Ein ganzer Monat - fantastisch! Deine Lungenkapazität hat sich um bis zu 30% erhöht. Du kannst deutlich tiefer atmen und hast mehr Ausdauer. Die Flimmerhärchen in der Lunge arbeiten wieder effektiv und schützen dich besser vor Infektionen. Husten und Kurzatmigkeit haben merklich nachgelassen. Dein Immunsystem ist bereits stärker.'
        },
        '2months': {
            title: '2 Monate',
            description: 'Hautbild verbessert sich deutlich',
            detailedInfo: 'Deine Haut erholt sich! Die Durchblutung der Haut hat sich normalisiert, was zu einem frischeren, gesünderen Aussehen führt. Falten können sich etwas glätten, der Teint wird ebenmäßiger. Die Hautalterung verlangsamt sich. Viele berichten von einem jugendlicheren Aussehen. Die Wundheilung verbessert sich ebenfalls deutlich.'
        },
        '3months': {
            title: '3 Monate',
            description: 'Lungenfunktion verbessert sich um bis zu 10%',
            detailedInfo: 'Drei Monate rauchfrei - ein enormer Erfolg! Die Lungenfunktion hat sich um bis zu 10% verbessert und verbessert sich weiter. Husten und Kurzatmigkeit gehören zunehmend der Vergangenheit an. Das Infektionsrisiko ist gesunken. Körperliche Aktivitäten fallen deutlich leichter. Die psychische Abhängigkeit ist stark zurückgegangen. Du hast es wirklich geschafft!'
        },
        '4months': {
            title: '4 Monate',
            description: 'Immunsystem ist deutlich gestärkt',
            detailedInfo: 'Dein Immunsystem arbeitet wieder auf einem höheren Niveau. Du wirst seltener krank und erholst dich schneller von Infektionen. Die weißen Blutkörperchen funktionieren wieder optimal. Deine allgemeine Widerstandskraft gegen Krankheiten ist deutlich gestiegen. Die Energieversorgung deiner Zellen hat sich normalisiert.'
        },
        '5months': {
            title: '5 Monate',
            description: 'Ausdauer und Belastbarkeit stark verbessert',
            detailedInfo: 'Deine körperliche Leistungsfähigkeit ist auf einem neuen Level! Ausdauer und Belastbarkeit haben sich massiv verbessert. Sport macht wieder Spaß. Treppen sind kein Problem mehr. Dein Herz-Kreislauf-System arbeitet effizient. Die Sauerstoffaufnahme ist deutlich besser. Du fühlst dich fitter und vitaler als seit langem.'
        },
        '6months': {
            title: '6 Monate',
            description: 'Husten und Kurzatmigkeit lassen stark nach',
            detailedInfo: 'Ein halbes Jahr rauchfrei - unglaublich! Der chronische Raucherhusten ist weitgehend verschwunden. Kurzatmigkeit gehört der Vergangenheit an. Deine Lungen haben einen Großteil ihrer Funktion zurückgewonnen. Die Flimmerhärchen arbeiten wieder normal und schützen dich effektiv. Das Infektionsrisiko für Atemwegserkrankungen ist deutlich gesunken. Du atmest frei!'
        },
        '9months': {
            title: '9 Monate',
            description: 'Flimmerhärchen vollständig regeneriert',
            detailedInfo: 'Die Flimmerhärchen in deinen Atemwegen sind vollständig regeneriert! Sie können jetzt wieder ihre volle Schutzfunktion ausüben. Die Lunge kann Schleim und Partikel effektiv abtransportieren. Deine Anfälligkeit für Atemwegsinfekte ist auf dem Niveau von Nichtrauchern. Die Selbstreinigungskraft deiner Lungen ist wiederhergestellt. Ein medizinischer Meilenstein!'
        },
        '1year': {
            title: '1 Jahr',
            description: 'Herzinfarktrisiko ist halb so hoch wie bei Rauchern',
            detailedInfo: 'Ein ganzes Jahr rauchfrei - du bist ein Champion! Dein Herzinfarktrisiko hat sich halbiert im Vergleich zu einem Raucher. Die Blutgefäße haben sich erholt, Verkalkungen gehen zurück. Dein Herz arbeitet effizienter und ist weniger belastet. Das Schlaganfallrisiko sinkt ebenfalls deutlich. Dies ist ein gewaltiger Schritt für deine langfristige Gesundheit und Lebenserwartung!'
        },
        '18months': {
            title: '18 Monate',
            description: 'Lungenfunktion nahezu normalisiert',
            detailedInfo: 'Deine Lungenfunktion hat sich nahezu vollständig normalisiert! Die Leistungsfähigkeit deiner Lungen entspricht fast der eines Nichtrauchers. Strukturelle Schäden heilen weiter. Die Lungenbläschen (Alveolen) haben sich teilweise regeneriert. Deine Atemkapazität ist deutlich gestiegen. Sportliche Höchstleistungen sind wieder möglich.'
        },
        '2years': {
            title: '2 Jahre',
            description: 'Herz-Kreislauf-System erheblich erholt',
            detailedInfo: 'Zwei Jahre rauchfrei - beeindruckend! Dein Herz-Kreislauf-System hat sich erheblich erholt. Die Gefäßwände sind elastischer, die Durchblutung ist optimal. Das Risiko für koronare Herzkrankheit sinkt kontinuierlich. Blutdruck und Puls haben sich dauerhaft normalisiert. Die Belastbarkeit deines Herzens hat sich deutlich verbessert. Deine Lebensqualität und -erwartung sind erheblich gestiegen.'
        },
        '3years': {
            title: '3 Jahre',
            description: 'Herzkrankheitsrisiko deutlich reduziert',
            detailedInfo: 'Drei Jahre - ein großartiger Meilenstein! Dein Risiko für Herzkrankheiten hat sich dem eines Nichtrauchers stark angenähert. Die Koronararterien sind deutlich gesünder. Gefäßablagerungen (Arteriosklerose) werden abgebaut. Die Herzmuskelversorgung ist optimal. Das Risiko für Herzrhythmusstörungen ist gesunken. Dein Herz ist deutlich jünger geworden!'
        },
        '5years': {
            title: '5 Jahre',
            description: 'Schlaganfallrisiko wie bei Nichtrauchern',
            detailedInfo: 'Fünf Jahre rauchfrei - eine unglaubliche Leistung! Dein Schlaganfallrisiko ist jetzt auf dem gleichen Niveau wie bei Menschen, die nie geraucht haben. Die Blutgefäße im Gehirn sind gesund. Das Risiko für Herzerkrankungen hat sich weiter deutlich reduziert. Auch das Risiko für verschiedene Krebsarten ist erheblich gesunken. Du hast dir Jahre zusätzliches Leben geschenkt!'
        },
        '10years': {
            title: '10 Jahre',
            description: 'Lungenkrebsrisiko halbiert sich',
            detailedInfo: 'Zehn Jahre rauchfrei - du bist eine absolute Legende! Dein Lungenkrebsrisiko hat sich halbiert im Vergleich zu jemandem, der weitergeraucht hätte. Das Risiko für andere Krebsarten (Mund, Rachen, Speiseröhre, Bauchspeicheldrüse, Blase) ist ebenfalls deutlich gesunken. Deine Lungen haben sich maximal regeneriert. Die Lebenserwartung hat sich erheblich erhöht. Du hast eine beispiellose gesundheitliche Transformation vollzogen!'
        },
        '15years': {
            title: '15 Jahre',
            description: 'Herzerkrankungsrisiko wie bei Nichtrauchern',
            detailedInfo: 'Fünfzehn Jahre rauchfrei - unvorstellbar großartig! Dein Risiko für koronare Herzkrankheiten entspricht nun dem eines lebenslangen Nichtrauchers. Dein Herz-Kreislauf-System ist vollständig erholt. Die durch Rauchen verursachten Schäden sind weitgehend rückgängig gemacht. Deine Gesundheit und Lebenserwartung haben sich dramatisch verbessert. Du bist ein leuchtendes Beispiel für die Kraft der Entscheidung!'
        },
        '20years': {
            title: '20 Jahre',
            description: 'Gesundheitsrisiken fast wie bei lebenslangen Nichtrauchern',
            detailedInfo: 'Zwanzig Jahre rauchfrei - du hast Geschichte geschrieben! Deine gesundheitlichen Risiken sind jetzt nahezu identisch mit denen von Menschen, die niemals geraucht haben. Die meisten durch Rauchen verursachten Schäden sind vollständig geheilt. Dein Körper hat eine komplette Transformation durchlaufen. Du hast dir Jahrzehnte zusätzliches, gesundes Leben geschenkt. Dies ist der ultimative Triumph über die Sucht und ein Testament an menschliche Willenskraft und Regenerationsfähigkeit!'
        }
    },

    // Achievements data
    achievements: {
        // Time-based
        first_hour: { title: 'Erste Stunde', description: '60 Minuten stark!' },
        first_day: { title: 'Erster Tag', description: '24 Stunden rauchfrei' },
        two_days: { title: 'Zwei Tage', description: '48 Stunden geschafft' },
        three_days: { title: 'Durchbruch', description: '3 Tage geschafft' },
        five_days: { title: 'Fünf Tage', description: 'Fast eine Woche!' },
        one_week: { title: 'Eine Woche', description: '7 Tage stark' },
        ten_days: { title: 'Zehn Tage', description: 'Zweistellig!' },
        two_weeks: { title: 'Zweite Woche', description: '14 Tage frei' },
        three_weeks: { title: 'Drei Wochen', description: '21 Tage Power' },
        one_month: { title: 'Ein Monat', description: '30 Tage Erfolg' },
        forty_days: { title: 'Vierzig Tage', description: 'Fantastisch!' },
        fifty_days: { title: 'Champion', description: '50 Tage durch' },
        two_months: { title: 'Zwei Monate', description: '60 Tage stark' },
        seventy_days: { title: 'Siebzig Tage', description: 'Unaufhaltbar!' },
        three_months: { title: 'Drei Monate', description: '90 Tage Freiheit' },
        hundred_days: { title: 'Hundert Tage', description: '100 Tage Freiheit' },
        four_months: { title: 'Vier Monate', description: '120 Tage stark' },
        five_months: { title: 'Fünf Monate', description: '150 Tage durch' },
        six_months: { title: 'Halbjahr', description: '6 Monate stark' },
        seven_months: { title: 'Sieben Monate', description: '210 Tage Erfolg' },
        nine_months: { title: 'Neun Monate', description: '270 Tage frei' },
        ten_months: { title: 'Zehn Monate', description: '300 Tage Power' },
        one_year: { title: 'Ein Jahr', description: '365 Tage Erfolg' },
        five_hundred: { title: 'Fünfhundert', description: '500 Tage Legende' },
        two_years: { title: 'Zwei Jahre', description: '730 Tage frei' },
        thousand: { title: 'Tausend Tage', description: 'Absolute Legende!' },
        three_years: { title: 'Drei Jahre', description: '1095 Tage stark' },
        five_years: { title: 'Fünf Jahre', description: '1825 Tage Meister' },
        ten_years: { title: 'Zehn Jahre', description: 'Absolute Ikone!' },

        // Money-based
        save_50: { title: 'Erste 50€', description: '50€ gespart' },
        save_100: { title: 'Hundert Euro', description: '100€ gespart' },
        save_250: { title: 'Vierteljahresgehalt', description: '250€ gespart' },
        save_500: { title: 'Sparer', description: '500€ gespart' },
        save_750: { title: 'Dreiviertel', description: '750€ gespart' },
        save_1000: { title: 'Geldmagnet', description: '1000€ gespart' },
        save_1500: { title: 'Sparschwein', description: '1500€ gespart' },
        save_2000: { title: 'Zweitausend', description: '2000€ gespart' },
        save_3000: { title: 'Vermögensaufbau', description: '3000€ gespart' },
        save_5000: { title: 'Fünftausend', description: '5000€ gespart' },
        save_10000: { title: 'Zehntausend', description: '10000€ gespart!' },

        // Cigarettes-based
        cigs_10: { title: 'Erste Zehn', description: '10 nicht geraucht' },
        cigs_50: { title: 'Fünfzig weg', description: '50 nicht geraucht' },
        cigs_100: { title: 'Zähler', description: '100 nicht geraucht' },
        cigs_250: { title: 'Viertelpack', description: '250 nicht geraucht' },
        cigs_500: { title: 'Fünfhundert', description: '500 nicht geraucht' },
        cigs_1000: { title: 'Meister', description: '1000 nicht geraucht' },
        cigs_2000: { title: 'Zweitausend', description: '2000 nicht geraucht' },
        cigs_5000: { title: 'Fünftausend', description: '5000 nicht geraucht' },
        cigs_10000: { title: 'Zehntausend', description: '10000 nicht geraucht!' },

        // Life hours
        life_1h: { title: 'Erste Stunde', description: '1 Stunde Leben gewonnen' },
        life_12h: { title: 'Halber Tag', description: '12 Stunden Leben gewonnen' },
        life_24h: { title: 'Ein Tag Leben', description: '24 Stunden Leben gewonnen' },
        life_48h: { title: 'Zwei Tage Leben', description: '48 Stunden Leben gewonnen' },
        life_100h: { title: 'Hundert Stunden', description: '100 Stunden Leben gewonnen' },
        life_1w: { title: 'Eine Woche Leben', description: '168 Stunden Leben gewonnen' },
        life_500h: { title: 'Fünfhundert Stunden', description: '500 Stunden Leben gewonnen' },
        life_1000h: { title: 'Tausend Stunden', description: '1000 Stunden Leben gewonnen' },

        // Lung health
        lung_5: { title: 'Erste Erholung', description: '5% Lungengesundheit' },
        lung_10: { title: 'Atme auf', description: '10% Lungengesundheit' },
        lung_25: { title: 'Viertel Weg', description: '25% Lungengesundheit' },
        lung_50: { title: 'Halbzeit', description: '50% Lungengesundheit' },
        lung_75: { title: 'Fast da', description: '75% Lungengesundheit' },
        lung_90: { title: 'Bergluft', description: '90% Lungengesundheit' },

        // Water saved
        water_100: { title: 'Erste Tropfen', description: '100 Liter Wasser gespart' },
        water_500: { title: 'Dusche gespart', description: '500 Liter Wasser gespart' },
        water_1000: { title: 'Badewanne voll', description: '1000 Liter Wasser gespart' },
        water_5000: { title: 'Kleiner Pool', description: '5000 Liter Wasser gespart' },
        water_10000: { title: 'Wasserheld', description: '10000 Liter Wasser gespart' },

        // CO2
        co2_1: { title: 'Grüner Start', description: '1 kg CO₂ vermieden' },
        co2_5: { title: 'Baumpfleger', description: '5 kg CO₂ vermieden' },
        co2_10: { title: 'Waldfreund', description: '10 kg CO₂ vermieden' },
        co2_25: { title: 'Naturschützer', description: '25 kg CO₂ vermieden' },
        co2_50: { title: 'Klimaheld', description: '50 kg CO₂ vermieden' },
        co2_100: { title: 'Erdbewahrer', description: '100 kg CO₂ vermieden' },

        // Time saved
        time_10h: { title: 'Zehn Stunden', description: '10 Stunden Zeit gespart' },
        time_24h: { title: 'Ein Tag Zeit', description: '24 Stunden Zeit gespart' },
        time_50h: { title: 'Fünfzig Stunden', description: '50 Stunden Zeit gespart' },
        time_100h: { title: 'Hundert Stunden', description: '100 Stunden Zeit gespart' },
        time_168h: { title: 'Eine Woche Zeit', description: '168 Stunden Zeit gespart' },
        time_500h: { title: 'Fünfhundert Stunden', description: '500 Stunden Zeit gespart' }
    },

    // Motivations
    motivations: [
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
    ],

    // Quit statistics
    quitStatistics: {
        day1: '85% geben in den ersten 24 Stunden auf',
        day3: '90% schaffen nicht die ersten 3 Tage',
        week1: '95% scheitern in der ersten Woche',
        month1: '97% geben im ersten Monat auf',
        month3: 'Nur 2% schaffen 3 Monate',
        month6: 'Nur 1% erreichen 6 Monate',
        year1: 'Du gehörst zu den Top 0.5%!'
    },

    // Landing page
    landing: {
        hero: {
            title: 'Werde rauchfrei.',
            titleHighlight: 'Für immer.',
            subtitle: 'Die kostenlose App, die dich beim Aufhören begleitet. Wissenschaftlich fundiert, ohne Werbung, ohne versteckte Kosten.',
            cta: 'Jetzt starten',
            demo: 'Oder erst mal testen'
        },
        features: {
            title: 'Alles, was du brauchst',
            subtitle: 'Wissenschaftlich fundierte Features für deinen Erfolg',
            healthTracking: {
                title: 'Gesundheits-Tracking',
                description: 'Verfolge, wie sich dein Körper Tag für Tag erholt'
            },
            savings: {
                title: 'Ersparnis-Rechner',
                description: 'Sieh, wie viel Geld du bereits gespart hast'
            },
            milestones: {
                title: 'Meilensteine',
                description: '28 wissenschaftliche Gesundheitsmeilensteine'
            },
            sosHelp: {
                title: 'SOS-Hilfe',
                description: 'Atemübungen und Spiele gegen akutes Verlangen'
            },
            statistics: {
                title: 'Detaillierte Statistiken',
                description: 'Health Score und Fortschrittsanalysen'
            },
            privacy: {
                title: 'Datenschutz',
                description: 'Deine Daten gehören dir. Keine Werbung, kein Tracking.'
            },
            offline: {
                title: 'Offline verfügbar',
                description: 'Funktioniert auch ohne Internetverbindung'
            },
            free: {
                title: '100% Kostenlos',
                description: 'Keine versteckten Kosten, keine Premium-Version'
            }
        },
        howItWorks: {
            title: 'So funktioniert\'s',
            step1: {
                title: 'Registrieren',
                description: 'Erstelle kostenlos einen Account'
            },
            step2: {
                title: 'Einrichten',
                description: 'Gib dein Aufhördatum und deine Rauchgewohnheiten an'
            },
            step3: {
                title: 'Durchhalten',
                description: 'Verfolge deinen Fortschritt und bleib motiviert'
            }
        },
        stats: {
            title: 'Wusstest du schon?',
            cigarettesPerYear: 'Zigaretten raucht ein durchschnittlicher Raucher pro Jahr',
            costPerYear: 'gibt ein Raucher durchschnittlich pro Jahr aus',
            lifeYearsLost: 'Lebensjahre verliert ein Raucher im Durchschnitt'
        },
        cta: {
            title: 'Bereit für dein rauchfreies Leben?',
            subtitle: 'Tausende haben es geschafft. Du kannst das auch.',
            button: 'Kostenlos starten'
        },
        footer: {
            privacy: 'Datenschutz',
            imprint: 'Impressum',
            sources: 'Quellen',
            github: 'GitHub'
        }
    },

    // Notifications
    notifications: {
        enableNotifications: 'Benachrichtigungen aktivieren',
        alerts: {
            notSupported: 'Dein Browser unterstützt keine Push-Benachrichtigungen.',
            blocked: 'Du hast Benachrichtigungen blockiert. Bitte aktiviere sie in deinen Browser-Einstellungen.'
        },
        milestoneReached: 'Meilenstein erreicht!',
        dailyMotivation: 'Tägliche Motivation',
        motivation: {
            success: 'Jeder rauchfreie Tag ist ein Erfolg!',
            stronger: 'Du bist stärker als dein Verlangen!',
            health: 'Deine Gesundheit dankt es dir!',
            easier: 'Bleib dran - es wird jeden Tag leichter!',
            future: 'Du investierst in deine Zukunft!',
            proud: 'Stolz auf dich - weiter so!',
            lungs: 'Deine Lunge regeneriert sich jeden Tag mehr!',
            roleModel: 'Du bist ein Vorbild für andere!',
            freedom: 'Freiheit statt Abhängigkeit - du schaffst das!'
        },
        testSuccess: 'Benachrichtigungen funktionieren!'
    },

    // Mini Games
    miniGames: {
        title: 'Ablenkungsspiele',
        intro: 'Lenke dich für ein paar Minuten ab!',
        tap: {
            description: 'Tippe auf die Ziele!',
            fullDesc: 'Tippe auf die Ziele so schnell wie möglich!',
            hint: 'Tippe auf die Kreise!'
        },
        breathe: {
            title: 'Atem-Trainer',
            desc: 'Folge dem Rhythmus und atme tief durch.',
            instruction: 'Atme ein...',
            breaths: 'Atemzüge',
            relaxed: 'Entspannt!',
            feelBetter: 'Du hast 5 tiefe Atemzüge gemacht. Fühlst du dich besser?'
        },
        memory: {
            description: 'Finde die Paare!',
            fullDesc: 'Finde die passenden Paare!',
            moves: 'Züge',
            found: 'Gefunden'
        },
        labels: {
            points: 'Punkte',
            time: 'Zeit'
        },
        results: {
            incredible: 'Unglaublich! Du bist ein Profi!',
            veryGood: 'Sehr gut gemacht!',
            goodWork: 'Gute Arbeit!',
            keepPracticing: 'Weiter üben!',
            perfect: 'Perfekt! Unglaubliches Gedächtnis!',
            practiceMoreMemory: 'Übung macht den Meister!'
        },
        done: 'Geschafft!',
        playAgain: 'Nochmal spielen',
        otherGames: 'Andere Spiele'
    },

    // Weekly Summary
    weeklySummary: {
        title: 'Dein Wochenrückblick',
        saved: 'gespart',
        avoided: 'Zigaretten vermieden',
        cravingsOvercome: 'Cravings überwunden',
        totalDays: 'Tage rauchfrei insgesamt',
        message: 'Weiter so - du machst das großartig!',
        button: 'Alles klar!'
    },

    // Progress Goals
    progressGoals: {
        saveGoals: 'Ziele speichern',
        clickToEdit: 'Klicken zum Bearbeiten',
        days: 'Tage',
        cigarettes: 'Zigaretten',
        editDaysGoal: 'Tage-Ziel bearbeiten',
        editMoneyGoal: 'Geld-Ziel bearbeiten',
        editCigarettesGoal: 'Zigaretten-Ziel bearbeiten',
        newGoal: 'Neues Ziel:',
        cancel: 'Abbrechen',
        save: 'Speichern',
        invalidValue: 'Bitte gib einen gültigen Wert zwischen 1 und 100.000 ein.'
    },

    // Breathing Exercises
    breathingExercises: {
        inhale: 'Einatmen',
        exhale: 'Ausatmen',
        hold: 'Halten',
        cycle: 'Zyklus {current} von {total}',
        done: 'Geschafft!',
        completed: 'Du hast die Übung abgeschlossen',
        box: {
            description: 'Gleichmäßige Atmung für Balance und Fokus',
            totalTime: '~2 Minuten',
            benefits: 'Reduziert Stress, verbessert Konzentration'
        },
        '478': {
            name: '4-7-8 Technik',
            description: 'Beruhigende Atmung für Entspannung',
            totalTime: '~2.5 Minuten',
            benefits: 'Hilft beim Einschlafen, reduziert Angst'
        }
    },

    // Charts
    charts: {
        moneySaved: 'Geld gespart (€)',
        cigarettesNotSmoked: 'Zigaretten nicht geraucht',
        euroAxis: 'Euro (€)',
        cigarettesAxis: 'Zigaretten'
    },

    // Craving Stats
    cravingStats: {
        trend: {
            decreasing: 'Trend: Abnehmend',
            increasing: 'Trend: Zunehmend',
            stable: 'Trend: Stabil'
        },
        todayOvercome: 'Heute überwunden',
        avgPerDay: 'Ø pro Tag (7 Tage)',
        total30Days: 'Gesamt (30 Tage)',
        loadError: 'Statistiken konnten nicht geladen werden.',
        chartLabel: 'Überwundene Cravings'
    },

    // Days of week (short)
    weekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],

    // Months
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
};
